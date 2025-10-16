import re
from transformers import pipeline
from io import BytesIO
from PyPDF2 import PdfReader

# Optional: predefined list of known skills
KNOWN_SKILLS = [
    "Python", "Java", "React", "Django", "SQL",
    "Machine Learning", "TensorFlow", "NLP", "AWS", "Git"
]

# Global variable to cache the model
_nlp_pipeline = None

def get_nlp_pipeline():
    """
    Lazily load the Hugging Face NER pipeline only when needed.
    Caches it globally after the first load.
    """
    global _nlp_pipeline
    if _nlp_pipeline is None:
        _nlp_pipeline = pipeline("ner", model="dslim/bert-base-NER")
    return _nlp_pipeline


def extract_text_from_pdf(file):
    """Extracts text from an uploaded PDF file."""
    reader = PdfReader(BytesIO(file.read()))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def extract_skills_from_resume(file):
    """Extracts potential skills from a resume file using NER + known skills."""
    text = extract_text_from_pdf(file)

    # Run the model (only loads the first time)
    nlp_pipeline = get_nlp_pipeline()
    entities = nlp_pipeline(text)

    # Extract named entities and filter them
    found = [e['word'] for e in entities if e['entity'].startswith(('B-', 'I-'))]

    # Filter text for known predefined skills
    skill_matches = [s for s in KNOWN_SKILLS if re.search(rf"\b{s}\b", text, re.IGNORECASE)]

    # Combine and deduplicate
    return ", ".join(set(skill_matches + found))
