"""AI prompt templates for skill gap analysis."""


def get_skill_gap_prompt(current_skills: list, target_role: str) -> str:
    skills_str = ", ".join(current_skills) if current_skills else "Not specified"
    return f"""
You are a senior tech recruiter and career development expert.

Analyze the skill gap for a candidate targeting the role of: {target_role}

Current Skills: {skills_str}

Return ONLY valid JSON:
{{
  "target_role": "{target_role}",
  "matched_skills": ["Python", "..."],
  "missing_skills": [
    {{
      "skill": "Docker",
      "priority": "high",
      "resources": [
        "Docker Official Documentation",
        "Docker for Beginners - YouTube",
        "Udemy Docker & Kubernetes Course"
      ]
    }}
  ],
  "readiness_score": 60,
  "recommendations": [
    "Focus on learning Docker and Kubernetes first as they are critical for this role",
    "Build 2-3 projects demonstrating your Python backend skills",
    "..."
  ]
}}

Priority levels:
- high: Must have, blocks employment without it
- medium: Strongly preferred, learn within 3 months
- low: Nice to have, can learn on the job

Readiness score: 0-100 based on how ready the candidate is RIGHT NOW for this role.
Be realistic and strict. Most freshers should score 30-60.
"""


def get_project_ideas_prompt(skills: list, target_role: str, level: str) -> str:
    skills_str = ", ".join(skills)
    return f"""
You are a senior software engineer and portfolio coach.

Generate 3 portfolio project ideas for:
- Target Role: {target_role}
- Current Skills: {skills_str}
- Experience Level: {level}

Return ONLY valid JSON:
{{
  "projects": [
    {{
      "title": "Real-time Chat Application",
      "description": "...",
      "tech_stack": ["Node.js", "Socket.io", "React", "MongoDB"],
      "architecture": "...",
      "features": ["...", "..."],
      "learning_outcomes": ["...", "..."],
      "estimated_duration": "2-3 weeks",
      "difficulty": "intermediate",
      "github_starter_tip": "..."
    }}
  ]
}}
"""
