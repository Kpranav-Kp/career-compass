import os
from openai import OpenAI
from typing import List

API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not API_KEY:
    raise RuntimeError("Set OPENROUTER_API_KEY in env")

# Configure client to OpenRouter endpoint
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

# Model id to use. Example: mistralai/mistral-7b-instruct:free
MODEL_ID = "mistralai/mistral-7b-instruct:free"

def call_mistral_chat(prompt: str, max_tokens: int = 256, temperature: float = 0.0) -> str:
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=temperature,
    )
    text = response.choices[0].message.content
    # ensure string
    if isinstance(text, bytes):
        text = text.decode("utf-8", errors="ignore")
    return text.strip()

# Helpers to structure prompts
def extract_skills_prompt(resume_text: str) -> str:
    return (
        "You are an expert recruiter. Extract only the candidate's relevant skills "
        "from the following resume text. Return ONLY a JSON array of skill names (no text, no explanation)."
        " Example: [\"Python\", \"SQL\"]\n\n"
        "Resume:\n"
        f"{resume_text}\n\nSkills:"
    )

def recommend_skills_prompt(existing_skills: str, role: str) -> str:
    return (
        "You are an expert career coach. Given these existing skills and the target job role, "
        "suggest up to 5 additional technical or professional skills that would make the candidate a stronger match for the role."
        " Return ONLY a JSON array of skill names (no explanations). If you must pick a single top recommendation, return an array with a single item."
        " Example: [\"System Design\"]\n\n"
        f"Existing skills: {existing_skills}\n"
        f"Target role: {role}\n\nRecommendations:"
    )
