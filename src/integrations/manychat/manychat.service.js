/**
 * ManyChat Service
 * 
 * Maneja la comunicación con la API de ManyChat.
 * ManyChat es más fácil de configurar que Instagram directo.
 * 
 * Documentación: https://manychat.github.io/dynamic_block_docs/
 */

import axios from 'axios';
import logger from '../../utils/logger.js';
import config from '../../config/environment.js';

class ManyChatService {
  constructor() {
    // API Token de ManyChat (se configura en .env)
    this.apiToken = config.manychat?.apiToken;
    
    // URL base de la API
    this.baseURL = 'https://api.manychat.com/fb';
    
    if (!this.apiToken) {
      logger.warn('ManyChat API token not configured. ManyChat integration will be disabled.');
    }
  }

  /**
   * Verifica si el servicio está configurado
   */
  isConfigured() {
    return !!this.apiToken;
  }

  /**
   * Envía un mensaje de texto a un usuario
   * 
   * @param {string} subscriberId - ID del suscriptor en ManyChat (PSID)
   * @param {string} message - Texto del mensaje
   * @returns {Promise<Object>}
   */
  async sendMessage(subscriberId, message) {
    if (!this.isConfigured()) {
      throw new Error('ManyChat service is not configured');
    }

    try {
      // Truncar mensaje a 2000 caracteres (límite de ManyChat)
      const truncatedMessage = message.length > 2000 
        ? message.substring(0, 1997) + '...' 
        : message;

      const response = await axios.post(
        `${this.baseURL}/sending/sendContent`,
        {
          subscriber_id: subscriberId,
          data: {
            version: 'v2',
            content: {
              messages: [
                {
                  type: 'text',
                  text: truncatedMessage
                }
              ]
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Message sent via ManyChat', {
        subscriberId,
        messageLength: truncatedMessage.length
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to send ManyChat message', {
        subscriberId,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  }

  /**
   * Obtiene información de un suscriptor
   * 
   * @param {string} subscriberId - ID del suscriptor
   * @returns {Promise<Object>}
   */
  async getSubscriberInfo(subscriberId) {
    if (!this.isConfigured()) {
      throw new Error('ManyChat service is not configured');
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/subscriber/getInfo`,
        {
          params: {
            subscriber_id: subscriberId
          },
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      logger.debug('Subscriber info retrieved', { subscriberId });
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get subscriber info', {
        subscriberId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Establece un campo personalizado para un suscriptor
   * Útil para guardar contexto o estado
   * 
   * @param {string} subscriberId - ID del suscriptor
   * @param {string} fieldName - Nombre del campo
   * @param {any} fieldValue - Valor del campo
   * @returns {Promise<Object>}
   */
  async setCustomField(subscriberId, fieldName, fieldValue) {
    if (!this.isConfigured()) {
      throw new Error('ManyChat service is not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/subscriber/setCustomField`,
        {
          subscriber_id: subscriberId,
          field_name: fieldName,
          field_value: fieldValue
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.debug('Custom field set', { subscriberId, fieldName });
      return response.data;
    } catch (error) {
      logger.error('Failed to set custom field', {
        subscriberId,
        fieldName,
        error: error.message
      });
      throw error;
    }
  }
}

// Exportar instancia única
export default new ManyChatService();
