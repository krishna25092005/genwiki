"""Saved topics endpoints"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List
from bson import ObjectId
from datetime import datetime

from app.models.schemas import SavedTopicCreate, SavedTopicResponse
from app.models.database import SavedTopicModel
from app.core.security import get_current_user
from app.core.database import get_database

router = APIRouter()


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def save_topic(
    saved_topic: SavedTopicCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Save an article/topic for later
    
    Requires authentication token
    
    - **articleId**: Article's ID to save
    """
    try:
        db = get_database()
        
        # Check if article exists
        article = await db.articles.find_one({"_id": ObjectId(saved_topic.articleId)})
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        # Check if already saved
        existing = await db.saved_topics.find_one({
            "userId": ObjectId(current_user["user_id"]),
            "articleId": ObjectId(saved_topic.articleId)
        })
        
        if existing:
            return {
                "message": "Article already saved",
                "savedTopicId": str(existing['_id'])
            }
        
        # Create saved topic
        saved_doc = SavedTopicModel.create_document(
            user_id=current_user["user_id"],
            article_id=saved_topic.articleId
        )
        
        result = await db.saved_topics.insert_one(saved_doc)
        
        return {
            "message": "Article saved successfully",
            "savedTopicId": str(result.inserted_id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save topic: {str(e)}"
        )


@router.get("/", response_model=List[dict])
async def get_saved_topics(
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's saved topics
    
    Requires authentication token
    
    - **limit**: Maximum results to return (1-100)
    - **skip**: Number of results to skip for pagination
    
    Returns list of saved articles with metadata
    """
    try:
        db = get_database()
        
        # Get saved topics
        cursor = db.saved_topics.find({
            "userId": ObjectId(current_user["user_id"])
        }).sort("savedAt", -1).skip(skip).limit(limit)
        
        saved_topics = await cursor.to_list(limit)
        
        # Fetch associated articles
        results = []
        for saved in saved_topics:
            article = await db.articles.find_one({"_id": saved['articleId']})
            
            if article:
                from app.services.article_service import article_service
                
                results.append({
                    "savedTopicId": str(saved['_id']),
                    "savedAt": saved['savedAt'],
                    "article": article_service._format_article(article)
                })
        
        return results
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve saved topics"
        )


@router.delete("/{saved_topic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_topic(
    saved_topic_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Remove a saved topic
    
    Requires authentication token
    
    - **saved_topic_id**: Saved topic's ID
    """
    try:
        db = get_database()
        
        # Delete saved topic (ensure it belongs to current user)
        result = await db.saved_topics.delete_one({
            "_id": ObjectId(saved_topic_id),
            "userId": ObjectId(current_user["user_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Saved topic not found"
            )
        
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove saved topic"
        )


@router.delete("/article/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_topic_by_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Remove a saved topic by article ID
    
    Requires authentication token
    
    - **article_id**: Article's ID
    
    Useful when you know the article ID but not the saved topic ID
    """
    try:
        db = get_database()
        
        result = await db.saved_topics.delete_one({
            "articleId": ObjectId(article_id),
            "userId": ObjectId(current_user["user_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Saved topic not found"
            )
        
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove saved topic"
        )


@router.get("/check/{article_id}", response_model=dict)
async def check_if_saved(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Check if an article is saved
    
    Requires authentication token
    
    - **article_id**: Article's ID
    
    Returns whether the article is saved and the saved topic ID if it exists
    """
    try:
        db = get_database()
        
        saved = await db.saved_topics.find_one({
            "articleId": ObjectId(article_id),
            "userId": ObjectId(current_user["user_id"])
        })
        
        if saved:
            return {
                "isSaved": True,
                "savedTopicId": str(saved['_id']),
                "savedAt": saved['savedAt']
            }
        else:
            return {
                "isSaved": False
            }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check saved status"
        )
