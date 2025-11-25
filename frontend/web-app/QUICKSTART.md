# Quick Start Guide - Admin Web Dashboard

## Prerequisites
- Node.js 18+ installed
- Backend API running (default: http://192.168.1.40:5000)

## Installation (5 minutes)

### 1. Navigate to directory
```bash
cd frontend/web-app
```

### 2. Install dependencies
```bash
npm install
```

This installs: React, React Router, Axios, Recharts, React Toastify, Lucide Icons, Vite

### 3. Start development server
```bash
npm run dev
```

Access at: **http://localhost:3000**

## First Login

1. Open http://localhost:3000/login
2. Enter admin credentials:
   - Email: your admin email
   - Password: your admin password
3. Must have `role: 'admin'` in database

## Pages Available

- **Dashboard** (`/dashboard`) - Statistics & charts
- **Users** (`/users`) - User management
- **Forum** (`/forum`) - Forum moderation
- **News** (`/news`) - News articles

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code
npm run format           # Format code
```

## Configuration

### Change API URL

Edit `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://YOUR_BACKEND_IP:5000',
      changeOrigin: true
    }
  }
}
```

Or create `.env`:
```
VITE_API_URL=http://YOUR_BACKEND_IP:5000/api
```

## Troubleshooting

### Can't login?
- Verify backend is running
- Check user has `role: 'admin'`
- Check browser console for errors

### API not connecting?
- Verify backend URL in vite.config.js
- Ensure backend allows CORS from localhost:3000
- Test backend: http://192.168.1.40:5000/api/health

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
```

## Features Overview

### Dashboard
- User statistics
- Role distribution chart
- Provider distribution chart
- Forum activity stats

### User Management
- List all users (paginated)
- Search by name/email/username
- Filter by role & status
- Activate/deactivate/delete users

### Forum Management
- List all posts
- Filter by status
- Approve/reject pending posts
- Pin/unpin important posts
- Lock/unlock comments
- Delete posts

### News Management
- Create news articles
- Edit existing articles
- Delete articles
- Set categories & status
- Configure popup display
- Markdown support

## Production Deployment

```bash
# Build
npm run build

# Output in dist/ folder
# Deploy to Vercel, Netlify, or any static host
```

## Next Steps

1. ✅ Login with admin account
2. ✅ Explore dashboard
3. ✅ Try user management
4. ✅ Test forum moderation
5. ✅ Create a news article

## Full Documentation

See `/docs/WEB_ADMIN_DASHBOARD_COMPLETE.md` for comprehensive guide.

---

**Status**: ✅ Ready to use!
