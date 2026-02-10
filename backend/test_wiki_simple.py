"""Simple test to verify Wikipedia API access"""

import asyncio
import sys

# Check if aiohttp is installed
try:
    import aiohttp
    print("✓ aiohttp is installed (version: {})".format(aiohttp.__version__))
except ImportError:
    print("✗ ERROR: aiohttp is not installed!")
    print("Please run: pip install aiohttp")
    sys.exit(1)


async def test_wikipedia_direct():
    """Test Wikipedia API directly without any service layer"""
    print("\n" + "="*60)
    print("Testing Wikipedia API Direct Connection")
    print("="*60 + "\n")
    
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": "Python programming",
        "srlimit": 5,
        "srprop": "title|snippet"
    }
    
    headers = {
        'User-Agent': 'GenZWikipedia/1.0 (Educational Project)'
    }
    
    try:
        print(f"Making request to: {url}")
        print(f"Search query: Python programming")
        print()
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                print(f"Response Status: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    results = data.get("query", {}).get("search", [])
                    
                    print(f"✓ SUCCESS: Found {len(results)} results\n")
                    
                    if results:
                        for i, result in enumerate(results, 1):
                            print(f"{i}. {result.get('title', 'N/A')}")
                    else:
                        print("⚠ No results returned (API working but query returned nothing)")
                else:
                    error_text = await response.text()
                    print(f"✗ ERROR: Status {response.status}")
                    print(f"Response: {error_text[:500]}")
                    
    except asyncio.TimeoutError:
        print("✗ ERROR: Request timed out")
        print("Check your internet connection or firewall settings")
    except aiohttp.ClientConnectionError as e:
        print(f"✗ ERROR: Connection failed: {e}")
        print("Check your internet connection or firewall settings")
    except Exception as e:
        print(f"✗ ERROR: Unexpected error: {e}")
        import traceback
        traceback.print_exc()


async def test_article_fetch():
    """Test fetching a specific article"""
    print("\n" + "="*60)
    print("Testing Article Content Fetch")
    print("="*60 + "\n")
    
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "titles": "Python (programming language)",
        "prop": "extracts",
        "explaintext": True,
        "exintro": True
    }
    
    headers = {
        'User-Agent': 'GenZWikipedia/1.0 (Educational Project)'
    }
    
    try:
        print(f"Fetching article: Python (programming language)")
        print()
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                print(f"Response Status: {response.status}")
                
                if response.status == 200:
                    data = await response.json()
                    pages = data.get("query", {}).get("pages", {})
                    page = next(iter(pages.values()))
                    
                    if "missing" not in page:
                        title = page.get("title", "")
                        extract = page.get("extract", "")
                        print(f"✓ SUCCESS: Fetched article '{title}'")
                        print(f"Content length: {len(extract)} characters")
                        print(f"\nFirst 200 characters:")
                        print(extract[:200] + "...\n")
                    else:
                        print("✗ ERROR: Article not found")
                else:
                    print(f"✗ ERROR: Status {response.status}")
                    
    except Exception as e:
        print(f"✗ ERROR: {e}")
        import traceback
        traceback.print_exc()


async def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("Wikipedia API Connection Test")
    print("="*60)
    
    await test_wikipedia_direct()
    await test_article_fetch()
    
    print("\n" + "="*60)
    print("Tests Complete")
    print("="*60 + "\n")


if __name__ == "__main__":
    print("\nStarting Wikipedia API tests...\n")
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\n✗ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
