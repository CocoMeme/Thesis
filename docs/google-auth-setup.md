# Google OAuth Configuration Guide

To enable Google Sign-In functionality in your Gourd Scanner app, you'll need to set up Google OAuth credentials. Follow these steps:

## 1. Firebase Console Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** and enable it
5. Download the configuration files:
   - For Android: Download `google-services.json`
   - For iOS: Download `GoogleService-Info.plist`

## 2. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client IDs**
5. Create credentials for each platform:

### Android Client ID
- Application type: Android
- Package name: Your app's package name (from app.json)
- SHA-1 certificate fingerprint: Get from your development keystore

### iOS Client ID
- Application type: iOS
- Bundle ID: Your app's bundle identifier (from app.json)

### Web Client ID
- Application type: Web application
- Authorized JavaScript origins: Your domains
- Authorized redirect URIs: Your callback URLs

## 3. Update Configuration

Once you have your client IDs, update the following file:

**frontend/mobile-app/src/services/googleAuthService.js**

Replace the placeholder values in the `clientId` object:

```javascript
this.clientId = {
  android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  ios: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', 
  web: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
};
```

## 4. App Configuration

### For Expo projects:
Add to your `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

### Place configuration files:
- Copy `google-services.json` to your project root
- Copy `GoogleService-Info.plist` to your project root

## 5. Firebase Backend Configuration

Ensure your backend Firebase configuration includes the same project credentials. The backend will verify the Google ID tokens received from the mobile app.

## Notes

- The Google Sign-In will work with Firebase Authentication automatically
- Users signing in with Google will be created in both Firebase and your local database
- The implementation uses Expo's AuthSession for cross-platform compatibility
- Make sure your Firebase project has the same Google OAuth settings as your Google Cloud Console project

## Troubleshooting

1. **"Client ID not configured" error**: Update the googleAuthService.js with your actual client IDs
2. **Token verification fails**: Ensure Firebase project settings match Google Cloud Console settings
3. **Redirect URI issues**: Make sure your redirect URIs are properly configured in Google Cloud Console

For more details, refer to:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)