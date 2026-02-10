# 🚀 Quick Deploy Guide

Get your WikiGen platform live in minutes!

## Fastest Path to Production

### Option 1: Vercel + Railway (Recommended - 10 minutes)

**Perfect for**: Quick deployment, automatic scaling, free tier available

#### Prerequisites
- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier)
- [ ] Gemini API key ([Get here](https://makersuite.google.com/app/apikey))

#### Steps

**1. Deploy Backend (5 mins)**
```bash
# Go to: https://railway.app
# 1. Sign in with GitHub
# 2. New Project → Deploy from GitHub
# 3. Select your repo → backend directory
# 4. Add environment variables (see below)
# 5. Deploy!
```

**Backend Environment Variables:**
```env
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_key
JWT_SECRET_KEY=your_random_secret_string
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**2. Deploy Frontend (5 mins)**
```bash
# Go to: https://vercel.com
# 1. Sign in with GitHub
# 2. New Project → Select your repo
# 3. Add environment variables (see below)
# 4. Deploy!
```

**Frontend Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
GEMINI_API_KEY=your_gemini_key
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_random_secret_string
```

**3. Update CORS**
- Go back to Railway
- Update `ALLOWED_ORIGINS` with your Vercel URL
- Redeploy

**✅ Done!** Your app is live!

---

### Option 2: One-Click Docker Deploy (5 minutes)

**Perfect for**: Local testing, full control, development

```bash
# Windows
deploy.bat

# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

Select option 3 for Docker deployment.

Your app runs at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

### Option 3: Manual CLI Deploy

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
```

---

## Pre-Deployment Checklist

Run this before deploying:

```bash
node scripts/check-deployment.js
```

This checks:
- ✅ Environment variables
- ✅ Build configuration
- ✅ Required files
- ✅ Dependencies

---

## Get Your API Keys

### 1. Gemini API (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Click "Get API Key"
4. Copy your key

### 2. MongoDB Atlas (Required)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 Sandbox)
3. Create database user
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your password

### 3. OpenAI API (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account
3. Add billing method
4. Generate API key

---

## Environment Setup

### Create .env file (Frontend Root)

```env
GEMINI_API_KEY=your_actual_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wikigen
JWT_SECRET=a_random_secret_at_least_32_chars_long
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Create .env file (Backend Folder)

```env
HOST=0.0.0.0
PORT=8000
DEBUG=False
ENVIRONMENT=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wikigen
DATABASE_NAME=genz_wikipedia
GEMINI_API_KEY=your_actual_key_here
JWT_SECRET_KEY=a_random_secret_at_least_32_chars_long
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Verify Deployment

### Check Frontend
```bash
# Navigate to your deployed URL
# Test these features:
- [ ] Homepage loads
- [ ] Sign up works
- [ ] Login works
- [ ] Explore page shows content
- [ ] Chat responds
```

### Check Backend
```bash
# Test API health
curl https://your-backend-url.com/health

# View API docs
# Visit: https://your-backend-url.com/docs
```

---

## Common Issues & Quick Fixes

### "Cannot connect to database"
- ✅ Check MongoDB URI is correct
- ✅ Whitelist IP in MongoDB Atlas (use 0.0.0.0/0)
- ✅ Verify network access rules

### "API calls failing"
- ✅ Verify `NEXT_PUBLIC_API_URL` is set
- ✅ Check CORS settings in backend
- ✅ Ensure backend is running

### "Build failed"
- ✅ Check all environment variables are set
- ✅ Review build logs
- ✅ Try building locally first: `pnpm build`

### "AI features not working"
- ✅ Verify API key is valid
- ✅ Check API quotas
- ✅ Review backend logs for errors

---

## Production Tips

1. **Use MongoDB Atlas**: Don't run your own MongoDB in production
2. **Enable HTTPS**: Both Vercel and Railway provide free SSL
3. **Set strong secrets**: Use at least 32 random characters for JWT_SECRET
4. **Monitor costs**: Check your usage on all platforms
5. **Enable logging**: Review logs regularly for errors
6. **Backup database**: Enable automatic backups in MongoDB Atlas

---

## Next Steps After Deployment

1. **Setup Custom Domain** (Optional)
   - Vercel: Settings → Domains
   - Railway: Settings → Networking

2. **Enable Analytics** (Optional)
   - Vercel built-in analytics
   - Add Google Analytics

3. **Setup Monitoring** (Recommended)
   - [UptimeRobot](https://uptimerobot.com/) for uptime monitoring
   - Railway/Vercel dashboards for metrics

4. **Database Indexes** (Performance)
   ```javascript
   // Run in MongoDB Atlas Data Explorer
   db.users.createIndex({ email: 1 }, { unique: true })
   db.articles.createIndex({ title: "text" })
   ```

---

## Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
2. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Check deployment logs
4. Verify environment variables

---

## Deployment Timeline

| Task | Time | Difficulty |
|------|------|------------|
| Get API keys | 5 min | ⭐ Easy |
| Setup MongoDB Atlas | 5 min | ⭐ Easy |
| Deploy Backend (Railway) | 5 min | ⭐ Easy |
| Deploy Frontend (Vercel) | 5 min | ⭐ Easy |
| Test & Verify | 5 min | ⭐ Easy |
| **Total** | **~25 min** | **⭐ Easy** |

---

**You're ready to deploy! Choose your option and follow the steps above. 🎉**
