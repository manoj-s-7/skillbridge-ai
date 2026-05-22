# SkillBridge AI 🚀

An AI-powered career development platform designed to analyze skills, generate personalized learning roadmaps, recommend jobs, and provide AI mentorship. 

Built with **Next.js**, **FastAPI**, and powered by **OpenRouter/Gemini** and **SQLite** (out of the box).

---

## ✨ Features

- **Skill Gap Analysis:** AI-driven analysis to identify missing skills based on career goals.
- **Resume Analysis:** PDF upload and instant feedback on resume strengths and weaknesses.
- **Learning Roadmaps:** Step-by-step, AI-generated curriculum to master any tech stack.
- **AI Mentor Chat:** 24/7 interactive chat for career advice, coding help, and guidance.
- **Mock Interviews:** Dynamic, AI-powered interview questions tailored to your target role.
- **Job & Internship Recommendations:** Discover relevant opportunities based on your profile.

---

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React
- Zustand (State Management)
- Tailwind CSS

**Backend:**
- Python 3.11+
- FastAPI
- SQLite (via SQLAlchemy + aiosqlite) — *No external database required!*
- JWT Authentication

**AI Integration:**
- OpenRouter (Primary: Gemini 2.0 Flash Lite)
- Groq (Fallback: Llama 3.3 70B)

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)

### 1. Start the Backend

The backend will auto-create the Python virtual environment, install dependencies, and create the SQLite database automatically.

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

> API runs on **http://localhost:8000**  
> Swagger Docs available at **http://localhost:8000/api/docs**

### 2. Start the Frontend (New Terminal)

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

> Frontend runs on **http://localhost:3000**

---

## ⚙️ Configuration

Environment variables are largely pre-configured for ease of use, but you can modify them as needed.

### Backend (`backend/.env`)
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./skillbridge.db

# AI Keys
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=google/gemini-2.0-flash-lite-001
GROQ_API_KEY=your_groq_key

# Security
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🗄️ Switching to PostgreSQL (Optional)

If you prefer PostgreSQL over SQLite for production:

1. Create a PostgreSQL database and user.
2. Update `backend/.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost/skillbridge
   ```
3. Restart the backend. Tables will be created automatically.

---

## 📁 Project Structure

```text
skillbridge-ai/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/v1/           # API routes (auth, jobs, ai, etc.)
│   │   ├── ai/               # OpenRouter/Groq integration & prompts
│   │   ├── core/             # Config, security, dependencies
│   │   ├── db/               # SQLite/PostgreSQL engine
│   │   ├── services/         # Business logic
│   │   └── main.py           # Entry point
│   ├── requirements.txt      # Python dependencies
│   └── start.sh / start.bat  # Startup scripts
│
└── frontend/                 # Next.js Application
    ├── app/                  # Pages & Layouts (App Router)
    ├── components/           # Reusable UI components
    ├── services/             # API integration
    ├── store/                # Zustand stores
    └── package.json          # Node dependencies
```

---

## 🧪 Testing the API

Once the backend is running, visit http://localhost:8000/api/docs for the interactive Swagger UI.

**Test register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## ❓ Troubleshooting

- **Backend won't start:** Ensure you have Python 3.11+ (`python3 --version`). If issues persist, delete the `backend/venv` folder and run the start script again.
- **Frontend 404 on API calls:** Ensure the backend is running on port `8000` and `frontend/.env.local` points to `http://localhost:8000/api/v1`.
- **AI features not working:** Verify your OpenRouter or Groq API keys and remaining credits.
