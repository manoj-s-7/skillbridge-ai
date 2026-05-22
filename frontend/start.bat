@echo off
REM SkillBridge AI — Start Frontend (Windows)
cd /d "%~dp0"

echo Starting SkillBridge AI Frontend...

if not exist node_modules (
    echo Installing npm packages...
    npm install
)

echo.
echo Frontend starting on http://localhost:3000
echo.
npm run dev
