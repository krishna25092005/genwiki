"""Pydantic models for API requests and responses"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    """Difficulty levels for content"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class UserLevel(str, Enum):
    """User knowledge levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ============ User Models ============

class UserCreate(BaseModel):
    """User registration model"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)
    interests: List[str] = []
    level: UserLevel = UserLevel.BEGINNER


class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response model"""
    id: str
    email: str
    name: str
    interests: List[str]
    level: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    joinedAt: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """User update model"""
    name: Optional[str] = None
    interests: Optional[List[str]] = None
    level: Optional[UserLevel] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


# ============ Article Models ============

class ArticleCreate(BaseModel):
    """Article creation model"""
    title: str = Field(..., min_length=3)
    content: str = Field(..., min_length=50)
    category: str
    tags: List[str] = []
    imageUrl: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    sources: Optional[List[str]] = []


class ArticleResponse(BaseModel):
    """Article response model"""
    id: str
    title: str
    slug: str
    content: str
    summary: str
    category: str
    tags: List[str]
    imageUrl: Optional[str]
    views: int
    likes: int
    difficulty: str
    readingTime: int
    publishedAt: datetime
    author: Optional[dict] = None
    
    class Config:
        from_attributes = True


class ArticleUpdate(BaseModel):
    """Article update model"""
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    imageUrl: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None


# ============ AI Models ============

class SummarizeRequest(BaseModel):
    """Request for content summarization"""
    content: str = Field(..., min_length=50)
    maxLength: int = Field(default=300, ge=50, le=1000)
    style: Optional[str] = "concise"  # concise, eli5, bullet_points, emoji


class SummarizeResponse(BaseModel):
    """Response for content summarization"""
    summary: str
    originalLength: int
    summaryLength: int
    style: str


class ChatRequest(BaseModel):
    """Request for AI chat"""
    message: str = Field(..., min_length=1)
    articleId: Optional[str] = None
    conversationId: Optional[str] = None


class ChatResponse(BaseModel):
    """Response for AI chat"""
    response: str
    conversationId: Optional[str] = None
    timestamp: datetime


class PersonalizeRequest(BaseModel):
    """Request for content personalization"""
    content: str
    userInterests: List[str]
    userLevel: UserLevel


class PersonalizeResponse(BaseModel):
    """Response for content personalization"""
    personalizedContent: str
    adjustments: dict


# ============ Search Models ============

class SearchRequest(BaseModel):
    """Search request model"""
    query: str = Field(..., min_length=1)
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    difficulty: Optional[DifficultyLevel] = None
    limit: int = Field(default=10, ge=1, le=50)


class SearchResponse(BaseModel):
    """Search response model"""
    results: List[ArticleResponse]
    total: int
    query: str


# ============ Saved Topics Models ============

class SavedTopicCreate(BaseModel):
    """Saved topic creation model"""
    articleId: str


class SavedTopicResponse(BaseModel):
    """Saved topic response model"""
    id: str
    userId: str
    articleId: str
    savedAt: datetime
    article: Optional[ArticleResponse] = None
    
    class Config:
        from_attributes = True


# ============ Conversation Models ============

class ConversationResponse(BaseModel):
    """Conversation response model"""
    id: str
    userId: str
    messages: List[dict]
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True


# ============ Recommendation Models ============

class RecommendationRequest(BaseModel):
    """Request for personalized recommendations"""
    userId: str
    limit: int = Field(default=5, ge=1, le=20)


class RecommendationResponse(BaseModel):
    """Response for personalized recommendations"""
    recommendations: List[ArticleResponse]
    reason: str


# ============ Token Models ============

class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data"""
    email: Optional[str] = None
