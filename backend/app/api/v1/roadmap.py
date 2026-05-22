"""Roadmap generation routes."""

from fastapi import APIRouter, Depends
from app.schemas.roadmap import RoadmapRequest
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.services.roadmap_service import RoadmapService

router = APIRouter()


def get_roadmap_service(db=Depends(get_database)) -> RoadmapService:
    return RoadmapService(db)


@router.post("/generate")
async def generate_roadmap(
    data: RoadmapRequest,
    current_user=Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service),
):
    user_id = str(current_user["id"])
    return await service.generate(user_id, data.target_role, data.duration_weeks)


@router.get("")
async def get_roadmap(
    current_user=Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service),
):
    user_id = str(current_user["id"])
    return await service.get_roadmap(user_id)
