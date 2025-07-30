# import boto3
# from botocore.exceptions import BotoCoreError, ClientError
# import logging
# from config import Config

# logger = logging.getLogger(__name__)

# class DynamoDBManager:
#     def __init__(self):
#         self.config = Config()
#         self.session = None
#         self.client = None
#         self.resource = None
#         self._connect()

#     def _connect(self):
#         try:
#             # Use a named profile (like "AWSSandboxAdmin-978983596161")
#             self.session = boto3.Session(profile_name=self.config.AWS_PROFILE_NAME)

#             self.client = self.session.client("dynamodb", region_name=self.config.AWS_REGION)
#             self.resource = self.session.resource("dynamodb", region_name=self.config.AWS_REGION)

#             # Validate connection
#             self.client.list_tables()
#             logger.info("✅ DynamoDB connection established via SSO profile")
#         except (BotoCoreError, ClientError) as e:
#             logger.error(f"❌ DynamoDB connection failed: {str(e)}")
#             raise

#     def get_table(self, table_name):
#         if self.resource is None:
#             self._connect()
#         return self.resource.Table(table_name)

#     def is_connected(self):
#         try:
#             self.client.list_tables()
#             return True
#         except Exception:
#             return False

#     def close(self):
#         self.client = None
#         self.resource = None
#         self.session = None
#         logger.info("🛑 DynamoDB session references cleared")

# # Singleton instance
# dynamodb_manager = DynamoDBManager()






import boto3
from botocore.exceptions import BotoCoreError, ClientError
import logging
from config import Config

logger = logging.getLogger(__name__)

class DynamoDBManager:
    def __init__(self):
        self.config = Config()
        self.client = None
        self.resource = None
        self._connect()

    def _connect(self):
        try:
            print(self.config.AWS_REGION)
            # No profile_name — rely on IAM role or environment credentials
            self.client = boto3.client("dynamodb", region_name=self.config.AWS_REGION)
            self.resource = boto3.resource("dynamodb", region_name=self.config.AWS_REGION)

            self.client.list_tables()  # Verify connection
            logger.info("✅ DynamoDB connection established (IAM or environment-based)")
        except (BotoCoreError, ClientError) as e:
            logger.error(f"❌ DynamoDB connection failed: {str(e)}")
            raise

    def get_table(self, table_name):
        return self.resource.Table(table_name)

    def is_connected(self):
        try:
            self.client.list_tables()
            return True
        except Exception:
            return False

    def close(self):
        self.client = None
        self.resource = None
        logger.info("🛑 DynamoDB session references cleared")

# Singleton instance
dynamodb_manager = DynamoDBManager()
