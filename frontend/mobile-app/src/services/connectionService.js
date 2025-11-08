import axios from 'axios';
import { API_BASE_URL } from '../config/api';

/**
 * Check if the backend server is reachable
 * @returns {Promise<{connected: boolean, message: string}>}
 */
export const checkBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await axios.get(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      timeout: 5000,
    });

    clearTimeout(timeoutId);

    if (response.status === 200) {
      return {
        connected: true,
        message: 'Connected to backend successfully',
      };
    }

    return {
      connected: false,
      message: 'Backend returned unexpected status',
    };
  } catch (error) {
    console.error('Backend connection check failed:', error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        connected: false,
        message: 'Connection timeout - server not responding',
      };
    }

    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return {
        connected: false,
        message: 'Network error - please check your connection',
      };
    }

    return {
      connected: false,
      message: 'Unable to reach backend server',
    };
  }
};

/**
 * Attempt to reconnect to the backend with retries
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise<{success: boolean, attempts: number, message: string}>}
 */
export const reconnectToBackend = async (maxRetries = 3, delayMs = 2000) => {
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    console.log(`🔄 Reconnection attempt ${attempts}/${maxRetries}...`);

    const result = await checkBackendConnection();

    if (result.connected) {
      console.log('✅ Reconnected successfully!');
      return {
        success: true,
        attempts,
        message: 'Reconnected to backend',
      };
    }

    if (attempts < maxRetries) {
      console.log(`⏳ Waiting ${delayMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log('❌ Failed to reconnect after all attempts');
  return {
    success: false,
    attempts,
    message: 'Failed to reconnect to backend',
  };
};

/**
 * Test MongoDB connection through backend
 * @returns {Promise<{connected: boolean, message: string}>}
 */
export const checkDatabaseConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health/database`, {
      timeout: 5000,
    });

    return {
      connected: response.data.success,
      message: response.data.message || 'Database status checked',
    };
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    return {
      connected: false,
      message: 'Unable to verify database connection',
    };
  }
};

export default {
  checkBackendConnection,
  reconnectToBackend,
  checkDatabaseConnection,
};
