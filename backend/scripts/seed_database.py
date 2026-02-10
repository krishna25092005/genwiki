"""
Database seeder script
Populates MongoDB with sample data for testing and development
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import connect_to_mongo, get_database
from app.core.security import hash_password
from app.models.database import UserModel, ArticleModel
from datetime import datetime, timedelta
import random


# Sample data
CATEGORIES = [
    "Technology", "Science", "History", "Environment", 
    "Health", "Culture", "Business", "Education"
]

SAMPLE_USERS = [
    {
        "email": "alex@example.com",
        "name": "Alex Johnson",
        "interests": ["Technology", "Science", "Environment"],
        "level": "intermediate",
        "bio": "Tech enthusiast and environmental advocate"
    },
    {
        "email": "maya@example.com",
        "name": "Maya Patel",
        "interests": ["History", "Culture", "Education"],
        "level": "advanced",
        "bio": "History buff and lifelong learner"
    },
    {
        "email": "jordan@example.com",
        "name": "Jordan Smith",
        "interests": ["Health", "Science", "Business"],
        "level": "beginner",
        "bio": "Curious about everything!"
    }
]

SAMPLE_ARTICLES = [
    {
        "title": "Understanding Quantum Computing",
        "content": """Quantum computing represents a revolutionary shift in how we process information. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or 'qubits' that can exist in multiple states simultaneously through a phenomenon called superposition.

This fundamental difference allows quantum computers to perform certain calculations exponentially faster than traditional computers. For instance, problems that would take classical computers thousands of years to solve could potentially be solved by quantum computers in mere minutes.

Key concepts in quantum computing include:

1. Superposition: Qubits can be in multiple states at once, unlike classical bits which are either 0 or 1.

2. Entanglement: Quantum particles can be linked such that the state of one instantly affects the state of another, regardless of distance.

3. Quantum Gates: These are the building blocks of quantum circuits, manipulating qubits through quantum operations.

Major tech companies like IBM, Google, and Microsoft are investing heavily in quantum computing research. Google claimed 'quantum supremacy' in 2019 when their quantum computer solved a problem in 200 seconds that would take the world's fastest supercomputer 10,000 years.

Applications of quantum computing include:
- Drug discovery and molecular simulation
- Cryptography and security
- Financial modeling and optimization
- Artificial intelligence and machine learning
- Climate modeling

However, quantum computers face significant challenges. They require extremely cold temperatures (near absolute zero) to operate and are highly susceptible to errors from environmental interference. Current quantum computers are also relatively small, with only a few hundred qubits.

Despite these challenges, experts predict quantum computing will transform multiple industries within the next decade, solving problems previously thought impossible.""",
        "category": "Technology",
        "tags": ["quantum computing", "technology", "innovation", "science"],
        "difficulty": "hard"
    },
    {
        "title": "Climate Change: What You Need to Know",
        "content": """Climate change is one of the most pressing challenges facing humanity today. Simply put, it refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities.

The Science Behind It:
Since the Industrial Revolution, humans have been burning fossil fuels (coal, oil, and gas) for energy. This releases greenhouse gases, especially carbon dioxide (CO2), into the atmosphere. These gases trap heat from the sun, creating a 'greenhouse effect' that warms the planet.

Think of it like wrapping Earth in a blanket - the more greenhouse gases we emit, the thicker the blanket becomes, and the warmer we get.

Key Impacts:
- Rising temperatures: Average global temperatures have increased by about 1°C since the late 1800s
- Melting ice: Arctic sea ice is disappearing at an alarming rate
- Rising sea levels: Oceans are rising due to melting ice and thermal expansion
- Extreme weather: More frequent hurricanes, droughts, and heat waves
- Ecosystem disruption: Many species are struggling to adapt

What Can We Do?
1. Reduce carbon emissions by using renewable energy
2. Improve energy efficiency in buildings and transportation
3. Support sustainable practices and policies
4. Plant trees and protect forests
5. Make conscious consumer choices

The good news? It's not too late to act. Many countries and companies are committing to 'net-zero' emissions by 2050. Renewable energy technologies like solar and wind are becoming cheaper and more efficient. Young people around the world are demanding action from leaders.

Every action counts, from turning off lights to supporting green policies. Together, we can create a sustainable future.""",
        "category": "Environment",
        "tags": ["climate change", "environment", "sustainability", "science"],
        "difficulty": "easy"
    },
    {
        "title": "The Rise of Artificial Intelligence",
        "content": """Artificial Intelligence (AI) is transforming every aspect of our lives, from the music recommendations on Spotify to self-driving cars. But what exactly is AI, and why does it matter?

What is AI?
At its core, AI refers to computer systems that can perform tasks typically requiring human intelligence. This includes learning, reasoning, problem-solving, understanding language, and recognizing patterns.

Types of AI:
1. Narrow AI (Weak AI): Designed for specific tasks like facial recognition or playing chess. This is what we have today.

2. General AI (Strong AI): Hypothetical AI that could understand, learn, and apply knowledge across different domains - like humans. We're not there yet.

3. Super AI: AI that surpasses human intelligence. This is purely theoretical.

How AI Works:
Modern AI relies heavily on machine learning, where algorithms learn from data without being explicitly programmed. For example, show an AI thousands of cat pictures, and it learns to recognize cats on its own.

Deep learning, a subset of machine learning, uses neural networks inspired by the human brain to process complex information.

Real-World Applications:
- Healthcare: AI helps diagnose diseases and discover new drugs
- Transportation: Self-driving cars use AI to navigate roads
- Education: Personalized learning platforms adapt to individual students
- Entertainment: Recommendation algorithms suggest content you'll love
- Business: Chatbots provide customer service 24/7

Concerns and Ethics:
With great power comes great responsibility. AI raises important questions:
- Job displacement: Will AI take our jobs?
- Privacy: How much data should AI systems collect?
- Bias: AI can perpetuate existing societal biases
- Autonomy: Should AI make life-or-death decisions?

The Future:
AI is still in its early stages. As it develops, we need thoughtful regulation and ethical guidelines to ensure it benefits everyone. The key is creating AI that augments human capabilities rather than replacing them.

Understanding AI isn't just for tech nerds anymore - it's essential for everyone navigating the modern world.""",
        "category": "Technology",
        "tags": ["AI", "machine learning", "technology", "future"],
        "difficulty": "medium"
    },
    {
        "title": "Social Media and Mental Health",
        "content": """Let's talk about something we all deal with: social media and how it affects our mental health. If you've ever felt anxious after scrolling through Instagram or compared yourself to others online, you're not alone.

The Good Side:
Social media can be awesome! It helps us:
- Stay connected with friends and family
- Find communities with shared interests
- Access information and resources
- Express creativity and share our stories
- Support causes we care about

The Not-So-Good Side:
Research shows excessive social media use can lead to:
- Anxiety and depression
- Low self-esteem
- FOMO (Fear of Missing Out)
- Sleep problems
- Cyberbullying
- Addiction-like behaviors

Why Does It Affect Us?
Social media platforms are designed to be addictive. They use psychological triggers like variable rewards (you never know what you'll see next) and social validation (likes and comments) to keep us scrolling.

Plus, we're constantly comparing our real lives to others' highlight reels. Remember: people usually only post their best moments, not their struggles.

Signs You Might Need a Break:
- Checking your phone first thing in the morning
- Feeling anxious when you can't access social media
- Spending more time online than with real people
- Feeling bad about yourself after scrolling
- Losing sleep to stay on apps

Healthy Social Media Habits:
1. Set time limits using app controls
2. Turn off notifications
3. Curate your feed - unfollow accounts that make you feel bad
4. Take regular digital detoxes
5. Engage meaningfully rather than passively scrolling
6. Remember: social media isn't real life

The Bottom Line:
Social media is a tool, and like any tool, it's about how we use it. Use it intentionally, not mindlessly. Prioritize real-world connections. And remember, your worth isn't measured in likes or followers.

Your mental health matters more than any social media post ever will.""",
        "category": "Health",
        "tags": ["social media", "mental health", "wellness", "technology"],
        "difficulty": "easy"
    },
    {
        "title": "Cryptocurrency and Blockchain Explained",
        "content": """Cryptocurrency and blockchain are buzzwords you've probably heard a lot lately. But what do they actually mean? Let's break it down in simple terms.

What is Cryptocurrency?
Cryptocurrency is digital money that exists only online. Unlike traditional currency (dollars, euros, etc.) controlled by governments and banks, crypto is decentralized - meaning no single authority controls it.

Bitcoin, created in 2009, was the first cryptocurrency. Now there are thousands, including Ethereum, Dogecoin, and many others.

What is Blockchain?
Blockchain is the technology that makes cryptocurrency possible. Think of it as a digital ledger that records all transactions across a network of computers.

Here's what makes it special:
- Decentralized: No single entity controls it
- Transparent: All transactions are visible to everyone
- Immutable: Once recorded, data can't be changed
- Secure: Uses advanced cryptography

How Does It Work?
Imagine a notebook that everyone in class can see and add to, but no one can erase anything from. Each page is a 'block' of transactions. When a page fills up, it's sealed and linked to the previous pages - forming a 'chain.'

This chain is copied across thousands of computers worldwide. To change any information, you'd need to alter every copy simultaneously, which is virtually impossible.

Uses Beyond Currency:
Blockchain isn't just for crypto. It's being used for:
- Supply chain tracking
- Digital identity verification
- Smart contracts (self-executing agreements)
- Healthcare records
- Voting systems

The Pros:
- No middlemen (banks, payment processors)
- Lower transaction fees
- Fast international transfers
- Financial access for the unbanked
- Transparency and security

The Cons:
- Price volatility (values fluctuate wildly)
- Energy consumption (mining uses lots of electricity)
- Potential for illegal activities
- Regulatory uncertainty
- Complexity for average users

Should You Invest?
Crypto is high-risk, high-reward. Never invest money you can't afford to lose. Do your research, understand what you're buying, and be prepared for volatility.

The Future:
Whether crypto becomes mainstream currency or remains a speculative asset is still up for debate. But blockchain technology is here to stay, with potential to revolutionize many industries.

Stay curious, stay informed, and stay cautious.""",
        "category": "Business",
        "tags": ["cryptocurrency", "blockchain", "finance", "technology"],
        "difficulty": "medium"
    }
]


async def seed_database():
    """Seed the database with sample data"""
    print("🌱 Starting database seeding...")
    
    # Connect to database
    await connect_to_mongo()
    db = get_database()
    
    # Clear existing data (be careful in production!)
    print("🗑️  Clearing existing data...")
    await db.users.delete_many({})
    await db.articles.delete_many({})
    await db.conversations.delete_many({})
    await db.saved_topics.delete_many({})
    
    # Create users
    print("👥 Creating users...")
    user_ids = []
    
    for user_data in SAMPLE_USERS:
        user_doc = UserModel.create_document(
            email=user_data["email"],
            password_hash=hash_password("password123"),  # Default password
            name=user_data["name"],
            interests=user_data["interests"],
            level=user_data["level"]
        )
        user_doc["bio"] = user_data["bio"]
        
        result = await db.users.insert_one(user_doc)
        user_ids.append(result.inserted_id)
        print(f"  ✅ Created user: {user_data['name']} ({user_data['email']})")
    
    # Create articles
    print("📝 Creating articles...")
    article_ids = []
    
    for i, article_data in enumerate(SAMPLE_ARTICLES):
        # Assign random author
        author_id = random.choice(user_ids)
        
        # Generate slug
        slug = article_data["title"].lower().replace(" ", "-").replace(":", "")
        
        # Create simple summary (first 200 chars)
        summary = article_data["content"][:200] + "..."
        
        article_doc = ArticleModel.create_document(
            title=article_data["title"],
            slug=slug,
            content=article_data["content"],
            summary=summary,
            author_id=str(author_id),
            category=article_data["category"],
            tags=article_data["tags"],
            difficulty=article_data["difficulty"]
        )
        
        # Add some random stats
        article_doc["views"] = random.randint(100, 5000)
        article_doc["likes"] = random.randint(10, 500)
        
        result = await db.articles.insert_one(article_doc)
        article_ids.append(result.inserted_id)
        print(f"  ✅ Created article: {article_data['title']}")
    
    # Create some saved topics
    print("💾 Creating saved topics...")
    for user_id in user_ids[:2]:  # First 2 users save some articles
        saved_articles = random.sample(article_ids, min(3, len(article_ids)))
        for article_id in saved_articles:
            saved_doc = {
                "userId": user_id,
                "articleId": article_id,
                "savedAt": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                "createdAt": datetime.utcnow()
            }
            await db.saved_topics.insert_one(saved_doc)
    
    print("  ✅ Created saved topics")
    
    # Summary
    print("\n" + "="*50)
    print("✅ Database seeding completed!")
    print("="*50)
    print(f"Created {len(user_ids)} users")
    print(f"Created {len(article_ids)} articles")
    print("\nDefault login credentials:")
    for user in SAMPLE_USERS:
        print(f"  Email: {user['email']} | Password: password123")
    print("="*50)


if __name__ == "__main__":
    asyncio.run(seed_database())
