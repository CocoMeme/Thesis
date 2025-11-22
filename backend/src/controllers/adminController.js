const { User } = require('../models');
const mongoose = require('mongoose');

/**
 * Admin Controller
 * Handles admin dashboard operations including user management
 */

/**
 * Get admin dashboard overview
 * @route GET /api/admin/dashboard
 * @access Private/Admin
 */
exports.getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get active users count
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Get inactive users count
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    // Get new users in last 30 days
    const newUsers30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get new users in last 7 days
    const newUsers7Days = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get users by provider
    const usersByProvider = await User.aggregate([
      {
        $group: {
          _id: '$provider',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get verification stats
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });

    // Get recent registrations (last 10)
    const recentRegistrations = await User.find()
      .select('username email firstName lastName createdAt provider isActive')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: 'Dashboard overview retrieved successfully',
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          verifiedUsers,
          unverifiedUsers,
          newUsers30Days,
          newUsers7Days
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        usersByProvider: usersByProvider.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentRegistrations
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard overview',
      error: error.message
    });
  }
};

/**
 * Get all users with pagination, filtering, and sorting
 * @route GET /api/admin/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      provider = '',
      isActive = '',
      isEmailVerified = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};

    // Search by username, email, firstName, or lastName
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by provider
    if (provider) {
      filter.provider = provider;
    }

    // Filter by active status
    if (isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    // Filter by email verification status
    if (isEmailVerified !== '') {
      filter.isEmailVerified = isEmailVerified === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password -refreshTokens -verificationPin')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          usersPerPage: parseInt(limit),
          hasNextPage: skip + users.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

/**
 * Get user profile by ID
 * @route GET /api/admin/users/:userId
 * @access Private/Admin
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(userId)
      .select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    });
  }
};

/**
 * Update user details
 * @route PUT /api/admin/users/:userId
 * @access Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Prevent updating sensitive fields through this endpoint
    const restrictedFields = ['password', 'refreshTokens', 'verificationPin', '_id'];
    restrictedFields.forEach(field => delete updates[field]);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Activate user account
 * @route PATCH /api/admin/users/:userId/activate
 * @access Private/Admin
 */
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: true } },
      { new: true }
    ).select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User account activated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate user account',
      error: error.message
    });
  }
};

/**
 * Deactivate user account
 * @route PATCH /api/admin/users/:userId/deactivate
 * @access Private/Admin
 */
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Prevent admin from deactivating themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          isActive: false,
          ...(reason && { deactivationReason: reason })
        }
      },
      { new: true }
    ).select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Revoke all refresh tokens
    user.refreshTokens.forEach(token => {
      token.isActive = false;
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account deactivated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user account',
      error: error.message
    });
  }
};

/**
 * Suspend user account temporarily
 * @route PATCH /api/admin/users/:userId/suspend
 * @access Private/Admin
 */
exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration } = req.body; // duration in days

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Prevent admin from suspending themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot suspend your own account'
      });
    }

    const suspendUntil = duration 
      ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) 
      : null;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          isActive: false,
          suspendedAt: new Date(),
          suspendUntil,
          ...(reason && { suspensionReason: reason })
        }
      },
      { new: true }
    ).select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User account suspended${suspendUntil ? ` until ${suspendUntil.toISOString()}` : ''}`,
      data: { user }
    });

  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend user account',
      error: error.message
    });
  }
};

/**
 * Delete user account (soft delete or hard delete)
 * @route DELETE /api/admin/users/:userId
 * @access Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { permanent = false } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    if (permanent === 'true') {
      // Hard delete - permanently remove user
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User account permanently deleted',
        data: { userId }
      });
    } else {
      // Soft delete - just deactivate
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            isActive: false,
            deletedAt: new Date()
          }
        },
        { new: true }
      ).select('-password -refreshTokens -verificationPin');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User account deleted (soft delete)',
        data: { user }
      });
    }

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account',
      error: error.message
    });
  }
};

/**
 * Change user role
 * @route PATCH /api/admin/users/:userId/role
 * @access Private/Admin
 */
exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Validate role
    const validRoles = ['user', 'admin', 'researcher'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    ).select('-password -refreshTokens -verificationPin');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role changed to ${role} successfully`,
      data: { user }
    });

  } catch (error) {
    console.error('Change user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change user role',
      error: error.message
    });
  }
};

/**
 * Bulk update users
 * @route POST /api/admin/users/bulk-update
 * @access Private/Admin
 */
exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, action, value } = req.body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required'
      });
    }

    // Validate all ObjectIds
    const validIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more invalid user IDs'
      });
    }

    // Prevent admin from including themselves in bulk actions
    if (validIds.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You cannot perform bulk actions on your own account'
      });
    }

    let update = {};
    let message = '';

    switch (action) {
      case 'activate':
        update = { isActive: true };
        message = 'Users activated successfully';
        break;
      case 'deactivate':
        update = { isActive: false };
        message = 'Users deactivated successfully';
        break;
      case 'changeRole':
        if (!['user', 'admin', 'researcher'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid role value'
          });
        }
        update = { role: value };
        message = `Users role changed to ${value} successfully`;
        break;
      case 'verifyEmail':
        update = { isEmailVerified: true };
        message = 'Users email verified successfully';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await User.updateMany(
      { _id: { $in: validIds } },
      { $set: update }
    );

    res.status(200).json({
      success: true,
      message,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Bulk update users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk update',
      error: error.message
    });
  }
};

/**
 * Get user activity statistics
 * @route GET /api/admin/users/:userId/stats
 * @access Private/Admin
 */
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(userId)
      .select('stats loginCount lastLogin createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: {
        userId,
        stats: user.stats,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
        memberSince: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user statistics',
      error: error.message
    });
  }
};
