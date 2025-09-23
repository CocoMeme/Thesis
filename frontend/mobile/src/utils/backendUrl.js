// Backend URL configuration
const BACKEND_CONFIG = {
  development: 'http://192.168.1.66:3000/api',
  production: 'https://your-production-api.com/api',
};

// Determine if we're in development or production
const isDevelopment = __DEV__;

export const BACKEND_URL = isDevelopment 
  ? BACKEND_CONFIG.development 
  : BACKEND_CONFIG.production;

export default BACKEND_URL;