"""
Skill gap analysis service — SQL version.
"""

from fastapi import HTTPException
from loguru import logger

from app.utils.helpers import parse_ai_json, now_utc, serialize_doc
from app.ai.ai_router import ai_generate
from app.ai.prompts.skill_prompts import get_skill_gap_prompt, get_project_ideas_prompt


class SkillService:
    def __init__(self, db):
        self.db = db

    async def analyze_gap(self, user_id: str, target_role: str, current_skills: list | None) -> dict:
        if not current_skills:
            profile = await self.db["profiles"].find_one({"user_id": user_id})
            current_skills = profile.get("current_skills", []) if profile else []
            if isinstance(current_skills, str):
                import json
                try:
                    current_skills = json.loads(current_skills)
                except Exception:
                    current_skills = []

        prompt = get_skill_gap_prompt(current_skills, target_role)
        raw_ai, model_used = await ai_generate(prompt)

        try:
            analysis = parse_ai_json(raw_ai)
        except ValueError as e:
            logger.error(f"Skill gap AI parse error: {e}")
            raise HTTPException(status_code=502, detail="AI analysis failed. Please try again.")

        doc = {
            "user_id": user_id,
            "target_role": target_role,
            "current_skills": current_skills,
            "matched_skills": analysis.get("matched_skills", []),
            "missing_skills": analysis.get("missing_skills", []),
            "readiness_score": analysis.get("readiness_score", 0),
            "recommendations": analysis.get("recommendations", []),
            "model_used": model_used,
            "created_at": now_utc().isoformat(),
        }

        result = await self.db["skill_analyses"].insert_one(doc)
        doc["id"] = result.inserted_id
        logger.info(f"Skill analysis done for {user_id} — readiness: {doc['readiness_score']}%")
        return serialize_doc(doc)

    async def get_latest_analysis(self, user_id: str) -> dict | None:
        doc = await self.db["skill_analyses"].find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        )
        return serialize_doc(doc) if doc else None

    async def generate_projects(self, user_id: str, target_role: str) -> dict:
        import json
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        skills = profile.get("current_skills", []) if profile else []
        if isinstance(skills, str):
            try:
                skills = json.loads(skills)
            except Exception:
                skills = []
        level = profile.get("experience_level", "fresher") if profile else "fresher"

        prompt = get_project_ideas_prompt(skills, target_role, level)
        raw_ai, model_used = await ai_generate(prompt)

        try:
            data = parse_ai_json(raw_ai)
        except ValueError:
            raise HTTPException(status_code=502, detail="AI project generation failed.")

        return {"projects": data.get("projects", []), "model_used": model_used}
