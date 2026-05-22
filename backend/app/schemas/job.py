"""Job and internship schemas."""

from pydantic import BaseModel
from typing import List, Optional


class JobResponse(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    domain: str
    skills_required: List[str]
    experience_required: str
    salary_range: Optional[str]
    job_type: str          # "full-time" | "part-time" | "remote"
    description: str
    apply_url: Optional[str]
    match_score: Optional[int] = None
    match_reasons: Optional[List[str]] = None


class InternshipResponse(BaseModel):
    internship_id: str
    title: str
    company: str
    location: str
    domain: str
    skills_required: List[str]
    duration: str          # e.g. "2 months", "6 months"
    stipend: Optional[str]
    description: str
    apply_url: Optional[str]
    match_score: Optional[int] = None
    match_reasons: Optional[List[str]] = None
