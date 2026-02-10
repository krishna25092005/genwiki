# API Documentation - Gen Z Wikipedia

Complete API reference for the Gen Z Wikipedia backend.

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://your-api-domain.com/api/v1
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "interests": ["Technology", "Science"],
  "level": "beginner"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "interests": ["Technology", "Science"],
    "level": "beginner"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 👤 User Endpoints

### Get Current User

**GET** `/users/me` 🔒

Get authenticated user's profile.

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "interests": ["Technology", "Science"],
  "level": "beginner",
  "bio": "Tech enthusiast",
  "avatar": "https://example.com/avatar.jpg",
  "joinedAt": "2024-01-15T10:30:00Z"
}
```

### Update User Profile

**PUT** `/users/me` 🔒

Update authenticated user's information.

**Request Body:**
```json
{
  "name": "John Smith",
  "interests": ["Technology", "AI", "Science"],
  "level": "intermediate",
  "bio": "AI and tech enthusiast"
}
```

**Response:** `200 OK` (Updated user object)

---

## 📝 Article Endpoints

### Create Article

**POST** `/articles/` 🔒

Create a new article with AI-generated summary.

**Request Body:**
```json
{
  "title": "Understanding Machine Learning",
  "content": "Machine learning is...",
  "category": "Technology",
  "tags": ["AI", "machine learning", "technology"],
  "difficulty": "medium",
  "imageUrl": "https://example.com/image.jpg",
  "sources": ["https://source1.com", "https://source2.com"]
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Understanding Machine Learning",
  "slug": "understanding-machine-learning",
  "summary": "AI-generated summary...",
  "category": "Technology",
  "difficulty": "medium",
  "readingTime": 8,
  "views": 0,
  "likes": 0
}
```

### Search Articles

**GET** `/articles/search`

Search articles with filters and pagination.

**Query Parameters:**
- `query` (optional): Search text
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated tags
- `difficulty` (optional): easy, medium, hard
- `limit` (default: 10): Results per page
- `skip` (default: 0): Pagination offset

**Example:**
```
GET /articles/search?query=machine%20learning&category=Technology&limit=5
```

**Response:** `200 OK`
```json
{
  "results": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Understanding Machine Learning",
      "summary": "...",
      "category": "Technology",
      "tags": ["AI", "machine learning"],
      "difficulty": "medium",
      "readingTime": 8,
      "views": 234,
      "likes": 45
    }
  ],
  "total": 15,
  "query": "machine learning"
}
```

### Get Article by ID

**GET** `/articles/{article_id}`

Retrieve a specific article (increments view count).

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Understanding Machine Learning",
  "slug": "understanding-machine-learning",
  "content": "Full article content...",
  "summary": "AI-generated summary...",
  "category": "Technology",
  "tags": ["AI", "machine learning"],
  "difficulty": "medium",
  "readingTime": 8,
  "views": 235,
  "likes": 45,
  "publishedAt": "2024-01-15T10:30:00Z"
}
```

### Get Trending Articles

**GET** `/articles/trending`

Get most viewed and liked articles.

**Query Parameters:**
- `limit` (default: 10): Number of articles

**Response:** `200 OK` (Array of articles)

### Like/Unlike Article

**POST** `/articles/{article_id}/like` 🔒

Toggle like status for an article.

**Response:** `200 OK`
```json
{
  "article": {
    "id": "507f1f77bcf86cd799439012",
    "likes": 46
  },
  "liked": true
}
```

### Get Related Articles

**GET** `/articles/{article_id}/related`

Find articles similar to the specified article.

**Query Parameters:**
- `limit` (default: 5): Number of related articles

**Response:** `200 OK` (Array of articles)

---

## 🤖 AI Feature Endpoints

### Summarize Content

**POST** `/ai/summarize`

Generate AI summary in various styles.

**Request Body:**
```json
{
  "content": "Long text content to summarize...",
  "maxLength": 300,
  "style": "eli5"
}
```

**Styles:**
- `concise`: Professional, clear summary
- `eli5`: Explain Like I'm 5 (Gen Z friendly)
- `bullet_points`: Key points format
- `emoji`: Fun summary with emojis

**Response:** `200 OK`
```json
{
  "summary": "AI-generated summary based on style...",
  "originalLength": 2500,
  "summaryLength": 287,
  "style": "eli5"
}
```

### Extract Key Facts

**POST** `/ai/summarize/key-facts`

Extract main points from content.

**Query Parameters:**
- `content`: Text to analyze (URL encoded)
- `count` (default: 5): Number of facts

**Response:** `200 OK`
```json
{
  "facts": [
    "Key fact 1",
    "Key fact 2",
    "Key fact 3"
  ],
  "count": 3
}
```

### Chat with AI

**POST** `/ai/chat` 🔒

Have a conversation with AI assistant.

**Request Body:**
```json
{
  "message": "What is quantum computing?",
  "articleId": "507f1f77bcf86cd799439012",
  "conversationId": "507f1f77bcf86cd799439013"
}
```

**Response:** `200 OK`
```json
{
  "response": "Quantum computing is a revolutionary technology...",
  "conversationId": "507f1f77bcf86cd799439013",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### Get Personalized Recommendations

**GET** `/ai/recommendations` 🔒

Get articles tailored to user's interests.

**Query Parameters:**
- `limit` (default: 5): Number of recommendations

**Response:** `200 OK` (Array of recommended articles)

### Get Topic Suggestions

**GET** `/ai/topic-suggestions`

Get AI-generated topic ideas based on query.

**Query Parameters:**
- `query`: Search query
- `limit` (default: 5): Number of suggestions

**Response:** `200 OK`
```json
{
  "query": "artificial intelligence",
  "suggestions": [
    "Machine Learning Basics",
    "Neural Networks Explained",
    "AI Ethics and Society",
    "Future of AI Technology",
    "AI in Healthcare"
  ]
}
```

---

## 💾 Saved Topics Endpoints

### Save Article

**POST** `/saved/` 🔒

Bookmark an article for later.

**Request Body:**
```json
{
  "articleId": "507f1f77bcf86cd799439012"
}
```

**Response:** `201 Created`
```json
{
  "message": "Article saved successfully",
  "savedTopicId": "507f1f77bcf86cd799439014"
}
```

### Get Saved Articles

**GET** `/saved/` 🔒

Retrieve user's saved articles.

**Query Parameters:**
- `limit` (default: 20): Results per page
- `skip` (default: 0): Pagination offset

**Response:** `200 OK`
```json
[
  {
    "savedTopicId": "507f1f77bcf86cd799439014",
    "savedAt": "2024-01-15T10:40:00Z",
    "article": {
      "id": "507f1f77bcf86cd799439012",
      "title": "Understanding Machine Learning",
      "summary": "...",
      "category": "Technology"
    }
  }
]
```

### Remove Saved Article

**DELETE** `/saved/{saved_topic_id}` 🔒

Remove a bookmarked article.

**Response:** `204 No Content`

### Check if Article is Saved

**GET** `/saved/check/{article_id}` 🔒

Check if an article is bookmarked.

**Response:** `200 OK`
```json
{
  "isSaved": true,
  "savedTopicId": "507f1f77bcf86cd799439014",
  "savedAt": "2024-01-15T10:40:00Z"
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔑 Authentication Notes

### Getting a Token

1. Register: `POST /auth/register`
2. Login: `POST /auth/login`
3. Save the `access_token` from response
4. Include in subsequent requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Token Expiration

- Default: 30 minutes
- Refresh by logging in again
- Store securely (never in plain text)

---

## 🧪 Testing the API

### Using Swagger UI

Visit: `http://localhost:8000/docs`

1. Click "Authorize" button
2. Enter token: `Bearer <your_token>`
3. Try out endpoints interactively

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.access_token')

# Use token
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Using Python

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    json={"email": "test@example.com", "password": "password123"}
)
token = response.json()["access_token"]

# Make authenticated request
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    "http://localhost:8000/api/v1/users/me",
    headers=headers
)
print(response.json())
```

---

## 📝 Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting per IP/user
- Use Redis for distributed rate limiting
- Recommended: 100 requests/minute per user

---

## 🔗 Additional Resources

- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json
- **Backend README**: [backend/README.md](../backend/README.md)

---

**Last Updated**: February 10, 2026  
**API Version**: 1.0.0
