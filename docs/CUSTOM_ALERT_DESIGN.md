# CustomAlert Component Design

## Overview
Replaced all native `Alert.alert()` dialogs with a custom modal alert that matches the eGourd brand theme.

## Features

### Visual Design
- **Gradient Icon Header**: Color-coded based on alert type
- **Smooth Animations**: Fade-in with spring animation
- **Brand Colors**: Uses theme colors (#559c49 and #dede50)
- **Modern Card Style**: White rounded card with shadows
- **Professional Typography**: Poppins font family

### Alert Types

#### 1. Success (Green Gradient)
- **Icon**: check-circle
- **Colors**: Primary green (#559c49) → darker green
- **Use**: Login success, registration complete, actions confirmed

#### 2. Error (Red Gradient)
- **Icon**: alert-circle
- **Colors**: Red (#e74c3c) → darker red
- **Use**: Invalid credentials, network errors, validation failures

#### 3. Warning (Yellow Gradient)
- **Icon**: alert
- **Colors**: Secondary yellow (#dede50) → darker yellow
- **Use**: Missing fields, weak password, terms not agreed

#### 4. Info (Blue Gradient)
- **Icon**: information
- **Colors**: Info blue (#3498db) → darker blue
- **Use**: Feature coming soon, demo mode notices, general info

## Component Props

```javascript
<CustomAlert
  visible={true}              // Show/hide modal
  type="success"              // 'success' | 'error' | 'warning' | 'info'
  title="Welcome Back!"       // Bold title text
  message="Login successful!" // Description message
  buttons={[                  // Optional custom buttons
    {
      text: 'Continue',
      onPress: () => {},
      style: 'default'        // 'default' | 'cancel'
    }
  ]}
  onClose={() => {}}          // Called when dismissed
/>
```

## Implementation

### LoginScreen
- Replaced all `Alert.alert()` calls
- Added state: `const [alert, setAlert] = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] })`
- Shows appropriate alerts for:
  - Missing fields (warning)
  - Invalid email (error)
  - Login success (success)
  - Login failed (error)
  - Network errors (error)
  - Forgot password (info)
  - Google Sign-In status (success/error/info)

### SignUpScreen
- Replaced all `Alert.alert()` calls
- Added same state management
- Shows appropriate alerts for:
  - Validation errors (warning/error)
  - Registration success (success)
  - Registration failed (error)
  - Google Sign-Up status (success/error/info)

## User Experience Improvements

1. **Visual Hierarchy**: Icon header immediately communicates alert type
2. **Brand Consistency**: Matches splash screen and profile gradient design
3. **Better Readability**: Larger, well-spaced text with proper font weights
4. **Professional Feel**: Smooth animations and modern card design
5. **Contextual Colors**: Color-coded alerts help users understand severity
6. **Flexible Buttons**: Support for single button (OK) or multiple actions

## Technical Details

- **Animated.View**: Smooth fade and scale animations
- **Modal Component**: Proper overlay with touchable background dismiss
- **LinearGradient**: Matching brand gradient effects
- **MaterialCommunityIcons**: Consistent icon library
- **Theme Integration**: Uses centralized theme colors and spacing

## Example Usage in Code

```javascript
// Success Alert
setAlert({
  visible: true,
  type: 'success',
  title: 'Welcome Back!',
  message: 'Login successful! Redirecting...',
  buttons: [
    {
      text: 'Continue',
      onPress: () => {
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }
    }
  ],
});

// Error Alert (auto-dismiss)
setAlert({
  visible: true,
  type: 'error',
  title: 'Invalid Email',
  message: 'Please enter a valid email address.',
  buttons: [], // Empty array shows default OK button
});

// Multi-button Alert
setAlert({
  visible: true,
  type: 'info',
  title: 'Setup Required',
  message: 'Google Sign-In is running in demo mode.',
  buttons: [
    { text: 'Use Demo Mode', onPress: () => handleGoogleSignIn() },
    { text: 'Cancel', style: 'cancel' } // Outlined style
  ],
});
```

## Files Modified
- ✅ `src/components/CustomAlert.js` - New component created
- ✅ `src/components/index.js` - Export added
- ✅ `src/screens/LoginScreen.js` - Replaced all Alert.alert() calls
- ✅ `src/screens/SignUpScreen.js` - Replaced all Alert.alert() calls

## Next Steps
Consider applying CustomAlert to other screens:
- ProfileScreen (logout confirmation, edit success)
- CameraScreen (scan errors, photo capture issues)
- HistoryScreen (delete confirmations)
