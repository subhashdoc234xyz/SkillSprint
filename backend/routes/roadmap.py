from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from backend.gateway.firebase_auth import verify_firebase_token
from backend.models.schemas import RoadmapRequest, RoadmapResponse
from backend.agents.roadmap_agent import generate_roadmap
from backend.agents.job_mapping_agent import analyze_job_gap

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])

@router.get("", response_model=RoadmapResponse)
async def get_roadmap(
    target_role: Optional[str] = Query("Full Stack Engineer"),
    department: Optional[str] = Query("Computer Science Engineering"),
    language: Optional[str] = Query("English"),
    uid: str = Depends(verify_firebase_token)
):
    """
    Returns student skill tree roadmap nodes and job gap analysis.
    """
    try:
        nodes = generate_roadmap(department=department, target_role=target_role, language=language)
        completed_skills = [n.title for n in nodes if n.status == "completed"]
        job_gap = analyze_job_gap(target_role=target_role, user_skills=completed_skills)

        return RoadmapResponse(
            uid=uid,
            nodes=nodes,
            job_gap_analysis=job_gap
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")
