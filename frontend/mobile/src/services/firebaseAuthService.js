import auth, { getAuth, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { 
  GoogleSignin, 
  GoogleAuthProvider,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
  isCancelledResponse 
} from '@react-native-google-signin/google-signin';
import { googleSignInConfig } from '../config/firebase';

class FirebaseAuthService {
  constructor() {
    this.configureGoogleSignIn();
  }

  configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: googleSignInConfig.webClientId,
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction  
      forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`
      accountName: '', // [Android] specifies an account name on the device that should be used
      profileImageSize: 120, // [iOS] The desired height (and width) of the profile image
    });
  }

  // Get current user
  getCurrentUser() {
    return getAuth().currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  // Email/Password Sign Up
  async signUpWithEmailAndPassword(email, password, firstName, lastName) {
    try {
      const authInstance = getAuth();
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Email/Password Sign In
  async signInWithEmailAndPassword(email, password) {
    try {
      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Google Sign In - Following latest documentation with utility functions
  async signInWithGoogle() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const response = await GoogleSignin.signIn();
      
      // Use utility functions to handle different response types
      if (isSuccessResponse(response)) {
        // Get ID token from successful response
        const idToken = response.data.idToken;
        
        if (!idToken) {
          throw new Error('No ID token found in response');
        }

        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const userCredential = await signInWithCredential(getAuth(), googleCredential);
        const user = userCredential.user;

        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        };
      } else if (isCancelledResponse(response)) {
        return {
          success: false,
          error: 'Sign in was cancelled by user',
          cancelled: true,
        };
      } else {
        return {
          success: false,
          error: 'Unknown sign in response type',
        };
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            return {
              success: false,
              error: 'Sign in operation already in progress',
            };
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return {
              success: false,
              error: 'Google Play Services not available or outdated',
            };
          default:
            return {
              success: false,
              error: `Google Sign-In error: ${error.message}`,
            };
        }
      } else {
        return {
          success: false,
          error: this.handleAuthError(error),
        };
      }
    }
  }

  // Sign Out
  async signOut() {
    try {
      // Sign out from Google if signed in
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
      
      // Sign out from Firebase
      await auth().signOut();
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Silent Sign In - useful for checking if user is already signed in
  async signInSilently() {
    try {
      const response = await GoogleSignin.signInSilently();
      if (isSuccessResponse(response)) {
        return {
          success: true,
          user: response.data,
        };
      } else if (isNoSavedCredentialFoundResponse(response)) {
        return {
          success: false,
          error: 'No saved credentials found',
          noCredentials: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Check if user has previously signed in
  hasPreviousSignIn() {
    return GoogleSignin.hasPreviousSignIn();
  }

  // Get current Google user (synchronous)
  getCurrentGoogleUser() {
    return GoogleSignin.getCurrentUser();
  }

  // Revoke access - removes app from user's authorized applications
  async revokeGoogleAccess() {
    try {
      await GoogleSignin.revokeAccess();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  // Handle auth errors and return user-friendly messages
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email address is already in use by another account.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled.';
      case 'auth/weak-password':
        return 'Please choose a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        console.error('Auth error:', error);
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

export default new FirebaseAuthService();