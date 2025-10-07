const { googleOAuthConfig } = require('../config/googleOAuth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Handle Google OAuth authentication
 */
const googleOAuth = async (req, res) => {
  try {
    const { idToken, accessToken, demoUser } = req.body;

    if (!idToken && !accessToken && !demoUser) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token, access token, or demo user data is required',
      });
    }

    let userInfo;

    // Handle demo mode for development/testing
    if (demoUser && process.env.NODE_ENV === 'development') {
      console.log('🎭 Processing demo Google authentication:', demoUser.email);
      userInfo = {
        googleId: demoUser.id,
        email: demoUser.email,
        emailVerified: true,
        name: demoUser.name,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        picture: demoUser.picture,
      };
    }
    // Verify ID token if provided (preferred method)
    else if (idToken) {
      // Skip verification for demo tokens in development
      if (idToken.startsWith('demo_') && process.env.NODE_ENV === 'development') {
        return res.status(400).json({
          success: false,
          message: 'Demo mode requires demoUser data, not demo tokens',
        });
      }

      const verificationResult = await googleOAuthConfig.verifyIdToken(idToken);
      
      if (!verificationResult.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google ID token',
          error: verificationResult.error,
        });
      }
      
      userInfo = verificationResult.user;
    }
    // Fall back to access token
    else if (accessToken) {
      // Skip verification for demo tokens in development
      if (accessToken.startsWith('demo_') && process.env.NODE_ENV === 'development') {
        return res.status(400).json({
          success: false,
          message: 'Demo mode requires demoUser data, not demo tokens',
        });
      }

      const profileResult = await googleOAuthConfig.getUserProfile(accessToken);
      
      if (!profileResult.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google access token',
          error: profileResult.error,
        });
      }
      
      userInfo = profileResult.user;
    }

    // Check if user exists in local database
    let localUser = await User.findOne({ 
      $or: [
        { googleId: userInfo.googleId },
        { email: userInfo.email }
      ]
    });

    if (!localUser) {
      // Create new user from Google data
      localUser = new User({
        googleId: userInfo.googleId,
        email: userInfo.email,
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        profilePicture: userInfo.picture,
        emailVerified: userInfo.emailVerified || false,
        provider: 'google',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date(),
      });

      await localUser.save();
    } else {
      // Update existing user's last login and Google ID if needed
      localUser.lastLogin = new Date();
      if (!localUser.googleId) {
        localUser.googleId = userInfo.googleId;
      }
      if (!localUser.profilePicture && userInfo.picture) {
        localUser.profilePicture = userInfo.picture;
      }
      if (userInfo.emailVerified && !localUser.emailVerified) {
        localUser.emailVerified = userInfo.emailVerified;
      }
      await localUser.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: localUser._id,
        email: localUser.email,
        googleId: localUser.googleId,
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove sensitive information
    const userResponse = {
      id: localUser._id,
      email: localUser.email,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      profilePicture: localUser.profilePicture,
      emailVerified: localUser.emailVerified,
      provider: localUser.provider,
      createdAt: localUser.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: userResponse,
      token: jwtToken,
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Generate Google OAuth authorization URL
 */
const getAuthUrl = async (req, res) => {
  try {
    const { state } = req.query;
    
    const authUrlResult = googleOAuthConfig.generateAuthUrl(state);
    
    if (!authUrlResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authorization URL',
        error: authUrlResult.error,
      });
    }

    res.status(200).json({
      success: true,
      authUrl: authUrlResult.authUrl,
    });
  } catch (error) {
    console.error('Generate auth URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Handle OAuth callback (for web-based flows)
 */
const handleCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'OAuth authorization denied',
        error: error,
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      });
    }

    // Exchange code for tokens
    const tokenResult = await googleOAuthConfig.exchangeCodeForTokens(code);
    
    if (!tokenResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to exchange code for tokens',
        error: tokenResult.error,
      });
    }

    // Use the ID token to authenticate
    const { idToken } = tokenResult.tokens;
    
    // Call our own OAuth handler
    req.body = { idToken };
    return googleOAuth(req, res);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OAuth callback',
    });
  }
};

/**
 * Refresh user token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: userRefreshToken } = req.body;

    if (!userRefreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const refreshResult = await googleOAuthConfig.refreshAccessToken(userRefreshToken);
    
    if (!refreshResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Failed to refresh token',
        error: refreshResult.error,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      tokens: refreshResult.tokens,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh',
    });
  }
};

/**
 * Handle user logout (revoke tokens)
 */
const logout = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const { userId } = req;

    // Update user's last active timestamp
    if (userId) {
      await User.updateOne(
        { _id: userId },
        { lastActive: new Date() }
      );
    }

    // Revoke Google token if provided
    if (accessToken) {
      await googleOAuthConfig.revokeToken(accessToken);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
    });
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        googleId: user.googleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        emailVerified: user.emailVerified,
        provider: user.provider,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { user } = req;
    const { firstName, lastName, profilePicture } = req.body;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        googleId: user.googleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        emailVerified: user.emailVerified,
        provider: user.provider,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during profile update',
    });
  }
};

/**
 * Delete user account
 */
const deleteAccount = async (req, res) => {
  try {
    const { user } = req;
    const { accessToken } = req.body;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Revoke Google tokens
    if (accessToken) {
      await googleOAuthConfig.revokeToken(accessToken);
    }

    // Delete from local database
    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during account deletion',
    });
  }
};

module.exports = {
  googleOAuth,
  getAuthUrl,
  handleCallback,
  refreshToken,
  logout,
  getCurrentUser,
  updateProfile,
  deleteAccount,
};