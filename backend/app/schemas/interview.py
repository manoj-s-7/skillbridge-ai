"""Interview generation schemas."""

from pydantic import BaseModel
from typing import List


class InterviewRequest(BaseModel):
    target_role: str
    question_types: List[str] = ["technical", "behavioral", "hr"]
    num_questions: int = 10


class InterviewQuestion(BaseModel):
    question: str
    category: str    # "technical" | "behavioral" | "hr" | "coding"
    difficulty: str  # "easy" | "medium" | "hard"
    hint: str
    model_answer: str


class InterviewResponse(BaseModel):
    interview_id: str
    target_role: str
    questions: List[InterviewQuestion]
    created_at: str
