# Pull-to-Refresh & Backend Reconnection Feature

## Overview
This feature implements a pull-to-refresh mechanism that allows users to manually reconnect to the backend when MongoDB disconnects or connection issues occur.

## Problem Solved
When MongoDB reconnects (showing `⚠️ MongoDB disconnected` and `🔄 MongoDB reconnected`), the frontend may fail to load news/updates content. This feature provides:
- Manual reconnection trigger via pull-to-refresh gesture
- Automatic retry mechanism with smart backoff
- Visual feedback during reconnection
- Data refresh after successful reconnection

## Implementation

### Frontend Components

#### 1. **WelcomeHeader Component** (`src/components/HomeComponents/WelcomeHeader.js`)
- Added `isRefreshing` prop to display loading overlay
- Shows "Reconnecting..." message with spinner during refresh
- Overlay appears over the gradient header

**Props:**
```javascript
{
  userName: string,
  user: object,
  onNotificationPress: function,
  onMenuPress: function,
  isRefreshing: boolean // New prop
}
```

#### 2. **HomeScreen Component** (`src/screens/HomeScreen.js`)
- Integrated `RefreshControl` in ScrollView
- Added `onRefresh` handler with connection checking
- Implements retry logic for failed connections

**Key Features:**
- Pull down on the WelcomeHeader area to trigger refresh
- Checks backend health before fetching data
- Auto-retries up to 3 times with 2-second delays
- Shows success/error alerts based on results
- Refreshes both user data and news content

### Backend Endpoints

#### 1. **Health Check** (`GET /api/health`)
Returns overall application health status including database connection.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-04T...",
  "environment": "development",
  "database": { ... },
  "uptime": 1234.56,
  "memory": { ... },
  "version": "v18.x.x"
}
```

#### 2. **Database Health Check** (`GET /api/health/database`)
Specifically checks MongoDB connection status.

**Response:**
```json
{
  "success": true,
  "message": "Database connection is healthy",
  "data": { ... },
  "timestamp": "2025-11-04T..."
}
```

### Connection Service

#### **connectionService** (`src/services/connectionService.js`)

**Functions:**

1. **`checkBackendConnection()`**
   - Checks if backend is reachable
   - 5-second timeout
   - Returns connection status and message

2. **`reconnectToBackend(maxRetries, delayMs)`**
   - Attempts to reconnect with retry logic
   - Default: 3 retries with 2-second delays
   - Returns success status and attempt count

3. **`checkDatabaseConnection()`**
   - Verifies MongoDB connection through backend
   - Returns database-specific health status

## User Experience Flow

### 1. Normal Refresh
```
User pulls down → Loading indicator shows → 
Data refreshes → Success message → Content updates
```

### 2. Connection Issues
```
User pulls down → Loading indicator shows → 
Backend check fails → Auto-retry (up to 3x) → 
Success/Failure alert → Retry option if failed
```

### 3. Visual Feedback

**During Refresh:**
- Native pull-to-refresh spinner (iOS/Android)
- "Reconnecting..." overlay on WelcomeHeader
- Semi-transparent dark overlay with loading spinner

**After Refresh:**
- Success: Brief "Refreshed" alert
- Failure: Error alert with Retry option

## Configuration

### Retry Settings
Located in `HomeScreen.js` `onRefresh` function:
```javascript
const reconnectResult = await connectionService.reconnectToBackend(
  3,    // maxRetries
  2000  // delayMs
);
```

### Timeout Settings
Located in `connectionService.js`:
```javascript
timeout: 5000 // 5 seconds
```

## Error Handling

### Connection Errors
- `ECONNABORTED` / timeout → "Connection timeout"
- `ERR_NETWORK` → "Network error"
- Generic errors → "Unable to reach backend"

### User Actions
- **Retry button**: Attempts refresh again
- **Cancel button**: Dismisses error and keeps current state

## Testing

### Test Scenarios

1. **Normal Operation**
   - Backend running → Pull to refresh → Should update content

2. **MongoDB Disconnect**
   - Stop MongoDB → Pull to refresh → Should attempt reconnection
   - Start MongoDB → Pull to refresh → Should reconnect successfully

3. **Backend Down**
   - Stop backend → Pull to refresh → Should show error with retry option

4. **Network Issues**
   - Disconnect network → Pull to refresh → Should show appropriate error

### Console Logs
Monitor these logs during testing:
```
🔄 Refreshing data and reconnecting to backend...
✅ Backend connection is healthy
🔄 Reconnection attempt 1/3...
⏳ Waiting 2000ms before retry...
✅ Reconnected after 2 attempt(s)
✅ Refresh completed successfully
```

## Maintenance Notes

### Adding More Data Refresh
To refresh additional data during pull-to-refresh, add calls in the `onRefresh` function:
```javascript
await loadUserData();
await fetchNews();
await fetchYourNewData(); // Add here
```

### Customizing Retry Logic
Modify retry parameters based on network conditions:
```javascript
// For slower networks
await connectionService.reconnectToBackend(5, 3000);

// For faster networks
await connectionService.reconnectToBackend(2, 1000);
```

### Changing Visual Feedback
Modify styles in `WelcomeHeader.js`:
```javascript
refreshOverlay: {
  backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust opacity
},
refreshContainer: {
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust darkness
  borderRadius: 12, // Adjust roundness
}
```

## Future Enhancements

1. **Auto-reconnect**: Detect disconnections automatically without user action
2. **Network state monitoring**: Listen to network changes and reconnect proactively
3. **Offline mode**: Cache data and queue actions when offline
4. **Connection quality indicator**: Show connection strength in UI
5. **Configurable timeouts**: Allow users to set retry parameters in settings

## Related Files

### Frontend
- `src/components/HomeComponents/WelcomeHeader.js`
- `src/screens/HomeScreen.js`
- `src/services/connectionService.js`
- `src/services/newsService.js`
- `src/config/api.js`

### Backend
- `src/app.js`
- `src/config/database.js`

## Dependencies
- `RefreshControl` from `react-native`
- `axios` for HTTP requests
- Backend health check endpoints

## Troubleshooting

### Issue: Refresh doesn't trigger
- **Check**: ScrollView must be scrollable (content taller than screen)
- **Solution**: Ensure content has enough height or add `contentContainerStyle`

### Issue: Constant "Reconnecting" state
- **Check**: Backend health endpoint accessibility
- **Solution**: Verify API_BASE_URL is correct and backend is running

### Issue: News still not loading after refresh
- **Check**: MongoDB connection in backend logs
- **Solution**: Ensure MongoDB is running and properly configured

### Issue: Refresh takes too long
- **Check**: Timeout and retry settings
- **Solution**: Reduce timeout or retry count for faster feedback
