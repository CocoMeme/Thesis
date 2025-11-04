import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all published news
 */
export const getAllNews = async (params = {}) => {
  try {
    const response = await api.get('/news', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

/**
 * Get news by ID
 */
export const getNewsById = async (newsId) => {
  try {
    const response = await api.get(`/news/${newsId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
};

/**
 * Get popup news for logged-in user
 */
export const getPopupNews = async () => {
  try {
    const response = await api.get('/news/user/popup');
    return response.data;
  } catch (error) {
    console.error('Error fetching popup news:', error);
    throw error;
  }
};

/**
 * Get news by category
 */
export const getNewsByCategory = async (category, limit = 10) => {
  try {
    const response = await api.get(`/news/category/${category}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
};

/**
 * Mark news as read
 */
export const markNewsAsRead = async (newsId) => {
  try {
    const response = await api.post(`/news/${newsId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking news as read:', error);
    throw error;
  }
};

/**
 * Like news
 */
export const likeNews = async (newsId) => {
  try {
    const response = await api.post(`/news/${newsId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking news:', error);
    throw error;
  }
};

/**
 * Search news
 */
export const searchNews = async (query, limit = 20) => {
  try {
    const response = await api.get('/news', {
      params: { search: query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

export default {
  getAllNews,
  getNewsById,
  getPopupNews,
  getNewsByCategory,
  markNewsAsRead,
  likeNews,
  searchNews,
};
