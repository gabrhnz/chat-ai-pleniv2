/**
 * ManyChat Routes
 * 
 * Define los endpoints para ManyChat Dynamic Blocks.
 * ManyChat hace POST requests a estos endpoints cuando un usuario interactúa.
 * 
 * Documentación: https://manychat.github.io/dynamic_block_docs/
 */

import express from 'express';
import webhookHandler from '../integrations/manychat/webhook.handler.js';
import logger from '../utils/logger.js';
import config from '../config/environment.js';

const router = express.Router();

/**
 * POST /api/manychat/webhook
 * 
 * Endpoint principal para ManyChat Dynamic Blocks.
 * ManyChat envía un POST aquí cuando:
 * - Un usuario envía un mensaje
 * - Se activa un Dynamic Block
 * 
 * ManyChat espera una respuesta en formato específico:
 * {
 *   "version": "v2",
 *   "content": {
 *     "messages": [
 *       { "type": "text", "text": "Respuesta del bot" }
 *     ]
 *   }
 * }
 */
router.post('/webhook', async (req, res) => {
  try {
    logger.info('ManyChat webhook request received', {
      subscriberId: req.body.subscriber_id,
      hasUserInput: !!req.body.user_input
    });

    // Procesar el Dynamic Block
    const response = await webhookHandler.handleDynamicBlock(req.body);

    // Retornar respuesta en formato ManyChat
    res.json(response);

    logger.info('ManyChat webhook response sent', {
      subscriberId: req.body.subscriber_id,
      messagesCount: response.content?.messages?.length || 0
    });

  } catch (error) {
    logger.error('Error in ManyChat webhook endpoint', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    // Enviar respuesta de error en formato ManyChat
    res.json({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'text',
            text: '😔 Lo siento, tuve un problema. ¿Podrías intentar de nuevo?'
          }
        ]
      }
    });
  }
});

/**
 * GET /api/manychat/status
 * 
 * Endpoint para verificar el estado de la integración de ManyChat.
 * Útil para debugging y monitoreo.
 */
router.get('/status', (req, res) => {
  const isConfigured = !!config.manychat?.apiToken;

  res.json({
    status: 'ok',
    integration: 'manychat',
    configured: isConfigured,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/manychat/test
 * 
 * Endpoint de prueba para simular un request de ManyChat.
 * Útil para testing sin necesidad de ManyChat.
 */
router.post('/test', async (req, res) => {
  try {
    const testPayload = {
      subscriber_id: req.body.subscriber_id || 'test_user_123',
      first_name: req.body.first_name || 'Test',
      last_name: req.body.last_name || 'User',
      user_input: req.body.user_input || req.body.message || '¿Cuándo son las inscripciones?'
    };

    logger.info('ManyChat test request', { testPayload });

    const response = await webhookHandler.handleDynamicBlock(testPayload);

    res.json({
      success: true,
      request: testPayload,
      response: response
    });

  } catch (error) {
    logger.error('Error in ManyChat test endpoint', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
