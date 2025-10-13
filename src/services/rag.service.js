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
import { expandQueryWithContext, saveMessage } from './conversation-memory.service.js';
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
  
  // 1. Expandir con contexto de conversación (memoria)
  const contextualQuery = expandQueryWithContext(userQuery, sessionId);
  
  // 2. Expandir consulta ambigua (heurísticas)
  const queryExpansion = expandQuerySimple(contextualQuery);
  const searchQuery = queryExpansion.expanded;
  
  logger.info('Processing RAG query', {
    originalQuery: userQuery.substring(0, 100),
    contextualQuery: contextualQuery !== userQuery ? contextualQuery : 'no context',
    expandedQuery: queryExpansion.wasExpanded ? searchQuery : 'not expanded',
    sessionId,
    streaming,
  });
  
  try {
    // Step 1: Generate query embedding (usar searchQuery expandida)
    const queryEmbedding = await generateEmbedding(searchQuery);
    
    // Step 2: Search similar FAQs
    const similarFAQs = await searchSimilarFAQs(queryEmbedding, {
      topK: TOP_K_RESULTS,
      similarityThreshold: SIMILARITY_THRESHOLD,
    });
    
    logger.info('Similar FAQs found', {
      count: similarFAQs.length,
      topSimilarity: similarFAQs[0]?.similarity,
    });
    
    // Step 3: Assemble context (usar query original para el contexto)
    const context = assembleContext(similarFAQs, userQuery);
    
    // Step 4: Generate response with LLM (usar query original)
    const response = await generateResponseWithContext(userQuery, context, {
      streaming,
      similarFAQs,
    });
    
    const duration = Date.now() - startTime;
    
    // Step 5: Log analytics
    await logAnalytics({
      query: userQuery,
      matchedFAQs: similarFAQs.map(f => f.id),
      similarityScores: similarFAQs.map(f => f.similarity),
      responseTimeMs: duration,
      sessionId,
    });
    
    logger.info('RAG query completed', {
      duration: `${duration}ms`,
      faqsUsed: similarFAQs.length,
      hasAnswer: !!response.answer,
    });
    
    // Guardar en memoria de conversación
    if (sessionId) {
      saveMessage(sessionId, 'user', userQuery);
      saveMessage(sessionId, 'assistant', response.answer, {
        category: similarFAQs[0]?.category,
        sources: similarFAQs.map(f => f.id),
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
      },
      streaming: response.stream || null,
    };
    
  } catch (error) {
    logger.error('RAG query failed', {
      error: error.message,
      query: query.substring(0, 100),
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
 * @returns {string} - Formatted context for LLM
 */
function assembleContext(similarFAQs, userQuery) {
  if (!similarFAQs || similarFAQs.length === 0) {
    return `
Pregunta: ${userQuery}

INSTRUCCIONES:
- MÁXIMO 15 PALABRAS
- Di: "No tengo esa información. 📧 Visita https://unc.edu.ve/ o contáctanos por redes."
- Formato: [Mensaje] [emoji] [Acción sugerida]
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
- MÁXIMO 20 PALABRAS (respuesta completa pero concisa)
- Formato: [Dato completo] [emoji] [¿Pregunta de seguimiento?]
- EJEMPLO: "Abren en **enero** y **julio** cada año. 📅 ¿Necesitas info sobre documentos?"
- Incluye contexto necesario pero evita redundancias
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
  
  const systemPrompt = `Eres un asistente UNC. RESPUESTAS CORTAS Y DIRECTAS (15-20 palabras máximo).

FORMATO:
[Dato principal con contexto mínimo] + [emoji] + [pregunta de seguimiento]

EJEMPLOS CORRECTOS:
"Abren en **enero** y **julio** cada año. 📅 ¿Necesitas info sobre documentos?"
"Varía entre **30-50 cupos** por carrera según demanda. 🎯 ¿Te interesa alguna carrera?"
"De **lunes a viernes 8am-4pm**. ⏰ ¿Quieres saber ubicación?"

REGLAS:
- Máximo 20 palabras
- Incluye el dato completo pero sin expandir innecesariamente
- Siempre termina con pregunta de seguimiento
- Usa markdown bold para datos clave
- Un emoji relevante

${hasGoodContext ? 
  'Resume la FAQ a lo mínimo esencial.' :
  'Di: "No tengo info. 📧 Visita unc.edu.ve"'
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
      max_tokens: 60, // SHORT: max 20 words
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
      
      // FORCE truncate to ~20 words (aprox 140 chars) if too long
      const MAX_CHARS = 150;
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

