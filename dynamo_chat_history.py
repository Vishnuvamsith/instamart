import uuid
from datetime import datetime
from langchain.schema import HumanMessage, AIMessage
from langchain_core.chat_history import BaseChatMessageHistory
from boto3.dynamodb.conditions import Key
from config import Config
from dynamodb_manager import dynamodb_manager  # Make sure this path is correct

class DynamoDBChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.config = Config()
        self.table = dynamodb_manager.get_table(self.config.DYNAMO_MEMORY_TABLE)

    @property
    def messages(self):
        response = self.table.query(
            KeyConditionExpression=Key("session_id").eq(self.session_id),
            ScanIndexForward=True  # chronological order
        )
        return [
            HumanMessage(content=item["content"]) if item["role"] == "human"
            else AIMessage(content=item["content"])
            for item in response.get("Items", [])
        ]

    def add_user_message(self, message: str):
        self._store_message("human", message)

    def add_ai_message(self, message: str):
        self._store_message("ai", message)
    def add_message(self, message):
        role = "human" if isinstance(message, HumanMessage) else "ai"
        self._store_message(role, message.content)

    def add_messages(self, messages):
        for msg in messages:
            self.add_message(msg)

    def _store_message(self, role: str, content: str):
        self.table.put_item(Item={
            "session_id": self.session_id,
            "message_id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        })

    def clear(self):
        response = self.table.query(
            KeyConditionExpression=Key("session_id").eq(self.session_id)
        )
        with self.table.batch_writer() as batch:
            for item in response.get("Items", []):
                batch.delete_item(Key={
                    "session_id": item["session_id"],
                    "message_id": item["message_id"]
                })
