from typing import List, Dict
import json
from .openrouter_service import call_openrouter_api, format_prompt_for_skills_roadmap, format_prompt_for_market_analysis

def create_skill_roadmap(skills: List[str]) -> Dict:
    """
    Creates a detailed learning roadmap for the given skills using Mistral-7B.
    Returns a structured roadmap with learning paths and resources.
    """
    prompt = format_prompt_for_skills_roadmap(skills)
    response = call_openrouter_api(prompt, max_tokens=2000, temperature=0.7)
    
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {"error": "Failed to generate roadmap"}

def analyze_market_relevance(skills: List[str]) -> Dict:
    """
    Analyzes the market relevance of given skills using Mistral-7B.
    Returns relevance scores and insights for each skill.
    """
    prompt = format_prompt_for_market_analysis(skills)
    response = call_openrouter_api(prompt, max_tokens=1500, temperature=0.3)
    
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {"error": "Failed to analyze market relevance"}