"""Interview generation routes."""

from fastapi import APIRouter, Depends, HTTPException
from app.schemas.interview import InterviewRequest
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.utils.helpers import parse_ai_json, now_utc, serialize_doc
from app.ai.ai_router import ai_generate
from app.ai.prompts.mentor_prompts import get_interview_prompt

router = APIRouter()


@router.post("/generate")
async def generate_interview(
    data: InterviewRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    prompt = get_interview_prompt(data.target_role, data.question_types, data.num_questions)
    raw_ai, model_used = await ai_generate(prompt)

    try:
        result = parse_ai_json(raw_ai)
    except ValueError:
        raise HTTPException(status_code=502, detail="Interview generation failed.")

    doc = {
        "user_id": user_id,
        "target_role": data.target_role,
        "question_types": data.question_types,
        "questions": result.get("questions", []),
        "model_used": model_used,
        "created_at": now_utc().isoformat(),
    }

    res = await db["interviews"].insert_one(doc)
    doc["id"] = res.inserted_id
    return serialize_doc(doc)


@router.get("/history")
async def get_interview_history(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    docs = await db["interviews"].find({"user_id": user_id}, sort=[("created_at", -1)], limit=20)
    return [serialize_doc(d) for d in docs]
