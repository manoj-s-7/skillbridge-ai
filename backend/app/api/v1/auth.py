"""Auth API routes."""

from fastapi import APIRouter, Depends
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest
from app.services.auth_service import AuthService
from app.db.database import get_database

router = APIRouter()


def get_auth_service(db=Depends(get_database)) -> AuthService:
    return AuthService(db)


@router.post("/register", status_code=201)
async def register(data: RegisterRequest, service: AuthService = Depends(get_auth_service)):
    """Register a new user account."""
    return await service.register(data)


@router.post("/login")
async def login(data: LoginRequest, service: AuthService = Depends(get_auth_service)):
    """Authenticate and receive JWT tokens."""
    return await service.login(data)


@router.post("/refresh")
async def refresh(data: RefreshRequest, service: AuthService = Depends(get_auth_service)):
    """Issue new access token from refresh token."""
    return await service.refresh_tokens(data.refresh_token)


@router.post("/logout")
async def logout():
    """Client-side logout."""
    return {"message": "Logged out successfully."}


@router.post("/forgot-password")
async def forgot_password():
    return {"message": "If this email exists, a reset link has been sent."}
