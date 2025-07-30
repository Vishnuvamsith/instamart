# import boto3
# from botocore.exceptions import BotoCoreError, ClientError
# from config import Config
# import logging
# from io import BytesIO
# import unicodedata

# logger = logging.getLogger(__name__)

# def clean_filename(name):
#     return unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")

# class S3Manager:
#     def __init__(self):
#         self.config = Config()
#         self.session = None
#         self.s3_client = None
#         self._connect()

#     def _connect(self):
#         try:
#             # Connect using named profile
#             self.session = boto3.Session(profile_name=self.config.AWS_PROFILE_NAME)
#             self.s3_client = self.session.client("s3", region_name=self.config.AWS_REGION)

#             # Try listing buckets to verify
#             self.s3_client.list_buckets()
#             logger.info("✅ S3 connection established via SSO profile")
#         except (BotoCoreError, ClientError) as e:
#             logger.error(f"❌ S3 connection failed: {str(e)}")
#             raise

#     def upload_file(self, file_stream: BytesIO, key: str, content_type: str = None):
#         """Upload a BytesIO stream to S3"""
#         try:
#             sanitized_key = clean_filename(key)
#             # Reset stream position to beginning
#             file_stream.seek(0)
            
#             # Prepare extra args for content type
#             extra_args = {}
#             if content_type:
#                 extra_args['ContentType'] = content_type
                
#             self.s3_client.upload_fileobj(
#                 file_stream, 
#                 self.config.S3_BUCKET, 
#                 sanitized_key,
#                 ExtraArgs=extra_args
#             )
#             logger.info(f"✅ Uploaded {sanitized_key} to S3")
#             return sanitized_key
#         except Exception as e:
#             logger.exception(f"❌ Failed to upload {key} to S3: {str(e)}")
#             raise

#     def upload_fileobj(self, file_stream: BytesIO, key: str, content_type: str = None):
#         """Compatibility method - same as upload_file but with different parameter order"""
#         return self.upload_file(file_stream, key, content_type)

#     def upload_file_from_path(self, file_path: str, key: str, content_type: str = None):
#         """Upload a file from local path to S3"""
#         try:
#             sanitized_key = clean_filename(key)
            
#             # Prepare extra args for content type
#             extra_args = {}
#             if content_type:
#                 extra_args['ContentType'] = content_type
                
#             with open(file_path, 'rb') as file_obj:
#                 self.s3_client.upload_fileobj(
#                     file_obj, 
#                     self.config.S3_BUCKET, 
#                     sanitized_key,
#                     ExtraArgs=extra_args
#                 )
#             logger.info(f"✅ Uploaded {sanitized_key} to S3 from {file_path}")
#             return sanitized_key
#         except Exception as e:
#             logger.exception(f"❌ Failed to upload {file_path} to S3: {str(e)}")
#             raise

#     def download_file(self, key: str) -> bytes:
#         """Download a file from S3 and return as bytes"""
#         try:
#             response = self.s3_client.get_object(Bucket=self.config.S3_BUCKET, Key=key)
#             content = response['Body'].read()
#             logger.info(f"✅ Downloaded {key} from S3")
#             return content
#         except ClientError as e:
#             if e.response['Error']['Code'] == 'NoSuchKey':
#                 logger.warning(f"🔍 File {key} not found in S3")
#                 return None
#             else:
#                 logger.error(f"❌ Failed to download {key} from S3: {str(e)}")
#                 raise
#         except Exception as e:
#             logger.exception(f"❌ Failed to download {key} from S3: {str(e)}")
#             raise

#     def list_objects(self, prefix: str = ""):
#         try:
#             response = self.s3_client.list_objects_v2(
#                 Bucket=self.config.S3_BUCKET,
#                 Prefix=prefix
#             )
#             return response.get("Contents", [])
#         except Exception as e:
#             logger.error(f"❌ Failed to list objects in S3: {str(e)}")
#             return []

#     def file_exists(self, key: str) -> bool:
#         try:
#             self.s3_client.head_object(Bucket=self.config.S3_BUCKET, Key=key)
#             return True
#         except ClientError as e:
#             if e.response['Error']['Code'] == '404':
#                 return False
#             else:
#                 raise
#         except Exception:
#             return False

# s3_manager = S3Manager()


import boto3
from botocore.exceptions import BotoCoreError, ClientError
from config import Config
import logging
from io import BytesIO
import unicodedata

logger = logging.getLogger(__name__)

def clean_filename(name):
    return unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")

class S3Manager:
    def __init__(self):
        self.config = Config()
        self.s3_client = None
        self._connect()

    def _connect(self):
        try:
            # No profile_name — rely on IAM role or environment credentials
            self.s3_client = boto3.client("s3", region_name=self.config.AWS_REGION)

            self.s3_client.list_buckets()
            logger.info("✅ S3 connection established (IAM or environment-based)")
        except (BotoCoreError, ClientError) as e:
            logger.error(f"❌ S3 connection failed: {str(e)}")
            raise

    def upload_file(self, file_stream: BytesIO, key: str, content_type: str = None):
        try:
            sanitized_key = clean_filename(key)
            file_stream.seek(0)
            extra_args = {'ContentType': content_type} if content_type else {}

            self.s3_client.upload_fileobj(
                file_stream,
                self.config.S3_BUCKET,
                sanitized_key,
                ExtraArgs=extra_args
            )
            logger.info(f"✅ Uploaded {sanitized_key} to S3")
            return sanitized_key
        except Exception as e:
            logger.exception(f"❌ Failed to upload {key} to S3: {str(e)}")
            raise

    def upload_fileobj(self, file_stream: BytesIO, key: str, content_type: str = None):
        return self.upload_file(file_stream, key, content_type)

    def upload_file_from_path(self, file_path: str, key: str, content_type: str = None):
        try:
            sanitized_key = clean_filename(key)
            extra_args = {'ContentType': content_type} if content_type else {}

            with open(file_path, 'rb') as file_obj:
                self.s3_client.upload_fileobj(
                    file_obj,
                    self.config.S3_BUCKET,
                    sanitized_key,
                    ExtraArgs=extra_args
                )
            logger.info(f"✅ Uploaded {sanitized_key} to S3 from {file_path}")
            return sanitized_key
        except Exception as e:
            logger.exception(f"❌ Failed to upload {file_path} to S3: {str(e)}")
            raise

    def download_file(self, key: str) -> bytes:
        try:
            response = self.s3_client.get_object(Bucket=self.config.S3_BUCKET, Key=key)
            content = response['Body'].read()
            logger.info(f"✅ Downloaded {key} from S3")
            return content
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                logger.warning(f"🔍 File {key} not found in S3")
                return None
            else:
                logger.error(f"❌ Failed to download {key} from S3: {str(e)}")
                raise
        except Exception as e:
            logger.exception(f"❌ Failed to download {key} from S3: {str(e)}")
            raise

    def list_objects(self, prefix: str = ""):
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.config.S3_BUCKET,
                Prefix=prefix
            )
            return response.get("Contents", [])
        except Exception as e:
            logger.error(f"❌ Failed to list objects in S3: {str(e)}")
            return []

    def file_exists(self, key: str) -> bool:
        try:
            self.s3_client.head_object(Bucket=self.config.S3_BUCKET, Key=key)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            else:
                raise
        except Exception:
            return False

s3_manager = S3Manager()
