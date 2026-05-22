"""AI prompt templates for roadmap generation."""


def get_roadmap_prompt(target_role: str, current_skills: list, missing_skills: list, duration_weeks: int) -> str:
    current_str = ", ".join(current_skills) if current_skills else "None listed"
    missing_str = ", ".join([s["skill"] if isinstance(s, dict) else s for s in missing_skills]) if missing_skills else "To be determined"
    return f"""
You are a world-class career development coach and learning path designer.

Create a detailed {duration_weeks}-week learning roadmap for:
- Target Role: {target_role}
- Current Skills: {current_str}
- Skills to Learn: {missing_str}

Return ONLY valid JSON:
{{
  "target_role": "{target_role}",
  "duration_weeks": {duration_weeks},
  "weekly_plan": [
    {{
      "week": 1,
      "title": "Foundation Setup",
      "focus": "...",
      "tasks": [
        "Install and configure development environment",
        "Complete Python basics refresher (3 hours)",
        "Watch: CS50 Python - Week 1"
      ],
      "resources": [
        "Python Official Docs: https://docs.python.org",
        "FreeCodeCamp Python Course",
        "Book: Automate the Boring Stuff"
      ],
      "milestone": "Can write basic Python scripts independently",
      "estimated_hours": 10
    }}
  ],
  "monthly_summary": [
    "Month 1: Core foundations and environment setup",
    "Month 2: Building projects and applying concepts",
    "Month 3: Advanced topics and job preparation"
  ],
  "key_milestones": [
    "Week 2: Complete first hands-on project",
    "Week 6: Deploy a working application",
    "Week {duration_weeks}: Portfolio ready, apply for jobs"
  ],
  "recommended_projects": [
    "Build a REST API using FastAPI",
    "Create a data pipeline project"
  ]
}}

Generate all {duration_weeks} weeks. Be specific about resources (real URLs where possible).
Ensure progressive difficulty. Balance theory (30%) with practice (70%).
"""
