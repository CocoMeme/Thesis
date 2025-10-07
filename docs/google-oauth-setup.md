# Google OAuth 2.0 Setup Guide

This guide will help you set up Google OAuth 2.0 authentication for the Gourd Classification app using Google Cloud Console.

---

## 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" and click on it
   - Click **Enable**

---

## 2. Create OAuth 2.0 Credentials

### Web Application Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application**
4. Name it "Gourd Scanner Web"
5. Add authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   http://localhost:3000/auth/callback
   ```
6. Click **Create**
7. Save the **Client ID** and **Client Secret**

### Android Application Credentials
1. Click **Create Credentials** > **OAuth 2.0 Client IDs**
2. Select **Android**
3. Name it "Gourd Scanner Android"
4. Package name: `com.coandrei.gourdscanner` (or your package name)
5. SHA-1 certificate fingerprint:
   - For development: Get from `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - For production: Get from your release keystore
6. Click **Create**
7. Save the **Client ID**

### iOS Application Credentials
1. Click **Create Credentials** > **OAuth 2.0 Client IDs**
2. Select **iOS**
3. Name it "Gourd Scanner iOS"
4. Bundle ID: `com.coandrei.gourdscanner` (or your bundle ID)
5. Click **Create**
6. Save the **Client ID**

---

## 3. Configure Backend Environment

Update your `.env` file with the Google OAuth credentials:

```bash
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_web_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
GOOGLE_PROJECT_ID=your_google_cloud_project_id
```

---

## 4. Configure Mobile App

Update `frontend/mobile-app/src/services/googleAuthService.js`:

```javascript
this.clientId = {
  android: 'your_android_client_id.apps.googleusercontent.com',
  ios: 'your_ios_client_id.apps.googleusercontent.com',
  web: 'your_web_client_id.apps.googleusercontent.com',
};
```

---

## 5. Install Dependencies

### Backend
```bash
cd backend
npm install google-auth-library
npm uninstall firebase-admin  # Remove Firebase dependency
```

### Mobile App
```bash
cd frontend/mobile-app
# The required packages are already installed:
# - expo-auth-session
# - expo-web-browser
# - expo-crypto
```

---

## 6. Migration from Firebase

If you have existing Firebase users, run the migration script:

```bash
cd backend
node migrate-to-google-oauth.js migrate
```

To rollback if needed:
```bash
node migrate-to-google-oauth.js rollback
```

---

## 7. Testing the Setup

### Backend API Endpoints
- `POST /api/auth/google` - Authenticate with Google ID token
- `GET /api/auth/google/url` - Get Google OAuth authorization URL
- `GET /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and revoke tokens
- `GET /api/auth/me` - Get current user profile

### Mobile App Flow
1. User taps "Sign in with Google"
2. App opens Google OAuth flow in browser
3. User authorizes the app
4. App receives authorization code
5. App exchanges code for tokens
6. App sends ID token to backend
7. Backend verifies token and creates/updates user
8. Backend returns JWT token for API access

---

## 8. Security Best Practices

1. **Keep secrets secure**: Never commit client secrets to version control
2. **Use HTTPS in production**: Update redirect URIs to use HTTPS
3. **Validate tokens**: Always verify Google ID tokens on the server
4. **Implement token refresh**: Handle expired tokens gracefully
5. **Rate limiting**: Implement rate limiting on auth endpoints
6. **Audit logs**: Log authentication events for security monitoring

---

## 9. Troubleshooting

### Common Issues

1. **Invalid client**: Check that client IDs match exactly
2. **Redirect URI mismatch**: Ensure redirect URIs are added to Google Console
3. **Token verification fails**: Check that system time is synchronized
4. **CORS errors**: Ensure your domain is added to authorized origins

### Debug Steps

1. Check Google Cloud Console logs
2. Verify environment variables are loaded
3. Test token verification manually
4. Check network connectivity
5. Validate redirect URI format

---

## Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Auth Library for Node.js](https://github.com/googleapis/google-auth-library-nodejs)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Identity Platform](https://developers.google.com/identity)