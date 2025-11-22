# How to Set Admin Role in Database

## Overview

To access the admin dashboard, you need to manually set a user's role to 'admin' in your MongoDB database.

## Prerequisites

- MongoDB running and accessible
- At least one registered user account in the database
- MongoDB Compass, MongoDB Shell, or similar database tool

---

## Method 1: Using MongoDB Compass (GUI)

### Step 1: Connect to Database

1. Open MongoDB Compass
2. Connect to your database using the connection string from `.env` (MONGODB_URI)

### Step 2: Find the User

1. Navigate to your database (e.g., `gourd-classification`)
2. Open the `users` collection
3. Find the user you want to make an admin

### Step 3: Update the User

1. Click on the user document to edit
2. Find or add the `role` field
3. Set its value to: `"admin"`
4. Ensure `isActive` is set to: `true`
5. Ensure `isEmailVerified` is set to: `true`
6. Click "Update" to save

**Example Document:**

```json
{
  "_id": "ObjectId('...')",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "...",
  "role": "admin", // ← Set this to "admin"
  "isActive": true, // ← Ensure this is true
  "isEmailVerified": true, // ← Ensure this is true
  "provider": "local",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Method 2: Using MongoDB Shell (CLI)

### Step 1: Connect to MongoDB

```bash
mongosh "mongodb://localhost:27017/gourd-classification"
```

### Step 2: Update User to Admin

```javascript
db.users.updateOne(
  { email: "john@example.com" }, // Find user by email
  {
    $set: {
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    },
  }
);
```

**Expected Output:**

```json
{
  "acknowledged": true,
  "matchedCount": 1,
  "modifiedCount": 1
}
```

### Step 3: Verify the Update

```javascript
db.users.findOne(
  { email: "john@example.com" },
  { role: 1, isActive: 1, isEmailVerified: 1 }
);
```

**Expected Output:**

```json
{
  "_id": ObjectId("..."),
  "role": "admin",
  "isActive": true,
  "isEmailVerified": true
}
```

---

## Method 3: Update Multiple Users

If you want to set multiple users as admins:

```javascript
db.users.updateMany(
  {
    email: {
      $in: ["admin1@example.com", "admin2@example.com", "admin3@example.com"],
    },
  },
  {
    $set: {
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    },
  }
);
```

---

## Method 4: Update by Username

If you prefer to find user by username instead of email:

```javascript
db.users.updateOne(
  { username: "johndoe" },
  {
    $set: {
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    },
  }
);
```

---

## Verify Admin Access

After setting the role, verify the user can access admin endpoints:

### 1. Login with Admin Credentials

```bash
POST http://localhost:5000/api/auth/local/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "your-password"
}
```

Save the `accessToken` from the response.

### 2. Access Admin Dashboard

```bash
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "overview": {
      "totalUsers": 10,
      "activeUsers": 8,
      ...
    }
  }
}
```

---

## Troubleshooting

### Issue: "Insufficient permissions"

**Cause:** User role is not set to 'admin'

**Solution:**

```javascript
// Check current role
db.users.findOne({ email: "john@example.com" }, { role: 1 });

// Update to admin if needed
db.users.updateOne({ email: "john@example.com" }, { $set: { role: "admin" } });
```

### Issue: "Account is deactivated"

**Cause:** User's `isActive` field is false

**Solution:**

```javascript
db.users.updateOne({ email: "john@example.com" }, { $set: { isActive: true } });
```

### Issue: "Invalid token"

**Cause:** Token expired or invalid

**Solution:** Login again to get a fresh token

### Issue: User not found in database

**Cause:** User hasn't registered yet

**Solution:**

1. Register through the mobile app or API first
2. Then update the role to 'admin' in the database

---

## Available Roles

The system supports three roles:

| Role         | Access Level    | Description                         |
| ------------ | --------------- | ----------------------------------- |
| `user`       | Basic access    | Regular grower account (default)    |
| `admin`      | Full access     | Admin dashboard and user management |
| `researcher` | Extended access | Research features (if implemented)  |

---

## Security Recommendations

1. **Limit Admin Users**: Only set trusted users as admins
2. **Use Strong Passwords**: Ensure admin accounts have strong passwords
3. **Monitor Admin Actions**: Regularly review admin activity logs
4. **Regular Audits**: Periodically review who has admin access
5. **Remove Inactive Admins**: Remove admin role from users who no longer need it

---

## Quick Reference

**Find all admins:**

```javascript
db.users.find({ role: "admin" }, { email: 1, username: 1, isActive: 1 });
```

**Count admins:**

```javascript
db.users.countDocuments({ role: "admin" });
```

**Revoke admin access:**

```javascript
db.users.updateOne({ email: "john@example.com" }, { $set: { role: "user" } });
```

**List all users with their roles:**

```javascript
db.users.find({}, { email: 1, username: 1, role: 1, isActive: 1 }).pretty();
```

---

## Need Help?

If you encounter issues:

1. Check MongoDB connection is working
2. Verify the user exists in the database
3. Ensure the role is exactly `"admin"` (case-sensitive)
4. Check `isActive` is `true`
5. Try logging in again to get a fresh token
6. Review the complete documentation in `ADMIN_DASHBOARD.md`

---

**Created:** November 22, 2025  
**Status:** ✅ Ready to Use
