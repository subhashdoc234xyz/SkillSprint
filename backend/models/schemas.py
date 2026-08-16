from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SkillRating(BaseModel):
    skill: str
    level: int = Field(..., ge=1, le=5)

class IntakeRequest(BaseModel):
    department: str
    year_of_study: str
    career_goal: str
    skill_ratings: List[SkillRating]
    preferred_language: str = "English"

class SkillNode(BaseModel):
    id: str
    title: str
    description: str
    category: str
    status: str = "locked"  # locked, in_progress, completed
    xp_reward: int = 100
    estimated_hours: int = 10
    prerequisites: List[str] = []

class IntakeResponse(BaseModel):
    uid: str
    student_profile: Dict[str, Any]
    initial_skills_assessment: str
    roadmap: List[SkillNode]
    recommended_roles: List[str]

class RoadmapRequest(BaseModel):
    target_role: Optional[str] = None
    language: str = "English"

class JobGapAnalysis(BaseModel):
    target_role: str
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    action_items: List[str]

class RoadmapResponse(BaseModel):
    uid: str
    nodes: List[SkillNode]
    job_gap_analysis: Optional[JobGapAnalysis] = None

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"
    language: str = "English" # "English" or "Tamil"
    chat_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    language: str
    suggested_actions: List[str] = []

class ProgressUpdateRequest(BaseModel):
    skill_id: str
    completed: bool = True

class ProgressResponse(BaseModel):
    uid: str
    total_xp: int
    level: int
    streak_days: int
    completed_skills: List[str]
    recent_badge: Optional[str] = None
