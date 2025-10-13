/**
 * Embeddings Service
 * 
 * Servicio para generar embeddings de texto usando Hugging Face.
 * Los embeddings son vectores de 384 dimensiones usados para búsqueda semántica.
 */

import { HfInference } from '@huggingface/inference';
import logger from '../utils/logger.js';

// Configuración para Hugging Face embeddings
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const EMBEDDING_DIMENSIONS = 384;
const MAX_TOKENS_PER_EMBEDDING = 8191;
const TIMEOUT_MS = 30000; // 30 seconds timeout

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Helper function to add timeout to promises
 */
function withTimeout(promise, timeoutMs = TIMEOUT_MS, operation = 'Operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

/**
 * Generate embedding for a single text using Hugging Face
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
    // Clean and truncate text if necessary
    const cleanText = cleanTextForEmbedding(text);
    
    console.log(`⏳ Generating embedding with ${TIMEOUT_MS/1000}s timeout...`);
    
    // Call Hugging Face API with timeout
    const embedding = await withTimeout(
      hf.featureExtraction({
        model: EMBEDDING_MODEL,
        inputs: cleanText,
      }),
      TIMEOUT_MS,
      'Hugging Face embedding generation'
    );
    
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
    const errorMsg = error.message || 'Unknown error';
    
    if (errorMsg.includes('timeout')) {
      console.error(`❌ TIMEOUT after ${TIMEOUT_MS/1000}s - Hugging Face API too slow`);
      logger.error('Embedding generation timeout', {
        error: errorMsg,
        timeout: `${TIMEOUT_MS}ms`,
        textLength: text.length,
      });
    } else {
      console.error(`❌ ERROR: ${errorMsg}`);
      logger.error('Failed to generate embedding', {
        error: errorMsg,
        textLength: text.length,
        model: EMBEDDING_MODEL,
      });
    }
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts (batch) using Hugging Face
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
    // Process one at a time for Hugging Face (more reliable)
    for (let i = 0; i < texts.length; i++) {
      const cleanText = cleanTextForEmbedding(texts[i]);
      
      console.log(`⏳ Processing ${i + 1}/${texts.length} with ${TIMEOUT_MS/1000}s timeout...`);
      
      // Call Hugging Face API with timeout
      const embedding = await withTimeout(
        hf.featureExtraction({
          model: EMBEDDING_MODEL,
          inputs: cleanText,
        }),
        TIMEOUT_MS,
        `Embedding ${i + 1}/${texts.length}`
      );
      
      results.push(embedding);
      
      // Log progress every 10 items
      if ((i + 1) % 10 === 0 || i === texts.length - 1) {
        logger.info('Batch embeddings generated (Hugging Face)', {
          totalProcessed: results.length,
          totalItems: texts.length,
          progress: `${Math.round((results.length / texts.length) * 100)}%`,
        });
      }
      
      // Small delay between requests to respect rate limits
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
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
    const errorMsg = error.message || 'Unknown error';
    
    if (errorMsg.includes('timeout')) {
      console.error(`❌ BATCH TIMEOUT after ${TIMEOUT_MS/1000}s`);
      console.error(`   Processed: ${results.length}/${texts.length}`);
      logger.error('Batch embedding generation timeout', {
        error: errorMsg,
        timeout: `${TIMEOUT_MS}ms`,
        totalTexts: texts.length,
        processedCount: results.length,
      });
    } else {
      console.error(`❌ BATCH ERROR: ${errorMsg}`);
      logger.error('Failed to generate batch embeddings', {
        error: errorMsg,
        totalTexts: texts.length,
        processedCount: results.length,
      });
    }
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

