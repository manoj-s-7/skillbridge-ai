"""Internships API routes."""

from fastapi import APIRouter, Depends, Query
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.services.job_service import JobService

router = APIRouter()


def get_job_service(db=Depends(get_database)) -> JobService:
    return JobService(db)


@router.get("/recommend")
async def recommend_internships(
    limit: int = Query(10, ge=1, le=50),
    current_user=Depends(get_current_user),
    service: JobService = Depends(get_job_service),
):
    user_id = str(current_user["id"])
    return await service.recommend_internships(user_id, limit)


@router.get("")
async def list_internships(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    service: JobService = Depends(get_job_service),
    _=Depends(get_current_user),
):
    return await service.get_all_internships(page, limit)
