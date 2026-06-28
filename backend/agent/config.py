import os
from dotenv import load_dotenv
load_dotenv()

MAIN_LLM_MODEL = "openai/gpt-oss-120b"
LIGHT_LLM_MODEL = "openai/gpt-oss-20b"
TRANSLATE_LLM_MODEL = "openai/gpt-oss-20b"

CHROMA_PERSIST_DIR = "./chroma_storage"
CHROMA_COLLECTION = "opportunities"

DATABASE_URL = os.getenv("DATABASE_URL")

RAG_TOP_K = int(os.getenv("RAG_TOP_K", "5"))

GROQ_API_KEY=os.getenv("GROQ_API_KEY")