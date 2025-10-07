import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../utils/backendUrl';
import { googleAuthService } from './googleAuthService';

// Configuration
const API_BASE_URL = BACKEND_URL;
const TOKEN_KEY = 'userToken';
const USER_KEY = 'user';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  /**
   * Initialize the auth service by loading stored credentials
   */
  async initialize() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const user = await AsyncStorage.getItem(USER_KEY);
      
      this.token = token;
      this.user = user ? JSON.parse(user) : null;
      
      return !!token;
    } catch (error) {
      console.error('Error initializing auth service:', error);
      return false;
    }
  }

  /**
   * Login with email and password (Local authentication using MongoDB)
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/local/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store credentials
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      this.token = data.token;
      this.user = data.user;

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  }

  /**
   * Register a new user (Local registration using MongoDB)
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          email: userData.email.toLowerCase().trim(),
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store credentials
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      this.token = data.token;
      this.user = data.user;

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  }

  /**
   * Google Sign-In
   */
  async signInWithGoogle() {
    try {
      // Use Google Auth Service to get user data
      const googleResult = await googleAuthService.signInWithGoogle();

      if (!googleResult.success) {
        return {
          success: false,
          message: googleResult.error || 'Google Sign-In failed',
        };
      }

      // Send Google user data to your backend for verification and user creation/login
      const payload = {
        idToken: googleResult.tokens.idToken,
        accessToken: googleResult.tokens.accessToken,
      };

      // Add demo user data if in demo mode (for development)
      if (googleResult.tokens.idToken?.startsWith('demo_')) {
        payload.demoUser = googleResult.user;
      }

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Server authentication failed',
        };
      }

      // Store credentials
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

      this.token = data.token;
      this.user = data.user;

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        message: error.message || 'Google Sign-In failed',
      };
    }
  }

  /**
   * Logout and clear stored credentials
   */
  async logout() {
    try {
      // Call logout endpoint if token exists
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/local/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    }

    // Clear local storage
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    this.token = null;
    this.user = null;

    return true;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Get current user data
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get current auth token
   */
  getToken() {
    return this.token;
  }

  /**
   * Get authorization headers for API calls
   */
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Refresh user token using Google OAuth refresh token
   */
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      return {
        success: true,
        tokens: data.tokens,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await this.logout();
      return {
        success: false,
        message: error.message || 'Token refresh failed',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/auth/local/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update stored user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      this.user = data.user;

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: error.message || 'Profile update failed',
      };
    }
  }

  /**
   * Change password for local accounts
   */
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/auth/local/password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return {
        success: true,
        message: data.message || 'Password changed successfully',
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        message: error.message || 'Password change failed',
      };
    }
  }

  /**
   * Request password reset (to be implemented)
   */
  async requestPasswordReset(email) {
    try {
      // This would typically send a password reset email
      // For now, return a placeholder response
      return {
        success: false,
        message: 'Password reset functionality is not yet implemented. Please contact support for assistance.',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: error.message || 'Password reset request failed',
      };
    }
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(endpoint, options = {}) {
    try {
      if (!this.token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      // Handle token expiration
      if (response.status === 401) {
        const refreshResult = await this.refreshToken();
        if (!refreshResult.success) {
          throw new Error('Authentication expired');
        }

        // Retry with new token
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...this.getAuthHeaders(),
            ...options.headers,
          },
        });
      }

      return response;
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  }

  /**
   * Get Google OAuth configuration status
   */
  getGoogleAuthStatus() {
    return googleAuthService.getConfigurationStatus();
  }

  /**
   * Check if Google OAuth is configured
   */
  isGoogleAuthConfigured() {
    return googleAuthService.isConfigured();
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService };