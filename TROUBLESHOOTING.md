# WikiGen Troubleshooting Guide

## Common Issues and Solutions

### 1. Build/Startup Error: "Fatal error during initialization"

**Cause:** Missing environment variables during build time.

**Solution:**
1. Create a `.env.local` file in the project root
2. Add the required environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Restart the development server

### 2. MongoDB Connection Errors

**Cause:** `MONGODB_URI` not configured or invalid connection string.

**Solution:**
- Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Ensure the connection string includes:
  - Username and password
  - Database name (default: `wikigen`)
  - Connection options (`retryWrites=true&w=majority`)
- Example: `mongodb+srv://username:password@cluster.mongodb.net/wikigen?retryWrites=true&w=majority`

### 3. Gemini API Errors

**Cause:** Invalid or missing `GEMINI_API_KEY`.

**Solution:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Create API Key"
3. Copy the API key
4. Add it to your `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
5. Restart the server

### 4. Dependencies Installation Issues

**Cause:** pnpm lock file conflicts or outdated dependencies.

**Solution:**
```bash
# Remove lock file and node_modules
rm -rf pnpm-lock.yaml node_modules

# Reinstall dependencies
pnpm install

# Clear build cache
rm -rf .next

# Restart dev server
pnpm dev
```

### 5. Port Already in Use

**Cause:** Port 3000 is already in use.

**Solution:**
```bash
# Run on a different port
pnpm dev -p 3001
```

Or kill the process using port 3000:
```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 6. Authentication Issues

**Cause:** JWT_SECRET not configured or token storage issues.

**Solution:**
- Ensure `JWT_SECRET` is set in `.env.local`
- Clear browser localStorage: Open DevTools > Application > LocalStorage > Clear
- Clear cookies if experiencing persistent issues
- Try incognito mode to test

### 7. API Routes Not Found (404 errors)

**Cause:** Routes not properly created or file naming issues.

**Solution:**
- Verify file structure: `/app/api/auth/register/route.ts`
- Ensure file is named `route.ts` (not `route.tsx` or `routes.ts`)
- Check that directories exist (Next.js creates them automatically)
- Restart dev server after creating new routes

### 8. TypeScript Errors

**Cause:** Missing type definitions or import errors.

**Solution:**
```bash
# Reinstall all dependencies including types
pnpm install

# Clear TypeScript cache
rm -rf .next

# Run type check
pnpm tsc --noEmit
```

### 9. Tailwind CSS Not Applied

**Cause:** Tailwind config not properly configured.

**Solution:**
- Verify `tailwind.config.ts` has correct content paths
- Check that `globals.css` imports Tailwind directives
- Ensure font variables are properly set in CSS custom properties
- Restart dev server

### 10. useSearchParams Warning in Explore Page

**Cause:** useSearchParams requires Suspense boundary.

**Solution:**
- The `app/explore/loading.tsx` file handles this
- If error persists, wrap component in Suspense:
```tsx
import { Suspense } from 'react'

export default function ExploreLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorePage />
    </Suspense>
  )
}
```

## Debugging Steps

1. **Check Environment Variables:**
   ```bash
   # View all env vars
   env | grep -E "(GEMINI|MONGODB|JWT|NEXT_PUBLIC)"
   ```

2. **Check Node Modules:**
   ```bash
   # Verify critical packages are installed
   ls node_modules/@google/
   ls node_modules/mongoose/
   ```

3. **Check Logs:**
   - Browser console (F12 > Console)
   - Terminal output where `pnpm dev` is running
   - Check `.env.local` is not in `.gitignore`

4. **Verify API Endpoints:**
   ```bash
   # Test registration endpoint
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
   ```

5. **Clear All Caches:**
   ```bash
   pnpm cache clean
   rm -rf .next node_modules pnpm-lock.yaml
   pnpm install
   pnpm dev
   ```

## Performance Issues

- **Slow Build:** Clear `.next` folder and rebuild
- **Slow Hot Reload:** Ensure turbo is enabled in `next.config.mjs`
- **High Memory Usage:** Close other applications and restart dev server

## Getting More Help

- Check Next.js docs: https://nextjs.org/docs
- Check Gemini API docs: https://ai.google.dev/docs
- Check MongoDB docs: https://docs.mongodb.com
- Review error messages in terminal carefully - they often indicate the exact issue

## Environment Variables Checklist

- [ ] GEMINI_API_KEY is set and valid
- [ ] MONGODB_URI is set and connection works
- [ ] JWT_SECRET is set (minimum 32 characters recommended)
- [ ] NEXT_PUBLIC_API_URL matches your domain
- [ ] `.env.local` file exists in project root
- [ ] `.env.local` is added to `.gitignore`
- [ ] No extra spaces or quotes in values
