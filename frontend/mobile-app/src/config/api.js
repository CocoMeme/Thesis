// ⚠️ SINGLE SOURCE OF TRUTH FOR API CONFIGURATION ⚠️
// To change the backend URL, ONLY edit the .env file:
// EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api

// Get API URL from environment variable with fallback
export const getApiUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.66:5000/api';
  return apiUrl;
};

// Export for direct use
export const API_BASE_URL = getApiUrl();

// Also export as BACKEND_URL for compatibility
export const BACKEND_URL = API_BASE_URL;

// Log the API URL in development
if (__DEV__) {
  console.log('📡 API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;
