/**
 * RAG Service (Retrieval-Augmented Generation)
 * 
 * Pipeline completo para responder preguntas usando:
 * 1. Generación de embedding de la query
 * 2. Búsqueda semántica en Supabase (pgvector)
 * 3. Ensamblaje de contexto relevante
 * 4. Generación de respuesta con LLM
 */

import { supabase } from '../config/supabase.js';
// Importar ambos servicios de embeddings
import * as embeddingsLocal from './embeddings.service.js';
import * as embeddingsCloud from './embeddings.service.cloud.js';
import { expandQuerySimple } from './query-expansion.service.js';
import { expandQueryWithContext, saveMessage, getConversation } from './conversation-memory.service.js';
import { classifyQuery, getSearchParams, logQueryClassification } from './query-classifier.service.js';
import semanticCache from './semantic-cache.service.js';
import OpenAI from 'openai';
import config from '../config/environment.js';
import logger from '../utils/logger.js';

// Seleccionar servicio de embeddings según entorno
const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const generateEmbedding = embeddingsService.generateEmbedding;

// Configuración RAG
const TOP_K_RESULTS = parseInt(process.env.TOP_K_RESULTS || '5', 10);
const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7');
const MAX_CONTEXT_LENGTH = parseInt(process.env.MAX_CONTEXT_LENGTH || '3000', 10);

/**
 * Main RAG Pipeline
 * 
 * @param {string} userQuery - User question
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Response with answer, sources, metadata
 */
export async function processRAGQuery(userQuery, options = {}) {
  const startTime = Date.now();
  const { streaming = false, sessionId = null } = options;
  
  // Verificar intentos fallidos previos
  let failedAttempts = 0;
  if (sessionId) {
    const conversation = getConversation(sessionId);
    if (conversation) {
      failedAttempts = conversation.countFailedAttempts();
    }
  }
  
  // NUEVO: Clasificar query para optimizar búsqueda
  const queryType = classifyQuery(userQuery);
  const searchParams = getSearchParams(queryType);
  logQueryClassification(userQuery, queryType);
  
  // 1. Expandir con contexto de conversación (memoria)
  const contextualQuery = expandQueryWithContext(userQuery, sessionId);
  
  // 2. Expandir consulta ambigua (heurísticas)
  const queryExpansion = expandQuerySimple(contextualQuery);
  const searchQuery = queryExpansion.expanded;
  
  logger.info('Processing RAG query', {
    originalQuery: userQuery.substring(0, 100),
    contextualQuery: contextualQuery !== userQuery ? contextualQuery : 'no context',
    expandedQuery: queryExpansion.wasExpanded ? searchQuery : 'not expanded',
    queryType,
    searchParams: searchParams.description,
    sessionId,
    streaming,
  });
  
  try {
    // NUEVO: Generar embedding para la búsqueda
    const queryEmbedding = await generateEmbedding(searchQuery);
    
    // NUEVO: Verificar cache semántico antes de búsqueda costosa
    const cachedResponse = await semanticCache.getCachedResponse(userQuery, queryEmbedding);
    if (cachedResponse) {
      logger.info('Returning cached response', {
        cacheKey: cachedResponse.cacheKey,
        similarity: cachedResponse.similarity
      });
      
      return {
        ...cachedResponse,
        metadata: {
          ...cachedResponse.metadata,
          duration: Date.now() - startTime,
          fromCache: true,
          cacheSimilarity: cachedResponse.similarity
        }
      };
    }
    
    // Step 2: Search similar FAQs con parámetros optimizados por tipo de query
    const similarFAQs = await searchSimilarFAQs(queryEmbedding, {
      topK: searchParams.topK,
      similarityThreshold: searchParams.threshold,
    });
    
    logger.info('Similar FAQs found', {
      count: similarFAQs.length,
      topSimilarity: similarFAQs[0]?.similarity,
      queryType,
      searchParams: `${searchParams.topK}k-${searchParams.threshold}t`
    });
    
    // Determine if we have good context or not
    const hasGoodContext = similarFAQs.length > 0 && similarFAQs[0].similarity >= SIMILARITY_THRESHOLD;
    
    const context = assembleContext(similarFAQs, userQuery, failedAttempts);
    
    // Step 4: Generate response with LLM (usar query original)
    const response = await generateResponseWithContext(userQuery, context, {
      streaming,
      similarFAQs,
      failedAttempts,
    });
    
    const duration = Date.now() - startTime;
    
    // NUEVO: Cachear respuesta exitosa
    if (response.answer && similarFAQs.length > 0) {
      await semanticCache.cacheResponse(userQuery, queryEmbedding, response);
    }
    
    // Step 5: Log analytics con nueva metadata
    await logAnalytics({
      query: userQuery,
      matchedFAQs: similarFAQs.map(f => f.id),
      similarityScores: similarFAQs.map(f => f.similarity),
      responseTimeMs: duration,
      sessionId,
      queryType,
      searchParams: searchParams,
      fromCache: false
    });
    
    logger.info('RAG query completed', {
      duration: `${duration}ms`,
      faqsUsed: similarFAQs.length,
      hasAnswer: !!response.answer,
      queryType,
      cached: false
    });
    
    // Guardar en memoria de conversación
    if (sessionId) {
      saveMessage(sessionId, 'user', userQuery);
      saveMessage(sessionId, 'assistant', response.answer, {
        category: similarFAQs[0]?.category,
        sources: similarFAQs.map(f => f.id),
        hasInfo: hasGoodContext,
        noInfo: !hasGoodContext,
      });
    }
    
    return {
      answer: response.answer,
      sources: similarFAQs,
      metadata: {
        duration,
        faqsCount: similarFAQs.length,
        topSimilarity: similarFAQs[0]?.similarity || 0,
        model: response.model,
        tokensUsed: response.tokensUsed,
        queryType,
        searchParams,
        fromCache: false
      },
      streaming: response.stream || null,
    };
    
  } catch (error) {
    logger.error('RAG query failed', {
      error: error.message,
      query: userQuery.substring(0, 100),
      queryType
    });
    throw error;
  }
}

/**
 * Search for similar FAQs using vector similarity
 * 
 * @param {number[]} queryEmbedding - Query embedding vector
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of similar FAQs
 */
export async function searchSimilarFAQs(queryEmbedding, options = {}) {
  const {
    topK = TOP_K_RESULTS,
    similarityThreshold = SIMILARITY_THRESHOLD,
  } = options;
  
  try {
    // Call Supabase RPC function for vector search
    const { data, error } = await supabase.rpc('match_faqs', {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: topK,
    });
    
    if (error) {
      logger.error('Supabase vector search failed', {
        error: error.message,
        code: error.code,
      });
      throw error;
    }
    
    return data || [];
    
  } catch (error) {
    logger.error('Failed to search similar FAQs', {
      error: error.message,
    });
    throw error;
  }
}

/**
 * Assemble context from similar FAQs
 * 
 * @param {Array} similarFAQs - Array of similar FAQs
 * @param {string} userQuery - Original user question
 * @param {number} failedAttempts - Número de intentos fallidos previos
 * @returns {string} - Formatted context for LLM
 */
function assembleContext(similarFAQs, userQuery, failedAttempts = 0) {
  if (!similarFAQs || similarFAQs.length === 0) {
    // Si ya ha intentado 4 o más veces sin éxito
    if (failedAttempts >= 3) {
      return `
Pregunta: ${userQuery}

INSTRUCCIONES:
- El usuario ha preguntado ${failedAttempts + 1} veces sin obtener respuesta
- Di: "Disculpa, no tengo esa información aún. 📧 Visita https://unc.edu.ve/ para más detalles. Prometo mejorar y aprender más sobre la UNC. 🙏"
- Sé empático y reconoce la limitación
`.trim();
    }
    
    // Primera vez o pocos intentos: mensaje más amigable
    return `
Pregunta: ${userQuery}

INSTRUCCIONES:
- Di: "No entiendo la pregunta, ¿me la formulas de otra forma? Sería un placer ayudarte. 😊"
- Sé amigable y anima al usuario a reformular
`.trim();
  }
  
  // Format FAQs into context
  const faqContext = similarFAQs.map((faq, idx) => {
    const relevancePercent = (faq.similarity * 100).toFixed(1);
    return `
[FAQ ${idx + 1}] (Relevancia: ${relevancePercent}%)
Categoría: ${faq.category || 'General'}
Pregunta: ${faq.question}
Respuesta: ${faq.answer}
${faq.keywords && faq.keywords.length > 0 ? `Palabras clave: ${faq.keywords.join(', ')}` : ''}
`.trim();
  }).join('\n\n---\n\n');
  
  // Truncate if too long
  let context = `
FAQs relevantes de la UNC:

${faqContext}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pregunta: ${userQuery}

INSTRUCCIONES:
- MÁXIMO 100 PALABRAS (respuesta completa y útil)
- Formato: [Dato principal completo con contexto necesario] + [emoji]
- EJEMPLO: "Las inscripciones abren en enero y julio cada año. Los requisitos incluyen cédula de identidad, notas certificadas de bachillerato y certificado médico. 📅"
- Incluye contexto necesario pero evita redundancias
- Respuestas completas pero concisas
- Para listas completas, incluye TODOS los elementos
`.trim();
  
  // Ensure context doesn't exceed max length
  if (context.length > MAX_CONTEXT_LENGTH) {
    logger.warn('Context truncated', {
      originalLength: context.length,
      maxLength: MAX_CONTEXT_LENGTH,
    });
    context = context.substring(0, MAX_CONTEXT_LENGTH) + '\n\n[Contexto truncado por longitud]';
  }
  
  return context;
}

/**
 * Generate response using LLM with context
 * 
 * @param {string} query - User question
 * @param {string} context - Assembled context
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated response
 */
async function generateResponseWithContext(query, context, options = {}) {
  const {
    streaming = false,
    similarFAQs = [],
    failedAttempts = 0,
  } = options;
  
  // Create OpenAI client with OpenRouter config if needed
  const clientConfig = {
    apiKey: config.openai.apiKey,
  };
  
  if (config.openai.useOpenRouter) {
    clientConfig.baseURL = config.openai.baseURL;
    clientConfig.defaultHeaders = config.openai.defaultHeaders;
  }
  
  const openai = new OpenAI(clientConfig);
  
  // Determine if we have good context or not
  const hasGoodContext = similarFAQs.length > 0 && similarFAQs[0].similarity >= SIMILARITY_THRESHOLD;
  
  const systemPrompt = `Eres un asistente informativo sobre la Universidad Nacional de las Ciencias (UNC). Proporcionas información precisa basada en las FAQs proporcionadas. NO eres un representante oficial de la universidad - eres un proyecto de la comunidad, para la comunidad.

⚠️ REGLA IMPORTANTE: Usa SOLO la información de las FAQs proporcionadas. NO inventes nombres de personas, fechas específicas, números exactos, o servicios que no estén mencionados en las FAQs.

IMPORTANTE: Cuando respondas saludos o presentaciones, siempre aclara que eres un proyecto comunitario independiente.

RESPUESTAS COMPLETAS Y ÚTILES (máximo 100 palabras).

FORMATO:
[Dato principal completo con contexto necesario] + [emoji]

EJEMPLOS CORRECTOS:
"Las inscripciones abren en enero y julio cada año. Los requisitos incluyen cédula de identidad, notas certificadas de bachillerato y certificado médico. 📅"
"La carrera dura 4 años (8 semestres) con 180-191 UC. Incluye prácticas profesionales, laboratorios especializados y trabajo de grado final. 📚"
"El CAIU tiene 4 módulos: Lenguaje Lógico-Matemático, Habilidades Lingüísticas, Filosofía y Metodología, y Herramientas Tecnológicas. 📚"

REGLAS ESTRICTAS:
- Máximo 100 palabras
- Respuestas completas pero concisas
- NO hagas preguntas de seguimiento
- NO agregues "¿Te interesa...?" o similares
- Solo da la información solicitada
- Usa markdown bold para datos clave
- Un emoji relevante al final
- Termina con punto, NO con pregunta
- Si la información está en las FAQs, responde con confianza
- Si algo NO está en las FAQs, usa el mensaje indicado en las instrucciones

IMPORTANTE: Nunca te presentes como representante oficial, empleado o vocero de la UNC. Eres solo un asistente informativo independiente creado por la comunidad.

${hasGoodContext ?
  'Resume la FAQ de forma completa y clara. Incluye todos los detalles relevantes y listas completas. Usa la información de las FAQs proporcionadas.' :
  'Sigue EXACTAMENTE las instrucciones del contexto proporcionado.'
}`;

  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: context,
    },
  ];
  
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'openai/gpt-4o-mini',
      messages,
      temperature: 0.1, // Very low for deterministic, concise answers
      max_tokens: 250, // Increased for complete answers with full lists
      stream: streaming,
    });
    
    if (streaming) {
      // Return stream for server-sent events
      return {
        stream: response,
        model: process.env.OPENAI_MODEL,
      };
    } else {
      // Return complete response
      let answer = response.choices[0].message.content;
      const tokensUsed = response.usage?.total_tokens || 0;
      
      // FORCE truncate to ~100 words (aprox 500 chars) if too long
      const MAX_CHARS = 500;
      if (answer.length > MAX_CHARS) {
        answer = answer.substring(0, MAX_CHARS).trim();
        // Find last complete sentence
        const lastPeriod = Math.max(
          answer.lastIndexOf('.'),
          answer.lastIndexOf('?'),
          answer.lastIndexOf('!')
        );
        if (lastPeriod > 50) {
          answer = answer.substring(0, lastPeriod + 1);
        }
      }
      
      return {
        answer,
        model: response.model,
        tokensUsed,
      };
    }
    
  } catch (error) {
    logger.error('Failed to generate response with LLM', {
      error: error.message,
    });
    throw error;
  }
}

/**
 * Log analytics for query
 * 
 * @param {Object} data - Analytics data
 */
async function logAnalytics(data) {
  try {
    await supabase.from('analytics').insert({
      event_type: 'query',
      query: data.query,
      matched_faqs: data.matchedFAQs,
      similarity_scores: data.similarityScores,
      response_time_ms: data.responseTimeMs,
      model_used: process.env.OPENAI_MODEL,
      user_id: data.sessionId || 'anonymous',
      metadata: {
        top_k: data.matchedFAQs.length,
        threshold: SIMILARITY_THRESHOLD,
      },
    });
  } catch (error) {
    // Don't fail the request if analytics logging fails
    logger.error('Failed to log analytics', {
      error: error.message,
    });
  }
}

/**
 * Hybrid search (vector + full-text)
 * Combines semantic and keyword search for better recall
 * 
 * @param {string} query - User question
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of similar FAQs
 */
export async function hybridSearch(query, options = {}) {
  const {
    topK = TOP_K_RESULTS,
    similarityThreshold = SIMILARITY_THRESHOLD,
  } = options;
  
  try {
    // Generate embedding for semantic search
    const queryEmbedding = await generateEmbedding(query);
    
    // Call hybrid search RPC function
    const { data, error } = await supabase.rpc('hybrid_search', {
      query_text: query,
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: topK,
    });
    
    if (error) {
      logger.error('Hybrid search failed', { error: error.message });
      throw error;
    }
    
    return data || [];
    
  } catch (error) {
    logger.error('Failed hybrid search', { error: error.message });
    // Fallback to regular vector search
    const queryEmbedding = await generateEmbedding(query);
    return searchSimilarFAQs(queryEmbedding, options);
  }
}

export default {
  processRAGQuery,
  searchSimilarFAQs,
  hybridSearch,
};

