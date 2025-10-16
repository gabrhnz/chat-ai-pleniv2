/**
 * Instagram Webhook Handler
 * 
 * Este archivo maneja los webhooks que Instagram envía cuando:
 * - Un usuario envía un mensaje
 * - Un mensaje es entregado
 * - Un mensaje es leído
 * 
 * ¿Cómo funciona un webhook?
 * Instagram hace una petición HTTP POST a tu servidor cada vez que pasa algo.
 * Nosotros procesamos esa petición y respondemos al usuario.
 * 
 * Documentación: https://developers.facebook.com/docs/messenger-platform/webhooks
 */

import logger from '../../utils/logger.js';
import instagramService from './instagram.service.js';
import messageFormatter from './message.formatter.js';
import { processRAGQuery } from '../../services/rag.service.js';

class InstagramWebhookHandler {
  /**
   * Verifica el webhook durante la configuración inicial
   * Meta envía un GET request con un token de verificación
   * 
   * @param {Object} query - Query parameters del request
   * @returns {string|null} Challenge token si es válido
   */
  verifyWebhook(query, verifyToken) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // Verificar que el token coincida con el configurado
    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('Instagram webhook verified successfully');
      return challenge;
    }

    logger.warn('Instagram webhook verification failed', { mode, token });
    return null;
  }

  /**
   * Procesa los eventos que Instagram envía
   * 
   * @param {Object} body - Cuerpo del webhook
   * @returns {Promise<void>}
   */
  async handleWebhook(body) {
    try {
      // Instagram envía un array de "entries" (eventos)
      if (!body.object || body.object !== 'instagram') {
        logger.warn('Received non-Instagram webhook', { object: body.object });
        return;
      }

      // Procesar cada entry
      for (const entry of body.entry) {
        // Cada entry puede tener múltiples mensajes
        const messaging = entry.messaging || [];

        for (const event of messaging) {
          await this.handleMessagingEvent(event);
        }
      }
    } catch (error) {
      logger.error('Error handling Instagram webhook', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Procesa un evento individual de mensajería
   * 
   * @param {Object} event - Evento de Instagram
   * @returns {Promise<void>}
   */
  async handleMessagingEvent(event) {
    const senderId = event.sender?.id;
    const recipientId = event.recipient?.id;

    if (!senderId) {
      logger.warn('Received event without sender ID', { event });
      return;
    }

    // Diferentes tipos de eventos
    if (event.message) {
      await this.handleMessage(senderId, event.message);
    } else if (event.postback) {
      await this.handlePostback(senderId, event.postback);
    } else if (event.read) {
      // El usuario leyó nuestro mensaje - solo lo registramos
      logger.debug('Message read by user', { senderId });
    } else {
      logger.debug('Unhandled event type', { event });
    }
  }

  /**
   * Procesa un mensaje de texto del usuario
   * AQUÍ ES DONDE CONECTAMOS CON TU SISTEMA RAG EXISTENTE
   * 
   * @param {string} senderId - ID del usuario de Instagram
   * @param {Object} message - Objeto del mensaje
   * @returns {Promise<void>}
   */
  async handleMessage(senderId, message) {
    try {
      // Extraer el texto del mensaje
      const messageText = message.text;

      if (!messageText) {
        logger.debug('Received non-text message', { senderId, message });
        return;
      }

      logger.info('Processing Instagram message', {
        senderId,
        messageText: messageText.substring(0, 100) // Log solo primeros 100 chars
      });

      // 1. Marcar como leído inmediatamente
      await instagramService.markAsRead(senderId);

      // 2. Mostrar indicador de "escribiendo..."
      await instagramService.sendTypingIndicator(senderId);

      // 3. Obtener o crear sesión de conversación
      // Usamos el senderId como user_id para mantener contexto
      const sessionId = `instagram_${senderId}`;

      // 4. AQUÍ USAMOS TU SERVICIO RAG EXISTENTE
      // No necesitamos modificar nada del RAG, solo lo llamamos
      const ragResponse = await processRAGQuery(messageText, {
        sessionId,
        metadata: {
          platform: 'instagram',
          userId: senderId
        }
      });

      // 5. Formatear la respuesta para Instagram
      // Instagram tiene límites y formato diferente que web
      const formattedResponse = messageFormatter.formatForInstagram(
        ragResponse.answer,
        ragResponse.sources
      );

      // 6. Enviar la respuesta al usuario
      await instagramService.sendMessage(senderId, formattedResponse);

      logger.info('Instagram message processed successfully', {
        senderId,
        responseLength: formattedResponse.length,
        sourcesCount: ragResponse.sources?.length || 0
      });

    } catch (error) {
      logger.error('Error processing Instagram message', {
        senderId,
        error: error.message,
        stack: error.stack
      });

      // Enviar mensaje de error amigable al usuario
      try {
        await instagramService.sendMessage(
          senderId,
          '😔 Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentar de nuevo?'
        );
      } catch (sendError) {
        logger.error('Failed to send error message', { sendError });
      }
    }
  }

  /**
   * Procesa un postback (cuando el usuario hace clic en un botón)
   * Por ahora solo lo registramos, pero puedes expandir esto
   * 
   * @param {string} senderId - ID del usuario
   * @param {Object} postback - Datos del postback
   * @returns {Promise<void>}
   */
  async handlePostback(senderId, postback) {
    logger.info('Received postback', {
      senderId,
      payload: postback.payload
    });

    // Aquí puedes manejar botones interactivos en el futuro
    // Por ejemplo: "Ver más información", "Hablar con humano", etc.
  }
}

// Exportar instancia única
export default new InstagramWebhookHandler();
