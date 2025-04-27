from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import os
from PyPDF2 import PdfReader
from io import BytesIO
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
import google.generativeai as genai
import logging
from langchain.chains import LLMChain
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from googletrans import Translator
import asyncio

# Load environment variables
load_dotenv()
logging.warning(os.getenv("GOOGLE_API_KEY"))
# Configure GenAI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Configuration
VECTOR_STORE_FOLDER = 'vector_stores'
ALLOWED_EXTENSIONS = {'pdf'}

# Ensure directory exists
os.makedirs(VECTOR_STORE_FOLDER, exist_ok=True)

class Answer(BaseModel):
    answer: str = Field(
        description="answer for the question asked"
    )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_stream):
    text = ""
    reader = PdfReader(file_stream)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_text(text)

def create_vector_store(text_chunks, path):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local(path)
    return path

def load_vector_store(vector_store_path):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return FAISS.load_local(vector_store_path, embeddings, allow_dangerous_deserialization=True)

def create_llm_chain():
    parser = PydanticOutputParser(pydantic_object=Answer)
    
    prompt = PromptTemplate(
        template="""Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Keep the answer concise and to the point.
        question:
        {question}
        
        context:
        {context}
        
        Generate a balanced set of questions that cover both technical skills and soft skills required for the position.
        {format_instructions}
        """,
        input_variables=["question","context"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        temperature=0.7,
        top_p=0.9,
        top_k=40
    )
    
    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        output_parser=parser
    )
    
    return chain

def user_input(user_question, vector_store_path):
    new_db = load_vector_store(vector_store_path)
    docs = new_db.similarity_search(user_question)
    chain = create_llm_chain()
    response = chain.run(question=user_question, context=docs)
    return response

async def detect_and_translate(text):
    translator = Translator()
    try:
        # Detect language
        detection = await translator.detect(text)
        detected_lang = detection.lang
        
        # Translate to English if not English
        if detected_lang != 'en':
            translation = await translator.translate(text, src=detected_lang, dest='en')
            return translation.text, detected_lang
        return text, detected_lang
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return text, 'en'  # Fallback to treating as English

async def translate_back(text, dest_lang):
    if dest_lang == 'en':
        return text
    translator = Translator()
    try:
        translation = await translator.translate(text, src='en', dest=dest_lang)
        return translation.text
    except Exception as e:
        print(f"Reverse translation error: {str(e)}")
        return text

@app.route('/api/upload-pdfs', methods=['POST'])
def upload_pdfs():
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    files = request.files.getlist('files')
    
    if not files or all(file.filename == '' for file in files):
        return jsonify({"error": "No selected files"}), 400
    
    all_text_chunks = []
    
    for file in files:
        if file and allowed_file(file.filename):
            file_stream = BytesIO(file.read())
            text = extract_text_from_pdf(file_stream)
            text_chunks = get_text_chunks(text)
            all_text_chunks.extend(text_chunks)
        else:
            return jsonify({"error": f"Invalid file type: {file.filename}. Only PDFs are allowed."}), 400
    
    if not all_text_chunks:
        return jsonify({"error": "No valid text extracted from PDFs"}), 400
    
    try:
        vector_store_path = os.path.join(VECTOR_STORE_FOLDER, "faiss_index")
        create_vector_store(all_text_chunks, vector_store_path)
        return jsonify({
            "status": "success",
            "message": "Vector store created successfully",
            "vector_store_path": vector_store_path,
            "num_chunks": len(all_text_chunks)
        })
    except Exception as e:
        return jsonify({"error": f"Failed to create vector store: {str(e)}"}), 500

@app.route('/api/answer', methods=['POST'])
def generate_interview_questions():
    try:
        data = request.get_json()
        question = data.get('question')
        
        if not question:
            return jsonify({"error": "question is required"}), 400
        
        # Run async translation functions synchronously
        translated_question, original_lang = asyncio.run(detect_and_translate(question))
        
        # Process the question
        vector_store_path = os.path.join(VECTOR_STORE_FOLDER, "faiss_index")
        response = user_input(translated_question, vector_store_path)
        answer = response.answer
        
        # Translate back if needed
        translated_answer = asyncio.run(translate_back(answer, original_lang))
        response.answer = translated_answer
        
        return jsonify({
            'status': 'success',
            'response': response.dict()
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == "__main__":
    app.run(port=5020, debug=True)