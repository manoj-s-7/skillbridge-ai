"""AI prompt templates for resume analysis."""


def get_resume_analysis_prompt(resume_text: str) -> str:
    return f"""
You are an expert ATS (Applicant Tracking System) analyzer and professional career coach.

Analyze the following resume text and return a comprehensive JSON analysis.

RESUME TEXT:
{resume_text}

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{{
  "parsed_data": {{
    "name": "...",
    "email": "...",
    "phone": "...",
    "education": [
      {{"degree": "...", "institution": "...", "year": "..."}}
    ],
    "experience": [
      {{"title": "...", "company": "...", "duration": "...", "description": "..."}}
    ],
    "projects": [
      {{"name": "...", "description": "...", "tech_stack": ["..."]}}
    ],
    "skills": ["..."],
    "certifications": ["..."],
    "achievements": ["..."]
  }},
  "ats_score": 75,
  "detected_skills": ["Python", "React", "..."],
  "weaknesses": [
    "Missing quantifiable achievements",
    "No LinkedIn URL",
    "..."
  ],
  "suggestions": [
    "Add metrics to your project descriptions (e.g., 'improved performance by 40%')",
    "Include a professional summary at the top",
    "..."
  ],
  "keyword_density": {{
    "Python": 5,
    "React": 3
  }}
}}

ATS Score Criteria (be strict, real-world standards):
- 90-100: Excellent ATS compatibility
- 70-89: Good, minor improvements needed
- 50-69: Average, significant improvements needed
- Below 50: Poor ATS compatibility

Be thorough, realistic, and actionable in your analysis.
"""


def get_certification_analysis_prompt(certifications: list, target_role: str) -> str:
    cert_list = "\n".join([f"- {c}" for c in certifications])
    return f"""
You are a professional certification evaluator and career coach.

Evaluate the following certifications for a person targeting the role of: {target_role}

CERTIFICATIONS:
{cert_list}

Return ONLY valid JSON:
{{
  "overall_score": 72,
  "certifications_analysis": [
    {{
      "name": "...",
      "relevance_score": 85,
      "credibility": "high|medium|low",
      "industry_value": "...",
      "role_alignment": "...",
      "recommendation": "..."
    }}
  ],
  "missing_key_certifications": ["..."],
  "overall_recommendation": "..."
}}
"""
