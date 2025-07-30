# import jwt
# from flask import request, jsonify
# from functools import wraps
# from datetime import datetime, timedelta
# import os
# from database import db_manager
# from config import Config
# import logging

# logger = logging.getLogger(__name__)

# class AuthManager:
#     def __init__(self):
#         self.config = Config()
#         self.jwt_secret = os.getenv('JWT_SECRET')
#         self.user_collection = db_manager.get_collection('users')
    
#     def generate_token(self, user_data):
#         """Generate JWT token for authenticated user"""
#         payload = {
#             'exp': datetime.utcnow() + timedelta(days=1),
#             'iat': datetime.utcnow(),
#             'sub': str(user_data['_id']),
#             'name': user_data.get('name'),
#             'Phone_no': user_data.get('Phone_no')
#         }
#         return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
#     def verify_token(self, token):
#         """Verify JWT token and return decoded payload"""
#         try:
#             payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
#             return payload
#         except jwt.ExpiredSignatureError:
#             raise Exception('Token expired')
#         except jwt.InvalidTokenError:
#             raise Exception('Invalid token')
    
#     def token_required(self, f):
#         """Decorator for JWT authentication"""
#         @wraps(f)
#         def decorated(*args, **kwargs):
#             auth_header = request.headers.get('Authorization')
#             print(auth_header)
#             if not auth_header or not auth_header.startswith('Bearer '):
#                 return jsonify({
#                     'message': 'Access Denied. Invalid token format.'
#                 }), 401
            
#             token = auth_header.split(' ')[1]
#             print(token)
            
#             try:
#                 decoded = self.verify_token(token)
#                 print(decoded)
#                 current_time = datetime.utcnow().timestamp()
#                 expires_in = decoded['exp'] - current_time
                
#                 # Attach user info to request
#                 request.user = {
#                     'name': decoded.get('name'),
#                     'Phone_no': decoded.get('Phone_no'),
#                     'expires_in': expires_in
#                 }
                
#             except Exception as e:
#                 return jsonify({
#                     'message': str(e)
#                 }), 401
            
#             return f(*args, **kwargs)
#         return decorated
    
#     def get_user_by_phone(self, Phone_no):
#         """Get user by phone number"""
#         return self.user_collection.find_one({'Phone_no': Phone_no})
    
#     def create_user(self, name, Phone_no):
#         """Create new user"""
#         user_data = {
#             'name': name,
#             'Phone_no': str(Phone_no),
#             'created_at': datetime.utcnow()
#         }
#         result = self.user_collection.insert_one(user_data)
#         return user_data

# auth_manager = AuthManager()


# import jwt
# from flask import request, jsonify
# from functools import wraps
# from datetime import datetime, timedelta
# import os
# from config import Config
# import logging
# from boto3.dynamodb.conditions import Key
# from dynamodb_manager import dynamodb_manager

# logger = logging.getLogger(__name__)

# class AuthManager:
#     def __init__(self):
#         self.config = Config()
#         self.jwt_secret = os.getenv('JWT_SECRET')
#         self.user_table = dynamodb_manager.get_table('users')  # DynamoDB table name

#     def generate_token(self, user_data):
#         payload = {
#             'exp': datetime.utcnow() + timedelta(days=1),
#             'iat': datetime.utcnow(),
#             'sub': user_data.get('Phone_no'),
#             'name': user_data.get('name'),
#             'Phone_no': user_data.get('Phone_no')
#         }
#         return jwt.encode(payload, self.jwt_secret, algorithm='HS256')

#     def verify_token(self, token):
#         try:
#             return jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise Exception('Token expired')
#         except jwt.InvalidTokenError:
#             raise Exception('Invalid token')

#     def token_required(self, f):
#         @wraps(f)
#         def decorated(*args, **kwargs):
#             auth_header = request.headers.get('Authorization')
#             if not auth_header or not auth_header.startswith('Bearer '):
#                 return jsonify({'message': 'Access Denied. Invalid token format.'}), 401
#             token = auth_header.split(' ')[1]
#             try:
#                 decoded = self.verify_token(token)
#                 request.user = {
#                     'name': decoded.get('name'),
#                     'Phone_no': decoded.get('Phone_no'),
#                     'expires_in': decoded['exp'] - datetime.utcnow().timestamp()
#                 }
#             except Exception as e:
#                 return jsonify({'message': str(e)}), 401
#             return f(*args, **kwargs)
#         return decorated

#     def get_user_by_phone(self, Phone_no):
#         response = self.user_table.query(
#             KeyConditionExpression=Key('Phone_no').eq(Phone_no)
#         )
#         items = response.get('Items', [])
#         return items[0] if items else None

#     def create_user(self, name, Phone_no):
#         user_data = {
#             'Phone_no': Phone_no,
#             'name': name,
#             'created_at': datetime.utcnow().isoformat()
#         }
#         self.user_table.put_item(Item=user_data)
#         return user_data
# auth_manager = AuthManager()


import jwt
from flask import request, jsonify
from functools import wraps
from datetime import datetime, timedelta
import os
from config import Config
import logging
from boto3.dynamodb.conditions import Key
from dynamodb_manager import dynamodb_manager

logger = logging.getLogger(__name__)

class AuthManager:
    def __init__(self):
        self.config = Config()
        self.jwt_secret = os.getenv('JWT_SECRET')
        self.user_table = dynamodb_manager.get_table('InstamartUsers')  # DynamoDB table name

    def generate_token(self, user_data):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'Designation': user_data.get('Designation'),
            'Name': user_data.get('Name'),
            'Mobile': user_data.get('Mobile'),
            'DOJ':user_data.get('DOJ')
        }
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')

    def verify_token(self, token):
        try:
            return jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise Exception('Token expired')
        except jwt.InvalidTokenError:
            raise Exception('Invalid token')

    def token_required(self, f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'message': 'Access Denied. Invalid token format.'}), 401
            token = auth_header.split(' ')[1]
            try:
                decoded = self.verify_token(token)
                request.user = {
                    'Name': decoded.get('Name'),
                    'Mobile': decoded.get('Mobile'),
                    'DOJ': decoded.get('DOJ'),
                    'Designation': decoded.get('Designation'),
                    'expires_in': decoded['exp'] - datetime.utcnow().timestamp()
                }
            except Exception as e:
                return jsonify({'message': str(e)}), 401
            return f(*args, **kwargs)
        return decorated

    def get_user_by_phone(self, Mobile):
        response = self.user_table.query(
            KeyConditionExpression=Key('Mobile').eq(Mobile)
        )
        items = response.get('Items', [])
        return items[0] if items else None
    
auth_manager = AuthManager()

