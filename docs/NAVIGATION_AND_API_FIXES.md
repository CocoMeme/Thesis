# Navigation & API Configuration Fixes

## Issues Fixed

### 1. ✅ Non-Serializable Values in Navigation State

**Problem:**
```
Non-serializable values were found in the navigation state
params.onNotificationPress (Function)
```

**Root Cause:**
Functions (`onNotificationPress`, `onMenuPress`, and `user` object) were being passed through navigation params in `AppNavigator.js`, which causes React Navigation warnings and can break state persistence.

**Solution:**
- Removed all function callbacks from navigation params
- Moved function handlers directly into `HomeScreen.js`
- Removed user loading from `AppNavigator.js` 
- HomeScreen now loads user data internally using `authService.getCurrentUser()`

**Changes Made:**

**Before (AppNavigator.js):**
```javascript
const HomeStack = ({ route }) => {
  const [user, setUser] = React.useState(null);
  
  const handleNotificationPress = () => { /* ... */ };
  const handleMenuPress = () => { /* ... */ };
  
  return (
    <Stack.Screen 
      initialParams={{ 
        showWelcome: route?.params?.showWelcome,
        user: user,
        onNotificationPress: handleNotificationPress,  // ❌ Function in params
        onMenuPress: handleMenuPress,                   // ❌ Function in params
      }}
    />
  );
};
```

**After (AppNavigator.js):**
```javascript
const HomeStack = ({ route }) => {
  return (
    <Stack.Screen 
      initialParams={{ 
        showWelcome: route?.params?.showWelcome,  // ✅ Only serializable values
      }}
    />
  );
};
```

**After (HomeScreen.js):**
```javascript
export const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  
  // Load user data internally
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  // Define handlers locally
  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Notification feature coming soon!');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu Options', 'What would you like to do?', [...]);
  };
  
  // Use handlers directly
  return (
    <WelcomeHeader 
      onNotificationPress={handleNotificationPress}
      onMenuPress={handleMenuPress}
    />
  );
};
```

---

### 2. ✅ Network Error - API URL Configuration

**Problem:**
```
ERROR  Error fetching news: [AxiosError: Network Error]
```

**Root Cause:**
- `newsService.js` was using `localhost:5000` which doesn't work in React Native
- No proper API URL configuration with fallbacks
- Missing expo-constants package for accessing app config

**Solution:**
- Created centralized API configuration file
- Added proper URL fallback chain
- Updated app.json with API URL
- Created .env file for environment variables
- Installed expo-constants package

**Files Created/Modified:**

1. **`src/config/api.js`** (NEW)
```javascript
import Constants from 'expo-constants';

export const getApiUrl = () => {
  const apiUrl = 
    process.env.EXPO_PUBLIC_API_URL ||           // 1. Environment variable
    Constants.expoConfig?.extra?.apiUrl ||       // 2. Expo config
    'http://192.168.1.66:5000/api';              // 3. Fallback

  return apiUrl;
};

export const API_BASE_URL = getApiUrl();
```

2. **`.env`** (NEW)
```env
EXPO_PUBLIC_API_URL=http://192.168.1.66:5000/api
NODE_ENV=development
```

3. **`app.json`** (UPDATED)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.66:5000/api"
    }
  }
}
```

4. **`newsService.js`** (UPDATED)
```javascript
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,  // Now uses centralized config
  // ...
});
```

---

## Testing

### Test Navigation Fix
1. Navigate to Home screen
2. Check console - should NOT see non-serializable warnings
3. Tap notification icon - should show alert
4. Tap menu icon - should show menu options
5. Check that user data loads correctly

### Test API Fix
1. Ensure backend is running: `cd backend && npm run dev`
2. Check backend logs for: `✅ MongoDB connected`, `🚀 Server running on port 5000`
3. Restart Expo: `cd frontend/mobile-app && npx expo start --clear`
4. Open app and navigate to Home
5. Check console for: `📡 API Base URL: http://192.168.1.66:5000/api`
6. News should load without Network Error
7. Check for: `✅ News loaded successfully` or similar success message

### Verify News Display
1. After login, welcome alert should appear
2. After closing welcome alert, news popup should appear (if any unread news)
3. Home screen should show news section at top
4. Tap a news card - full article should open
5. News should be marked as read after 2 seconds

---

## Configuration Notes

### Changing API URL

You can change the API URL in multiple places (in order of priority):

1. **Environment Variable** (Highest priority)
   - Edit `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api
   ```

2. **Expo Config**
   - Edit `app.json`:
   ```json
   "extra": {
     "apiUrl": "http://YOUR_IP:5000/api"
   }
   ```

3. **Direct in Config File**
   - Edit `src/config/api.js`:
   ```javascript
   const apiUrl = 'http://YOUR_IP:5000/api';
   ```

After changing, restart Expo with cache clear:
```bash
npx expo start --clear
```

### Finding Your IP Address

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

**Current IP:** `192.168.1.66`

---

## Best Practices Applied

### ✅ Navigation
- Keep navigation params serializable (strings, numbers, booleans, objects)
- Use React Context for complex data sharing
- Define callbacks in the component that uses them
- Use `navigation.setOptions()` for dynamic header updates

### ✅ API Configuration
- Centralize API configuration in one file
- Use environment variables for flexibility
- Provide fallback values
- Log configuration in development mode
- Use Constants from expo-constants for app config

### ✅ Error Handling
- Wrap API calls in try-catch
- Provide user-friendly error messages
- Log errors for debugging
- Show loading states

---

## Troubleshooting

### Still Getting Network Error?

1. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   # Should show: Server running on http://0.0.0.0:5000
   ```

2. **Verify IP address:**
   - Make sure `192.168.1.66` is your current IP
   - Update if IP changed

3. **Test backend directly:**
   ```bash
   curl http://192.168.1.66:5000/api/health
   # Should return: {"status":"healthy",...}
   ```

4. **Check firewall:**
   - Windows: Allow Node.js through firewall
   - Mac: Check System Preferences > Security > Firewall

5. **Restart everything:**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend (new terminal)
   cd frontend/mobile-app
   npx expo start --clear
   ```

### Still Getting Navigation Warnings?

1. Clear cache:
   ```bash
   npx expo start --clear
   ```

2. Check no functions in `initialParams`

3. Verify Alert is imported:
   ```javascript
   import { Alert } from 'react-native';
   ```

---

## Summary

✅ **Fixed:** Non-serializable values warning
✅ **Fixed:** Network error in news fetching
✅ **Added:** Centralized API configuration
✅ **Added:** Environment variable support
✅ **Improved:** Component architecture (handlers in components)
✅ **Improved:** Error handling and logging

The app should now work without warnings and successfully fetch news from the backend!
