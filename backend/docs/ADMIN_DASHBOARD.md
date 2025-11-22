# Admin Dashboard Documentation

## Overview

The Admin Dashboard provides comprehensive user management capabilities for administrators to manage all registered grower accounts. This includes viewing user profiles, activating/deactivating accounts, and performing bulk operations.

## Features

### 1. Dashboard Overview

Get a comprehensive overview of the application with key statistics and metrics.

### 2. User Management

- **View User Profiles** - Access all registered grower accounts
- **Activate/Deactivate Accounts** - Approve, suspend, or delete user accounts
- **Update User Details** - Modify user information
- **Change User Roles** - Assign roles (user, admin, researcher)
- **Bulk Operations** - Perform actions on multiple users simultaneously
- **User Statistics** - View detailed activity statistics for each user

## API Endpoints

All admin endpoints require authentication and admin role.

### Dashboard

#### Get Dashboard Overview

```
GET /api/admin/dashboard
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "overview": {
      "totalUsers": 150,
      "activeUsers": 140,
      "inactiveUsers": 10,
      "verifiedUsers": 120,
      "unverifiedUsers": 30,
      "newUsers30Days": 25,
      "newUsers7Days": 8
    },
    "usersByRole": {
      "user": 140,
      "admin": 5,
      "researcher": 5
    },
    "usersByProvider": {
      "local": 100,
      "google": 50
    },
    "recentRegistrations": [...]
  }
}
```

### User Management

#### Get All Users

```
GET /api/admin/users
```

**Query Parameters:**

- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `search` (string) - Search by username, email, firstName, or lastName
- `role` (string) - Filter by role: user, admin, researcher
- `provider` (string) - Filter by provider: local, google
- `isActive` (boolean) - Filter by active status
- `isEmailVerified` (boolean) - Filter by email verification status
- `sortBy` (string) - Sort field (default: createdAt)
- `sortOrder` (string) - Sort order: asc, desc (default: desc)

**Example:**

```
GET /api/admin/users?page=1&limit=20&search=john&role=user&isActive=true&sortBy=createdAt&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalUsers": 150,
      "usersPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Get User Profile

```
GET /api/admin/users/:userId
```

**Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "isEmailVerified": true,
      "provider": "local",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "lastLogin": "2024-11-20T15:45:00.000Z",
      "loginCount": 45,
      "stats": {...}
    }
  }
}
```

#### Update User Details

```
PUT /api/admin/users/:userId
```

**Request Body:**

```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "researcher",
  "isActive": true,
  "isEmailVerified": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {...}
  }
}
```

#### Activate User Account

```
PATCH /api/admin/users/:userId/activate
```

**Response:**

```json
{
  "success": true,
  "message": "User account activated successfully",
  "data": {
    "user": {...}
  }
}
```

#### Deactivate User Account

```
PATCH /api/admin/users/:userId/deactivate
```

**Request Body (Optional):**

```json
{
  "reason": "Policy violation"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User account deactivated successfully",
  "data": {
    "user": {...}
  }
}
```

#### Suspend User Account

```
PATCH /api/admin/users/:userId/suspend
```

**Request Body:**

```json
{
  "reason": "Temporary suspension due to investigation",
  "duration": 30
}
```

- `duration` (optional): Number of days to suspend (omit for indefinite)

**Response:**

```json
{
  "success": true,
  "message": "User account suspended until 2024-12-22T10:30:00.000Z",
  "data": {
    "user": {...}
  }
}
```

#### Delete User Account

```
DELETE /api/admin/users/:userId?permanent=false
```

**Query Parameters:**

- `permanent` (boolean) - true for hard delete, false for soft delete (default: false)

**Response:**

```json
{
  "success": true,
  "message": "User account deleted (soft delete)",
  "data": {
    "user": {...}
  }
}
```

#### Change User Role

```
PATCH /api/admin/users/:userId/role
```

**Request Body:**

```json
{
  "role": "admin"
}
```

- Valid roles: user, admin, researcher

**Response:**

```json
{
  "success": true,
  "message": "User role changed to admin successfully",
  "data": {
    "user": {...}
  }
}
```

#### Get User Statistics

```
GET /api/admin/users/:userId/stats
```

**Response:**

```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "stats": {
      "totalScans": 45,
      "totalGourdsDetected": 123,
      "accurateScans": 40,
      "lastScanDate": "2024-11-20T15:45:00.000Z"
    },
    "loginCount": 78,
    "lastLogin": "2024-11-20T15:45:00.000Z",
    "memberSince": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Bulk Update Users

```
POST /api/admin/users/bulk-update
```

**Request Body:**

```json
{
  "userIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ],
  "action": "activate",
  "value": "admin"
}
```

**Available Actions:**

- `activate` - Activate multiple users
- `deactivate` - Deactivate multiple users
- `changeRole` - Change role for multiple users (requires `value` field)
- `verifyEmail` - Mark emails as verified for multiple users

**Response:**

```json
{
  "success": true,
  "message": "Users activated successfully",
  "data": {
    "modifiedCount": 3,
    "matchedCount": 3
  }
}
```

## Authentication

All admin endpoints require:

1. Valid JWT token in Authorization header
2. User must have `admin` role

**Authorization Header:**

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

### 401 Unauthorized

```json
{
  "status": "error",
  "message": "Access denied. No token provided.",
  "code": "NO_TOKEN"
}
```

### 403 Forbidden

```json
{
  "status": "error",
  "message": "Insufficient permissions",
  "code": "INSUFFICIENT_PERMISSIONS",
  "required": ["admin"],
  "current": "user"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid user ID format"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to retrieve users",
  "error": "Error details"
}
```

## Security Considerations

1. **Self-Protection**: Admins cannot:

   - Deactivate their own account
   - Delete their own account
   - Change their own role
   - Include themselves in bulk operations

2. **Token Revocation**: When deactivating a user, all their refresh tokens are revoked

3. **Audit Trail**: Consider implementing logging for all admin actions

4. **Rate Limiting**: Implement rate limiting on admin endpoints to prevent abuse

## Best Practices

1. **Pagination**: Always use pagination when fetching large datasets
2. **Search & Filter**: Use search and filter parameters to narrow results
3. **Bulk Operations**: Use bulk operations for efficiency when updating multiple users
4. **Soft Delete**: Use soft delete (default) instead of permanent delete for data recovery
5. **Suspension vs Deactivation**:
   - Use suspension for temporary account restrictions
   - Use deactivation for permanent account restrictions
   - Use delete for complete removal

## Usage Examples

### Example 1: Get Active Users Only

```bash
curl -X GET "http://localhost:5000/api/admin/users?isActive=true&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 2: Search for Users

```bash
curl -X GET "http://localhost:5000/api/admin/users?search=john&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Deactivate User

```bash
curl -X PATCH "http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011/deactivate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Policy violation"}'
```

### Example 4: Bulk Activate Users

```bash
curl -X POST "http://localhost:5000/api/admin/users/bulk-update" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "action": "activate"
  }'
```

### Example 5: Change User Role

```bash
curl -X PATCH "http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011/role" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "researcher"}'
```

## Testing with Postman

1. **Set Environment Variables**:

   - `BASE_URL`: http://localhost:5000
   - `ADMIN_TOKEN`: Your admin JWT token

2. **Create Collection**: Import all endpoints
3. **Set Authorization**: Add Bearer token to collection
4. **Test Each Endpoint**: Verify responses

## Future Enhancements

1. **Activity Logs**: Track all admin actions
2. **Email Notifications**: Notify users of account changes
3. **Advanced Analytics**: More detailed user behavior analytics
4. **Export Data**: Export user data to CSV/Excel
5. **Automated Actions**: Schedule automated tasks
6. **Role Permissions**: Fine-grained permission system
7. **User Impersonation**: Allow admins to view as user (with audit)

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
