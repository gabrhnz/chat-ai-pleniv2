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
 * @param {string} query - User question
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Response with answer, sources, metadata
 */
export async function processRAGQuery(query, options = {}) {
  const startTime = Date.now();
  const {
    topK = TOP_K_RESULTS,
    similarityThreshold = SIMILARITY_THRESHOLD,
    streaming = false,
    sessionId = null,
  } = options;
  
  try {
    logger.info('RAG query started', {
      query: query.substring(0, 100),
      topK,
      similarityThreshold,
      sessionId,
    });
    
    // Step 1: Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    
    // Step 2: Search similar FAQs
    const similarFAQs = await searchSimilarFAQs(queryEmbedding, {
      topK,
      similarityThreshold,
    });
    
    logger.info('Similar FAQs found', {
      count: similarFAQs.length,
      topSimilarity: similarFAQs[0]?.similarity,
    });
    
    // Step 3: Assemble context
    const context = assembleContext(similarFAQs, query);
    
    // Step 4: Generate response with LLM
    const response = await generateResponseWithContext(query, context, {
      streaming,
      similarFAQs,
    });
    
    const duration = Date.now() - startTime;
    
    // Step 5: Log analytics
    await logAnalytics({
      query,
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
No se encontró información relevante en la base de conocimiento de la UNC para responder esta pregunta.

Pregunta del usuario: ${userQuery}

Instrucciones:
Responde honestamente que no tienes información sobre eso en tu base de conocimiento.
Sugiere al usuario:
1. Visitar el sitio web oficial: https://unc.edu.ve/
2. Contactar a la UNC por redes sociales: Instagram, TikTok o Threads
3. Visitar las instalaciones en Sector Altos de Pipe, km 11, Panamericana, estado Miranda
Mantén un tono amigable y entusiasta sobre la UNC.
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
- Usa la respuesta de las FAQs DIRECTAMENTE (no la expandas ni reformules)
- Máximo 3 líneas
- Termina con pregunta de seguimiento
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
  
  const systemPrompt = `Eres un asistente de la UNC. RESPUESTAS ULTRA CORTAS.

REGLA CRÍTICA: COPIA la respuesta de la FAQ EXACTAMENTE como está. NO agregues saludos, NO expandas, NO reformules.

FORMATO OBLIGATORIO:
Copia TEXTUALMENTE la respuesta de la FAQ más relevante.

EJEMPLO CORRECTO:
FAQ: "Varía entre **30-50 cupos** por carrera según demanda. Los cupos se asignan por mérito. 🎯 ¿Te interesa aplicar? Puedo contarte sobre becas."
TU RESPUESTA: "Varía entre **30-50 cupos** por carrera según demanda. Los cupos se asignan por mérito. 🎯 ¿Te interesa aplicar? Puedo contarte sobre becas."

EJEMPLO INCORRECTO (NO HAGAS ESTO):
"¡Hola! En la Universidad Nacional de las Ciencias Dr. Humberto Fernández-Morán (UNC), la cantidad de cupos..."

REGLAS ABSOLUTAS:
- NO agregues introducciones como "¡Hola!", "En la UNC...", etc
- NO expandas la información
- NO menciones el nombre completo de la universidad
- NO agregues información adicional
- MÁXIMO 40 palabras
- Copia EXACTAMENTE lo que dice la FAQ

${hasGoodContext ? 
  'Copia la respuesta de la FAQ más relevante SIN MODIFICARLA.' :
  'No encontré información. Di: "No tengo esa información. Visita https://unc.edu.ve/ o contáctanos por redes sociales."'
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
      temperature: 0.3, // Lower temperature for more consistent, factual answers
      max_tokens: 500,
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
      const answer = response.choices[0].message.content;
      const tokensUsed = response.usage?.total_tokens || 0;
      
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

