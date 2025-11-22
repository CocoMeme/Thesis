# Admin Dashboard Setup Guide

## Quick Setup

### 1. Installation

The admin dashboard is already integrated into your backend. No additional installation required.

### 2. Create Admin User in Database

You need at least one admin user to access the dashboard. Manually insert or update a user in MongoDB:

#### Via MongoDB Shell:

```javascript
// Update existing user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  {
    $set: {
      role: "admin",
      isActive: true,
      isEmailVerified: true,
    },
  }
);

// Or create new admin user (make sure to hash the password first or use the app's registration then update)
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "hashed_password_here", // Use bcrypt to hash
  role: "admin",
  isActive: true,
  isEmailVerified: true,
  firstName: "Admin",
  lastName: "User",
  provider: "local",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

#### Via MongoDB Compass:

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user and edit the document
5. Set `role: "admin"`
6. Set `isActive: true`
7. Set `isEmailVerified: true`
8. Save the changes

### 3. Get Admin Token

Login with your admin credentials:

```bash
POST http://localhost:5000/api/auth/local/login
Content-Type: application/json

{
  "identifier": "admin@example.com",
  "password": "AdminPassword123!"
}
```

Save the returned `accessToken` for use in admin requests.

### 4. Test Admin Dashboard

Test the dashboard overview:

```bash
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## Environment Variables

Make sure these are set in your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=30d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gourd-classification

# Server
PORT=5000
NODE_ENV=development
```

## Testing the Admin Endpoints

### Using Postman

1. **Import Collection**:

   - Import the `Admin_Dashboard_API.postman_collection.json` file
   - Add environment variable `ADMIN_TOKEN`

2. **Set Authorization**:

   - Type: Bearer Token
   - Token: `{{ADMIN_TOKEN}}`

3. **Test Requests**:
   - Dashboard Overview
   - List Users
   - Get User Profile
   - Activate/Deactivate User
   - Update User
   - Change Role
   - Bulk Update

## Common Operations

### 1. View All Active Users

```
GET /api/admin/users?isActive=true&sortBy=createdAt&sortOrder=desc
```

### 2. Search for User

```
GET /api/admin/users?search=john
```

### 3. Filter by Role

```
GET /api/admin/users?role=user&page=1&limit=50
```

### 4. Activate Multiple Users

```
POST /api/admin/users/bulk-update
{
  "userIds": ["ID1", "ID2", "ID3"],
  "action": "activate"
}
```

### 5. Promote User to Researcher

```
PATCH /api/admin/users/:userId/role
{
  "role": "researcher"
}
```

## Security Checklist

- [ ] Admin users created with strong passwords
- [ ] JWT secrets are secure and not exposed
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented
- [ ] Admin actions are logged
- [ ] Regular security audits performed

## Troubleshooting

### Issue: "Insufficient permissions"

**Solution**: Ensure your user has role: 'admin' in the database

### Issue: "Invalid token"

**Solution**: Refresh your token by logging in again

### Issue: "User not found"

**Solution**: Verify the user ID is correct and exists in the database

### Issue: Cannot deactivate own account

**Solution**: This is intentional. Use another admin account or modify user directly in database

## Next Steps

1. ✅ Set user role to 'admin' in database
2. ✅ Login with admin credentials
3. ✅ Test dashboard overview
4. ✅ Test user management endpoints
5. Implement frontend admin dashboard (if needed)
6. Set up audit logging
7. Configure email notifications
8. Implement rate limiting

## Frontend Integration (Optional)

If you want to create a web-based admin dashboard:

### React Example

```javascript
// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/admin";
  const token = localStorage.getItem("adminToken");

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users?page=1&limit=10");
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await api.patch(`/users/${userId}/activate`);
      fetchUsers(); // Refresh list
      alert("User activated successfully");
    } catch (error) {
      console.error("Error activating user:", error);
      alert("Failed to activate user");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await api.patch(`/users/${userId}/deactivate`);
      fetchUsers(); // Refresh list
      alert("User deactivated successfully");
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {dashboardData && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{dashboardData.overview.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{dashboardData.overview.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>New Users (30 days)</h3>
            <p>{dashboardData.overview.newUsers30Days}</p>
          </div>
        </div>
      )}

      <div className="users-list">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Active" : "Inactive"}</td>
                <td>
                  {user.isActive ? (
                    <button onClick={() => handleDeactivateUser(user._id)}>
                      Deactivate
                    </button>
                  ) : (
                    <button onClick={() => handleActivateUser(user._id)}>
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

## API Reference

For detailed API documentation, see [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)

## Support

For issues or questions, please check:

- Main documentation
- Backend logs
- MongoDB connection status
- JWT token validity
