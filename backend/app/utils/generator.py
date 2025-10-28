import os
from openai import OpenAI
from typing import List

API_KEY = os.environ.get("OPENROUTER_API_KEY")

# Configure client lazily so missing env at import time doesn't crash the app.
def _get_openrouter_client():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("Set OPENROUTER_API_KEY in env to use OpenRouter calls")
    return OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

# Model id to use. Example: mistralai/mistral-7b-instruct:free
MODEL_ID = "mistralai/mistral-7b-instruct:free"

def call_mistral_chat(prompt: str, max_tokens: int = 256, temperature: float = 0.0) -> str:
    # Create client on-demand. This raises a helpful error if the API key is missing.
    client = _get_openrouter_client()
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
    # Improved, role-specific recommendation prompt.
    # - Ask the model to consider seniority, industry, and time-horizon.
    # - Instruct to exclude existing skills and return a concise JSON array of skill names.
    # - Prefer skills that directly increase hireability (tools, frameworks, platform, and high-impact adjacent skills).
    return (
        "You are an expert hiring advisor and career coach who knows the exact skills hiring managers look for across industries.\n"
        "Task: Given the candidate's existing skills and the exact target role (which may include seniority and industry), recommend 3-5 additional concrete skills that will most increase this candidate's hireability for that specific role.\n"
        "Guidelines:\n"
        "- Do NOT repeat any skill already present in the existing skills.\n"
        "- Consider seniority (e.g., 'Senior' -> prioritize architecture, leadership, system design; 'Junior' -> prioritize hands-on tools and frameworks).\n"
        "- Consider industry when present (e.g., 'fintech' -> prioritize security/compliance, 'healthcare' -> data privacy/standards).\n"
        "- Prioritize transferable, high-impact skills (platforms, frameworks, cloud, data tooling, testing/CI, observability) and avoid vague concepts.\n"
        "Output: Return ONLY a compact JSON array of skill names (strings), e.g. [\"Skill A\", \"Skill B\"]. No explanations, no extra text.\n\n"
        f"Existing skills: {existing_skills}\n"
        f"Target role: {role}\n\nRecommendations:"
    )
