# Gourd Classification System - Admin Web Dashboard

A React-based web admin dashboard for managing the Gourd Classification System.

## Features

- **Dashboard Overview**: View statistics and system metrics
- **User Management**: List, activate, deactivate, suspend, and delete users
- **Forum Management**: Moderate posts, approve/reject, pin, lock, and delete
- **News Management**: Create, edit, and delete news articles
- **Authentication**: Secure login with JWT tokens (admin role required)

## Prerequisites

- Node.js 18+ installed
- Backend API running on http://192.168.1.40:5000 (or configure your API URL)

## Installation

1. Navigate to the web-app directory:
```bash
cd frontend/web-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to backend at 192.168.1.40:5000):
```bash
cp .env.example .env
```

Edit `.env` if needed:
```
VITE_API_URL=http://192.168.1.40:5000/api
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Building for Production

Build the production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Admin Login

To access the dashboard, you need an admin account:

1. Go to http://localhost:3000/login
2. Enter your admin credentials (email and password)
3. Only users with `role: 'admin'` can access the dashboard

### Creating an Admin User

If you don't have an admin user, create one via backend:

```javascript
// In MongoDB or via backend script
{
  email: "admin@example.com",
  password: "hashed_password",
  role: "admin",
  isActive: true,
  provider: "local"
}
```

## Features Guide

### Dashboard
- View total users, active users, inactive users
- See user distribution by role and provider
- Monitor forum activity and verification stats
- View user growth charts

### User Management
- **List Users**: Paginated table with search and filters
- **Search**: By name, email, or username
- **Filters**: By role (user/admin/researcher) and status (active/inactive)
- **Actions**:
  - Activate/Deactivate users
  - Delete users
  - View user details

### Forum Management
- **List Posts**: View all forum posts with status
- **Filter**: By status (active/pending/flagged/archived)
- **Actions**:
  - Approve/Reject pending posts
  - Pin/Unpin important posts
  - Lock/Unlock posts to prevent comments
  - Delete posts

### News Management
- **List News**: Grid view of all news articles
- **Create**: Add new articles with title, description, content
- **Edit**: Modify existing articles
- **Delete**: Remove articles
- **Categories**: Feature, Model Update, Announcement, Tips, General
- **Status**: Published, Draft, Archived
- **Popup Options**: Set priority and popup display

## Tech Stack

- **React 18**: UI library
- **React Router v6**: Routing
- **Axios**: HTTP client
- **Recharts**: Charts and data visualization
- **React Toastify**: Toast notifications
- **Lucide React**: Icons
- **Vite**: Build tool

## API Integration

The web app communicates with the backend via REST API:

### Authentication
- `POST /api/auth/local/login` - Admin login

### Dashboard
- `GET /api/admin/dashboard` - Overview statistics

### Users
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/:userId` - Get user details
- `PATCH /api/admin/users/:userId/activate` - Activate user
- `PATCH /api/admin/users/:userId/deactivate` - Deactivate user
- `DELETE /api/admin/users/:userId` - Delete user

### Forum
- `GET /api/admin/forum/posts` - List all posts
- `PATCH /api/admin/forum/posts/:postId/approve` - Approve post
- `PATCH /api/admin/forum/posts/:postId/reject` - Reject post
- `PATCH /api/admin/forum/posts/:postId/pin` - Pin/unpin post
- `PATCH /api/admin/forum/posts/:postId/lock` - Lock/unlock post
- `DELETE /api/admin/forum/posts/:postId` - Delete post

### News
- `GET /api/news` - List all news
- `POST /api/news` - Create news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article

## File Structure

```
frontend/web-app/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout with sidebar
│   │   ├── Layout.css
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── contexts/
│   │   └── AuthContext.jsx         # Auth state management
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Login.css
│   │   ├── Dashboard.jsx           # Dashboard overview
│   │   ├── Dashboard.css
│   │   ├── Users.jsx               # User management
│   │   ├── Users.css
│   │   ├── Forum.jsx               # Forum moderation
│   │   ├── Forum.css
│   │   ├── News.jsx                # News management
│   │   └── News.css
│   ├── services/
│   │   └── api.js                  # API client & services
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Troubleshooting

### Can't login
- Ensure backend is running
- Check API_BASE_URL in .env or vite.config.js
- Verify you have admin role in database
- Check browser console for errors

### API errors
- Verify backend API is accessible at configured URL
- Check network tab in browser dev tools
- Ensure CORS is enabled on backend for your domain

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `npm run dev -- --force`
- Ensure Node.js version is 18 or higher

## Development Tips

- **Hot Reload**: Changes to files trigger automatic reload
- **API Proxy**: Vite proxies `/api` requests to backend in development
- **State Management**: Uses React Context for auth state
- **Form Validation**: Native HTML5 validation + custom checks

## Production Deployment

1. Build the production bundle:
```bash
npm run build
```

2. The `dist/` folder contains static files ready to deploy

3. Deploy to any static hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Any web server (nginx, Apache)

4. Configure environment variables on your hosting platform

## Security Notes

- Admin authentication required for all routes
- JWT tokens stored in localStorage
- Auto-logout on 401 responses
- HTTPS recommended for production
- Keep API URL secure

## License

Part of the Gourd Classification System thesis project.
