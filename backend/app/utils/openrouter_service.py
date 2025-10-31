import os
import json
from openai import OpenAI
from typing import List, Dict, Any

def _get_openrouter_client():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("Set OPENROUTER_API_KEY in env to use OpenRouter calls")
    return OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

EXTRACTION_MODEL = "mistralai/mistral-7b-instruct:free"  # Fast, good for extraction
ROADMAP_MODEL = "meta-llama/llama-3.2-3b-instruct:free"  # Better for structured content
MARKET_MODEL = "openai/gpt-oss-20b:free" # Best for analysis and insights
RECOMMENDATION_MODEL = "mistralai/mistral-7b-instruct:free"  # Good for recommendations

def call_openrouter(prompt: str, model: str, max_tokens: int = 1000, temperature: float = 0.7) -> str:
    """Generic function to call OpenRouter with any model."""
    client = _get_openrouter_client()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        text = response.choices[0].message.content
        if isinstance(text, bytes):
            text = text.decode("utf-8", errors="ignore")
        return text.strip()
    except Exception as e:
        print(f"Error calling OpenRouter with model {model}: {str(e)}")
        return ""

def extract_skills_from_resume(resume_text: str) -> List[str]:
    """Extract skills from resume using Mistral 7B."""
    prompt = (
        "You are an expert recruiter. Extract only the candidate's relevant technical and professional skills "
        "from the following resume text. Return ONLY a JSON array of skill names (no explanation, no extra text).\n"
        "Example format: [\"Python\", \"SQL\", \"Project Management\"]\n\n"
        f"Resume:\n{resume_text}\n\nSkills (JSON array only):"
    )
    
    response = call_openrouter(prompt, EXTRACTION_MODEL, max_tokens=400, temperature=0.0)
    
    try:
        skills = json.loads(response)
        if isinstance(skills, list):
            return [s.strip() for s in skills if isinstance(s, str) and s.strip()]
    except:
        return [s.strip() for s in response.split(",") if s.strip()]
    
    return []

def recommend_skills(existing_skills: List[str], role: str) -> List[str]:
    """Recommend additional skills using Mistral 7B."""
    prompt = (
        "You are an expert career advisor. Given a candidate's existing skills and target role, "
        "recommend only upto 5 additional high-impact skills that will significantly increase their hireability.\n\n"
        "Rules:\n"
        "- Do NOT repeat existing skills\n"
        "- Focus on practical, in-demand skills\n"
        "- Consider the seniority level in the role\n"
        "- Prioritize tools, frameworks, and technologies\n"
        "- Return ONLY a JSON array of skill names\n\n"
        f"Existing skills: {', '.join(existing_skills)}\n"
        f"Target role: {role}\n\n"
        "Recommended skills (JSON array only):"
    )
    
    response = call_openrouter(prompt, RECOMMENDATION_MODEL, max_tokens=200, temperature=0.3)
    
    try:
        recs = json.loads(response)
        if isinstance(recs, list):
            existing_lower = {s.lower() for s in existing_skills}
            return [r.strip() for r in recs if isinstance(r, str) and r.strip().lower() not in existing_lower]
    except:
        return []
    
    return []

def generate_skill_roadmap(skills: List[str]) -> Dict[str, Any]:
    """Generate learning roadmap using Llama 3.2."""
    prompt = f"""Create a detailed learning roadmap for these skills: {', '.join(skills)}

For EACH skill, provide:
1. Three levels: Beginner, Intermediate, Advanced
2. Clear description for each level
3. 2-3 specific project ideas per level
4. Free learning resources (courses, tutorials, docs)
5. Realistic timeframe for each level
6. Prerequisites needed
7. Current market relevance

Return ONLY valid JSON in this EXACT format:
{{
  "roadmap": {{
    "Skill Name": {{
      "levels": [
        {{
          "level": "Beginner",
          "description": "What to learn at this stage",
          "projects": ["Project 1", "Project 2"],
          "resources": ["Free resource 1", "Free resource 2"],
          "timeframe": "X-Y months"
        }},
        {{
          "level": "Intermediate",
          "description": "What to learn at this stage",
          "projects": ["Project 1", "Project 2"],
          "resources": ["Free resource 1", "Free resource 2"],
          "timeframe": "X-Y months"
        }},
        {{
          "level": "Advanced",
          "description": "What to learn at this stage",
          "projects": ["Project 1", "Project 2"],
          "resources": ["Free resource 1", "Free resource 2"],
          "timeframe": "X-Y months"
        }}
      ],
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
      "market_relevance": "Current demand and applications"
    }}
  }}
}}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations."""

    response = call_openrouter(prompt, ROADMAP_MODEL, max_tokens=2500, temperature=0.7)
    
    try:
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        return json.loads(cleaned)
    except Exception as e:
        print(f"Failed to parse roadmap JSON: {e}")
        print(f"Response was: {response[:500]}")
        return {"roadmap": {}}

def analyze_market_demand(skills: List[str]) -> Dict[str, Any]:
    """Analyze market demand using Gemma 2."""
    prompt = f"""Analyze the current job market for these skills: {', '.join(skills)}

For EACH skill, provide:
1. Market demand score (1-10 scale)
2. Growth trend (growing/stable/declining)
3. Key industries hiring for this skill
4. Common job roles requiring this skill
5. Complementary skills that enhance marketability
6. Brief market insights and future outlook

Return ONLY valid JSON in this EXACT format:
{{
  "skills": {{
    "Skill Name": {{
      "relevance_score": 8,
      "trend": "growing",
      "industries": ["Industry 1", "Industry 2", "Industry 3"],
      "related_roles": ["Role 1", "Role 2", "Role 3"],
      "complementary_skills": ["Skill 1", "Skill 2", "Skill 3"],
      "insights": "Detailed market analysis and outlook"
    }}
  }}
}}

IMPORTANT: Return ONLY the JSON object, no markdown, no explanations."""

    response = call_openrouter(prompt, MARKET_MODEL, max_tokens=2000, temperature=0.5)
    
    try:
        cleaned = response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        return json.loads(cleaned)
    except Exception as e:
        print(f"Failed to parse market analysis JSON: {e}")
        print(f"Response was: {response[:500]}")
        return {"skills": {}}