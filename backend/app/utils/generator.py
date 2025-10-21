import os
from openai import OpenAI
from typing import List

OPENROUTER_API_KEY = "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"

API_KEY = OPENROUTER_API_KEY
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
        "from the following resume text. Return a comma-separated list of skill names, "
        "no explanations, no extra words.\n\n"
        "Resume:\n"
        f"{resume_text}\n\nSkills:"
    )

def recommend_skills_prompt(existing_skills: str, role: str) -> str:
    return (
        "You are an expert career coach. Given these existing skills and the target job role, "
        "suggest up to 5 additional technical or professional skills (comma-separated) that would "
        "make the candidate a stronger match for the role. Avoid explanations — return only a "
        "comma-separated list.\n\n"
        f"Existing skills: {existing_skills}\n"
        f"Target role: {role}\n\nRecommendations:"
    )
