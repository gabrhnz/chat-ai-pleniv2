#!/usr/bin/env node

/**
 * Verify Setup Script
 * 
 * Verifica que todo esté configurado correctamente antes de iniciar el servidor
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

console.log('\n🔍 Verificando configuración del sistema...\n');

let hasErrors = false;

/**
 * Check 1: Environment variables
 */
console.log('1️⃣  Verificando variables de entorno...');

const requiredEnvVars = [
  'OPENAI_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('   ❌ Variables faltantes:', missingVars.join(', '));
  console.log('   💡 Ejecuta: npm run setup:env');
  hasErrors = true;
} else {
  console.log('   ✅ Todas las variables requeridas están configuradas');
  
  // Verify API key format
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('   ⚠️  OPENAI_API_KEY no parece válida (debe empezar con "sk-")');
  }
  
  if (!process.env.SUPABASE_URL.startsWith('https://')) {
    console.log('   ⚠️  SUPABASE_URL no parece válida (debe empezar con "https://")');
  }
}

/**
 * Check 2: Supabase connection
 */
console.log('\n2️⃣  Verificando conexión a Supabase...');

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test connection
  const { data, error } = await supabase.from('faqs').select('id').limit(1);
  
  if (error) {
    console.log('   ❌ Error conectando a Supabase:', error.message);
    console.log('   💡 Verifica que hayas ejecutado el schema SQL en Supabase');
    hasErrors = true;
  } else {
    console.log('   ✅ Conexión a Supabase exitosa');
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
  hasErrors = true;
}

/**
 * Check 3: FAQs in database
 */
console.log('\n3️⃣  Verificando FAQs en la base de datos...');

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { data, error } = await supabase.from('faqs').select('id, question, embedding');
  
  if (error) {
    console.log('   ❌ Error consultando FAQs:', error.message);
    hasErrors = true;
  } else if (!data || data.length === 0) {
    console.log('   ⚠️  No hay FAQs en la base de datos');
    console.log('   💡 Ejecuta: npm run setup:supabase');
    hasErrors = true;
  } else {
    console.log(`   ✅ ${data.length} FAQs encontradas`);
    
    // Check embeddings
    const withEmbeddings = data.filter(faq => faq.embedding && faq.embedding.length > 0);
    const withoutEmbeddings = data.length - withEmbeddings.length;
    
    if (withoutEmbeddings > 0) {
      console.log(`   ⚠️  ${withoutEmbeddings} FAQs sin embeddings`);
      console.log('   💡 Ejecuta: npm run init:embeddings');
      hasErrors = true;
    } else {
      console.log(`   ✅ Todas las FAQs tienen embeddings`);
    }
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
  hasErrors = true;
}

/**
 * Check 4: OpenRouter/OpenAI connection
 */
console.log('\n4️⃣  Verificando conexión a OpenRouter/OpenAI...');

try {
  const clientConfig = {
    apiKey: process.env.OPENAI_API_KEY,
  };
  
  if (process.env.USE_OPENROUTER === 'true') {
    clientConfig.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    clientConfig.defaultHeaders = {
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
      'X-Title': process.env.OPENROUTER_APP_NAME || 'Plani-Chatbot',
    };
    console.log('   ℹ️  Usando OpenRouter');
  } else {
    console.log('   ℹ️  Usando OpenAI directamente');
  }
  
  const openai = new OpenAI(clientConfig);
  
  // Test with a simple completion
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Test' }],
    max_tokens: 5,
  });
  
  if (response.choices && response.choices.length > 0) {
    console.log('   ✅ Conexión a OpenRouter/OpenAI exitosa');
    console.log(`   ℹ️  Modelo: ${response.model}`);
  } else {
    console.log('   ⚠️  Respuesta inesperada de OpenRouter/OpenAI');
  }
} catch (error) {
  console.log('   ❌ Error conectando a OpenRouter/OpenAI:', error.message);
  
  if (error.status === 401) {
    console.log('   💡 API key inválida. Verifica tu OPENAI_API_KEY');
  } else if (error.status === 429) {
    console.log('   💡 Rate limit excedido o sin créditos');
  }
  
  hasErrors = true;
}

/**
 * Check 5: Required tables
 */
console.log('\n5️⃣  Verificando tablas requeridas...');

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const tables = ['faqs', 'documents', 'document_chunks', 'chat_sessions', 'analytics'];
  let allExist = true;
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    
    if (error) {
      console.log(`   ❌ Tabla "${table}" no existe`);
      allExist = false;
    }
  }
  
  if (allExist) {
    console.log('   ✅ Todas las tablas requeridas existen');
  } else {
    console.log('   💡 Ejecuta el schema SQL en Supabase SQL Editor');
    hasErrors = true;
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
  hasErrors = true;
}

/**
 * Check 6: RPC functions
 */
console.log('\n6️⃣  Verificando funciones RPC...');

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test match_faqs function with a dummy embedding
  const dummyEmbedding = new Array(1536).fill(0);
  const { data, error } = await supabase.rpc('match_faqs', {
    query_embedding: dummyEmbedding,
    match_threshold: 0.5,
    match_count: 1,
  });
  
  if (error) {
    console.log('   ❌ Función "match_faqs" no existe o tiene error:', error.message);
    console.log('   💡 Ejecuta el schema SQL completo en Supabase');
    hasErrors = true;
  } else {
    console.log('   ✅ Función "match_faqs" existe y funciona');
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
  hasErrors = true;
}

/**
 * Summary
 */
console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ Se encontraron problemas en la configuración\n');
  console.log('📋 Pasos para resolver:');
  console.log('   1. Ejecuta: npm run setup:env');
  console.log('   2. Configura Supabase (extensiones + schema SQL)');
  console.log('   3. Ejecuta: npm run setup:supabase');
  console.log('   4. Ejecuta: npm run init:embeddings');
  console.log('   5. Vuelve a ejecutar: node scripts/verify-setup.js\n');
  process.exit(1);
} else {
  console.log('\n✅ ¡Todo está configurado correctamente!\n');
  console.log('🚀 Puedes iniciar el servidor con: npm start\n');
  console.log('📚 Documentación:');
  console.log('   - INSTRUCCIONES_COMPLETAS.md');
  console.log('   - QUICKSTART_SETUP.md');
  console.log('   - V0_INTEGRATION.md\n');
  process.exit(0);
}

