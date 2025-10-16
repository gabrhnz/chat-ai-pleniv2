/**
 * Environment Configuration
 * 
 * Centraliza la configuración de variables de entorno con validación.
 * Esto facilita el testing y evita accesos directos a process.env
 * esparcidos por todo el código.
 */

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Valida que las variables de entorno requeridas estén presentes
 * @throws {Error} Si falta alguna variable crítica
 */
const validateEnvironment = () => {
  const required = ['OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Variables de entorno faltantes: ${missing.join(', ')}. ` +
      `Por favor, configura tu archivo .env basándote en env.example`
    );
  }
};

// Validar al cargar el módulo
validateEnvironment();

/**
 * Configuración exportada con valores por defecto seguros
 */
export const config = {
  // OpenAI / OpenRouter
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.MAX_TOKENS || '100', 10),
    temperature: parseFloat(process.env.TEMPERATURE || '0.1'),
    // OpenRouter specific
    useOpenRouter: process.env.USE_OPENROUTER === 'true',
    baseURL: process.env.USE_OPENROUTER === 'true' 
      ? (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1')
      : undefined,
    defaultHeaders: process.env.USE_OPENROUTER === 'true'
      ? {
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:8080',
          'X-Title': process.env.OPENROUTER_APP_NAME || 'Chatbot-AI-API',
        }
      : {},
  },
  
  // Server
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // Security
  security: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'],
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  // Instagram Integration (opcional - solo si se configura)
  instagram: {
    // Token de acceso de la página de Instagram
    pageAccessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,
    // ID de la cuenta de Instagram Business
    accountId: process.env.INSTAGRAM_ACCOUNT_ID,
    // Token de verificación del webhook (lo defines tú)
    verifyToken: process.env.INSTAGRAM_VERIFY_TOKEN,
    // Si la integración está habilitada
    enabled: process.env.INSTAGRAM_ENABLED === 'true',
  },
  
  // ManyChat Integration (opcional - más fácil que Instagram)
  manychat: {
    // API Token de ManyChat
    apiToken: process.env.MANYCHAT_API_TOKEN,
    // Si la integración está habilitada
    enabled: process.env.MANYCHAT_ENABLED === 'true',
  },
};

export default config;

