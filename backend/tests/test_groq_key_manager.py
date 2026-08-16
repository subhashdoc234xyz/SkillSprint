import time
import pytest
from unittest.mock import MagicMock, patch
from backend.gateway.groq_key_manager import GroqKeyManager, AllKeysExhaustedException
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_groq_key_manager_discovery():
    env_mock = {
        "GROQ_API_KEY_1": "key_1",
        "GROQ_API_KEY_2": "key_2"
    }
    with patch.dict("os.environ", env_mock, clear=True):
        mgr = GroqKeyManager()
        assert len(mgr.keys) == 2
        assert "key_1" in mgr.keys
        assert "key_2" in mgr.keys

def test_groq_key_manager_lru_selection():
    mgr = GroqKeyManager()
    mgr.keys = ["key_a", "key_b"]
    mgr.key_states = {
        "key_a": {"available": True, "rate_limited_until": 0, "last_used": 100, "name": "A"},
        "key_b": {"available": True, "rate_limited_until": 0, "last_used": 50, "name": "B"},
    }

    # Least recently used is key_b
    selected = mgr.get_available_key()
    assert selected == "key_b"

def test_groq_key_manager_429_failover():
    mgr = GroqKeyManager()
    mgr.keys = ["key_1", "key_2"]
    mgr.key_states = {
        "key_1": {"available": True, "rate_limited_until": 0, "last_used": 10, "name": "K1"},
        "key_2": {"available": True, "rate_limited_until": 0, "last_used": 20, "name": "K2"},
    }

    # Mock requests post: first key responds 429, second responds 200
    mock_resp_429 = MagicMock()
    mock_resp_429.status_code = 429
    mock_resp_429.headers = {"retry-after": "30"}

    mock_resp_200 = MagicMock()
    mock_resp_200.status_code = 200
    mock_resp_200.json.return_value = {
        "choices": [{"message": {"content": "Success response from secondary key"}}]
    }

    with patch("requests.post", side_effect=[mock_resp_429, mock_resp_200]):
        output = mgr.generate("Test prompt")
        assert output == "Success response from secondary key"
        # Check key 1 was rate limited
        assert mgr.key_states["key_1"]["available"] is False
        assert mgr.key_states["key_1"]["rate_limited_until"] > time.time()

def test_all_keys_exhausted():
    mgr = GroqKeyManager()
    mgr.keys = ["key_1"]
    now = time.time()
    mgr.key_states = {
        "key_1": {"available": False, "rate_limited_until": now + 100, "last_used": now, "name": "K1"}
    }
    with pytest.raises(AllKeysExhaustedException):
        mgr.generate("Test prompt")

def test_intake_endpoint():
    payload = {
        "department": "Computer Science",
        "year_of_study": "3rd Year",
        "career_goal": "Cloud Architect",
        "skill_ratings": [
            {"skill": "Python", "level": 4},
            {"skill": "Docker", "level": 2}
        ],
        "preferred_language": "English"
    }
    response = client.post("/api/intake", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "roadmap" in data
    assert len(data["roadmap"]) > 0

def test_roadmap_endpoint():
    response = client.get("/api/roadmap?target_role=DevOps+Engineer")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "job_gap_analysis" in data

def test_chat_endpoint():
    payload = {
        "message": "What skills are needed for cloud computing?",
        "language": "English"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data

def test_progress_endpoints():
    get_res = client.get("/api/progress")
    assert get_res.status_code == 200
    assert "total_xp" in get_res.json()

    post_res = client.post("/api/progress/complete", json={"skill_id": "node_test_100", "completed": True})
    assert post_res.status_code == 200
    assert "node_test_100" in post_res.json()["completed_skills"]
