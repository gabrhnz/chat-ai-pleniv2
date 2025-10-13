#!/usr/bin/env node

/**
 * Add AI Model FAQ
 * 
 * Agrega FAQ sobre qué modelo de IA es el bot
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../../src/services/embeddings.service.js';
import * as embeddingsCloud from '../../src/services/embeddings.service.cloud.js';
import config from '../../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });

const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🤖 AGREGANDO FAQ SOBRE MODELO DE IA\n');
console.log('=' .repeat(70));

const aiModelFAQs = [
  {
    question: "que modelo de ia eres",
    answer: "Soy **UeneceAI** basado en **OpenAI GPT-4o-mini**. Estoy diseñado para ayudarte con información sobre la Universidad Nacional de las Ciencias (UNC). 🤖✨",
    category: "bot-info",
    keywords: ["modelo", "ia", "gpt", "openai", "que eres"]
  },
  {
    question: "que inteligencia artificial eres",
    answer: "Soy **UeneceAI**, un asistente basado en **OpenAI GPT-4o-mini**. Mi propósito es brindarte información sobre la UNC de forma rápida y precisa. 🤖",
    category: "bot-info",
    keywords: ["inteligencia artificial", "modelo", "ia"]
  },
  {
    question: "que version de gpt eres",
    answer: "Soy **UeneceAI** y utilizo **GPT-4o-mini** de OpenAI. Estoy especializado en responder preguntas sobre la Universidad Nacional de las Ciencias. 🤖",
    category: "bot-info",
    keywords: ["version", "gpt", "modelo"]
  },
  {
    question: "cual es tu modelo",
    answer: "Mi modelo es **GPT-4o-mini** de OpenAI. Soy **UeneceAI**, un asistente creado para ayudarte con información sobre la UNC. 🤖✨",
    category: "bot-info",
    keywords: ["modelo", "cual es"]
  },
  {
    question: "eres chatgpt",
    answer: "Soy **UeneceAI**, basado en **GPT-4o-mini** de OpenAI. Aunque uso tecnología similar a ChatGPT, estoy especializado en información sobre la Universidad Nacional de las Ciencias. 🤖🎓",
    category: "bot-info",
    keywords: ["chatgpt", "eres"]
  },
  {
    question: "que tecnologia usas",
    answer: "Uso **GPT-4o-mini** de OpenAI. Soy **UeneceAI**, un asistente especializado en la UNC. Combino inteligencia artificial con una base de conocimientos sobre la universidad. 🤖💡",
    category: "bot-info",
    keywords: ["tecnologia", "usas", "modelo"]
  }
];

console.log(`\n📝 Agregando ${aiModelFAQs.length} FAQs sobre modelo de IA...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = aiModelFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = aiModelFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'ai-model-info',
    added_at: new Date().toISOString(),
    type: 'bot-metadata'
  },
  embedding: embeddings[idx],
  created_by: 'add-ai-model-faq',
  is_active: true,
}));

// Insertar en Supabase
const { data, error } = await supabase
  .from('faqs')
  .insert(faqsToInsert)
  .select();

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log(`✅ ${data.length} FAQs sobre modelo de IA agregadas!\n`);
console.log('🤖 Información agregada:');
console.log('   - Nombre: UeneceAI');
console.log('   - Modelo: OpenAI GPT-4o-mini');
console.log('   - Propósito: Asistente especializado en la UNC\n');
console.log('✨ El bot ahora puede responder sobre su modelo de IA!\n');
