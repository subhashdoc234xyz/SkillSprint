from typing import List, Dict, Any
from backend.gateway.groq_key_manager import groq_manager
from backend.models.schemas import ChatMessage, ChatResponse

ENGLISH_SYSTEM_PROMPT = """
You are SkillSprint AI Mentor, an empathetic, highly intelligent career mentor for engineering students.
Provide structured, encouraging, and clear guidance for engineering career paths, technical learning, interviews, and project ideas.
Keep your responses engaging, concise, and formatted with clean Markdown bullet points when appropriate.
"""

TAMIL_SYSTEM_PROMPT = """
You are SkillSprint AI Mentor, a supportive bilingual engineering career guide speaking in Tamil (or Tanglish if helpful).
Help Tamil-speaking engineering students understand technical concepts, career advice, and interview preparation clearly.
Ensure tone is supportive, warm, and highly informative.
"""

def generate_mentor_response(
    message: str,
    language: str = "English",
    chat_history: List[ChatMessage] = None
) -> ChatResponse:
    system_prompt = TAMIL_SYSTEM_PROMPT if language.lower() == "tamil" else ENGLISH_SYSTEM_PROMPT

    history_context = ""
    if chat_history:
        recent_history = chat_history[-6:]
        history_context = "Recent conversation context:\n" + "\n".join(
            [f"{msg.role.capitalize()}: {msg.content}" for msg.role in [msg for msg in recent_history]]
        ) + "\n\n"

    prompt = f"{history_context}Student Question: {message}\n\nProvide mentor guidance in {language}:"

    try:
        reply = groq_manager.generate(
            prompt=prompt,
            agent_name="mentor_agent",
            system_prompt=system_prompt,
            temperature=0.7
        )
    except Exception as e:
        if language.lower() == "tamil":
            reply = "வணக்கம்! தொழில்நுட்ப கோளாறு காரணமாக என்னால் உடனடியாக பதில் அளிக்க முடியவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
        else:
            reply = "Hello! I am having trouble connecting to my knowledge base right now. Please ask your question again in a moment."

    suggested_actions = [
        "How do I prepare for technical interviews?",
        "What capstone project should I build for my resume?",
        "How do I improve my problem solving skills?"
    ] if language.lower() != "tamil" else [
        "தொழில்நுட்ப நேர்காணலுக்கு எவ்வாறு தயாராவது?",
        "எனது ரெஸூமேக்கு என்ன பிராஜெக்ட் செய்யலாம்?",
        "கோடிங் திறனை எவ்வாறு மேம்படுத்துவது?"
    ]

    return ChatResponse(
        reply=reply,
        language=language,
        suggested_actions=suggested_actions
    )
