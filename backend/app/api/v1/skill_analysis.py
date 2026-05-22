"""Skill analysis routes."""

from fastapi import APIRouter, Depends, Query
from app.schemas.skill import SkillAnalysisRequest
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.services.skill_service import SkillService

router = APIRouter()


def get_skill_service(db=Depends(get_database)) -> SkillService:
    return SkillService(db)


@router.post("")
async def analyze_skills(
    data: SkillAnalysisRequest,
    current_user=Depends(get_current_user),
    service: SkillService = Depends(get_skill_service),
):
    user_id = str(current_user["id"])
    return await service.analyze_gap(user_id, data.target_role, data.current_skills)


@router.get("/latest")
async def get_latest_analysis(
    current_user=Depends(get_current_user),
    service: SkillService = Depends(get_skill_service),
):
    user_id = str(current_user["id"])
    return await service.get_latest_analysis(user_id)


@router.post("/projects")
async def generate_projects(
    target_role: str = Query(...),
    current_user=Depends(get_current_user),
    service: SkillService = Depends(get_skill_service),
):
    user_id = str(current_user["id"])
    return await service.generate_projects(user_id, target_role)
