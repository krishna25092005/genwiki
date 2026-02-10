# Gen Z Wikipedia - Backend API

Production-ready FastAPI backend for the Gen Z Wikipedia platform with AI-powered features.

## 🚀 Features

- ✅ **RESTful API** with FastAPI
- ✅ **AI Integration** (Google Gemini)
  - Content summarization (multiple styles)
  - Conversational chat assistant
  - Personalized recommendations
- ✅ **Authentication & Authorization** (JWT)
- ✅ **MongoDB Database** with Motor (async)
- ✅ **Comprehensive API Documentation** (Swagger/OpenAPI)
- ✅ **Input Validation** with Pydantic
- ✅ **Error Handling** with detailed messages
- ✅ **CORS Support** for frontend integration
- ✅ **Async/Await** for high performance

## 📋 Requirements

- Python 3.8+
- MongoDB 4.4+
- Google Gemini API Key

## 🛠️ Installation

### Windows

```bash
# Navigate to backend directory
cd backend

# Run setup script
setup.bat
```

### Linux/Mac

```bash
# Navigate to backend directory
cd backend

# Make setup script executable
chmod +x scripts/setup.sh

# Run setup script
./scripts/setup.sh
```

### Manual Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and configure the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=genz_wikipedia

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Getting API Keys

- **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🗄️ Database Setup

1. Make sure MongoDB is running:

```bash
# Start MongoDB (if installed locally)
mongod
```

2. Seed the database with sample data:

```bash
python scripts/seed_database.py
```

This creates:
- 3 sample users (credentials: email from SAMPLE_USERS, password: `password123`)
- 5 sample articles across different categories
- Sample saved topics

## 🚀 Running the Server

### Development Mode

```bash
# Activate virtual environment first
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔑 Authentication

Most endpoints require authentication. To authenticate:

1. **Register a new user** or use sample credentials:
   ```
   POST /api/v1/auth/register
   ```

2. **Login** to get an access token:
   ```
   POST /api/v1/auth/login
   ```

3. **Use the token** in subsequent requests:
   ```
   Authorization: Bearer <your_token_here>
   ```

### Sample Users (after seeding)

```
Email: alex@example.com | Password: password123
Email: maya@example.com | Password: password123
Email: jordan@example.com | Password: password123
```

## 📖 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login and get token | No |
| POST | `/api/v1/auth/verify` | Verify token validity | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/me` | Get current user profile | Yes |
| PUT | `/api/v1/users/me` | Update current user | Yes |
| DELETE | `/api/v1/users/me` | Delete account | Yes |
| GET | `/api/v1/users/{user_id}` | Get user by ID | No |

### Articles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/articles/` | Create article | Yes |
| GET | `/api/v1/articles/search` | Search articles | No |
| GET | `/api/v1/articles/trending` | Get trending articles | No |
| GET | `/api/v1/articles/category/{category}` | Get by category | No |
| GET | `/api/v1/articles/{article_id}` | Get article by ID | No |
| GET | `/api/v1/articles/slug/{slug}` | Get article by slug | No |
| GET | `/api/v1/articles/{article_id}/related` | Get related articles | No |
| PUT | `/api/v1/articles/{article_id}` | Update article | Yes |
| POST | `/api/v1/articles/{article_id}/like` | Like/unlike article | Yes |
| DELETE | `/api/v1/articles/{article_id}` | Delete article | Yes |

### AI Features

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/ai/summarize` | Summarize content | No |
| POST | `/api/v1/ai/summarize/key-facts` | Extract key facts | No |
| POST | `/api/v1/ai/chat` | Chat with AI | Yes |
| POST | `/api/v1/ai/chat/article-question` | Ask about article | Yes |
| GET | `/api/v1/ai/chat/follow-up-questions` | Generate questions | No |
| POST | `/api/v1/ai/personalize` | Personalize content | Yes |
| GET | `/api/v1/ai/recommendations` | Get recommendations | Yes |
| GET | `/api/v1/ai/topic-suggestions` | Get topic suggestions | No |
| GET | `/api/v1/ai/explain/{concept}` | Explain concept | No |

### Saved Topics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/saved/` | Save article | Yes |
| GET | `/api/v1/saved/` | Get saved articles | Yes |
| DELETE | `/api/v1/saved/{saved_topic_id}` | Unsave by ID | Yes |
| DELETE | `/api/v1/saved/article/{article_id}` | Unsave by article ID | Yes |
| GET | `/api/v1/saved/check/{article_id}` | Check if saved | Yes |

## 🎨 AI Features

### Content Summarization

Generate summaries in different styles:

- **concise**: Professional, clear summary
- **eli5**: Explain Like I'm 5 (Gen Z friendly)
- **bullet_points**: Key points in bullet format
- **emoji**: Fun summary with emojis

```python
POST /api/v1/ai/summarize
{
  "content": "Your long text here...",
  "maxLength": 300,
  "style": "eli5"
}
```

### Conversational AI

Chat with AI about any topic or specific articles:

```python
POST /api/v1/ai/chat
{
  "message": "What is quantum computing?",
  "articleId": "optional_article_id",
  "conversationId": "optional_to_continue_chat"
}
```

### Personalized Recommendations

Get article recommendations based on user interests and reading history:

```python
GET /api/v1/ai/recommendations?limit=5
```

## 📁 Project Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
│
├── app/
│   ├── core/              # Core functionality
│   │   ├── config.py      # Configuration settings
│   │   ├── database.py    # Database connection
│   │   └── security.py    # Authentication & security
│   │
│   ├── models/            # Data models
│   │   ├── schemas.py     # Pydantic models (API)
│   │   └── database.py    # MongoDB models
│   │
│   ├── api/               # API routes
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── articles.py
│   │           ├── ai.py
│   │           └── saved_topics.py
│   │
│   ├── services/          # Business logic
│   │   ├── user_service.py
│   │   └── article_service.py
│   │
│   └── ai_modules/        # AI functionality
│       ├── summarization.py
│       ├── chat.py
│       └── recommendations.py
│
└── scripts/               # Utility scripts
    ├── seed_database.py   # Database seeder
    ├── setup.sh           # Setup script (Unix)
    └── setup.bat          # Setup script (Windows)
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation with Pydantic
- CORS protection
- MongoDB injection prevention
- Environment variables for sensitive data

## 📊 Performance

- Async/await for non-blocking I/O
- Database indexing for fast queries
- Connection pooling for MongoDB
- Efficient AI API usage

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
ps aux | grep mongod  # Linux/Mac
tasklist | findstr mongod  # Windows

# Start MongoDB
mongod  # or use your system's service manager
```

### Import Errors

```bash
# Make sure you're in the backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

### API Key Issues

- Verify your Gemini API key is correct in `.env`
- Check if you have API quota remaining
- Ensure the key has proper permissions

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using FastAPI and Google Gemini AI
