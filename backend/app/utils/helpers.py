"""General utility helpers — no MongoDB/bson dependency."""

import json
import re
from datetime import datetime, timezone


def serialize_doc(doc: dict) -> dict:
    """Convert a DB row dict to JSON-serializable dict."""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, (list, dict)):
            result[key] = value  # already parsed by database.py _row_to_dict
        else:
            result[key] = value
    # Ensure 'id' is always a string
    if "id" in result:
        result["id"] = str(result["id"])
    return result


def now_utc() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def parse_ai_json(raw: str) -> dict:
    """
    Parse JSON from AI response.
    AI may include markdown code fences — strip them first.
    """
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Could not parse AI JSON response: {e}")


def calculate_match_score(user_skills: list, required_skills: list) -> tuple[int, list]:
    """Calculate job/internship match score based on skill overlap."""
    if not required_skills:
        return 50, []
    user_lower = {s.lower() for s in user_skills}
    matched = [s for s in required_skills if s.lower() in user_lower]
    score = int((len(matched) / len(required_skills)) * 100)
    return score, matched
