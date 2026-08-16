from fastapi import APIRouter, Depends, HTTPException
from backend.gateway.firebase_auth import verify_firebase_token
from backend.models.schemas import IntakeRequest, IntakeResponse
from backend.agents.intake_agent import process_intake

router = APIRouter(prefix="/api/intake", tags=["Intake"])

@router.post("", response_model=IntakeResponse)
async def submit_intake(
    request: IntakeRequest,
    uid: str = Depends(verify_firebase_token)
):
    """
    Submits student intake details, triggers AI intake evaluation, and creates initial roadmap.
    """
    try:
        result = process_intake(request)
        student_profile = {
            "department": request.department,
            "year_of_study": request.year_of_study,
            "career_goal": request.career_goal,
            "preferred_language": request.preferred_language,
            "skill_ratings": [s.model_dump() for s in request.skill_ratings]
        }

        return IntakeResponse(
            uid=uid,
            student_profile=student_profile,
            initial_skills_assessment=result["assessment"],
            roadmap=result["roadmap"],
            recommended_roles=result["recommended_roles"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intake processing error: {str(e)}")
