#!/bin/bash
# SkillBridge AI — Start Backend
set -e
cd "$(dirname "$0")"

echo "🚀 SkillBridge AI Backend"
echo "📦 Database: SQLite (auto-created, no setup needed)"
echo ""

# Check Python
python3 --version >/dev/null 2>&1 || { echo "❌ Python 3 not found. Install Python 3.11+"; exit 1; }

# Create venv if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate and install
source venv/bin/activate
echo "📦 Installing dependencies (first run takes ~2 min)..."
pip install -r requirements.txt -q

mkdir -p uploads/resumes

echo ""
echo "✅ Backend starting at http://localhost:8000"
echo "📖 API Docs:       http://localhost:8000/api/docs"
echo "Press Ctrl+C to stop"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
