from typing import List, Dict
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import json
import os

def create_skill_roadmap(skills: List[str]) -> Dict:
    """
    Creates a detailed learning roadmap for the given skills.
    Returns a structured roadmap with learning paths and resources.
    """
    llm = ChatOpenAI(
        model="gpt-4-1106-preview",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.7
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a career development expert. Create a detailed learning roadmap for the given skills.
        Structure the response as JSON with the following format:
        {
            "roadmap": {
                "skill_name": {
                    "levels": [
                        {
                            "level": "Beginner/Intermediate/Advanced",
                            "description": "What to learn at this level",
                            "resources": ["Course/Book/Tutorial links"],
                            "projects": ["Suggested projects to build"],
                            "timeframe": "Estimated time to complete this level"
                        }
                    ],
                    "market_relevance": "Current market demand and future outlook",
                    "prerequisites": ["Required foundational skills"]
                }
            }
        }"""),
        ("human", f"Create a learning roadmap for these skills: {', '.join(skills)}")
    ])

    response = llm.invoke(prompt.format())
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        return {"error": "Failed to generate roadmap"}

def analyze_market_relevance(skills: List[str]) -> Dict:
    """
    Analyzes the market relevance of given skills using current job market data.
    Returns relevance scores and insights for each skill.
    """
    llm = ChatOpenAI(
        model="gpt-4-1106-preview",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.3
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", """Analyze the market relevance of the given skills.
        Return the analysis as JSON with this format:
        {
            "skills": {
                "skill_name": {
                    "relevance_score": 1-10,
                    "trend": "growing/stable/declining",
                    "industries": ["relevant industries"],
                    "related_roles": ["job titles"],
                    "complementary_skills": ["skills that pair well"],
                    "insights": "Brief market analysis"
                }
            }
        }"""),
        ("human", f"Analyze market relevance for these skills: {', '.join(skills)}")
    ])

    response = llm.invoke(prompt.format())
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        return {"error": "Failed to analyze market relevance"}