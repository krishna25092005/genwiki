"""User service for user management operations"""

import logging
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

from app.core.database import get_database
from app.core.security import hash_password, verify_password, create_access_token
from app.models.database import UserModel
from app.models.schemas import UserCreate, UserUpdate

logger = logging.getLogger(__name__)


class UserService:
    """Service for user-related operations"""
    
    async def create_user(self, user_data: UserCreate) -> dict:
        """Create a new user"""
        db = get_database()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data.email.lower()})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Hash password
        password_hash = hash_password(user_data.password)
        
        # Create user document
        user_doc = UserModel.create_document(
            email=user_data.email,
            password_hash=password_hash,
            name=user_data.name,
            interests=user_data.interests,
            level=user_data.level.value
        )
        
        # Insert into database
        result = await db.users.insert_one(user_doc)
        
        # Retrieve created user
        created_user = await db.users.find_one({"_id": result.inserted_id})
        
        return self._format_user(created_user)
    
    async def authenticate_user(self, email: str, password: str) -> dict:
        """Authenticate user and return user data with token"""
        db = get_database()
        
        # Find user
        user = await db.users.find_one({"email": email.lower()})
        
        if not user:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not verify_password(password, user['password']):
            raise ValueError("Invalid email or password")
        
        # Update last login
        await db.users.update_one(
            {"_id": user['_id']},
            {"$set": {"lastLogin": datetime.utcnow()}}
        )
        
        # Generate token
        token = create_access_token(
            data={"sub": str(user['_id']), "email": user['email']}
        )
        
        user_data = self._format_user(user)
        user_data['token'] = token
        
        return user_data
    
    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        db = get_database()
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return None
        
        return self._format_user(user)
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        db = get_database()
        
        user = await db.users.find_one({"email": email.lower()})
        
        if not user:
            return None
        
        return self._format_user(user)
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> dict:
        """Update user profile"""
        db = get_database()
        
        # Build update document
        update_doc = {}
        if user_data.name is not None:
            update_doc['name'] = user_data.name
        if user_data.interests is not None:
            update_doc['interests'] = user_data.interests
        if user_data.level is not None:
            update_doc['level'] = user_data.level.value
        if user_data.bio is not None:
            update_doc['bio'] = user_data.bio
        if user_data.avatar is not None:
            update_doc['avatar'] = user_data.avatar
        
        if not update_doc:
            raise ValueError("No fields to update")
        
        update_doc['updatedAt'] = UserModel.create_document("", "", "")['createdAt']
        
        # Update user
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_doc}
        )
        
        if result.matched_count == 0:
            raise ValueError("User not found")
        
        # Return updated user
        updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        return self._format_user(updated_user)
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user account"""
        db = get_database()
        
        result = await db.users.delete_one({"_id": ObjectId(user_id)})
        
        return result.deleted_count > 0
    
    def _format_user(self, user: dict) -> dict:
        """Format user document for response"""
        return {
            "id": str(user['_id']),
            "email": user['email'],
            "name": user['name'],
            "interests": user.get('interests', []),
            "level": user.get('level', 'beginner'),
            "avatar": user.get('avatar'),
            "bio": user.get('bio'),
            "joinedAt": user.get('joinedAt'),
            "preferences": user.get('preferences', {})
        }


# Singleton instance
user_service = UserService()
