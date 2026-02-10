"""Database models for MongoDB collections"""

from datetime import datetime
from typing import List, Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserModel:
    """User document model"""
    
    @staticmethod
    def create_document(
        email: str,
        password_hash: str,
        name: str,
        interests: List[str] = None,
        level: str = "beginner"
    ) -> dict:
        """Create a new user document"""
        return {
            "email": email.lower(),
            "password": password_hash,
            "name": name,
            "interests": interests or [],
            "level": level,
            "avatar": None,
            "bio": None,
            "joinedAt": datetime.utcnow(),
            "lastLogin": None,
            "preferences": {
                "darkMode": False,
                "emailNotifications": True,
                "privateProfile": False
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }


class ArticleModel:
    """Article document model"""
    
    @staticmethod
    def create_document(
        title: str,
        slug: str,
        content: str,
        summary: str,
        author_id: str,
        category: str,
        tags: List[str] = None,
        difficulty: str = "medium",
        image_url: str = None,
        sources: List[str] = None
    ) -> dict:
        """Create a new article document"""
        word_count = len(content.split())
        reading_time = max(1, word_count // 200)  # Average reading speed: 200 wpm
        
        return {
            "title": title,
            "slug": slug,
            "content": content,
            "summary": summary,
            "author": ObjectId(author_id),
            "category": category,
            "tags": tags or [],
            "imageUrl": image_url,
            "views": 0,
            "likes": 0,
            "likedBy": [],
            "difficulty": difficulty,
            "readingTime": reading_time,
            "sources": sources or [],
            "publishedAt": datetime.utcnow(),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }


class ConversationModel:
    """Conversation document model"""
    
    @staticmethod
    def create_document(
        user_id: str,
        article_id: str = None
    ) -> dict:
        """Create a new conversation document"""
        return {
            "userId": ObjectId(user_id),
            "articleId": ObjectId(article_id) if article_id else None,
            "messages": [],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    
    @staticmethod
    def add_message(
        role: str,
        content: str
    ) -> dict:
        """Create a message object"""
        return {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow()
        }


class SavedTopicModel:
    """Saved topic document model"""
    
    @staticmethod
    def create_document(
        user_id: str,
        article_id: str
    ) -> dict:
        """Create a new saved topic document"""
        return {
            "userId": ObjectId(user_id),
            "articleId": ObjectId(article_id),
            "savedAt": datetime.utcnow(),
            "createdAt": datetime.utcnow()
        }


class ReactionModel:
    """Reaction document model (bonus feature)"""
    
    @staticmethod
    def create_document(
        user_id: str,
        article_id: str,
        reaction_type: str,
        comment: str = None
    ) -> dict:
        """Create a new reaction document"""
        return {
            "userId": ObjectId(user_id),
            "articleId": ObjectId(article_id),
            "reactionType": reaction_type,  # like, love, helpful, etc.
            "comment": comment,
            "createdAt": datetime.utcnow()
        }
