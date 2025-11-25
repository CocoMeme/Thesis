# Admin Web Dashboard - Complete Setup Guide

## Overview

A complete React web application for administering the Gourd Classification System. This dashboard provides full control over users, forum posts, and news articles.

---

## ✅ What Was Created

### Complete Web Application Structure

```
frontend/web-app/
├── src/
│   ├── components/
│   │   ├── Layout.jsx                    # Sidebar navigation layout
│   │   ├── Layout.css
│   │   └── ProtectedRoute.jsx            # Auth guard for routes
│   ├── contexts/
│   │   └── AuthContext.jsx               # Authentication state
│   ├── pages/
│   │   ├── Login.jsx                     # Admin login page
│   │   ├── Login.css
│   │   ├── Dashboard.jsx                 # Statistics & charts
│   │   ├── Dashboard.css
│   │   ├── Users.jsx                     # User management
│   │   ├── Users.css
│   │   ├── Forum.jsx                     # Forum moderation
│   │   ├── Forum.css
│   │   ├── News.jsx                      # News CRUD
│   │   └── News.css
│   ├── services/
│   │   └── api.js                        # All API calls
│   ├── App.jsx                           # Main router
│   ├── main.jsx                          # Entry point
│   └── index.css                         # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd frontend/web-app
npm install
```

This will install:

- React 18
- React Router v6
- Axios
- Recharts (for charts)
- React Toastify (notifications)
- Lucide React (icons)
- Vite (build tool)

### Step 2: Configure API URL (Optional)

Create `.env` file:

```bash
VITE_API_URL=http://192.168.1.40:5000/api
```

Or edit `vite.config.js` if needed.

### Step 3: Start Development Server

```bash
npm run dev
```

Access at: **http://localhost:3000**

### Step 4: Login with Admin Credentials

Use an admin account from your backend:

- Email: admin@example.com
- Password: your admin password
- **Role must be 'admin'** to access dashboard

---

## 📱 Features Implemented

### 1. **Authentication System**

- JWT-based login
- Secure token storage in localStorage
- Auto-redirect to login on 401
- Admin role verification
- Protected routes

### 2. **Dashboard Page**

**Route**: `/dashboard`

Displays:

- **Stat Cards**:
  - Total Users
  - Active Users
  - Inactive Users
  - Forum Posts
- **Charts**:
  - Users by Role (Pie Chart)
  - Users by Provider (Bar Chart)
- **Additional Stats**:
  - User growth (7 days, 30 days)
  - Email verification stats
  - Forum activity breakdown

### 3. **User Management**

**Route**: `/users`

Features:

- **List Users**: Paginated table (20 per page)
- **Search**: By name, email, username
- **Filters**:
  - Role: All, User, Admin, Researcher
  - Status: All, Active, Inactive
- **Actions**:
  - ✅ Activate user
  - ❌ Deactivate user
  - 🗑️ Delete user
- **User Info Displayed**:
  - Avatar, username, full name
  - Email address
  - Role badge
  - Provider (Email/Google/Firebase)
  - Status (Active/Inactive)
  - Join date

### 4. **Forum Management**

**Route**: `/forum`

Features:

- **List Posts**: All forum posts with pagination
- **Filter by Status**:
  - All Posts
  - Active
  - Pending
  - Flagged
  - Archived
- **Post Information**:
  - Title, author, content preview
  - Creation date
  - Status badge
  - Likes & comments count
  - Pin & lock indicators
- **Moderation Actions**:
  - ✅ Approve (for pending posts)
  - ❌ Reject (for pending posts)
  - 📌 Pin/Unpin
  - 🔒 Lock/Unlock
  - 🗑️ Delete

### 5. **News Management**

**Route**: `/news`

Features:

- **Grid View**: Card layout of all news articles
- **Create News**: Modal form with fields:
  - Title (required)
  - Description (required)
  - Content/Body (Markdown supported)
  - Category (Feature, Model Update, Announcement, Tips, General)
  - Status (Published, Draft, Archived)
  - Show as popup (checkbox)
  - Priority (1-10)
- **Edit News**: Same modal pre-filled with existing data
- **Delete News**: Confirmation dialog
- **News Display**:
  - Category & status badges
  - View count
  - Creation date

---

## 🎨 UI/UX Features

### Design System

- **Colors**:
  - Primary: Green (#4CAF50) - matches mobile app
  - Danger: Red (#f44336)
  - Warning: Orange (#ff9800)
  - Success: Green (#4caf50)
- **Components**:
  - Modern card-based design
  - Responsive layout (mobile, tablet, desktop)
  - Clean sidebar navigation
  - Toast notifications for feedback
  - Loading spinners
  - Hover effects & transitions

### Sidebar Navigation

- Fixed left sidebar
- Active route highlighting
- Icons for each section
- User info at bottom
- Logout button

### Responsive Design

- Desktop: Full sidebar + content
- Mobile: Stacked layout
- Adaptive tables and grids
- Touch-friendly buttons

---

## 🔌 API Integration

All API calls are centralized in `src/services/api.js`:

### Authentication Service

```javascript
authService.login(email, password);
authService.logout();
authService.getCurrentUser();
authService.isAuthenticated();
```

### Admin Service

```javascript
// Dashboard
adminService.getDashboard();

// Users
adminService.getAllUsers(params);
adminService.getUserProfile(userId);
adminService.activateUser(userId);
adminService.deactivateUser(userId);
adminService.deleteUser(userId);

// Forum
adminService.getAllForumPosts(params);
adminService.approvePost(postId);
adminService.rejectPost(postId);
adminService.togglePinPost(postId);
adminService.toggleLockPost(postId);
adminService.deleteForumPost(postId);
```

### News Service

```javascript
newsService.getAllNews(params);
newsService.createNews(newsData);
newsService.updateNews(newsId, newsData);
newsService.deleteNews(newsId);
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📦 Production Build

### Build Process

```bash
npm run build
```

Output: `dist/` folder with optimized static files

### Deployment Options

#### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 3: Static Hosting

Upload `dist/` folder to:

- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Any web server (nginx, Apache)

### Environment Variables in Production

Set these in your hosting platform:

```
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🔐 Security

### Implemented Security Features

- ✅ JWT authentication
- ✅ Admin role verification
- ✅ Protected routes
- ✅ Token expiry handling
- ✅ Auto-logout on unauthorized
- ✅ CORS proxy in development

### Production Recommendations

- Use HTTPS for all traffic
- Set secure CORS origins on backend
- Implement rate limiting
- Add request logging
- Use environment variables for sensitive data

---

## 🐛 Troubleshooting

### Can't Access Dashboard

**Problem**: Redirected to login after entering credentials

**Solutions**:

1. Verify user has `role: 'admin'` in database
2. Check browser console for errors
3. Verify backend API is running
4. Check network tab - look for 401/403 responses

### API Connection Failed

**Problem**: "Network Error" or "Failed to fetch"

**Solutions**:

1. Ensure backend is running on configured URL
2. Check `VITE_API_URL` in .env or vite.config.js
3. Verify CORS is enabled on backend
4. Test backend URL in browser: `http://192.168.1.40:5000/api/health`

### Charts Not Displaying

**Problem**: Dashboard charts are empty

**Solutions**:

1. Check if `/api/admin/dashboard` returns data
2. Verify recharts is installed: `npm install recharts`
3. Check browser console for errors

### Build Errors

**Problem**: `npm run build` fails

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Force clean build
npm run build -- --force
```

---

## 📊 Data Flow

### Login Flow

```
1. User enters email + password
2. POST /api/auth/local/login
3. Backend validates & returns JWT token + user object
4. AuthContext verifies role === 'admin'
5. Token stored in localStorage
6. Redirect to /dashboard
```

### API Request Flow

```
1. Component calls service method (e.g., adminService.getAllUsers())
2. Axios interceptor adds Authorization header from localStorage
3. Request sent to backend
4. Backend validates JWT & admin role
5. Response returned to component
6. On 401: Auto-logout & redirect to /login
```

---

## 🎯 Usage Examples

### Creating a News Article

1. Go to **News** page
2. Click **Create News** button
3. Fill in:
   - Title: "New Model Version 1.11.0"
   - Description: "Improved accuracy..."
   - Content: Full article body (Markdown supported)
   - Category: Model Update
   - Status: Published
   - Show as popup: ✓
   - Priority: 8
4. Click **Create**
5. Article appears in grid

### Moderating Forum Posts

1. Go to **Forum** page
2. Filter by status: **Pending**
3. Review post content
4. Click **Approve** to publish
5. Or **Reject** to decline
6. Use **Pin** for important posts
7. Use **Lock** to prevent new comments

### Managing Users

1. Go to **Users** page
2. Use search to find specific user
3. Filter by role or status
4. Click **Deactivate** to suspend access
5. Click **Delete** to remove permanently

---

## 🔄 Integration with Mobile App

The web dashboard and mobile app share the same backend:

### Shared Resources

- User accounts (same database)
- Forum posts (moderated on web, viewed on mobile)
- News articles (created on web, displayed on mobile)

### Admin Actions Impact

- **Deactivate User**: User can't login to mobile app
- **Delete Forum Post**: Post removed from mobile feed
- **Create News**: Appears in mobile app news section
- **Set News as Popup**: Shows in mobile app on login

---

## 📝 Next Steps

### Optional Enhancements

1. **Implement Remaining Admin Features**:

   - User stats viewing
   - Bulk user operations
   - Role changes
   - User suspension with duration

2. **Add More Charts**:

   - User activity timeline
   - Forum engagement metrics
   - News view statistics

3. **Rich Text Editor**:

   - Replace textarea with React Quill for news content
   - WYSIWYG editing

4. **Image Upload**:

   - Add image uploader for news articles
   - Cloudinary integration

5. **Advanced Filters**:
   - Date range pickers
   - Multi-select filters
   - Export to CSV

---

## 🎓 Developer Notes

### State Management

- Uses React Context API for auth
- Local component state for data
- No Redux needed for current scope

### Styling Approach

- CSS Modules (separate .css per component)
- CSS Variables for theming
- Utility classes for common patterns
- Responsive with media queries

### Code Organization

- Services layer abstracts API calls
- Components are self-contained
- Contexts for shared state
- Pages are feature-based

### Performance

- Vite for fast builds
- Code splitting by route
- Lazy loading images
- Pagination for large lists

---

## ✅ Testing Checklist

### Before Deployment

- [ ] Login with admin account works
- [ ] Dashboard displays statistics
- [ ] Users page loads and search works
- [ ] Forum posts load with filters
- [ ] News creation/editing works
- [ ] All actions show toast notifications
- [ ] Logout redirects to login
- [ ] Mobile responsive design works
- [ ] API errors handled gracefully
- [ ] Build completes without errors

---

## 📞 Support

### Common Questions

**Q: Can I use this without the mobile app?**
A: Yes! The web dashboard is standalone and works with just the backend API.

**Q: How do I create the first admin user?**
A: Use the backend to create a user with `role: 'admin'` in MongoDB.

**Q: Can I customize the design?**
A: Yes! Edit the CSS files and CSS variables in `src/index.css`.

**Q: How do I add more features?**
A: Create new pages in `src/pages/`, add routes in `src/App.jsx`, and add API calls in `src/services/api.js`.

---

## 🎉 Completion Status

✅ **Project Structure** - Complete  
✅ **Authentication** - Complete  
✅ **Dashboard** - Complete  
✅ **User Management** - Complete  
✅ **Forum Management** - Complete  
✅ **News Management** - Complete  
✅ **API Integration** - Complete  
✅ **Responsive Design** - Complete  
✅ **Documentation** - Complete

**Status**: Ready for deployment and use!
