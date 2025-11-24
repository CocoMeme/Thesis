import { API_BASE_URL } from '../config/api';
import { authService } from './authService';

class ChatbotService {
  /**
   * Send message to chatbot
   */
  async sendMessage(message, conversationHistory = []) {
    try {
      const token = await authService.getToken();
      
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      return {
        success: true,
        reply: data.data.reply,
        model: data.data.model,
        timestamp: data.data.timestamp
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send message'
      };
    }
  }

  /**
   * Get quick suggestions
   */
  async getSuggestions() {
    try {
      const token = await authService.getToken();
      
      const response = await fetch(`${API_BASE_URL}/chatbot/suggestions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get suggestions');
      }

      return {
        success: true,
        suggestions: data.data
      };
    } catch (error) {
      console.error('Get suggestions error:', error);
      return {
        success: false,
        suggestions: []
      };
    }
  }

  /**
   * Check chatbot status
   */
  async getStatus() {
    try {
      const token = await authService.getToken();
      
      const response = await fetch(`${API_BASE_URL}/chatbot/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check status');
      }

      return {
        success: true,
        available: data.data.available,
        status: data.data.status
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        available: false
      };
    }
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
