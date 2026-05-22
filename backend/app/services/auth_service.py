"""
Authentication service — register, login, token refresh.
Works with SQL database (SQLite/PostgreSQL).
"""

from fastapi import HTTPException, status
from loguru import logger

from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_refresh_token
)
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.helpers import now_utc


class AuthService:
    def __init__(self, db):
        self.db = db
        self.users = db["users"]

    async def register(self, data: RegisterRequest) -> dict:
        """Register a new user. Returns tokens + user."""
        existing = await self.users.find_one({"email": data.email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        user_doc = {
            "name": data.name,
            "email": data.email,
            "password_hash": hash_password(data.password),
            "role": data.role.value if hasattr(data.role, "value") else data.role,
            "is_active": 1,
            "onboarding_complete": 0,
            "avatar_url": None,
            "created_at": now_utc().isoformat(),
            "updated_at": now_utc().isoformat(),
            "last_login": None,
        }

        result = await self.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        logger.info(f"New user registered: {data.email} (id={user_id})")

        role = data.role.value if hasattr(data.role, "value") else data.role
        tokens = self._generate_tokens(user_id, role)

        return {
            **tokens,
            "user": {
                "id": user_id,
                "name": data.name,
                "email": data.email,
                "role": role,
                "is_active": True,
                "onboarding_complete": False,
                "avatar_url": None,
            }
        }

    async def login(self, data: LoginRequest) -> dict:
        """Authenticate user and return tokens."""
        user = await self.users.find_one({"email": data.email})
        if not user or not verify_password(data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not user.get("is_active", 1):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated. Contact support.",
            )

        await self.users.update_one(
            {"id": user["id"]},
            {"$set": {"last_login": now_utc().isoformat()}}
        )

        user_id = str(user["id"])
        tokens = self._generate_tokens(user_id, user["role"])
        logger.info(f"User logged in: {data.email}")

        return {**tokens, "user": self._safe_user(user)}

    async def refresh_tokens(self, refresh_token: str) -> dict:
        """Issue new access token from valid refresh token."""
        payload = decode_refresh_token(refresh_token)
        user_id = payload.get("sub")

        user = await self.users.find_one({"id": int(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        tokens = self._generate_tokens(user_id, user["role"])
        return {**tokens, "user": self._safe_user(user)}

    def _generate_tokens(self, user_id: str, role: str) -> dict:
        payload = {"sub": user_id, "role": role}
        return {
            "access_token": create_access_token(payload),
            "refresh_token": create_refresh_token(payload),
            "token_type": "bearer",
        }

    def _safe_user(self, user: dict) -> dict:
        return {
            "id": str(user["id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "is_active": bool(user.get("is_active", 1)),
            "onboarding_complete": bool(user.get("onboarding_complete", 0)),
            "avatar_url": user.get("avatar_url"),
        }
