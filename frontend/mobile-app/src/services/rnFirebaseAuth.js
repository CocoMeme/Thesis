import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class ReactNativeFirebaseAuth {
  constructor() {
    this.configureGoogleSignIn();
  }

  /**
   * Configure Google Sign-In with your web client ID
   */
  configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: '615143258112-gnk282j6e2sauhqh7bvbsngmfsjna5rm.apps.googleusercontent.com', // Firebase auto-created web client
      offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  /**
   * Sign in with Google using React Native Firebase
   */
  async signInWithGoogle() {
    try {
      console.log('🚀 Starting React Native Firebase Google Sign-In...');

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      console.log('🔐 Getting Google user info...');
      const { idToken } = await GoogleSignin.signIn();

      console.log('✅ Got ID token, creating Firebase credential...');

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      console.log('🔥 Signing in to Firebase...');

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
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
        firebaseUser: user,
      };

    } catch (error) {
      console.error('❌ React Native Firebase Google Auth Error:', error);
      
      let errorMessage = 'Authentication failed';
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'The credential is invalid or has expired.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled for this project.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'The user account has been disabled.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password.';
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code,
      };
    }
  }

  /**
   * Sign out from Firebase and Google
   */
  async signOut() {
    try {
      console.log('🚪 Signing out from Firebase and Google...');
      
      // Sign out from Firebase
      await auth().signOut();
      
      // Sign out from Google
      await GoogleSignin.signOut();
      
      console.log('✅ Sign out successful');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Check if user is signed in
   */
  isSignedIn() {
    return auth().currentUser !== null;
  }

  /**
   * Create user with email and password
   */
  async createUserWithEmailAndPassword(email, password) {
    try {
      console.log('📝 Creating user with email and password...');
      
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('✅ User created successfully:', user.email);
      
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
        firebaseUser: user,
      };
      
    } catch (error) {
      console.error('❌ Create user error:', error);
      
      let errorMessage = 'Account creation failed';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters!';
      }
      
      return {
        success: false,
        error: errorMessage,
        code: error.code,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailAndPassword(email, password) {
    try {
      console.log('🔐 Signing in with email and password...');
      
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      console.log('✅ Sign in successful:', user.email);
      
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
        firebaseUser: user,
      };
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      let errorMessage = 'Sign in failed';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'User account has been disabled!';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with that email!';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password!';
      }
      
      return {
        success: false,
        error: errorMessage,
        code: error.code,
      };
    }
  }
}

export const rnFirebaseAuth = new ReactNativeFirebaseAuth();
export default rnFirebaseAuth;