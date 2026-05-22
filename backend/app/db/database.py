"""
Async database connection using SQLAlchemy Core + aiosqlite/asyncpg.
Supports both SQLite (default, zero-config) and PostgreSQL.
"""

import json
from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text, MetaData
from loguru import logger

from app.core.config import settings

# ── Engine ─────────────────────────────────────────────────────────────────
_is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if _is_sqlite else {},
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


# ── Helper: simple dict-based DB interface (mirrors motor API style) ────────
class Table:
    """Thin wrapper that lets services do db['collection'].find_one(...) style calls."""

    def __init__(self, name: str, session_factory):
        self.name = name
        self._sf = session_factory

    async def _exec(self, sql: str, params: dict = None):
        async with self._sf() as s:
            result = await s.execute(text(sql), params or {})
            await s.commit()
            return result

    async def find_one(self, where: dict = None, sort: list = None) -> Optional[dict]:
        clause, params = _build_where(where)
        order = _build_order(sort)
        sql = f"SELECT * FROM {self.name}{clause}{order} LIMIT 1"
        async with self._sf() as s:
            row = (await s.execute(text(sql), params)).mappings().first()
            return _row_to_dict(row) if row else None

    async def find(self, where: dict = None, sort: list = None, limit: int = 100, skip: int = 0):
        clause, params = _build_where(where)
        order = _build_order(sort)
        sql = f"SELECT * FROM {self.name}{clause}{order} LIMIT {limit} OFFSET {skip}"
        async with self._sf() as s:
            rows = (await s.execute(text(sql), params)).mappings().all()
            return [_row_to_dict(r) for r in rows]

    async def insert_one(self, doc: dict) -> Any:
        doc = _serialize_for_db(doc)
        cols = ", ".join(doc.keys())
        placeholders = ", ".join(f":{k}" for k in doc.keys())
        sql = f"INSERT INTO {self.name} ({cols}) VALUES ({placeholders})"
        async with self._sf() as s:
            result = await s.execute(text(sql), doc)
            await s.commit()
            inserted_id = result.lastrowid
            return _InsertResult(inserted_id)

    async def insert_many(self, docs: list):
        for doc in docs:
            await self.insert_one(doc)

    async def update_one(self, where: dict, update: dict, upsert: bool = False):
        # Handle $set operator
        if "$set" in update:
            update = update["$set"]
        update = _serialize_for_db(update)

        # Check if exists
        existing = await self.find_one(where)
        if existing:
            sets = ", ".join(f"{k} = :{k}" for k in update.keys())
            clause, params = _build_where(where)
            sql = f"UPDATE {self.name} SET {sets}{clause}"
            params.update(update)
            async with self._sf() as s:
                await s.execute(text(sql), params)
                await s.commit()
        elif upsert:
            merged = {**where, **update}
            await self.insert_one(merged)

    async def delete_many(self, where: dict = None):
        clause, params = _build_where(where)
        sql = f"DELETE FROM {self.name}{clause}"
        async with self._sf() as s:
            result = await s.execute(text(sql), params)
            await s.commit()
            return _DeleteResult(result.rowcount)

    async def count_documents(self, where: dict = None) -> int:
        clause, params = _build_where(where)
        sql = f"SELECT COUNT(*) FROM {self.name}{clause}"
        async with self._sf() as s:
            row = (await s.execute(text(sql), params)).first()
            return row[0] if row else 0

    def to_list(self, length: int):
        """Compatibility: returns self (already a list from find)."""
        return self


class _InsertResult:
    def __init__(self, lastrowid):
        self.inserted_id = lastrowid


class _DeleteResult:
    def __init__(self, count):
        self.deleted_count = count


class Database:
    """Mimics Motor's database[collection] access."""

    def __init__(self):
        self._tables = {}

    def __getitem__(self, name: str) -> Table:
        if name not in self._tables:
            self._tables[name] = Table(name, AsyncSessionLocal)
        return self._tables[name]


_db_instance = Database()


def get_database():
    return _db_instance


# ── Schema helpers ─────────────────────────────────────────────────────────

def _build_where(where: dict) -> tuple[str, dict]:
    if not where:
        return "", {}
    parts = []
    params = {}
    for k, v in where.items():
        param_key = k.replace(".", "_")
        parts.append(f"{k} = :{param_key}")
        params[param_key] = v
    return " WHERE " + " AND ".join(parts), params


def _build_order(sort: list) -> str:
    if not sort:
        return ""
    parts = []
    for col, direction in sort:
        direction_str = "DESC" if direction == -1 else "ASC"
        parts.append(f"{col} {direction_str}")
    return " ORDER BY " + ", ".join(parts)


def _serialize_for_db(doc: dict) -> dict:
    """Convert Python objects to DB-storable types."""
    result = {}
    for k, v in doc.items():
        if k == "_id":
            continue  # skip MongoDB-style _id
        if isinstance(v, (list, dict)):
            result[k] = json.dumps(v)
        elif isinstance(v, datetime):
            result[k] = v.isoformat()
        else:
            result[k] = v
    return result


def _row_to_dict(row) -> dict:
    """Convert a DB row to dict, parsing JSON fields."""
    if row is None:
        return None
    d = dict(row)
    # Parse JSON fields
    for k, v in d.items():
        if isinstance(v, str) and v and v[0] in ("{", "["):
            try:
                d[k] = json.loads(v)
            except (json.JSONDecodeError, ValueError):
                pass
    # Add _id alias for id
    if "id" in d and "_id" not in d:
        d["_id"] = d["id"]
    return d


# ── Table creation SQL ─────────────────────────────────────────────────────

TABLES_SQL = [
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        is_active INTEGER DEFAULT 1,
        onboarding_complete INTEGER DEFAULT 0,
        avatar_url TEXT,
        last_login TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        full_name TEXT,
        education TEXT,
        institution TEXT,
        graduation_year INTEGER,
        current_skills TEXT,
        certifications TEXT,
        dream_role TEXT,
        preferred_domain TEXT,
        preferred_location TEXT,
        salary_expectation TEXT,
        strengths TEXT,
        weaknesses TEXT,
        interests TEXT,
        coding_preference TEXT DEFAULT 'coding',
        company_preference TEXT DEFAULT 'both',
        experience_level TEXT DEFAULT 'fresher',
        onboarding_complete INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        file_name TEXT,
        file_path TEXT,
        file_url TEXT,
        raw_text TEXT,
        parsed_data TEXT,
        ats_score INTEGER DEFAULT 0,
        detected_skills TEXT,
        weaknesses TEXT,
        suggestions TEXT,
        keyword_density TEXT,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS skill_analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        target_role TEXT,
        current_skills TEXT,
        matched_skills TEXT,
        missing_skills TEXT,
        readiness_score INTEGER DEFAULT 0,
        recommendations TEXT,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS roadmaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        target_role TEXT,
        duration_weeks INTEGER,
        weekly_plan TEXT,
        monthly_summary TEXT,
        key_milestones TEXT,
        recommended_projects TEXT,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS interviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        target_role TEXT,
        question_types TEXT,
        questions TEXT,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        certifications_list TEXT,
        target_role TEXT,
        overall_score INTEGER DEFAULT 0,
        certifications_analysis TEXT,
        missing_key_certifications TEXT,
        overall_recommendation TEXT,
        model_used TEXT,
        created_at TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        location TEXT,
        domain TEXT,
        skills_required TEXT,
        description TEXT,
        salary TEXT,
        job_type TEXT,
        url TEXT,
        posted_date TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        location TEXT,
        domain TEXT,
        skills_required TEXT,
        description TEXT,
        stipend TEXT,
        duration TEXT,
        url TEXT,
        posted_date TEXT
    )
    """,
]


async def create_tables():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        for sql in TABLES_SQL:
            await conn.execute(text(sql))
    logger.info("✅ Database tables created/verified.")
