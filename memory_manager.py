from langchain.memory import ConversationBufferMemory
from langchain_mongodb import MongoDBChatMessageHistory
from database import db_manager
from config import Config
import logging

logger = logging.getLogger(__name__)

class MemoryManager:
    def __init__(self):
        self.config = Config()
    
    def get_memory_for_session(self, session_id):
        try:
            message_history = MongoDBChatMessageHistory(
                connection_string=self.config.MONGODB_URI,
                session_id=session_id,
                database_name=self.config.MONGODB_DB_NAME,
                collection_name=self.config.MEMORY_COLLECTION
            )
            print(message_history)
            
            # Ensure TTL index exists
            db_manager.get_collection(self.config.MEMORY_COLLECTION).create_index(
                "created_at",
                expireAfterSeconds=86400  # 24 hours
            )
            
            return ConversationBufferMemory(
                chat_memory=message_history,
                memory_key="chat_history",
                return_messages=True,
                input_key="question",
                output_key="answer"
            )
        except Exception as e:
            logger.error(f"Memory init error: {str(e)}")
            # Fallback to in-memory storage
            return ConversationBufferMemory()

memory_manager = MemoryManager()