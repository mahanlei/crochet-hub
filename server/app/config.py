import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crochet_hub.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
