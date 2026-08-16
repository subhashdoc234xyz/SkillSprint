import json
from typing import Dict, Any, List
from backend.gateway.groq_key_manager import groq_manager
from backend.models.schemas import IntakeRequest, SkillNode

SYSTEM_PROMPT = """
You are the SkillSprint Intake AI Agent for engineering students.
Your job is to analyze the student's branch/department, current year of study, career goals, and self-rated skill levels.
Provide an encouraging bilingual-aware evaluation and output a structured JSON evaluation.
"""

def process_intake(intake_data: IntakeRequest) -> Dict[str, Any]:
    skills_str = ", ".join([f"{s.skill}: {s.level}/5" for s in intake_data.skill_ratings])

    prompt = f"""
    Analyze this engineering student intake profile:
    - Department: {intake_data.department}
    - Year of Study: {intake_data.year_of_study}
    - Target Career Goal: {intake_data.career_goal}
    - Current Skill Ratings: {skills_str}
    - Preferred Language: {intake_data.preferred_language}

    Return a JSON object with:
    1. "assessment": A 2-3 sentence personalized summary encouraging the student in {intake_data.preferred_language}.
    2. "recommended_roles": Array of 3 specific job titles matching their goal.
    3. "recommended_skills": Array of 5 key skills they need to master.
    """

    try:
        response_text = groq_manager.generate(
            prompt=prompt,
            agent_name="intake_agent",
            system_prompt=SYSTEM_PROMPT,
            temperature=0.6
        )

        # Parse JSON or construct fallback if output is freeform
        if "{" in response_text and "}" in response_text:
            json_str = response_text[response_text.find("{"):response_text.rfind("}")+1]
            data = json.loads(json_str)
            assessment = data.get("assessment", "Your intake profile has been processed. Great start on your journey!")
            roles = data.get("recommended_roles", [intake_data.career_goal, "Software Engineer", "Systems Architect"])
            skills = data.get("recommended_skills", ["Data Structures", "Web Development", "Cloud Basics", "APIs", "System Design"])
        else:
            assessment = response_text
            roles = [intake_data.career_goal, "Full Stack Engineer", "Solutions Architect"]
            skills = ["Data Structures", "Frontend Frameworks", "Backend APIs", "Database Design", "Git & CI/CD"]
    except Exception as e:
        assessment = f"Welcome to SkillSprint! We have analyzed your goal ({intake_data.career_goal}) for {intake_data.department} Year {intake_data.year_of_study}. Let's build your pathway."
        roles = [intake_data.career_goal, "Software Engineer", "Technical Specialist"]
        skills = ["Foundational Coding", "Problem Solving", "System Fundamentals", "Version Control", "Project Building"]

    # Generate initial roadmap nodes based on recommended skills
    roadmap = []
    statuses = ["completed", "in_progress", "locked", "locked", "locked"]
    for idx, skill in enumerate(skills):
        node = SkillNode(
            id=f"skill_{idx+1}",
            title=skill,
            description=f"Master foundational concepts and hands-on projects for {skill}.",
            category="Core Skill" if idx < 3 else "Advanced Competency",
            status=statuses[idx] if idx < len(statuses) else "locked",
            xp_reward=100 + (idx * 50),
            estimated_hours=12 + (idx * 4),
            prerequisites=[f"skill_{idx}"] if idx > 0 else []
        )
        roadmap.append(node)

    return {
        "assessment": assessment,
        "recommended_roles": roles,
        "roadmap": [node.model_dump() for node in roadmap]
    }
