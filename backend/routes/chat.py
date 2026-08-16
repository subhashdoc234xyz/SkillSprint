from fastapi import APIRouter, Depends, HTTPException
from backend.gateway.firebase_auth import verify_firebase_token
from backend.models.schemas import ChatRequest, ChatResponse
from backend.agents.mentor_agent import generate_mentor_response

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_with_mentor(
    request: ChatRequest,
    uid: str = Depends(verify_firebase_token)
):
    """
    Handles interactive bilingual mentoring chat questions.
    """
    try:
        response = generate_mentor_response(
            message=request.message,
            language=request.language,
            chat_history=request.chat_history
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat mentoring error: {str(e)}")
