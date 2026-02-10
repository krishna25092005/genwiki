# WikiGen Deployment Guide

Complete guide for deploying the WikiGen platform (Gen Z Wikipedia) to production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start Options](#quick-start-options)
3. [Option 1: Vercel + Railway (Recommended)](#option-1-vercel--railway-recommended)
4. [Option 2: Docker Deployment](#option-2-docker-deployment)
5. [Option 3: Self-Hosted VPS](#option-3-self-hosted-vps)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] **MongoDB Atlas** account (or MongoDB instance)
- [ ] **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- [ ] **OpenAI API Key** (optional, for additional AI features)
- [ ] Git repository with your code

---

## Quick Start Options

Choose the deployment method that fits your needs:

| Method | Best For | Difficulty | Cost |
|--------|----------|------------|------|
| **Vercel + Railway** | Quick deployment, scalability | ⭐ Easy | Free tier available |
| **Docker** | Full control, local dev | ⭐⭐ Medium | Variable |
| **VPS** | Complete customization | ⭐⭐⭐ Hard | $5-20/month |

---

## Option 1: Vercel + Railway (Recommended)

This setup deploys your **frontend on Vercel** and **backend on Railway**.

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository and choose the **`backend`** directory
4. Railway will auto-detect the FastAPI app

5. **Add Environment Variables** in Railway:
   ```env
   HOST=0.0.0.0
   PORT=8000
   ENVIRONMENT=production
   DEBUG=False
   
   # Database
   MONGODB_URI=your_mongodb_atlas_connection_string
   DATABASE_NAME=genz_wikipedia
   
   # AI Keys
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # Auth
   JWT_SECRET_KEY=your_secure_random_string_here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # CORS (add your Vercel domain after deployment)
   ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   
   # Redis (optional - Railway provides Redis addon)
   REDIS_URL=redis://default:password@redis.railway.internal:6379
   ```

6. **Deploy!** Railway will automatically deploy your backend
7. **Copy your backend URL** (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New Project"** → Select your repository
3. Vercel auto-detects Next.js configuration

4. **Add Environment Variables** in Vercel:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string_here
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   ```

5. **Deploy!** Vercel will build and deploy your frontend

6. **Update Backend CORS**: Go back to Railway and update `ALLOWED_ORIGINS` to include your Vercel URL

### Step 3: Test Your Deployment

Visit your Vercel URL and test:
- [ ] Landing page loads
- [ ] Sign up/login works
- [ ] Explore page shows content
- [ ] Chat functionality works

---

## Option 2: Docker Deployment

Run the entire stack (frontend, backend, database) with Docker.

### Step 1: Create Environment File

Create a `.env` file in the project root:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET_KEY=your_secure_random_string_here
```

### Step 2: Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Step 3: Production Deployment

For production with Docker:

```bash
# Build optimized images
DOCKER_BUILD=true docker-compose -f docker-compose.yml up -d

# Use external MongoDB (recommended)
# Update MONGODB_URI in docker-compose.yml to point to Atlas
```

---

## Option 3: Self-Hosted VPS

Deploy to any VPS (DigitalOcean, AWS, Linode, etc.)

### Prerequisites

- Ubuntu 22.04 LTS server
- Root/sudo access
- Domain name (optional but recommended)

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Clone and Setup

```bash
# Clone repository
git clone https://github.com/yourusername/gen-z-wikipedia-2.git
cd gen-z-wikipedia-2

# Setup backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup frontend
pnpm install
pnpm build
```

### Step 3: Create Environment Files

Create `.env` files as shown in previous sections.

### Step 4: Setup Services with PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name wikigen-backend
cd ..

# Start frontend
pm2 start "pnpm start" --name wikigen-frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/wikigen`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/wikigen /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL

```bash
# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Environment Variables

### Frontend (.env)

```env
# Required
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secure_random_string
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Optional
NODE_ENV=production
```

### Backend (.env)

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=False
ENVIRONMENT=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
DATABASE_NAME=genz_wikipedia

# AI Keys
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key  # optional

# Authentication
JWT_SECRET_KEY=your_secure_random_string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379/0
```

### Getting API Keys

1. **Gemini API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Click "Get API Key"

2. **MongoDB Atlas**:
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string from "Connect" button

3. **OpenAI API Key** (optional):
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create account and add billing
   - Generate API key

---

## Post-Deployment

### 1. Verify Deployment

Test all critical features:

```bash
# Health check
curl https://your-backend-url.com/health

# API docs
# Visit: https://your-backend-url.com/docs
```

### 2. Setup Monitoring

- **Vercel**: Built-in analytics at [vercel.com/dashboard](https://vercel.com/dashboard)
- **Railway**: Metrics available in project dashboard
- **Self-hosted**: Consider using [UptimeRobot](https://uptimerobot.com/)

### 3. Database Indexing

Create indexes in MongoDB for better performance:

```javascript
// Connect to MongoDB Atlas and run:
db.users.createIndex({ email: 1 }, { unique: true })
db.articles.createIndex({ title: "text", content: "text" })
db.conversations.createIndex({ userId: 1, createdAt: -1 })
```

### 4. Backup Strategy

- **MongoDB Atlas**: Continuous backups (free tier includes weekly backups)
- **Self-hosted**: Setup automated backups with `mongodump`

```bash
# Backup script
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

---

## Troubleshooting

### Frontend Issues

**Build fails on Vercel:**
```bash
# Check build logs in Vercel dashboard
# Common fix: Ensure all environment variables are set
```

**API calls failing:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running and accessible

### Backend Issues

**502 Bad Gateway:**
- Check backend logs: `pm2 logs wikigen-backend` (PM2) or Railway logs
- Verify MongoDB connection string
- Ensure port 8000 is not blocked

**AI features not working:**
- Verify API keys are valid
- Check API quotas and billing
- Review backend logs for errors

### Database Issues

**Connection timeout:**
- Whitelist IP addresses in MongoDB Atlas (use 0.0.0.0/0 for testing)
- Check connection string format
- Verify network connectivity

**Slow queries:**
- Add database indexes (see Post-Deployment section)
- Consider enabling Redis caching
- Review query patterns in logs

### General Tips

1. **Check logs first**: Most issues show up in logs
   - Vercel: Dashboard → Deployment → Runtime Logs
   - Railway: Project → Deployment → Logs
   - PM2: `pm2 logs`

2. **Test locally first**: Run `docker-compose up` to test full stack locally

3. **Use health checks**: Both frontend and backend should have health endpoints

4. **Monitor costs**: Check Vercel, Railway, and MongoDB Atlas usage regularly

---

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

---

## Support

For issues specific to this application:
1. Check the troubleshooting section above
2. Review logs for error messages
3. Ensure all environment variables are set correctly
4. Test with a minimal configuration first

**Happy Deploying! 🚀**
