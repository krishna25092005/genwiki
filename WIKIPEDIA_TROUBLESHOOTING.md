# Wikipedia Integration Troubleshooting Guide

## Quick Diagnosis

Run this simple test to check if everything is working:

```powershell
cd backend
python test_wiki_simple.py
```

This will check:
1. ✓ If `aiohttp` is installed
2. ✓ If Wikipedia API is accessible
3. ✓ If search works
4. ✓ If article fetching works

---

## Common Issues & Solutions

### Issue 1: "No results found on Wikipedia"

**Cause:** `aiohttp` library not installed

**Solution:**
```powershell
cd backend
pip install aiohttp==3.9.1
```

Then restart the backend server.

---

### Issue 2: Backend not responding

**Check if backend is running:**
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Look for these messages:**
- "✅ Database connected successfully"
- "Application startup complete"
- "Uvicorn running on http://127.0.0.1:8000"

---

### Issue 3: Cannot connect to backend

**Test the API directly:**

Open browser and visit:
```
http://localhost:8000/docs
```

Try the Wikipedia search endpoint:
```
http://localhost:8000/api/v1/articles/wikipedia/search?query=Python&limit=5
```

---

### Issue 4: Database connection errors

**Check MongoDB:**
1. Make sure MongoDB is running
2. Check `.env` file has correct `MONGODB_URI`

**Example `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=genz_wikipedia
JWT_SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
```

---

## Step-by-Step Setup

### 1. Install Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 2. Verify Installation
```powershell
pip list | findstr aiohttp
```
Should show: `aiohttp 3.9.1` (or similar)

### 3. Test Wikipedia Connection
```powershell
python test_wiki_simple.py
```

### 4. Start Backend
```powershell
python -m uvicorn app.main:app --reload --port 8000
```

### 5. Test API Endpoint

Open new terminal:
```powershell
curl "http://localhost:8000/api/v1/articles/wikipedia/search?query=Python&limit=3"
```

Or use browser:
```
http://localhost:8000/docs
```

### 6. Start Frontend
```powershell
cd ..
pnpm dev
```

---

## Debugging Frontend Issues

**Open Browser Console (F12):**

When you search Wikipedia, you should see:
```
Searching Wikipedia for: [your query]
Wikipedia search response status: 200
Wikipedia search results: [array of results]
```

**If you see errors:**

- `Failed to fetch` → Backend not running
- `401 Unauthorized` → Not logged in (Wikipedia search doesn't need auth, but import does)
- `500 Server Error` → Check backend logs

---

## Testing Checklist

- [ ] aiohttp installed (`pip list | findstr aiohttp`)
- [ ] Backend running on port 8000
- [ ] Can access http://localhost:8000/docs
- [ ] Wikipedia test script passes
- [ ] Frontend running on port 3000
- [ ] Logged into the application
- [ ] Browser console shows no errors

---

## Backend Logs

**Enable detailed logging:**

Backend automatically logs Wikipedia API calls. Check terminal for:
```
INFO - Searching Wikipedia for: Python
INFO - Wikipedia API response status: 200
INFO - Found 10 Wikipedia results
```

**If you see errors:**
```
ERROR - Failed to search Wikipedia: [error message]
```

This tells you exactly what went wrong.

---

## Quick Fix Commands

```powershell
# Reinstall aiohttp
pip uninstall aiohttp -y
pip install aiohttp==3.9.1

# Restart backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Check backend is responding
curl http://localhost:8000/health

# Test Wikipedia directly
python test_wiki_simple.py
```

---

## Still Not Working?

1. **Check firewall** - Wikipedia API might be blocked
2. **Check internet** - Need connection to Wikipedia
3. **Check antivirus** - Might block Python network access
4. **Try different search term** - Some topics have no results
5. **Check backend terminal** - Look for error messages

---

## Success Indicators

✅ Test script shows "SUCCESS"
✅ Backend logs show "Found X Wikipedia results"  
✅ Browser console shows search results array
✅ Can see Wikipedia results in UI
✅ Import button works and creates article

---

## Contact

If still having issues, share:
1. Output of `python test_wiki_simple.py`
2. Backend terminal logs
3. Browser console errors (F12)
