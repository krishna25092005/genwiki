# WikiGen - Quick Start Guide

Get WikiGen running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)
- A Google account (for Gemini API)
- A MongoDB account (for database)

## Step 1: Get Your API Keys

### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Create API Key" 
3. Copy your API key (keep it safe!)

### MongoDB Connection String
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster (free tier is fine)
4. Click "Connect" and copy the connection string
5. Replace `<username>` and `<password>` with your database user credentials

## Step 2: Setup Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```

2. Add the following variables:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wikigen?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_minimum_32_characters_long
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. Save the file

## Step 3: Install Dependencies

```bash
# Install all dependencies
pnpm install

# Clear cache to be safe
rm -rf .next
```

## Step 4: Start the Development Server

```bash
pnpm dev
```

You should see:
```
> next dev --turbo
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 5: Access the App

Open your browser and navigate to:
```
http://localhost:3000
```

## What You Can Do

### 1. Create an Account
- Click "Get Started" on the home page
- Fill in your email, name, and password
- Click "Create Account"

### 2. Explore Topics
- Navigate to "Explore" to browse topics
- Use the search bar to find specific topics
- Click on an article to view details

### 3. Test AI Features
- Click the "Summarize" button to get AI-generated summaries
- Use the "Ask Questions" feature to chat about topics
- Mark articles as saved for later

### 4. Save Topics
- Click the heart icon to save articles
- View your saved topics in the "Saved Topics" page
- Add personal notes to saved articles

## Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Folder Structure

```
/app
  /api               - API routes (auth, AI features)
  /article           - Article detail page
  /chat             - Chat/Q&A page
  /explore          - Browse topics page
  /login            - Login page
  /register         - Registration page
  /saved            - Saved topics page
  layout.tsx        - Root layout
  page.tsx          - Home page

/components
  /ui               - Reusable UI components

/lib
  /models           - MongoDB schemas (User, Article, etc.)
  api.ts            - API request utilities
  auth.ts           - Authentication utilities
  gemini.ts         - Gemini AI integration
  mongodb.ts        - Database connection

/hooks
  useAuth.ts        - Authentication hook
  useAI.ts          - AI features hook
```

## Troubleshooting

### Build fails with "Fatal error during initialization"
- Make sure `.env.local` file exists with all required variables
- Restart the dev server

### "Cannot connect to MongoDB"
- Verify connection string in `.env.local`
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Ensure database user has correct permissions

### "Gemini API key is invalid"
- Double-check your API key in `.env.local` (no extra spaces)
- Generate a new key from Google AI Studio if needed

### Port 3000 already in use
```bash
pnpm dev -p 3001
```

## Next Steps

1. **Customize the App:**
   - Edit colors in `/app/globals.css`
   - Modify content in `/app/page.tsx`
   - Update metadata in `/app/layout.tsx`

2. **Deploy to Production:**
   - Connect to Vercel: https://vercel.com
   - Set environment variables in Vercel dashboard
   - Push code to GitHub and deploy

3. **Add More Features:**
   - Create user profiles
   - Add social features (follow, like, comment)
   - Implement advanced search
   - Add content moderation

## Support

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Check [README.md](./README.md) for detailed documentation
- Review [SETUP.md](./SETUP.md) for configuration details

## Happy Learning! 🚀
