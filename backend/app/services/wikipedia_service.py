"""Wikipedia integration service for fetching article content"""

import logging
import aiohttp
from typing import Optional, Dict, List
from urllib.parse import quote

logger = logging.getLogger(__name__)


class WikipediaService:
    """Service for fetching content from Wikipedia API"""
    
    BASE_URL = "https://en.wikipedia.org/w/api.php"
    HEADERS = {
        'User-Agent': 'GenZWikipedia/1.0 (Educational Project; Contact: student@example.com)'
    }
    
    async def search_articles(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for articles on Wikipedia"""
        params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "srprop": "title|snippet"
        }
        
        try:
            logger.info(f"Searching Wikipedia for: {query}")
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params, headers=self.HEADERS) as response:
                    logger.info(f"Wikipedia API response status: {response.status}")
                    if response.status == 200:
                        data = await response.json()
                        results = data.get("query", {}).get("search", [])
                        logger.info(f"Found {len(results)} Wikipedia results")
                        return results
                    else:
                        error_text = await response.text()
                        logger.error(f"Wikipedia API error {response.status}: {error_text}")
        except Exception as e:
            logger.error(f"Failed to search Wikipedia: {e}", exc_info=True)
        
        return []
    
    async def get_article_content(self, title: str) -> Optional[Dict]:
        """Fetch full article content from Wikipedia"""
        params = {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "extracts|pageimages|categories|info",
            "explaintext": True,
            "exsectionformat": "plain",
            "piprop": "original",
            "inprop": "url",
            "cllimit": 10
        }
        
        try:
            logger.info(f"Fetching Wikipedia article: {title}")
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params, headers=self.HEADERS) as response:
                    logger.info(f"Article fetch response status: {response.status}")
                    if response.status == 200:
                        data = await response.json()
                        pages = data.get("query", {}).get("pages", {})
                        
                        # Get the first (and only) page
                        page = next(iter(pages.values()))
                        
                        if "missing" in page:
                            logger.warning(f"Article not found: {title}")
                            return None
                        
                        result = {
                            "title": page.get("title", ""),
                            "content": page.get("extract", ""),
                            "image_url": page.get("original", {}).get("source"),
                            "url": page.get("fullurl", ""),
                            "categories": [
                                cat.get("title", "").replace("Category:", "")
                                for cat in page.get("categories", [])
                            ]
                        }
                        logger.info(f"Successfully fetched article: {result['title']}, content length: {len(result['content'])}")
                        return result
                    else:
                        error_text = await response.text()
                        logger.error(f"Wikipedia API error {response.status}: {error_text}")
        except Exception as e:
            logger.error(f"Failed to fetch article from Wikipedia: {e}", exc_info=True)
        
        return None
    
    async def get_article_summary(self, title: str, sentences: int = 3) -> Optional[str]:
        """Get a short summary of an article"""
        params = {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
            "exsentences": sentences
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        pages = data.get("query", {}).get("pages", {})
                        page = next(iter(pages.values()))
                        
                        if "missing" not in page:
                            return page.get("extract", "")
        except Exception as e:
            logger.error(f"Failed to fetch summary from Wikipedia: {e}")
        
        return None
    
    def categorize_article(self, categories: List[str]) -> str:
        """Map Wikipedia categories to our categories"""
        category_mapping = {
            "Technology": ["technology", "computing", "software", "internet", "digital"],
            "Science": ["science", "biology", "chemistry", "physics", "astronomy"],
            "History": ["history", "historical", "ancient", "medieval"],
            "Environment": ["environment", "climate", "ecology", "nature"],
            "Health": ["health", "medicine", "disease", "medical"],
            "Business": ["business", "economics", "finance", "companies"],
            "Arts": ["arts", "music", "literature", "culture"],
            "Sports": ["sports", "games", "athletes"],
            "Politics": ["politics", "government", "law"],
            "Education": ["education", "learning", "schools"]
        }
        
        # Check categories for matches
        for our_category, keywords in category_mapping.items():
            for cat in categories:
                cat_lower = cat.lower()
                if any(keyword in cat_lower for keyword in keywords):
                    return our_category
        
        return "General"
    
    def determine_difficulty(self, content: str) -> str:
        """Estimate content difficulty based on length and complexity"""
        word_count = len(content.split())
        
        # Simple heuristic
        if word_count < 500:
            return "easy"
        elif word_count < 1500:
            return "medium"
        else:
            return "hard"


# Singleton instance
wikipedia_service = WikipediaService()
