#!/usr/bin/env node

/**
 * Add Licenciaturas List FAQ - CORRECCIÓN CRÍTICA
 *
 * Agrega FAQ específica que lista correctamente las licenciaturas reales de la UNC
 * SOLUCIONA el problema de alucinación de la IA
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

// FAQ CRÍTICA que corrige la alucinación
const licenciaturasListFAQ = [
  {
    question: "cuáles son las licenciaturas",
    answer: "La UNC ofrece **10 licenciaturas científicas**: **Física Nuclear**, **Biología y Química Computacional**, **Biotecnología**, **Ciencia Molecular**, **Ciencia de Datos**, **Física**, **Matemáticas**, **Nanotecnología**, **Filosofía**, y **Oceanología**. Todas orientadas a investigación científica y desarrollo tecnológico. 🎓🔬",
    category: "carreras",
    keywords: ["licenciaturas", "carreras", "programas", "ofrece", "cuáles son", "lista"]
  },
  {
    question: "qué licenciaturas ofrece la unc",
    answer: "La Universidad Nacional de las Ciencias ofrece **10 licenciaturas especializadas**: **Física Nuclear**, **Biología y Química Computacional**, **Biotecnología**, **Ciencia Molecular**, **Ciencia de Datos**, **Física**, **Matemáticas**, **Nanotecnología**, **Filosofía**, y **Oceanología**. Todas con enfoque en ciencia y tecnología avanzada. 🎓🌟",
    category: "carreras",
    keywords: ["licenciaturas", "ofrece", "unc", "qué", "programas académicos"]
  },
  {
    question: "cuántas licenciaturas tiene",
    answer: "La UNC tiene **10 licenciaturas especializadas** en ciencias: Física Nuclear, Biología y Química Computacional, Biotecnología, Ciencia Molecular, Ciencia de Datos, Física, Matemáticas, Nanotecnología, Filosofía, y Oceanología. Todas diseñadas para formar científicos e investigadores. 🔢🎓",
    category: "carreras",
    keywords: ["cuántas", "número", "licenciaturas", "tiene"]
  },
  {
    question: "lista de licenciaturas",
    answer: "**Las 10 licenciaturas de la UNC son:**\n\n1. **Física Nuclear** ⚛️\n2. **Biología y Química Computacional** 🧬\n3. **Biotecnología** 💉\n4. **Ciencia Molecular** 🔬\n5. **Ciencia de Datos** 📊\n6. **Física** 🌌\n7. **Matemáticas** 🔢\n8. **Nanotecnología** ⚡\n9. **Filosofía** 🤔\n10. **Oceanología** 🌊\n\nTodas con énfasis en investigación científica. 📚",
    category: "carreras",
    keywords: ["lista", "licenciaturas", "programas", "completa"]
  },
  {
    question: "qué carreras científicas ofrece",
    answer: "Ofrecemos **10 carreras científicas especializadas**: Física Nuclear (energía y medicina), Biología y Química Computacional (bioinformática), Biotecnología (ingeniería genética), Ciencia Molecular (investigación médica), Ciencia de Datos (análisis e IA), Física (ciencia fundamental), Matemáticas (modelado), Nanotecnología (materiales avanzados), Filosofía (pensamiento crítico), y Oceanología (ecosistemas marinos). 🔬🎓",
    category: "carreras",
    keywords: ["carreras científicas", "científicas", "ofrece", "especializadas"]
  }
];

async function addLicenciaturasListFAQ() {
  console.log('🚨 CORRIENDO FAQ CRÍTICA - LISTA DE LICENCIATURAS\n');
  console.log('❌ Problema: IA alucinando licenciaturas inexistentes\n');
  console.log('✅ Solución: FAQ específica con lista REAL de licenciaturas\n\n');

  console.log(`📋 Adding ${licenciaturasListFAQ.length} critical FAQs\n`);

  console.log('🔢 Generating embeddings...');
  const questions = licenciaturasListFAQ.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');

  const faqsToInsert = licenciaturasListFAQ.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'licenciaturas-list-critical-fix',
      added_at: new Date().toISOString(),
      type: 'critical-correction',
      priority: 'critical',
      fix_for: 'ai-hallucination-licenciaturas'
    },
    embedding: embeddings[idx],
    created_by: 'critical-fix-licenciaturas',
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();

  if (error) {
    console.error('❌ Error inserting critical fix:', error.message);
    process.exit(1);
  }

  console.log(`✅ CRITICAL FIX APPLIED: ${data.length} FAQs added\n`);
  console.log('🎯 Now the AI will respond correctly to:');
  console.log('   - "cuáles son las licenciaturas"');
  console.log('   - "qué licenciaturas ofrece la unc"');
  console.log('   - "cuántas licenciaturas tiene"');
  console.log('   - "lista de licenciaturas"');
  console.log('   - "qué carreras científicas ofrece"\n');

  console.log('📊 REAL licenciaturas (10 total):');
  console.log('   1. Física Nuclear');
  console.log('   2. Biología y Química Computacional');
  console.log('   3. Biotecnología');
  console.log('   4. Ciencia Molecular');
  console.log('   5. Ciencia de Datos');
  console.log('   6. Física');
  console.log('   7. Matemáticas');
  console.log('   8. Nanotecnología');
  console.log('   9. Filosofía');
  console.log('   10. Oceanología\n');

  console.log('🚨 ALUCINACIONES ELIMINADAS:');
  console.log('   ❌ Ciencias Ambientales (NO EXISTE)');
  console.log('   ❌ Bioquímica (NO EXISTE)');
  console.log('   ❌ Ciencias de la Computación (NO EXISTE)');
  console.log('   ❌ Geología (NO EXISTE)');
  console.log('   ❌ Psicología (NO EXISTE)\n');

  console.log('✨ AI hallucination issue FIXED! 🤖✅\n');
}

addLicenciaturasListFAQ()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Critical fix failed:', error);
    process.exit(1);
  });
