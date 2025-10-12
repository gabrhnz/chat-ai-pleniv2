/**
 * Validation Middleware
 * 
 * Validación de requests usando express-validator.
 * Centraliza las reglas de validación para mantener consistencia.
 */

import { body, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

/**
 * Reglas de validación para el endpoint /chat
 */
export const validateChatRequest = [
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage('Message must be between 1 and 4000 characters'),
  
  body('context')
    .optional()
    .isArray()
    .withMessage('Context must be an array')
    .custom((context) => {
      // Validar estructura de cada mensaje en el contexto
      if (!Array.isArray(context)) return false;
      
      for (const msg of context) {
        if (typeof msg !== 'object' || !msg.role || !msg.content) {
          throw new Error('Each context message must have role and content');
        }
        
        if (!['system', 'user', 'assistant'].includes(msg.role)) {
          throw new Error('Role must be system, user, or assistant');
        }
        
        if (typeof msg.content !== 'string') {
          throw new Error('Message content must be a string');
        }
      }
      
      return true;
    }),
  
  body('context.*')
    .optional()
    .custom((msg) => {
      if (!msg.role || !msg.content) {
        throw new Error('Each message must have role and content');
      }
      return true;
    }),
  
  // Validaciones opcionales para escalabilidad futura
  body('sessionId')
    .optional()
    .isString()
    .withMessage('SessionId must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('SessionId must be between 1 and 100 characters'),
  
  body('userId')
    .optional()
    .isString()
    .withMessage('UserId must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('UserId must be between 1 and 100 characters'),
  
  /* 
   * TODO: Para internacionalización futura:
   * 
   * body('language')
   *   .optional()
   *   .isIn(['en', 'es', 'fr', 'de', 'it', 'pt'])
   *   .withMessage('Language must be a supported locale'),
   */
];

/**
 * Middleware para procesar resultados de validación
 * Lanza ValidationError si hay errores
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * Sanitización de entrada
 * Previene inyección y limpia datos
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body.message) {
    // Eliminar caracteres de control potencialmente problemáticos
    req.body.message = req.body.message
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
  }
  
  next();
};

export default {
  validateChatRequest,
  handleValidationErrors,
  sanitizeInput,
};

