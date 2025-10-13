#!/usr/bin/env node

/**
 * Add UNC Authorities FAQs
 * 
 * Agrega FAQs sobre las autoridades de la UNC
 * Rectora: Gabriela Jiménez Ramírez
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

console.log('👩‍🏫 AGREGANDO FAQs SOBRE AUTORIDADES DE LA UNC\n');
console.log('=' .repeat(70));

const authoritiesFAQs = [
  {
    question: "quien es la rectora de la unc",
    answer: "La rectora de la **Universidad Nacional de las Ciencias (UNC)** es **Gabriela Jiménez Ramírez**, quien también es vicepresidenta de Ciencia y Tecnología de Venezuela. Lidera la gestión académica y administrativa de la universidad. 👩‍🏫🎓",
    category: "informacion-general",
    keywords: ["rectora", "gabriela jimenez", "autoridades", "quien es"]
  },
  {
    question: "quien dirige la unc",
    answer: "La **UNC** es dirigida por **Gabriela Jiménez Ramírez**, rectora de la universidad y vicepresidenta de Ciencia y Tecnología. Ella lidera la institución en su misión de formar científicos y tecnólogos. 👩‍🏫",
    category: "informacion-general",
    keywords: ["dirige", "rectora", "autoridades"]
  },
  {
    question: "quien es gabriela jimenez ramirez",
    answer: "**Gabriela Jiménez Ramírez** es la **rectora de la UNC** y **vicepresidenta de Ciencia y Tecnología de Venezuela**. Lidera la universidad en su compromiso con la innovación educativa y el desarrollo de carreras científicas y tecnológicas. 👩‍🏫🔬",
    category: "informacion-general",
    keywords: ["gabriela jimenez", "rectora", "quien es"]
  },
  {
    question: "quien es la rectora",
    answer: "La rectora de la **UNC** es **Gabriela Jiménez Ramírez**, vicepresidenta de Ciencia y Tecnología. Su gestión se enfoca en fortalecer las carreras científicas y tecnológicas que ofrece la universidad. 👩‍🏫",
    category: "informacion-general",
    keywords: ["rectora", "autoridades"]
  },
  {
    question: "quien esta a cargo de la unc",
    answer: "**Gabriela Jiménez Ramírez** está a cargo de la UNC como rectora. También es vicepresidenta de Ciencia y Tecnología de Venezuela. Lidera la universidad en su misión educativa y científica. 👩‍🏫🎓",
    category: "informacion-general",
    keywords: ["a cargo", "rectora", "autoridades"]
  }
];

console.log(`\n📝 Agregando ${authoritiesFAQs.length} FAQs sobre autoridades...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = authoritiesFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = authoritiesFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'unc-authorities',
    added_at: new Date().toISOString(),
    type: 'official-information',
    verified: true
  },
  embedding: embeddings[idx],
  created_by: 'add-unc-authorities',
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

console.log(`✅ ${data.length} FAQs sobre autoridades agregadas!\n`);
console.log('📊 Información agregada:');
console.log('   👩‍🏫 Rectora: Gabriela Jiménez Ramírez');
console.log('   🏛️ Cargo adicional: Vicepresidenta de Ciencia y Tecnología\n');
console.log('✨ El bot ahora puede responder sobre la rectora de la UNC!\n');
