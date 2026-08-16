Project: SkillSprint — an AI-powered bilingual (Tamil/English) career mentor for engineering 
students, built with React (Vite) + Tailwind CSS on the frontend, FastAPI on the backend, 
Firebase Auth + Firestore for data, and LLaMA 3 models via Groq API for the multi-agent AI system.

GOAL: Convert the attached Google Stitch UI export into a working, integrated React frontend, 
and wire it to a FastAPI backend with Firebase and Groq.

=== 1. PROJECT SETUP ===
- Initialize a Vite + React project in /frontend
- Initialize a FastAPI project in /backend with a clean folder structure:
  /backend
    /agents        (intake_agent.py, roadmap_agent.py, job_mapping_agent.py, mentor_agent.py, progress_agent.py)
    /gateway       (groq_key_manager.py — handles multi-key rotation and rate-limit failover)
    /routes        (intake.py, roadmap.py, chat.py, progress.py)
    /models        (Pydantic schemas)
    main.py
- Install and configure Tailwind CSS in /frontend
- Install Framer Motion in /frontend for animations
- Install firebase SDK in /frontend and firebase-admin in /backend

=== 2. ENVIRONMENT VARIABLES ===
Create a `.env.example` file in /frontend with placeholder values (no real secrets) for:
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  VITE_API_BASE_URL=http://localhost:8000

Create a `.env.example` file in /backend with placeholder values for:
  GROQ_API_KEY_1=
  GROQ_API_KEY_2=
  GROQ_API_KEY_3=
  # add as many GROQ_API_KEY_N= lines as needed — the key manager should auto-discover 
  # any env var matching the pattern GROQ_API_KEY_*
  FIREBASE_PROJECT_ID=
  FIREBASE_PRIVATE_KEY=
  FIREBASE_CLIENT_EMAIL=
  ALLOWED_ORIGINS=http://localhost:5173

Create actual `.env` files (copies of `.env.example` with placeholder values, NOT real secrets — 
I will fill in real values myself) in both /frontend and /backend.

Add `.env` to `.gitignore` in both /frontend and /backend (but keep `.env.example` tracked in git).

=== 3. GROQ KEY ROTATION GATEWAY (/backend/gateway/groq_key_manager.py) ===
- On startup, read all env vars matching GROQ_API_KEY_* into a pool
- Track per-key state: available / rate_limited_until (timestamp) / last_used
- Expose a function `generate(prompt, agent_name)` that:
  - Picks the least-recently-used available key
  - Calls the Groq API (model: llama-3.3-70b-versatile or specify)
  - On HTTP 429, marks that key rate_limited_until = now + retry-after header value, 
    and retries immediately with the next available key
  - If all keys are rate-limited, waits for the soonest one to free up, or raises a 
    clear "AllKeysExhausted" exception the route can catch and return gracefully
- All 5 agents call this single function — no agent should read GROQ_API_KEY directly

=== 4. FIREBASE INTEGRATION ===
- Frontend: initialize Firebase Auth (Google sign-in + email/password) using the 
  VITE_FIREBASE_* env vars
- Backend: initialize firebase-admin using FIREBASE_PROJECT_ID / FIREBASE_PRIVATE_KEY / 
  FIREBASE_CLIENT_EMAIL env vars, and verify the Firebase ID token on every protected 
  FastAPI route (extract uid from token, never trust a uid passed in the request body)
- Firestore schema: users/{uid}/profile, users/{uid}/roadmaps/{roadmapId}, 
  users/{uid}/chatHistory/{sessionId}, users/{uid}/progress/{skillId}, users/{uid}/metadata
- Add Firestore security rules (firestore.rules file) enforcing 
  request.auth.uid == userId on all users/{userId}/** paths

=== 5. FRONTEND PAGES (from attached Stitch export) ===
Convert the attached Stitch design into componentized React + Tailwind pages:
  - LandingPage.jsx — animated hero background (lightweight CSS/Canvas, not video), 
    scroll-reveal sections using Framer Motion
  - AuthPage.jsx — Firebase login/signup, split-screen layout as designed
  - OnboardingPage.jsx — multi-step animated form, POSTs to /api/intake, stores result via backend
  - DashboardPage.jsx — fetches roadmap from Firestore, renders as interactive skill-tree timeline
  - ChatPage.jsx — connects to /api/chat, shows typing indicator while awaiting response, 
    Tamil/English toggle
  - ProgressPage.jsx — streak calendar + XP bar, animated level-up state
Preserve exact colors, spacing, and animation intent from the Stitch export. Use Framer Motion 
for any animation the static export can't capture (hover, scroll-reveal, page transitions).

=== 6. DELIVERABLE CHECKLIST ===
- [ ] Working `npm run dev` in /frontend with no console errors
- [ ] Working `uvicorn main:app --reload` in /backend with no import errors
- [ ] .env.example files present and accurate in both folders (no real secrets committed)
- [ ] .env files present locally, gitignored
- [ ] README.md explaining how to fill in .env, get Firebase config, and get Groq API keys
- [ ] Groq key rotation tested with a mock 429 response

Attached: [paste Stitch HTML/CSS export or screenshots here]