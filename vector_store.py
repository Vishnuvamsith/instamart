from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from config import Config
import os

class VectorStoreManager:
    def __init__(self):
        self.config = Config()
        self.embeddings = GoogleGenerativeAIEmbeddings(model=self.config.EMBEDDING_MODEL)
    
    def create_vector_store(self, text_chunks, path):
        vector_store = FAISS.from_texts(text_chunks, embedding=self.embeddings)
        vector_store.save_local(path)
        return path
    
    def load_vector_store(self, vector_store_path):
        return FAISS.load_local(
            vector_store_path, 
            self.embeddings, 
            allow_dangerous_deserialization=True
        )

vector_store_manager = VectorStoreManager()