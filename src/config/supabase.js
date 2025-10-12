/**
 * Supabase Configuration
 * 
 * Cliente de Supabase configurado para acceso a la base de datos vectorial.
 * Incluye configuraciones para FAQs, documentos y búsqueda semántica.
 */

import { createClient } from '@supabase/supabase-js';
import config from './environment.js';
import logger from '../utils/logger.js';

/**
 * Validate Supabase configuration
 */
function validateSupabaseConfig() {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Supabase environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Create Supabase client
 */
function createSupabaseClient() {
  try {
    validateSupabaseConfig();
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: false, // Server-side, no need to persist
        },
        global: {
          headers: {
            'x-application-name': 'chatbot-ai-api',
          },
        },
      }
    );
    
    logger.info('Supabase client initialized successfully', {
      url: process.env.SUPABASE_URL,
    });
    
    return supabase;
    
  } catch (error) {
    logger.error('Failed to initialize Supabase client', {
      error: error.message,
    });
    throw error;
  }
}

/**
 * Create admin Supabase client (with service role key)
 * Use only for admin operations that bypass RLS
 */
function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    logger.warn('SUPABASE_SERVICE_ROLE_KEY not configured. Admin operations will use anon key.');
    return createSupabaseClient();
  }
  
  try {
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    logger.info('Supabase admin client initialized');
    return supabaseAdmin;
    
  } catch (error) {
    logger.error('Failed to initialize Supabase admin client', {
      error: error.message,
    });
    throw error;
  }
}

// Export single instances
export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdminClient();

// Export creator functions for testing
export { createSupabaseClient, createSupabaseAdminClient };

export default supabase;

