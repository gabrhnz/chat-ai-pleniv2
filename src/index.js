/**
 * Main Application Entry Point
 * 
 * Configura y arranca el servidor Express con todos los middleware
 * y rutas necesarias para la API del chatbot.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/environment.js';
import logger, { httpLogger } from './utils/logger.js';
import chatRoutes from './routes/chat.routes.js';
import { 
  errorHandler, 
  notFoundHandler 
} from './middleware/errorHandler.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';

/**
 * Crea y configura la aplicación Express
 */
const createApp = () => {
  const app = express();
  
  // ============================================
  // Security & Performance Middleware
  // ============================================
  
  // Helmet: Protege contra vulnerabilidades comunes
  app.use(helmet());
  
  // CORS: Configurar orígenes permitidos
  app.use(cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);
      
      // Verificar si el origin está en la lista de permitidos
      if (config.security.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (config.server.isDevelopment) {
        // En desarrollo, permitir cualquier origin
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
  // ============================================
  // Request Processing Middleware
  // ============================================
  
  // Parse JSON bodies (con límite para prevenir payload grandes)
  app.use(express.json({ limit: '1mb' }));
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  
  // HTTP request logging
  app.use(httpLogger);
  
  // Rate limiting general (más permisivo que el específico de chat)
  app.use('/api', generalRateLimiter);
  
  // ============================================
  // Routes
  // ============================================
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Chatbot AI API - Backend Service',
      version: '1.0.0',
      status: 'operational',
      documentation: '/api/docs',
      endpoints: {
        chat: 'POST /api/chat',
        health: 'GET /api/health',
      },
    });
  });
  
  // API routes
  app.use('/api', chatRoutes);
  
  // ============================================
  // Error Handling
  // ============================================
  
  // 404 handler (debe estar después de todas las rutas)
  app.use(notFoundHandler);
  
  // Error handler global (debe ser el último middleware)
  app.use(errorHandler);
  
  return app;
};

/**
 * Inicia el servidor
 */
const startServer = () => {
  try {
    const app = createApp();
    const port = config.server.port;
    
    const server = app.listen(port, () => {
      logger.info('Server started successfully', {
        port,
        environment: config.server.env,
        nodeVersion: process.version,
        openaiModel: config.openai.model,
      });
      
      logger.info('API Endpoints available:', {
        root: `http://localhost:${port}/`,
        chat: `http://localhost:${port}/api/chat`,
        health: `http://localhost:${port}/api/health`,
      });
    });
    
    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        logger.info('Server closed. Process terminating...');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });
    
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

// Crear la instancia de la app para Vercel
const app = createApp();

// Iniciar servidor solo en desarrollo local (no en Vercel)
if (import.meta.url === `file://${process.argv[1]}` && !process.env.VERCEL) {
  startServer();
}

// Exportar para Vercel y testing
export { createApp, startServer };
export default app;

