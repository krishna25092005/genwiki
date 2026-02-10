"""Article service for article management operations"""

import logging
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
import re

from app.core.database import get_database
from app.models.database import ArticleModel
from app.models.schemas import ArticleCreate, ArticleUpdate
from app.ai_modules.summarization import summarization_service

logger = logging.getLogger(__name__)


class ArticleService:
    """Service for article-related operations"""
    
    async def create_article(self, article_data: ArticleCreate, author_id: str) -> dict:
        """Create a new article with AI-generated summary"""
        try:
            logger.info(f"Creating article: {article_data.title}")
            db = get_database()
            
            # Generate slug from title
            slug = self._generate_slug(article_data.title)
            logger.info(f"Generated slug: {slug}")
            
            # Check if slug exists
            existing = await db.articles.find_one({"slug": slug})
            if existing:
                # Add timestamp to make unique
                slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
                logger.info(f"Slug already exists, using: {slug}")
            
            # Generate AI summary
            try:
                logger.info("Generating AI summary...")
                summary = await summarization_service.summarize(
                    article_data.content[:5000],  # Limit content for API
                    max_length=300,
                    style="concise"
                )
                logger.info(f"AI summary generated: {len(summary)} chars")
            except Exception as e:
                logger.warning(f"Failed to generate AI summary, using fallback: {e}")
                # Create a better fallback summary
                content = article_data.content
                sentences = content.split('. ')
                summary = '. '.join(sentences[:3]) + '.'
                if len(summary) > 300:
                    summary = summary[:297] + "..."
                logger.info("Using fallback summary")
            
            # Create article document
            logger.info("Creating article document...")
            article_doc = ArticleModel.create_document(
                title=article_data.title,
                slug=slug,
                content=article_data.content,
                summary=summary,
                author_id=author_id,
                category=article_data.category,
                tags=article_data.tags,
                difficulty=article_data.difficulty.value,
                image_url=article_data.imageUrl,
                sources=article_data.sources
            )
            
            # Insert into database
            logger.info("Inserting into database...")
            result = await db.articles.insert_one(article_doc)
            logger.info(f"Article inserted with ID: {result.inserted_id}")
            
            # Retrieve created article
            created_article = await db.articles.find_one({"_id": result.inserted_id})
            
            return self._format_article(created_article)
        except Exception as e:
            logger.error(f"Failed to create article: {str(e)}", exc_info=True)
            raise
        
        return self._format_article(created_article)
    
    async def get_article_by_id(self, article_id: str, increment_views: bool = True) -> Optional[dict]:
        """Get article by ID"""
        db = get_database()
        
        article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        if not article:
            return None
        
        # Increment view count
        if increment_views:
            await db.articles.update_one(
                {"_id": ObjectId(article_id)},
                {"$inc": {"views": 1}}
            )
            article['views'] = article.get('views', 0) + 1
        
        return self._format_article(article)
    
    async def get_article_by_slug(self, slug: str, increment_views: bool = True) -> Optional[dict]:
        """Get article by slug"""
        db = get_database()
        
        article = await db.articles.find_one({"slug": slug})
        
        if not article:
            return None
        
        # Increment view count
        if increment_views:
            await db.articles.update_one(
                {"slug": slug},
                {"$inc": {"views": 1}}
            )
            article['views'] = article.get('views', 0) + 1
        
        return self._format_article(article)
    
    async def get_article_by_title(self, title: str) -> Optional[dict]:
        """Get article by exact title match"""
        db = get_database()
        
        article = await db.articles.find_one({"title": title})
        
        if not article:
            return None
        
        return self._format_article(article)
    
    async def search_articles(
        self,
        query: str = None,
        category: str = None,
        tags: List[str] = None,
        difficulty: str = None,
        limit: int = 10,
        skip: int = 0
    ) -> dict:
        """Search articles with filters"""
        db = get_database()
        
        # Build search query
        search_query = {}
        
        # Text search
        if query:
            search_query["$text"] = {"$search": query}
        
        # Category filter
        if category:
            search_query["category"] = category
        
        # Tags filter
        if tags:
            search_query["tags"] = {"$in": tags}
        
        # Difficulty filter
        if difficulty:
            search_query["difficulty"] = difficulty
        
        # Execute search
        cursor = db.articles.find(search_query).skip(skip).limit(limit)
        articles = await cursor.to_list(limit)
        
        # Get total count
        total = await db.articles.count_documents(search_query)
        
        return {
            "results": [self._format_article(article) for article in articles],
            "total": total,
            "query": query or ""
        }
    
    async def get_articles_by_category(
        self,
        category: str,
        limit: int = 10
    ) -> List[dict]:
        """Get articles by category"""
        db = get_database()
        
        cursor = db.articles.find({"category": category}).limit(limit)
        articles = await cursor.to_list(limit)
        
        return [self._format_article(article) for article in articles]
    
    async def get_trending_articles(self, limit: int = 10) -> List[dict]:
        """Get trending articles (most views and likes)"""
        db = get_database()
        
        cursor = db.articles.find().sort([
            ("views", -1),
            ("likes", -1)
        ]).limit(limit)
        
        articles = await cursor.to_list(limit)
        
        return [self._format_article(article) for article in articles]
    
    async def update_article(self, article_id: str, article_data: ArticleUpdate) -> dict:
        """Update article"""
        db = get_database()
        
        # Build update document
        update_doc = {}
        if article_data.title is not None:
            update_doc['title'] = article_data.title
            update_doc['slug'] = self._generate_slug(article_data.title)
        if article_data.content is not None:
            update_doc['content'] = article_data.content
            # Regenerate summary
            try:
                summary = await summarization_service.summarize(
                    article_data.content,
                    max_length=300
                )
                update_doc['summary'] = summary
            except:
                pass
        if article_data.category is not None:
            update_doc['category'] = article_data.category
        if article_data.tags is not None:
            update_doc['tags'] = article_data.tags
        if article_data.imageUrl is not None:
            update_doc['imageUrl'] = article_data.imageUrl
        if article_data.difficulty is not None:
            update_doc['difficulty'] = article_data.difficulty.value
        
        if not update_doc:
            raise ValueError("No fields to update")
        
        update_doc['updatedAt'] = datetime.utcnow()
        
        # Update article
        result = await db.articles.update_one(
            {"_id": ObjectId(article_id)},
            {"$set": update_doc}
        )
        
        if result.matched_count == 0:
            raise ValueError("Article not found")
        
        # Return updated article
        updated_article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        return self._format_article(updated_article)
    
    async def delete_article(self, article_id: str) -> bool:
        """Delete article"""
        db = get_database()
        
        result = await db.articles.delete_one({"_id": ObjectId(article_id)})
        
        return result.deleted_count > 0
    
    async def like_article(self, article_id: str, user_id: str) -> dict:
        """Like/unlike article"""
        db = get_database()
        
        article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        if not article:
            raise ValueError("Article not found")
        
        liked_by = article.get('likedBy', [])
        user_object_id = ObjectId(user_id)
        
        if user_object_id in liked_by:
            # Unlike
            await db.articles.update_one(
                {"_id": ObjectId(article_id)},
                {
                    "$pull": {"likedBy": user_object_id},
                    "$inc": {"likes": -1}
                }
            )
            liked = False
        else:
            # Like
            await db.articles.update_one(
                {"_id": ObjectId(article_id)},
                {
                    "$push": {"likedBy": user_object_id},
                    "$inc": {"likes": 1}
                }
            )
            liked = True
        
        updated_article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        return {
            "article": self._format_article(updated_article),
            "liked": liked
        }
    
    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = slug.strip('-')
        return slug
    
    def _format_article(self, article: dict) -> dict:
        """Format article document for response"""
        return {
            "id": str(article['_id']),
            "title": article['title'],
            "slug": article['slug'],
            "content": article['content'],
            "summary": article['summary'],
            "category": article['category'],
            "tags": article.get('tags', []),
            "imageUrl": article.get('imageUrl'),
            "views": article.get('views', 0),
            "likes": article.get('likes', 0),
            "difficulty": article.get('difficulty', 'medium'),
            "readingTime": article.get('readingTime', 5),
            "publishedAt": article.get('publishedAt'),
            "updatedAt": article.get('updatedAt')
        }


# Singleton instance
article_service = ArticleService()
