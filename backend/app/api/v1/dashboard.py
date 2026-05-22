"""Dashboard metrics route."""

import json
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.db.database import get_database

router = APIRouter()


def _parse_list(val) -> list:
    if isinstance(val, list):
        return val
    if isinstance(val, str):
        try:
            return json.loads(val)
        except Exception:
            return []
    return []


@router.get("/metrics")
async def get_dashboard_metrics(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])

    resume = await db["resumes"].find_one({"user_id": user_id}, sort=[("created_at", -1)])
    ats_score = resume.get("ats_score", 0) if resume else 0
    detected_skills = _parse_list(resume.get("detected_skills", [])) if resume else []

    skill_analysis = await db["skill_analyses"].find_one(
        {"user_id": user_id}, sort=[("created_at", -1)]
    )
    readiness_score = skill_analysis.get("readiness_score", 0) if skill_analysis else 0
    target_role = skill_analysis.get("target_role", "") if skill_analysis else ""
    missing_skills = _parse_list(skill_analysis.get("missing_skills", [])) if skill_analysis else []

    roadmap = await db["roadmaps"].find_one({"user_id": user_id}, sort=[("created_at", -1)])
    roadmap_weeks = roadmap.get("duration_weeks", 0) if roadmap else 0

    chat_count = await db["chat_history"].count_documents({"user_id": user_id})
    interview_count = await db["interviews"].count_documents({"user_id": user_id})

    cert_doc = await db["certifications"].find_one({"user_id": user_id})
    cert_score = cert_doc.get("overall_score", 0) if cert_doc else 0

    resume_history = []
    history_docs = await db["resumes"].find(
        {"user_id": user_id}, sort=[("created_at", -1)], limit=5
    )
    for r in history_docs:
        resume_history.append({
            "date": r.get("created_at", ""),
            "ats_score": r.get("ats_score", 0),
        })

    return {
        "ats_score": ats_score,
        "readiness_score": readiness_score,
        "target_role": target_role,
        "missing_skills_count": len(missing_skills),
        "detected_skills_count": len(detected_skills),
        "cert_score": cert_score,
        "roadmap_weeks": roadmap_weeks,
        "chat_count": chat_count,
        "interview_count": interview_count,
        "ats_history": resume_history,
        "onboarding_complete": bool(current_user.get("onboarding_complete", 0)),
        "has_resume": resume is not None,
        "has_roadmap": roadmap is not None,
    }
