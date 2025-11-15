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

class PollinationService {
  constructor() {
    this.baseURL = '/pollination'; // Fixed: removed /api prefix since it's already in API_BASE_URL
  }

  // Get all pollination records
  async getPollinations(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString ? `${this.baseURL}?${queryString}` : this.baseURL;
      
      // Debug logging
      console.log('🔍 Fetching pollinations from:', `${API_BASE_URL}${url}`);
      console.log('🔑 Base URL:', API_BASE_URL);
      console.log('🛣️ Full URL:', url);
      
      // Check if token exists
      const token = await AsyncStorage.getItem('userToken');
      console.log('🎟️ Token exists:', !!token);
      
      const response = await api.get(url);
      console.log('✅ Successfully fetched pollinations:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching pollinations:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  }

  // Get single pollination record
  async getPollination(id) {
    try {
      const response = await api.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pollination:', error);
      throw error;
    }
  }

  // Create new pollination record
  async createPollination(data) {
    try {
      console.log('🌱 Creating pollination with data:', data);
      
      // If there's an image, we need to create the plant first, then add the image
      let imageData = null;
      if (data.image) {
        imageData = data.image;
        console.log('🖼️ Image will be uploaded after plant creation:', imageData);
        delete data.image; // Remove image from initial data
      }
      
      // Create the plant without image first
      console.log('🌱 Creating plant without image...');
      const response = await api.post(this.baseURL, data);
      const createdPlant = response.data.data;
      console.log('✅ Plant created:', createdPlant._id);
      
      // If there was an image, add it now
      if (imageData && createdPlant._id) {
        try {
          console.log('🖼️ Now uploading image...');
          const imageResponse = await this.addImage(createdPlant._id, imageData);
          console.log('✅ Image uploaded successfully:', imageResponse);
        } catch (imageError) {
          console.error('⚠️ Plant created but image upload failed:', imageError);
          console.error('⚠️ Image error details:', imageError.response?.data);
          // Don't throw error, plant was still created successfully
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating pollination:', error);
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  }

  // Update pollination record
  async updatePollination(id, data) {
    try {
      const response = await api.put(`${this.baseURL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating pollination:', error);
      throw error;
    }
  }

  // Delete pollination record
  async deletePollination(id) {
    try {
      const response = await api.delete(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting pollination:', error);
      throw error;
    }
  }

  // Add image to pollination record
  async addImage(id, imageData, caption, imageType = 'general') {
    try {
      console.log('🖼️ Adding image to plant:', id);
      console.log('🖼️ Image data:', imageData);
      
      const formData = new FormData();
      
      // Handle both file path and blob
      if (imageData.uri) {
        const imageObject = {
          uri: imageData.uri,
          type: imageData.type || 'image/jpeg',
          name: imageData.name || `image_${Date.now()}.jpg`,
        };
        
        console.log('🖼️ Image object for FormData:', imageObject);
        formData.append('image', imageObject);
      } else if (imageData instanceof File || imageData instanceof Blob) {
        formData.append('image', imageData, `image_${Date.now()}.jpg`);
      }
      
      if (caption) formData.append('caption', caption);
      if (imageType) formData.append('imageType', imageType);

      console.log('🖼️ Uploading to:', `${this.baseURL}/${id}/images`);

      const response = await api.post(
        `${this.baseURL}/${id}/images`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Image upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding image:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  // Delete image from pollination record
  async deleteImage(id, imageId) {
    try {
      const response = await api.delete(`${this.baseURL}/${id}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Add note to pollination record
  async addNote(id, content, type = 'observation') {
    try {
      const response = await api.post(`${this.baseURL}/${id}/notes`, {
        content,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  // Mark plant as flowering
  async markFlowering(id, gender, date) {
    try {
      const response = await api.post(`${this.baseURL}/${id}/flowering`, {
        gender,
        date
      });
      return response.data;
    } catch (error) {
      console.error('Error marking flowering:', error);
      throw error;
    }
  }

  // Mark plant as pollinated
  async markPollinated(id, date) {
    try {
      const response = await api.post(`${this.baseURL}/${id}/pollinate`, {
        date
      });
      return response.data;
    } catch (error) {
      console.error('Error marking pollination:', error);
      throw error;
    }
  }

  // Get plants needing attention
  async getPlantsNeedingAttention() {
    try {
      const response = await api.get(`${this.baseURL}/attention/needed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plants needing attention:', error);
      throw error;
    }
  }

  // Get upcoming pollinations
  async getUpcomingPollinations(days = 7) {
    try {
      const response = await api.get(`${this.baseURL}/upcoming/pollinations?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming pollinations:', error);
      throw error;
    }
  }

  // Get plant types
  async getPlantTypes() {
    try {
      const url = `${this.baseURL}/plant-types`;
      console.log('🌱 Fetching plant types from:', `${API_BASE_URL}${url}`);
      
      const response = await api.get(url);
      console.log('✅ Successfully fetched plant types:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching plant types:', error.response?.status, error.response?.data || error.message);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get(`${this.baseURL}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Helper method to format dates for API
  formatDate(date) {
    if (!date) return null;
    if (typeof date === 'string') return date;
    return date.toISOString();
  }

  // Helper method to calculate days between dates
  calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Helper method to format plant names for display
  formatPlantName(name, language = 'english') {
    const plantNames = {
      ampalaya: { english: 'Bitter Gourd', tagalog: 'Ampalaya' },
      patola: { english: 'Sponge Gourd', tagalog: 'Patola' },
      upo: { english: 'Bottle Gourd', tagalog: 'Upo' },
      kalabasa: { english: 'Squash', tagalog: 'Kalabasa' },
      kundol: { english: 'Winter Melon', tagalog: 'Kundol' },
    };

    return plantNames[name]?.[language] || name;
  }

  // Helper method to get status color
  getStatusColor(status) {
    const statusColors = {
      planted: '#FF9800',
      flowering: '#9C27B0',
      pollinated: '#2196F3',
      fruiting: '#4CAF50',
      harvested: '#8BC34A',
    };

    return statusColors[status] || '#757575';
  }

  // Helper method to get pollination status
  getPollinationStatus(estimatedDates, datePollinated) {
    if (datePollinated) return { status: 'completed', color: '#4CAF50' };
    
    const today = new Date();
    const earliest = new Date(estimatedDates?.pollinationWindow?.earliest);
    const latest = new Date(estimatedDates?.pollinationWindow?.latest);
    
    if (today >= earliest && today <= latest) {
      return { status: 'ready', color: '#4CAF50' };
    }
    
    if (today > latest) {
      return { status: 'overdue', color: '#F44336' };
    }
    
    if (earliest && today < earliest) {
      const daysUntil = this.calculateDaysBetween(today, earliest);
      if (daysUntil <= 3) {
        return { status: 'upcoming', color: '#FF9800' };
      }
      return { status: 'not_ready', color: '#757575' };
    }
    
    return { status: 'unknown', color: '#757575' };
  }
}

export const pollinationService = new PollinationService();