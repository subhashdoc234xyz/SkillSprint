import os
import time
import logging
import requests
from typing import Dict, Any, List, Optional

logger = logging.getLogger("groq_key_manager")
logging.basicConfig(level=logging.INFO)

class AllKeysExhaustedException(Exception):
    """Raised when all Groq API keys in the pool are rate limited or unavailable."""
    pass

class GroqKeyManager:
    def __init__(self):
        self.keys: List[str] = []
        self.key_states: Dict[str, Dict[str, Any]] = {}
        self.reload_keys()

    def reload_keys(self):
        """Discovers all environment variables starting with GROQ_API_KEY_"""
        self.keys = []
        self.key_states = {}
        for key, value in os.environ.items():
            if key.startswith("GROQ_API_KEY_") and value and value.strip():
                api_key = value.strip()
                if api_key not in self.keys:
                    self.keys.append(api_key)
                    self.key_states[api_key] = {
                        "available": True,
                        "rate_limited_until": 0.0,
                        "last_used": 0.0,
                        "name": key
                    }
        # Fallback if GROQ_API_KEY is present without _ prefix
        if not self.keys and os.environ.get("GROQ_API_KEY"):
            api_key = os.environ.get("GROQ_API_KEY").strip()
            self.keys.append(api_key)
            self.key_states[api_key] = {
                "available": True,
                "rate_limited_until": 0.0,
                "last_used": 0.0,
                "name": "GROQ_API_KEY"
            }

        # If no real keys present in environment, set up fallback mock pool for testing/demo
        if not self.keys:
            dummy_keys = ["mock_groq_key_1", "mock_groq_key_2"]
            for idx, dkey in enumerate(dummy_keys):
                self.keys.append(dkey)
                self.key_states[dkey] = {
                    "available": True,
                    "rate_limited_until": 0.0,
                    "last_used": 0.0,
                    "name": f"GROQ_MOCK_KEY_{idx+1}"
                }

    def get_available_key(self) -> Optional[str]:
        """Picks the least-recently-used available key."""
        now = time.time()
        available_keys = []

        for k, state in self.key_states.items():
            if state["rate_limited_until"] <= now:
                state["available"] = True
                available_keys.append(k)
            else:
                state["available"] = False

        if not available_keys:
            return None

        # Sort by last_used timestamp ascending (LRU)
        available_keys.sort(key=lambda k: self.key_states[k]["last_used"])
        selected_key = available_keys[0]
        self.key_states[selected_key]["last_used"] = now
        return selected_key

    def mark_rate_limited(self, key: str, retry_after: float = 60.0):
        """Marks a key as rate-limited until now + retry_after seconds."""
        now = time.time()
        self.key_states[key]["available"] = False
        self.key_states[key]["rate_limited_until"] = now + retry_after
        logger.warning(f"Groq API Key {self.key_states[key]['name']} rate limited for {retry_after}s.")

    def generate(
        self,
        prompt: str,
        agent_name: str = "generic_agent",
        model: str = "llama-3.3-70b-versatile",
        temperature: float = 0.7,
        max_tokens: int = 2048,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Executes an LLM request via Groq API using key rotation and rate limit failover.
        """
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        max_attempts = max(len(self.keys) * 2, 3)
        attempts = 0

        while attempts < max_attempts:
            key = self.get_available_key()
            if not key:
                # Find soonest unblock time
                soonest = min((s["rate_limited_until"] for s in self.key_states.values()), default=time.time() + 5.0)
                wait_time = max(soonest - time.time(), 0.5)
                logger.warning(f"All Groq keys rate limited. Waiting {wait_time:.1f}s...")
                time.sleep(min(wait_time, 2.0)) # cap wait to prevent long hangs
                attempts += 1
                key = self.get_available_key()
                if not key and attempts >= max_attempts:
                    raise AllKeysExhaustedException("All Groq API keys are currently rate limited. Please try again later.")

            if not key:
                continue

            # Mock behavior for dev/tests if using mock key
            if key.startswith("mock_groq_key"):
                return f"[Mock Groq Output for {agent_name}]: Processed response for prompt."

            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }

            try:
                response = requests.post(url, json=payload, headers=headers, timeout=30)
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                elif response.status_code == 429:
                    retry_after = 60.0
                    retry_header = response.headers.get("retry-after") or response.headers.get("x-ratelimit-reset")
                    if retry_header:
                        try:
                            retry_after = float(retry_header)
                        except ValueError:
                            pass
                    self.mark_rate_limited(key, retry_after)
                    attempts += 1
                    continue
                else:
                    logger.error(f"Groq API error ({response.status_code}): {response.text}")
                    # Try next key on 500/503 server errors
                    if response.status_code in [500, 502, 503, 504]:
                        self.mark_rate_limited(key, 10.0)
                        attempts += 1
                        continue
                    response.raise_for_status()
            except requests.RequestException as e:
                logger.error(f"Request exception for key {self.key_states[key]['name']}: {e}")
                self.mark_rate_limited(key, 15.0)
                attempts += 1

        raise AllKeysExhaustedException("Failed to generate response after multiple key attempts.")

# Global singleton manager instance
groq_manager = GroqKeyManager()
