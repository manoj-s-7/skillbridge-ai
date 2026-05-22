"""Roadmap schemas."""

from pydantic import BaseModel
from typing import List, Optional


class RoadmapRequest(BaseModel):
    target_role: str
    duration_weeks: int = 12


class WeeklyTask(BaseModel):
    week: int
    title: str
    tasks: List[str]
    resources: List[str]
    milestone: Optional[str] = None


class RoadmapResponse(BaseModel):
    roadmap_id: str
    target_role: str
    duration_weeks: int
    weekly_plan: List[WeeklyTask]
    monthly_summary: List[str]
    key_milestones: List[str]
    created_at: str
