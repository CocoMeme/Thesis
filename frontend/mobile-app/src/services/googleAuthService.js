import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  constructor() {
    // Google Cloud Console OAuth 2.0 Client IDs
    // These are your actual Google Cloud Console project credentials
    this.clientId = {
      // Get this from Google Cloud Console > APIs & Credentials > OAuth 2.0 Client IDs
      android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com', // You'll need to create this
      ios: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',         // You'll need to create this
      web: '1057085767143-583oor5rvrhfjrobf03belasl6utei8e.apps.googleusercontent.com',
    };
    
    this.redirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    // For development, you can temporarily use these demo values (not for production!)
    this.isDemoMode = this.clientId.web.includes('YOUR_');
  }

  /**
   * Get the appropriate client ID for the current platform
   */
  getClientId() {
    const { Platform } = require('react-native');
    
    if (Platform.OS === 'android') {
      return this.clientId.android;
    } else if (Platform.OS === 'ios') {
      return this.clientId.ios;
    } else {
      return this.clientId.web;
    }
  }

  /**
   * Initiate Google Sign-In flow
   */
  async signInWithGoogle() {
    try {
      const clientId = this.getClientId();
      
      if (!clientId || clientId.includes('YOUR_')) {
        // For development/demo purposes, return mock data
        if (this.isDemoMode) {
          console.log('🚨 Demo Mode: Google Sign-In credentials not configured');
          return this.getMockGoogleUser();
        }
        
        return {
          success: false,
          error: 'Google Sign-In is not configured yet. Please set up Google OAuth 2.0 credentials in Google Cloud Console and update GoogleAuthService.js with your project\'s client IDs. See docs/google-oauth-setup.md for detailed instructions.',
        };
      }

      // Generate a secure random state value
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      // Configure the auth request
      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.redirectUri,
        additionalParameters: {},
        state,
      });

      // Discover the authorization endpoint
      const discovery = await AuthSession.fetchDiscoveryAsync(
        'https://accounts.google.com'
      );

      // Start the authentication flow
      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        // Exchange the authorization code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId,
            code: result.params.code,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
            redirectUri: this.redirectUri,
          },
          discovery
        );

        // Get user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResult.accessToken}`,
            },
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
            accessToken: tokenResult.accessToken,
            refreshToken: tokenResult.refreshToken,
            idToken: tokenResult.idToken,
          },
        };
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'User cancelled the authentication flow',
        };
      } else {
        return {
          success: false,
          error: 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during Google Sign-In',
      };
    }
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

  /**
   * Mock Google user for development/testing purposes
   * This allows you to test the authentication flow without setting up Google OAuth
   */
  getMockGoogleUser() {
    const mockUser = {
      id: 'demo_' + Date.now(),
      email: 'demo@gourdscanner.com',
      name: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      picture: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=DU',
    };

    const mockTokens = {
      accessToken: 'demo_access_token_' + Date.now(),
      refreshToken: 'demo_refresh_token_' + Date.now(),
      idToken: 'demo_id_token_' + Date.now(),
    };

    console.log('🎭 Using mock Google user for development:', mockUser);
    
    return {
      success: true,
      user: mockUser,
      tokens: mockTokens,
    };
  }

  /**
   * Check if Google OAuth is properly configured
   */
  isConfigured() {
    return !this.isDemoMode;
  }

  /**
   * Get configuration status for debugging
   */
  getConfigurationStatus() {
    return {
      android: !this.clientId.android.includes('YOUR_'),
      ios: !this.clientId.ios.includes('YOUR_'),
      web: !this.clientId.web.includes('YOUR_'),
      isConfigured: this.isConfigured(),
      isDemoMode: this.isDemoMode,
    };
  }
}

export const googleAuthService = new GoogleAuthService();