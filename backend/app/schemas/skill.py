"""Skill gap analysis schemas."""

from pydantic import BaseModel
from typing import List, Optional


class SkillAnalysisRequest(BaseModel):
    target_role: str
    current_skills: Optional[List[str]] = None  # overrides profile if provided


class SkillGapItem(BaseModel):
    skill: str
    priority: str   # "high" | "medium" | "low"
    resources: List[str]


class SkillAnalysisResponse(BaseModel):
    analysis_id: str
    target_role: str
    current_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[SkillGapItem]
    readiness_score: int   # 0-100
    recommendations: List[str]
    created_at: str
