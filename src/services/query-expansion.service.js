/**
 * Query Expansion Service
 * 
 * Expande consultas ambiguas con contexto para mejorar la búsqueda RAG
 */

import OpenAI from 'openai';
import config from '../config/environment.js';
import logger from '../utils/logger.js';

/**
 * Detecta si una consulta es ambigua y necesita expansión
 */
function isAmbiguousQuery(query) {
  const ambiguousPatterns = [
    /^(cuáles?|cuales?)\s*(hay|son|tiene|existen)/i,
    /^(qué|que)\s*(hay|son|tiene|existen)/i,
    /^(dime|muestra|lista)/i,
    /^(quiero|quisiera)\s*(saber|conocer|ver)/i,
    /^(me\s*interesa|me\s*gustaría)/i,
    /^(hay|tienen|ofrecen)\s*$/i,
  ];
  
  // Si la consulta es muy corta y no tiene palabras clave específicas
  const keywords = ['carrera', 'beca', 'costo', 'inscripción', 'admisión', 'horario', 'ubicación'];
  const hasKeyword = keywords.some(kw => query.toLowerCase().includes(kw));
  
  const isShort = query.split(' ').length <= 4;
  const matchesPattern = ambiguousPatterns.some(pattern => pattern.test(query));
  
  return (isShort && !hasKeyword) || matchesPattern;
}

/**
 * Expande una consulta ambigua usando el LLM
 */
export async function expandQuery(originalQuery, conversationHistory = []) {
  // Si no es ambigua, retornar tal cual
  if (!isAmbiguousQuery(originalQuery)) {
    return {
      expanded: originalQuery,
      wasExpanded: false,
    };
  }
  
  logger.info('Expanding ambiguous query', {
    original: originalQuery,
    historyLength: conversationHistory.length,
  });
  
  try {
    const clientConfig = {
      apiKey: config.openai.apiKey,
    };
    
    if (config.openai.useOpenRouter) {
      clientConfig.baseURL = config.openai.baseURL;
      clientConfig.defaultHeaders = config.openai.defaultHeaders;
    }
    
    const openai = new OpenAI(clientConfig);
    
    // Construir contexto de conversación
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      const lastMessages = conversationHistory.slice(-3); // Últimos 3 mensajes
      conversationContext = lastMessages.map(msg => 
        `Usuario: ${msg.question}\nBot: ${msg.answer}`
      ).join('\n');
    }
    
    const prompt = `Eres un asistente que expande consultas ambiguas sobre la Universidad Nacional de las Ciencias (UNC).

${conversationContext ? `CONTEXTO DE CONVERSACIÓN PREVIA:\n${conversationContext}\n\n` : ''}

CONSULTA ACTUAL: "${originalQuery}"

TAREA: Expande esta consulta agregando el contexto necesario para que sea más específica.

REGLAS:
- Si la conversación previa habla de "carreras", agrega "carreras" a la consulta
- Si dice "cuáles hay" sin contexto, asume que pregunta por "carreras"
- Si dice "dime", "muestra", "lista" sin objeto, asume "carreras"
- Mantén la consulta corta (máximo 10 palabras)
- Solo agrega el contexto mínimo necesario

EJEMPLOS:
"cuáles hay" → "cuáles carreras hay"
"quiero conocer cuales hay" → "quiero conocer cuáles carreras hay"
"dime las opciones" → "dime las opciones de carreras"
"qué tienen" → "qué carreras tienen"

RESPONDE SOLO CON LA CONSULTA EXPANDIDA, SIN EXPLICACIONES.`;

    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en expandir consultas ambiguas. Respondes solo con la consulta expandida.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });
    
    const expandedQuery = response.choices[0].message.content.trim().replace(/["""]/g, '');
    
    logger.info('Query expanded', {
      original: originalQuery,
      expanded: expandedQuery,
    });
    
    return {
      expanded: expandedQuery,
      wasExpanded: true,
      original: originalQuery,
    };
    
  } catch (error) {
    logger.error('Failed to expand query', {
      error: error.message,
      query: originalQuery,
    });
    
    // Si falla, retornar la original
    return {
      expanded: originalQuery,
      wasExpanded: false,
      error: error.message,
    };
  }
}

/**
 * Expande consulta con heurísticas simples (sin LLM)
 * Más rápido pero menos preciso
 */
export function expandQuerySimple(query) {
  const normalized = query.toLowerCase().trim();
  
  // Patrones comunes y sus expansiones
  const expansions = [
    { pattern: /^(cuáles?|cuales?)\s*(hay|son|tiene)/i, expansion: 'cuáles carreras hay' },
    { pattern: /^(qué|que)\s*(hay|son|tiene)/i, expansion: 'qué carreras hay' },
    { pattern: /^(dime|muestra|lista)/i, expansion: 'dime las carreras' },
    { pattern: /^(quiero|quisiera)\s*(saber|conocer|ver)/i, expansion: 'quiero conocer las carreras' },
    { pattern: /^(opciones|alternativas)/i, expansion: 'opciones de carreras' },
  ];
  
  for (const { pattern, expansion } of expansions) {
    if (pattern.test(normalized)) {
      logger.info('Query expanded (simple)', {
        original: query,
        expanded: expansion,
      });
      return {
        expanded: expansion,
        wasExpanded: true,
        original: query,
      };
    }
  }
  
  return {
    expanded: query,
    wasExpanded: false,
  };
}

export default {
  expandQuery,
  expandQuerySimple,
  isAmbiguousQuery,
};
