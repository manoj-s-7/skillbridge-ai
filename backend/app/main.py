"""
SkillBridge AI — FastAPI Application Entry Point
Uses SQLite (default) or PostgreSQL — no MongoDB required.
"""

import json
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.db.database import create_tables, get_database

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

from app.api.v1 import (
    auth, onboarding, resume, certifications, skill_analysis,
    roadmap, jobs, internships, interview, mentor, dashboard, admin,
)


async def seed_jobs_and_internships():
    """Seed job/internship data if tables are empty."""
    db = get_database()
    count = await db["jobs"].count_documents()
    if count > 0:
        return

    seed_jobs = [
        {"title": "Backend Developer", "company": "TechCorp India", "location": "Bangalore", "domain": "Backend", "skills_required": json.dumps(["Python", "FastAPI", "PostgreSQL", "Docker"]), "description": "Build scalable backend services", "salary": "8-15 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-15"},
        {"title": "Frontend Developer", "company": "Startup Hub", "location": "Hyderabad", "domain": "Frontend", "skills_required": json.dumps(["React", "TypeScript", "CSS", "NextJS"]), "description": "Build beautiful UIs", "salary": "6-12 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-14"},
        {"title": "Data Scientist", "company": "Analytics Co", "location": "Mumbai", "domain": "Data Science", "skills_required": json.dumps(["Python", "ML", "TensorFlow", "SQL"]), "description": "Analyze and model data", "salary": "10-20 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-13"},
        {"title": "DevOps Engineer", "company": "CloudTech", "location": "Pune", "domain": "DevOps", "skills_required": json.dumps(["AWS", "Docker", "Kubernetes", "CI/CD"]), "description": "Manage cloud infrastructure", "salary": "12-22 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-12"},
        {"title": "Full Stack Developer", "company": "Product Inc", "location": "Chennai", "domain": "Full Stack", "skills_required": json.dumps(["React", "Node.js", "MongoDB", "Python"]), "description": "End-to-end product development", "salary": "9-18 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-11"},
        {"title": "ML Engineer", "company": "AI Startup", "location": "Bangalore", "domain": "AI/ML", "skills_required": json.dumps(["Python", "PyTorch", "MLOps", "Docker"]), "description": "Deploy ML models at scale", "salary": "15-30 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-10"},
        {"title": "Android Developer", "company": "MobileFirst", "location": "Delhi", "domain": "Mobile", "skills_required": json.dumps(["Kotlin", "Android SDK", "Firebase", "REST APIs"]), "description": "Build Android applications", "salary": "7-14 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-09"},
        {"title": "Cloud Architect", "company": "Enterprise Solutions", "location": "Bangalore", "domain": "Cloud", "skills_required": json.dumps(["AWS", "Azure", "Terraform", "Security"]), "description": "Design cloud architectures", "salary": "20-40 LPA", "job_type": "Full-time", "url": "https://linkedin.com/jobs", "posted_date": "2024-01-08"},
    ]

    seed_internships = [
        {"title": "Backend Intern", "company": "TechStartup", "location": "Bangalore (Remote)", "domain": "Backend", "skills_required": json.dumps(["Python", "Flask", "SQL"]), "description": "Learn and build backend services", "stipend": "15,000/month", "duration": "3 months", "url": "https://internshala.com", "posted_date": "2024-01-15"},
        {"title": "Frontend Intern", "company": "WebAgency", "location": "Mumbai (Hybrid)", "domain": "Frontend", "skills_required": json.dumps(["HTML", "CSS", "JavaScript", "React"]), "description": "Build web interfaces", "stipend": "10,000/month", "duration": "6 months", "url": "https://internshala.com", "posted_date": "2024-01-14"},
        {"title": "Data Analyst Intern", "company": "DataFirm", "location": "Remote", "domain": "Data Science", "skills_required": json.dumps(["Python", "Pandas", "SQL", "Excel"]), "description": "Analyze business data", "stipend": "12,000/month", "duration": "3 months", "url": "https://internshala.com", "posted_date": "2024-01-13"},
        {"title": "ML Intern", "company": "AI Labs", "location": "Hyderabad", "domain": "AI/ML", "skills_required": json.dumps(["Python", "Scikit-learn", "NumPy"]), "description": "Work on ML projects", "stipend": "20,000/month", "duration": "6 months", "url": "https://internshala.com", "posted_date": "2024-01-12"},
        {"title": "DevOps Intern", "company": "CloudCo", "location": "Pune", "domain": "DevOps", "skills_required": json.dumps(["Linux", "Docker", "Git"]), "description": "Learn cloud operations", "stipend": "18,000/month", "duration": "3 months", "url": "https://internshala.com", "posted_date": "2024-01-11"},
    ]

    for job in seed_jobs:
        await db["jobs"].insert_one(job)
    for internship in seed_internships:
        await db["internships"].insert_one(internship)

    logger.info("✅ Sample jobs and internships seeded.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("🚀 SkillBridge AI backend starting (SQLite/PostgreSQL mode)...")
    await create_tables()
    await seed_jobs_and_internships()
    logger.info("✅ Database ready.")
    yield
    logger.info("🛑 Shutting down SkillBridge AI backend...")


app = FastAPI(
    title="SkillBridge AI",
    description="AI-powered employability and career development platform",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=f"{API_PREFIX}/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix=f"{API_PREFIX}/onboarding", tags=["Onboarding"])
app.include_router(resume.router, prefix=f"{API_PREFIX}/resume", tags=["Resume"])
app.include_router(certifications.router, prefix=f"{API_PREFIX}/certifications", tags=["Certifications"])
app.include_router(skill_analysis.router, prefix=f"{API_PREFIX}/skill-analysis", tags=["Skill Analysis"])
app.include_router(roadmap.router, prefix=f"{API_PREFIX}/roadmap", tags=["Roadmap"])
app.include_router(jobs.router, prefix=f"{API_PREFIX}/jobs", tags=["Jobs"])
app.include_router(internships.router, prefix=f"{API_PREFIX}/internships", tags=["Internships"])
app.include_router(interview.router, prefix=f"{API_PREFIX}/interview", tags=["Interview"])
app.include_router(mentor.router, prefix=f"{API_PREFIX}/mentor", tags=["AI Mentor"])
app.include_router(dashboard.router, prefix=f"{API_PREFIX}/dashboard", tags=["Dashboard"])
app.include_router(admin.router, prefix=f"{API_PREFIX}/admin", tags=["Admin"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "SkillBridge AI", "version": "2.0.0", "db": "sqlite/postgresql"}
