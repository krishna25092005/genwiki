"""AI-powered features endpoints"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List
from app.models.schemas import (
    SummarizeRequest, SummarizeResponse,
    ChatRequest, ChatResponse,
    PersonalizeRequest, PersonalizeResponse
)
from app.ai_modules.summarization import summarization_service
from app.ai_modules.chat import chat_service
from app.ai_modules.recommendations import recommendation_service
from app.core.security import get_current_user, get_current_user_optional
from app.core.database import get_database
from app.models.database import ConversationModel
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_content(request: SummarizeRequest):
    """
    Generate AI summary of content
    
    - **content**: Text content to summarize (min 50 characters)
    - **maxLength**: Maximum summary length (50-1000 characters)
    - **style**: Summary style (concise, eli5, bullet_points, emoji)
    
    Styles:
    - **concise**: Professional, clear summary
    - **eli5**: Explain Like I'm 5 (Gen Z friendly)
    - **bullet_points**: Key points in bullet format
    - **emoji**: Fun summary with emojis
    """
    try:
        summary = await summarization_service.summarize(
            request.content,
            request.maxLength,
            request.style
        )
        
        return SummarizeResponse(
            summary=summary,
            originalLength=len(request.content),
            summaryLength=len(summary),
            style=request.style
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate summary: {str(e)}"
        )


@router.post("/summarize/key-facts")
async def extract_key_facts(
    content: str,
    count: int = Query(5, ge=1, le=10, description="Number of key facts to extract")
):
    """
    Extract key facts from content
    
    - **content**: Text content to analyze
    - **count**: Number of key facts to extract (1-10)
    """
    try:
        facts = await summarization_service.extract_key_facts(content, count)
        
        return {
            "facts": facts,
            "count": len(facts)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to extract key facts"
        )


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user_optional)
):
    """
    Chat with AI assistant
    
    Authentication is optional - logged-in users get saved conversations, anonymous users get temporary sessions
    
    - **message**: User's message
    - **articleId**: Optional article ID for context-aware responses
    - **conversationId**: Optional conversation ID to continue existing chat
    
    AI provides intelligent, context-aware responses
    """
    try:
        db = get_database()
        
        # Get or create conversation (only for authenticated users)
        conversation_id = request.conversationId
        conversation_history = []
        article_context = None
        
        # Only manage persistent conversations for authenticated users
        if current_user and conversation_id:
            # Load existing conversation
            conversation = await db.conversations.find_one(
                {"_id": ObjectId(conversation_id)}
            )
            if conversation:
                conversation_history = conversation.get('messages', [])
        elif current_user:
            # Create new conversation for authenticated user
            conversation_doc = ConversationModel.create_document(
                user_id=current_user["user_id"],
                article_id=request.articleId
            )
            result = await db.conversations.insert_one(conversation_doc)
            conversation_id = str(result.inserted_id)
        
        # Get article context if provided
        if request.articleId:
            article = await db.articles.find_one({"_id": ObjectId(request.articleId)})
            if article:
                article_context = f"{article['title']}\n\n{article['content'][:2000]}"
        
        # Generate AI response
        ai_response = await chat_service.generate_response(
            request.message,
            conversation_history,
            article_context
        )
        
        # Save messages to conversation (only for authenticated users)
        if current_user and conversation_id:
            user_message = ConversationModel.add_message("user", request.message)
            ai_message = ConversationModel.add_message("assistant", ai_response)
            
            await db.conversations.update_one(
                {"_id": ObjectId(conversation_id)},
                {
                    "$push": {
                        "messages": {
                            "$each": [user_message, ai_message]
                        }
                    },
                    "$set": {"updatedAt": datetime.utcnow()}
                }
            )
        
        return ChatResponse(
            response=ai_response,
            conversationId=conversation_id,
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate chat response: {str(e)}"
        )


@router.post("/chat/article-question")
async def ask_article_question(
    article_id: str,
    question: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Ask a specific question about an article
    
    Requires authentication token
    
    - **article_id**: Article's ID
    - **question**: Question about the article
    
    Returns AI-generated answer based on article content
    """
    try:
        db = get_database()
        
        # Get article
        article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        # Generate answer
        answer = await chat_service.answer_article_question(
            question,
            article['title'],
            article['content']
        )
        
        return {
            "question": question,
            "answer": answer,
            "articleId": article_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to answer question"
        )


@router.get("/chat/follow-up-questions")
async def generate_follow_up_questions(
    article_id: str,
    count: int = Query(3, ge=1, le=5)
):
    """
    Generate follow-up questions about an article
    
    - **article_id**: Article's ID
    - **count**: Number of questions to generate (1-5)
    
    Helps users explore topics more deeply
    """
    try:
        db = get_database()
        
        article = await db.articles.find_one({"_id": ObjectId(article_id)})
        
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article not found"
            )
        
        questions = await chat_service.generate_follow_up_questions(
            article['title'],
            article['content'],
            count
        )
        
        return {
            "questions": questions,
            "articleId": article_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate questions"
        )


@router.post("/personalize", response_model=PersonalizeResponse)
async def personalize_content(
    request: PersonalizeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Personalize content based on user profile
    
    Requires authentication token
    
    - **content**: Content to personalize
    - **userInterests**: User's interests
    - **userLevel**: User's knowledge level (beginner, intermediate, advanced)
    
    Adjusts content complexity and examples to match user preferences
    """
    try:
        personalized = await summarization_service.simplify_for_level(
            request.content,
            request.userLevel.value
        )
        
        return PersonalizeResponse(
            personalizedContent=personalized,
            adjustments={
                "level": request.userLevel.value,
                "interests": request.userInterests
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to personalize content"
        )


@router.get("/recommendations", response_model=List[dict])
async def get_recommendations(
    limit: int = Query(5, ge=1, le=20),
    current_user: dict = Depends(get_current_user)
):
    """
    Get personalized article recommendations
    
    Requires authentication token
    
    - **limit**: Number of recommendations (1-20)
    
    Returns articles tailored to user's interests and reading history
    """
    try:
        db = get_database()
        
        # Get user profile
        user = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get recommendations
        recommendations = await recommendation_service.get_personalized_recommendations(
            current_user["user_id"],
            user.get('interests', []),
            user.get('level', 'beginner'),
            limit
        )
        
        # Format articles
        from app.services.article_service import article_service
        formatted_recommendations = [
            article_service._format_article(article)
            for article in recommendations
        ]
        
        return formatted_recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate recommendations"
        )


@router.get("/topic-suggestions")
async def get_topic_suggestions(
    query: str = Query(..., min_length=1),
    limit: int = Query(5, ge=1, le=10)
):
    """
    Get AI-generated topic suggestions based on search query
    
    - **query**: Search query
    - **limit**: Number of suggestions (1-10)
    
    Helps users discover related topics
    """
    try:
        suggestions = await recommendation_service.get_topic_suggestions(
            query,
            limit
        )
        
        return {
            "query": query,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate topic suggestions"
        )


@router.get("/explain/{concept}")
async def explain_concept(
    concept: str,
    context: str = Query(None, description="Optional context for explanation")
):
    """
    Get a simple explanation of a concept
    
    - **concept**: Concept to explain
    - **context**: Optional context (e.g., from an article)
    
    Returns Gen Z-friendly explanation with examples
    """
    try:
        explanation = await chat_service.explain_concept(concept, context)
        
        return {
            "concept": concept,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to explain concept"
        )
