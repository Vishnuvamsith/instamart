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
# import os
# import numpy as np
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from config import Config
# from database import db_manager

# load_dotenv()

# class VectorStoreManager:
#     def __init__(self):
#         self.embeddings = GoogleGenerativeAIEmbeddings(model=Config.EMBEDDING_MODEL)
#         self.collection = None

#     def add_to_vector_store(self, text_chunks, source_name=None):
#         try:
#             self.collection=db_manager.get_collection(Config.DOC_COLLECTION)
#         except:
#             print("couldnt connect")
#         vectors = self.embeddings.embed_documents(text_chunks)
#         docs = []

#         for i, chunk in enumerate(text_chunks):
#             docs.append({
#                 "text": chunk,
#                 "embedding": vectors[i],
#                 "source": source_name or "unknown"
#             })

#         self.collection.insert_many(docs)

#     def semantic_search(self, query, k=3):
#         try:
#             self.collection=db_manager.get_collection(Config.DOC_COLLECTION)
#         except:
#             print("couldnt connect")
#         query_vector = self.embeddings.embed_query(query)

#         all_docs = list(self.collection.find({}))
#         for doc in all_docs:
#             doc["score"] = self._cosine_similarity(query_vector, doc["embedding"])

#         sorted_docs = sorted(all_docs, key=lambda x: x["score"], reverse=True)
#         return sorted_docs[:k]

#     def _cosine_similarity(self, vec1, vec2):
#         vec1 = np.array(vec1)
#         vec2 = np.array(vec2)
#         return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

# vector_store_manager = VectorStoreManager()


# import os
# import uuid
# import numpy as np
# from io import BytesIO
# from datetime import datetime
# from dotenv import load_dotenv
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# import faiss
# import pickle
# from config import Config
# from dynamodb_manager import dynamodb_manager

# load_dotenv()

# class VectorStoreManager:
#     def __init__(self):
#         self.embeddings = GoogleGenerativeAIEmbeddings(model=Config.EMBEDDING_MODEL)
#         self.index_file = "index.faiss"
#         self.metadata_file = "index_metadata.pkl"
#         self.index = None
#         self.metadata = []
#         self.table = dynamodb_manager.get_table(Config.DYNAMO_VECTOR_METADATA_TABLE)
#         self._load_or_create_index()

#     def _load_or_create_index(self):
#         if os.path.exists(self.index_file):
#             self.index = faiss.read_index(self.index_file)
#             with open(self.metadata_file, "rb") as f:
#                 self.metadata = pickle.load(f)
#         else:
#             self.index = faiss.IndexFlatL2(768)  # Adjust dim based on embedding
#             self.metadata = []

#     def _save_index(self):
#         faiss.write_index(self.index, self.index_file)
#         with open(self.metadata_file, "wb") as f:
#             pickle.dump(self.metadata, f)

#     def add_to_vector_store(self, text_chunks, source_name=None):
#         vectors = self.embeddings.embed_documents(text_chunks)
#         self.index.add(np.array(vectors).astype("float32"))

#         for i, chunk in enumerate(text_chunks):
#             meta = {
#                 "chunk_id": str(uuid.uuid4()),  # ✅ Updated key
#                 "text": chunk,
#                 "source": source_name or "unknown",
#                 "added_at": datetime.utcnow().isoformat()
#             }
#             self.metadata.append(meta)
#             self.table.put_item(Item=meta)

#         self._save_index()


#     def semantic_search(self, query, k=3):
#         query_vector = np.array(self.embeddings.embed_query(query)).astype("float32")
#         D, I = self.index.search(np.array([query_vector]), k)
#         return [self.metadata[i] for i in I[0] if i < len(self.metadata)]

# vector_store_manager = VectorStoreManager()

import numpy as np
import faiss
import pickle
import uuid
from datetime import datetime
from config import Config
from s3_manager import s3_manager
from io import BytesIO
import os

class VectorStoreManager:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model=Config.EMBEDDING_MODEL)
        self.index_file = "index.faiss"
        self.metadata_file = "index_metadata.pkl"
        self.index = None
        self.metadata = []
        self._load_or_create_index()

    def _load_or_create_index(self):
        try:
            # Download files from S3
            index_bytes = s3_manager.download_file("faiss/index.faiss")
            meta_bytes = s3_manager.download_file("faiss/index_metadata.pkl")
            
            if index_bytes and meta_bytes:
                # Write to local files
                with open(self.index_file, "wb") as f:
                    f.write(index_bytes)
                with open(self.metadata_file, "wb") as f:
                    f.write(meta_bytes)
                
                # Load the index and metadata
                self.index = faiss.read_index(self.index_file)
                with open(self.metadata_file, "rb") as f:
                    self.metadata = pickle.load(f)
                    
                print(f"✅ Loaded existing index with {self.index.ntotal} vectors")
            else:
                # Create new index if files don't exist
                self._create_new_index()
                
        except Exception as e:
            print(f"⚠️ Error loading index from S3: {e}")
            self._create_new_index()

    def _create_new_index(self):
        """Create a new FAISS index"""
        self.index = faiss.IndexFlatL2(768)  # 768 is the embedding dimension
        self.metadata = []
        print("✅ Created new FAISS index")

    def _save_index(self):
        """Save index and metadata to local files and upload to S3"""
        try:
            # Save to local files
            faiss.write_index(self.index, self.index_file)
            with open(self.metadata_file, "wb") as f:
                pickle.dump(self.metadata, f)

            # Upload to S3 using BytesIO streams
            with open(self.index_file, "rb") as f:
                index_stream = BytesIO(f.read())
                s3_manager.upload_file(index_stream, "faiss/index.faiss")
                
            with open(self.metadata_file, "rb") as f:
                meta_stream = BytesIO(f.read())
                s3_manager.upload_file(meta_stream, "faiss/index_metadata.pkl")
                
            print("✅ Index and metadata saved to S3")
            
        except Exception as e:
            print(f"❌ Error saving index to S3: {e}")
            raise

    def add_to_vector_store(self, text_chunks, source_name=None):
        """Add text chunks to the vector store"""
        if not text_chunks:
            return
            
        try:
            # Generate embeddings
            vectors = self.embeddings.embed_documents(text_chunks)
            vectors_array = np.array(vectors).astype("float32")
            
            # Add to FAISS index
            self.index.add(vectors_array)

            # Add metadata
            for i, chunk in enumerate(text_chunks):
                meta = {
                    "chunk_id": str(uuid.uuid4()),
                    "text": chunk,
                    "source": source_name,
                    "added_at": datetime.utcnow().isoformat()
                }
                self.metadata.append(meta)

            # Save updated index
            self._save_index()
            print(f"✅ Added {len(text_chunks)} chunks to vector store")
            
        except Exception as e:
            print(f"❌ Error adding to vector store: {e}")
            raise

    def semantic_search(self, query, k=3):
        """Perform semantic search on the vector store"""
        if self.index.ntotal == 0:
            print("⚠️ Vector store is empty")
            return []
            
        try:
            # Generate query embedding
            query_vector = np.array(self.embeddings.embed_query(query)).astype("float32")
            query_vector = query_vector.reshape(1, -1)
            
            # Search
            distances, indices = self.index.search(query_vector, min(k, self.index.ntotal))
            
            # Return results
            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.metadata) and idx != -1:  # -1 indicates no match found
                    result = self.metadata[idx].copy()
                    result["distance"] = float(distances[0][i])
                    results.append(result)
                    
            return results
            
        except Exception as e:
            print(f"❌ Error during semantic search: {e}")
            return []

    def get_stats(self):
        """Get statistics about the vector store"""
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "total_metadata": len(self.metadata),
            "embedding_dimension": self.index.d if self.index else 0
        }

vector_store_manager = VectorStoreManager()