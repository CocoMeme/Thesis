# News Management Quick Reference

## Adding a New News Article

### Method 1: Using MongoDB Directly

```javascript
// Connect to MongoDB and create news
const { News } = require('./src/models');

const newNews = await News.create({
  title: 'Your News Title',
  description: 'Brief description (max 500 chars)',
  body: `# Full Content
  
Your markdown content here...

## Features
- Feature 1
- Feature 2

**Important**: This is bold text.`,
  
  category: 'announcement', // or model_update, feature, bug_fix, etc.
  
  version: {
    modelVersion: 'v1.11.0', // Optional
    appVersion: '1.0.1'      // Optional
  },
  
  metadata: {
    improvements: [
      'Improvement 1',
      'Improvement 2'
    ],
    technicalDetails: 'Technical information here',
    affectedPlatforms: ['iOS', 'Android']
  },
  
  display: {
    isPinned: false,
    isHighlighted: true,
    showAsPopup: true,  // Show on login
    priority: 8         // 0-10, higher = shown first
  },
  
  tags: ['update', 'important', 'feature'],
  
  status: 'published',  // or 'draft', 'archived', 'scheduled'
  isPublic: true
});
```

### Method 2: Using API (Create a script)

Create `backend/add-news.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function addNews() {
  try {
    // First, login to get token (if admin auth is required)
    const loginResponse = await axios.post(`${API_URL}/auth/local/login`, {
      email: 'admin@example.com',
      password: 'your-password'
    });
    
    const token = loginResponse.data.token;
    
    // Create news
    const newsResponse = await axios.post(
      `${API_URL}/news`,
      {
        title: 'Your News Title',
        description: 'Brief description',
        body: '# Full content in markdown',
        category: 'feature',
        display: {
          showAsPopup: true,
          priority: 8
        },
        status: 'published'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ News created:', newsResponse.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

addNews();
```

Run: `node backend/add-news.js`

## News Categories

| Category | When to Use | Icon |
|----------|-------------|------|
| `model_update` | ML model releases, updates | 🧠 |
| `feature` | New app features | ⭐ |
| `bug_fix` | Bug fixes, patches | 🐛 |
| `maintenance` | System maintenance, downtime | 🔧 |
| `announcement` | General announcements | 📢 |
| `improvement` | Performance improvements | 📈 |
| `security` | Security updates | 🛡️ |
| `other` | Anything else | ℹ️ |

## Display Priority Guide

| Priority | When to Use | Behavior |
|----------|-------------|----------|
| 10 | Critical updates | Always shown first, pinned |
| 8-9 | Important features | Shown early, highlighted |
| 5-7 | Regular updates | Normal display |
| 1-4 | Minor updates | Shown later |
| 0 | Low priority | Last in list |

## Popup Configuration

To show news as popup on login:

```javascript
display: {
  showAsPopup: true,    // Must be true
  priority: 9,          // Higher = shown first
  isPinned: true,       // Optional: pin in news list
  isHighlighted: true   // Optional: highlight in UI
}
```

**Rules:**
- Only news from last 3 days shown as popup
- Maximum 3 popup news per login
- User must not have read the news yet
- Must be `status: 'published'`

## Markdown Formatting Guide

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
`Code inline`
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Links
```markdown
[Link text](https://example.com)
```

### Emphasis
```markdown
> This is a blockquote
> For important information
```

### Code Blocks
```markdown
\```javascript
const code = 'here';
\```
```

## Common Tasks

### 1. Update Existing News
```javascript
await News.findByIdAndUpdate(
  newsId,
  {
    title: 'Updated title',
    description: 'Updated description'
  },
  { new: true }
);
```

### 2. Archive Old News
```javascript
await News.updateMany(
  { 
    releaseDate: { $lt: new Date('2024-01-01') }
  },
  { 
    status: 'archived' 
  }
);
```

### 3. Pin Important News
```javascript
await News.findByIdAndUpdate(
  newsId,
  { 
    'display.isPinned': true,
    'display.priority': 10
  }
);
```

### 4. Schedule News
```javascript
const news = await News.create({
  title: 'Future Update',
  description: 'Coming soon',
  body: 'Content here',
  category: 'announcement',
  status: 'scheduled',
  scheduledPublishDate: new Date('2024-12-01'),
  // ... other fields
});
```

### 5. Get News Statistics
```javascript
// Total news count
const total = await News.countDocuments({ status: 'published' });

// By category
const stats = await News.aggregate([
  { $match: { status: 'published' } },
  { $group: {
    _id: '$category',
    count: { $sum: 1 },
    avgViews: { $avg: '$engagement.views' }
  }}
]);
```

## Example News Templates

### Model Update Template
```javascript
{
  title: 'Model Update: v{VERSION} - {CROP_NAME}',
  description: 'Enhanced detection for {CROP_NAME} with improved accuracy',
  body: `# Model Update v{VERSION}

## What's New
We've released a new version of our ML model for {CROP_NAME} detection.

## Improvements
- Increased accuracy by X%
- Faster processing time
- Better handling of edge cases

## Dataset
- Size: {SIZE}GB
- Images: {COUNT}
- Varieties: {VARIETIES}

## Performance
- Detection accuracy: X%
- Processing time: Xms
- Confidence threshold: 0.X

Happy scanning! 🌱`,
  
  category: 'model_update',
  version: {
    modelVersion: 'v{VERSION}'
  },
  metadata: {
    datasetSize: '{SIZE}GB',
    datasetInfo: '{CROP_NAME}',
    improvements: [
      'Improved accuracy',
      'Faster processing',
      'Better edge cases'
    ]
  },
  display: {
    showAsPopup: true,
    priority: 10
  }
}
```

### Feature Template
```javascript
{
  title: 'New Feature: {FEATURE_NAME}',
  description: '{SHORT_DESCRIPTION}',
  body: `# New Feature: {FEATURE_NAME}

We're excited to announce {FEATURE_NAME}!

## What It Does
{DETAILED_DESCRIPTION}

## How to Use
1. Step 1
2. Step 2
3. Step 3

## Benefits
✅ Benefit 1
✅ Benefit 2
✅ Benefit 3

Try it out and let us know what you think!`,
  
  category: 'feature',
  display: {
    showAsPopup: true,
    priority: 8
  }
}
```

## Testing Checklist

Before publishing news:

- [ ] Title is clear and under 200 characters
- [ ] Description is concise and under 500 characters
- [ ] Body content is well-formatted with Markdown
- [ ] Category is correct
- [ ] Priority is appropriate (1-10)
- [ ] Status is 'published' (not 'draft')
- [ ] Release date is set correctly
- [ ] Popup settings configured if needed
- [ ] Tags are relevant
- [ ] Preview on mobile device

## Troubleshooting

### News Not Showing Up
- Check status is 'published'
- Check releaseDate is not in future
- Check isPublic is true
- Verify no expiryDate or it's in future

### Popup Not Appearing
- Check display.showAsPopup is true
- Verify news is within last 3 days
- Ensure user hasn't read it yet
- Check priority is high enough

### Markdown Not Rendering
- Ensure react-native-markdown-display is installed
- Check markdown syntax is correct
- Verify NewsModal is properly implemented

## Quick Commands

```bash
# Seed first news
npm run seed:news

# Start backend
cd backend && npm run dev

# Start mobile app
cd frontend/mobile-app && npm start

# Check MongoDB news collection
mongo
use your_database
db.news.find({ status: 'published' }).pretty()
```
