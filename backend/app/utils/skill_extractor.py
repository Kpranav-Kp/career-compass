from .model_loader import get_ner_pipeline, generate_skills_with_phi
import re
from io import BytesIO
from PyPDF2 import PdfReader

KNOWN_SKILLS = ["Python", "Java", "React", "Django", "SQL", "Machine Learning", "TensorFlow", "NLP", "AWS", "Git"]

def extract_text_from_pdf(file):
    reader = PdfReader(BytesIO(file.read()))
    return " ".join(page.extract_text() or "" for page in reader.pages)

def extract_skills_from_resume(file, job_role=""):
    text = extract_text_from_pdf(file)
    nlp_pipeline = get_ner_pipeline()
    entities = nlp_pipeline(text)
    found = [e['word'] for e in entities if e['entity'].startswith(('B-', 'I-'))]

    skill_matches = [s for s in KNOWN_SKILLS if re.search(rf"\b{s}\b", text, re.IGNORECASE)]
    extracted_skills = ", ".join(set(found + skill_matches))

    if job_role:
        additional_skills = generate_skills_with_phi(extracted_skills, job_role)
        final_skills = set(extracted_skills.split(", ") + additional_skills.split(","))
        return ", ".join([s.strip() for s in final_skills])

    return extracted_skills
