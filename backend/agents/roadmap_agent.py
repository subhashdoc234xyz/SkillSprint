import json
from typing import List, Dict, Any
from backend.gateway.groq_key_manager import groq_manager
from backend.models.schemas import SkillNode

SYSTEM_PROMPT = """
You are the SkillSprint Roadmap AI Agent.
Generate structured learning pathways as skill nodes for engineering students based on target engineering roles.
"""

def generate_roadmap(department: str, target_role: str, language: str = "English") -> List[SkillNode]:
    prompt = f"""
    Create a 5-step skill progression roadmap for a {department} student aspiring to be a {target_role}.
    Language preference: {language}.

    Return ONLY a JSON list of 5 objects, each having:
    - id: string (e.g., "node_1")
    - title: string
    - description: string
    - category: string ("Fundamentals", "Core", "Advanced", "Specialization", "Capstone")
    - estimated_hours: integer
    - xp_reward: integer
    """

    try:
        response_text = groq_manager.generate(
            prompt=prompt,
            agent_name="roadmap_agent",
            system_prompt=SYSTEM_PROMPT
        )
        if "[" in response_text and "]" in response_text:
            json_str = response_text[response_text.find("["):response_text.rfind("]")+1]
            raw_nodes = json.loads(json_str)
            nodes = []
            for idx, item in enumerate(raw_nodes):
                nodes.append(SkillNode(
                    id=item.get("id", f"node_{idx+1}"),
                    title=item.get("title", f"Skill Stage {idx+1}"),
                    description=item.get("description", f"Learn key competencies for {target_role}."),
                    category=item.get("category", "Core Skill"),
                    status="in_progress" if idx == 0 else "locked",
                    xp_reward=item.get("xp_reward", 150 + idx * 50),
                    estimated_hours=item.get("estimated_hours", 10 + idx * 5),
                    prerequisites=[f"node_{idx}"] if idx > 0 else []
                ))
            return nodes
    except Exception:
        pass

    # Fallback default roadmap
    default_titles = [
        "Language & Data Structure Fundamentals",
        "Frameworks & API Development",
        "Database Design & System Architecture",
        "DevOps, Deployment & Cloud Basics",
        "Industry Capstone Project & Portfolio"
    ]
    nodes = []
    for idx, title in enumerate(default_titles):
        nodes.append(SkillNode(
            id=f"node_{idx+1}",
            title=title,
            description=f"Comprehensive module covering {title} tailored for {target_role}.",
            category="Core Skill" if idx < 3 else "Advanced Competency",
            status="completed" if idx == 0 else ("in_progress" if idx == 1 else "locked"),
            xp_reward=150 + (idx * 50),
            estimated_hours=15 + (idx * 5),
            prerequisites=[f"node_{idx}"] if idx > 0 else []
        ))
    return nodes
