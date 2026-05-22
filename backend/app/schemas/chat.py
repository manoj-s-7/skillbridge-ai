"""Chat / mentor schemas."""

from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str       # "user" | "assistant"
    content: str
    timestamp: Optional[str] = None


class MentorChatRequest(BaseModel):
    message: str
    context_window: int = 10   # last N messages to send as context


class MentorChatResponse(BaseModel):
    reply: str
    session_id: str
    model_used: str             # "gemini" | "groq"
