# Gen Z Wikipedia - Complete Full-Stack Application

A production-ready, AI-powered knowledge platform designed for Gen Z users, featuring intelligent content summarization, conversational AI, and personalized learning experiences. Built with modern technologies and best practices.

## 🌟 Overview

Gen Z Wikipedia transforms traditional encyclopedia-style content into engaging, digestible knowledge tailored for modern learners. This full-stack application combines a powerful Python FastAPI backend with a sleek Next.js frontend, leveraging Google's Gemini AI for intelligent features.

### Key Features

- 🤖 **AI-Powered Content** - Multiple summarization styles (concise, ELI5, bullet points, emoji-enhanced)
- 💬 **Interactive Chat Assistant** - Context-aware Q&A about articles
- 🎯 **Personalized Recommendations** - Content tailored to user interests and reading level
- 🔍 **Smart Search & Discovery** - Full-text search with semantic understanding
- 💾 **Bookmarking System** - Save and organize favorite topics
- 👤 **User Profiles** - Track reading history and customize experience
- 📱 **Mobile-First Design** - Responsive UI with smooth animations
- 🔒 **Secure Authentication** - JWT-based auth with bcrypt password hashing

## 🏗️ Architecture

### Full-Stack Architecture

```
Frontend (Next.js)              Backend (FastAPI)           Database/AI
┌─────────────────┐            ┌──────────────────┐        ┌──────────┐
│   React UI      │            │  REST API        │        │ MongoDB  │
│   TypeScript    │ ◄─────────►│  Python          │◄──────►│ Database │
│   Tailwind CSS  │  HTTP/JSON │  JWT Auth        │        └──────────┘
│   shadcn/ui     │            │  Async/Await     │             
└─────────────────┘            └──────────────────┘        ┌──────────┐
                                        │                    │ Gemini   │
                                        └───────────────────►│   AI     │
                                          AI Integration      └──────────┘
```

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Context + Hooks
- **Authentication**: JWT tokens

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: MongoDB with Motor (async driver)
- **AI Integration**: Google Generative AI (Gemini Pro)
- **Authentication**: JWT (python-jose) + bcrypt
- **Validation**: Pydantic v2
- **Documentation**: OpenAPI/Swagger
- **HTTP Client**: HTTPX for async requests

### Development Tools
- **Package Manager**: npm/pnpm
- **Code Quality**: TypeScript, ESLint
- **Version Control**: Git
- **API Testing**: Swagger UI, ReDoc

## Project Structure

```
wikigen/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── ai/           # AI feature endpoints
│   ├── article/[id]/     # Article detail page
│   ├── chat/             # Chat interface page
│   ├── explore/          # Topic exploration page
│   ├── saved/            # Saved topics page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   └── ui/              # Shadcn UI components
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Authentication hook
├── lib/
│   ├── models/          # MongoDB models
│   │   ├── User.ts
│   │   ├── Article.ts
│   │   ├── Conversation.ts
│   │   └── SavedTopic.ts
│   ├── api.ts           # API utility functions
│   ├── auth.ts          # Authentication utilities
│   ├── gemini.ts        # Gemini API integration
│   └── mongodb.ts       # MongoDB connection
├── public/              # Static assets
├── .env.example         # Environment variables template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
└── next.config.mjs      # Next.js config
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd wikigen
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Gemini API
GEMINI_API_KEY=your_google_gemini_api_key

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Get API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new project and generate an API key
4. Add the key to `.env.local`

#### MongoDB
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get the connection string
4. Add to `.env.local`

### 5. Run Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### AI Features
- `POST /api/ai/summarize` - Generate content summary
  - Body: `{ content: string, maxLength?: number }`
  - Returns: `{ summary: string, originalLength: number, summaryLength: number }`

- `POST /api/ai/chat` - Chat/Q&A with AI
  - Body: `{ prompt: string, conversationHistory?: Array<{role, content}> }`
  - Returns: `{ response: string, timestamp: string }`

## Database Schema

### User
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  avatar?: string
  interests: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  preferences: {
    darkMode: boolean
    emailNotifications: boolean
    privateProfile: boolean
  }
}
```

### Article
```typescript
{
  title: string
  slug: string (unique)
  content: string
  summary: string
  author: ObjectId (User)
  category: string
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  readingTime: number
  views: number
  likes: number
}
```

### Conversation
```typescript
{
  userId: ObjectId (User)
  title: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  topic?: string
  isArchived: boolean
}
```

### SavedTopic
```typescript
{
  userId: ObjectId (User)
  articleId: ObjectId (Article)
  notes?: string
  isBookmarked: boolean
  savedAt: Date
}
```

## Features Explained

### AI Summarization
The platform uses Google Gemini API to generate concise summaries of articles and content. Users can request summaries of any length, making it easy to quickly understand key points.

### Conversational Q&A
The chat interface allows users to ask questions about topics and receive intelligent answers powered by Gemini AI. The conversation history is maintained for context.

### Personalization
User profiles include interests and learning levels. This data is used to:
- Recommend relevant content
- Adjust difficulty levels
- Customize the learning experience

### Content Organization
Users can:
- Save articles for later reference
- Bookmark important topics
- Create personal notes
- Archive conversations

## Authentication Flow

1. User registers with email, password, and name
2. Password is hashed using SHA-256
3. JWT token is generated and stored in localStorage
4. Token includes user ID and email with 7-day expiration
5. Token is sent with API requests in Authorization header
6. Server verifies token for protected endpoints

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@wikigen.com or open an issue on GitHub.

## Roadmap

- [ ] Advanced search with filtering
- [ ] User profiles and following system
- [ ] Content moderation tools
- [ ] Mobile app
- [ ] Video content support
- [ ] Multi-language support
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
