import os
from llama_cpp import Llama
from transformers import pipeline

# Absolute path to project directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_CACHE_DIR = os.path.join(BASE_DIR, "..", "model_cache")  # points to model_cache/

# Global instances
_ner_pipeline = None
_phi_model = None

def get_ner_pipeline():
    """
    Loads the BERT NER model from local directory (model_cache/ner)
    """
    global _ner_pipeline
    if _ner_pipeline is None:
        ner_model_path = os.path.join(MODEL_CACHE_DIR, "ner")
        print(f"Loading NER model from: {ner_model_path}")
        _ner_pipeline = pipeline("ner", model=ner_model_path, tokenizer=ner_model_path)
    return _ner_pipeline


def get_phi_model():
    """
    Loads Phi-3 model from local directory (model_cache/phi)
    """
    global _phi_model
    if _phi_model is None:
        phi_model_path = os.path.join(MODEL_CACHE_DIR, "phi", "phi-3-mini.gguf")  # update filename to match yours
        print(f"Loading Phi model from: {phi_model_path}")
        _phi_model = Llama(
            model_path=phi_model_path,
            n_ctx=4096,
            n_threads=6,   # match your CPU cores
            verbose=False
        )
    return _phi_model


def generate_skills_with_phi(existing_skills, job_role):
    """
    Use Phi-3 to suggest additional skills based on extracted skills + job role.
    """
    llm = get_phi_model()
    prompt = f"""
You are a recruitment assistant. Based on the skills: {existing_skills}
and job role: {job_role}
Suggest only 5 most relevant missing technical skills in a comma-separated list. No explanations.
"""
    response = llm(prompt)
    return response["choices"][0]["text"].strip()
