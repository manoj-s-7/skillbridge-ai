@echo off
REM SkillBridge AI — Start Backend (Windows)
cd /d "%~dp0"

echo Starting SkillBridge AI Backend...

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt -q

if not exist uploads\resumes mkdir uploads\resumes

echo.
echo Server starting on http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
