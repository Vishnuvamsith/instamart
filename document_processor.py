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

from PyPDF2 import PdfReader
from io import BytesIO
from langchain.text_splitter import RecursiveCharacterTextSplitter
from vector_store import vector_store_manager

class DocumentProcessor:
    def extract_text_from_pdf(self, file_stream):
        text = ""
        reader = PdfReader(file_stream)
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    def get_text_chunks(self, text):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            separators=["\n\n", "\n", " ", ""]
        )
        return text_splitter.split_text(text)

    def process_and_store(self, file_stream):
        text = self.extract_text_from_pdf(file_stream)
        chunks = self.get_text_chunks(text)
        print(1)
        vector_store_manager.add_to_vector_store(chunks)

document_processor = DocumentProcessor()
