"""Auth request/response schemas."""

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    graduate = "graduate"
    jobseeker = "jobseeker"
    recruiter = "recruiter"
    admin = "admin"


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.student

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool
    onboarding_complete: bool
    avatar_url: Optional[str] = None
