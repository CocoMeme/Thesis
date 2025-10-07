const express = require('express');
const {
  googleOAuth,
  getAuthUrl,
  handleCallback,
  refreshToken,
  logout,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} = require('../controllers/googleAuthController');
const { 
  authenticateToken,
  authenticateGoogleToken,
  requireVerifiedEmail 
} = require('../middleware/googleAuth');
const { validateRequestBody } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /auth/google
 * @desc    Authenticate user with Google OAuth
 * @access  Public
 */
router.post(
  '/google',
  // Custom validation for Google OAuth (accepts idToken, accessToken, or demoUser)
  (req, res, next) => {
    const { idToken, accessToken, demoUser } = req.body;
    
    if (!idToken && !accessToken && !demoUser) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token, access token, or demo user data is required',
        code: 'MISSING_AUTH_DATA'
      });
    }

    next();
  },
  googleOAuth
);

/**
 * @route   GET /auth/google/url
 * @desc    Get Google OAuth authorization URL
 * @access  Public
 */
router.get('/google/url', getAuthUrl);

/**
 * @route   GET /auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', handleCallback);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  validateRequestBody(['refreshToken']),
  refreshToken
);

/**
 * @route   POST /auth/logout
 * @desc    Logout user and revoke tokens
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   PUT /auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticateToken,
  requireVerifiedEmail,
  updateProfile
);

/**
 * @route   DELETE /auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, deleteAccount);

// Alternative routes using Google ID token authentication
/**
 * @route   GET /auth/google/me
 * @desc    Get current user profile using Google ID token
 * @access  Private (Google ID Token)
 */
router.get('/google/me', authenticateGoogleToken, getCurrentUser);

/**
 * @route   PUT /auth/google/profile
 * @desc    Update user profile using Google ID token
 * @access  Private (Google ID Token)
 */
router.put(
  '/google/profile',
  authenticateGoogleToken,
  requireVerifiedEmail,
  updateProfile
);

module.exports = router;