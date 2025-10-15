#!/usr/bin/env node

/**
 * Add Comedor Universitario FAQ (Corrección)
 * 
 * Corrige la información sobre el comedor universitario de la UNC
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

console.log('🍽️  AGREGANDO FAQ SOBRE COMEDOR UNIVERSITARIO\n');
console.log('=' .repeat(70));

const comedorFAQs = [
  {
    question: "hay comedor universitario",
    answer: "Sí, la UNC ofrece **comedor universitario** para todos los estudiantes. Si eres **residente**: tienes derecho a **desayuno, almuerzo y cena**. Si **no eres residente**: tienes derecho a **almuerzo**. Esto incluye también a los estudiantes que cursan el **CAIU**. 🍽️✨",
    category: "servicios",
    keywords: ["comedor", "comedor universitario", "alimentación", "comida", "almuerzo", "desayuno", "cena"]
  },
  {
    question: "que comidas incluye el comedor",
    answer: "El comedor universitario ofrece: **Residentes** → desayuno, almuerzo y cena. **No residentes** (incluyendo CAIU) → almuerzo. Es un servicio disponible para todos los estudiantes de la UNC. 🍽️🎓",
    category: "servicios",
    keywords: ["comidas", "comedor", "desayuno", "almuerzo", "cena", "incluye"]
  },
  {
    question: "puedo comer en la universidad",
    answer: "Sí, la UNC tiene **comedor universitario**. Si eres residente, tienes 3 comidas (desayuno, almuerzo, cena). Si no eres residente, tienes almuerzo. Estudiantes del CAIU también tienen acceso. 🍽️✅",
    category: "servicios",
    keywords: ["comer", "comedor", "alimentación", "universidad"]
  },
  {
    question: "los del caiu pueden usar el comedor",
    answer: "Sí, los estudiantes del **CAIU** tienen acceso al comedor universitario. Tienen derecho a **almuerzo** (igual que los estudiantes regulares no residentes). 🍽️📚",
    category: "servicios",
    keywords: ["caiu", "comedor", "pueden", "acceso"]
  },
  {
    question: "como funciona el comedor universitario",
    answer: "El comedor funciona así: **Residentes** → desayuno, almuerzo y cena incluidos. **No residentes y CAIU** → almuerzo incluido. Es parte de los servicios estudiantiles de la UNC. 🍽️🎓",
    category: "servicios",
    keywords: ["como funciona", "comedor", "servicios"]
  }
];

console.log(`\n📝 Agregando ${comedorFAQs.length} FAQs sobre comedor universitario...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = comedorFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = comedorFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'comedor-correction',
    added_at: new Date().toISOString(),
    type: 'service-information',
    priority: 'high',
    corrects_misinformation: true
  },
  embedding: embeddings[idx],
  created_by: 'add-comedor-faq',
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

console.log(`✅ ${data.length} FAQs sobre comedor universitario agregadas!\n`);
console.log('✨ Ahora el bot puede responder correctamente sobre:');
console.log('   - "hay comedor universitario"');
console.log('   - "que comidas incluye el comedor"');
console.log('   - "puedo comer en la universidad"');
console.log('   - "los del caiu pueden usar el comedor"');
console.log('   - "como funciona el comedor universitario"\n');
console.log('🍽️  Información corregida: Comedor disponible para todos los estudiantes');
console.log('   - Residentes: desayuno, almuerzo y cena');
console.log('   - No residentes y CAIU: almuerzo\n');
