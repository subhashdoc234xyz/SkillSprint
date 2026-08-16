from typing import Dict, Any, List
from backend.models.schemas import ProgressResponse

# In-memory progress tracking fallback for session/testing
PROGRESS_CACHE: Dict[str, Dict[str, Any]] = {}

def get_user_progress(uid: str) -> ProgressResponse:
    if uid not in PROGRESS_CACHE:
        PROGRESS_CACHE[uid] = {
            "total_xp": 350,
            "level": 3,
            "streak_days": 5,
            "completed_skills": ["skill_1", "node_1"],
            "recent_badge": "Sprint Starter 🚀"
        }

    data = PROGRESS_CACHE[uid]
    return ProgressResponse(
        uid=uid,
        total_xp=data["total_xp"],
        level=data["level"],
        streak_days=data["streak_days"],
        completed_skills=data["completed_skills"],
        recent_badge=data["recent_badge"]
    )

def update_user_progress(uid: str, skill_id: str, completed: bool = True) -> ProgressResponse:
    progress = get_user_progress(uid)

    if completed and skill_id not in PROGRESS_CACHE[uid]["completed_skills"]:
        PROGRESS_CACHE[uid]["completed_skills"].append(skill_id)
        PROGRESS_CACHE[uid]["total_xp"] += 150

        # Calculate level based on XP (every 300 XP = 1 Level)
        new_level = (PROGRESS_CACHE[uid]["total_xp"] // 300) + 1
        if new_level > PROGRESS_CACHE[uid]["level"]:
            PROGRESS_CACHE[uid]["level"] = new_level
            PROGRESS_CACHE[uid]["recent_badge"] = f"Level {new_level} Engineer ⚡"

    return get_user_progress(uid)
