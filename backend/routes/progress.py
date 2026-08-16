from fastapi import APIRouter, Depends, HTTPException
from backend.gateway.firebase_auth import verify_firebase_token
from backend.models.schemas import ProgressUpdateRequest, ProgressResponse
from backend.agents.progress_agent import get_user_progress, update_user_progress

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.get("", response_model=ProgressResponse)
async def fetch_progress(
    uid: str = Depends(verify_firebase_token)
):
    """
    Fetches user current XP, streak, completed skills, and badge level.
    """
    try:
        return get_user_progress(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch progress: {str(e)}")

@router.post("/complete", response_model=ProgressResponse)
async def complete_skill(
    request: ProgressUpdateRequest,
    uid: str = Depends(verify_firebase_token)
):
    """
    Marks a skill node completed and awards XP.
    """
    try:
        return update_user_progress(uid, skill_id=request.skill_id, completed=request.completed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update progress: {str(e)}")
