"""Test script to verify Wikipedia API integration"""

import asyncio
import sys

# Check if aiohttp is installed
try:
    import aiohttp
    print("✓ aiohttp is installed")
except ImportError:
    print("✗ ERROR: aiohttp is not installed!")
    print("Please run: pip install aiohttp==3.9.1")
    sys.exit(1)

try:
    from app.services.wikipedia_service import wikipedia_service
    print("✓ Wikipedia service imported successfully")
except ImportError as e:
    print(f"✗ ERROR: Failed to import wikipedia service: {e}")
    sys.exit(1)


async def test_search():
    """Test Wikipedia search"""
    print("Testing Wikipedia search...")
    results = await wikipedia_service.search_articles("Python programming", limit=5)
    print(f"Found {len(results)} results:")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result.get('title', 'N/A')}")
    print()


async def test_get_article():
    """Test fetching article content"""
    print("Testing article fetch...")
    article = await wikipedia_service.get_article_content("Python (programming language)")
    if article:
        print(f"Title: {article['title']}")
        print(f"Content length: {len(article['content'])} chars")
        print(f"Image URL: {article.get('image_url', 'None')}")
        print(f"Categories: {', '.join(article.get('categories', [])[:5])}")
        print(f"Detected category: {wikipedia_service.categorize_article(article.get('categories', []))}")
        print(f"Difficulty: {wikipedia_service.determine_difficulty(article['content'])}")
    else:
        print("Failed to fetch article")
    print()


async def main():
    """Run all tests"""
    print("=" * 50)
    print("Wikipedia Service Test")
    print("=" * 50)
    print()
    
    try:
        await test_search()
        await test_get_article()
        print("✓ All tests completed!")
    except Exception as e:
        print(f"✗ Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
