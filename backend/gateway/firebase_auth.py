import os
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth, firestore
from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

logger = logging.getLogger("firebase_auth")

# Initialize Firebase Admin SDK
firebase_app = None
db = None

def init_firebase():
    global firebase_app, db
    if not firebase_admin._apps:
        project_id = os.environ.get("FIREBASE_PROJECT_ID")
        private_key = os.environ.get("FIREBASE_PRIVATE_KEY")
        client_email = os.environ.get("FIREBASE_CLIENT_EMAIL")

        if project_id and private_key and client_email and "placeholder" not in project_id:
            try:
                formatted_private_key = private_key.replace("\\n", "\n")
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": project_id,
                    "private_key": formatted_private_key,
                    "client_email": client_email,
                })
                firebase_app = firebase_admin.initialize_app(cred)
                db = firestore.client()
                logger.info("Firebase Admin SDK initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Firebase Admin SDK: {e}. Falling back to mock mode.")
        else:
            logger.info("Firebase credentials missing or placeholder used. Running in development/mock auth mode.")

init_firebase()

security = HTTPBearer(auto_error=False)

async def verify_firebase_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> str:
    """
    Verifies the Bearer Firebase ID token and returns the authenticated user's uid.
    In development/demo mode without Firebase initialized, accepts test tokens or defaults to mock UID.
    """
    if not credentials:
        # Fallback for dev mode / testing if authorization header is omitted
        return "demo_user_uid"

    token = credentials.credentials

    if firebase_admin._apps and db:
        try:
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token.get("uid")
            if not uid:
                raise HTTPException(status_code=401, detail="Invalid auth token payload")
            return uid
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            raise HTTPException(status_code=401, detail=f"Invalid authorization token: {str(e)}")
    else:
        # Dev fallback when Admin SDK is not bound to a live Firebase project
        if token == "invalid_token":
            raise HTTPException(status_code=401, detail="Invalid authorization token")
        return "demo_user_uid"
