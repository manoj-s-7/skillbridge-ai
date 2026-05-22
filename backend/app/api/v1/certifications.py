"""Certifications analysis routes."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.utils.helpers import parse_ai_json, now_utc, serialize_doc
from app.ai.ai_router import ai_generate
from app.ai.prompts.resume_prompts import get_certification_analysis_prompt

router = APIRouter()


class CertificationRequest(BaseModel):
    certifications: List[str]
    target_role: str


@router.post("/analyze")
async def analyze_certifications(
    data: CertificationRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    prompt = get_certification_analysis_prompt(data.certifications, data.target_role)
    raw_ai, model_used = await ai_generate(prompt)

    try:
        result = parse_ai_json(raw_ai)
    except ValueError:
        raise HTTPException(status_code=502, detail="Certification analysis failed.")

    doc = {
        "user_id": user_id,
        "certifications_list": data.certifications,
        "target_role": data.target_role,
        "overall_score": result.get("overall_score", 0),
        "certifications_analysis": result.get("certifications_analysis", []),
        "missing_key_certifications": result.get("missing_key_certifications", []),
        "overall_recommendation": result.get("overall_recommendation", ""),
        "model_used": model_used,
        "created_at": now_utc().isoformat(),
    }

    await db["certifications"].delete_many({"user_id": user_id})
    res = await db["certifications"].insert_one(doc)
    doc["id"] = res.inserted_id
    return serialize_doc(doc)


@router.get("")
async def get_certifications(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    doc = await db["certifications"].find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="No certification analysis found.")
    return serialize_doc(doc)
