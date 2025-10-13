#!/usr/bin/env node

/**
 * Add CAIU Module 3 Variations
 * 
 * Agrega más variaciones de preguntas sobre el Módulo 3 (Filosofía)
 * para que el bot detecte mejor cuando preguntan por él
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

console.log('📚 AGREGANDO VARIACIONES PARA MÓDULO 3 DEL CAIU\n');
console.log('=' .repeat(70));

const module3VariationsFAQs = [
  {
    question: "que vere en el modulo 3",
    answer: "En el **Módulo III - Filosofía de las Ciencias y Metodología** verás: 🤔 **Epistemología y descolonización**, 🔬 **Validez y límites del conocimiento científico**, 📋 **Causas aristotélicas y formulación de preguntas de investigación**, y 💡 **Pensamiento crítico** hacia una ciencia ética para la liberación. 🧠",
    category: "admision",
    keywords: ["modulo 3", "modulo III", "modulo tres", "caiu"]
  },
  {
    question: "que veo en el modulo 3 del caiu",
    answer: "El **Módulo 3** del CAIU es **Filosofía de las Ciencias y Metodología de la Investigación**. Estudias: 🤔 Epistemología, 🔬 Validez del conocimiento científico, 📋 Metodología de investigación (causas aristotélicas, formulación de preguntas), y 💡 Pensamiento crítico y descolonización. 🧠",
    category: "admision",
    keywords: ["modulo 3", "modulo III", "caiu", "filosofia"]
  },
  {
    question: "que es el modulo 3 del caiu",
    answer: "El **Módulo 3** es **Filosofía de las Ciencias y Metodología de la Investigación**. Cubre epistemología, validez del conocimiento científico, causas aristotélicas, formulación de preguntas de investigación, y pensamiento crítico para una ciencia ética. Es fundamental para tu formación científica. 🤔🔬",
    category: "admision",
    keywords: ["modulo 3", "que es", "caiu"]
  },
  {
    question: "que vere en el modulo III",
    answer: "En el **Módulo III** (Filosofía y Metodología) verás: 🤔 **Epistemología** (teoría del conocimiento), 🔬 **Filosofía de la ciencia** (validez y límites), 📋 **Metodología de investigación** (causas aristotélicas, preguntas de investigación), y 💡 **Pensamiento crítico** y descolonización del conocimiento. 🧠",
    category: "admision",
    keywords: ["modulo III", "modulo 3", "caiu"]
  },
  {
    question: "modulo 3 caiu",
    answer: "**Módulo 3 - Filosofía de las Ciencias y Metodología**: Incluye 🤔 epistemología y descolonización, 🔬 validez y límites del conocimiento científico, 📋 causas aristotélicas y formulación de preguntas de investigación, y 💡 pensamiento crítico hacia una ciencia ética para la liberación. 🧠",
    category: "admision",
    keywords: ["modulo 3", "caiu"]
  },
  {
    question: "modulo III caiu",
    answer: "**Módulo III - Filosofía y Metodología de la Investigación**: Estudias epistemología, validez del conocimiento científico, metodología de investigación (causas aristotélicas, formulación de preguntas), pensamiento crítico y descolonización. Es el módulo de filosofía aplicada a las ciencias. 🤔🔬",
    category: "admision",
    keywords: ["modulo III", "caiu"]
  },
  {
    question: "que temas tiene el modulo 3",
    answer: "El **Módulo 3** tiene estos temas: 🤔 **Epistemología y descolonización** del conocimiento, 🔬 **Validez y límites** del conocimiento científico, 📋 **Causas aristotélicas** y **formulación de preguntas de investigación**, y 💡 **Pensamiento crítico** para una ciencia ética. 🧠",
    category: "admision",
    keywords: ["temas", "modulo 3", "caiu"]
  },
  {
    question: "de que trata el modulo 3 del caiu",
    answer: "El **Módulo 3** trata sobre **Filosofía de las Ciencias y Metodología de la Investigación**. Aprendes cómo se construye el conocimiento científico, sus límites, metodología de investigación, y desarrollas pensamiento crítico. Es filosofía aplicada a tu formación científica. 🤔🔬",
    category: "admision",
    keywords: ["de que trata", "modulo 3", "caiu"]
  },
  {
    question: "que aprendo en el modulo 3",
    answer: "En el **Módulo 3** aprendes: 🤔 **Epistemología** (cómo conocemos), 🔬 **Filosofía de la ciencia** (validez del conocimiento), 📋 **Metodología de investigación** (cómo formular preguntas científicas), y 💡 **Pensamiento crítico** aplicado a las ciencias. 🧠",
    category: "admision",
    keywords: ["aprendo", "modulo 3", "caiu"]
  },
  {
    question: "modulo tres del caiu",
    answer: "El **Módulo Tres** es **Filosofía de las Ciencias y Metodología**. Cubre: 🤔 Epistemología y descolonización, 🔬 Validez del conocimiento científico, 📋 Causas aristotélicas y metodología de investigación, y 💡 Pensamiento crítico para una ciencia ética. 🧠",
    category: "admision",
    keywords: ["modulo tres", "caiu"]
  }
];

console.log(`\n📝 Agregando ${module3VariationsFAQs.length} variaciones para Módulo 3...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = module3VariationsFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = module3VariationsFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'caiu-module3-variations',
    added_at: new Date().toISOString(),
    type: 'query-variations',
    module: 'III'
  },
  embedding: embeddings[idx],
  created_by: 'add-caiu-module3-variations',
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

console.log(`✅ ${data.length} variaciones para Módulo 3 agregadas!\n`);
console.log('✨ Ahora el bot detectará mejor preguntas como:');
console.log('   - "que vere en el modulo 3"');
console.log('   - "modulo 3 caiu"');
console.log('   - "modulo III"');
console.log('   - "que temas tiene el modulo 3"\n');
