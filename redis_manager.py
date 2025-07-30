import redis
import json
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    def __init__(self, host='localhost', port=6379, db=0):
        try:
            self.client = redis.StrictRedis(host=host, port=port, db=db, decode_responses=True)
            self.client.ping()
            logger.info("✅ Connected to Redis")
        except Exception as e:
            logger.error(f"❌ Redis connection failed: {str(e)}")
            self.client = None

    def set_user_data(self, user_id, data, ttl=3600):
        if self.client:
            try:
                self.client.setex(f"user:{user_id}", ttl, json.dumps(data))
            except Exception as e:
                logger.error(f"❌ Failed to cache user data: {str(e)}")

    def get_user_data(self, user_id):
        if self.client:
            try:
                data = self.client.get(f"user:{user_id}")
                return json.loads(data) if data else None
            except Exception as e:
                logger.error(f"❌ Failed to retrieve user data: {str(e)}")
        return None

    def delete_user_data(self, user_id):
        if self.client:
            self.client.delete(f"user:{user_id}")

redis_cache = RedisCache()
