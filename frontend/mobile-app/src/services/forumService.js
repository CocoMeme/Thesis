import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all forum posts with optional filters
 */
export const getAllPosts = async (params = {}) => {
  try {
    const { category, search, tags, sortBy, page, limit, isPinned } = params;
    
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (tags) {
      if (Array.isArray(tags)) {
        tags.forEach(tag => queryParams.append('tags', tag));
      } else {
        queryParams.append('tags', tags);
      }
    }
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (isPinned !== undefined) queryParams.append('isPinned', isPinned);

    const response = await axios.get(
      `${API_BASE_URL}/forum/posts?${queryParams.toString()}`
    );

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch posts',
      error: error.message,
    };
  }
};

/**
 * Get single post by ID
 */
export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forum/posts/${postId}`);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch post',
      error: error.message,
    };
  }
};

/**
 * Create a new forum post
 */
export const createPost = async (postData) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(
      `${API_BASE_URL}/forum/posts`,
      postData,
      { headers }
    );

    return {
      success: true,
      message: 'Post created successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create post',
      error: error.message,
    };
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (postId, updateData) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.put(
      `${API_BASE_URL}/forum/posts/${postId}`,
      updateData,
      { headers }
    );

    return {
      success: true,
      message: 'Post updated successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error updating post:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update post',
      error: error.message,
    };
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.delete(
      `${API_BASE_URL}/forum/posts/${postId}`,
      { headers }
    );

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete post',
      error: error.message,
    };
  }
};

/**
 * Like or unlike a post
 */
export const toggleLike = async (postId) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(
      `${API_BASE_URL}/forum/posts/${postId}/like`,
      {},
      { headers }
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to toggle like',
      error: error.message,
    };
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (postId, content) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(
      `${API_BASE_URL}/forum/posts/${postId}/comments`,
      { content },
      { headers }
    );

    return {
      success: true,
      message: 'Comment added successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add comment',
      error: error.message,
    };
  }
};

/**
 * Get popular topics/tags
 */
export const getPopularTopics = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/forum/topics/popular?limit=${limit}`
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error fetching popular topics:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch topics',
      error: error.message,
    };
  }
};

/**
 * Get user's own posts (including pending)
 */
export const getMyPosts = async (params = {}) => {
  try {
    const headers = await getAuthHeaders();
    const { page, limit, status } = params;
    
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (status) queryParams.append('status', status);

    const response = await axios.get(
      `${API_BASE_URL}/forum/my-posts?${queryParams.toString()}`,
      { headers }
    );

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('Error fetching my posts:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch your posts',
      error: error.message,
    };
  }
};

/**
 * Report a post for inappropriate content
 */
export const reportPost = async (postId) => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await axios.post(
      `${API_BASE_URL}/forum/posts/${postId}/report`,
      {},
      { headers }
    );

    return {
      success: true,
      message: response.data.message || 'Post reported successfully',
    };
  } catch (error) {
    console.error('Error reporting post:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to report post',
      error: error.message,
    };
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getPopularTopics,
  getMyPosts,
  reportPost,
};
