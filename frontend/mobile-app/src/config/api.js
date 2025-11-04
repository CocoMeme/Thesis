// Centralized API configuration
import Constants from 'expo-constants';

// Get API URL from multiple sources with fallback
export const getApiUrl = () => {
  // Priority order:
  // 1. Environment variable
  // 2. Expo config extra
  // 3. Default fallback
  const apiUrl = 
    process.env.EXPO_PUBLIC_API_URL || 
    Constants.expoConfig?.extra?.apiUrl || 
    'http://192.168.1.66:5000/api';

  return apiUrl;
};

// Export for direct use
export const API_BASE_URL = getApiUrl();

// Log the API URL in development
if (__DEV__) {
  console.log('📡 API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;
