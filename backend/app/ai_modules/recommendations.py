"""
AI Recommendation Engine
Provides personalized content recommendations
"""

import logging
from typing import List, Dict
from collections import Counter
import google.generativeai as genai

from app.core.config import settings
from app.core.database import get_database

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class RecommendationService:
    """Service for personalized content recommendations"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-3-flash-preview')
    
    async def get_personalized_recommendations(
        self,
        user_id: str,
        user_interests: List[str],
        user_level: str,
        limit: int = 5
    ) -> List[Dict]:
        """
        Get personalized article recommendations based on user profile
        
        Args:
            user_id: User's ID
            user_interests: User's declared interests
            user_level: User's knowledge level
            limit: Number of recommendations to return
        """
        
        try:
            db = get_database()
            
            # Get user's reading history
            saved_articles = await db.saved_topics.find(
                {"userId": user_id}
            ).limit(20).to_list(20)
            
            read_article_ids = [article['articleId'] for article in saved_articles]
            
            # Build recommendation query
            recommendations = []
            
            # 1. Interest-based recommendations (60%)
            interest_count = int(limit * 0.6) or 2
            interest_recs = await self._get_interest_based(
                user_interests,
                read_article_ids,
                interest_count
            )
            recommendations.extend(interest_recs)
            
            # 2. Level-appropriate recommendations (30%)
            level_count = int(limit * 0.3) or 1
            level_recs = await self._get_level_based(
                user_level,
                read_article_ids,
                level_count
            )
            recommendations.extend(level_recs)
            
            # 3. Trending/popular recommendations (10%)
            trending_count = max(1, limit - len(recommendations))
            trending_recs = await self._get_trending(
                read_article_ids,
                trending_count
            )
            recommendations.extend(trending_recs)
            
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Recommendation error: {str(e)}")
            return []
    
    async def _get_interest_based(
        self,
        interests: List[str],
        exclude_ids: List[str],
        limit: int
    ) -> List[Dict]:
        """Get recommendations based on user interests"""
        
        db = get_database()
        
        # Find articles matching user interests
        query = {
            "_id": {"$nin": exclude_ids},
            "$or": [
                {"category": {"$in": interests}},
                {"tags": {"$in": interests}}
            ]
        }
        
        articles = await db.articles.find(query).limit(limit * 2).to_list(limit * 2)
        
        # Score and sort by relevance
        scored_articles = []
        for article in articles:
            score = 0
            
            # Category match
            if article.get('category') in interests:
                score += 3
            
            # Tag matches
            article_tags = article.get('tags', [])
            matching_tags = set(article_tags) & set(interests)
            score += len(matching_tags) * 2
            
            # Popularity bonus
            score += min(article.get('likes', 0) / 100, 2)
            
            scored_articles.append((score, article))
        
        # Sort by score
        scored_articles.sort(key=lambda x: x[0], reverse=True)
        
        return [article for _, article in scored_articles[:limit]]
    
    async def _get_level_based(
        self,
        user_level: str,
        exclude_ids: List[str],
        limit: int
    ) -> List[Dict]:
        """Get recommendations appropriate for user's level"""
        
        db = get_database()
        
        # Map user level to difficulty
        level_to_difficulty = {
            "beginner": "easy",
            "intermediate": "medium",
            "advanced": "hard"
        }
        
        difficulty = level_to_difficulty.get(user_level, "medium")
        
        query = {
            "_id": {"$nin": exclude_ids},
            "difficulty": difficulty
        }
        
        articles = await db.articles.find(query).limit(limit).to_list(limit)
        
        return articles
    
    async def _get_trending(
        self,
        exclude_ids: List[str],
        limit: int
    ) -> List[Dict]:
        """Get trending articles"""
        
        db = get_database()
        
        # Get articles with high engagement (views + likes)
        query = {"_id": {"$nin": exclude_ids}}
        
        articles = await db.articles.find(query).sort([
            ("views", -1),
            ("likes", -1)
        ]).limit(limit).to_list(limit)
        
        return articles
    
    async def get_related_articles(
        self,
        article_id: str,
        limit: int = 5
    ) -> List[Dict]:
        """Get articles related to a specific article"""
        
        try:
            db = get_database()
            
            # Get the source article
            source_article = await db.articles.find_one({"_id": article_id})
            
            if not source_article:
                return []
            
            # Find related articles
            related_query = {
                "_id": {"$ne": article_id},
                "$or": [
                    {"category": source_article.get('category')},
                    {"tags": {"$in": source_article.get('tags', [])}}
                ]
            }
            
            related_articles = await db.articles.find(related_query).limit(limit * 2).to_list(limit * 2)
            
            # Score by similarity
            scored = []
            source_tags = set(source_article.get('tags', []))
            
            for article in related_articles:
                score = 0
                
                # Same category
                if article.get('category') == source_article.get('category'):
                    score += 3
                
                # Tag overlap
                article_tags = set(article.get('tags', []))
                overlap = len(source_tags & article_tags)
                score += overlap * 2
                
                scored.append((score, article))
            
            scored.sort(key=lambda x: x[0], reverse=True)
            
            return [article for _, article in scored[:limit]]
            
        except Exception as e:
            logger.error(f"Related articles error: {str(e)}")
            return []
    
    async def get_topic_suggestions(
        self,
        user_query: str,
        limit: int = 5
    ) -> List[str]:
        """Get topic suggestions based on user query using AI"""
        
        prompt = f"""
        Based on the search query "{user_query}", suggest {limit} related topics 
        that a user might be interested in exploring.
        
        Return only the topic names, one per line, without numbering or explanation.
        """
        
        try:
            response = self.model.generate_content(prompt)
            topics = [
                line.strip().lstrip('0123456789.-•) ')
                for line in response.text.split('\n')
                if line.strip()
            ]
            return topics[:limit]
        except Exception as e:
            logger.error(f"Topic suggestion error: {str(e)}")
            return []


# Singleton instance
recommendation_service = RecommendationService()
