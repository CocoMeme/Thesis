# Admin Dashboard UI - Complete Implementation Guide

## Overview

The Admin Dashboard UI is a comprehensive mobile interface built with React Native that provides administrators with complete user management capabilities. The UI integrates seamlessly with the backend admin API.

## Features Implemented

### 1. **Admin Dashboard Screen**

- **Overview Statistics**: Total, active, inactive, and verified users
- **Quick Actions**: Direct access to user management and other admin functions
- **User Distribution**: Visual breakdown by role and authentication provider
- **Refresh Capability**: Pull-to-refresh functionality for real-time data

### 2. **User Management Screen**

- **User List**: Paginated display of all users with avatars, names, emails, roles, and statuses
- **Search**: Real-time search by name, email, or username
- **Filters**: Filter users by role (user/researcher/admin) and status (active/inactive/verified)
- **Quick Actions**: Activate/deactivate users directly from the list
- **Pagination**: Navigate through pages with prev/next controls
- **Navigation**: Tap on any user to view detailed profile

### 3. **User Detail Screen**

- **Complete Profile View**: Full user information including account details and statistics
- **Activity Stats**: View scan counts, accuracy rates, and gourd detection statistics
- **Role Management**: Change user roles with confirmation dialog
- **Account Actions**:
  - Activate/Deactivate account
  - Suspend account (with reason and optional duration)
  - Delete account (with confirmation)
- **Visual Indicators**: Color-coded badges for roles, statuses, and verification

## File Structure

```
frontend/mobile-app/src/
├── screens/
│   └── AdminScreens/
│       ├── index.js                      # Screen exports
│       ├── AdminDashboardScreen.js       # Main dashboard overview
│       ├── UserManagementScreen.js       # User list & management
│       └── UserDetailScreen.js           # Individual user details
├── services/
│   ├── adminService.js                   # Admin API service
│   └── index.js                          # Service exports
└── navigation/
    └── AppNavigator.js                   # Navigation with role-based access
```

## Screen Details

### AdminDashboardScreen.js

**Purpose**: Main dashboard providing overview and quick access to admin functions

**Key Components**:

- `StatCard`: Displays overview statistics with icons
- `QuickAction`: Quick access buttons for common tasks
- Gradient header with app branding
- Role distribution section
- Provider distribution section

**Features**:

- Fetches dashboard data on mount and refresh
- Pull-to-refresh functionality
- Navigation to User Management screen
- Visual statistics with icons and colors

**API Calls**:

- `adminService.getDashboardOverview()` - Gets all dashboard statistics

---

### UserManagementScreen.js

**Purpose**: Comprehensive user list and management interface

**Key Components**:

- Search bar with icon
- Filter modal for role and status
- User cards with FlatList
- Pagination controls
- Action buttons (activate/deactivate)

**Features**:

- Search users by name, email, or username
- Filter by:
  - Role: All, User, Researcher, Admin
  - Status: All, Active, Inactive, Verified
- Paginated list (10 users per page)
- Quick activate/deactivate toggle
- Navigate to user detail on card tap
- Empty state handling
- Pull-to-refresh

**API Calls**:

- `adminService.getAllUsers(page, limit, search, role, status)` - Gets filtered user list
- `adminService.activateUser(userId)` - Activates a user
- `adminService.deactivateUser(userId)` - Deactivates a user

**State Management**:

```javascript
{
  users: [],              // List of users
  loading: false,         // Loading state
  refreshing: false,      // Refresh state
  page: 1,                // Current page
  totalPages: 1,          // Total pages
  searchQuery: '',        // Search text
  showFilters: false,     // Filter modal visibility
  selectedRole: 'all',    // Role filter
  selectedStatus: 'all',  // Status filter
  actionLoading: {}       // Per-user action loading
}
```

---

### UserDetailScreen.js

**Purpose**: Detailed view and management of individual user accounts

**Key Components**:

- User profile card with avatar
- Account information section
- Activity statistics grid
- Action buttons section
- Role change modal
- Suspend account modal

**Features**:

- Complete user profile view
- Activity statistics (scans, accuracy, gourds detected)
- Account actions:
  - Toggle active/inactive status
  - Change user role (user/researcher/admin)
  - Suspend account with reason and duration
  - Delete account with confirmation
- Color-coded badges for roles and statuses
- Verification indicator
- Provider display

**API Calls**:

- `adminService.getUserProfile(userId)` - Gets full user profile
- `adminService.getUserStats(userId)` - Gets user activity statistics
- `adminService.activateUser(userId)` - Activates user
- `adminService.deactivateUser(userId)` - Deactivates user
- `adminService.changeUserRole(userId, newRole)` - Changes user role
- `adminService.suspendUser(userId, reason, duration)` - Suspends user
- `adminService.deleteUser(userId, hardDelete)` - Deletes user

**Modals**:

1. **Role Change Modal**:

   - Shows current role
   - Lists all available roles (user, researcher, admin)
   - Color-coded role indicators
   - Confirmation required

2. **Suspend Modal**:
   - Reason input (required)
   - Duration input (optional, in days)
   - Submit button with gradient
   - Cancel option

---

## Navigation Integration

### Role-Based Access Control

The admin dashboard is only accessible to users with the `admin` role:

```javascript
// In AppNavigator.js
{
  userRole === "admin" && (
    <Tab.Screen
      name="Admin"
      component={AdminStack}
      options={{
        tabBarActiveTintColor: "#F44336", // Red color for admin
      }}
    />
  );
}
```

### Admin Stack Navigator

```javascript
const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminDashboardMain"
        component={AdminDashboardScreen}
      />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
    </Stack.Navigator>
  );
};
```

### Navigation Flow

```
Admin Tab → AdminDashboardMain
              ↓
         UserManagement
              ↓
          UserDetail
```

---

## UI Design

### Color Scheme

```javascript
// Role Colors
admin:      #F44336 (Red)
researcher: #FF9800 (Orange)
user:       #4CAF50 (Green)

// Status Colors
active:     #4CAF50 (Green)
inactive:   #F44336 (Red)
verified:   #2196F3 (Blue)

// Primary Colors
primary:    #4CAF50 (Main green)
background: #f5f5f5 (Light gray)
surface:    #ffffff (White)
```

### Typography

All screens use the **Poppins** font family:

- `Poppins_400Regular` - Body text
- `Poppins_500Medium` - Secondary headings
- `Poppins_600SemiBold` - Primary headings
- `Poppins_700Bold` - Statistics and emphasis

### Component Patterns

1. **Gradient Headers**:

   - LinearGradient from primary color
   - Rounded bottom corners (30px radius)
   - White text with semi-transparent back button

2. **Cards**:

   - White background with shadows
   - 16-20px border radius
   - Theme shadow (medium)
   - 16-24px padding

3. **Badges**:

   - Pill-shaped (high border radius)
   - Semi-transparent backgrounds (20% opacity)
   - Colored text matching badge type
   - 12px padding horizontal, 6px vertical

4. **Action Buttons**:
   - Icon + Label + Chevron layout
   - Color-coded by action type
   - Border separator between items
   - Press feedback with activeOpacity

---

## API Service Integration

### adminService.js

All API calls are centralized in the admin service:

```javascript
import { API_BASE_URL } from "./config";
import { authService } from "./authService";

const getHeaders = async () => {
  const token = await authService.getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const adminService = {
  // Dashboard
  getDashboardOverview: async () => {
    /* ... */
  },

  // User Management
  getAllUsers: async (page, limit, search, role, status) => {
    /* ... */
  },
  getUserProfile: async (userId) => {
    /* ... */
  },
  updateUser: async (userId, updates) => {
    /* ... */
  },

  // User Actions
  activateUser: async (userId) => {
    /* ... */
  },
  deactivateUser: async (userId) => {
    /* ... */
  },
  suspendUser: async (userId, reason, duration) => {
    /* ... */
  },
  deleteUser: async (userId, hardDelete) => {
    /* ... */
  },
  changeUserRole: async (userId, newRole) => {
    /* ... */
  },

  // Statistics
  getUserStats: async (userId) => {
    /* ... */
  },

  // Bulk Operations
  bulkUpdateUsers: async (userIds, updates) => {
    /* ... */
  },
};
```

### Error Handling

All API calls include error handling:

```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    return { success: false, message: data.message };
  }

  return { success: true, ...data };
} catch (error) {
  console.error("API Error:", error);
  return { success: false, message: error.message };
}
```

---

## Usage Guide

### For Administrators

1. **Accessing Admin Dashboard**:

   - Ensure your user role is set to `admin` in the database
   - Login to the app
   - Admin tab will appear in the bottom navigation (shield icon)

2. **Managing Users**:

   - Tap "Admin" tab to open dashboard
   - View overview statistics
   - Tap "Manage Users" or navigate to User Management
   - Use search and filters to find specific users
   - Tap on a user card to view details

3. **User Actions**:
   - **Activate/Deactivate**: Toggle from list or detail view
   - **Change Role**: Open detail view → Change Role → Select new role
   - **Suspend**: Open detail view → Suspend Account → Enter reason and duration
   - **Delete**: Open detail view → Delete Account → Confirm action

### For Developers

1. **Adding New Admin Features**:

   ```javascript
   // 1. Add API endpoint in backend
   // 2. Add service method in adminService.js
   // 3. Create UI screen/component
   // 4. Add to AdminStack in AppNavigator.js
   ```

2. **Extending Statistics**:

   ```javascript
   // Add new stat boxes in AdminDashboardScreen.js
   <StatCard
     icon="icon-name"
     label="Stat Label"
     value={dashboard.statValue}
     color="#ColorCode"
   />
   ```

3. **Adding Filters**:
   ```javascript
   // Update filter state in UserManagementScreen.js
   // Add filter option in filter modal
   // Pass to getAllUsers API call
   ```

---

## Testing Checklist

### Admin Dashboard

- [ ] Dashboard loads with correct statistics
- [ ] Pull-to-refresh updates data
- [ ] Quick actions navigate correctly
- [ ] Role/provider distributions display properly

### User Management

- [ ] User list loads with pagination
- [ ] Search filters users correctly
- [ ] Role filter works (all/user/researcher/admin)
- [ ] Status filter works (all/active/inactive/verified)
- [ ] Pagination prev/next buttons work
- [ ] Activate/deactivate toggles work
- [ ] Navigation to user detail works
- [ ] Empty states display correctly

### User Detail

- [ ] User profile loads completely
- [ ] User statistics display correctly
- [ ] Activate/deactivate works with confirmation
- [ ] Role change modal works
- [ ] Suspend modal requires reason
- [ ] Delete confirms before action
- [ ] All badges display correct colors
- [ ] Back navigation works

### Navigation

- [ ] Admin tab only shows for admin role
- [ ] Non-admin users don't see admin tab
- [ ] Tab icon changes when focused
- [ ] Stack navigation flows correctly
- [ ] Back button returns to previous screen

### Error Handling

- [ ] Network errors show alerts
- [ ] API errors display messages
- [ ] Loading states show correctly
- [ ] Empty states handled gracefully

---

## Environment Setup

### Prerequisites

```bash
# Ensure backend is running
cd backend
npm install
npm start

# Ensure frontend has dependencies
cd frontend/mobile-app
npm install
```

### Configuration

Update API base URL in `frontend/mobile-app/src/services/config.js`:

```javascript
// For local development
export const API_BASE_URL = "http://localhost:5000/api";

// For production
export const API_BASE_URL = "https://your-api-domain.com/api";
```

---

## Security Considerations

1. **Authentication**: All admin API calls require valid JWT token
2. **Authorization**: Backend validates admin role on every request
3. **Token Storage**: Tokens stored securely in AsyncStorage
4. **Sensitive Actions**: Confirmations required for destructive operations
5. **Data Validation**: All inputs validated on frontend and backend

---

## Known Limitations

1. **Bulk Operations**: UI for bulk user updates not yet implemented
2. **Advanced Search**: Only basic search by name/email/username
3. **Export**: No user data export functionality yet
4. **Audit Logs**: Admin actions not yet logged
5. **Email Notifications**: Users not notified of status changes

---

## Future Enhancements

1. **Analytics Dashboard**: Charts and graphs for user activity
2. **Bulk User Management**: Select multiple users for batch actions
3. **Advanced Filtering**: Date ranges, last login, activity levels
4. **User Export**: CSV/Excel export of user data
5. **Audit Trail**: Log all admin actions with timestamps
6. **Email Integration**: Notify users of account changes
7. **Content Moderation**: Manage forum posts and comments
8. **System Settings**: App-wide configuration management
9. **Backup/Restore**: User data backup functionality
10. **Reports**: Generate custom reports on user activity

---

## Troubleshooting

### Admin Tab Not Showing

**Issue**: Admin tab doesn't appear after login
**Solution**:

1. Verify user role in database: `db.users.findOne({ email: "admin@example.com" })`
2. Ensure role is exactly `"admin"` (lowercase)
3. Clear AsyncStorage and re-login
4. Check navigation console logs for role value

### API Errors

**Issue**: "Failed to load data" errors
**Solution**:

1. Verify backend is running on correct port
2. Check API_BASE_URL in config.js
3. Ensure JWT token is valid (check AsyncStorage)
4. Review backend logs for error details

### Styling Issues

**Issue**: Components not displaying correctly
**Solution**:

1. Ensure Poppins fonts are loaded in App.js
2. Check theme import in each screen
3. Verify LinearGradient is installed: `expo install expo-linear-gradient`
4. Clear Metro bundler cache: `expo start -c`

---

## Support

For issues or questions:

1. Check backend API documentation in `backend/docs/ADMIN_DASHBOARD.md`
2. Review backend API reference in `backend/docs/ADMIN_API_REFERENCE.md`
3. Check authentication setup in `backend/docs/ADMIN_AUTHENTICATION.md`

---

## Conclusion

The Admin Dashboard UI is a complete mobile interface for user management with:

- ✅ 3 fully-functional screens
- ✅ Role-based access control
- ✅ Comprehensive user management features
- ✅ Clean, modern UI design
- ✅ Full backend API integration
- ✅ Error handling and loading states
- ✅ Search, filter, and pagination
- ✅ Confirmation dialogs for sensitive actions

The dashboard is production-ready and can be extended with additional features as needed.
