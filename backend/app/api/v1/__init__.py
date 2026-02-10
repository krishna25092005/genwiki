"""API Router - Main entry point for all API routes"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, articles, ai, users, saved_topics

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(articles.router, prefix="/articles", tags=["Articles"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Features"])
api_router.include_router(saved_topics.router, prefix="/saved", tags=["Saved Topics"])
