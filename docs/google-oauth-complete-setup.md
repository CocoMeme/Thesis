# Google OAuth 2.0 Setup Instructions

Follow these steps to properly configure Google Sign-in for your Gourd Scanner app.

## 📋 Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Your app package name/bundle ID: `com.coandrei.gourdscanner`
4. Your Expo account (run `expo whoami` to check)

## 🔧 Step 0: Expo Account Setup

### 0.1 Check/Create Expo Account
```bash
# Check if you're logged in to Expo
cd frontend/mobile-app
expo whoami

# If you see "Not logged in", create/login to account
expo register  # To create new account
# OR
expo login     # To login to existing account
```

### 0.2 Your App Configuration ✅
From your `app.json` and Expo account:
- **Expo Username**: `fullybooked-mobile` ✅
- **App Name**: `thesis`
- **App Slug**: `gourd-scanner-expo` ✅
- **Package Name**: `com.coandrei.gourdscanner` ✅
- **Bundle ID**: `com.coandrei.gourdscanner` ✅
- **Expo URL**: `https://auth.expo.io/@fullybooked-mobile/gourd-scanner-expo` ✅

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

### 1.2 Enable Google+ API
1. Go to **APIs & Services** > **Library**
2. Search for "Google+ API" 
3. Click **Enable**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: "Gourd Scanner"
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Save and continue

## 🔑 Step 2: Create OAuth 2.0 Credentials

### 2.1 Web Application Credential
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: "Gourd Scanner Web"
5. Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   https://auth.expo.io/@fullybooked-mobile/gourd-scanner-expo
   ```
   **Note:** Your Expo username is `fullybooked-mobile`
6. Save the **Client ID** and **Client Secret**

### 2.2 Android Application Credential
1. Create Credentials > OAuth 2.0 Client IDs
2. Application type: **Android**
3. Name: "Gourd Scanner Android"
4. Package name: `com.coandrei.gourdscanner` (or your package)
5. SHA-1 certificate fingerprint:
   - For development: Run `expo credentials:manager` to get SHA-1
   - Or use: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
6. Save the **Client ID**

### 2.3 iOS Application Credential
1. Create Credentials > OAuth 2.0 Client IDs
2. Application type: **iOS**
3. Name: "Gourd Scanner iOS"
4. Bundle ID: `com.coandrei.gourdscanner` (or your bundle ID)
5. Save the **Client ID**

## ⚙️ Step 3: Configure Your App

### 3.1 Backend Configuration
Update your `.env` file:
```bash
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_web_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
GOOGLE_PROJECT_ID=your_google_cloud_project_id
```

### 3.2 Mobile App Configuration
Update `frontend/mobile-app/src/services/googleAuthService.js`:
```javascript
this.clientId = {
  android: 'your_android_client_id.apps.googleusercontent.com',  // Create Android credential
  ios: 'your_ios_client_id.apps.googleusercontent.com',         // Create iOS credential
  web: '1057085767143-583oor5rvrhfjrobf03belasl6utei8e.apps.googleusercontent.com', // ✅ Already configured
};
```

## 🧪 Step 4: Testing

### 4.1 Development Mode (Demo)
- The app will use mock data if credentials are not configured
- Look for "🎭 Demo Mode" in console logs
- Perfect for initial development and testing

### 4.2 Production Mode
- Configure real Google OAuth credentials
- Test on actual devices
- Verify authentication flow works end-to-end

## 📱 Step 5: App Configuration (Expo)

### 5.1 Update app.json
```json
{
  "expo": {
    "scheme": "gourdscanner",
    "android": {
      "package": "com.coandrei.gourdscanner",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.coandrei.gourdscanner",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

## 🔍 Troubleshooting

### Common Issues:
1. **"OAuth client not found"**: Check client IDs match exactly
2. **"Redirect URI mismatch"**: Ensure redirect URIs are added to Google Console
3. **"Token verification failed"**: Check system time is synchronized
4. **SHA-1 fingerprint mismatch**: Regenerate fingerprint for current keystore

### Debug Commands:
```bash
# Check Google Auth configuration
expo credentials:manager

# View SHA-1 fingerprint
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Test backend endpoint
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"demoUser": {"id": "demo_123", "email": "test@example.com", "name": "Test User", "firstName": "Test", "lastName": "User"}}'
```

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Identity Platform](https://developers.google.com/identity)

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Web, Android, and iOS credentials created
- [ ] Backend `.env` file updated
- [ ] Mobile app `googleAuthService.js` updated
- [ ] SHA-1 fingerprints added for Android
- [ ] Bundle ID configured for iOS
- [ ] Redirect URIs properly set
- [ ] Demo mode working in development
- [ ] Production mode tested on device

Once all steps are completed, your Google Sign-in should work seamlessly in both development and production!

## Website OAuth 2.0 Credentials
- {"web":{"client_id":"1057085767143-583oor5rvrhfjrobf03belasl6utei8e.apps.googleusercontent.com","project_id":"thesis-scanner-473003","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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"}}

