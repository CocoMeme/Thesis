// Backend URL configuration for the Gourd Scanner app

// Development URL (when running backend locally)
// Note: React Native can't access localhost, so we use the computer's IP address
// ⚠️ IMPORTANT: Each developer should set their own computer's IP address here
// To find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
// Updated to your current mobile-data IP while you're on that network
const DEV_URL = 'http://10.127.240.197:5000/api';

// Production URL (replace with your deployed backend URL)
// For now, we'll use the same as DEV_URL so preview builds work with local backend
const PROD_URL = 'http://10.127.240.197:5000/api';

// Environment detection
const isDevelopment = __DEV__; // React Native's built-in development flag

// Export the appropriate URL based on environment
// For preview/production builds, it will use PROD_URL
export const BACKEND_URL = isDevelopment ? DEV_URL : PROD_URL;

// Alternative: You can also manually set which URL to use
// export const BACKEND_URL = DEV_URL; // Uncomment this line to force development URL
// export const BACKEND_URL = PROD_URL; // Uncomment this line to force production URL

// Export individual URLs for flexibility
export { DEV_URL, PROD_URL };

// Default export
export default BACKEND_URL;
