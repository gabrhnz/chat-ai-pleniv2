/**
 * Error Handling Middleware
 * 
 * Middleware centralizado para manejo de errores que garantiza
 * respuestas JSON uniformes y logging apropiado.
 */

import logger from '../utils/logger.js';
import config from '../config/environment.js';

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distingue errores esperados de bugs
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Errores específicos pre-configurados para casos comunes
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class OpenAIError extends AppError {
  constructor(message, details = null) {
    super(message, 502, details);
    this.name = 'OpenAIError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404
  );
  next(error);
};

/**
 * Middleware principal de manejo de errores
 * Debe ser el último middleware en la cadena
 */
export const errorHandler = (err, req, res, next) => {
  // Valores por defecto
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;
  
  // Manejo específico de errores de OpenAI
  if (err.name === 'OpenAIError' || err.error?.type === 'invalid_request_error') {
    statusCode = 502;
    message = 'Error communicating with OpenAI service';
    
    // En desarrollo, mostrar más detalles
    if (config.server.isDevelopment) {
      details = {
        originalError: err.message,
        type: err.error?.type,
      };
    }
  }
  
  // Manejo de errores de validación de express-validator
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.array();
  }
  
  // Log del error
  const logData = {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };
  
  // Log con stack trace para errores 500
  if (statusCode >= 500) {
    logger.error('Server error', { ...logData, stack: err.stack });
  } else {
    logger.warn('Client error', logData);
  }
  
  // Construir respuesta
  const response = {
    error: message,
    ...(details && { details }),
    // Stack trace solo en desarrollo
    ...(config.server.isDevelopment && statusCode >= 500 && { stack: err.stack }),
  };
  
  res.status(statusCode).json(response);
};

/**
 * Wrapper para async handlers que propaga errores automáticamente
 * Evita tener try-catch en cada handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;

