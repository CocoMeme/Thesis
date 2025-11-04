# News & Updates Feature Documentation

## Overview
The News & Updates feature allows users to see development updates, model releases, new features, and important announcements. News articles appear on the Home screen and can be shown as popups when users log in.

## Features Implemented

### 1. Backend Components

#### Models
- **News Model** (`backend/src/models/News.js`)
  - Comprehensive news schema with:
    - Basic info (title, description, body)
    - Categories (model_update, feature, bug_fix, maintenance, announcement, improvement, security, other)
    - Version information (model version, app version)
    - Metadata (dataset size, improvements, technical details)
    - Display settings (pinned, highlighted, show as popup, priority)
    - User engagement tracking (views, likes, read status)
    - Status management (draft, published, archived, scheduled)

#### Controllers
- **News Controller** (`backend/src/controllers/newsController.js`)
  - `getAllNews` - Get all published news with filters
  - `getNewsById` - Get specific news article
  - `getPopupNews` - Get news to show as popup on login
  - `getNewsByCategory` - Filter news by category
  - `markAsRead` - Track when user reads news
  - `likeNews` - Allow users to like news
  - `createNews`, `updateNews`, `deleteNews` - Admin operations

#### Routes
- **News Routes** (`backend/src/routes/news.js`)
  - `GET /api/news` - Get all news
  - `GET /api/news/:id` - Get news by ID
  - `GET /api/news/category/:category` - Get news by category
  - `GET /api/news/user/popup` - Get popup news (authenticated)
  - `POST /api/news/:id/read` - Mark as read (authenticated)
  - `POST /api/news/:id/like` - Like news (authenticated)
  - `POST /api/news` - Create news (admin)
  - `PUT /api/news/:id` - Update news (admin)
  - `DELETE /api/news/:id` - Delete news (admin)

#### Seed Script
- **First News Seed** (`backend/seed-first-news.js`)
  - Seeds the first news article about ML model v1.10.30
  - Run with: `npm run seed:news`

### 2. Frontend Components

#### Components
- **NewsCard** (`frontend/mobile-app/src/components/NewsCard.js`)
  - Full card view with gradient backgrounds
  - Compact card view for lists
  - Category-specific icons and colors
  - Displays version info, date, views
  - "NEW" badge for recent news
  - Pin indicator for important news

- **NewsModal** (`frontend/mobile-app/src/components/NewsModal.js`)
  - Full-screen modal for reading news
  - Markdown support for rich content
  - Auto-marks as read after 2 seconds
  - Shows metadata and improvements
  - Tags display
  - Gradient header with category colors

#### Services
- **News Service** (`frontend/mobile-app/src/services/newsService.js`)
  - API integration for all news operations
  - Automatic token management
  - Error handling

#### Home Screen Integration
- News section appears at the top of the Home screen
- Shows latest 5 news articles
- Loads automatically on screen mount
- Loading states and empty states
- News modal opens when card is tapped

### 3. Popup Functionality

#### How It Works
1. When user logs in successfully, welcome alert shows first
2. After welcome alert closes, popup news appears automatically
3. Only shows news from the last 3 days that user hasn't read
4. Shows up to 3 most important popup news (based on priority)
5. News are shown one at a time
6. After closing one popup, the next one appears if available
7. News marked with `display.showAsPopup: true` are included

#### Configuration
In the News model, set these fields for popup behavior:
```javascript
display: {
  showAsPopup: true,     // Enable popup on login
  priority: 10,          // Higher = shown first (0-10)
  isPinned: true,        // Pin to top of news list
  isHighlighted: true    // Highlight in UI
}
```

## Usage

### Creating News (Backend)

Example of creating a new news article:

```javascript
{
  title: "New Feature: Disease Detection",
  description: "AI-powered disease detection now available",
  body: "# New Feature\n\nWe've added disease detection...",
  category: "feature",
  version: {
    appVersion: "1.1.0"
  },
  metadata: {
    improvements: [
      "Detect common gourd diseases",
      "95% accuracy rate",
      "Real-time analysis"
    ],
    affectedPlatforms: ["iOS", "Android"]
  },
  display: {
    isPinned: true,
    showAsPopup: true,
    priority: 9
  },
  status: "published"
}
```

### Viewing News (Mobile App)

Users can:
1. **Home Screen**: Scroll to see latest news cards
2. **Tap Card**: Open full news article in modal
3. **Login Popup**: Important news shown automatically
4. **Auto-Read**: News marked as read after viewing for 2 seconds

## Categories & Their Colors

| Category | Icon | Gradient Colors |
|----------|------|----------------|
| model_update | brain | Purple gradient |
| feature | star-circle | Pink-red gradient |
| bug_fix | bug | Pink-yellow gradient |
| maintenance | hammer-wrench | Cyan-purple gradient |
| announcement | bullhorn | Teal-pink gradient |
| improvement | chart-line | Orange gradient |
| security | shield-check | Red gradient |
| other | information | Primary gradient |

## First News Article

The seeded first news article covers:
- **Title**: First ML Model Release - Ampalaya Bilog v1.10.30
- **Category**: model_update
- **Version**: v1.10.30
- **Dataset**: 2.6GB of Ampalaya Bilog images
- **Content**: 
  - Model details
  - Dataset information
  - Key features
  - Performance notes
  - Future plans
- **Display**: Pinned, highlighted, shown as popup with priority 10

## API Endpoints Usage

### Get All News
```javascript
GET /api/news?limit=10&skip=0&category=model_update
```

### Get Popup News (Authenticated)
```javascript
GET /api/news/user/popup
Headers: { Authorization: 'Bearer <token>' }
```

### Mark as Read (Authenticated)
```javascript
POST /api/news/:id/read
Headers: { Authorization: 'Bearer <token>' }
```

### Search News
```javascript
GET /api/news?search=model&limit=20
```

## Database Schema

Key fields in News model:
- `title` - News headline (required, max 200 chars)
- `description` - Brief summary (required, max 500 chars)
- `body` - Full content with Markdown support (required)
- `category` - One of 8 predefined categories (required)
- `releaseDate` - When news is published (required)
- `display.showAsPopup` - Show on login (boolean)
- `display.priority` - Display order (0-10)
- `engagement.readBy` - Array of users who read it
- `status` - draft/published/archived/scheduled

## Future Enhancements

Potential improvements:
1. ✅ Admin dashboard for managing news
2. ✅ Push notifications for important news
3. ✅ News categories filter in UI
4. ✅ Search functionality for news
5. ✅ User comments on news
6. ✅ Share news feature
7. ✅ News analytics dashboard
8. ✅ Scheduled publishing
9. ✅ Multiple images per news
10. ✅ News translation support

## Testing

1. **Backend**: Start server and test endpoints
   ```bash
   cd backend
   npm run dev
   ```

2. **Seed News**: Create first news article
   ```bash
   npm run seed:news
   ```

3. **Mobile App**: Test news display
   ```bash
   cd frontend/mobile-app
   npm start
   ```

4. **Test Popup**: Login to see popup news

## Notes

- News older than 3 days won't show as popup
- Only unread news appear in popups
- Maximum 3 popup news shown per login
- News are automatically ordered by priority and date
- Markdown rendering requires `react-native-markdown-display` package
- Category colors defined in NewsCard component
