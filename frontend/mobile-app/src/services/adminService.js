import { API_BASE_URL } from '../config/api';
import { authService } from './authService';

class AdminService {
  /**
   * Get admin dashboard overview
   */
  async getDashboardOverview() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error('Dashboard overview error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard data',
      };
    }
  }

  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.provider) queryParams.append('provider', params.provider);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
      if (params.isEmailVerified !== undefined) queryParams.append('isEmailVerified', params.isEmailVerified);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return {
        success: true,
        users: data.data.users,
        pagination: data.data.pagination,
      };
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch users',
      };
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch user profile',
      };
    }
  }

  /**
   * Update user details
   */
  async updateUser(userId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update user',
      };
    }
  }

  /**
   * Activate user account
   */
  async activateUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to activate user');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Activate user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to activate user',
      };
    }
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(userId, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to deactivate user');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Deactivate user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to deactivate user',
      };
    }
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId, reason = '', duration = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ reason, duration }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to suspend user');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Suspend user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to suspend user',
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId, permanent = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}?permanent=${permanent}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete user',
      };
    }
  }

  /**
   * Change user role
   */
  async changeUserRole(userId, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change user role');
      }

      return {
        success: true,
        user: data.data.user,
      };
    } catch (error) {
      console.error('Change user role error:', error);
      return {
        success: false,
        message: error.message || 'Failed to change user role',
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/stats`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user stats');
      }

      return {
        success: true,
        stats: data.data,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch user stats',
      };
    }
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(userIds, action, value = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/bulk-update`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ userIds, action, value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to bulk update users');
      }

      return {
        success: true,
        modifiedCount: data.data.modifiedCount,
        matchedCount: data.data.matchedCount,
      };
    } catch (error) {
      console.error('Bulk update users error:', error);
      return {
        success: false,
        message: error.message || 'Failed to bulk update users',
      };
    }
  }
}

// Create and export singleton instance
export const adminService = new AdminService();

// Export class for testing
export { AdminService };
