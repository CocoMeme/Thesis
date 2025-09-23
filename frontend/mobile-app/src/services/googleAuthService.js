import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  constructor() {
    // Firebase project: thesis-bbe0c - Configured with actual Google OAuth client IDs
    // Web App ID: 1:615143258112:web:fce99f9c725ba38dd840e5 (added to Firebase)
    this.clientId = {
      android: '615143258112-ds27osd166pmue5qv2hii9rg82smt5ne.apps.googleusercontent.com', // Auto-created by Firebase with correct SHA-1
      ios: '615143258112-fsb0nou91mrl77t68edtr3p36vlfhjj7.apps.googleusercontent.com',     // Web client for iOS (typical setup)
      web: '615143258112-gnk282j6e2sauhqh7bvbsngmfsjna5rm.apps.googleusercontent.com',     // Firebase auto-created web client with both redirect URIs
    };
    
    // Configure redirect URIs - force HTTPS for Google OAuth compatibility
    this.redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      preferLocalhost: false, // Force use of Expo's auth proxy
    });
    
    // Fallback: If still getting exp:// URL, force the HTTPS proxy URL
    if (this.redirectUri.startsWith('exp://')) {
      this.redirectUri = `https://auth.expo.io/@coandrei/gourd-scanner-expo`;
    }
  }

  /**
   * Get the appropriate client ID for the current platform
   */
  getClientId() {
    // For Expo development, use web client ID for all platforms
    // This avoids redirect URI configuration issues during development
    console.log('🔍 Available Client IDs:', this.clientId);
    return this.clientId.web;
  }

  /**
   * Google Sign-In using WebBrowser
   */
  async signInWithGoogleWebBrowser() {
    try {
      const clientId = this.getClientId();
      
      // Use the exact redirect URI that matches your Google Console configuration
      // IMPORTANT: Using Expo redirect URI to avoid Firebase sessionStorage issues
      const redirectUri = `https://auth.expo.io/@coandrei/gourd-scanner-expo`;
      
      console.log('🔍 Using Expo redirect URI (avoids Firebase sessionStorage issues):', redirectUri);
      
      // Create auth URL manually for better control
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=openid%20profile%20email&` +
        `state=${Math.random().toString(36)}`;
      
      console.log('🔍 Auth URL:', authUrl);
      
      // Use WebBrowser for simpler handling
      console.log('🌐 Opening WebBrowser auth session...');
      console.log('🔍 WebBrowser URL:', authUrl);
      console.log('🔍 WebBrowser Redirect URI:', redirectUri);
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
        showInRecents: false, // Don't show in recent apps
        preferEphemeralSession: true, // Use ephemeral session for better compatibility
      });
      
      console.log('🔍 WebBrowser Result Type:', result.type);
      console.log('🔍 WebBrowser Result Full:', JSON.stringify(result, null, 2));
      
      if (result.type === 'success' && result.url) {
        console.log('✅ WebBrowser Success - parsing tokens from URL');
        console.log('🔍 Result URL:', result.url);
        
        // Parse tokens from URL (they come in the fragment for implicit flow)
        let accessToken, idToken;
        
        try {
          const url = new URL(result.url);
          console.log('🔍 URL Hash:', url.hash);
          
          const params = new URLSearchParams(url.hash.substring(1));
          
          accessToken = params.get('access_token');
          idToken = params.get('id_token');
          
          console.log('🔍 Parsed tokens - Access Token:', !!accessToken, 'ID Token:', !!idToken);
        } catch (parseError) {
          console.error('❌ Failed to parse tokens from URL:', parseError);
          throw new Error('Failed to parse authentication response');
        }
        
        if (accessToken) {
          // Get user info
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          const userInfo = await userInfoResponse.json();
          
          return {
            success: true,
            user: {
              id: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              picture: userInfo.picture,
            },
            tokens: {
              accessToken,
              idToken,
              refreshToken: null,
            },
          };
        } else {
          console.log('❌ No access token found in authentication response');
          throw new Error('No access token received from Google');
        }
      } else if (result.type === 'cancel') {
        console.log('🚫 User cancelled Google sign-in');
        throw new Error('Google sign-in was cancelled by user');
      } else if (result.type === 'dismiss') {
        console.log('🚫 Google sign-in was dismissed');
        throw new Error('Google sign-in was dismissed');
      } else if (result.type === 'error') {
        console.log('❌ Google sign-in error:', result.error);
        throw new Error(`Google sign-in error: ${result.error || 'Unknown error'}`);
      } else {
        console.log('❌ Unknown WebBrowser result type:', result.type);
        throw new Error(`Unexpected authentication result: ${result.type}`);
      }
      
      return {
        success: false,
        error: 'Authentication failed or was cancelled',
      };
      
    } catch (error) {
      console.error('Google Auth Error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    }
  }

  /**
   * Initiate Google Sign-In flow
   */
  async signInWithGoogle() {
    console.log('🚀 Starting Google Sign-In...');
    return await this.signInWithGoogleWebBrowser();
  }

  /**
   * Sign out from Google (if needed)
   */
  async signOut() {
    try {
      // For Expo/web-based auth, we can revoke the token
      // This is a placeholder - implement based on your needs
      return { success: true };
    } catch (error) {
      console.error('Google Sign-Out error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during sign out',
      };
    }
  }
}

export const googleAuthService = new GoogleAuthService();