import requests
from typing import List, Dict, Tuple
from django.conf import settings


def query_lightcast_for_skill(skill: str, api_key: str) -> List[Dict]:
    """
    Query Lightcast skill search endpoint for a single skill string.
    Returns a list of dicts with at least 'name' and optionally 'score'.

    If the Lightcast response shape differs, this function will try to
    extract sensible fallback fields. Network errors will raise.
    """
    if not skill:
        return []

    url = "https://api.lightcast.io/v1/skills/search"
    params = {"query": skill}
    headers = {"Authorization": f"Bearer {api_key}"}

    resp = requests.get(url, params=params, headers=headers, timeout=10)
    if resp.status_code != 200:
        return []

    data = resp.json()
    # Try common shapes: {"data": [...] } or {"results": [...]}
    items = data.get("data") or data.get("results") or []
    results = []
    for it in items:
        if not isinstance(it, dict):
            continue
        name = it.get("name") or it.get("skill") or it.get("label")
        # score field may be under different names
        score = it.get("score") or it.get("relevance") or it.get("confidence")
        try:
            if score is not None:
                score = float(score)
        except Exception:
            score = None

        if name:
            results.append({"name": name, "score": score})

    return results


def aggregate_lightcast_skills(extracted_skills: List[str], top_n: int = 10) -> List[str]:
    """
    For each skill in `extracted_skills`, query Lightcast and aggregate the
    returned related skills. Aggregation strategy:
      - If Lightcast returns a numeric score for a skill, sum scores across
        all queries.
      - If score is missing, count appearances (treat as 1.0).
    Returns a sorted list of the top_n skill names by aggregated score.

    Requires Django setting `LIGHTCAST_API_KEY` to be set. If not set,
    returns an empty list.
    """
    api_key = getattr(settings, "LIGHTCAST_API_KEY", None)
    if not api_key or not extracted_skills:
        return []

    totals: Dict[str, float] = {}

    for skill in extracted_skills:
        try:
            items = query_lightcast_for_skill(skill, api_key)
        except Exception:
            # If a single query fails, continue with others
            items = []

        for it in items:
            name = it.get("name")
            if not name:
                continue
            score = it.get("score")
            if score is None:
                score_val = 1.0
            else:
                try:
                    score_val = float(score)
                except Exception:
                    score_val = 1.0

            totals[name] = totals.get(name, 0.0) + score_val

    # If no totals found, return empty
    if not totals:
        return []

    # Sort by aggregated score descending and return top_n names
    sorted_names = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)
    return [name for name, _ in sorted_names[:top_n]]
