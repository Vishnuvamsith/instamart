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
    DOC_COLLECTION="pdffile"
    
    # Conversation Limits
    MAX_CONVERSATION_LENGTH = 25


    # DATASTAX_SESSION_ID = "instamart-session-001"
    # DATASTAX_KEYSPACE = "Instamart"
    # DATASTAX_TABLE = "HRMS_DOCS"
    # DATASTAX_SECURE_BUNDLE_PATH = os.path.abspath("./secure-connect-instamart")
    # DATASTAX_USERNAME = "afWAnMzfhIfCipocFZFtdUyC"  # Your Astra DB username
    # DATASTAX_PASSWORD = "mBiGN-F-H4B-czBRQ.HnIZAuLFTO8IEQdFkBWtyrB1Ptb-G25R.F8E5gd.WbLgGcNojwHl+gep,TWg-chi17ZenpdWbkPezHDg7egkLcGBjZkFH7N7oaO5ob-AEJ9nQW"
    ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
    ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
    ASTRA_DB_KEYSPACE = os.getenv("ASTRA_DB_KEYSPACE")


    LITELLM_ENDPOINT = "https://litellm.swiggyops.de"
    CLAUDE_KEY = os.getenv("ANTHROPIC_API_KEY")
    ANTHROPIC_MODEL_NAME = "bedrock-claude-3-7-sonnet"

    AWS_REGION=os.getenv("AWS_REGION")
    AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_SESSION_TOKEN=os.getenv("AWS_SESSION_TOKEN")
    AWS_PROFILE_NAME = "AWSSandboxAdmin-978983596161"


    DYNAMO_SESSION_TABLE = "ChatSessions"
    DYNAMO_MEMORY_TABLE = "ChatMemory"
    DYNAMO_DOC_TABLE = "MetaData"
    DYNAMO_PDF_TABLE="PDFDocuments"
    DYNAMO_VECTOR_METADATA_TABLE="vector_meta_data"
    DYNAMO_INSTAMART_USERS="InstamartUsers"


    S3_BUCKET="imhrmsdocs"



