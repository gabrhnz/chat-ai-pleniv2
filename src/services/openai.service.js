/**
 * OpenAI Service
 * 
 * Encapsula toda la lógica de comunicación con la API de OpenAI.
 * Facilita testing mediante inyección de dependencias y mocking.
 */

import OpenAI from 'openai';
import config from '../config/environment.js';
import logger from '../utils/logger.js';
import { OpenAIError } from '../middleware/errorHandler.js';

/**
 * Cliente de OpenAI singleton
 */
let openaiClient = null;

/**
 * Inicializa el cliente de OpenAI/OpenRouter
 * Lazy initialization para facilitar testing
 */
const getOpenAIClient = () => {
  if (!openaiClient) {
    if (!config.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    const clientConfig = {
      apiKey: config.openai.apiKey,
    };
    
    // Configuración específica para OpenRouter
    if (config.openai.useOpenRouter) {
      clientConfig.baseURL = config.openai.baseURL;
      clientConfig.defaultHeaders = config.openai.defaultHeaders;
      
      logger.info('Using OpenRouter', {
        baseURL: config.openai.baseURL,
        model: config.openai.model,
      });
    } else {
      logger.info('Using OpenAI directly', {
        model: config.openai.model,
      });
    }
    
    openaiClient = new OpenAI(clientConfig);
  }
  
  return openaiClient;
};

/**
 * Servicio principal de OpenAI
 */
class OpenAIService {
  /**
   * Genera una respuesta del chatbot usando GPT
   * 
   * @param {string} message - Mensaje del usuario
   * @param {Array} context - Array de mensajes previos (opcional)
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} Respuesta del chatbot con metadata
   */
  async generateChatResponse(message, context = [], options = {}) {
    const startTime = Date.now();
    
    try {
      const client = getOpenAIClient();
      
      // Construir array de mensajes para la API
      const messages = this.buildMessagesArray(message, context);
      
      // Configuración de la request
      const requestConfig = {
        model: options.model || config.openai.model,
        messages,
        max_tokens: options.maxTokens || config.openai.maxTokens,
        temperature: options.temperature ?? config.openai.temperature,
        // Usar stream: false para respuestas síncronas
        // TODO: Implementar streaming para respuestas en tiempo real
        stream: false,
      };
      
      logger.info('Sending request', {
        provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        model: requestConfig.model,
        messageCount: messages.length,
        maxTokens: requestConfig.max_tokens,
      });
      
      // Llamada a la API de OpenAI
      const completion = await client.chat.completions.create(requestConfig);
      
      const duration = Date.now() - startTime;
      
      // Extraer respuesta y metadata
      const response = {
        reply: completion.choices[0]?.message?.content || '',
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
        // Metadata adicional para monitoreo
        metadata: {
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        },
      };
      
      logger.info('Response received', {
        provider: response.metadata.provider,
        duration: `${duration}ms`,
        tokensUsed: response.usage.total_tokens,
        finishReason: response.finishReason,
      });
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Logging detallado del error
      logger.error('API error', {
        provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        duration: `${duration}ms`,
        errorType: error.type,
        errorCode: error.code,
        errorMessage: error.message,
        status: error.status,
      });
      
      // Transformar error de OpenAI en error de aplicación
      throw this.handleOpenAIError(error);
    }
  }
  
  /**
   * Construye el array de mensajes formateado para OpenAI
   * 
   * @param {string} message - Mensaje actual del usuario
   * @param {Array} context - Mensajes previos
   * @returns {Array} Array de mensajes formateado
   */
  buildMessagesArray(message, context = []) {
    const messages = [];
    
    // System prompt por defecto (puede ser customizado)
    // TODO: Externalizar system prompts para diferentes personalidades del bot
    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful, friendly, and knowledgeable AI assistant. ' +
               'Provide clear, accurate, and concise responses. ' +
               'If you don\'t know something, admit it rather than making up information.',
    };
    
    // Agregar system prompt si no existe en el contexto
    const hasSystemMessage = context.some(msg => msg.role === 'system');
    if (!hasSystemMessage) {
      messages.push(systemPrompt);
    }
    
    // Agregar contexto (limitado para evitar exceder límites de tokens)
    // TODO: Implementar token counting y truncamiento inteligente
    const maxContextMessages = 10;
    const limitedContext = context.slice(-maxContextMessages);
    messages.push(...limitedContext);
    
    // Agregar mensaje actual del usuario
    messages.push({
      role: 'user',
      content: message,
    });
    
    return messages;
  }
  
  /**
   * Maneja errores de OpenAI y los transforma en errores de aplicación
   * 
   * @param {Error} error - Error original de OpenAI
   * @returns {OpenAIError} Error transformado
   */
  handleOpenAIError(error) {
    // Errores comunes de OpenAI y cómo manejarlos
    const errorMappings = {
      'invalid_api_key': 'Invalid OpenAI API key',
      'insufficient_quota': 'OpenAI quota exceeded. Please try again later',
      'rate_limit_exceeded': 'OpenAI rate limit exceeded. Please try again later',
      'invalid_request_error': 'Invalid request to OpenAI API',
      'model_not_found': 'Requested OpenAI model not available',
    };
    
    const errorType = error.type || error.code;
    const message = errorMappings[errorType] || 'Error communicating with OpenAI service';
    
    return new OpenAIError(message, {
      type: errorType,
      originalMessage: error.message,
      status: error.status,
    });
  }
  
  /**
   * Valida que el servicio de OpenAI esté configurado correctamente
   * Útil para health checks
   * 
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const client = getOpenAIClient();
      // Hacer una llamada simple para verificar conectividad
      await client.models.list();
      return true;
    } catch (error) {
      logger.error('Health check failed', { 
        provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        error: error.message 
      });
      return false;
    }
  }
}

// Exportar instancia singleton
export default new OpenAIService();

