#!/bin/bash

# Script para configurar OpenRouter

clear
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║        🌐 Configuración de OpenRouter                 ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "OpenRouter te permite usar OpenAI desde CUALQUIER país,"
echo "sin VPN y con acceso a múltiples modelos de IA."
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Paso 1: Verificar si ya tiene una key
if [ -f .env ]; then
    if grep -q "USE_OPENROUTER=true" .env 2>/dev/null; then
        echo "⚠️  Ya tienes OpenRouter configurado."
        echo ""
        read -p "¿Quieres reconfigurar? (s/n): " RECONFIG
        if [ "$RECONFIG" != "s" ]; then
            echo "Cancelado."
            exit 0
        fi
    fi
fi

# Paso 2: Instrucciones
echo "📝 Paso 1: Obtener API Key de OpenRouter"
echo ""
echo "1. Ve a: https://openrouter.ai/"
echo "2. Sign up / Login (puedes usar Google/GitHub)"
echo "3. Ve a la sección 'Keys'"
echo "4. Click en 'Create Key'"
echo "5. Copia tu API key (empieza con sk-or-...)"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

read -p "¿Ya tienes tu API key de OpenRouter? (s/n): " HAS_KEY

if [ "$HAS_KEY" != "s" ]; then
    echo ""
    echo "📱 Abriendo OpenRouter en tu navegador..."
    sleep 2
    
    # Abrir en navegador según OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "https://openrouter.ai/keys"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "https://openrouter.ai/keys" 2>/dev/null || echo "Por favor ve a: https://openrouter.ai/keys"
    else
        echo "Por favor ve a: https://openrouter.ai/keys"
    fi
    
    echo ""
    read -p "Presiona Enter cuando tengas tu API key..."
fi

# Paso 3: Ingresar API Key
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🔑 Paso 2: Ingresar API Key"
echo ""
echo "Pega tu API key de OpenRouter (no se mostrará mientras escribes):"
read -s OPENROUTER_KEY

if [ -z "$OPENROUTER_KEY" ]; then
    echo ""
    echo "❌ No ingresaste ninguna API key"
    exit 1
fi

# Validar formato
if [[ ! "$OPENROUTER_KEY" =~ ^sk-or-.+ ]]; then
    echo ""
    echo "⚠️  Advertencia: La API key no tiene el formato esperado (sk-or-...)"
    echo "Las API keys de OpenRouter suelen empezar con 'sk-or-'"
    echo ""
    read -p "¿Continuar de todas formas? (s/n): " CONTINUE
    if [ "$CONTINUE" != "s" ]; then
        exit 1
    fi
fi

# Paso 4: Elegir modelo
echo ""
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🤖 Paso 3: Elegir Modelo de IA"
echo ""
echo "OpenRouter te da acceso a muchos modelos:"
echo ""
echo "1) openai/gpt-3.5-turbo    (Rápido, $0.002/1K tokens)"
echo "2) openai/gpt-4            (Potente, $0.03/1K tokens)"
echo "3) anthropic/claude-3-sonnet (Excelente, $0.003/1K tokens)"
echo "4) google/gemini-pro       (A menudo gratis)"
echo "5) meta-llama/llama-3-70b  (Open source, $0.0007/1K tokens)"
echo "6) Personalizado"
echo ""
read -p "Elige una opción (1-6) [1]: " MODEL_CHOICE

case $MODEL_CHOICE in
    2)
        MODEL="openai/gpt-4"
        ;;
    3)
        MODEL="anthropic/claude-3-sonnet"
        ;;
    4)
        MODEL="google/gemini-pro"
        ;;
    5)
        MODEL="meta-llama/llama-3-70b"
        ;;
    6)
        echo ""
        read -p "Ingresa el nombre del modelo: " MODEL
        ;;
    *)
        MODEL="openai/gpt-3.5-turbo"
        ;;
esac

# Paso 5: Crear/actualizar .env
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "💾 Configurando .env..."

# Backup
if [ -f .env ]; then
    cp .env .env.backup.$(date +%s)
    echo "✅ Backup creado"
fi

# Crear .env con OpenRouter
cat > .env << EOF
# OpenRouter Configuration (funciona desde cualquier país)
OPENAI_API_KEY=$OPENROUTER_KEY
USE_OPENROUTER=true
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Modelo seleccionado
OPENAI_MODEL=$MODEL

# App Info (para analytics en OpenRouter)
OPENROUTER_APP_NAME=Chatbot-AI-API
OPENROUTER_SITE_URL=http://localhost:8080

# Server Configuration
PORT=8080
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OpenAI Request Configuration
MAX_TOKENS=500
TEMPERATURE=0.7

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
EOF

echo "✅ Archivo .env actualizado"

# Paso 6: Actualizar código
echo ""
echo "🔧 Actualizando código para OpenRouter..."

# Actualizar environment.js para soportar OpenRouter
cat > src/config/environment.js << 'ENVEOF'
/**
 * Environment Configuration
 * 
 * Centraliza la configuración de variables de entorno con validación.
 * Soporta OpenAI directo y OpenRouter.
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
    maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
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
};

export default config;
ENVEOF

# Actualizar openai.service.js
cat > src/services/openai.service.js << 'SERVICEEOF'
/**
 * OpenAI / OpenRouter Service
 * 
 * Encapsula toda la lógica de comunicación con OpenAI o OpenRouter.
 * Soporta ambos de manera transparente.
 */

import OpenAI from 'openai';
import config from '../config/environment.js';
import logger from '../utils/logger.js';
import { OpenAIError } from '../middleware/errorHandler.js';

/**
 * Cliente de OpenAI/OpenRouter singleton
 */
let openaiClient = null;

/**
 * Inicializa el cliente
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
 * Servicio principal
 */
class OpenAIService {
  async generateChatResponse(message, context = [], options = {}) {
    const startTime = Date.now();
    
    try {
      const client = getOpenAIClient();
      const messages = this.buildMessagesArray(message, context);
      
      const requestConfig = {
        model: options.model || config.openai.model,
        messages,
        max_tokens: options.maxTokens || config.openai.maxTokens,
        temperature: options.temperature ?? config.openai.temperature,
        stream: false,
      };
      
      logger.info('Sending request', {
        provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        model: requestConfig.model,
        messageCount: messages.length,
        maxTokens: requestConfig.max_tokens,
      });
      
      const completion = await client.chat.completions.create(requestConfig);
      const duration = Date.now() - startTime;
      
      const response = {
        reply: completion.choices[0]?.message?.content || '',
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason,
        metadata: {
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        },
      };
      
      logger.info('Response received', {
        duration: `${duration}ms`,
        tokensUsed: response.usage.total_tokens,
        provider: response.metadata.provider,
      });
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('API error', {
        provider: config.openai.useOpenRouter ? 'OpenRouter' : 'OpenAI',
        duration: `${duration}ms`,
        errorType: error.type,
        errorCode: error.code,
        errorMessage: error.message,
        status: error.status,
      });
      
      throw this.handleOpenAIError(error);
    }
  }
  
  buildMessagesArray(message, context = []) {
    const messages = [];
    
    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful, friendly, and knowledgeable AI assistant. ' +
               'Provide clear, accurate, and concise responses. ' +
               'If you don\'t know something, admit it rather than making up information.',
    };
    
    const hasSystemMessage = context.some(msg => msg.role === 'system');
    if (!hasSystemMessage) {
      messages.push(systemPrompt);
    }
    
    const maxContextMessages = 10;
    const limitedContext = context.slice(-maxContextMessages);
    messages.push(...limitedContext);
    
    messages.push({
      role: 'user',
      content: message,
    });
    
    return messages;
  }
  
  handleOpenAIError(error) {
    const errorMappings = {
      'invalid_api_key': 'Invalid API key',
      'insufficient_quota': 'OpenAI quota exceeded. Please try again later',
      'rate_limit_exceeded': 'Rate limit exceeded. Please try again later',
      'invalid_request_error': 'Invalid request to OpenAI API',
      'model_not_found': 'Requested model not available',
    };
    
    const errorType = error.type || error.code;
    const message = errorMappings[errorType] || 'Error communicating with OpenAI service';
    
    return new OpenAIError(message, {
      type: errorType,
      originalMessage: error.message,
      status: error.status,
    });
  }
  
  async healthCheck() {
    try {
      const client = getOpenAIClient();
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

export default new OpenAIService();
SERVICEEOF

echo "✅ Código actualizado"

# Paso 7: Instrucciones finales
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "🚀 Próximos pasos:"
echo ""
echo "1. Detén el servidor si está corriendo (Ctrl+C)"
echo "2. Inicia el servidor:"
echo "   npm start"
echo ""
echo "3. Prueba el chatbot:"
echo "   curl -X POST http://localhost:8080/api/chat \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"Hola!\"}'"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Configuración aplicada:"
echo "   Provider: OpenRouter"
echo "   Modelo: $MODEL"
echo "   Puerto: 8080"
echo ""
echo "💡 Ventajas:"
echo "   ✅ Funciona desde cualquier país"
echo "   ✅ Sin necesidad de VPN"
echo "   ✅ Acceso a múltiples modelos"
echo ""
echo "📚 Documentación: OPENROUTER_SETUP.md"
echo ""

