/**
 * Rate Limiting Middleware
 * 
 * Protege la API contra abuso y ataques DDoS limitando
 * el número de requests por IP en una ventana de tiempo.
 * 
 * Escalabilidad futura: Para producción con múltiples instancias,
 * considerar usar Redis como store compartido:
 * import RedisStore from 'rate-limit-redis';
 */

import rateLimit from 'express-rate-limit';
import config from '../config/environment.js';
import logger from '../utils/logger.js';

/**
 * Rate limiter para el endpoint de chat
 * Más restrictivo debido al costo de las llamadas a OpenAI
 */
export const chatRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true, // Retorna info en headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
  
  // Mensaje personalizado cuando se excede el límite
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: config.rateLimit.windowMs / 1000, // segundos
  },
  
  // Handler cuando se excede el límite
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
  
  // Skip en entorno de testing
  skip: (req) => config.server.env === 'test',
  
  /* 
   * TODO: Para producción escalable, usar Redis store:
   * 
   * store: new RedisStore({
   *   client: redisClient,
   *   prefix: 'rl:',
   * }),
   */
});

/**
 * Rate limiter general para otros endpoints (más permisivo)
 */
export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests * 2, // Más permisivo
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => config.server.env === 'test',
});

export default chatRateLimiter;

