# News Modal Debugging Guide

## Issue: News Modal Only Shows Title and Tags

### Steps to Debug

1. **Check Console Logs**
   
   When you tap a news card, check the console for:
   ```
   📰 News pressed: {
     id: '...',
     title: '...',
     hasBody: true/false,
     bodyLength: number,
     category: '...'
   }
   
   📰 NewsModal opened with: {
     id: '...',
     title: '...',
     hasBody: true/false,
     bodyLength: number,
     bodyPreview: '...',
     ...
   }
   ```

   **If `hasBody: false` or `bodyLength: 0`:**
   - The news data from backend is incomplete
   - Check backend response

   **If `hasBody: true` but still not showing:**
   - Markdown rendering issue
   - Continue to next steps

2. **Test Backend Directly**

   In your browser or Postman, test:
   ```
   GET http://192.168.1.66:5000/api/news
   ```

   Check if the response includes `body` field:
   ```json
   {
     "success": true,
     "data": [
       {
         "_id": "...",
         "title": "First ML Model Release...",
         "description": "...",
         "body": "# Full Content\n\nWe are thrilled...",  // Should be here!
         "category": "model_update",
         ...
       }
     ]
   }
   ```

   **If body is missing:**
   - News was not seeded correctly
   - Re-run seed script: `cd backend && npm run seed:news`

3. **Check Network Request in App**

   Look for:
   ```
   GET http://192.168.1.66:5000/api/news
   ```

   **If you see error:**
   - Backend not running
   - Wrong IP address
   - CORS issue

4. **Check Markdown Rendering**

   The app should render markdown content. If you see "No content available" text:
   - Body field is empty in the data
   - Re-seed the database

### Quick Fixes

#### Fix 1: Re-seed the News Database

```bash
cd backend
npm run seed:news
```

Expected output:
```
✅ First news seeded successfully!
📰 News Title: First ML Model Release - Ampalaya Bilog v1.10.30
```

#### Fix 2: Verify Backend is Running

```bash
cd backend
npm run dev
```

Should show:
```
✅ MongoDB connected successfully
🚀 Server running on http://0.0.0.0:5000
```

#### Fix 3: Test API Manually

In browser:
```
http://192.168.1.66:5000/api/health
```

Should return:
```json
{"status":"healthy","database":{"connected":true},...}
```

Then test news endpoint:
```
http://192.168.1.66:5000/api/news
```

#### Fix 4: Clear App Cache and Restart

```bash
cd frontend/mobile-app
npx expo start --clear
```

Then:
- Press `r` to reload
- Or shake device and tap "Reload"

### Expected Behavior

When working correctly:

1. **Home Screen:**
   - Shows news cards with title, description, date
   - Cards have gradient backgrounds based on category

2. **Tap News Card:**
   - Modal slides up from bottom
   - Shows gradient header with icon
   - Displays full title
   - Shows metadata (date, version, dataset size)

3. **Scroll Down in Modal:**
   - See description (larger text)
   - See full body content with formatting:
     - Headers (# Heading)
     - Bold text (**bold**)
     - Lists (- item)
     - etc.
   - See "Key Improvements" section (if available)
   - See "Technical Details" section (if available)
   - See tags at bottom (#tag1, #tag2)

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Only title and tags showing | Body content not loaded | Re-seed database |
| "No content available" text | Body field is empty | Re-seed database |
| Nothing happens when tap | Modal not opening | Check console for errors |
| Network Error | Backend not reachable | Check IP, restart backend |
| Modal immediately closes | Error in rendering | Check console for errors |

### Verification Checklist

- [ ] Backend is running (`npm run dev`)
- [ ] MongoDB is connected (check backend logs)
- [ ] News is seeded (`npm run seed:news`)
- [ ] Frontend has correct API URL (`.env` file)
- [ ] App restarted with cache clear
- [ ] Console shows news data with body field
- [ ] Modal opens when tapping card
- [ ] Can scroll in modal
- [ ] Can see full content formatted properly

### Test with MongoDB Directly

If still not working, check MongoDB:

```bash
# Connect to MongoDB (adjust connection string)
mongosh "your_mongodb_connection_string"

# Check news collection
use your_database_name
db.news.find().pretty()
```

Should see:
```javascript
{
  "_id": ObjectId("..."),
  "title": "First ML Model Release - Ampalaya Bilog v1.10.30",
  "body": "# First ML Model Release 🎉\n\nWe are thrilled to announce...",
  // ... rest of the fields
}
```

**If body is missing from MongoDB:**
- Drop the collection: `db.news.drop()`
- Re-seed: `npm run seed:news`

### Still Not Working?

Try this manual test:

1. Open `HomeScreen.js`
2. Add this temporary code after `const handleNewsPress`:

```javascript
const testNews = {
  _id: 'test-id',
  title: 'Test News',
  description: 'This is a test',
  body: '# Test\n\nThis is **test** content with:\n\n- Bullet 1\n- Bullet 2\n\n## Subheading\n\nMore content here.',
  category: 'announcement',
  releaseDate: new Date(),
  tags: ['test', 'debug'],
  metadata: {
    improvements: ['Test 1', 'Test 2']
  }
};

const handleTestPress = () => {
  console.log('Test news pressed');
  setSelectedNews(testNews);
};
```

3. Add a test button in the render:

```javascript
<TouchableOpacity 
  style={{padding: 20, backgroundColor: 'blue'}} 
  onPress={handleTestPress}
>
  <Text style={{color: 'white'}}>TEST NEWS MODAL</Text>
</TouchableOpacity>
```

4. Tap the test button

**If test button works:**
- Problem is with data from backend
- Check backend response

**If test button doesn't work:**
- Problem is with NewsModal component
- Check console for errors in Markdown rendering

### Contact Info

If none of these work, check:
1. Console logs for errors
2. Network tab for API responses
3. Backend logs for any errors
4. MongoDB for data integrity
