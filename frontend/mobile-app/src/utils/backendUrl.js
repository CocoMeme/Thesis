// Backend URL configuration for the Gourd Scanner app

// Development URL (when running backend locally)
// Note: React Native can't access localhost, so we use the computer's IP address
const DEV_URL = 'http://172.34.39.200:5000/api';

// Production URL (replace with your deployed backend URL)
const PROD_URL = 'https://your-production-domain.com/api';

// Environment detection
const isDevelopment = __DEV__; // React Native's built-in development flag

// Export the appropriate URL based on environment
export const BACKEND_URL = isDevelopment ? DEV_URL : PROD_URL;

// Alternative: You can also manually set which URL to use
// export const BACKEND_URL = DEV_URL; // Uncomment this line to force development URL
// export const BACKEND_URL = PROD_URL; // Uncomment this line to force production URL

// Export individual URLs for flexibility
export { DEV_URL, PROD_URL };

// Default export
export default BACKEND_URL;
