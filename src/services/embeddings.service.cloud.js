/**
 * Cloud Embeddings Service
 * 
 * Servicio para generar embeddings usando Hugging Face Inference API (GRATIS).
 * Compatible con Vercel y otros entornos serverless.
 */

import { HfInference } from '@huggingface/inference';
import config from '../config/environment.js';
import logger from '../utils/logger.js';

// Configuración específica para embeddings
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const EMBEDDING_DIMENSIONS = 384;
const MAX_TOKENS_PER_EMBEDDING = 8191;

// Cliente de Hugging Face
let hfClient = null;

function getHfClient() {
  if (!hfClient) {
    // Hugging Face API key (opcional, pero recomendado para rate limits más altos)
    const apiKey = process.env.HUGGINGFACE_API_KEY || '';
    
    hfClient = new HfInference(apiKey);
    
    logger.info('Hugging Face client initialized', {
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      hasApiKey: !!apiKey,
    });
  }
  
  return hfClient;
}

/**
 * Generate embedding for a single text
 * 
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector (384 dimensions)
 */
export async function generateEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text must be a non-empty string');
  }
  
  const startTime = Date.now();
  
  try {
    const client = getHfClient();
    
    // Clean and truncate text if necessary
    const cleanText = cleanTextForEmbedding(text);
    
    // Generar embedding usando Hugging Face
    const response = await client.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: cleanText,
    });
    
    // La respuesta es directamente el array de embeddings
    const embedding = Array.isArray(response) ? response : response.data;
    
    const duration = Date.now() - startTime;
    
    // Validate embedding
    if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(`Invalid embedding dimensions: expected ${EMBEDDING_DIMENSIONS}, got ${embedding?.length}`);
    }
    
    logger.info('Embedding generated (Hugging Face)', {
      textLength: cleanText.length,
      dimensions: embedding.length,
      duration: `${duration}ms`,
      model: EMBEDDING_MODEL,
    });
    
    return embedding;
    
  } catch (error) {
    logger.error('Failed to generate embedding', {
      error: error.message,
      textLength: text.length,
      model: EMBEDDING_MODEL,
    });
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts (batch)
 * 
 * @param {string[]} texts - Array of texts to embed
 * @param {number} batchSize - Number of texts per batch (default: 10)
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export async function generateEmbeddingsBatch(texts, batchSize = 10) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error('Texts must be a non-empty array');
  }
  
  const startTime = Date.now();
  const results = [];
  
  try {
    // Process in batches to avoid rate limits
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const cleanBatch = batch.map(cleanTextForEmbedding);
      
      // Generar embeddings uno por uno (HF API no soporta batch nativo)
      const batchPromises = cleanBatch.map(text => generateEmbedding(text));
      const embeddings = await Promise.all(batchPromises);
      
      results.push(...embeddings);
      
      logger.info('Batch embeddings generated (Hugging Face)', {
        batchIndex: Math.floor(i / batchSize) + 1,
        batchSize: batch.length,
        totalProcessed: results.length,
        totalItems: texts.length,
      });
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const duration = Date.now() - startTime;
    
    logger.info('All embeddings generated (Hugging Face)', {
      totalCount: results.length,
      duration: `${duration}ms`,
      averagePerItem: `${Math.round(duration / results.length)}ms`,
    });
    
    return results;
    
  } catch (error) {
    logger.error('Failed to generate batch embeddings', {
      error: error.message,
      totalTexts: texts.length,
      processedCount: results.length,
    });
    throw error;
  }
}

/**
 * Clean text for embedding generation
 * Removes excessive whitespace, normalizes newlines, truncates if too long
 * 
 * @param {string} text - Raw text
 * @returns {string} - Cleaned text
 */
function cleanTextForEmbedding(text) {
  if (!text) return '';
  
  // Normalize whitespace and newlines
  let cleaned = text
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n+/g, '\n') // Multiple newlines to single newline
    .trim();
  
  // Truncate if too long (rough estimation: 1 token ≈ 4 characters)
  const maxChars = MAX_TOKENS_PER_EMBEDDING * 4;
  if (cleaned.length > maxChars) {
    logger.warn('Text truncated for embedding', {
      originalLength: cleaned.length,
      truncatedLength: maxChars,
    });
    cleaned = cleaned.substring(0, maxChars);
  }
  
  return cleaned;
}

/**
 * Calculate cosine similarity between two embeddings
 * Used for testing and validation
 * 
 * @param {number[]} embedding1 - First embedding vector
 * @param {number[]} embedding2 - Second embedding vector
 * @returns {number} - Similarity score between -1 and 1
 */
export function cosineSimilarity(embedding1, embedding2) {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have same dimensions');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }
  
  return dotProduct / (norm1 * norm2);
}

/**
 * Test embedding service connectivity
 * 
 * @returns {Promise<boolean>} - True if service is working
 */
export async function testEmbeddingService() {
  try {
    const testText = 'This is a test sentence for embedding generation.';
    const embedding = await generateEmbedding(testText);
    
    logger.info('Embedding service test successful', {
      dimensions: embedding.length,
      sampleValues: embedding.slice(0, 5),
    });
    
    return true;
  } catch (error) {
    logger.error('Embedding service test failed', {
      error: error.message,
    });
    return false;
  }
}

export default {
  generateEmbedding,
  generateEmbeddingsBatch,
  cosineSimilarity,
  testEmbeddingService,
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
};

