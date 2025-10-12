/**
 * Admin Routes
 * 
 * Rutas para administración de FAQs y documentos.
 * Todas requieren autenticación con API key.
 */

import express from 'express';
import {
  listFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  bulkCreateFAQs,
  regenerateEmbeddings,
  getCategories,
  getStats,
} from '../controllers/admin.controller.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Apply admin auth to all routes
router.use(requireAdminAuth);

/**
 * FAQs Management
 */

// List all FAQs with pagination
router.get('/faqs', listFAQs);

// Get specific FAQ
router.get('/faqs/:id', getFAQ);

// Create new FAQ
router.post(
  '/faqs',
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    body('category').optional().isString(),
    body('keywords').optional().isArray(),
    body('metadata').optional().isObject(),
    handleValidationErrors,
  ],
  createFAQ
);

// Update FAQ
router.put('/faqs/:id', updateFAQ);

// Delete FAQ (soft delete by default)
router.delete('/faqs/:id', deleteFAQ);

// Bulk create FAQs
router.post(
  '/faqs/bulk',
  [
    body('faqs').isArray().withMessage('faqs must be an array'),
    body('faqs.*.question').trim().notEmpty().withMessage('Each FAQ must have a question'),
    body('faqs.*.answer').trim().notEmpty().withMessage('Each FAQ must have an answer'),
    handleValidationErrors,
  ],
  bulkCreateFAQs
);

/**
 * Embeddings Management
 */

// Regenerate embeddings for FAQs
router.post('/embeddings/regenerate', regenerateEmbeddings);

/**
 * Analytics & Stats
 */

// Get categories
router.get('/categories', getCategories);

// Get statistics
router.get('/stats', getStats);

export default router;

