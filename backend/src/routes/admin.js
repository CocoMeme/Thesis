const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateUserUpdate, validateBulkUpdate } = require('../middleware/validation');

/**
 * Admin Routes
 * All routes require authentication and admin role
 */

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

/**
 * Dashboard Routes
 */

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard overview with statistics
// @access  Private/Admin
router.get('/dashboard', adminController.getDashboardOverview);

/**
 * User Management Routes
 */

// @route   GET /api/admin/users
// @desc    Get all users with pagination, filtering, and sorting
// @access  Private/Admin
router.get('/users', adminController.getAllUsers);

// @route   GET /api/admin/users/:userId
// @desc    Get specific user profile by ID
// @access  Private/Admin
router.get('/users/:userId', adminController.getUserProfile);

// @route   PUT /api/admin/users/:userId
// @desc    Update user details
// @access  Private/Admin
router.put('/users/:userId', validateUserUpdate, adminController.updateUser);

// @route   PATCH /api/admin/users/:userId/activate
// @desc    Activate user account
// @access  Private/Admin
router.patch('/users/:userId/activate', adminController.activateUser);

// @route   PATCH /api/admin/users/:userId/deactivate
// @desc    Deactivate user account
// @access  Private/Admin
router.patch('/users/:userId/deactivate', adminController.deactivateUser);

// @route   PATCH /api/admin/users/:userId/suspend
// @desc    Suspend user account temporarily
// @access  Private/Admin
router.patch('/users/:userId/suspend', adminController.suspendUser);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user account (soft delete or permanent)
// @access  Private/Admin
router.delete('/users/:userId', adminController.deleteUser);

// @route   PATCH /api/admin/users/:userId/role
// @desc    Change user role
// @access  Private/Admin
router.patch('/users/:userId/role', adminController.changeUserRole);

// @route   GET /api/admin/users/:userId/stats
// @desc    Get user activity statistics
// @access  Private/Admin
router.get('/users/:userId/stats', adminController.getUserStats);

// @route   POST /api/admin/users/bulk-update
// @desc    Bulk update multiple users
// @access  Private/Admin
router.post('/users/bulk-update', validateBulkUpdate, adminController.bulkUpdateUsers);

module.exports = router;
