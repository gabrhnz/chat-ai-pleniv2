/**
 * Message Formatter for ManyChat
 * 
 * ManyChat tiene límites similares a Instagram:
 * - Máximo 2000 caracteres por mensaje (más que Instagram)
 * - Soporta emojis
 * - Soporta saltos de línea
 * - No soporta Markdown completo
 */

import logger from '../../utils/logger.js';

class MessageFormatter {
  /**
   * Formatea una respuesta del RAG para ManyChat
   * 
   * @param {string} answer - Respuesta generada por el RAG
   * @param {Array} sources - Fuentes/FAQs usadas (opcional)
   * @returns {string} Mensaje formateado para ManyChat
   */
  formatForManyChat(answer, sources = []) {
    try {
      let formattedMessage = answer;

      // 1. Limpiar Markdown
      formattedMessage = this.cleanMarkdown(formattedMessage);

      // 2. Agregar fuentes si existen
      if (sources && sources.length > 0) {
        formattedMessage += this.formatSources(sources);
      }

      // 3. Truncar si excede el límite de ManyChat (2000 chars)
      if (formattedMessage.length > 2000) {
        formattedMessage = this.truncateMessage(formattedMessage, 2000);
      }

      return formattedMessage;

    } catch (error) {
      logger.error('Error formatting message for ManyChat', {
        error: error.message,
        answerLength: answer?.length
      });
      
      // Fallback: devolver el mensaje original truncado
      return answer.substring(0, 1997) + '...';
    }
  }

  /**
   * Limpia el Markdown para que se vea bien en ManyChat
   * 
   * @param {string} text - Texto con posible Markdown
   * @returns {string} Texto limpio
   */
  cleanMarkdown(text) {
    let cleaned = text;

    // Convertir headers (## Título) a texto con emoji
    cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '📌 $1');

    // Convertir negritas (**texto**) a emoji + texto
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '✨ $1');

    // Convertir cursivas (*texto*) a texto normal
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');

    // Convertir listas (- item) a emojis
    cleaned = cleaned.replace(/^[\-\*]\s+(.+)$/gm, '• $1');

    // Limpiar links [texto](url) - solo dejar el texto
    cleaned = cleaned.replace(/\[(.+?)\]\((.+?)\)/g, '$1');

    // Limpiar código inline `code`
    cleaned = cleaned.replace(/`(.+?)`/g, '$1');

    // Limpiar bloques de código ```code```
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

    return cleaned;
  }

  /**
   * Formatea las fuentes de forma compacta
   * 
   * @param {Array} sources - Array de fuentes/FAQs
   * @returns {string} Fuentes formateadas
   */
  formatSources(sources) {
    if (!sources || sources.length === 0) {
      return '';
    }

    const sourceCount = sources.length;
    
    return `\n\n💡 Basado en ${sourceCount} ${sourceCount === 1 ? 'fuente' : 'fuentes'} de información oficial.`;
  }

  /**
   * Trunca un mensaje de forma inteligente
   * 
   * @param {string} message - Mensaje a truncar
   * @param {number} maxLength - Longitud máxima
   * @returns {string} Mensaje truncado
   */
  truncateMessage(message, maxLength) {
    if (message.length <= maxLength) {
      return message;
    }

    // Dejar espacio para "..."
    const cutPoint = maxLength - 3;

    // Intentar cortar en un punto
    const lastPeriod = message.lastIndexOf('.', cutPoint);
    if (lastPeriod > cutPoint - 100) {
      return message.substring(0, lastPeriod + 1);
    }

    // Intentar cortar en un salto de línea
    const lastNewline = message.lastIndexOf('\n', cutPoint);
    if (lastNewline > cutPoint - 100) {
      return message.substring(0, lastNewline);
    }

    // Intentar cortar en un espacio
    const lastSpace = message.lastIndexOf(' ', cutPoint);
    if (lastSpace > cutPoint - 50) {
      return message.substring(0, lastSpace) + '...';
    }

    // Último recurso: cortar en seco
    return message.substring(0, cutPoint) + '...';
  }

  /**
   * Formatea un mensaje de bienvenida
   * 
   * @param {string} userName - Nombre del usuario (opcional)
   * @returns {string} Mensaje de bienvenida
   */
  formatWelcomeMessage(userName = null) {
    const greeting = userName ? `¡Hola ${userName}! 👋` : '¡Hola! 👋';
    
    return `${greeting}

Soy el asistente virtual de la Universidad Nacional de las Ciencias (UNC). 🎓

Puedo ayudarte con:
• Información sobre carreras
• Proceso de inscripción
• Becas y costos
• Calendario académico
• Y mucho más

¿En qué puedo ayudarte hoy?`;
  }

  /**
   * Formatea un mensaje de error amigable
   * 
   * @param {string} errorType - Tipo de error
   * @returns {string} Mensaje de error formateado
   */
  formatErrorMessage(errorType = 'general') {
    const errorMessages = {
      general: '😔 Lo siento, tuve un problema. ¿Podrías intentar de nuevo?',
      timeout: '⏱️ La consulta está tomando más tiempo del esperado. ¿Podrías reformular tu pregunta?',
      notFound: '🔍 No encontré información sobre eso. ¿Podrías ser más específico?',
      rateLimit: '⚠️ Has enviado muchos mensajes. Por favor espera un momento.'
    };

    return errorMessages[errorType] || errorMessages.general;
  }
}

// Exportar instancia única
export default new MessageFormatter();
