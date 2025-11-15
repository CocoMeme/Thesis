# Community Forum Feature - Complete Implementation

## Overview
The Community Forum feature enables users to share knowledge, ask questions, showcase harvests, and discuss gourd growing topics. The feature includes full backend infrastructure with MongoDB storage and frontend React Native screens.

## Backend Components

### 1. Database Model (`backend/src/models/ForumPost.js`)

**Schema Definition:**
```javascript
{
  author: ObjectId (ref: User),
  category: enum ['tips', 'questions', 'showcase', 'discussion'],
  title: String (required, 5-100 chars),
  content: String (required, 10-2000 chars),
  image: { url, publicId },
  tags: [String] (max 5, lowercase),
  likes: [ObjectId (ref: User)],
  comments: [{
    user: ObjectId (ref: User),
    content: String,
    likes: [ObjectId (ref: User)],
    createdAt: Date
  }],
  views: Number (default: 0),
  isPinned: Boolean (default: false),
  isLocked: Boolean (default: false),
  status: enum ['active', 'deleted', 'hidden'] (default: 'active')
}
```

**Indexes:**
- author, category, tags, createdAt (for filtering/sorting)
- likes.user (for quick like checks)

**Virtual Methods:**
- `likeCount` - Returns number of likes
- `commentCount` - Returns number of comments

**Instance Methods:**
- `isLikedByUser(userId)` - Check if user liked the post
- `getRelativeTime()` - Human-readable time (e.g., "2 hours ago")

### 2. Controller (`backend/src/controllers/forumController.js`)

**Endpoints:**

1. **getAllPosts** (`GET /api/forum/posts`)
   - Query params: category, search, tags, sortBy, page, limit
   - Supports filtering by category and tags
   - Full-text search on title and content
   - Sorting: recent, popular, mostCommented, views
   - Pagination with skip/limit
   - Returns formatted posts with relative timestamps

2. **getPostById** (`GET /api/forum/posts/:id`)
   - Increments view count
   - Populates author and comments.user
   - Returns single post with full details

3. **createPost** (`POST /api/forum/posts`)
   - Protected route (requires authentication)
   - Validates category, title, content
   - Normalizes tags to lowercase
   - Returns newly created post

4. **updatePost** (`PUT /api/forum/posts/:id`)
   - Protected route
   - Only post author can update
   - Updates title, content, category, tags, image

5. **deletePost** (`DELETE /api/forum/posts/:id`)
   - Protected route
   - Only post author can delete
   - Soft delete (sets status to 'deleted')

6. **toggleLike** (`POST /api/forum/posts/:id/like`)
   - Protected route
   - Adds/removes user from likes array
   - Returns updated post

7. **addComment** (`POST /api/forum/posts/:id/comments`)
   - Protected route
   - Validates post is not locked
   - Adds comment with user reference

8. **getPopularTopics** (`GET /api/forum/topics/popular`)
   - Returns most used tags with counts
   - Aggregates across all active posts
   - Supports limit parameter

### 3. Routes (`backend/src/routes/forum.js`)

**Public Routes:**
- `GET /posts` - List all posts
- `GET /posts/:id` - Get single post
- `GET /topics/popular` - Get popular tags

**Protected Routes (require authentication):**
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like/unlike post
- `POST /posts/:id/comments` - Add comment

**Integration:**
Added to `backend/src/app.js`:
```javascript
this.app.use('/api/forum', require('./routes/forum'));
```

## Frontend Components

### 1. Service Layer (`frontend/mobile-app/src/services/forumService.js`)

**Functions:**
- `getAllPosts(params)` - Fetch posts with filters
- `getPostById(postId)` - Get single post
- `createPost(postData)` - Create new post
- `updatePost(postId, updateData)` - Update existing post
- `deletePost(postId)` - Delete post
- `toggleLike(postId)` - Like/unlike post
- `addComment(postId, content)` - Add comment
- `getPopularTopics(limit)` - Get popular tags

**Features:**
- Automatic auth token handling from AsyncStorage
- Consistent response format with success/error handling
- Query parameter building for filters
- Error logging and user-friendly messages

### 2. Community Screen (`frontend/mobile-app/src/screens/CommunityScreen.js`)

**Features:**
- Category filters (All, Tips, Q&A, Showcase, Discussion)
- Search functionality with 500ms debounce
- Pull-to-refresh support
- Popular topics grid (from backend aggregation)
- Post cards with:
  - Author info and avatar
  - Category badge with color coding
  - Title and content preview
  - Tags display
  - Like, comment, view counts
  - Interactive like button
- Loading and error states
- Empty state with "Create Post" prompt
- Floating action button for quick post creation

**State Management:**
- `posts` - Array of forum posts from backend
- `popularTopics` - Top tags from backend
- `selectedCategory` - Current filter
- `searchQuery` - Search input
- `loading` - Initial load state
- `refreshing` - Pull-to-refresh state
- `error` - Error message display

**API Integration:**
- Fetches posts on mount and category change
- Debounced search on query input
- Refresh on pull-to-refresh gesture
- Optimistic UI update for likes

### 3. Create Post Screen (`frontend/mobile-app/src/screens/CreatePostScreen.js`)

**Features:**
- Category selection with visual cards (4 categories)
- Title input (5-100 characters)
- Content textarea (10-2000 characters)
- Tags input (comma-separated, max 5)
- Character counters for title and content
- Tag preview chips as user types
- Form validation with alerts
- Loading state during submission
- Success callback to refresh parent screen
- Community guidelines reminder

**Validation:**
- Title: Required, min 5 chars, max 100 chars
- Content: Required, min 10 chars, max 2000 chars
- Category: Required (pre-selected)
- Tags: Optional, max 5, auto-lowercase

**UX Features:**
- KeyboardAvoidingView for mobile keyboards
- Character count indicators
- Visual category selection with icons
- Real-time tag preview
- Disabled submit during loading

## Navigation Integration

**HomeStack Navigator:**
```javascript
<Stack.Screen name="Community" component={CommunityScreen} />
<Stack.Screen name="CreatePost" component={CreatePostScreen} />
```

**Access Points:**
1. Educational Screen → "Join Community" button
2. Home Screen → Quick Tools → "Community" icon
3. Home Screen → Drawer Menu → "Community Forum"

**Navigation Flow:**
```
Educational → Community → CreatePost → [Back to Community]
Home → Community → CreatePost → [Back to Community]
```

## Data Flow

### Creating a Post
1. User taps FAB or header "+" button in CommunityScreen
2. Navigate to CreatePostScreen
3. User fills form (category, title, content, tags)
4. Submit triggers validation
5. forumService.createPost() sends POST to backend
6. Backend validates, saves to MongoDB
7. Success alert shown, navigate back to Community
8. onPostCreated callback refreshes post list

### Viewing Posts
1. CommunityScreen mounts
2. useEffect calls fetchPosts()
3. forumService.getAllPosts() sends GET to backend
4. Backend queries MongoDB with filters
5. Posts returned with populated author/comments
6. State updated, UI renders post cards
7. Popular topics fetched separately and displayed

### Liking a Post
1. User taps heart icon on post card
2. handleLikePost() called with postId
3. forumService.toggleLike() sends POST to backend
4. Backend adds/removes user from likes array
5. Updated post returned
6. Local state updated with new data
7. UI immediately reflects like status

### Searching/Filtering
1. User types in search box or selects category
2. Debounce timer (500ms) for search input
3. fetchPosts() called with new params
4. Backend performs text search and category filter
5. Filtered results returned
6. UI updates with filtered posts

## Styling & Theme

**Color Coding by Category:**
- Tips: `theme.colors.success` (green)
- Questions: `theme.colors.info` (blue)
- Showcase: `theme.colors.warning` (orange)
- Discussion: `theme.colors.primary` (app primary)

**Key Components:**
- Post cards: White surface with subtle border
- Category chips: Colored background (20% opacity) with colored text
- Tags: Light background with primary color text
- FAB: Primary color circle with white plus icon
- Search bar: Surface background with secondary border

## Testing Checklist

### Backend
- [ ] Create post with all fields
- [ ] Create post with minimal fields (no tags/image)
- [ ] Get all posts without filters
- [ ] Filter by category
- [ ] Search by keyword in title/content
- [ ] Sort by different criteria
- [ ] Pagination with skip/limit
- [ ] Like/unlike post
- [ ] Add comment to post
- [ ] Update own post
- [ ] Try to update other user's post (should fail)
- [ ] Delete own post
- [ ] Get popular topics
- [ ] View count increments on getPostById

### Frontend
- [ ] Posts load on screen mount
- [ ] Category filters work
- [ ] Search filters posts with debounce
- [ ] Pull-to-refresh reloads data
- [ ] Like button toggles state
- [ ] Create post navigation works
- [ ] Form validation catches errors
- [ ] Character counters update
- [ ] Tag preview displays correctly
- [ ] Submit creates post successfully
- [ ] Loading states display properly
- [ ] Error states show retry option
- [ ] Empty state displays when no posts

## Future Enhancements

### Phase 2 (Recommended)
1. **Post Detail Screen**
   - Full post view with all comments
   - Comment threads with replies
   - Like individual comments
   - Share post functionality

2. **Image Upload**
   - Cloudinary integration for post images
   - Image picker from camera/gallery
   - Image preview before upload

3. **User Profiles**
   - View user's post history
   - User reputation/badges system
   - Follow/unfollow users

4. **Advanced Features**
   - Pin important posts (admin only)
   - Lock posts to prevent comments
   - Report inappropriate content
   - Bookmark/save posts
   - Push notifications for replies

5. **Analytics**
   - Track post engagement metrics
   - Popular topics over time
   - User activity statistics

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/forum/posts` | No | Get all posts with filters |
| GET | `/api/forum/posts/:id` | No | Get single post by ID |
| GET | `/api/forum/topics/popular` | No | Get popular tags |
| POST | `/api/forum/posts` | Yes | Create new post |
| PUT | `/api/forum/posts/:id` | Yes | Update post (author only) |
| DELETE | `/api/forum/posts/:id` | Yes | Delete post (author only) |
| POST | `/api/forum/posts/:id/like` | Yes | Toggle like on post |
| POST | `/api/forum/posts/:id/comments` | Yes | Add comment to post |

## Files Created/Modified

### Created Files
1. `backend/src/models/ForumPost.js` - MongoDB model
2. `backend/src/controllers/forumController.js` - Business logic
3. `backend/src/routes/forum.js` - API routes
4. `frontend/mobile-app/src/services/forumService.js` - API client
5. `frontend/mobile-app/src/screens/CommunityScreen.js` - Main forum screen
6. `frontend/mobile-app/src/screens/CreatePostScreen.js` - Post creation screen

### Modified Files
1. `backend/src/models/index.js` - Added ForumPost export
2. `backend/src/app.js` - Added forum routes
3. `frontend/mobile-app/src/services/index.js` - Added forumService export
4. `frontend/mobile-app/src/screens/index.js` - Added screen exports
5. `frontend/mobile-app/src/navigation/AppNavigator.js` - Added screen navigation

## Environment Variables
No additional environment variables needed. Uses existing:
- `MONGODB_URI` - Database connection
- JWT secret for authentication
- Cloudinary config (for future image uploads)

## Dependencies
Uses existing dependencies:
- Backend: mongoose, express, jsonwebtoken
- Frontend: @react-navigation, axios, @react-native-async-storage/async-storage

## Notes
- All posts have soft delete (status field) to preserve data
- Views auto-increment on post detail view
- Tags are auto-normalized to lowercase
- Comments support nested likes for future expansion
- Popular topics aggregation is efficient with MongoDB indexes
- Search uses MongoDB text indexes for performance
