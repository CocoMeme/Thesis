# Admin Dashboard - Quick Reference

## 🚀 Quick Start

### 1. Set Admin Role in Database

Update a user's role to 'admin' in MongoDB:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isActive: true, isEmailVerified: true } }
);
```

### 2. Login as Admin

```bash
POST /api/auth/local/login
{
  "identifier": "admin@example.com",
  "password": "your-password"
}
```

### 3. Access Dashboard

```bash
GET /api/admin/dashboard
Authorization: Bearer YOUR_TOKEN
```

## 📋 Key Features

### ✅ User Management

- View all user profiles
- Activate/Deactivate accounts
- Suspend accounts temporarily
- Delete accounts (soft/hard)
- Change user roles
- Bulk operations
- Search and filter users
- View user statistics

### ✅ Dashboard Overview

- Total users count
- Active/Inactive users
- Verified/Unverified users
- New users (7/30 days)
- Users by role
- Users by provider
- Recent registrations

## 🔑 API Endpoints Summary

| Method | Endpoint                              | Description                |
| ------ | ------------------------------------- | -------------------------- |
| GET    | `/api/admin/dashboard`                | Dashboard overview         |
| GET    | `/api/admin/users`                    | List all users (paginated) |
| GET    | `/api/admin/users/:userId`            | Get user profile           |
| PUT    | `/api/admin/users/:userId`            | Update user details        |
| PATCH  | `/api/admin/users/:userId/activate`   | Activate user              |
| PATCH  | `/api/admin/users/:userId/deactivate` | Deactivate user            |
| PATCH  | `/api/admin/users/:userId/suspend`    | Suspend user               |
| DELETE | `/api/admin/users/:userId`            | Delete user                |
| PATCH  | `/api/admin/users/:userId/role`       | Change user role           |
| GET    | `/api/admin/users/:userId/stats`      | Get user stats             |
| POST   | `/api/admin/users/bulk-update`        | Bulk update users          |

## 🔍 Common Queries

### Search Users

```
GET /api/admin/users?search=john
```

### Filter Active Users

```
GET /api/admin/users?isActive=true
```

### Filter by Role

```
GET /api/admin/users?role=user
```

### Sort by Date

```
GET /api/admin/users?sortBy=createdAt&sortOrder=desc
```

### Pagination

```
GET /api/admin/users?page=1&limit=20
```

## 🎯 Common Operations

### Activate User

```bash
PATCH /api/admin/users/:userId/activate
```

### Deactivate User

```bash
PATCH /api/admin/users/:userId/deactivate
Content-Type: application/json

{
  "reason": "Policy violation"
}
```

### Change Role

```bash
PATCH /api/admin/users/:userId/role
Content-Type: application/json

{
  "role": "researcher"
}
```

### Bulk Activate

```bash
POST /api/admin/users/bulk-update
Content-Type: application/json

{
  "userIds": ["id1", "id2", "id3"],
  "action": "activate"
}
```

## 🛡️ Security Notes

- All endpoints require authentication
- All endpoints require admin role
- Admins cannot modify their own accounts
- JWT tokens expire after 7 days (default)
- Refresh tokens expire after 30 days (default)

## 📦 Files Created

```
backend/
├── src/
│   ├── controllers/
│   │   └── adminController.js       # Admin business logic
│   ├── routes/
│   │   └── admin.js                 # Admin routes
│   └── middleware/
│       └── validation.js            # Updated with admin validations
├── scripts/
│   └── createAdmin.js               # Admin user creation script
└── docs/
    ├── ADMIN_DASHBOARD.md           # Complete documentation
    ├── ADMIN_SETUP.md               # Setup guide
    ├── ADMIN_QUICK_REF.md           # This file
    └── Admin_Dashboard_API.postman_collection.json
```

## 🧪 Testing

### Import Postman Collection

1. Open Postman
2. Import `Admin_Dashboard_API.postman_collection.json`
3. Set `ADMIN_TOKEN` variable
4. Test all endpoints

### Manual Testing

```bash
# 1. Start server
npm start

# 2. Login
curl -X POST http://localhost:5000/api/auth/local/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@example.com","password":"your-password"}'

# 3. Get dashboard
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📖 Documentation

- **Complete Guide**: [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)
- **Setup Guide**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Postman Collection**: [Admin_Dashboard_API.postman_collection.json](./Admin_Dashboard_API.postman_collection.json)

## 🐛 Troubleshooting

| Issue                      | Solution                      |
| -------------------------- | ----------------------------- |
| "Insufficient permissions" | Ensure user role is 'admin'   |
| "Invalid token"            | Login again to get new token  |
| "User not found"           | Verify user ID exists         |
| Can't modify own account   | Use another admin or database |

## 📞 Support

For detailed information, see the complete documentation in `ADMIN_DASHBOARD.md`.

---

**Created**: November 22, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
