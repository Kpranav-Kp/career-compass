import os
import json
import requests
from typing import Dict, Any

def call_openrouter_api(prompt: str, max_tokens: int = 1000, temperature: float = 0.7) -> str:
    """
    Call the OpenRouter API with Mistral-7B model.
    """
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "HTTP-Referer": "https://github.com/Kpranav-Kp/career-compass",  # Replace with your deployed URL
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "mistralai/mistral-7b-instruct",  # Using Mistral-7B
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling OpenRouter API: {str(e)}")
        return ""

def format_prompt_for_skills_roadmap(skills: list) -> str:
    """Format the prompt for skill roadmap generation."""
    return f"""Create a detailed learning roadmap for the following skills: {', '.join(skills)}
    
    For each skill, provide:
    1. Learning path with beginner, intermediate, and advanced stages
    2. Specific resources (free preferred) for each stage
    3. Project ideas to practice
    4. Estimated time commitment
    5. Prerequisites needed
    6. Market relevance and industry applications
    
    Format the response as JSON with this structure:
    {{
        "roadmap": {{
            "skill_name": {{
                "levels": [
                    {{
                        "level": "Beginner/Intermediate/Advanced",
                        "description": "What to learn",
                        "resources": ["Free courses/tutorials"],
                        "projects": ["Practice projects"],
                        "timeframe": "Estimated duration"
                    }}
                ],
                "market_relevance": "Current demand and future outlook",
                "prerequisites": ["Required foundation skills"]
            }}
        }}
    }}
    """

def format_prompt_for_market_analysis(skills: list) -> str:
    """Format the prompt for skill market analysis."""
    return f"""Analyze the current market relevance and demand for these skills: {', '.join(skills)}
    
    For each skill provide:
    1. Current market demand score (1-10)
    2. Growth trend (growing/stable/declining)
    3. Key industries using this skill
    4. Complementary skills that increase marketability
    5. Types of roles that require this skill
    6. Short market analysis and future outlook
    
    Format the response as JSON with this structure:
    {{
        "skills": {{
            "skill_name": {{
                "relevance_score": 8,
                "trend": "growing/stable/declining",
                "industries": ["relevant industries"],
                "related_roles": ["job titles"],
                "complementary_skills": ["related skills"],
                "insights": "Market analysis"
            }}
        }}
    }}
    """