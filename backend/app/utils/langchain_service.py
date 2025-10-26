"""
LangChain integration scaffold for Career Compass

This file contains example functions to:
- embed and persist resume text (RAG ingestion)
- run a retrieval-augmented generation query
- create a roadmap + project ideas generator

This is a scaffold with defensive imports and clear instructions. You must install the required packages before using these functions (see README_LANGCHAIN.md).

NOTE: This file intentionally avoids importing heavy dependencies at module import time so the project can still run if langchain and other packages are not installed. Each function performs local imports and will raise a helpful RuntimeError if dependencies are missing.

Recommended packages (backend venv):
  pip install langchain sentence-transformers faiss-cpu chromadb openai

Environment variables used:
  - OPENROUTER_API_KEY (or OPENAI_API_KEY) for model + generation
  - PERSIST_DIR (optional) location to persist vectorstore

Adapt and tune the prompts and models for your costs and accuracy needs.
"""

from typing import Optional, List, Dict
import os
import logging

logger = logging.getLogger(__name__)

PERSIST_DIR = os.getenv("PERSIST_DIR", os.path.join(os.path.dirname(__file__), "../.vectordb"))


def _require_langchain():
    try:
        import langchain  # noqa: F401
    except Exception as e:
        raise RuntimeError(
            "LangChain (and its dependencies) are required for langchain_service. "
            "Install with: pip install langchain sentence-transformers faiss-cpu chromadb openai"
        ) from e


def ingest_resume_text(resume_id: int, text: str, persist: bool = True) -> Dict:
    """Embed and store resume text in a local vectorstore.

    This creates small chunks from the resume text, embeds them and persists into a FAISS/Chroma store.

    Returns a summary dict with counts and the persist location.
    """
    _require_langchain()
    # Local imports to avoid breaking the rest of the app if deps are missing
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS
    from langchain.docstore.document import Document

    # Choose embedding model (uses sentence-transformers under the hood)
    embed_model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    embeddings = HuggingFaceEmbeddings(model_name=embed_model_name)

    # Split text into reasonable chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)

    docs = [Document(page_content=c, metadata={"resume_id": resume_id}) for c in chunks]

    # Build or load FAISS index
    if os.path.exists(PERSIST_DIR) and os.listdir(PERSIST_DIR):
        try:
            store = FAISS.load_local(PERSIST_DIR, embeddings)
        except Exception:
            store = FAISS.from_documents(docs, embeddings)
    else:
        store = FAISS.from_documents(docs, embeddings)

    if persist:
        os.makedirs(PERSIST_DIR, exist_ok=True)
        store.save_local(PERSIST_DIR)

    return {"stored_chunks": len(docs), "persist_dir": PERSIST_DIR}


def get_rag_answer(query: str, k: int = 4) -> Dict:
    """Run a Retrieval-Augmented Generation query.

    - Retrieves top-k chunks from the vectorstore.
    - Runs the generator model to produce an answer.

    Returns: dict with 'query', 'docs' (retrieved strings), and 'answer' (generated text).
    """
    _require_langchain()
    # Local imports
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS
    from langchain.chat_models import ChatOpenAI
    from langchain.chains import RetrievalQA

    embeddings = HuggingFaceEmbeddings(model_name=os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2"))

    if not os.path.exists(PERSIST_DIR) or not os.listdir(PERSIST_DIR):
        raise RuntimeError("Vectorstore not found. Please call ingest_resume_text first to populate the store.")

    store = FAISS.load_local(PERSIST_DIR, embeddings)
    retriever = store.as_retriever(search_kwargs={"k": k})

    # Use an LLM for generation. We support OpenAI/OpenRouter via ChatOpenAI (configure via env)
    model_name = os.getenv("GEN_MODEL_NAME", "gpt-4o-mini")
    # ChatOpenAI from langchain uses OPENAI_API_KEY; if you're using OpenRouter set OPENAI_API_KEY to your OpenRouter key
    llm = ChatOpenAI(model_name=model_name, temperature=float(os.getenv("GEN_TEMPERATURE", "0.2")))

    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
    answer = qa.run(query)

    docs_texts = [d.page_content for d in store.similarity_search(query, k=k)]

    return {"query": query, "docs": docs_texts, "answer": answer}


def generate_roadmap_and_projects(resume_text: str, role: Optional[str] = None) -> Dict:
    """Generate a learning roadmap and project ideas based on resume_text and optional role.

    This uses an LLM with a focused prompt that asks for:
      - prioritized skill gaps
      - estimated learning time per skill (e.g., beginner->intermediate in weeks/months)
      - 2-3 small real-world project ideas that map to the skills

    Returns a structured dict with recommended_skills, roadmap (skill->time), and projects.
    """
    _require_langchain()
    from langchain.chat_models import ChatOpenAI

    model_name = os.getenv("ROADMAP_MODEL_NAME", os.getenv("GEN_MODEL_NAME", "gpt-4o-mini"))
    llm = ChatOpenAI(model_name=model_name, temperature=float(os.getenv("ROADMAP_TEMPERATURE", "0.3")))

    role_section = f"Target role: {role}\n" if role else ""

    prompt = f"""
You are a career coach. Given the candidate resume text below, identify 5 key skills they should learn or improve to match the target role, estimate how long (in weeks/months) it would take to reach a solid intermediate level for each skill (assuming 5-10 hrs/week), and suggest 2 real-world project ideas (with short descriptions and suggested tech stack) that apply these skills.

{role_section}
Resume text:
{resume_text}

Return the result as JSON with keys: recommended_skills (list of strings), roadmap (list of {{skill, estimate}}), projects (list of {{title, description, stack}}).
"""

    response = llm.generate([{"role": "user", "content": prompt}])
    # langchain ChatOpenAI generate() returns a Generation object — extract text safely
    text = ""
    try:
        text = response.generations[0][0].text
    except Exception:
        try:
            # Fallback for older interface
            text = response[0].text
        except Exception:
            text = ""

    # Try to parse JSON from LLM output. If it fails, return raw text in 'raw' key
    import json

    result = {"raw": text}
    try:
        parsed = json.loads(text)
        result.update(parsed)
    except Exception:
        logger.warning("Could not parse LLM output as JSON; returning raw text.")

    return result


# Utility: small helper to inspect the vectorstore contents (for debugging)
def list_vectorstore_docs(limit: int = 10) -> List[str]:
    _require_langchain()
    from langchain.embeddings import HuggingFaceEmbeddings
    from langchain.vectorstores import FAISS

    embeddings = HuggingFaceEmbeddings(model_name=os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2"))
    if not os.path.exists(PERSIST_DIR) or not os.listdir(PERSIST_DIR):
        return []
    store = FAISS.load_local(PERSIST_DIR, embeddings)
    docs = []
    for doc in store.docstore._dict.values():
        docs.append(doc.page_content)
        if len(docs) >= limit:
            break
    return docs
