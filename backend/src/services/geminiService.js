const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

// Initialize Gemini AI
let genAI;
let model;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

// System context for gourd farming expertise
const SYSTEM_CONTEXT = `You are an expert agricultural assistant specializing in gourd farming, particularly bottle gourds (Lagenaria siceraria). 
You provide helpful, accurate advice on:
- Gourd cultivation techniques and best practices
- Hand pollination methods and timing
- Pest and disease identification and management
- Soil preparation and fertilization
- Watering schedules and irrigation
- Harvesting and storage
- Growing season planning
- Troubleshooting common problems

Always provide practical, actionable advice. Keep responses concise but informative (2-4 paragraphs max unless asked for more detail). Use simple language suitable for farmers of all experience levels.`;

/**
 * Generate AI response using Gemini API
 */
async function generateMessage(prompt, conversationHistory = []) {
  if (!GEMINI_API_KEY || !model) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    // Build conversation history for context
    const history = [];
    
    // Add system context
    history.push({
      role: 'user',
      parts: [{ text: SYSTEM_CONTEXT }]
    });
    
    history.push({
      role: 'model',
      parts: [{ text: 'Understood. I\'m ready to help with gourd farming questions. What would you like to know?' }]
    });

    // Add recent conversation history (limit to last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      history.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || msg.content || msg.message || '' }]
      });
    }

    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
        topK: 40
      }
    });

    // Send message and get response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Log more details if available
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    // Provide fallback response
    return {
      success: false,
      message: 'I\'m having trouble connecting to the AI service right now. Please try again in a moment.',
      error: error.message,
      fallback: true
    };
  }
}

/**
 * Get quick suggestions for common topics
 */
function getQuickSuggestions() {
  return [
    'How do I hand-pollinate bottle gourds?',
    'What are common gourd pests?',
    'When is the best time to harvest?',
    'How often should I water my gourds?',
    'What soil is best for growing gourds?',
    'How do I identify male and female flowers?'
  ];
}

/**
 * Check if Gemini service is available
 */
function isAvailable() {
  return !!GEMINI_API_KEY;
}

module.exports = { 
  generateMessage,
  getQuickSuggestions,
  isAvailable
};