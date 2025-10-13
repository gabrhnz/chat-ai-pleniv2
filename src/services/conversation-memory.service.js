/**
 * Conversation Memory Service
 * 
 * Mantiene el contexto de conversaciones para respuestas coherentes
 */

import logger from '../utils/logger.js';

// Store en memoria (en producción usar Redis)
const conversationStore = new Map();

// TTL de conversaciones (30 minutos)
const CONVERSATION_TTL = 30 * 60 * 1000;

/**
 * Estructura de conversación
 */
class Conversation {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.messages = [];
    this.context = {};
    this.lastActivity = Date.now();
  }
  
  addMessage(role, content, metadata = {}) {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
      metadata,
    });
    this.lastActivity = Date.now();
    
    // Mantener solo últimos 10 mensajes
    if (this.messages.length > 10) {
      this.messages = this.messages.slice(-10);
    }
  }
  
  updateContext(key, value) {
    this.context[key] = value;
    this.lastActivity = Date.now();
  }
  
  getRecentMessages(count = 3) {
    return this.messages.slice(-count);
  }
  
  getLastUserMessage() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].role === 'user') {
        return this.messages[i];
      }
    }
    return null;
  }
  
  isExpired() {
    return Date.now() - this.lastActivity > CONVERSATION_TTL;
  }
}

/**
 * Obtener o crear conversación
 */
export function getConversation(sessionId) {
  if (!sessionId) {
    return null;
  }
  
  let conversation = conversationStore.get(sessionId);
  
  if (!conversation) {
    conversation = new Conversation(sessionId);
    conversationStore.set(sessionId, conversation);
    logger.info('Nueva conversación creada', { sessionId });
  } else if (conversation.isExpired()) {
    // Renovar conversación expirada
    conversation = new Conversation(sessionId);
    conversationStore.set(sessionId, conversation);
    logger.info('Conversación renovada', { sessionId });
  }
  
  return conversation;
}

/**
 * Expandir query con contexto de conversación
 */
export function expandQueryWithContext(query, sessionId) {
  const conversation = getConversation(sessionId);
  
  if (!conversation) {
    return query;
  }
  
  const lastMessages = conversation.getRecentMessages(3);
  
  // Si la query es muy corta y ambigua, agregar contexto
  const isAmbiguous = query.length < 20 && 
    (query.match(/^(si|sí|la de|el de|esa|ese|esta|este|dame|dime|quiero|cuál)/i));
  
  if (!isAmbiguous) {
    return query;
  }
  
  // Buscar contexto en mensajes anteriores
  let contextualQuery = query;
  
  for (let i = lastMessages.length - 1; i >= 0; i--) {
    const msg = lastMessages[i];
    
    if (msg.role === 'assistant' && msg.metadata.category) {
      // Si el bot habló de carreras, agregar ese contexto
      if (msg.metadata.category === 'carreras' || msg.content.includes('carrera')) {
        
        // Detectar referencia a carrera específica
        const carreraMatch = query.match(/la de (\w+)|el de (\w+)|de (\w+)/i);
        if (carreraMatch) {
          const keyword = (carreraMatch[1] || carreraMatch[2] || carreraMatch[3]).toLowerCase();
          
          // Mapear abreviaciones comunes
          const carreraMap = {
            'ia': 'Ingeniería en Inteligencia Artificial',
            'ai': 'Ingeniería en Inteligencia Artificial',
            'ciber': 'Ingeniería en Ciberseguridad',
            'ciberseguridad': 'Ingeniería en Ciberseguridad',
            'robotica': 'Ingeniería en Robótica',
            'electro': 'Ingeniería en Electromedicina',
            'petro': 'Ingeniería en Petroquímica',
            'bio': 'Biotecnología',
            'datos': 'Ciencia de Datos',
            'nano': 'Nanotecnología',
            'fisica': 'Física',
            'mate': 'Matemáticas',
            'filo': 'Filosofía',
          };
          
          const fullCarrera = carreraMap[keyword] || keyword;
          contextualQuery = `¿Qué es ${fullCarrera}?`;
          
          logger.info('Query expandida con contexto de carrera', {
            original: query,
            expanded: contextualQuery,
            keyword,
            sessionId,
          });
          
          break;
        }
        
        // Si dice "sí" o "si", asumir que quiere info de alguna carrera mencionada
        if (query.match(/^(si|sí)$/i)) {
          const carreras = extractCarrerasFromText(msg.content);
          if (carreras.length > 0) {
            contextualQuery = `información sobre ${carreras[0]}`;
            
            logger.info('Query expandida con "sí"', {
              original: query,
              expanded: contextualQuery,
              sessionId,
            });
            
            break;
          }
        }
      }
    }
  }
  
  return contextualQuery;
}

/**
 * Extraer nombres de carreras de un texto
 */
function extractCarrerasFromText(text) {
  const carreras = [
    'Inteligencia Artificial', 'IA', 'AI',
    'Ciberseguridad',
    'Robótica',
    'Electromedicina',
    'Petroquímica',
    'Biomateriales',
    'Biotecnología',
    'Ciencia de Datos',
    'Nanotecnología',
    'Física Nuclear',
    'Oceanología',
    'Ciencia Molecular',
    'Biología Computacional',
    'Química Computacional',
    'Física',
    'Matemáticas',
    'Filosofía',
  ];
  
  const found = [];
  const lowerText = text.toLowerCase();
  
  for (const carrera of carreras) {
    if (lowerText.includes(carrera.toLowerCase())) {
      found.push(carrera);
    }
  }
  
  return found;
}

/**
 * Guardar mensaje en conversación
 */
export function saveMessage(sessionId, role, content, metadata = {}) {
  const conversation = getConversation(sessionId);
  
  if (conversation) {
    conversation.addMessage(role, content, metadata);
  }
}

/**
 * Actualizar contexto de conversación
 */
export function updateContext(sessionId, key, value) {
  const conversation = getConversation(sessionId);
  
  if (conversation) {
    conversation.updateContext(key, value);
  }
}

/**
 * Limpiar conversaciones expiradas (ejecutar periódicamente)
 */
export function cleanupExpiredConversations() {
  let cleaned = 0;
  
  for (const [sessionId, conversation] of conversationStore.entries()) {
    if (conversation.isExpired()) {
      conversationStore.delete(sessionId);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    logger.info('Conversaciones expiradas limpiadas', { count: cleaned });
  }
  
  return cleaned;
}

// Limpiar cada 5 minutos
setInterval(cleanupExpiredConversations, 5 * 60 * 1000);

export default {
  getConversation,
  expandQueryWithContext,
  saveMessage,
  updateContext,
  cleanupExpiredConversations,
};
