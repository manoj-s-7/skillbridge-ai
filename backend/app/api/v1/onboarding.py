"""Onboarding API routes."""

from fastapi import APIRouter, Depends
from app.schemas.profile import OnboardingRequest
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.utils.helpers import now_utc, serialize_doc

router = APIRouter()


@router.post("", status_code=201)
async def submit_onboarding(
    data: OnboardingRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])

    profile_doc = {
        "user_id": user_id,
        **data.model_dump(),
        "onboarding_complete": 1,
        "created_at": now_utc().isoformat(),
        "updated_at": now_utc().isoformat(),
    }

    await db["profiles"].update_one(
        {"user_id": user_id},
        {"$set": profile_doc},
        upsert=True,
    )

    await db["users"].update_one(
        {"id": current_user["id"]},
        {"$set": {"onboarding_complete": 1, "updated_at": now_utc().isoformat()}},
    )

    return {"message": "Onboarding complete!", "profile": serialize_doc(profile_doc)}


@router.get("/status")
async def onboarding_status(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    profile = await db["profiles"].find_one({"user_id": user_id})
    return {
        "onboarding_complete": bool(current_user.get("onboarding_complete", 0)),
        "profile": serialize_doc(profile) if profile else None,
    }


@router.get("/profile")
async def get_profile(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    user_id = str(current_user["id"])
    profile = await db["profiles"].find_one({"user_id": user_id})
    return serialize_doc(profile) if profile else {}
