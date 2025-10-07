const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  deleteAccount,
} = require('../controllers/localAuthController');
const { authenticateToken } = require('../middleware/googleAuth'); // We can reuse the JWT auth middleware
const { 
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validatePasswordChange 
} = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /auth/local/register
 * @desc    Register a new user with email and password
 * @access  Public
 */
router.post(
  '/register',
  [
    // Simple validation for required fields
    (req, res, next) => {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'First name and last name are required',
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      // Basic password validation
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      next();
    }
  ],
  register
);

/**
 * @route   POST /auth/local/login
 * @desc    Login user with email and password
 * @access  Public
 */
router.post(
  '/login',
  [
    // Simple validation for required fields
    (req, res, next) => {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      next();
    }
  ],
  login
);

/**
 * @route   POST /auth/local/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /auth/local/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   PUT /auth/local/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @route   PUT /auth/local/password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/password',
  authenticateToken,
  [
    // Simple validation for password change
    (req, res, next) => {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      next();
    }
  ],
  changePassword
);

/**
 * @route   DELETE /auth/local/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, deleteAccount);

module.exports = router;