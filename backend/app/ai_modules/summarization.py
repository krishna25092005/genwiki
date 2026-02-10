"""
AI Summarization Module
Generates summaries in multiple styles using Gemini AI
"""

import logging
from typing import Optional
import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class SummarizationService:
    """Service for AI-powered content summarization"""
    
    def __init__(self):
        try:
            # Use correct Gemini model name
            self.model = genai.GenerativeModel('gemini-3-flash-preview')
            logger.info("Gemini model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            self.model = None
    
    async def summarize(
        self,
        content: str,
        max_length: int = 300,
        style: str = "concise"
    ) -> str:
        """
        Generate summary based on style
        
        Styles:
        - concise: Standard professional summary
        - eli5: Explain Like I'm 5 (Gen Z friendly)
        - bullet_points: Key points in bullet format
        - emoji: Fun summary with emojis
        """
        
        try:
            if not self.model:
                raise Exception("Gemini model not initialized - check API key")
            
            if not content or len(content) < 50:
                raise ValueError("Content too short to summarize")
            
            prompt = self._build_prompt(content, max_length, style)
            
            response = await self._generate_content(prompt)
            
            return response
            
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            raise
    
    def _build_prompt(self, content: str, max_length: int, style: str) -> str:
        """Build prompt based on summarization style"""
        
        base_prompt = f"Summarize the following content in approximately {max_length} characters"
        
        style_instructions = {
            "concise": f"{base_prompt}. Make it clear, informative, and professional:\n\n",
            
            "eli5": f"{base_prompt}. Use Gen Z language - casual, relatable, with modern references. "
                   f"Imagine explaining to a 15-year-old who's scrolling through social media. "
                   f"Make it engaging and easy to understand:\n\n",
            
            "bullet_points": f"Extract the key points from the following content and present them as "
                            f"concise bullet points (maximum 5 points). Each point should be one sentence:\n\n",
            
            "emoji": f"{base_prompt}. Make it fun and engaging using relevant emojis throughout. "
                    f"Use Gen Z style communication:\n\n"
        }
        
        instruction = style_instructions.get(style, style_instructions["concise"])
        
        return f"{instruction}{content}"
    
    async def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise
    
    async def generate_title_summary(self, title: str, content: str) -> str:
        """Generate a catchy title-based summary"""
        prompt = f"""
        Create a one-sentence summary for an article titled "{title}".
        Make it engaging and Gen Z friendly. Use this content for context:
        
        {content[:500]}...
        """
        
        return await self._generate_content(prompt)
    
    async def extract_key_facts(self, content: str, count: int = 5) -> list:
        """Extract key facts from content"""
        prompt = f"""
        Extract exactly {count} key facts from the following content.
        Present each fact as a short, standalone statement.
        Format as a numbered list:
        
        {content}
        """
        
        response = await self._generate_content(prompt)
        
        # Parse numbered list
        facts = []
        for line in response.split('\n'):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                # Remove numbering/bullets
                fact = line.lstrip('0123456789.-•) ').strip()
                if fact:
                    facts.append(fact)
        
        return facts[:count]
    
    async def simplify_for_level(
        self,
        content: str,
        level: str = "beginner"
    ) -> str:
        """Simplify content based on user's knowledge level"""
        
        level_instructions = {
            "beginner": "Explain this in very simple terms, avoiding jargon. Use everyday examples and analogies.",
            "intermediate": "Explain this with moderate complexity. You can use some technical terms but explain them.",
            "advanced": "Provide a comprehensive explanation with technical details and nuanced insights."
        }
        
        instruction = level_instructions.get(level, level_instructions["beginner"])
        
        prompt = f"{instruction}\n\nContent:\n{content}"
        
        return await self._generate_content(prompt)


# Singleton instance
summarization_service = SummarizationService()
