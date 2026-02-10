# WikiGen Setup Guide

This guide will walk you through setting up WikiGen locally and in production.

## Prerequisites

- Node.js 18+ (we recommend the latest LTS version)
- npm, yarn, or pnpm (we use pnpm)
- Git
- A code editor (VS Code recommended)
- MongoDB Atlas account
- Google AI Studio account for Gemini API

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd wikigen

# Install dependencies using pnpm
pnpm install

# If you don't have pnpm installed globally:
npm install -g pnpm
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then fill in the required values:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_api_key_here

# MongoDB Configuration
# For local MongoDB: mongodb://localhost:27017/wikigen
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=generate_a_random_secret_key_here

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Step 3: Get API Keys

#### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key" button
3. Create a new API key
4. Copy the key and paste into `.env.local`

**Important**: Keep your API key secret. Never commit it to version control.

#### MongoDB Connection String

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Create a cluster (free tier is available)
4. Click "Connect" and select "Drivers"
5. Copy the connection string
6. Add to `.env.local`, replacing `<password>` with your database password

### Step 4: Generate JWT Secret

Generate a strong random secret for JWT:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add to `JWT_SECRET` in `.env.local`

### Step 5: Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Database Setup

### Local MongoDB

If using local MongoDB:

```bash
# Start MongoDB service (macOS with Homebrew)
brew services start mongodb-community

# Or for Linux/Windows, follow MongoDB installation guide
```

### MongoDB Atlas

No additional setup needed - connection string in `.env.local` handles it automatically.

## Testing the Setup

1. **Home Page**: Navigate to `http://localhost:3000` - you should see the landing page
2. **Register**: Click "Get Started" and create an account
3. **Explore**: Browse articles and test search functionality
4. **Chat**: Go to chat and ask the AI a question
5. **Summarize**: On article page, test the AI summarization feature

## Development Workflow

### Code Structure

- **Pages**: In `app/` directory, following Next.js 16 conventions
- **Components**: Reusable UI components in `components/`
- **API Routes**: Backend APIs in `app/api/`
- **Hooks**: Custom React hooks in `hooks/`
- **Utilities**: Helper functions in `lib/`
- **Models**: MongoDB/Mongoose models in `lib/models/`

### Adding New Features

1. **Create page/component** in appropriate directory
2. **Add API route** if needed in `app/api/`
3. **Create database model** in `lib/models/` if storing data
4. **Write tests** (optional but recommended)

### Style Guidelines

- Use Tailwind CSS for styling
- Follow shadcn/ui component patterns
- Use semantic HTML elements
- Implement responsive design (mobile-first)
- Maintain accessibility standards

## Debugging

### Enable Debug Logs

Add debug logs to your code:

```typescript
console.log('[v0] Your debug message:', variable)
```

### Common Issues

**Issue**: `GEMINI_API_KEY is not set`
- Solution: Check `.env.local` file exists and has correct API key

**Issue**: MongoDB connection fails
- Solution: Verify MongoDB URI in `.env.local`
- Check MongoDB is running (local) or accessible (Atlas)
- Verify IP whitelist in MongoDB Atlas (if using Atlas)

**Issue**: Next.js compilation errors
- Solution: Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`

## Production Deployment

### Deploy to Vercel

Vercel is the recommended platform for Next.js apps:

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import GitHub repository
4. Add environment variables in project settings
5. Deploy

### Environment Variables for Production

In Vercel project settings, add:
- `GEMINI_API_KEY` - Your Gemini API key
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong random secret (different from dev)
- `NEXT_PUBLIC_API_URL` - Production domain URL

### Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] API keys are not in version control
- [ ] HTTPS is enabled (Vercel default)
- [ ] MongoDB has authentication enabled
- [ ] IP whitelist configured for MongoDB (if Atlas)
- [ ] Environment variables are set in production
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (optional)

## Performance Optimization

### Caching
- Leverage Next.js caching for static pages
- Use SWR for client-side data fetching
- Cache AI responses appropriately

### Database
- Add indexes for frequently queried fields
- Monitor connection pool size
- Regular database backups

### Monitoring
- Set up error tracking (Sentry recommended)
- Monitor API response times
- Track user engagement metrics

## Getting Help

- Check the [README.md](./README.md) for project overview
- Review API documentation in the codebase
- Check [Next.js documentation](https://nextjs.org/docs)
- Refer to [Gemini API docs](https://ai.google.dev/)
- MongoDB documentation: [docs.mongodb.com](https://docs.mongodb.com)

## Next Steps

After setup:
1. Explore the codebase
2. Modify articles data in `app/explore/page.tsx`
3. Add more AI features
4. Implement user profile customization
5. Add more content categories
6. Set up email notifications
7. Deploy to production

---

**Last Updated**: 2024
**Maintained by**: WikiGen Team
