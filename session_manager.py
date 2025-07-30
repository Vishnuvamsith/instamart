from datetime import datetime
import uuid
from flask import session
from database import db_manager
from config import Config

# class SessionManager:
#     def __init__(self):
#         self.config = Config()
    
#     def create_session_id(self):
#         return f"{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex}"
    
#     def get_current_session_id(self, request):
#         if 'initialized' not in session:
#             session.clear()
#             session['initialized'] = True
#             session['session_id'] = self.create_session_id()
#             session['created_at'] = datetime.utcnow().isoformat()
#             session['ip_address'] = request.remote_addr
#             session.modified = True
            
#         return session['session_id']
    
#     def log_session_action(self, session_id, action):
#         db_manager.get_collection(self.config.SESSION_COLLECTION).insert_one({
#             "session_id": session_id,
#             "action": action,
#             "timestamp": datetime.utcnow()
#         })
    
#     def get_session_history(self, session_id, page=1, per_page=10):
#         per_page = min(per_page, 50)
#         skip = (page - 1) * per_page
        
#         pipeline = [
#             {"$match": {"session_id": session_id}},
#             {"$sort": {"timestamp": -1}},
#             {"$skip": skip},
#             {"$limit": per_page},
#             {"$project": {
#                 "_id": 0,
#                 "question": "$original_question",
#                 "answer": 1,
#                 "timestamp": 1,
#                 "language": 1
#             }}
#         ]
        
#         return list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline))
    
#     def get_all_sessions(self):
#         pipeline = [
#             {"$sort": {"timestamp": -1}},
#             {"$group": {
#                 "_id": "$session_id",
#                 "first_question": {"$first": "$original_question"},
#                 "created_at": {"$first": "$timestamp"},
#                 "language": {"$first": "$language"}
#             }},
#             {"$sort": {"created_at": -1}},
#             {"$project": {
#                 "session_id": "$_id",
#                 "first_question": 1,
#                 "created_at": 1,
#                 "language": 1,
#                 "_id": 0
#             }}
#         ]
        
#         return list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline))
    
#     def delete_session(self, session_id):
#         session_result = db_manager.get_collection(self.config.SESSION_COLLECTION).delete_many(
#             {"session_id": session_id}
#         )
#         memory_result = db_manager.get_collection(self.config.MEMORY_COLLECTION).delete_many(
#             {"SessionId": session_id}
#         )
#         return session_result.deleted_count + memory_result.deleted_count

# session_manager = SessionManager()

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
    
    def log_session_action(self, session_id, action, user_info=None):
        log_data = {
            "session_id": session_id,
            "action": action,
            "timestamp": datetime.utcnow()
        }
        
        if user_info:
            log_data.update({
                "name": user_info.get('name'),
                "Phone_no": user_info.get('Phone_no')
            })
        
        db_manager.get_collection(self.config.SESSION_COLLECTION).insert_one(log_data)
    
    def log_conversation(self, session_id, question, answer, original_lang, user_info=None):
        log_data = {
            "session_id": session_id,
            "timestamp": datetime.utcnow(),
            "original_question": question,
            "translated_question": translated_question,
            "answer": answer,
            "language": original_lang,
            "metadata": {
                "user_agent": request.headers.get('User-Agent'),
                "ip_address": request.remote_addr
            }
        }
        
        if user_info:
            log_data.update({
                "name": user_info.get('name'),
                "Phone_no": user_info.get('Phone_no')
            })
        
        db_manager.get_collection(self.config.SESSION_COLLECTION).insert_one(log_data)
    
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
                "language": 1,
                "name": 1,
                "Phone_no": 1
            }}
        ]
        
        return list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline))
    
    def get_all_sessions(self, filter_by_user=None, page=1, per_page=10):
        per_page = min(per_page, 50)
        skip = (page - 1) * per_page
        
        match_stage = {}
        if filter_by_user:
            user_field = next(iter(filter_by_user))
            match_stage[user_field] = filter_by_user[user_field]
        
        pipeline = [
            {"$sort": {"timestamp": -1}},
            {"$match": match_stage} if match_stage else {"$match": {}},
            {"$group": {
                "_id": "$session_id",
                "first_question": {"$first": "$original_question"},
                "created_at": {"$first": "$timestamp"},
                "language": {"$first": "$language"},
                "user_id": {"$first": "$user_id"},
                "name": {"$first": "$name"},
                "Phone_no": {"$first": "$Phone_no"},
                "message_count": {"$sum": 1}
            }},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": per_page},
            {"$project": {
                "session_id": "$_id",
                "first_question": 1,
                "created_at": 1,
                "language": 1,
                "user_id": 1,
                "name": 1,
                "Phone_no": 1,
                "message_count": 1,
                "_id": 0
            }}
        ]
        
        if not filter_by_user:
            pipeline[-1]["$project"]["name"] = 0
            pipeline[-1]["$project"]["Phone_no"] = 0
        
        return {
            "sessions": list(db_manager.get_collection(self.config.SESSION_COLLECTION).aggregate(pipeline)),
            "page": page,
            "per_page": per_page
        }
    
    def delete_session(self, session_id):
        session_result = db_manager.get_collection(self.config.SESSION_COLLECTION).delete_many(
            {"session_id": session_id}
        )
        memory_result = db_manager.get_collection(self.config.MEMORY_COLLECTION).delete_many(
            {"SessionId": session_id}
        )
        return session_result.deleted_count + memory_result.deleted_count

session_manager = SessionManager()