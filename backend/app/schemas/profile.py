"""Onboarding + profile schemas."""

from pydantic import BaseModel
from typing import List, Optional


class OnboardingRequest(BaseModel):
    full_name: str
    education: str  # e.g. "B.Tech Computer Science"
    institution: str
    graduation_year: int
    current_skills: List[str]
    certifications: List[str] = []
    dream_role: str
    preferred_domain: str  # e.g. "Backend", "Data Science", "Cloud"
    preferred_location: str
    salary_expectation: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
    interests: List[str] = []
    coding_preference: str = "coding"  # "coding" | "non-coding"
    company_preference: str = "both"  # "startup" | "mnc" | "both"
    experience_level: str = "fresher"  # "fresher" | "1-2 years" | "3+ years"


class ProfileResponse(BaseModel):
    user_id: str
    full_name: str
    education: str
    institution: str
    graduation_year: int
    current_skills: List[str]
    dream_role: str
    preferred_domain: str
    preferred_location: str
    experience_level: str
    onboarding_complete: bool
