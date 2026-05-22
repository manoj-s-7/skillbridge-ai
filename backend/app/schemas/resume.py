"""Resume analysis schemas."""

from pydantic import BaseModel
from typing import List, Optional


class ResumeAnalysisResponse(BaseModel):
    resume_id: str
    file_name: str
    raw_text: Optional[str] = None
    parsed_data: dict  # name, education, skills, projects, experience, achievements
    ats_score: int       # 0-100
    detected_skills: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    keyword_density: dict
    created_at: str
