# Complete Setup Guide - Gen Z Wikipedia

This guide will walk you through setting up the complete Gen Z Wikipedia application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **MongoDB 4.4+** - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Getting API Keys

1. **Google Gemini API Key** (Required for AI features)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key for later use

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd gen-z-wikipedia-2
```

## Step 2: MongoDB Setup

### Option A: Local MongoDB

**Windows:**
```bash
# Download MongoDB Community Edition from mongodb.com
# Install with default settings
# MongoDB will start automatically as a service
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update packages and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" and get your connection string
5. Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/genz_wikipedia`

## Step 3: Backend Setup

### Windows

```bash
cd backend

# Run the setup script
setup.bat

# This will:
# - Create a virtual environment
# - Install all Python dependencies
# - Activate the virtual environment
```

### Linux/Mac

```bash
cd backend

# Make script executable
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh
```

### Manual Setup (Alternative)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

## Step 4: Backend Configuration

1. **Create environment file:**

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

2. **Edit `.env` file** with your actual values:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
ENVIRONMENT=development

# Database - IMPORTANT: Update this!
MONGODB_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
DATABASE_NAME=genz_wikipedia

# AI API Keys - REQUIRED!
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Authentication - Change these in production!
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (Update for production)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Step 5: Seed the Database

With backend virtual environment still activated:

```bash
python scripts/seed_database.py
```

This creates:
- 3 sample users (password: `password123`)
- 5 sample articles across different categories
- Sample bookmarks and interactions

**Sample Login Credentials:**
```
Email: alex@example.com | Password: password123
Email: maya@example.com | Password: password123
Email: jordan@example.com | Password: password123
```

## Step 6: Start Backend Server

```bash
# Make sure virtual environment is activated
# Should see (venv) in your terminal

# Development mode with auto-reload
uvicorn main:app --reload

# OR using Python module
python -m uvicorn main:app --reload
```

Backend will start at: **http://localhost:8000**

Verify it's running by visiting:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Step 7: Frontend Setup

Open a **new terminal** (keep backend running):

```bash
# Navigate to project root
cd ..  # if you're in backend directory

# Install dependencies
npm install
# OR
pnpm install
# OR
yarn install
```

## Step 8: Frontend Configuration

1. **Create environment file:**

```bash
# Windows
copy .env.example .env.local

# Linux/Mac
cp .env.example .env.local
```

2. **Edit `.env.local` file:**

```env
# Database Connection
MONGODB_URI=mongodb://localhost:27017/genz_wikipedia
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/genz_wikipedia

# AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Authentication
JWT_SECRET_KEY=same-secret-key-as-backend

# Backend API URL (for production)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Step 9: Start Frontend Server

```bash
npm run dev
# OR
pnpm dev
# OR
yarn dev
```

Frontend will start at: **http://localhost:3000**

## Step 10: Verify Installation

1. **Open browser** and go to: http://localhost:3000

2. **Test the following:**
   - Homepage loads correctly
   - Click "Start Exploring" to see articles
   - Click "Sign In" and login with sample credentials
   - Navigate to an article and verify it loads
   - Try the AI Chat feature
   - Save an article
   - Test AI summarization

## Troubleshooting

### MongoDB Connection Failed

**Error:** `Failed to connect to MongoDB`

**Solutions:**
```bash
# Check if MongoDB is running
# Windows:
tasklist | findstr mongod

# Linux/Mac:
ps aux | grep mongod

# Start MongoDB if not running
# Linux:
sudo systemctl start mongod

# Mac:
brew services start mongodb-community

# Windows: MongoDB should auto-start as service
```

### Backend Import Errors

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend

# Make sure virtual environment is activated
# You should see (venv) in terminal

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Errors

**Error:** `Module not found` or dependency issues

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# OR for pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Gemini API Errors

**Error:** `GEMINI_API_KEY environment variable is not set`

**Solution:**
1. Verify your API key is correct
2. Make sure `.env` (backend) and `.env.local` (frontend) both have the key
3. Restart both servers after adding the key
4. Check for extra spaces or quotes around the key

### Port Already in Use

**Error:** `Port 8000 is already in use`

**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9

# OR use a different port
uvicorn main:app --reload --port 8001
```

## Production Deployment

### Environment Variables for Production

**Backend (.env):**
```env
DEBUG=False
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000

# Use production MongoDB (MongoDB Atlas)
MONGODB_URI=your_production_mongodb_uri

# Strong secret key (generate with: openssl rand -hex 32)
JWT_SECRET_KEY=your-production-secret-key-64-characters-minimum

# Frontend URLs
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
MONGODB_URI=your_production_mongodb_uri
```

### Recommended Hosting

**Backend:**
- Railway (Easy Python deployment)
- Render (Free tier)
- DigitalOcean App Platform
- AWS EC2 / Azure / GCP

**Frontend:**
- Vercel (Recommended for Next.js)
- Netlify
- Cloudflare Pages

**Database:**
- MongoDB Atlas (Managed, recommended)

## Next Steps

1. **Customize Content**
   - Add your own articles
   - Modify categories and tags
   - Customize UI theme

2. **Enhance Features**
   - Implement user profiles
   - Add image uploads
   - Create article editor
   - Add social features

3. **Monitor & Scale**
   - Set up logging
   - Add analytics
   - Implement caching
   - Optimize database queries

## Getting Help

- **Backend API Docs**: http://localhost:8000/docs
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check individual README files

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secret keys (64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use MongoDB authentication
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Use environment variables for secrets
- [ ] Implement input validation

---

**Congratulations! Your Gen Z Wikipedia is now running! 🎉**

Visit http://localhost:3000 to start exploring!
