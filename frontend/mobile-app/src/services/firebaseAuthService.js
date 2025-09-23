import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithCredential,
  signOut as firebaseSignOut
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Firebase configuration - using Android app config from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBQT8Ee10axC7rNRXktNra-eaYMhOEi-a8", // Android API key from google-services.json
  authDomain: "thesis-bbe0c.firebaseapp.com",
  projectId: "thesis-bbe0c",
  storageBucket: "thesis-bbe0c.firebasestorage.app",
  messagingSenderId: "615143258112",
  appId: "1:615143258112:android:3c91e35397a66bb9d840e5" // Android app ID from google-services.json
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    
    // Client IDs for Google OAuth
    this.clientIds = {
      android: '615143258112-ds27osd166pmue5qv2hii9rg82smt5ne.apps.googleusercontent.com',
      web: '615143258112-gnk282j6e2sauhqh7bvbsngmfsjna5rm.apps.googleusercontent.com',
    };
    
    // Configure Google Auth provider
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');
  }

  /**
   * Sign in with Google using simplified implicit flow
   */
  async signInWithGoogle() {
    try {
      console.log('🚀 Starting Firebase Google Sign-In...');
      
      // Use Expo's auth proxy for better compatibility
      const redirectUri = `https://auth.expo.io/@coandrei/gourd-scanner-expo`;
      
      console.log('🔍 Using Expo Redirect URI:', redirectUri);
      
      // Use implicit flow (response_type=token) for simpler handling
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.clientIds.web}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `include_granted_scopes=true&` +
        `state=${Math.random().toString(36)}`;
      
      console.log('🌐 Opening auth session...');
      console.log('🔍 Auth URL:', authUrl);
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
        showInRecents: false,
        preferEphemeralSession: true,
      });
      
      console.log('📥 Auth result type:', result.type);
      console.log('📥 Auth result full:', JSON.stringify(result, null, 2));
      
      if (result.type === 'success' && result.url) {
        console.log('✅ Got success URL, parsing tokens...');
        
        // Parse tokens from URL fragment (implicit flow)
        const url = new URL(result.url);
        const fragment = url.hash.substring(1); // Remove the #
        const params = new URLSearchParams(fragment);
        
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        
        console.log('🎫 Parsed tokens - Access:', !!accessToken, 'ID:', !!idToken);
        
        if (!idToken) {
          // If no ID token in fragment, try getting user info directly
          if (accessToken) {
            console.log('📝 Getting user info with access token...');
            
            const userInfoResponse = await fetch(
              'https://www.googleapis.com/oauth2/v2/userinfo',
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            
            const userInfo = await userInfoResponse.json();
            console.log('👤 User info:', userInfo.email);
            
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
                idToken: null,
                refreshToken: null,
              },
            };
          } else {
            throw new Error('No tokens received from Google');
          }
        } else {
          // Use ID token with Firebase
          console.log('🔐 Creating Firebase credential...');
          const credential = GoogleAuthProvider.credential(idToken, accessToken);
          
          console.log('🔐 Signing in to Firebase...');
          const userCredential = await signInWithCredential(this.auth, credential);
          
          const user = userCredential.user;
          console.log('✅ Firebase sign-in successful:', user.email);
          
          return {
            success: true,
            user: {
              id: user.uid,
              email: user.email,
              name: user.displayName,
              firstName: user.displayName?.split(' ')[0],
              lastName: user.displayName?.split(' ').slice(1).join(' '),
              picture: user.photoURL,
            },
            tokens: {
              accessToken,
              idToken,
              refreshToken: user.refreshToken,
            },
          };
        }
        
      } else if (result.type === 'cancel') {
        console.log('🚫 User cancelled Google sign-in');
        throw new Error('Google sign-in was cancelled by user');
      } else if (result.type === 'dismiss') {
        console.log('🚫 User dismissed Google sign-in');
        throw new Error('Google sign-in was dismissed');
      } else {
        console.log('❌ Unexpected auth result:', result);
        throw new Error('Authentication failed');
      }
      
    } catch (error) {
      console.error('❌ Firebase Google Auth Error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed',
      };
    }
  }

  /**
   * Sign out from Firebase
   */
  async signOut() {
    try {
      await firebaseSignOut(this.auth);
      console.log('✅ Firebase sign-out successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Firebase sign-out error:', error);
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;