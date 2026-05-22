"""Resume upload and analysis routes."""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.services.resume_service import ResumeService

router = APIRouter()


def get_resume_service(db=Depends(get_database)) -> ResumeService:
    return ResumeService(db)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    user_id = str(current_user["id"])
    return await service.upload_and_analyze(file, user_id)


@router.get("/analysis")
async def get_resume_analysis(
    current_user=Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    user_id = str(current_user["id"])
    result = await service.get_latest(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="No resume found. Please upload your resume.")
    return result


@router.delete("")
async def delete_resume(
    current_user=Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    user_id = str(current_user["id"])
    deleted = await service.delete_resume(user_id)
    return {"message": "Resume deleted." if deleted else "No resume found."}
