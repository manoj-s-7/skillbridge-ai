"""
Job and internship recommendation service — SQL version.
"""

import json
from app.utils.helpers import serialize_doc, calculate_match_score


class JobService:
    def __init__(self, db):
        self.db = db

    def _parse_skills(self, val) -> list:
        if isinstance(val, list):
            return val
        if isinstance(val, str):
            try:
                return json.loads(val)
            except Exception:
                return []
        return []

    async def recommend_jobs(self, user_id: str, limit: int = 10) -> list:
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        user_skills = self._parse_skills(profile.get("current_skills", []) if profile else [])
        location = profile.get("preferred_location", "") if profile else ""

        all_jobs = await self.db["jobs"].find(limit=100)

        scored = []
        for job in all_jobs:
            required = self._parse_skills(job.get("skills_required", []))
            score, matched = calculate_match_score(user_skills, required)
            job_dict = serialize_doc(job)
            job_dict["match_score"] = score
            job_dict["match_reasons"] = [f"Matched skill: {s}" for s in matched[:3]]
            if location and location.lower() in (job.get("location") or "").lower():
                job_dict["match_score"] = min(100, score + 10)
                job_dict["match_reasons"].append(f"Location match: {location}")
            scored.append(job_dict)

        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored[:limit]

    async def recommend_internships(self, user_id: str, limit: int = 10) -> list:
        profile = await self.db["profiles"].find_one({"user_id": user_id})
        user_skills = self._parse_skills(profile.get("current_skills", []) if profile else [])

        all_internships = await self.db["internships"].find(limit=100)

        scored = []
        for item in all_internships:
            required = self._parse_skills(item.get("skills_required", []))
            score, matched = calculate_match_score(user_skills, required)
            item_dict = serialize_doc(item)
            item_dict["match_score"] = score
            item_dict["match_reasons"] = [f"Matched skill: {s}" for s in matched[:3]]
            scored.append(item_dict)

        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored[:limit]

    async def get_all_jobs(self, page: int = 1, limit: int = 20) -> dict:
        skip = (page - 1) * limit
        docs = await self.db["jobs"].find(limit=limit, skip=skip)
        total = await self.db["jobs"].count_documents()
        return {
            "jobs": [serialize_doc(d) for d in docs],
            "total": total,
            "page": page,
            "pages": max(1, (total + limit - 1) // limit),
        }

    async def get_all_internships(self, page: int = 1, limit: int = 20) -> dict:
        skip = (page - 1) * limit
        docs = await self.db["internships"].find(limit=limit, skip=skip)
        total = await self.db["internships"].count_documents()
        return {
            "internships": [serialize_doc(d) for d in docs],
            "total": total,
            "page": page,
            "pages": max(1, (total + limit - 1) // limit),
        }
