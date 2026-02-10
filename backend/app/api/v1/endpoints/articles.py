"""Article management endpoints"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from app.models.schemas import ArticleCreate, ArticleResponse, ArticleUpdate, SearchRequest, SearchResponse
from app.services.article_service import article_service
from app.services.wikipedia_service import wikipedia_service
from app.ai_modules.recommendations import recommendation_service
from app.core.security import get_current_user

router = APIRouter()


@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: ArticleCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new article
    
    Requires authentication token
    
    - **title**: Article title
    - **content**: Full article content (minimum 50 characters)
    - **category**: Article category
    - **tags**: List of tags
    - **difficulty**: Content difficulty (easy, medium, hard)
    - **imageUrl**: Optional article image URL
    - **sources**: Optional list of source URLs
    
    AI will automatically generate a summary
    """
    try:
        article = await article_service.create_article(
            article_data,
            current_user["user_id"]
        )
        
        return article
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create article: {str(e)}"
        )


@router.get("/search", response_model=SearchResponse)
async def search_articles(
    query: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    limit: int = Query(10, ge=1, le=50, description="Results per page"),
    skip: int = Query(0, ge=0, description="Number of results to skip")
):
    """
    Search articles with filters
    
    - **query**: Text search query (optional)
    - **category**: Filter by category (optional)
    - **tags**: Filter by tags, comma-separated (optional)
    - **difficulty**: Filter by difficulty level (optional)
    - **limit**: Maximum results to return (1-50)
    - **skip**: Number of results to skip for pagination
    """
    try:
        # Parse tags if provided
        tags_list = tags.split(',') if tags else None
        
        results = await article_service.search_articles(
            query=query,
            category=category,
            tags=tags_list,
            difficulty=difficulty,
            limit=limit,
            skip=skip
        )
        
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search articles: {str(e)}"
        )


@router.get("/trending", response_model=List[ArticleResponse])
async def get_trending_articles(
    limit: int = Query(10, ge=1, le=50, description="Number of articles to return")
):
    """
    Get trending articles (most viewed and liked)
    
    - **limit**: Number of articles to return (1-50)
    """
    try:
        articles = await article_service.get_trending_articles(limit)
        return articles
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trending articles"
        )


@router.get("/category/{category}", response_model=List[ArticleResponse])
async def get_articles_by_category(
    category: str,
    limit: int = Query(10, ge=1, le=50)
):
    """
    Get articles by category
    
    - **category**: Category name
    - **limit**: Number of articles to return
    """
    try:
        articles = await article_service.get_articles_by_category(category, limit)
        return articles
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve articles"
        )


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: str):
    """
    Get article by ID
    
    - **article_id**: Article's ID
    
    Automatically increments view count
    """
    try:
        article = await article_service.get_article_by_id(article_id)
        
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        return article
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve article"
        )


@router.get("/slug/{slug}", response_model=ArticleResponse)
async def get_article_by_slug(slug: str):
    """
    Get article by slug (URL-friendly identifier)
    
    - **slug**: Article's slug
    """
    try:
        article = await article_service.get_article_by_slug(slug)
        
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        return article
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve article"
        )


@router.get("/{article_id}/related", response_model=List[ArticleResponse])
async def get_related_articles(
    article_id: str,
    limit: int = Query(5, ge=1, le=10)
):
    """
    Get articles related to a specific article
    
    - **article_id**: Source article's ID
    - **limit**: Number of related articles to return
    """
    try:
        related = await recommendation_service.get_related_articles(
            article_id,
            limit
        )
        
        return related
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve related articles"
        )


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article_data: ArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update an existing article
    
    Requires authentication token
    
    - **article_id**: Article's ID
    - Updates allowed for title, content, category, tags, imageUrl, difficulty
    """
    try:
        updated_article = await article_service.update_article(
            article_id,
            article_data
        )
        
        return updated_article
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update article"
        )


@router.post("/{article_id}/like", response_model=dict)
async def like_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Like or unlike an article
    
    Requires authentication token
    
    - **article_id**: Article's ID
    
    Toggles like status for the current user
    """
    try:
        result = await article_service.like_article(
            article_id,
            current_user["user_id"]
        )
        
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to like article"
        )


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an article
    
    Requires authentication token
    
    - **article_id**: Article's ID
    """
    try:
        deleted = await article_service.delete_article(article_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete article"
        )


@router.get("/wikipedia/search")
async def search_wikipedia(
    query: str = Query(..., description="Search query for Wikipedia"),
    limit: int = Query(10, ge=1, le=20, description="Number of results")
):
    """
    Search Wikipedia for articles
    
    - **query**: Search term
    - **limit**: Maximum number of results (1-20)
    
    Returns list of Wikipedia article titles and snippets
    """
    try:
        results = await wikipedia_service.search_articles(query, limit)
        
        return {
            "query": query,
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search Wikipedia: {str(e)}"
        )


@router.post("/wikipedia/import")
async def import_from_wikipedia(
    title: str = Query(..., description="Wikipedia article title to import"),
    current_user: dict = Depends(get_current_user)
):
    """
    Import an article from Wikipedia and save to database
    
    Requires authentication token
    
    - **title**: Wikipedia article title
    
    Fetches content from Wikipedia, generates AI summary, and creates article
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Import request for: {title}")
        
        # Check if article already exists
        logger.info("Checking if article already exists...")
        existing = await article_service.get_article_by_title(title)
        if existing:
            logger.info(f"Article '{title}' already exists")
            return {
                "message": "Article already exists",
                "article": existing
            }
        
        # Fetch from Wikipedia
        logger.info(f"Fetching article from Wikipedia: {title}")
        wiki_data = await wikipedia_service.get_article_content(title)
        
        if not wiki_data:
            logger.error(f"Article not found on Wikipedia: {title}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found on Wikipedia"
            )
        
        logger.info(f"Successfully fetched article. Content length: {len(wiki_data.get('content', ''))}")
        
        # Determine category and difficulty
        logger.info("Determining category and difficulty...")
        category = wikipedia_service.categorize_article(wiki_data.get("categories", []))
        difficulty = wikipedia_service.determine_difficulty(wiki_data["content"])
        logger.info(f"Category: {category}, Difficulty: {difficulty}")
        
        # Create article in our database
        from app.models.schemas import ArticleCreate, DifficultyLevel
        
        logger.info("Creating article object...")
        article_data = ArticleCreate(
            title=wiki_data["title"],
            content=wiki_data["content"],
            category=category,
            tags=[],
            difficulty=DifficultyLevel(difficulty),
            imageUrl=wiki_data.get("image_url"),
            sources=[wiki_data.get("url")] if wiki_data.get("url") else []
        )
        
        logger.info("Saving article to database...")
        article = await article_service.create_article(article_data, current_user["user_id"])
        logger.info(f"Article created successfully with ID: {article.get('id')}")
        
        return {
            "message": "Article imported successfully",
            "article": article
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to import article '{title}': {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to import article: {str(e)}"
        )
