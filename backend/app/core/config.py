"""Core Configuration for Gen Z Wikipedia Backend"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    MONGODB_URI: str
    DATABASE_NAME: str = "genz_wikipedia"
    
    # AI API Keys
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Authentication
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis (optional)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001"
    ]
    
    # Wikipedia API
    WIKIPEDIA_API_URL: str = "https://en.wikipedia.org/w/api.php"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
