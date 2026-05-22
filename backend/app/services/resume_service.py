"""
Resume service — upload, parse, AI analyze — SQL version.
"""

import json
from fastapi import HTTPException, UploadFile
from loguru import logger

from app.utils.pdf_parser import extract_text_from_pdf, validate_pdf
from app.utils.file_handler import save_upload
from app.utils.helpers import parse_ai_json, now_utc, serialize_doc
from app.ai.ai_router import ai_generate
from app.ai.prompts.resume_prompts import get_resume_analysis_prompt


class ResumeService:
    def __init__(self, db):
        self.db = db

    async def upload_and_analyze(self, file: UploadFile, user_id: str) -> dict:
        file_meta = await save_upload(file, subfolder="resumes")
        raw_bytes = file_meta.pop("raw_bytes")

        try:
            validate_pdf(raw_bytes)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        try:
            resume_text = extract_text_from_pdf(raw_bytes)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

        if len(resume_text.strip()) < 100:
            raise HTTPException(status_code=422, detail="Resume appears to be empty or unreadable.")

        prompt = get_resume_analysis_prompt(resume_text)
        raw_ai, model_used = await ai_generate(prompt)

        try:
            analysis = parse_ai_json(raw_ai)
        except ValueError as e:
            logger.error(f"AI response parse error: {e}")
            raise HTTPException(status_code=502, detail="AI analysis failed. Please try again.")

        await self.db["resumes"].delete_many({"user_id": user_id})

        doc = {
            "user_id": user_id,
            "file_name": file_meta["original_name"],
            "file_path": file_meta["file_path"],
            "file_url": file_meta["url"],
            "raw_text": resume_text,
            "parsed_data": analysis.get("parsed_data", {}),
            "ats_score": analysis.get("ats_score", 0),
            "detected_skills": analysis.get("detected_skills", []),
            "weaknesses": analysis.get("weaknesses", []),
            "suggestions": analysis.get("suggestions", []),
            "keyword_density": analysis.get("keyword_density", {}),
            "model_used": model_used,
            "created_at": now_utc().isoformat(),
        }

        result = await self.db["resumes"].insert_one(doc)
        doc["id"] = result.inserted_id

        await self._sync_skills_to_profile(user_id, analysis.get("detected_skills", []))
        logger.info(f"Resume analyzed for user {user_id} — ATS: {doc['ats_score']}")
        return serialize_doc(doc)

    async def get_latest(self, user_id: str) -> dict | None:
        doc = await self.db["resumes"].find_one({"user_id": user_id}, sort=[("created_at", -1)])
        return serialize_doc(doc) if doc else None

    async def delete_resume(self, user_id: str) -> bool:
        result = await self.db["resumes"].delete_many({"user_id": user_id})
        return result.deleted_count > 0

    async def _sync_skills_to_profile(self, user_id: str, skills: list):
        if not skills:
            return
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        if profile:
            existing = profile.get("current_skills", [])
            if isinstance(existing, str):
                try:
                    existing = json.loads(existing)
                except Exception:
                    existing = []
            merged = list(set(existing) | set(skills))
            await self.db["profiles"].update_one(
                {"user_id": user_id},
                {"$set": {"current_skills": merged, "updated_at": now_utc().isoformat()}}
            )
