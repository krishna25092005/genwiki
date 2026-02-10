"""
AI Chat Module
Provides conversational AI for article-based Q&A
"""

import logging
from typing import List, Dict, Optional
import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class ChatService:
    """Service for AI-powered conversational Q&A"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-3-flash-preview')
        self.max_history = 10  # Keep last 10 messages for context
    
    async def generate_response(
        self,
        message: str,
        conversation_history: List[Dict[str, str]] = None,
        article_context: Optional[str] = None
    ) -> str:
        """
        Generate AI response with conversation context
        
        Args:
            message: User's message
            conversation_history: Previous messages in conversation
            article_context: Optional article content for context-aware responses
        """
        
        try:
            prompt = self._build_conversation_prompt(
                message,
                conversation_history or [],
                article_context
            )
            
            response = await self._generate_content(prompt)
            
            return response
            
        except Exception as e:
            logger.error(f"Chat generation error: {str(e)}")
            raise
    
    def _build_conversation_prompt(
        self,
        current_message: str,
        history: List[Dict[str, str]],
        article_context: Optional[str] = None
    ) -> str:
        """Build conversation prompt with context"""
        
        # System instruction
        system_instruction = (
            "You are a friendly, knowledgeable AI assistant helping Gen Z users learn about various topics. "
            "Your responses should be:\n"
            "- Clear and engaging\n"
            "- Use modern, relatable language\n"
            "- Include relevant examples\n"
            "- Be concise but informative\n"
            "- Encourage curiosity and further learning\n\n"
        )
        
        # Add article context if provided
        context_section = ""
        if article_context:
            context_section = f"Article Context:\n{article_context[:1000]}...\n\n"
        
        # Build conversation history
        history_section = ""
        if history:
            # Get last N messages for context
            recent_history = history[-self.max_history:]
            history_lines = []
            for msg in recent_history:
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                history_lines.append(f"{role.capitalize()}: {content}")
            
            history_section = "Conversation History:\n" + "\n".join(history_lines) + "\n\n"
        
        # Current user message
        current_section = f"User: {current_message}\n\nAssistant:"
        
        # Combine all parts
        full_prompt = system_instruction + context_section + history_section + current_section
        
        return full_prompt
    
    async def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise
    
    async def answer_article_question(
        self,
        question: str,
        article_title: str,
        article_content: str
    ) -> str:
        """Answer a specific question about an article"""
        
        prompt = f"""
        Based on the article "{article_title}", answer the following question:
        
        Question: {question}
        
        Article Content:
        {article_content[:2000]}...
        
        Provide a clear, accurate answer based only on the information in the article.
        If the article doesn't contain enough information to answer, say so politely.
        """
        
        return await self._generate_content(prompt)
    
    async def generate_follow_up_questions(
        self,
        article_title: str,
        article_content: str,
        count: int = 3
    ) -> List[str]:
        """Generate relevant follow-up questions about an article"""
        
        prompt = f"""
        Based on the article "{article_title}", generate {count} interesting follow-up questions 
        that a curious reader might want to ask.
        
        Article Content:
        {article_content[:1000]}...
        
        Format: Return only the questions, one per line, without numbering.
        """
        
        response = await self._generate_content(prompt)
        
        # Parse questions
        questions = [
            q.strip().lstrip('0123456789.-•) ')
            for q in response.split('\n')
            if q.strip() and '?' in q
        ]
        
        return questions[:count]
    
    async def explain_concept(
        self,
        concept: str,
        context: Optional[str] = None
    ) -> str:
        """Explain a specific concept in simple terms"""
        
        context_text = f"\nContext: {context}" if context else ""
        
        prompt = f"""
        Explain the concept of "{concept}" in simple, Gen Z-friendly terms.
        Use analogies, examples, and relatable references.
        Keep it concise but comprehensive.{context_text}
        """
        
        return await self._generate_content(prompt)


# Singleton instance
chat_service = ChatService()
