/**
 * ManyChat Webhook Handler
 * 
 * ManyChat usa "Dynamic Blocks" para enviar requests a tu servidor.
 * Este handler procesa esos requests y responde con el formato que ManyChat espera.
 * 
 * Documentación: https://manychat.github.io/dynamic_block_docs/
 */

import logger from '../../utils/logger.js';
import ragService from '../../services/rag.service.js';
import messageFormatter from './message.formatter.js';

class ManyChatWebhookHandler {
  /**
   * Procesa un Dynamic Block request de ManyChat
   * 
   * ManyChat envía:
   * {
   *   "subscriber_id": "1234567890",
   *   "first_name": "Juan",
   *   "last_name": "Pérez",
   *   "user_input": "¿Cuándo son las inscripciones?"
   * }
   * 
   * @param {Object} body - Cuerpo del request de ManyChat
   * @returns {Promise<Object>} Respuesta en formato ManyChat
   */
  async handleDynamicBlock(body) {
    try {
      const subscriberId = body.subscriber_id;
      const userInput = body.user_input || body.last_input_text || '';
      const firstName = body.first_name || '';
      const lastName = body.last_name || '';

      if (!subscriberId) {
        logger.warn('ManyChat request without subscriber_id', { body });
        return this.createErrorResponse('No se pudo identificar al usuario');
      }

      if (!userInput) {
        logger.warn('ManyChat request without user input', { subscriberId });
        return this.createWelcomeResponse(firstName);
      }

      logger.info('Processing ManyChat message', {
        subscriberId,
        userInput: userInput.substring(0, 100),
        userName: `${firstName} ${lastName}`.trim()
      });

      // Crear session ID único para este usuario
      const sessionId = `manychat_${subscriberId}`;

      // Llamar al servicio RAG (el mismo que usa el chatbot web)
      const ragResponse = await ragService.processRAGQuery(userInput, {
        sessionId,
        metadata: {
          platform: 'manychat',
          userId: subscriberId,
          userName: `${firstName} ${lastName}`.trim()
        }
      });

      // Formatear respuesta para ManyChat
      const formattedResponse = messageFormatter.formatForManyChat(
        ragResponse.answer,
        ragResponse.sources
      );

      logger.info('ManyChat message processed successfully', {
        subscriberId,
        responseLength: formattedResponse.length,
        sourcesCount: ragResponse.sources?.length || 0
      });

      // Retornar en formato que ManyChat espera
      return this.createSuccessResponse(formattedResponse);

    } catch (error) {
      logger.error('Error processing ManyChat message', {
        error: error.message,
        stack: error.stack,
        body
      });

      return this.createErrorResponse(
        '😔 Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentar de nuevo?'
      );
    }
  }

  /**
   * Crea una respuesta exitosa en formato ManyChat
   * 
   * @param {string} message - Mensaje a enviar
   * @returns {Object} Respuesta en formato ManyChat
   */
  createSuccessResponse(message) {
    return {
      version: 'v2',
      content: {
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      }
    };
  }

  /**
   * Crea una respuesta de error
   * 
   * @param {string} errorMessage - Mensaje de error
   * @returns {Object}
   */
  createErrorResponse(errorMessage) {
    return {
      version: 'v2',
      content: {
        messages: [
          {
            type: 'text',
            text: errorMessage
          }
        ]
      }
    };
  }

  /**
   * Crea una respuesta de bienvenida
   * 
   * @param {string} firstName - Nombre del usuario
   * @returns {Object}
   */
  createWelcomeResponse(firstName) {
    const greeting = firstName ? `¡Hola ${firstName}! 👋` : '¡Hola! 👋';
    
    const welcomeMessage = `${greeting}

Soy el asistente virtual de la Universidad Nacional de las Ciencias (UNC). 🎓

Puedo ayudarte con:
• Información sobre carreras
• Proceso de inscripción
• Becas y costos
• Calendario académico
• Y mucho más

¿En qué puedo ayudarte hoy?`;

    return this.createSuccessResponse(welcomeMessage);
  }

  /**
   * Crea una respuesta con botones (opcional)
   * ManyChat soporta botones interactivos
   * 
   * @param {string} message - Mensaje principal
   * @param {Array} buttons - Array de botones
   * @returns {Object}
   */
  createResponseWithButtons(message, buttons) {
    return {
      version: 'v2',
      content: {
        messages: [
          {
            type: 'text',
            text: message,
            buttons: buttons.map(btn => ({
              type: 'url',
              caption: btn.text,
              url: btn.url
            }))
          }
        ]
      }
    };
  }
}

// Exportar instancia única
export default new ManyChatWebhookHandler();
