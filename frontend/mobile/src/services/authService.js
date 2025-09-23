import firebaseAuthService from './firebaseAuthService';

// Main auth service that can be extended with additional providers
class AuthService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
  }

  // Initialize auth service
  initialize() {
    return new Promise((resolve) => {
      const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
        this.user = user;
        this.isAuthenticated = !!user;
        unsubscribe(); // Only need this for initialization
        resolve(user);
      });
    });
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return firebaseAuthService.onAuthStateChanged((user) => {
      this.user = user;
      this.isAuthenticated = !!user;
      callback(user);
    });
  }

  // Get current user
  getCurrentUser() {
    return this.user || firebaseAuthService.getCurrentUser();
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Sign up with email and password
  async signUp(email, password, firstName, lastName) {
    const result = await firebaseAuthService.signUpWithEmailAndPassword(
      email, 
      password, 
      firstName, 
      lastName
    );
    
    if (result.success) {
      this.user = result.user;
      this.isAuthenticated = true;
    }
    
    return result;
  }

  // Sign in with email and password
  async signIn(email, password) {
    const result = await firebaseAuthService.signInWithEmailAndPassword(email, password);
    
    if (result.success) {
      this.user = result.user;
      this.isAuthenticated = true;
    }
    
    return result;
  }

  // Sign in with Google
  async signInWithGoogle() {
    const result = await firebaseAuthService.signInWithGoogle();
    
    if (result.success) {
      this.user = result.user;
      this.isAuthenticated = true;
    }
    
    return result;
  }

  // Sign out
  async signOut() {
    const result = await firebaseAuthService.signOut();
    
    if (result.success) {
      this.user = null;
      this.isAuthenticated = false;
    }
    
    return result;
  }

  // Reset password
  async resetPassword(email) {
    return await firebaseAuthService.resetPassword(email);
  }

  // Get user profile data
  getUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || null,
      emailVerified: user.emailVerified,
    };
  }

  // Update user profile
  async updateProfile(data) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No user logged in');

      await user.updateProfile(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new AuthService();