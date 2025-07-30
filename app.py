# from flask import Flask, request, jsonify, session
# from dotenv import load_dotenv
# from flask_cors import CORS
# import os
# from PyPDF2 import PdfReader
# from io import BytesIO
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
# from langchain_community.vectorstores import FAISS
# import google.generativeai as genai
# import logging
# from langchain.chains import LLMChain
# from langchain_core.output_parsers import PydanticOutputParser
# from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.runnables import RunnablePassthrough, RunnableLambda
# from langchain_core.memory import BaseMemory
# from langchain.memory import  ConversationBufferMemory
# from langchain_mongodb import MongoDBChatMessageHistory
# from pymongo import MongoClient
# import secrets
# from datetime import datetime, timedelta
# from uuid import uuid4
# from pydantic import BaseModel, Field
# from googletrans import Translator
# import asyncio
# from flask.sessions import SecureCookieSessionInterface

# # Load environment variables
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Configure GenAI
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # MongoDB Configuration
# MONGODB_URI = (
#     "mongodb+srv://root:root@instamart.w8dmaq6.mongodb.net/"
#     "ChatHistory?"
#     "retryWrites=true&"
#     "w=majority&"
#     "tls=true&"
#     "tlsAllowInvalidCertificates=true"
# )
# MONGODB_DB_NAME = "ChatHistory"
# SESSION_COLLECTION = "chat_sessions"
# MEMORY_COLLECTION = "chat_memory"

# # Initialize Flask
# app = Flask(__name__)
# CORS(app, supports_credentials=True)
# app.secret_key = os.getenv("FLASK_SECRET_KEY", secrets.token_hex(32))
# app.config.update(
#     SESSION_COOKIE_NAME='instamart_fle_session',
#     SESSION_COOKIE_HTTPONLY=True,
#     SESSION_COOKIE_SECURE=True,  # Enable in production with HTTPS
#     PERMANENT_SESSION_LIFETIME=timedelta(hours=8)  # 8 hour session
# )

# # Custom session interface for better control
# class CustomSessionInterface(SecureCookieSessionInterface):
#     def save_session(self, *args, **kwargs):
#         # Always save the session if it's accessed
#         if session.accessed:
#             return super().save_session(*args, **kwargs)

# app.session_interface = CustomSessionInterface()


# # Configuration
# VECTOR_STORE_FOLDER = 'vector_stores'
# ALLOWED_EXTENSIONS = {'pdf'}
# os.makedirs(VECTOR_STORE_FOLDER, exist_ok=True)

# # MongoDB Connection
# try:
#     mongo_client = MongoClient(
#         MONGODB_URI,
#         connectTimeoutMS=30000,
#         socketTimeoutMS=None,
#         serverSelectionTimeoutMS=5000,
#         maxPoolSize=50,
#         retryWrites=True,
#         appName="Instamart-FLE-Bot"
#     )
#     mongo_client.admin.command('ping')
#     logger.info("✅ MongoDB connection established")
# except Exception as e:
#     logger.error(f"❌ MongoDB connection failed: {str(e)}")
#     raise

# db = mongo_client[MONGODB_DB_NAME]

# class Answer(BaseModel):
#     answer: object = Field(description="answer for the question asked")

# def create_session_id():
#     return f"{int(datetime.utcnow().timestamp())}_{uuid4().hex}"

# def get_current_session_id():
#     # Initialize session if needed
#     if 'initialized' not in session:
#         session.clear()
#         session['initialized'] = True
#         session['session_id'] = create_session_id()
#         session['created_at'] = datetime.utcnow().isoformat()
#         session['ip_address'] = request.remote_addr
#         session.modified = True  # Mark as modified to ensure saving
        
#     return session['session_id']

# def get_memory_for_session(session_id: str) -> BaseMemory:
#     try:
#         message_history = MongoDBChatMessageHistory(
#             connection_string=MONGODB_URI,
#             session_id=session_id,
#             database_name=MONGODB_DB_NAME,
#             collection_name=MEMORY_COLLECTION
#         )
        
#         # Set TTL index manually if needed
#         db[MEMORY_COLLECTION].create_index(
#             "created_at",
#             expireAfterSeconds=86400  # 24 hours
#         )
#         print(message_history)
        
#         return ConversationBufferMemory(
#             chat_memory=message_history,
#             memory_key="chat_history",
#             return_messages=True,
#             input_key="question",
#             output_key="answer"
#         )
#     except Exception as e:
#         logger.error(f"Memory init error: {str(e)}")
#         # Fallback to in-memory storage
#         return ConversationBufferMemory()

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def extract_text_from_pdf(file_stream):
#     text = ""
#     reader = PdfReader(file_stream)
#     for page in reader.pages:
#         text += page.extract_text() or ""
#     return text

# def get_text_chunks(text):
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=1000,
#         chunk_overlap=100,
#         separators=["\n\n", "\n", " ", ""]
#     )
#     return text_splitter.split_text(text)

# def create_vector_store(text_chunks, path):
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
#     vector_store.save_local(path)
#     return path

# def load_vector_store(vector_store_path):
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     return FAISS.load_local(vector_store_path, embeddings, allow_dangerous_deserialization=True)

# def create_llm_chain(memory: BaseMemory = None):
#     # parser = PydanticOutputParser(pydantic_object=Answer)
    
#     system_prompt = """You are Instamart's FLE HR assistant. Follow these rules:
# 1. Use provided context to answer questions
# 2. If unsure, say "I don't know"
# 3. Keep answers concise (1-2 sentences)
# 4. Maintain professional, helpful tone
# 5. Consider full conversation history
# 6. For HR policies, always check exact dates/numbers
# 7. And try to answer as humanly as possible and also please understand the question properly and then answer accordingly"""

#     if memory:
#         prompt = ChatPromptTemplate.from_messages([
#             ("system", system_prompt),
#             MessagesPlaceholder(variable_name="chat_history"),
#             ("human", "Question: {question}\nContext: {context}")
#         ])
        
#         llm = ChatGoogleGenerativeAI(
#             model="gemini-1.5-flash-latest",
#             temperature=0.5,
#             top_p=0.85,
#             top_k=30,
#             max_output_tokens=500
#         )
        
#         chain = (
#             {
#                 "question": RunnablePassthrough(),
#                 "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
#                 "chat_history": lambda x: x["chat_history"]
#             }
#             | prompt
#             | llm
#             # | parser
#         )
        
#         return chain
#     else:
#         prompt = PromptTemplate(
#             template=f"""{system_prompt}
# Context: {context}
# Question: {question}""",
# # {format_instructions}""",
#             input_variables=["question", "context"]
#             # partial_variables={"format_instructions": parser.get_format_instructions()}
#         )
        
#         return LLMChain(
#             llm=ChatGoogleGenerativeAI(
#                 model="gemini-1.5-flash-latest",
#                 temperature=0.5,
#                 top_p=0.85,
#                 top_k=30
#             ),
#             prompt=prompt
#             # output_parser=parser
#         )


# async def detect_and_translate(text):
#     translator = Translator()
#     try:
#         detection = await translator.detect(text)
#         detected_lang = detection.lang
#         if detected_lang != 'en':
#             translation = await translator.translate(text, src=detected_lang, dest='en')
#             return translation.text, detected_lang
#         return text, detected_lang
#     except Exception as e:
#         logger.error(f"Translation error: {str(e)}")
#         return text, 'en'

# async def translate_back(text, dest_lang):
#     if dest_lang == 'en':
#         return text
#     translator = Translator()
#     try:
#         translation = await translator.translate(text, src='en', dest=dest_lang)
#         return translation.text
#     except Exception as e:
#         logger.error(f"Reverse translation error: {str(e)}")
#         return text

# @app.route('/api/upload-pdfs', methods=['POST'])
# def upload_pdfs():
#     if 'files' not in request.files:
#         return jsonify({"error": "No files provided"}), 400
    
#     files = request.files.getlist('files')
#     if not files or all(file.filename == '' for file in files):
#         return jsonify({"error": "No selected files"}), 400
    
#     all_text_chunks = []
#     for file in files:
#         if file and allowed_file(file.filename):
#             file_stream = BytesIO(file.read())
#             text = extract_text_from_pdf(file_stream)
#             text_chunks = get_text_chunks(text)
#             all_text_chunks.extend(text_chunks)
#         else:
#             return jsonify({"error": f"Invalid file type: {file.filename}"}), 400
    
#     if not all_text_chunks:
#         return jsonify({"error": "No valid text extracted"}), 400
    
#     try:
#         vector_store_path = os.path.join(VECTOR_STORE_FOLDER, "faiss_index")
#         create_vector_store(all_text_chunks, vector_store_path)
#         return jsonify({
#             "status": "success",
#             "message": "Vector store created",
#             "vector_store_path": vector_store_path,
#             "num_chunks": len(all_text_chunks)
#         })
#     except Exception as e:
#         return jsonify({"error": f"Failed to create vector store: {str(e)}"}), 500

# @app.route('/api/answer', methods=['POST'])
# def generate_answer():
#     try:
#         data = request.get_json()
#         question = data.get('question')
        
#         if not question or not isinstance(question, str):
#             return jsonify({"error": "Valid question is required"}), 400
        
#         session_id = data.get('session_id')
#         conv_length = db[SESSION_COLLECTION].count_documents({"session_id": session_id})
#         if conv_length >= 25:
#             return jsonify({
#                 'status': 'limit_reached',
#                 'message': 'Conversation limit reached. Please start a new session.'
#             }), 200
#         memory = get_memory_for_session(session_id)
#         print(memory)
        
#         # Translation
#         translated_question, original_lang = asyncio.run(detect_and_translate(question))
        
#         # Vector store search
#         vector_store_path = os.path.join(VECTOR_STORE_FOLDER, "faiss_index")
#         new_db = load_vector_store(vector_store_path)
#         docs = new_db.similarity_search(translated_question, k=3)
#         print(translated_question)
#         # Generate response
#         if memory:
#             chain = create_llm_chain(memory)
#             inputs = {
#                 "question": translated_question,
#                 "docs": docs,
#                 "chat_history": memory.chat_memory.messages  # Last 3 exchanges
#             }
#             response = chain.invoke(inputs)
#             print(response)
#         else:
#             chain = create_llm_chain()
#             response = chain.run(
#                 question=translated_question,
#                 context="\n\n".join([doc.page_content for doc in docs])
#             )
        
#         # Translate response
#         translated_answer = asyncio.run(translate_back(response.content, original_lang))
        
#         # Store the interaction in memory
#         memory.save_context(
#             {"question": translated_question},
#             {"answer": translated_answer}
#         )
        
#         # Log session
#         db[SESSION_COLLECTION].insert_one({
#             "session_id": session_id,
#             "timestamp": datetime.utcnow(),
#             "original_question": question,
#             "translated_question": translated_question,
#             "answer": translated_answer,
#             "language": original_lang,
#             "metadata": {
#                 "user_agent": request.headers.get('User-Agent'),
#                 "ip_address": request.remote_addr
#             }
#         })
        
#         return jsonify({
#             'status': 'success',
#             'response': {'answer': translated_answer},
#             'session_id': session_id
#         })
        
#     except Exception as e:
#         logger.error(f"API error: {str(e)}", exc_info=True)
#         return jsonify({
#             'status': 'error',
#             'message': 'An error occurred while processing your request'
#         }), 500

# # Session Management Endpoints
# @app.route('/api/session/new', methods=['POST'])
# def new_session():
#     try:
#         session.clear()
#         session_id = create_session_id()
#         session['session_id'] = session_id
#         session['created_at'] = datetime.utcnow().isoformat()
        
#         memory = get_memory_for_session(session_id)
#         memory.clear()
        
#         db[SESSION_COLLECTION].insert_one({
#             "session_id": session_id,
#             "action": "session_created",
#             "timestamp": datetime.utcnow()
#         })
        
#         return jsonify({
#             'status': 'success',
#             'session_id': session_id
#         })
#     except Exception as e:
#         logger.error(f"Session error: {str(e)}")
#         return jsonify({'status': 'error'}), 500

# @app.route('/api/session/end', methods=['POST'])
# def end_session():
#     try:
#         if 'session_id' not in session:
#             return jsonify({"error": "No active session"}), 400
            
#         session_id = session['session_id']
#         db[SESSION_COLLECTION].insert_one({
#             "session_id": session_id,
#             "action": "session_ended",
#             "timestamp": datetime.utcnow()
#         })
#         session.clear()
#         return jsonify({'status': 'success'})
#     except Exception as e:
#         logger.error(f"Session error: {str(e)}")
#         return jsonify({'status': 'error'}), 500

# @app.route('/api/session/history', methods=['GET'])
# def get_session_history():
#     try:
#         if 'session_id' not in session:
#             return jsonify({"error": "No active session"}), 400
            
#         session_id = session['session_id']
#         page = int(request.args.get('page', 1))
#         per_page = min(int(request.args.get('per_page', 10)), 50)
        
#         memory = get_memory_for_session(session_id)
#         total = db[MEMORY_COLLECTION].count_documents({"session_id": session_id})
        
#         return jsonify({
#             'status': 'success',
#             'history': [str(msg) for msg in memory.chat_memory.messages],
#             'pagination': {
#                 'page': page,
#                 'total': total,
#                 'pages': (total + per_page - 1) // per_page
#             }
#         })
#     except Exception as e:
#         logger.error(f"History error: {str(e)}")
#         return jsonify({'status': 'error'}), 500
# @app.route('/api/sessions/ids-with-questions', methods=['GET'])
# def get_session_ids_with_first_questions():
#     try:
#         # Aggregation pipeline with proper sorting
#         pipeline = [
#             {
#                 "$sort": {"timestamp": -1}  # Sort all documents by timestamp first
#             },
#             {
#                 "$group": {
#                     "_id": "$session_id",
#                     "first_question": {"$first": "$original_question"},
#                     "created_at": {"$first": "$timestamp"},
#                     "language": {"$first": "$language"}
#                 }
#             },
#             {
#                 "$sort": {"created_at": -1}  # Sort the grouped results by creation time
#             },
#             {
#                 "$project": {
#                     "session_id": "$_id",
#                     "first_question": 1,
#                     "created_at": 1,
#                     "language": 1,
#                     "_id": 0
#                 }
#             }
#         ]
        
#         sessions_data = list(db[SESSION_COLLECTION].aggregate(pipeline))
        
#         return jsonify({
#             'status': 'success',
#             'sessions': sessions_data,
#             'count': len(sessions_data)
#         })
        
#     except Exception as e:
#         logger.error(f"Error getting session data: {str(e)}")
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500
# @app.route('/api/conversations/<session_id>', methods=['GET'])
# def get_conversation(session_id):
#     try:
#         # Fetch all documents for this session_id
#         session_docs = list(db[SESSION_COLLECTION].find({"session_id": session_id}).sort("timestamp", 1))
#         # session_docs = list(db[MEMORY_COLLECTION].find({"SessionId": session_id}).sort("timestamp", 1))
#         if not session_docs:
#             return jsonify({"status": "error", "message": "Session not found"}), 404

#         conversation = []
#         for doc in session_docs:
#             # User's question
#             conversation.append({
#                 'type': 'user',
#                 'text': doc.get('original_question', '')
#             })
#             # Bot's answer
#             conversation.append({
#                 'type': 'bot',
#                 'text': doc.get('answer', '')
#             })

#         return jsonify({
#             "status": "success",
#             "conversations": conversation
#         }), 200

#     except Exception as e:
#         logger.error(f"Error fetching conversation: {str(e)}")
#         return jsonify({"status": "error", "message": "Internal server error"}), 500

# @app.route('/api/sessions/<session_id>/delete', methods=['DELETE'])
# def delete_session_conversations(session_id):
#     try:
#         # Validate session_id
#         if not session_id:
#             return jsonify({"status": "error", "message": "Session ID is required"}), 400
            
#         # Delete from SESSION_COLLECTION
#         # session_result = db[SESSION_COLLECTION].delete_many({"session_id": session_id})
#         # Delete from MEMORY_COLLECTION
#         memory_result = db[MEMORY_COLLECTION].delete_many({"SessionId": session_id})
        
#         total_deleted = memory_result.deleted_count
#         print(total_deleted)
#         # Log the deletion
#         logger.info(f"Deleted {memory_result.deleted_count} documents from MEMORY_COLLECTION")
        
#         if total_deleted == 0:
#             return jsonify({
#                 "status": "warning",
#                 "message": "No conversations found for this session ID"
#             }), 200
        
#         return jsonify({
#             "status": "success",
#             "message": f"Successfully deleted all conversations for session {session_id}",
#             "deleted_count": {
#                 # "session_collection": session_result.deleted_count,
#                 "memory_collection": memory_result.deleted_count,
#                 "total": total_deleted
#             }
#         }), 200
        
#     except Exception as e:
#         logger.error(f"Error deleting session conversations: {str(e)}", exc_info=True)
#         return jsonify({
#             "status": "error",
#             "message": "An error occurred while deleting session conversations",
#             "error": str(e)
#         }), 500
# @app.route('/api/admin/clear-collection', methods=['DELETE'])
# def clear_collection():
#     try:

#         # Delete operation
#         # result = db[MEMORY_COLLECTION].delete_many({})
#         result = db[SESSION_COLLECTION].delete_many({})
        
#         logger.info(f"Cleared collection {SESSION_COLLECTION}. Deleted count: {result.deleted_count}")

#         return jsonify({
#             "status": "success",
#             "message": f"Collection {SESSION_COLLECTION} cleared",
#             "deleted_count": result.deleted_count
#         })

#     except Exception as e:
#         logger.error(f"Collection clear error: {str(e)}", exc_info=True)
#         return jsonify({
#             "status": "error",
#             "message": "Failed to clear collection",
#             "error": str(e)
#         }), 500
# if __name__ == "__main__":
#     app.run(port=5020, debug=True)


from flask import Flask, request, jsonify, session
from flask_cors import CORS
from config import Config
# from database import db_manager
#from session_manager import session_manager
from memory_manager import memory_manager
from document_processor import document_processor
from vector_store import vector_store_manager
from translation import translation_service
from llm_chain import llm_chain_factory
from flask.sessions import SecureCookieSessionInterface
import logging
from datetime import datetime
import os
from io import BytesIO
#from models import PdfFile
# from mongoengine import connect
from dotenv import load_dotenv
from authmanager import auth_manager
from werkzeug.utils import secure_filename
import uuid
from dynamodb_manager import dynamodb_manager
from DynamoDBSessionManager import dynamo_session_manager
from boto3.dynamodb.conditions import Key
import csv
from io import StringIO
from redis_manager import redis_cache
from langchain_core.documents import Document
from s3_manager import s3_manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask
app = Flask(__name__)
load_dotenv()
# connect(
#     db=Config.MONGODB_DB_NAME,
#     host=Config.MONGODB_URI,
#     alias='default'  # Make sure MongoEngine uses the correct connection
# )
CORS(app, supports_credentials=True, expose_headers=['Authorization'],origins=[
    "http://localhost:3000", 
    "http://localhost:3001", # Dev frontend
    "https://instamart-alpha.vercel.app" ,
     "http://13.228.237.56:3000" # Prod frontend
])

app.config.from_object(Config)

# Custom session interface
class CustomSessionInterface(SecureCookieSessionInterface):
    def save_session(self, *args, **kwargs):
        if session.accessed:
            return super().save_session(*args, **kwargs)

app.session_interface = CustomSessionInterface()
@app.route('/upload-pdf-s3', methods=['POST'])
def upload_pdfs_to_s3():
    if 'files' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files selected"}), 400

    results = []

    for file in files:
        if file.filename.endswith('.pdf'):
            try:
                filename = secure_filename(file.filename)
                file_id = str(uuid.uuid4())
                s3_key = f"pdfs/{filename}"

                # Check for duplicate
                if s3_manager.file_exists(s3_key):
                    results.append({"filename": filename, "status": "skipped (already uploaded)"})
                    continue

                # Read file content once and store in memory
                file_content = file.read()
                
                # Create separate BytesIO streams for S3 upload and processing
                s3_stream = BytesIO(file_content)
                processing_stream = BytesIO(file_content)

                # Upload to S3 with content type
                s3_manager.upload_fileobj(s3_stream, s3_key, file.content_type)
                
                # 🧠 Process and update FAISS (using separate stream)
                document_processor.process_and_store(processing_stream, filename, file.content_type)

                results.append({"filename": filename, "status": "success", "file_id": file_id})
                
            except Exception as e:
                logger.exception(f"Error processing file {file.filename}")
                results.append({"filename": file.filename, "status": "error", "error": str(e)})
        else:
            results.append({"filename": file.filename, "status": "invalid file type"})

    return jsonify(results), 200


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(data)
        Phone_no = str(data.get('Phone_no'))
        
        if not Phone_no:
            return jsonify({'message': 'Phone number required'}), 400
        if not Phone_no or not Phone_no.isdigit():
            return jsonify({
                'status': 'error',
                'message': 'Valid phone number is required'
            }), 400
        
        user = auth_manager.get_user_by_phone(Phone_no)
        
        if not user:
            name = data.get('name', '')
            user = auth_manager.create_user(name, Phone_no)
        user_id=Phone_no
        redis_cache.set_user_data(user_id, user)
        token = auth_manager.generate_token(user)
        return jsonify({
            'token': token,
            'user': {
                'name': user.get('Name'),
                'Phone_no': user.get('Mobile')
            }
        })
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        Phone_no = str(data.get('Phone_no', '')).strip()

        if not name or not Phone_no or not Phone_no.isdigit():
            return jsonify({'status': 'error', 'message': 'Name and valid phone number are required'}), 400

        existing_user = auth_manager.get_user_by_phone(Phone_no)
        if existing_user:
            return jsonify({'status': 'error', 'message': 'User already exists'}), 400

        user = auth_manager.create_user(name, Phone_no)
        return jsonify({'status': 'success', 'user': user}), 201

    except Exception as e:
        logger.error(f"Register error: {str(e)}", exc_info=True)
        return jsonify({'status': 'error', 'message': str(e)}), 500


# @app.route('/api/upload', methods=['POST'])
# def upload_pdf():
#     try:
#         files = request.files.getlist("files")
#         if not files:
#             return jsonify({"status": "error", "message": "No files uploaded"}), 400

#         saved_files = []
#         print(1)

#         for file in files:
#             print(11)
#             # Check if file already exists in MongoDB
#             existing = PdfFile.objects(filename=file.filename).first()
#             print(2)
#             if existing:
#                 continue  # Skip duplicates

#             # Save the file binary to MongoDB
#             pdf_file = PdfFile(
#                 filename=file.filename,
#                 content_type=file.content_type,
#                 data=file.read()
#             ).save()
#             print(3)
#             # Process PDF from binary and store vectors in MongoDB
#             document_processor.process_and_store(BytesIO(pdf_file.data))
#             print(4)
#             saved_files.append(file.filename)

#         return jsonify({"status": "success", "files": saved_files}), 200

#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500
@app.route('/api/pdf/count', methods=['GET'])
def get_pdf_count():
    try:
        count = PdfFile.objects.count()
        return jsonify({"status": "success", "totalDocuments": count}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
# Assuming PdfFile is your MongoEngine model
@app.route('/api/documents', methods=['GET'])
def list_documents():
    try:
        files = PdfFile.objects.only('filename')  # fetch just the filenames
        filenames = [file.filename for file in files]
        return jsonify({"status": "success", "files": filenames}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# API Routes
# @app.route('/api/upload-pdfs', methods=['POST'])
# def upload_pdfs():
#     if 'files' not in request.files:
#         return jsonify({"error": "No files provided"}), 400
    
#     files = request.files.getlist('files')
#     if not files or all(file.filename == '' for file in files):
#         return jsonify({"error": "No selected files"}), 400
    
#     all_text_chunks = []
#     for file in files:
#         if file and document_processor.allowed_file(file.filename):
#             file_stream = BytesIO(file.read())
#             text = document_processor.extract_text_from_pdf(file_stream)
#             text_chunks = document_processor.get_text_chunks(text)
#             all_text_chunks.extend(text_chunks)
#         else:
#             return jsonify({"error": f"Invalid file type: {file.filename}"}), 400
    
#     if not all_text_chunks:
#         return jsonify({"error": "No valid text extracted"}), 400
    
#     try:
#         vector_store_path = os.path.join(Config.VECTOR_STORE_FOLDER, "faiss_index")
#         vector_store_manager.create_vector_store(all_text_chunks, vector_store_path)
#         return jsonify({
#             "status": "success",
#             "message": "Vector store created",
#             "vector_store_path": vector_store_path,
#             "num_chunks": len(all_text_chunks)
#         })
#     except Exception as e:
#         return jsonify({"error": f"Failed to create vector store: {str(e)}"}), 500

# @app.route('/api/answer', methods=['POST'])
# def generate_answer():
#     try:
#         data = request.get_json()
#         question = data.get('question')
        
#         if not question or not isinstance(question, str):
#             return jsonify({"error": "Valid question is required"}), 400
        
#         session_id = data.get('session_id')
#         conv_length = db_manager.get_collection(Config.SESSION_COLLECTION).count_documents(
#             {"session_id": session_id}
#         )
        
#         if conv_length >= Config.MAX_CONVERSATION_LENGTH:
#             return jsonify({
#                 'status': 'limit_reached',
#                 'message': 'Conversation limit reached. Please start a new session.'
#             }), 200
        
#         memory = memory_manager.get_memory_for_session(session_id)
#         print(memory)
        
#         # Translation
#         # translated_question, original_lang = await translation_service.detect_and_translate(question)
#         translated_question, original_lang = translation_service.detect_and_translate(question)
        
#         # Vector store search
#         # vector_store_path = os.path.join(Config.VECTOR_STORE_FOLDER, "faiss_index")
#         # new_db = vector_store_manager.load_vector_store(vector_store_path)
#         # docs = new_db.similarity_search(translated_question, k=3)
#         docs = vector_store_manager.semantic_search(translated_question, k=3)
        
#         # Generate response
#         chain = llm_chain_factory.create_llm_chain(memory)
        
#         if memory:
#             inputs = {
#                 "question": translated_question,
#                 "docs": docs,
#                 "chat_history": memory.chat_memory.messages
#             }
#             response = chain.invoke(inputs)
#             answer = response.content
#         else:
#             response = chain.run(
#                 question=translated_question,
#                 context="\n\n".join([doc.page_content for doc in docs])
#             )
#             answer = response
        
#         # Translate response
#         # translated_answer = await translation_service.translate_back(answer, original_lang)
#         translated_answer = translation_service.translate_back(answer, original_lang)
        
#         # Store the interaction
#         memory.save_context(
#             {"question": translated_question},
#             {"answer": translated_answer}
#         )
        
#         # Log session
#         db_manager.get_collection(Config.SESSION_COLLECTION).insert_one({
#             "session_id": session_id,
#             "timestamp": datetime.utcnow(),
#             "original_question": question,
#             "translated_question": translated_question,
#             "answer": translated_answer,
#             "language": original_lang,
#             "metadata": {
#                 "user_agent": request.headers.get('User-Agent'),
#                 "ip_address": request.remote_addr
#             }
#         })
        
#         return jsonify({
#             'status': 'success',
#             'response': {'answer': translated_answer},
#             'session_id': session_id
#         })
        
#     except Exception as e:
#         logger.error(f"API error: {str(e)}", exc_info=True)
#         return jsonify({
#             'status': 'error',
#             'message': 'An error occurred while processing your request'
#         }), 500

# @app.route('/api/answer', methods=['POST'])
# @auth_manager.token_required
# def generate_answer():
#     try:
#         data = request.get_json()
#         question = data.get('question')
#         user_info = request.user
        
#         if not question or not isinstance(question, str):
#             return jsonify({"error": "Valid question is required"}), 400
        
#         session_id = data.get('session_id')
#         conv_length = db_manager.get_collection(Config.SESSION_COLLECTION).count_documents(
#             {"session_id": session_id}
#         )
        
#         if conv_length >= Config.MAX_CONVERSATION_LENGTH:
#             return jsonify({
#                 'status': 'limit_reached',
#                 'message': 'Conversation limit reached. Please start a new session.'
#             }), 200
        
#         memory = memory_manager.get_memory_for_session(session_id)
#         translated_question, original_lang = translation_service.detect_and_translate(question)
#         docs = vector_store_manager.semantic_search(translated_question, k=3)
        
#         chain = llm_chain_factory.create_llm_chain(memory)
        
#         if memory:
#             inputs = {
#                 "question": translated_question,
#                 "docs": docs,
#                 "chat_history": memory.chat_memory.messages
#             }
#             response = chain.invoke(inputs)
#             answer = response.content
#         else:
#             response = chain.run(
#                 question=translated_question,
#                 context="\n\n".join([doc.page_content for doc in docs])
#             )
#             answer = response
        
#         translated_answer = translation_service.translate_back(answer, original_lang)
#         memory.save_context(
#             {"question": translated_question},
#             {"answer": translated_answer}
#         )
        
#         session_manager.log_conversation(
#             session_id=session_id,
#             question=question,
#             answer=translated_answer,
#             original_lang=original_lang,
#             user_info=user_info
#         )
        
#         return jsonify({
#             'status': 'success',
#             'response': {'answer': translated_answer},
#             'session_id': session_id
#         })
        
#     except Exception as e:
#         logger.error(f"API error: {str(e)}", exc_info=True)
#         return jsonify({
#             'status': 'error',
#             'message': 'An error occurred while processing your request'
#         }), 500
# def create_support_ticket(user_info, question):
#     db_manager.get_collection("support_tickets").insert_one({
#         "question": question,
#         "user_name": user_info.get("name") or "Anonymous",
#         "user_phone": user_info.get("Phone_no"),
#         "created_at": datetime.utcnow(),
#         "status": "open",
#         "forwarded": True,
#         "source": "chatbot",
#         "answer": ""
#     })


# @app.route('/api/answer', methods=['POST'])
# @auth_manager.token_required
# def generate_answer():
#     try:
#         data = request.get_json()
#         question = data.get('question')
#         user_info = request.user
        
#         if not question or not isinstance(question, str):
#             return jsonify({"error": "Valid question is required"}), 400
        
#         session_id = data.get('session_id')
#         print(session_id)
#         conv_length = db_manager.get_collection(Config.SESSION_COLLECTION).count_documents(
#             {"session_id": session_id}
#         )
        
#         if conv_length >= Config.MAX_CONVERSATION_LENGTH:
#             return jsonify({
#                 'status': 'limit_reached',
#                 'message': 'Conversation limit reached. Please start a new session.'
#             }), 200
        
#         memory = memory_manager.get_memory_for_session(session_id)
#         print(memory)
        
#         # Translation
#         # translated_question, original_lang = await translation_service.detect_and_translate(question)
#         translated_question, original_lang = translation_service.detect_and_translate(question)
        
#         # Vector store search
#         # vector_store_path = os.path.join(Config.VECTOR_STORE_FOLDER, "faiss_index")
#         # new_db = vector_store_manager.load_vector_store(vector_store_path)
#         # docs = new_db.similarity_search(translated_question, k=3)
#         docs = vector_store_manager.semantic_search(translated_question, k=3)
        
#         # Generate response
#         chain = llm_chain_factory.create_llm_chain(memory)
        
#         if memory:
#             inputs = {
#                 "question": translated_question,
#                 "docs": docs,
#                 "chat_history": memory.chat_memory.messages
#             }
#             response = chain.invoke(inputs)
#             answer = response.content
#         else:
#             response = chain.run(
#                 question=translated_question,
#                 context="\n\n".join([doc.page_content for doc in docs])
#             )
#             answer = response
        
#         # Translate response
#         # translated_answer = await translation_service.translate_back(answer, original_lang)
#         translated_answer = translation_service.translate_back(answer, original_lang)
        
#         # Store the interaction
#         memory.save_context(
#             {"question": translated_question},
#             {"answer": translated_answer}
#         )
#         fallback_msg = "Your query has been forwarded to the concerned HR. Please wait for their reply."
#         if translated_answer.strip() == fallback_msg:
#             create_support_ticket(user_info, question)
        
#         # Log session
#         db_manager.get_collection(Config.SESSION_COLLECTION).insert_one({
#             "session_id": session_id,
#             "timestamp": datetime.utcnow(),
#             "original_question": question,
#             "translated_question": translated_question,
#             "answer": translated_answer,
#             "language": original_lang,
#             "name": user_info.get('name'),
#             "Phone_no": user_info.get('Phone_no'),
#             "metadata": {
#                 "user_agent": request.headers.get('User-Agent'),
#                 "ip_address": request.remote_addr
#             }
#         })
        
#         return jsonify({
#             'status': 'success',
#             'response': {'answer': translated_answer},
#             'session_id': session_id
#         })
        
#     except Exception as e:
#         logger.error(f"API error: {str(e)}", exc_info=True)
#         return jsonify({
#             'status': 'error',
#             'message': 'An error occurred while processing your request'
#         }), 500

@app.route('/api/dynamo/answer', methods=['POST'])
@auth_manager.token_required
def generate_dynamo_answer():
    try:
        data = request.get_json()
        question = data.get('question')
        user_info = request.user
        user_id=request.user.get('Mobile')
        user_doc = redis_cache.get_user_data(user_id)

        if not question or not isinstance(question, str):
            return jsonify({"error": "Valid question is required"}), 400

        session_id = data.get('session_id')
        print(session_id)

        conv_length = dynamo_session_manager.get_session_history(session_id)
        if len(conv_length) >= Config.MAX_CONVERSATION_LENGTH:
            return jsonify({
                'status': 'limit_reached',
                'message': 'Conversation limit reached. Please start a new session.'
            }), 200

        memory = memory_manager.get_memory_for_session(session_id)
        print(memory)

        # Translation
        translated_question, original_lang = translation_service.detect_and_translate(question)

        # Vector store search
        docs = vector_store_manager.semantic_search(translated_question, k=3)
        print(docs)
        user_context = None
        if user_doc:
            user_context = "\n".join([f"{k}: {v}" for k, v in user_doc.items()])
        else:
            logger.warning(f"No cached user data found for {user_id}")

        # Generate response
        chain = llm_chain_factory.create_llm_chain(memory,user_context)

        if memory:
            inputs = {
                "question": translated_question,
                "docs": docs,
                "chat_history": memory.chat_memory.messages
            }
            response = chain.invoke(inputs)
            answer = response.content
        else:
            response = chain.run(
                question=translated_question,
                context="\n\n".join([doc.page_content for doc in docs])
            )
            answer = response

        # Translate response
        translated_answer = translation_service.translate_back(answer, original_lang)

        # Store the interaction
        memory.save_context(
            {"question": translated_question},
            {"answer": translated_answer}
        )

        # Handle fallback support ticket
        fallback_msg = "Your query has been forwarded to the concerned HR. Please wait for their reply."
        if translated_answer.strip() == fallback_msg:
            create_support_ticket(user_info, question)

        # Log session interaction in DynamoDB
        dynamo_session_manager.log_conversation(
            session_id=session_id,
            question=question,
            answer=translated_answer,
            original_lang=original_lang,
            user_info=user_info
        )

        return jsonify({
            'status': 'success',
            'response': {'answer': translated_answer},
            'session_id': session_id
        })

    except Exception as e:
        logger.error(f"API error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while processing your request'
        }), 500
@app.route('/api/users/bulk-upload', methods=['POST'])
def bulk_upload_users():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({"status": "error", "message": "No file uploaded"}), 400

        table = dynamodb_manager.get_table('InstamartUsers')
        reader = csv.DictReader(StringIO(file.read().decode()))

        with table.batch_writer() as batch:
            for row in reader:
                batch.put_item(Item=row)

        return jsonify({"status": "success", "message": "Users uploaded successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Session Management Endpoints
# @app.route('/api/session/new', methods=['POST'])
# def new_session():
#     try:
#         session.clear()
#         session_id = session_manager.create_session_id()
#         session['session_id'] = session_id
#         session['created_at'] = datetime.utcnow().isoformat()
        
#         memory = memory_manager.get_memory_for_session(session_id)
#         memory.clear()
        
#         # session_manager.log_session_action(session_id, "session_created")
        
#         return jsonify({
#             'status': 'success',
#             'session_id': session_id
#         })
#     except Exception as e:
#         logger.error(f"Session error: {str(e)}")
#         return jsonify({'status': 'error'}), 500
@app.route('/api/session/new', methods=['POST'])
def new_session():
    try:
        session.clear()

        session_id = session_manager.create_session_id()
        created_at = datetime.utcnow().isoformat()

        # Store session ID in Flask session (if still used for frontend)
        session['session_id'] = session_id
        session['created_at'] = created_at

        # Clear memory if exists
        memory = memory_manager.get_memory_for_session(session_id)
        memory.clear()

        return jsonify({
            'status': 'success',
            'session_id': session_id
        })

    except Exception as e:
        logger.error(f"Session error: {str(e)}", exc_info=True)
        return jsonify({'status': 'error', 'message': 'Failed to create new session'}), 500

@app.route('/api/session/end', methods=['POST'])
def end_session():
    try:
        if 'session_id' not in session:
            return jsonify({"error": "No active session"}), 400
            
        session_id = session['session_id']
        session_manager.log_session_action(session_id, "session_ended")
        session.clear()
        return jsonify({'status': 'success'})
    except Exception as e:
        logger.error(f"Session error: {str(e)}")
        return jsonify({'status': 'error'}), 500

# @app.route('/api/sessions/ids-with-questions', methods=['GET'])
# def get_session_ids_with_first_questions():
#     try:
#         sessions_data = session_manager.get_all_sessions()
#         return jsonify({
#             'status': 'success',
#             'sessions': sessions_data,
#             'count': len(sessions_data)
#         })
#     except Exception as e:
#         logger.error(f"Error getting session data: {str(e)}")
#         return jsonify({
#             'status': 'error',
#             'message': str(e)
#         }), 500
@app.route('/api/sessions/ids-with-questions', methods=['GET'])
@auth_manager.token_required
def get_user_sessions():
    try:
        # Get phone number from authenticated user
        Phone_no = request.user.get('Mobile')
        print(Phone_no)
        if not Phone_no:
            return jsonify({
                'status': 'error',
                'message': 'Phone number not found in user data'
            }), 400
        
        # Get sessions for the current user only
        sessions = dynamo_session_manager.get_all_sessions(filter_by_user={'Phone_no': Phone_no})
        
        return jsonify({
            'status': 'success',
            'sessions': sessions,
            'user': {
                'name': request.user.get('Name'),
                'Phone_no': Phone_no
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to get user sessions'
        }), 500


# @app.route('/api/conversations/<session_id>', methods=['GET', 'OPTIONS'])
# def get_conversation(session_id):
#     print(f"Incoming {request.method} for session_id={session_id}")
#     if request.method == 'OPTIONS':
#         # Preflight request
#         return '', 200
#     try:
#         # Get the collection
#         session_collection = db_manager.get_collection(Config.SESSION_COLLECTION)
        
#         # Fetch all documents for this session_id
#         session_docs = list(session_collection.find(
#             {"session_id": session_id}
#         ).sort("timestamp", 1))
        
#         if not session_docs:  # This is safe because we're checking a list, not a DB object
#             return jsonify({
#                 "status": "error", 
#                 "message": "Session not found"
#             }), 404

#         conversation = []
#         for doc in session_docs:
#             conversation.append({
#                 'type': 'user',
#                 'text': doc.get('original_question', ''),
#                 'timestamp': doc.get('timestamp').isoformat() if doc.get('timestamp') else None
#             })
#             conversation.append({
#                 'type': 'bot',
#                 'text': doc.get('answer', ''),
#                 'timestamp': doc.get('timestamp').isoformat() if doc.get('timestamp') else None
#             })

#         return jsonify({
#             "status": "success",
#             "session_id": session_id,
#             "conversations": conversation
#         }), 200

#     except Exception as e:
#         logger.error(f"Error fetching conversation: {str(e)}", exc_info=True)
#         return jsonify({
#             "status": "error",
#             "message": "Internal server error",
#             "error": str(e)
#         }), 500

@app.route('/api/conversations/dynamo/<session_id>', methods=['GET', 'OPTIONS'])
def get_dynamo_conversation(session_id):
    print(f"Incoming {request.method} for session_id={session_id}")
    if request.method == 'OPTIONS':
        return '', 200  # CORS preflight

    try:
        # Query DynamoDB by session_id
        response = dynamo_session_manager.table.query(
            KeyConditionExpression=Key("session_id").eq(session_id),
            ScanIndexForward=True  # ascending order by timestamp if timestamp is sort key
        )

        items = response.get("Items", [])
        if not items:
            return jsonify({
                "status": "error", 
                "message": "Session not found"
            }), 404

        conversation = []
        for item in items:
            timestamp = item.get("timestamp")
            conversation.append({
                'type': 'user',
                'text': item.get("original_question", ""),
                'timestamp': timestamp
            })
            conversation.append({
                'type': 'bot',
                'text': item.get("answer", ""),
                'timestamp': timestamp
            })

        return jsonify({
            "status": "success",
            "session_id": session_id,
            "conversations": conversation
        }), 200

    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "error": str(e)
        }), 500

# @app.route('/api/sessions/<session_id>/delete', methods=['DELETE'])
# def delete_session_conversations(session_id):
#     try:
#         if not session_id:
#             return jsonify({"status": "error", "message": "Session ID is required"}), 400
            
#         total_deleted = session_manager.delete_session(session_id)
        
#         if total_deleted == 0:
#             return jsonify({
#                 "status": "warning",
#                 "message": "No conversations found for this session ID"
#             }), 200
        
#         return jsonify({
#             "status": "success",
#             "message": f"Successfully deleted all conversations for session {session_id}",
#             "deleted_count": total_deleted
#         }), 200
#     except Exception as e:
#         logger.error(f"Error deleting session conversations: {str(e)}", exc_info=True)
#         return jsonify({
#             "status": "error",
#             "message": "An error occurred while deleting session conversations",
#             "error": str(e)
#         }), 500

@app.route('/api/sessions/<session_id>/delete', methods=['DELETE'])
def delete_session_conversations(session_id):
    try:
        if not session_id:
            return jsonify({
                "status": "error",
                "message": "Session ID is required"
            }), 400

        # Call your updated delete_session logic in session_manager
        total_deleted = dynamo_session_manager.delete_session(session_id)

        if total_deleted == 0:
            return jsonify({
                "status": "warning",
                "message": "No conversations or memory data found for this session ID"
            }), 200

        return jsonify({
            "status": "success",
            "message": f"Successfully deleted all conversations and memory for session {session_id}",
            "deleted_count": total_deleted
        }), 200

    except Exception as e:
        logger.error(f"Error deleting session conversations: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": "An error occurred while deleting session conversations",
            "error": str(e)
        }), 500


# @app.route('/api/admin/clear-collection', methods=['DELETE'])
# def clear_collection():
#     try:
#         result = db_manager.get_collection(Config.SESSION_COLLECTION).delete_many({})
#         logger.info(f"Cleared collection {Config.SESSION_COLLECTION}. Deleted count: {result.deleted_count}")
#         return jsonify({
#             "status": "success",
#             "message": f"Collection {Config.SESSION_COLLECTION} cleared",
#             "deleted_count": result.deleted_count
#         })
#     except Exception as e:
#         logger.error(f"Collection clear error: {str(e)}", exc_info=True)
#         return jsonify({
#             "status": "error",
#             "message": "Failed to clear collection",
#             "error": str(e)
#         }), 500
@app.route('/api/admin/clear-collection', methods=['DELETE'])
def clear_dynamo_collections():
    try:
        # Clear session conversation table
        session_items = dynamo_session_manager.table.scan()["Items"]
        with dynamo_session_manager.table.batch_writer() as batch:
            for item in session_items:
                batch.delete_item(Key={
                    "session_id": item["session_id"],
                    "timestamp": item["timestamp"]
                })

        # Clear memory table (chat messages)
        memory_items = dynamo_session_manager.memory_table.scan()["Items"]
        with dynamo_session_manager.memory_table.batch_writer() as batch:
            for item in memory_items:
                batch.delete_item(Key={
                    "session_id": item["session_id"],
                    "message_id": item["message_id"]
                })

        total_deleted = len(session_items) + len(memory_items)
        logger.info(f"Cleared session and memory tables. Deleted: {total_deleted} items")

        return jsonify({
            "status": "success",
            "message": "Cleared both session and memory tables",
            "deleted_count": total_deleted
        }), 200

    except Exception as e:
        logger.error(f"Error clearing DynamoDB collections: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": "Failed to clear collections",
            "error": str(e)
        }), 500

@app.route('/api/profile',methods=['GET'])
@auth_manager.token_required
def getProfile():
    try:
        Name=request.user.get('Name')
        Phone_no=request.user.get('Mobile')
        DOJ=request.user.get('DOJ')
        Designation=request.user.get('Designation')
        return jsonify({
            "status":"success",
            "Name":Name,
            "Phone_no":Phone_no,
            "DOJ":DOJ,
            "Designation":Designation
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "error": str(e)
        }), 500
# def create_support_ticket(user_info, question):
#     db_manager.get_collection("support_tickets").insert_one({
#         "question": question,
#         "user_name": user_info.get("name") or "Anonymous",
#         "user_phone": user_info.get("Phone_no"),
#         "created_at": datetime.utcnow(),
#         "status": "open",
#         "forwarded": True,
#         "source": "chatbot",
#         "answer": ""
#     })
# @app.route('/api/addMood', methods=['POST'])
# def add_mood():
#     data = request.get_json()
#     user = data.get("user")
#     mood = data.get("mood")
#     timestamp = data.get("timestamp", datetime.utcnow().isoformat())
#     try:
#         db_manager.get_collection("Sentiment").insert_one({
#             "user_name": user or "Anonymous",
#             "created_at": timestamp,
#             "mood": mood
#         })
#         return jsonify({"status": "success", "message": "Mood recorded successfully."}), 200  # ✅ Add this line
#     except Exception as e:
#         print("Error adding mood:", e)
#         return jsonify({
#             "status": "error",
#             "message": "Internal server error",
#             "error": str(e)
#         }), 500

@app.route('/api/addMood', methods=['POST'])
def add_mood():
    data = request.get_json()
    user = data.get("user") or "Anonymous"
    mood = data.get("mood")
    timestamp = data.get("timestamp", datetime.utcnow().isoformat())

    if not mood:
        return jsonify({"status": "error", "message": "Mood is required"}), 400

    try:
        sentiment_table = dynamodb_manager.get_table("Sentiment")
        sentiment_table.put_item(
            Item={
                "user_name": user,
                "timestamp": timestamp,
                "mood": mood,
                "feedback": data.get("feedback", "")
            }
        )
        return jsonify({"status": "success", "message": "Mood recorded successfully."}), 200

    except Exception as e:
        print("Error adding mood:", e)
        return jsonify({
            "status": "error",
            "message": "Internal server error",
            "error": str(e)
        }), 500





if __name__ == "__main__":
    dynamodb_manager._connect()
    app.run(host='0.0.0.0', port=5020, debug=True)