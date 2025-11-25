# User Management System Update

## Overview

Updated the user management system with enhanced deactivation features, role management limited to guest/user, and implemented soft delete functionality.

## Changes Made

### 1. Backend Updates

#### User Model (`backend/src/models/User.js`)

- **Role System**: Changed from `['user', 'admin', 'researcher']` to `['guest', 'user']`
  - Default role is now `'guest'`
  - Simplified role hierarchy for better management
- **Soft Delete Fields**: Added new fields for tracking deletions
  ```javascript
  deletedAt: {
    type: Date,
    default: null
  },
  deactivationReason: {
    type: String,
    default: null
  }
  ```

#### Admin Controller (`backend/src/controllers/adminController.js`)

**Fixed: deactivateUser Function**

- **Issue**: TypeError when accessing `refreshTokens` property
- **Solution**: Retrieve user first, then update and save
- **Changes**:
  - Fetch user with `User.findById()` instead of `findByIdAndUpdate()`
  - Check if `refreshTokens` exists before iterating
  - Manually update fields and save
  - Return sanitized user object without sensitive fields

**Updated: deleteUser Function**

- **Changed to Soft Delete**: No longer removes users from database
- **Behavior**:
  - Sets `deletedAt` timestamp
  - Sets `isActive` to `false`
  - Revokes all refresh tokens
  - User data remains in database for audit/recovery
  - Removed hard delete option

**Updated: changeUserRole Function**

- **Role Validation**: Only accepts `'guest'` and `'user'` roles
- **Removed**: Admin self-protection check (no more admin role)
- **Simplified**: Direct role change between guest and user

### 2. Frontend Updates

#### API Service (`frontend/web-app/src/services/api.js`)

- **deactivateUser**: Updated to accept optional `data` parameter for reason
  ```javascript
  deactivateUser: async (userId, data = {}) => {
    return await api.patch(`/admin/users/${userId}/deactivate`, data);
  };
  ```

#### Users Page (`frontend/web-app/src/pages/Users.jsx`)

**New Features**:

1. **Deactivation Modal**

   - Optional reason textarea
   - Confirmation before deactivating
   - Clean UI with cancel/confirm actions

2. **Role Change Modal**

   - Inline role badge click to open modal
   - Dropdown to select guest or user
   - Disabled save button if role unchanged
   - Confirmation before changing

3. **Updated Filter**
   - Changed from "All Roles/User/Admin/Researcher"
   - To "All Roles/Guest/User"

**New State Variables**:

```javascript
const [deactivateModal, setDeactivateModal] = useState({
  show: false,
  userId: null,
});
const [deactivateReason, setDeactivateReason] = useState("");
const [roleChangeModal, setRoleChangeModal] = useState({
  show: false,
  userId: null,
  currentRole: "",
});
const [newRole, setNewRole] = useState("");
```

#### Styles (`frontend/web-app/src/pages/Users.css`)

- Added modal overlay and content styles
- Added form group styles for modals
- Added `badge-guest` style (orange theme)
- Made modals responsive for mobile

## API Endpoints

### Deactivate User

```
PATCH /api/admin/users/:userId/deactivate
Body: { reason?: string }
```

- Sets `isActive: false`
- Revokes all refresh tokens
- Stores optional deactivation reason

### Delete User (Soft Delete)

```
DELETE /api/admin/users/:userId
```

- Sets `deletedAt: Date`
- Sets `isActive: false`
- Revokes all refresh tokens
- User remains in database

### Change User Role

```
PATCH /api/admin/users/:userId/role
Body: { role: 'guest' | 'user' }
```

- Only accepts guest or user roles
- Updates user role immediately

## User Experience

### Deactivating a User

1. Click "Deactivate" (Ban icon) on user row
2. Modal appears with optional reason field
3. Enter reason (optional) or leave blank
4. Click "Deactivate" to confirm or "Cancel" to abort
5. Success toast notification appears
6. User list refreshes automatically

### Changing User Role

1. Click on the role badge in the table
2. Modal appears with role dropdown
3. Select new role (guest or user)
4. Click "Change Role" to confirm or "Cancel" to abort
5. Save button disabled if same role selected
6. Success toast notification appears
7. User list refreshes automatically

### Deleting a User

1. Click "Delete" (Trash icon) on user row
2. Browser confirmation dialog appears
3. If confirmed, user is soft deleted
4. User marked with `deletedAt` timestamp
5. User set to inactive
6. Success toast notification appears
7. User list refreshes automatically

## Role System

### Guest Role

- Default role for new users
- Limited permissions
- Can be upgraded to user

### User Role

- Full user permissions
- Can be downgraded to guest

### Role Badge Colors

- **Guest**: Orange background (`#fff3e0` / `#ef6c00`)
- **User**: Green background (`#e8f5e9` / `#388e3c`)

## Migration Notes

### Existing Users

- Users with `role: 'admin'` or `role: 'researcher'` will need manual migration
- Run database migration to convert:
  - `admin` → `user`
  - `researcher` → `user`
  - Keep existing `user` roles

### Database Migration Script Example

```javascript
// Run this in MongoDB shell or migration script
db.users.updateMany(
  { role: { $in: ["admin", "researcher"] } },
  { $set: { role: "user" } }
);
```

## Testing Checklist

- [x] Deactivate user without reason
- [x] Deactivate user with reason
- [x] Change user role from guest to user
- [x] Change user role from user to guest
- [x] Delete user (soft delete)
- [x] Verify deleted user has deletedAt timestamp
- [x] Verify deactivated user has isActive: false
- [x] Role filter shows guest and user only
- [x] Role badge clickable and opens modal
- [x] Modals close on overlay click
- [x] Modals close on cancel button
- [x] Toast notifications display correctly
- [x] User list refreshes after actions

## Files Modified

### Backend

- `backend/src/models/User.js`
- `backend/src/controllers/adminController.js`

### Frontend

- `frontend/web-app/src/services/api.js`
- `frontend/web-app/src/pages/Users.jsx`
- `frontend/web-app/src/pages/Users.css`

### Documentation

- `docs/USER_MANAGEMENT_UPDATE.md` (this file)

## Breaking Changes

⚠️ **Important**: The role system has changed from 3 roles to 2 roles:

- Removed: `admin`, `researcher`
- Available: `guest`, `user`

Existing admin functionality should be handled through separate admin accounts or middleware that doesn't rely on the `role` field.

## Next Steps

1. **Run Database Migration**: Convert existing admin/researcher roles to user
2. **Update Admin Auth**: If admin access was based on role, update to use separate admin system
3. **Test User Management**: Verify all user management features work correctly
4. **Update Documentation**: Update any references to old role system
5. **Deploy Changes**: Deploy backend and frontend together to avoid API mismatches
