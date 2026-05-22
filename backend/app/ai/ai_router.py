"""
AI Router: OpenRouter (primary) → Groq (fallback).
All AI calls go through this module.
"""

import asyncio
import httpx
from loguru import logger
from groq import Groq

from app.core.config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# ── OpenRouter ─────────────────────────────────────────────────────────────

async def openrouter_generate(prompt: str) -> str:
    """Call OpenRouter API with the configured model."""
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkillBridge AI",
    }
    payload = {
        "model": settings.AI_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4096,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


async def openrouter_chat(messages: list[dict], system_prompt: str = "") -> str:
    """Multi-turn chat via OpenRouter."""
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not configured")

    full_messages = []
    if system_prompt:
        full_messages.append({"role": "system", "content": system_prompt})
    full_messages.extend(messages)

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SkillBridge AI",
    }
    payload = {
        "model": settings.AI_MODEL,
        "messages": full_messages,
        "temperature": 0.7,
        "max_tokens": 4096,
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


# ── Groq ───────────────────────────────────────────────────────────────────

GROQ_MODEL = "llama-3.3-70b-versatile"


async def groq_generate(prompt: str) -> str:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    client = Groq(api_key=settings.GROQ_API_KEY)

    def _call():
        return client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4096,
        )

    response = await asyncio.to_thread(_call)
    return response.choices[0].message.content


async def groq_chat(messages: list[dict], system_prompt: str = "") -> str:
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    client = Groq(api_key=settings.GROQ_API_KEY)
    full_messages = []
    if system_prompt:
        full_messages.append({"role": "system", "content": system_prompt})
    full_messages.extend(messages)

    def _call():
        return client.chat.completions.create(
            model=GROQ_MODEL,
            messages=full_messages,
            temperature=0.7,
            max_tokens=4096,
        )

    response = await asyncio.to_thread(_call)
    return response.choices[0].message.content


# ── Public API ─────────────────────────────────────────────────────────────

async def ai_generate(prompt: str) -> tuple[str, str]:
    """Generate text — OpenRouter first, Groq fallback. Returns (text, model_used)."""
    try:
        text = await openrouter_generate(prompt)
        return text, f"openrouter/{settings.AI_MODEL}"
    except Exception as e:
        logger.warning(f"OpenRouter failed: {e}. Falling back to Groq...")

    try:
        text = await groq_generate(prompt)
        return text, "groq/llama-3.3-70b"
    except Exception as e:
        logger.error(f"Groq also failed: {e}")
        raise RuntimeError("All AI providers failed. Please try again later.")


async def ai_chat(messages: list[dict], system_prompt: str = "") -> tuple[str, str]:
    """Multi-turn chat — OpenRouter first, Groq fallback. Returns (text, model_used)."""
    try:
        text = await openrouter_chat(messages, system_prompt)
        return text, f"openrouter/{settings.AI_MODEL}"
    except Exception as e:
        logger.warning(f"OpenRouter chat failed: {e}. Falling back to Groq...")

    try:
        text = await groq_chat(messages, system_prompt)
        return text, "groq/llama-3.3-70b"
    except Exception as e:
        logger.error(f"Groq chat also failed: {e}")
        raise RuntimeError("All AI providers failed.")
