"""Admin routes."""

from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_admin
from app.db.database import get_database
from app.utils.helpers import serialize_doc

router = APIRouter()


@router.get("/users")
async def list_users(
    db=Depends(get_database),
    _=Depends(get_current_admin),
):
    users = await db["users"].find(limit=100)
    return [serialize_doc(u) for u in users]


@router.get("/stats")
async def get_stats(
    db=Depends(get_database),
    _=Depends(get_current_admin),
):
    return {
        "total_users": await db["users"].count_documents(),
        "total_resumes": await db["resumes"].count_documents(),
        "total_analyses": await db["skill_analyses"].count_documents(),
        "total_chats": await db["chat_history"].count_documents(),
        "total_interviews": await db["interviews"].count_documents(),
    }
