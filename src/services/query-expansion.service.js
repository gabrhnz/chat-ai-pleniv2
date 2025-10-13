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
 * Incluye patrones venezolanos coloquiales
 */

/**
 * Expande abreviaturas académicas comunes
 */
function expandAcademicAbbreviations(query) {
  // Mapa de abreviaturas comunes en español académico
  const abbreviations = {
    // Ingenierías
    'ing': 'ingeniería',
    'ing.': 'ingeniería',
    'ingenieria': 'ingeniería',
    'ingeniería': 'ingeniería',

    // Licenciaturas
    'lic': 'licenciatura',
    'lic.': 'licenciatura',
    'licenciatura': 'licenciatura',

    // Carreras específicas comunes
    'ia': 'inteligencia artificial',
    'ai': 'inteligencia artificial',
    'ciber': 'ciberseguridad',
    'ciberseguridad': 'ciberseguridad',
    'robot': 'robótica',
    'robotica': 'robótica',
    'electro': 'electromedicina',
    'electromedicina': 'electromedicina',
    'petro': 'petroquímica',
    'petroquimica': 'petroquímica',
    'bio': 'biotecnología',
    'biotecnologia': 'biotecnología',
    'nano': 'nanotecnología',
    'nanotecnologia': 'nanotecnología',
    'oceano': 'oceanología',
    'oceanologia': 'oceanología',
    'fis': 'física',
    'fisica': 'física',
    'mate': 'matemáticas',
    'matematicas': 'matemáticas',
    'quim': 'química',
    'quimica': 'química',
    'filo': 'filosofía',
    'filosofia': 'filosofía',
  };

  let expanded = query;

  // Reemplazar abreviaturas
  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    expanded = expanded.replace(regex, full);
  }

  return expanded;
}

export function expandQuerySimple(query) {
  const normalized = query.toLowerCase().trim();

  // PRIMERO: Expandir abreviaturas académicas comunes
  let expandedQuery = expandAcademicAbbreviations(normalized);

  // Patrones comunes y sus expansiones (incluye estilo venezolano)
  const expansions = [
    // Patrones estándar
    { pattern: /^(cuáles?|cuales?)\s*(hay|son|tiene)/i, expansion: 'cuáles carreras hay' },
    { pattern: /^(qué|que)\s*(hay|son|tiene)/i, expansion: 'qué carreras hay' },
    { pattern: /^(dime|muestra|lista)/i, expansion: 'dime las carreras' },
    { pattern: /^(quiero|quisiera)\s*(saber|conocer|ver)/i, expansion: 'quiero conocer las carreras' },
    { pattern: /^(opciones|alternativas)/i, expansion: 'opciones de carreras' },

    // Patrones venezolanos coloquiales
    { pattern: /^(hola|buenas|que tal|hey)$/i, expansion: 'hola' },
    { pattern: /^en\s*que\s*se\s*basa/i, expansion: expandedQuery }, // Mantener tal cual, es específica
    { pattern: /^(cuales|que)\s*carreras/i, expansion: 'cuáles carreras hay' },
    { pattern: /^como\s*(me\s*)?inscribo/i, expansion: 'cómo me inscribo en la UNC' },
    { pattern: /^cuando\s*abren/i, expansion: 'cuándo abren inscripciones' },
    { pattern: /^(cuanto|cuánto)\s*cuesta/i, expansion: 'cuánto cuesta estudiar en la UNC' },
    { pattern: /^es\s*gratis/i, expansion: 'es gratis la UNC' },
    { pattern: /^dan\s*becas/i, expansion: 'dan becas en la UNC' },
    { pattern: /^(donde|dónde)\s*queda/i, expansion: 'dónde queda la UNC' },
    { pattern: /^como\s*llego/i, expansion: 'cómo llego a la UNC' },
    { pattern: /^que\s*horario/i, expansion: 'qué horarios tienen las clases' },
    { pattern: /^(cuanto|cuánto)\s*dura/i, expansion: 'cuánto dura la carrera' },
    { pattern: /^hay\s*trabajo/i, expansion: 'hay trabajo después de graduarse' },
    { pattern: /^pagan\s*bien/i, expansion: 'pagan bien las carreras' },
    { pattern: /^vale\s*la\s*pena/i, expansion: 'vale la pena estudiar en la UNC' },
    { pattern: /^(cual|cuál)\s*es\s*mejor/i, expansion: 'cuál carrera es mejor' },
    { pattern: /^que\s*me\s*recomiendas/i, expansion: 'qué carrera me recomiendas' },

    // NUEVO: Patrones con abreviaturas expandidas
    { pattern: /ing\s*en\s*ia/i, expansion: 'ingeniería en inteligencia artificial' },
    { pattern: /ing\s*ia/i, expansion: 'ingeniería en inteligencia artificial' },
    { pattern: /lic\s*en\s*fis/i, expansion: 'licenciatura en física' },
    { pattern: /lic\s*fis/i, expansion: 'licenciatura en física' },
    { pattern: /ing\s*ciber/i, expansion: 'ingeniería en ciberseguridad' },
    { pattern: /ing\s*robot/i, expansion: 'ingeniería en robótica' },
    { pattern: /ing\s*electro/i, expansion: 'ingeniería en electromedicina' },
    { pattern: /ing\s*petro/i, expansion: 'ingeniería en petroquímica' },
    { pattern: /biotecnolog/i, expansion: 'biotecnología' },
    { pattern: /nano\s*tec/i, expansion: 'nanotecnología' },
    { pattern: /oceanolog/i, expansion: 'oceanología' },
    { pattern: /ciencia\s*de\s*datos/i, expansion: 'ciencia de datos' },
    { pattern: /ciencia\s*molecular/i, expansion: 'ciencia molecular' },
    { pattern: /biolog/i, expansion: 'biología y química computacional' },
  ];
  
  // Usar la query expandida para el resto de las expansiones
  const finalNormalized = expandedQuery;

  for (const { pattern, expansion } of expansions) {
    if (pattern.test(finalNormalized)) {
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

  // Si no hay expansión específica, devolver la query con abreviaturas expandidas
  if (expandedQuery !== normalized) {
    logger.info('Query expanded (abbreviations only)', {
      original: query,
      expanded: expandedQuery,
    });
    return {
      expanded: expandedQuery,
      wasExpanded: true,
      original: query,
    };
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
