from datetime import datetime
import uuid
from flask import session
from database import db_manager
from config import Config

class SessionManager:
    def __init__(self):
        self.config = Config()
    
    def create_session_id(self):
        return f"{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex}"
    
    def get_current_session_id(self, request):
        if 'initialized' not in session:
            session.clear()
            session['initialized'] = True
            session['session_id'] = self.create_session_id()
            session['created_at'] = datetime.utcnow().isoformat()
            session['ip_address'] = request.remote_addr
            session.modified = True
            
        return session['session_id']
    
    def log_session_action(self, session_id, action):
        db_manager.get_collection(self.config.SESSION_COLLECTION).insert_one({
            "session_id": session_id,
            "action": action,
            "timestamp": datetime.utcnow()
        })
    
    def get_session_history(self, session_id, page=1, per_page=10):
        per_page = min(per_page, 50)
        skip = (page - 1) * per_page
        
        pipeline = [
            {"$match": {"session_id": session_id}},
            {"$sort": {"timestamp": -1}},
            {"$skip": skip},
            {"$limit": per_page},
            {"$project": {
                "_id": 0,
                "question": "$original_question",
                "answer": 1,
                "timestamp": 1,
                "language": 1
            }}
        ]
        
        return list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline))
    
    def get_all_sessions(self):
        pipeline = [
            {"$sort": {"timestamp": -1}},
            {"$group": {
                "_id": "$session_id",
                "first_question": {"$first": "$original_question"},
                "created_at": {"$first": "$timestamp"},
                "language": {"$first": "$language"}
            }},
            {"$sort": {"created_at": -1}},
            {"$project": {
                "session_id": "$_id",
                "first_question": 1,
                "created_at": 1,
                "language": 1,
                "_id": 0
            }}
        ]
        
        return list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline))
    
    def delete_session(self, session_id):
        session_result = db_manager.get_collection(self.config.SESSION_COLLECTION).delete_many(
            {"session_id": session_id}
        )
        memory_result = db_manager.get_collection(self.config.MEMORY_COLLECTION).delete_many(
            {"SessionId": session_id}
        )
        return session_result.deleted_count + memory_result.deleted_count

session_manager = SessionManager()