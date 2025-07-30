# from PyPDF2 import PdfReader
# from io import BytesIO
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# import os
# from config import Config

# class DocumentProcessor:
#     def __init__(self):
#         self.config = Config()
#         os.makedirs(self.config.VECTOR_STORE_FOLDER, exist_ok=True)
    
#     def allowed_file(self, filename):
#         return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.config.ALLOWED_EXTENSIONS
    
#     def extract_text_from_pdf(self, file_stream):
#         text = ""
#         reader = PdfReader(file_stream)
#         for page in reader.pages:
#             text += page.extract_text() or ""
#         return text
    
#     def get_text_chunks(self, text):
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=100,
#             separators=["\n\n", "\n", " ", ""]
#         )
#         return text_splitter.split_text(text)

# document_processor = DocumentProcessor()

# from PyPDF2 import PdfReader
# from io import BytesIO
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from vector_store import vector_store_manager

# class DocumentProcessor:
#     def extract_text_from_pdf(self, file_stream):
#         text = ""
#         reader = PdfReader(file_stream)
#         for page in reader.pages:
#             text += page.extract_text() or ""
#         return text

#     def get_text_chunks(self, text):
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=100,
#             separators=["\n\n", "\n", " ", ""]
#         )
#         return text_splitter.split_text(text)

#     def process_and_store(self, file_stream):
#         text = self.extract_text_from_pdf(file_stream)
#         chunks = self.get_text_chunks(text)
#         print(1)
#         vector_store_manager.add_to_vector_store(chunks)

# document_processor = DocumentProcessor()
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
# from vector_store import vector_store_manager



# class DocumentProcessor:
#     def __init__(self):
#         self.file_table = dynamodb_manager.get_table(Config.DYNAMO_PDF_TABLE)

#     def extract_text_from_pdf(self, file_stream):
#         text = ""
#         reader = PdfReader(file_stream)
#         for page in reader.pages:
#             text += page.extract_text() or ""
#         return text

#     def get_text_chunks(self, text):
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=100,
#             separators=["\n\n", "\n", " ", ""]
#         )
#         return text_splitter.split_text(text)

#     def store_file_in_dynamo(self, filename, content_type, data):
#         self.file_table.put_item(Item={
#             "filename": filename,
#             "content_type": content_type,
#             "data": data.read(),
#             "uploaded_at": datetime.utcnow().isoformat()
#         })

#     def process_and_store(self, file_stream, filename, content_type):
#         file_stream.seek(0)
#         self.store_file_in_dynamo(filename, content_type, BytesIO(file_stream.read()))
#         file_stream.seek(0)
#         text = self.extract_text_from_pdf(file_stream)
#         chunks = self.get_text_chunks(text)
#         vector_store_manager.add_to_vector_store(chunks, source_name=filename)


# document_processor = DocumentProcessor()


from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from config import Config
from vector_store import vector_store_manager
from s3_manager import s3_manager
from datetime import datetime

class DocumentProcessor:
    def extract_text_from_pdf(self, file_stream):
        text = ""
        reader = PdfReader(file_stream)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    def get_text_chunks(self, text):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            separators=["\n\n", "\n", " ", ""]
        )
        return splitter.split_text(text)

    def process_and_store(self, file_stream, filename, content_type):
        file_stream.seek(0)
        text = self.extract_text_from_pdf(file_stream)
        chunks = self.get_text_chunks(text)
        vector_store_manager.add_to_vector_store(chunks, source_name=filename)


document_processor = DocumentProcessor()