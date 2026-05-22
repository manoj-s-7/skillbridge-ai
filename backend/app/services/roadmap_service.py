"""
Learning roadmap generation service — SQL version.
"""

import json
from fastapi import HTTPException
from loguru import logger

from app.utils.helpers import parse_ai_json, now_utc, serialize_doc
from app.ai.ai_router import ai_generate
from app.ai.prompts.roadmap_prompts import get_roadmap_prompt


class RoadmapService:
    def __init__(self, db):
        self.db = db

    async def generate(self, user_id: str, target_role: str, duration_weeks: int) -> dict:
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        current_skills = profile.get("current_skills", []) if profile else []
        if isinstance(current_skills, str):
            try:
                current_skills = json.loads(current_skills)
            except Exception:
                current_skills = []

        analysis = await self.db["skill_analyses"].find_one(
            {"user_id": user_id, "target_role": target_role},
            sort=[("created_at", -1)]
        )
        missing_skills = analysis.get("missing_skills", []) if analysis else []
        if isinstance(missing_skills, str):
            try:
                missing_skills = json.loads(missing_skills)
            except Exception:
                missing_skills = []

        prompt = get_roadmap_prompt(target_role, current_skills, missing_skills, duration_weeks)
        raw_ai, model_used = await ai_generate(prompt)

        try:
            roadmap_data = parse_ai_json(raw_ai)
        except ValueError as e:
            logger.error(f"Roadmap AI parse error: {e}")
            raise HTTPException(status_code=502, detail="Roadmap generation failed. Please try again.")

        # Delete old roadmap for this user + role
        await self.db["roadmaps"].delete_many({"user_id": user_id, "target_role": target_role})

        doc = {
            "user_id": user_id,
            "target_role": target_role,
            "duration_weeks": duration_weeks,
            "weekly_plan": roadmap_data.get("weekly_plan", []),
            "monthly_summary": roadmap_data.get("monthly_summary", []),
            "key_milestones": roadmap_data.get("key_milestones", []),
            "recommended_projects": roadmap_data.get("recommended_projects", []),
            "model_used": model_used,
            "created_at": now_utc().isoformat(),
        }

        result = await self.db["roadmaps"].insert_one(doc)
        doc["id"] = result.inserted_id
        logger.info(f"Roadmap generated for {user_id} → {target_role} ({duration_weeks}w)")
        return serialize_doc(doc)

    async def get_roadmap(self, user_id: str) -> dict | None:
        doc = await self.db["roadmaps"].find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        )
        return serialize_doc(doc) if doc else None
