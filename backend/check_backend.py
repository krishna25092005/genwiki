"""Quick backend health check script"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

async def check_backend():
    """Check backend components"""
    print("\n" + "="*60)
    print("Backend Health Check")
    print("="*60 + "\n")
    
    # Check imports
    print("1. Checking imports...")
    try:
        from app.core.config import settings
        print("   ✓ Settings loaded")
        print(f"   - Environment: {settings.ENVIRONMENT}")
        print(f"   - Debug: {settings.DEBUG}")
    except Exception as e:
        print(f"   ✗ Failed to load settings: {e}")
        return
    
    # Check database
    print("\n2. Checking database connection...")
    try:
        from app.core.database import get_database, connect_to_mongo
        
        await connect_to_mongo()
        db = get_database()
        
        # Try a simple operation
        count = await db.articles.count_documents({})
        print(f"   ✓ Database connected")
        print(f"   - Articles in database: {count}")
    except Exception as e:
        print(f"   ✗ Database connection failed: {e}")
        print("   - Make sure MongoDB is running")
        print(f"   - Check MONGODB_URI in .env: {settings.MONGODB_URI}")
        return
    
    # Check AI services
    print("\n3. Checking AI services...")
    try:
        from app.ai_modules.summarization import summarization_service
        
        if summarization_service.model:
            print("   ✓ Gemini model initialized")
        else:
            print("   ⚠ Gemini model not initialized")
            print("   - AI summaries will use fallback")
            print(f"   - Check GEMINI_API_KEY in .env")
    except Exception as e:
        print(f"   ⚠ AI service check failed: {e}")
        print("   - AI summaries will use fallback")
    
    # Check Wikipedia service
    print("\n4. Checking Wikipedia service...")
    try:
        from app.services.wikipedia_service import wikipedia_service
        
        results = await wikipedia_service.search_articles("Python", limit=1)
        if results:
            print("   ✓ Wikipedia API accessible")
            print(f"   - Test search returned: {results[0].get('title')}")
        else:
            print("   ⚠ Wikipedia search returned no results")
    except Exception as e:
        print(f"   ✗ Wikipedia service failed: {e}")
        return
    
    print("\n" + "="*60)
    print("Health Check Complete!")
    print("="*60 + "\n")
    
    # Summary
    print("Status Summary:")
    print("  ✓ = Working correctly")
    print("  ⚠ = Working with warnings (non-critical)")
    print("  ✗ = Failed (needs fixing)")
    print()


if __name__ == "__main__":
    try:
        asyncio.run(check_backend())
    except KeyboardInterrupt:
        print("\n\nCheck interrupted by user")
    except Exception as e:
        print(f"\n\n✗ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
