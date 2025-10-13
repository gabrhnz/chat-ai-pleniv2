/**
 * Admin Controller
 * 
 * Endpoints para administración de FAQs y documentos.
 * Requiere autenticación con API key.
 */

import { supabase, supabaseAdmin } from '../config/supabase.js';
// Import both embedding services
import * as embeddingsLocal from '../services/embeddings.service.js';
import * as embeddingsCloud from '../services/embeddings.service.cloud.js';
import config from '../config/environment.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Select embedding service based on environment
const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbedding, generateEmbeddingsBatch } = embeddingsService;

/**
 * GET /api/admin/faqs
 * List all FAQs with pagination and filters
 */
export const listFAQs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    isActive,
    search,
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('faqs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  // Apply filters
  if (category) {
    query = query.eq('category', category);
  }
  
  if (isActive !== undefined) {
    query = query.eq('is_active', isActive === 'true');
  }
  
  if (search) {
    query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    logger.error('Failed to list FAQs', { error: error.message });
    throw error;
  }
  
  res.status(200).json({
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
});

/**
 * GET /api/admin/faqs/:id
 * Get a specific FAQ by ID
 */
export const getFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    throw error;
  }
  
  res.status(200).json(data);
});

/**
 * POST /api/admin/faqs
 * Create a new FAQ
 */
export const createFAQ = asyncHandler(async (req, res) => {
  const {
    question,
    answer,
    category,
    keywords = [],
    metadata = {},
  } = req.body;
  
  // Validate required fields
  if (!question || !answer) {
    return res.status(400).json({
      error: 'question and answer are required',
    });
  }
  
  logger.info('Creating new FAQ', {
    question: question.substring(0, 50),
    category,
  });
  
  // Generate embedding for the question
  const embedding = await generateEmbedding(question);
  
  // Insert FAQ using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin
    .from('faqs')
    .insert({
      question,
      answer,
      category,
      keywords,
      metadata,
      embedding,
      created_by: req.user?.id || 'admin',
    })
    .select()
    .single();
  
  if (error) {
    logger.error('Failed to create FAQ', { error: error.message });
    throw error;
  }
  
  logger.info('FAQ created successfully', { id: data.id });
  
  res.status(201).json(data);
});

/**
 * PUT /api/admin/faqs/:id
 * Update an existing FAQ
 */
export const updateFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    question,
    answer,
    category,
    keywords,
    metadata,
    is_active,
  } = req.body;
  
  const updates = {};
  
  // Only update provided fields
  if (question !== undefined) updates.question = question;
  if (answer !== undefined) updates.answer = answer;
  if (category !== undefined) updates.category = category;
  if (keywords !== undefined) updates.keywords = keywords;
  if (metadata !== undefined) updates.metadata = metadata;
  if (is_active !== undefined) updates.is_active = is_active;
  
  // If question changed, regenerate embedding
  if (question) {
    logger.info('Regenerating embedding for updated question');
    updates.embedding = await generateEmbedding(question);
  }
  
  const { data, error } = await supabaseAdmin
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    throw error;
  }
  
  logger.info('FAQ updated successfully', { id });
  
  res.status(200).json(data);
});

/**
 * DELETE /api/admin/faqs/:id
 * Soft delete an FAQ (set is_active = false)
 */
export const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hard = false } = req.query;
  
  if (hard === 'true') {
    // Hard delete (permanent)
    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    logger.info('FAQ deleted permanently', { id });
    return res.status(204).send();
  } else {
    // Soft delete (set is_active = false)
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'FAQ not found' });
      }
      throw error;
    }
    
    logger.info('FAQ deactivated', { id });
    return res.status(200).json(data);
  }
});

/**
 * POST /api/admin/faqs/bulk
 * Bulk create FAQs from array
 */
export const bulkCreateFAQs = asyncHandler(async (req, res) => {
  const { faqs } = req.body;
  
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return res.status(400).json({
      error: 'faqs must be a non-empty array',
    });
  }
  
  logger.info('Bulk creating FAQs', { count: faqs.length });
  
  // Generate embeddings for all questions
  const questions = faqs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  
  // Prepare FAQ objects with embeddings
  const faqsToInsert = faqs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category || null,
    keywords: faq.keywords || [],
    metadata: faq.metadata || {},
    embedding: embeddings[idx],
    created_by: req.user?.id || 'admin',
  }));
  
  // Insert all FAQs
  const { data, error } = await supabaseAdmin
    .from('faqs')
    .insert(faqsToInsert)
    .select();
  
  if (error) {
    logger.error('Bulk create failed', { error: error.message });
    throw error;
  }
  
  logger.info('Bulk create successful', { inserted: data.length });
  
  res.status(201).json({
    inserted: data.length,
    data,
  });
});

/**
 * POST /api/admin/embeddings/regenerate
 * Regenerate embeddings for all FAQs or specific ones
 */
export const regenerateEmbeddings = asyncHandler(async (req, res) => {
  const { faqIds } = req.body;
  
  logger.info('Starting embedding regeneration', {
    specific: !!faqIds,
    count: faqIds?.length || 'all',
  });
  
  // Fetch FAQs
  let query = supabaseAdmin
    .from('faqs')
    .select('id, question')
    .eq('is_active', true);
  
  if (faqIds && Array.isArray(faqIds)) {
    query = query.in('id', faqIds);
  }
  
  const { data: faqs, error: fetchError } = await query;
  
  if (fetchError) throw fetchError;
  
  if (!faqs || faqs.length === 0) {
    return res.status(404).json({ error: 'No FAQs found to update' });
  }
  
  // Generate new embeddings
  const questions = faqs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  
  // Update FAQs with new embeddings
  const updates = faqs.map((faq, idx) => ({
    id: faq.id,
    embedding: embeddings[idx],
  }));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('faqs')
      .update({ embedding: update.embedding })
      .eq('id', update.id);
    
    if (error) {
      errorCount++;
      logger.error('Failed to update embedding', {
        faqId: update.id,
        error: error.message,
      });
    } else {
      successCount++;
    }
  }
  
  logger.info('Embedding regeneration completed', {
    success: successCount,
    errors: errorCount,
  });
  
  res.status(200).json({
    message: 'Embeddings regenerated',
    success: successCount,
    errors: errorCount,
    total: faqs.length,
  });
});

/**
 * GET /api/admin/categories
 * Get list of all FAQ categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('faqs')
    .select('category')
    .not('category', 'is', null);
  
  if (error) throw error;
  
  // Get unique categories with counts
  const categories = data.reduce((acc, item) => {
    const cat = item.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  
  const result = Object.entries(categories).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count);
  
  res.status(200).json(result);
});

/**
 * GET /api/admin/stats
 * Get analytics and statistics
 */
export const getStats = asyncHandler(async (req, res) => {
  const { timeRange = '7d' } = req.query;
  
  // Calculate date range
  const now = new Date();
  const daysAgo = timeRange === '30d' ? 30 : timeRange === '1d' ? 1 : 7;
  const startDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
  
  // Count FAQs
  const { count: totalFAQs } = await supabase
    .from('faqs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  // Count categories
  const { data: categoryData } = await supabase
    .from('faqs')
    .select('category');
  
  const uniqueCategories = new Set(categoryData.map(item => item.category).filter(Boolean));
  
  // Get analytics
  const { data: analyticsData } = await supabase
    .from('analytics')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .eq('event_type', 'query');
  
  const totalQueries = analyticsData?.length || 0;
  const avgResponseTime = analyticsData?.length > 0
    ? Math.round(analyticsData.reduce((sum, item) => sum + (item.response_time_ms || 0), 0) / analyticsData.length)
    : 0;
  
  const avgSimilarity = analyticsData?.length > 0
    ? analyticsData.reduce((sum, item) => {
        const scores = item.similarity_scores || [];
        const topScore = scores[0] || 0;
        return sum + topScore;
      }, 0) / analyticsData.length
    : 0;
  
  res.status(200).json({
    faqs: {
      total: totalFAQs,
      categories: uniqueCategories.size,
    },
    queries: {
      total: totalQueries,
      timeRange: timeRange,
      avgResponseTimeMs: avgResponseTime,
      avgTopSimilarity: avgSimilarity.toFixed(3),
    },
  });
});

export default {
  listFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  bulkCreateFAQs,
  regenerateEmbeddings,
  getCategories,
  getStats,
};

