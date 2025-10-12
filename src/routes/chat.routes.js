/**
 * Chat Routes
 * 
 * Define los endpoints relacionados con el chatbot.
 * Agrupa middleware de validación, rate limiting, y handlers.
 */

import express from 'express';
import { chatHandler, healthCheckHandler } from '../controllers/chat.controller.js';
import { 
  validateChatRequest, 
  handleValidationErrors,
  sanitizeInput,
} from '../middleware/validation.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/chat
 * 
 * Endpoint principal para interactuar con el chatbot.
 * 
 * Body:
 * {
 *   "message": "string (required)",
 *   "context": [{ role: "user|assistant|system", content: "string" }] (optional),
 *   "sessionId": "string" (optional),
 *   "userId": "string" (optional)
 * }
 * 
 * Response 200:
 * {
 *   "reply": "string",
 *   "usage": {
 *     "prompt_tokens": number,
 *     "completion_tokens": number,
 *     "total_tokens": number
 *   },
 *   "metadata": {
 *     "model": "string",
 *     "finishReason": "string",
 *     "timestamp": "ISO string"
 *   }
 * }
 */
router.post(
  '/chat',
  chatRateLimiter,           // Rate limiting
  sanitizeInput,             // Sanitización
  validateChatRequest,       // Validación
  handleValidationErrors,    // Procesar errores de validación
  chatHandler                // Handler principal
);

/**
 * GET /api/health
 * 
 * Health check para monitoreo y verificación del servicio.
 * 
 * Response 200:
 * {
 *   "status": "healthy|degraded",
 *   "timestamp": "ISO string",
 *   "services": { "openai": "connected|disconnected" },
 *   "uptime": number,
 *   "responseTime": "string"
 * }
 */
router.get('/health', healthCheckHandler);

/**
 * TODO: Endpoints adicionales para gestión de sesiones
 * 
 * GET /api/sessions/:sessionId/history
 * - Obtener historial de conversación
 * 
 * DELETE /api/sessions/:sessionId
 * - Limpiar sesión
 * 
 * GET /api/users/:userId/usage
 * - Obtener estadísticas de uso
 */

export default router;

