from pymongo import MongoClient
from config import Config
import logging

logger = logging.getLogger(__name__)

class MongoDBManager:
    def __init__(self):
        self.config = Config()
        self.client = None
        self.db = None
        self._connect()  # Connect immediately on initialization
        
    def _connect(self):
        try:
            self.client = MongoClient(
                self.config.MONGODB_URI,
                connectTimeoutMS=30000,
                socketTimeoutMS=None,
                serverSelectionTimeoutMS=5000,
                maxPoolSize=50,
                retryWrites=True,
                appName="Instamart-FLE-Bot"
            )
            # Verify connection actually works
            self.client.admin.command('ping')
            self.db = self.client[self.config.MONGODB_DB_NAME]
            logger.info("✅ MongoDB connection established")
        except Exception as e:
            logger.error(f"❌ MongoDB connection failed: {str(e)}")
            raise
    
    def get_collection(self, collection_name):
        if self.db is None:  # Proper None check instead of truthiness test
            self._connect()
        return self.db[collection_name]
    
    def is_connected(self):
        try:
            self.client.admin.command('ping')
            return True
        except Exception:
            return False
    
    def close(self):
        if self.client is not None:
            self.client.close()

# Singleton instance
db_manager = MongoDBManager()