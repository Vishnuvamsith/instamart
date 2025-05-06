import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "default-secret-key")
    SESSION_COOKIE_NAME = 'instamart_fle_session'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True  # Enable in production with HTTPS
    PERMANENT_SESSION_LIFETIME = timedelta(hours=8)
    
    # File Storage
    VECTOR_STORE_FOLDER = 'vector_stores'
    ALLOWED_EXTENSIONS = {'pdf'}
    
    # GenAI Configuration
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL = "gemini-1.5-flash-latest"
    EMBEDDING_MODEL = "models/embedding-001"
    
    # MongoDB Configuration
    MONGODB_URI = (
        "mongodb+srv://root:root@instamart.w8dmaq6.mongodb.net/"
        "ChatHistory?"
        "retryWrites=true&"
        "w=majority&"
        "tls=true&"
        "tlsAllowInvalidCertificates=true"
    )
    MONGODB_DB_NAME = "ChatHistory"
    SESSION_COLLECTION = "chat_sessions"
    MEMORY_COLLECTION = "chat_memory"
    
    # Conversation Limits
    MAX_CONVERSATION_LENGTH = 25