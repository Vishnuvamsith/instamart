# session_manager.py
from datetime import datetime,timezone
import pytz 
import uuid
from flask import session, request
from config import Config
from dynamodb_manager import dynamodb_manager
from boto3.dynamodb.conditions import Key, Attr

class DynamoDBSessionManager:
    def __init__(self):
        self.config = Config()
        self.table = dynamodb_manager.get_table(self.config.DYNAMO_SESSION_TABLE)
        self.memory_table=dynamodb_manager.get_table(self.config.DYNAMO_MEMORY_TABLE)

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
        item = {
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "type": "action",
            "action": action,
        }
        if user_info:
            item["name"] = user_info.get('Name')
            item["Phone_no"] = user_info.get('Mobile')
        self.table.put_item(Item=item)

    def log_conversation(self, session_id, question, answer, original_lang, user_info=None):
        utc_now = datetime.now(timezone.utc)
        ist = pytz.timezone('Asia/Kolkata')
        ist_now = utc_now.astimezone(ist)
        item = {
            "session_id": session_id,
            "timestamp": ist_now.isoformat(),
            "type": "conversation",
            "original_question": question,
            "translated_question": question,  # Assuming no translation layer yet
            "answer": answer,
            "language": original_lang,
            "metadata": {
                "user_agent": request.headers.get('User-Agent'),
                "ip_address": request.remote_addr
            }
        }
        if user_info:
            item["name"] = user_info.get('Name')
            item["Phone_no"] = user_info.get('Mobile')
        self.table.put_item(Item=item)

    def get_session_history(self, session_id, page=1, per_page=10):
        response = self.table.query(
            KeyConditionExpression=Key("session_id").eq(session_id),
            FilterExpression=Attr("type").eq("conversation"),
            ScanIndexForward=False
        )
        items = response.get("Items", [])
        start = (page - 1) * per_page
        end = start + per_page
        return items[start:end]

    # def get_all_sessions(self, filter_by_user=None, page=1, per_page=10):
    #     scan_filter = Attr("type").eq("conversation")
    #     if filter_by_user:
    #         key, val = next(iter(filter_by_user.items()))
    #         scan_filter = scan_filter & Attr(key).eq(val)

    #     response = self.table.scan(FilterExpression=scan_filter)
    #     sessions = {}

    #     for item in response.get("Items", []):
    #         sid = item["session_id"]
    #         if sid not in sessions:
    #             sessions[sid] = {
    #                 "session_id": sid,
    #                 "first_question": item.get("original_question"),
    #                 "created_at": item["timestamp"],
    #                 "language": item.get("language"),
    #                 "name": item.get("name"),
    #                 "Phone_no": item.get("Phone_no"),
    #                 "message_count": 0
    #             }
    #         sessions[sid]["message_count"] += 1

    #     sorted_sessions = sorted(sessions.values(), key=lambda x: x["created_at"], reverse=True)
    #     start = (page - 1) * per_page
    #     end = start + per_page

    #     return {
    #         "sessions": sorted_sessions[start:end],
    #         "page": page,
    #         "per_page": per_page
    #     }
    def get_all_sessions(self, filter_by_user=None):
        phone_no = filter_by_user.get('Phone_no') if filter_by_user else None
        if not phone_no:
            raise ValueError("Phone_no is required to filter sessions by user")

        response = self.table.scan(
            FilterExpression=Attr("Phone_no").eq(phone_no) & Attr("type").eq("conversation")
        )

        seen_session_ids = set()
        sessions = []

        for item in response.get("Items", []):
            session_id = item["session_id"]
            if session_id not in seen_session_ids:
                seen_session_ids.add(session_id)
                sessions.append({
                    "session_id": session_id,
                    "timestamp": item.get("timestamp"),
                    "first_question": item.get("original_question", ""),
                    "name": item.get("name", ""),
                    "language": item.get("language", ""),
                    "Phone_no": item.get("Phone_no", "")
                })

        # Sort sessions by timestamp (most recent first)
        sessions.sort(key=lambda x: x["timestamp"] or "", reverse=True)

        return sessions

    def delete_session(self, session_id):
    # Fetch session conversation entries
        conv_items = self.table.query(
            KeyConditionExpression=Key("session_id").eq(session_id)
        )["Items"]

    # Fetch memory entries for chat history
        mem_items = self.memory_table.query(
            KeyConditionExpression=Key("session_id").eq(session_id)
        )["Items"]

    # Delete from conversations table
        with self.table.batch_writer() as batch:
            for item in conv_items:
                batch.delete_item(Key={
                    "session_id": item["session_id"]
                    # "timestamp": item["timestamp"]
                })

    # Delete from memory table (chat memory)
        with self.memory_table.batch_writer() as batch:
            for item in mem_items:
                batch.delete_item(Key={
                    "session_id": item["session_id"]
                    # "message_id": item["message_id"]
                })

        return len(conv_items) + len(mem_items)



# Singleton instance
dynamo_session_manager = DynamoDBSessionManager()
