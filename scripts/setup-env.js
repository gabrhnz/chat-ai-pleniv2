#!/usr/bin/env node

/**
 * Setup Environment Variables
 * 
 * Este script te ayuda a configurar el archivo .env con tus credenciales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, 'env.example');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔧 Configuración de Variables de Entorno\n');
  console.log('Este script te ayudará a crear tu archivo .env\n');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (s/n): ');
    if (overwrite.toLowerCase() !== 's') {
      console.log('❌ Operación cancelada');
      rl.close();
      return;
    }
  }
  
  console.log('\n📝 Por favor proporciona las siguientes credenciales:\n');
  
  // OpenRouter
  console.log('🔑 OpenRouter (https://openrouter.ai/)');
  const openrouterKey = await question('API Key (sk-or-v1-...): ');
  
  // Supabase
  console.log('\n🗄️  Supabase (https://supabase.com)');
  const supabaseUrl = await question('Project URL (https://xxxxx.supabase.co): ');
  const supabaseAnonKey = await question('Anon Key (eyJ...): ');
  const supabaseServiceKey = await question('Service Role Key (eyJ...): ');
  
  // Optional configs
  console.log('\n⚙️  Configuración Opcional (presiona Enter para usar valores por defecto)\n');
  const adminKey = await question('Admin API Key [plani-admin-secret]: ') || 'plani-admin-secret';
  const siteUrl = await question('Site URL [https://plani-chatbot.vercel.app]: ') || 'https://plani-chatbot.vercel.app';
  
  // Generate .env content
  const envContent = `# ============================================
# OpenAI / OpenRouter Configuration
# ============================================
OPENAI_API_KEY=${openrouterKey}
OPENAI_MODEL=openai/gpt-4o-mini
USE_OPENROUTER=true
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_APP_NAME=FAQ-Bot-Universitario-Plani
OPENROUTER_SITE_URL=${siteUrl}

# Embeddings Model
EMBEDDING_MODEL=text-embedding-3-small

# ============================================
# Supabase Configuration
# ============================================
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# ============================================
# RAG Configuration
# ============================================
TOP_K_RESULTS=5
SIMILARITY_THRESHOLD=0.7
MAX_CONTEXT_LENGTH=3000

# ============================================
# Server Configuration
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# Rate Limiting
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# Security
# ============================================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,${siteUrl}
ADMIN_API_KEY=${adminKey}

# ============================================
# Logging
# ============================================
LOG_LEVEL=info

# ============================================
# OpenAI Request Configuration
# ============================================
MAX_TOKENS=500
TEMPERATURE=0.3
`;
  
  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Archivo .env creado exitosamente!\n');
    console.log('📍 Ubicación:', envPath);
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Configura Supabase: npm run setup:supabase');
    console.log('   2. Carga FAQs: npm run load:sample');
    console.log('   3. Genera embeddings: npm run init:embeddings');
    console.log('   4. Inicia servidor: npm start\n');
  } catch (error) {
    console.error('\n❌ Error al crear .env:', error.message);
  }
  
  rl.close();
}

main().catch(console.error);

