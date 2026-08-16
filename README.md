# SkillSprint — AI-Powered Bilingual Career Mentor for Engineering Students

SkillSprint is an AI-powered bilingual (Tamil/English) career mentor designed for engineering students. Built with React (Vite) + Tailwind CSS + Framer Motion on the frontend, FastAPI on the backend, Firebase Auth + Firestore for data management, and LLaMA 3 models via Groq API with multi-key failover rotation.

---

## Features
- **Blue Glass UI**: Futuristic dark glassmorphism theme with cyan/blue ambient glow effects.
- **Bilingual Mentor Support**: Seamless Tamil and English AI chat mentor and customized response generation.
- **Multi-Agent AI Architecture**: Specialized agents for intake evaluation, personalized skill-tree roadmap generation, job role mapping & gap analysis, live chat mentoring, and gamified XP progress tracking.
- **Groq Key Rotation Gateway**: Automatic key rotation, least-recently-used scheduling, dynamic 429 rate limit detection, backoff handling, and automatic failover.
- **Firebase Auth & Firestore Integration**: Secure Google & Email/Password authentication, with Firestore security rules restricting access per user UID.

---

## Project Structure
```text
.
├── backend/
│   ├── agents/          # Specialized AI agents (intake, roadmap, job mapping, mentor, progress)
│   ├── gateway/         # Groq API key manager & Firebase ID token verifier
│   ├── models/          # Pydantic schemas for request/response payloads
│   ├── routes/          # FastAPI routers (/api/intake, /api/roadmap, /api/chat, /api/progress)
│   ├── tests/           # Unit and integration test suite
│   ├── main.py          # FastAPI application entrypoint
│   ├── firestore.rules  # Firestore security rules
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Navbar, GlassCard, GlowButton, ParticleCanvas, etc.)
│   │   ├── context/     # Firebase Auth context
│   │   ├── pages/       # Landing, Auth, Onboarding, Dashboard, Chat, Progress
│   │   ├── services/    # API & Firebase clients
│   │   └── App.jsx
│   └── .env.example
└── README.md
```

---

## How to Get Environmental Variable Keys

### 1. Groq API Keys (for Backend)
1. Visit the [Groq Console](https://console.groq.com/).
2. Sign in or create a free account.
3. Navigate to **API Keys** in the dashboard menu.
4. Click **Create API Key**.
5. Copy the generated API key (starts with `gsk_`).
6. You can create multiple keys (e.g. 2-3 keys) to enable the multi-key rotation and 429 failover pool feature.

### 2. Firebase Configuration & Service Account (for Frontend & Backend)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the prompts to create a new project.
3. Enable **Authentication** in the project sidebar:
   - Click **Get Started**.
   - Enable **Email/Password** sign-in method.
   - Enable **Google** sign-in method.
4. Add a Web App to your Firebase project:
   - Go to **Project Settings** > **General**.
   - Under *Your apps*, click the Web icon (`</>`).
   - Register your app and copy the `firebaseConfig` keys (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
5. Generate Firebase Admin SDK Service Account credentials (for Backend):
   - Go to **Project Settings** > **Service Accounts**.
   - Click **Generate new private key**.
   - Download the JSON service account file.
   - Extract `project_id`, `private_key`, and `client_email`.

---

## Environment Configuration

### Frontend (`/frontend/.env`)
Copy `/frontend/.env.example` to `/frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`/backend/.env`)
Copy `/backend/.env.example` to `/backend/.env`:
```env
GROQ_API_KEY_1=your_groq_api_key_1
GROQ_API_KEY_2=your_groq_api_key_2
GROQ_API_KEY_3=your_groq_api_key_3
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Running the Application Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Running the Backend (FastAPI)
```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt # or pip install fastapi uvicorn pydantic firebase-admin requests httpx pytest python-dotenv

# Start the uvicorn development server
python -m uvicorn main:app --reload --port 8000
```
The API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Running Backend Tests
```bash
cd backend
PYTHONPATH=. pytest tests/
```

### 3. Running the Frontend (React + Vite)
```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment on Render

### Deploying the Backend (Web Service)

1. Sign in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service settings:
   - **Name**: `skillsprint-backend`
   - **Root Directory**: `backend`
   - **Environment / Language**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
     *(Or if `requirements.txt` is not created: `pip install fastapi uvicorn pydantic firebase-admin requests httpx python-dotenv`)*
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
5. Add Environment Variables in Render:
   - `GROQ_API_KEY_1`: Your Groq API key
   - `GROQ_API_KEY_2`: Optional secondary Groq API key
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_PRIVATE_KEY`: Your Firebase private key
   - `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email
   - `ALLOWED_ORIGINS`: Your deployed frontend URL (e.g. `https://skillsprint-frontend.onrender.com`)
6. Click **Create Web Service**. Note the deployed backend URL (e.g. `https://skillsprint-backend.onrender.com`).

---

### Deploying the Frontend (Static Site)

1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect your Git repository.
3. Configure the Static Site settings:
   - **Name**: `skillsprint-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`
4. Add Environment Variables in Render:
   - `VITE_FIREBASE_API_KEY`: Your Firebase API Key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase App ID
   - `VITE_API_BASE_URL`: Your deployed Render backend URL (e.g. `https://skillsprint-backend.onrender.com`)
5. Click **Create Static Site**.
6. Set up Rewrite Rules for Single Page Application (SPA):
   - Go to **Redirects/Rewrites** in the Render static site settings.
   - Add rule: Source `/*` -> Destination `/index.html` (Action: `Rewrite`).
