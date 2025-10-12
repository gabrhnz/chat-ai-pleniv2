/**
 * Logger Utility
 * 
 * Sistema de logging centralizado usando Winston.
 * Facilita el debugging y monitoreo en producción.
 */

import winston from 'winston';
import config from '../config/environment.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Formato personalizado para logs legibles
 */
const customFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  
  // Agregar stack trace para errores
  if (stack) {
    log += `\n${stack}`;
  }
  
  // Agregar metadata adicional si existe
  if (Object.keys(metadata).length > 0) {
    log += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return log;
});

/**
 * Configuración del logger
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Console transport con colores en desarrollo
    new winston.transports.Console({
      format: combine(
        colorize(),
        customFormat
      ),
    }),
    
    // File transports para producción
    ...(config.server.isProduction ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ] : []),
  ],
});

/**
 * Middleware de Express para logging de requests HTTP
 */
export const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log cuando la respuesta termina
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };
    
    // Log con nivel apropiado según status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });
  
  next();
};

export default logger;

