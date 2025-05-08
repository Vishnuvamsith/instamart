# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_community.vectorstores import FAISS
# from config import Config
# import os

# class VectorStoreManager:
#     def __init__(self):
#         self.config = Config()
#         self.embeddings = GoogleGenerativeAIEmbeddings(model=self.config.EMBEDDING_MODEL)
    
#     def create_vector_store(self, text_chunks, path):
#         vector_store = FAISS.from_texts(text_chunks, embedding=self.embeddings)
#         vector_store.save_local(path)
#         return path
    
#     def load_vector_store(self, vector_store_path):
#         return FAISS.load_local(
#             vector_store_path, 
#             self.embeddings, 
#             allow_dangerous_deserialization=True
#         )

# vector_store_manager = VectorStoreManager()
import os
import numpy as np
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import Config
from database import db_manager

load_dotenv()

class VectorStoreManager:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model=Config.EMBEDDING_MODEL)
        self.collection = None

    def add_to_vector_store(self, text_chunks, source_name=None):
        try:
            self.collection=db_manager.get_collection(Config.DOC_COLLECTION)
        except:
            print("couldnt connect")
        vectors = self.embeddings.embed_documents(text_chunks)
        docs = []

        for i, chunk in enumerate(text_chunks):
            docs.append({
                "text": chunk,
                "embedding": vectors[i],
                "source": source_name or "unknown"
            })

        self.collection.insert_many(docs)

    def semantic_search(self, query, k=3):
        try:
            self.collection=db_manager.get_collection(Config.DOC_COLLECTION)
        except:
            print("couldnt connect")
        query_vector = self.embeddings.embed_query(query)

        all_docs = list(self.collection.find({}))
        for doc in all_docs:
            doc["score"] = self._cosine_similarity(query_vector, doc["embedding"])

        sorted_docs = sorted(all_docs, key=lambda x: x["score"], reverse=True)
        return sorted_docs[:k]

    def _cosine_similarity(self, vec1, vec2):
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

vector_store_manager = VectorStoreManager()


