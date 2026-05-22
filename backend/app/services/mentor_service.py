"""
AI Mentor chatbot service — SQL version.
"""

import json
from loguru import logger

from app.utils.helpers import now_utc, serialize_doc
from app.ai.ai_router import ai_chat
from app.ai.prompts.mentor_prompts import get_mentor_system_prompt


class MentorService:
    def __init__(self, db):
        self.db = db

    async def chat(self, user_id: str, message: str, context_window: int = 10) -> dict:
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        system_prompt = get_mentor_system_prompt(profile or {})

        # Fetch recent history
        history_docs = await self.db["chat_history"].find(
            {"user_id": user_id},
            sort=[("created_at", 1)],
            limit=context_window * 2,
        )

        messages = [{"role": d["role"], "content": d["content"]} for d in history_docs]
        messages.append({"role": "user", "content": message})

        reply, model_used = await ai_chat(messages, system_prompt=system_prompt)

        ts = now_utc().isoformat()
        await self.db["chat_history"].insert_one({
            "user_id": user_id, "role": "user", "content": message, "created_at": ts
        })
        await self.db["chat_history"].insert_one({
            "user_id": user_id, "role": "assistant", "content": reply,
            "model_used": model_used, "created_at": ts
        })

        return {"reply": reply, "model_used": model_used, "session_id": user_id}

    async def get_history(self, user_id: str, limit: int = 50) -> list:
        docs = await self.db["chat_history"].find(
            {"user_id": user_id},
            sort=[("created_at", 1)],
            limit=limit,
        )
        return [serialize_doc(d) for d in docs]

    async def clear_history(self, user_id: str) -> bool:
        result = await self.db["chat_history"].delete_many({"user_id": user_id})
        return result.deleted_count > 0
