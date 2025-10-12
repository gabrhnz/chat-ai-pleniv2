/**
 * Authentication Middleware
 * 
 * Simple API key-based authentication for admin endpoints.
 * Para autenticación más robusta, considerar JWT o OAuth.
 */

import logger from '../utils/logger.js';

/**
 * Require admin authentication
 * Checks for valid API key in Authorization header or X-API-Key header
 */
export function requireAdminAuth(req, res, next) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-api-key'];
  const validApiKey = process.env.ADMIN_API_KEY;
  
  // Check if admin API key is configured
  if (!validApiKey) {
    logger.error('ADMIN_API_KEY not configured in environment variables');
    return res.status(500).json({
      error: 'Server misconfiguration',
      message: 'Admin authentication not properly configured',
    });
  }
  
  // Validate API key
  if (!apiKey) {
    logger.warn('Admin endpoint accessed without API key', {
      path: req.path,
      ip: req.ip,
    });
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide an API key in Authorization header or X-API-Key header',
    });
  }
  
  if (apiKey !== validApiKey) {
    logger.warn('Admin endpoint accessed with invalid API key', {
      path: req.path,
      ip: req.ip,
      providedKey: apiKey.substring(0, 10) + '...',
    });
    return res.status(403).json({
      error: 'Invalid credentials',
      message: 'The provided API key is invalid',
    });
  }
  
  // Authentication successful
  logger.info('Admin authenticated', {
    path: req.path,
    ip: req.ip,
  });
  
  // Optionally attach admin user info to request
  req.user = {
    id: 'admin',
    role: 'admin',
  };
  
  next();
}

/**
 * Optional authentication
 * Allows both authenticated and anonymous access
 * Useful for endpoints that provide different data based on auth status
 */
export function optionalAuth(req, res, next) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-api-key'];
  const validApiKey = process.env.ADMIN_API_KEY;
  
  if (apiKey && apiKey === validApiKey) {
    req.user = {
      id: 'admin',
      role: 'admin',
    };
    req.isAuthenticated = true;
  } else {
    req.user = null;
    req.isAuthenticated = false;
  }
  
  next();
}

export default {
  requireAdminAuth,
  optionalAuth,
};

