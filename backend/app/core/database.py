"""Database connection and management"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    """Database connection manager"""
    
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}")
        
        db.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            maxPoolSize=10,
            minPoolSize=1,
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection
        await db.client.admin.command('ping')
        
        db.db = db.client[settings.DATABASE_NAME]
        
        logger.info(f"✅ Connected to database: {settings.DATABASE_NAME}")
        
        # Create indexes
        await create_indexes()
        
    except ConnectionFailure as e:
        logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error during MongoDB connection: {str(e)}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")


async def create_indexes():
    """Create database indexes for performance"""
    try:
        # Articles collection indexes
        await db.db.articles.create_index("slug", unique=True)
        await db.db.articles.create_index("category")
        await db.db.articles.create_index("tags")
        await db.db.articles.create_index([("title", "text"), ("content", "text")])
        
        # Users collection indexes
        await db.db.users.create_index("email", unique=True)
        await db.db.users.create_index("interests")
        
        # Conversations collection indexes
        await db.db.conversations.create_index("userId")
        await db.db.conversations.create_index("createdAt")
        
        # Saved topics collection indexes
        await db.db.saved_topics.create_index([("userId", 1), ("articleId", 1)], unique=True)
        
        logger.info("✅ Database indexes created successfully")
        
    except Exception as e:
        logger.warning(f"⚠️ Error creating indexes: {str(e)}")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db.db
