# SkillBridge AI — Complete Setup Guide

AI-powered career development platform. No MongoDB required — uses SQLite out of the box.

---

## ✅ What Was Fixed

| Issue | Fix |
|-------|-----|
| MongoDB dependency | Replaced with **SQLite** (built-in Python, zero install) |
| MongoDB driver (motor/pymongo) | Replaced with SQLAlchemy async + aiosqlite |
| Gemini API (wrong key type) | Replaced with **OpenRouter** (your existing key works) |
| Auth register/login broken | Fully rewritten auth service for SQL |
| BSON ObjectId errors | Replaced with standard integer IDs |
| Database connection failures on startup | Removed — SQLite file created automatically |
| Missing `__init__.py` files | All added |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)

### Step 1 — Start the Backend

**Mac/Linux:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
cd backend
start.bat
```

The backend will:
1. Create a Python virtual environment
2. Install all dependencies
3. Create `skillbridge.db` (SQLite database, auto-created)
4. Seed sample jobs and internships
5. Start on **http://localhost:8000**

> API docs available at: http://localhost:8000/api/docs

### Step 2 — Start the Frontend (new terminal)

**Mac/Linux:**
```bash
cd frontend
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
cd frontend
start.bat
```

Frontend starts at **http://localhost:3000**

---

## ⚙️ Configuration

### Backend `.env` (already configured with your keys)
```env
# Database — SQLite by default
DATABASE_URL=sqlite+aiosqlite:///./skillbridge.db

# For PostgreSQL instead (optional):
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/skillbridge

# AI Keys — already set
OPENROUTER_API_KEY=sk-or-v1-...
AI_MODEL=google/gemini-2.0-flash-lite-001
GROQ_API_KEY=gsk_...  # Fallback if OpenRouter fails

# JWT
JWT_SECRET=skillbridge_super_secret_jwt_key_change_in_production_2024
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🗄️ Switching to PostgreSQL (Optional)

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE skillbridge;
CREATE USER skillbridge_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE skillbridge TO skillbridge_user;
```

2. Update `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://skillbridge_user:yourpassword@localhost/skillbridge
```

3. Restart the backend — tables are created automatically.

---

## 📁 Project Structure

```
skillbridge-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── api/v1/              # All API routes
│   │   │   ├── auth.py          # Register, login, refresh
│   │   │   ├── onboarding.py    # User profile setup
│   │   │   ├── dashboard.py     # Dashboard metrics
│   │   │   ├── resume.py        # PDF upload + AI analysis
│   │   │   ├── skill_analysis.py # Skill gap analysis
│   │   │   ├── roadmap.py       # Learning roadmap
│   │   │   ├── mentor.py        # AI chat mentor
│   │   │   ├── interview.py     # Mock interview questions
│   │   │   ├── jobs.py          # Job recommendations
│   │   │   ├── internships.py   # Internship recommendations
│   │   │   └── certifications.py # Cert evaluation
│   │   ├── ai/
│   │   │   ├── ai_router.py     # OpenRouter + Groq fallback
│   │   │   └── prompts/         # AI prompt templates
│   │   ├── core/
│   │   │   ├── config.py        # Settings from .env
│   │   │   ├── security.py      # JWT + bcrypt
│   │   │   └── dependencies.py  # FastAPI deps
│   │   ├── db/
│   │   │   └── database.py      # SQLite/PostgreSQL engine
│   │   └── services/            # Business logic
│   ├── .env                     # Your API keys (already set)
│   ├── requirements.txt
│   └── start.sh / start.bat
│
└── frontend/
    ├── app/                     # Next.js App Router pages
    │   ├── page.tsx             # Landing page
    │   ├── login/               # Login page
    │   ├── signup/              # Register page
    │   ├── onboarding/          # Profile setup
    │   └── dashboard/           # All dashboard pages
    ├── services/                # API call functions
    ├── store/                   # Zustand auth store
    ├── .env.local               # Frontend env vars
    └── package.json
```

---

## 🧪 Testing the API

Once backend is running, visit http://localhost:8000/api/docs for interactive Swagger UI.

**Test register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Test login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🤖 AI Features

| Feature | AI Model | Fallback |
|---------|----------|---------|
| Skill gap analysis | OpenRouter (Gemini 2.0 Flash Lite) | Groq Llama 3.3 70B |
| Resume analysis | OpenRouter | Groq |
| Learning roadmap | OpenRouter | Groq |
| AI Mentor chat | OpenRouter | Groq |
| Interview questions | OpenRouter | Groq |

---

## ❓ Troubleshooting

**Backend won't start:**
- Check Python version: `python3 --version` (needs 3.11+)
- Delete `venv/` folder and re-run `start.sh`

**"No module named aiosqlite":**
- Run `pip install -r requirements.txt` inside the activated venv

**Frontend 404 on API calls:**
- Make sure backend is running on port 8000
- Check `frontend/.env.local` has correct API URL

**AI features not working:**
- Verify your OpenRouter key balance at https://openrouter.ai/credits
- Groq key is free — verify at https://console.groq.com
