/**
 * Semantic Cache Service
 *
 * Cache inteligente para queries similares
 * Reduce latencia y costos significativamente
 */

import logger from '../utils/logger.js';

const CACHE_TTL = 3600 * 1000; // 1 hora en ms
const SIMILARITY_THRESHOLD = 0.95; // Muy similar para cache
const MAX_CACHE_SIZE = 1000; // Máximo 1000 entradas

// Cache en memoria (para Redis después)
class SemanticCache {
  constructor() {
    this.cache = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), CACHE_TTL);
  }

  /**
   * Genera key única para cache
   */
  generateKey(query, embedding) {
    // Usar primeros 8 elementos del embedding + hash de query
    const embeddingKey = embedding.slice(0, 8).join(',').replace(/\./g, '');
    const queryHash = this.simpleHash(query.substring(0, 50));
    return `cache_${embeddingKey}_${queryHash}`;
  }

  /**
   * Hash simple para strings
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calcula similitud coseno entre dos embeddings
   */
  cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Busca respuesta en cache para query similar
   */
  async getCachedResponse(query, queryEmbedding) {
    try {
      for (const [key, cachedItem] of this.cache.entries()) {
        // Verificar TTL
        if (Date.now() - cachedItem.timestamp > CACHE_TTL) {
          this.cache.delete(key);
          continue;
        }

        // Calcular similitud
        const similarity = this.cosineSimilarity(queryEmbedding, cachedItem.embedding);

        if (similarity >= SIMILARITY_THRESHOLD) {
          logger.info('Cache hit', {
            query: query.substring(0, 50),
            cachedQuery: cachedItem.originalQuery.substring(0, 50),
            similarity: similarity.toFixed(3),
            cacheAge: Math.round((Date.now() - cachedItem.timestamp) / 1000)
          });

          // Actualizar timestamp para LRU
          cachedItem.timestamp = Date.now();

          return {
            ...cachedItem.response,
            fromCache: true,
            similarity,
            cacheKey: key
          };
        }
      }

      return null;
    } catch (error) {
      logger.error('Error checking cache', { error: error.message });
      return null;
    }
  }

  /**
   * Guarda respuesta en cache
   */
  async cacheResponse(query, queryEmbedding, response) {
    try {
      // Evitar cache si hay error en respuesta
      if (response.error || !response.answer) {
        return;
      }

      const key = this.generateKey(query, queryEmbedding);

      // Evitar duplicados
      if (this.cache.has(key)) {
        return;
      }

      // Limpiar cache si está lleno (simple LRU)
      if (this.cache.size >= MAX_CACHE_SIZE) {
        this.evictOldest();
      }

      this.cache.set(key, {
        originalQuery: query,
        embedding: queryEmbedding,
        response: {
          answer: response.answer,
          sources: response.sources || [],
          metadata: response.metadata || {}
        },
        timestamp: Date.now()
      });

      logger.info('Response cached', {
        key,
        query: query.substring(0, 50),
        cacheSize: this.cache.size
      });

    } catch (error) {
      logger.error('Error caching response', { error: error.message });
    }
  }

  /**
   * Elimina entrada más antigua (LRU simple)
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.info('Evicted oldest cache entry', { key: oldestKey });
    }
  }

  /**
   * Limpia entradas expiradas
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > CACHE_TTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info('Cache cleanup completed', {
        cleaned,
        remaining: this.cache.size
      });
    }
  }

  /**
   * Estadísticas del cache
   */
  getStats() {
    const now = Date.now();
    let totalEntries = 0;
    let expiredEntries = 0;
    let avgAge = 0;

    for (const item of this.cache.values()) {
      totalEntries++;
      if (now - item.timestamp > CACHE_TTL) {
        expiredEntries++;
      } else {
        avgAge += (now - item.timestamp);
      }
    }

    avgAge = totalEntries > expiredEntries ? avgAge / (totalEntries - expiredEntries) : 0;

    return {
      totalEntries,
      expiredEntries,
      activeEntries: totalEntries - expiredEntries,
      avgAgeMs: Math.round(avgAge),
      avgAgeMinutes: Math.round(avgAge / (1000 * 60)),
      hitRate: 0 // Calcular con métricas externas
    };
  }

  /**
   * Limpia todo el cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    logger.info('Cache cleared', { previousSize: size });
  }
}

// Instancia singleton
const semanticCache = new SemanticCache();

// Cleanup al cerrar
process.on('SIGINT', () => {
  clearInterval(semanticCache.cleanupInterval);
});

process.on('SIGTERM', () => {
  clearInterval(semanticCache.cleanupInterval);
});

export default semanticCache;
export { semanticCache };
