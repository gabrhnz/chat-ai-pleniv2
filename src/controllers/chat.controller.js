/**
 * Chat Controller
 * 
 * Maneja la lógica de negocio para los endpoints de chat.
 * Orquesta la interacción entre el request, el servicio de OpenAI, y la respuesta.
 */

import openaiService from '../services/openai.service.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Controller para el endpoint POST /chat
 * Procesa mensajes del usuario y retorna respuestas del chatbot
 */
export const chatHandler = asyncHandler(async (req, res) => {
  const { message, context = [], sessionId, userId } = req.body;
  
  // Log de la request (sin datos sensibles)
  logger.info('Chat request received', {
    messageLength: message.length,
    contextLength: context.length,
    sessionId: sessionId || 'none',
    userId: userId || 'anonymous',
    ip: req.ip,
  });
  
  // TODO: Implementar gestión de sesiones
  // Si sessionId está presente, recuperar contexto desde base de datos/cache
  // if (sessionId) {
  //   const sessionContext = await sessionService.getContext(sessionId);
  //   context.push(...sessionContext);
  // }
  
  // TODO: Implementar tracking de uso por usuario
  // if (userId) {
  //   await usageService.trackRequest(userId);
  //   await usageService.checkQuota(userId);
  // }
  
  // Llamar al servicio de OpenAI
  const response = await openaiService.generateChatResponse(message, context);
  
  // TODO: Guardar conversación en base de datos para analytics/historial
  // if (sessionId) {
  //   await conversationService.saveMessage(sessionId, {
  //     userMessage: message,
  //     botReply: response.reply,
  //     timestamp: new Date(),
  //     tokens: response.usage,
  //   });
  // }
  
  // Construir respuesta
  const responseData = {
    reply: response.reply,
    usage: response.usage,
    // Información adicional útil para el cliente
    metadata: {
      model: response.model,
      finishReason: response.finishReason,
      timestamp: response.metadata.timestamp,
    },
  };
  
  // TODO: Para internacionalización, detectar idioma y ajustar respuesta
  // if (req.body.language) {
  //   responseData.language = req.body.language;
  // }
  
  logger.info('Chat response sent', {
    tokensUsed: response.usage.total_tokens,
    duration: response.metadata.duration,
  });
  
  res.status(200).json(responseData);
});

/**
 * Health check endpoint
 * Verifica que el servicio esté operativo y pueda conectarse a OpenAI
 */
export const healthCheckHandler = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  // Verificar conectividad con OpenAI
  const openaiStatus = await openaiService.healthCheck();
  
  const duration = Date.now() - startTime;
  
  const health = {
    status: openaiStatus ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      openai: openaiStatus ? 'connected' : 'disconnected',
    },
    uptime: process.uptime(),
    responseTime: `${duration}ms`,
  };
  
  const statusCode = openaiStatus ? 200 : 503;
  
  res.status(statusCode).json(health);
});

/**
 * TODO: Controller para obtener historial de conversación
 * 
 * export const getConversationHistory = asyncHandler(async (req, res) => {
 *   const { sessionId } = req.params;
 *   const history = await conversationService.getHistory(sessionId);
 *   res.status(200).json({ history });
 * });
 */

/**
 * TODO: Controller para limpiar/resetear sesión
 * 
 * export const clearSession = asyncHandler(async (req, res) => {
 *   const { sessionId } = req.params;
 *   await sessionService.clear(sessionId);
 *   res.status(200).json({ message: 'Session cleared' });
 * });
 */

export default {
  chatHandler,
  healthCheckHandler,
};

