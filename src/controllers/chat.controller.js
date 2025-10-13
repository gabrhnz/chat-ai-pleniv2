/**
 * Chat Controller
 * 
 * Maneja la lógica de negocio para los endpoints de chat.
 * Usa RAG (Retrieval-Augmented Generation) para responder con contexto de FAQs.
 */

import { processRAGQuery } from '../services/rag.service.js';
import openaiService from '../services/openai.service.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Controller para el endpoint POST /chat
 * Procesa mensajes del usuario y retorna respuestas del chatbot
 */
export const chatHandler = asyncHandler(async (req, res) => {
  let { message, sessionId, userId, streaming = false } = req.body;
  
  // Generar sessionId si no existe (para memoria de conversación)
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Log de la request (sin datos sensibles)
  logger.info('RAG chat request received', {
    messageLength: message.length,
    sessionId,
    userId: userId || 'anonymous',
    streaming,
    ip: req.ip,
  });
  
  // Process query using RAG pipeline
  const ragResponse = await processRAGQuery(message, {
    streaming,
    sessionId,
  });
  
  // Si es streaming, configurar SSE y stream la respuesta
  if (streaming && ragResponse.streaming) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send context/sources first
    res.write(`data: ${JSON.stringify({
      type: 'context',
      sources: ragResponse.sources,
    })}\n\n`);
    
    // Stream LLM response chunks
    for await (const chunk of ragResponse.streaming) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({
          type: 'chunk',
          content,
        })}\n\n`);
      }
    }
    
    // Send done signal
    res.write(`data: ${JSON.stringify({
      type: 'done',
      metadata: ragResponse.metadata,
    })}\n\n`);
    
    res.end();
    
  } else {
    // Regular JSON response (non-streaming)
    const responseData = {
      reply: ragResponse.answer,
      sessionId, // Retornar sessionId para que el frontend lo use
      sources: ragResponse.sources.map(faq => ({
        id: faq.id,
        question: faq.question,
        category: faq.category,
        similarity: faq.similarity,
      })),
      metadata: {
        ...ragResponse.metadata,
        timestamp: new Date().toISOString(),
      },
    };
    
    logger.info('RAG chat response sent', {
      sessionId,
      faqsUsed: ragResponse.sources.length,
      topSimilarity: ragResponse.metadata.topSimilarity,
      duration: ragResponse.metadata.duration,
    });
    
    res.status(200).json(responseData);
  }
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

