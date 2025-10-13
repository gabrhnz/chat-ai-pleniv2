/**
 * Query Classification Service
 *
 * Clasifica queries por intención para optimizar la búsqueda RAG
 * Bajo riesgo, alto impacto - mejora relevancia y velocidad
 */

import logger from '../utils/logger.js';

export const QUERY_TYPES = {
  GREETING: 'greeting',           // "hola", "buenos días"
  CAREER_INFO: 'career_info',     // "qué es IA", "cuáles carreras"
  ADMISSION: 'admission',         // "cómo me inscribo", "requisitos"
  CURRICULUM: 'curriculum',       // "qué veo en semestre 3", "materias"
  LOCATION: 'location',           // "dónde queda", "cómo llego"
  COST: 'cost',                   // "cuánto cuesta", "becas"
  SCHEDULE: 'schedule',           // "horarios", "cuándo abren"
  COMPARISON: 'comparison',       // "diferencia entre X y Y"
  FOLLOWUP: 'followup',           // "y eso", "cuéntame más"
  BOT_INFO: 'bot_info',           // "qué eres", "qué haces"
  UNKNOWN: 'unknown'
};

/**
 * Clasifica una query por intención usando patrones rápidos
 */
export function classifyQuery(query) {
  if (!query || typeof query !== 'string') {
    return QUERY_TYPES.UNKNOWN;
  }

  const q = query.toLowerCase().trim();

  // GREETING
  if (/^(hola|buenas|hey|saludos|buenos días|buenas tardes|buenas noches)/i.test(q)) {
    return QUERY_TYPES.GREETING;
  }

  // BOT_INFO
  if (/^(que eres|que haces|quien eres|que modelo|que eres tu|como funcionas|que puedes hacer)/i.test(q)) {
    return QUERY_TYPES.BOT_INFO;
  }

  // ADMISSION
  if (/(inscri|admisi|requisito|documento|como me inscribo|como entrar|como estudiar)/i.test(q)) {
    return QUERY_TYPES.ADMISSION;
  }

  // CURRICULUM
  if (/(semestre|materia|pensum|malla|curricul|que veo en|cuanto dura)/i.test(q)) {
    return QUERY_TYPES.CURRICULUM;
  }

  // LOCATION
  if (/(donde|ubicaci|direcci|como llego|localizar|queda)/i.test(q)) {
    return QUERY_TYPES.LOCATION;
  }

  // COST
  if (/(cuanto|costo|precio|beca|gratis|pagos?|financiamiento)/i.test(q)) {
    return QUERY_TYPES.COST;
  }

  // SCHEDULE
  if (/(horario|cuando|fecha|abre|cierra|dias|hora)/i.test(q)) {
    return QUERY_TYPES.SCHEDULE;
  }

  // COMPARISON
  if (/(diferencia|comparar|mejor|vs|versus|contra)/i.test(q)) {
    return QUERY_TYPES.COMPARISON;
  }

  // FOLLOWUP
  if (/^(y eso|cuentame|dame mas|mas info|detalles|explica|amplia)/i.test(q)) {
    return QUERY_TYPES.FOLLOWUP;
  }

  // CAREER_INFO
  if (/(carrera|ingenier|licenciatura|que es|informacion sobre)/i.test(q)) {
    return QUERY_TYPES.CAREER_INFO;
  }

  logger.info('Query classified as UNKNOWN', { query: q });
  return QUERY_TYPES.UNKNOWN;
}

/**
 * Retorna parámetros de búsqueda optimizados según el tipo de query
 */
export function getSearchParams(queryType) {
  const params = {
    [QUERY_TYPES.GREETING]: {
      topK: 1,
      threshold: 0.9,
      description: 'Búsqueda muy precisa para saludos'
    },
    [QUERY_TYPES.BOT_INFO]: {
      topK: 1,
      threshold: 0.9,
      description: 'Búsqueda muy precisa para info del bot'
    },
    [QUERY_TYPES.CAREER_INFO]: {
      topK: 5,
      threshold: 0.7,
      description: 'Búsqueda amplia para info de carreras'
    },
    [QUERY_TYPES.CURRICULUM]: {
      topK: 3,
      threshold: 0.75,
      description: 'Búsqueda enfocada en currículo'
    },
    [QUERY_TYPES.ADMISSION]: {
      topK: 3,
      threshold: 0.75,
      description: 'Búsqueda enfocada en admisiones'
    },
    [QUERY_TYPES.COMPARISON]: {
      topK: 4,
      threshold: 0.7,
      description: 'Búsqueda amplia para comparaciones'
    },
    [QUERY_TYPES.FOLLOWUP]: {
      topK: 2,
      threshold: 0.6,
      description: 'Búsqueda flexible para follow-ups'
    },
    [QUERY_TYPES.UNKNOWN]: {
      topK: 5,
      threshold: 0.7,
      description: 'Búsqueda por defecto amplia'
    },
  };

  return params[queryType] || params[QUERY_TYPES.UNKNOWN];
}

/**
 * Determina si una query necesita expansión contextual
 */
export function needsContextExpansion(queryType) {
  const needsExpansion = [
    QUERY_TYPES.FOLLOWUP,
    QUERY_TYPES.COMPARISON,
    QUERY_TYPES.UNKNOWN
  ];

  return needsExpansion.includes(queryType);
}

/**
 * Logs de clasificación para analytics
 */
export function logQueryClassification(query, queryType, confidence = 1.0) {
  logger.info('Query classified', {
    query: query.substring(0, 100),
    type: queryType,
    confidence,
    timestamp: new Date().toISOString()
  });
}

export default {
  classifyQuery,
  getSearchParams,
  needsContextExpansion,
  logQueryClassification,
  QUERY_TYPES
};
