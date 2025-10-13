#!/usr/bin/env node

/**
 * Fix Admission Scores Hallucination
 * 
 * Corrige alucinaciones sobre notas específicas de admisión (15-18 puntos)
 * Usa información conservadora sin puntajes exactos
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

console.log('📝 CORRIGIENDO ALUCINACIÓN - NOTAS DE ADMISIÓN\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: Sistema menciona "15-18 puntos" como requisito');
console.log('✅ SOLUCIÓN: Información conservadora sin puntajes específicos');
console.log('=' .repeat(70));

// Buscar y eliminar FAQs con puntajes específicos
console.log('\n🗑️ Buscando FAQs erróneas sobre notas de admisión...');

const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%15 a 18 puntos%,answer.ilike.%18 puntos%,answer.ilike.%16 puntos%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs con puntajes específicos`);
  oldFAQs.forEach(faq => {
    console.log(`   - "${faq.question}"`);
  });
  
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', oldFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  console.log(`✅ ${oldFAQs.length} FAQs incorrectas eliminadas`);
} else {
  console.log('ℹ️ No se encontraron FAQs con puntajes específicos');
}

// FAQs correctas sobre requisitos de admisión
const correctAdmissionFAQs = [
  {
    question: "que nota necesito para entrar",
    answer: "Los requisitos de admisión varían según la carrera y la demanda. Debes presentar **prueba de aptitud académica** y tener **título de bachiller**. Para información específica sobre tu carrera de interés, contacta a admisiones. 📚",
    category: "admision",
    keywords: ["nota", "requisito", "entrar", "admision"]
  },
  {
    question: "cual es el promedio minimo",
    answer: "Los requisitos varían según la carrera. Debes tener **título de bachiller** y aprobar la **prueba de aptitud académica**. Para información específica sobre promedios requeridos, contacta a admisiones. 📊",
    category: "admision",
    keywords: ["promedio", "minimo", "requisito"]
  },
  {
    question: "cuantos puntos necesito",
    answer: "Los requisitos de admisión varían según la carrera. Debes aprobar la **prueba de aptitud académica** (matemáticas, lógica, comprensión). Para información específica sobre tu carrera de interés, contacta a admisiones. ✅",
    category: "admision",
    keywords: ["puntos", "necesito", "requisito"]
  },
  {
    question: "que puntaje piden",
    answer: "Los requisitos varían según la carrera y la demanda. Debes aprobar la **prueba de aptitud académica**. Para información actualizada sobre puntajes requeridos para tu carrera de interés, contacta a admisiones. 📋",
    category: "admision",
    keywords: ["puntaje", "piden", "requisito"]
  }
];

console.log('\n📝 Agregando FAQs correctas sobre admisión...');
const questions = correctAdmissionFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);

const faqsToInsert = correctAdmissionFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'hallucination-fix-admission-scores',
    fixed_at: new Date().toISOString(),
    issue: 'removed-specific-scores'
  },
  embedding: embeddings[idx],
  created_by: 'fix-admission-scores',
  is_active: true,
}));

const { data, error } = await supabase
  .from('faqs')
  .insert(faqsToInsert)
  .select();

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log(`✅ ${data.length} FAQs correctas agregadas`);
console.log('\n✨ Corrección completada!');
console.log('📊 Información ahora es conservadora y sin puntajes específicos\n');
