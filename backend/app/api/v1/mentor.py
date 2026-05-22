"""AI Mentor chat routes."""

from fastapi import APIRouter, Depends
from app.schemas.chat import MentorChatRequest
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.services.mentor_service import MentorService

router = APIRouter()


def get_mentor_service(db=Depends(get_database)) -> MentorService:
    return MentorService(db)


@router.post("/chat")
async def chat_with_mentor(
    data: MentorChatRequest,
    current_user=Depends(get_current_user),
    service: MentorService = Depends(get_mentor_service),
):
    user_id = str(current_user["id"])
    return await service.chat(user_id, data.message, data.context_window)


@router.get("/history")
async def get_chat_history(
    current_user=Depends(get_current_user),
    service: MentorService = Depends(get_mentor_service),
):
    user_id = str(current_user["id"])
    return await service.get_history(user_id)


@router.delete("/history")
async def clear_chat_history(
    current_user=Depends(get_current_user),
    service: MentorService = Depends(get_mentor_service),
):
    user_id = str(current_user["id"])
    cleared = await service.clear_history(user_id)
    return {"message": "Chat history cleared." if cleared else "No history to clear."}
