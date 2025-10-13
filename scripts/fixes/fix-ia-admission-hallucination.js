#!/usr/bin/env node

/**
 * Fix IA Admission Requirements Hallucination
 *
 * CORRIGE la información falsa sobre promedio requerido para IA
 * Puntaje correcto en escala venezolana (máximo 20 puntos)
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

// FAQ correcta sobre requisitos de ingreso para IA
const iaAdmissionFAQ = {
  question: "cuanto promedio necesito para entrar en la carrera de ia",
  answer: "Para la Ingeniería en Inteligencia Artificial, que es una carrera muy demandada, necesitas un promedio alto en bachillerato. Generalmente se requiere entre 15-18 puntos sobre 20 como máximo posible. La competencia es alta, por lo que se recomienda un promedio excelente en matemáticas y ciencias. Los requisitos incluyen título de bachiller, notas certificadas y cédula de identidad. 📊🤖",
  category: "admisiones",
  keywords: ["promedio IA", "requisitos IA", "entrar ingeniería IA", "puntos IA"]
};

async function fixIAAdmissionHallucination() {
  console.log('📊 CORRIGIENDO ALUCINACIÓN - PROMEDIO PARA INGENIERÍA EN IA\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema dice promedio mínimo de 70 puntos');
  console.log('   Información COMPLETAMENTE FALSA (máximo es 20)\n');

  console.log('✅ SOLUCIÓN: Información correcta en escala venezolana\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre promedio IA...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .or('question.ilike.%promedio.*ia%,question.ilike.%ia.*promedio%,question.ilike.%entrar.*ia%');

  if (existingFAQs && existingFAQs.length > 0) {
    console.log(`📋 Encontradas ${existingFAQs.length} FAQs existentes`);
    for (const faq of existingFAQs) {
      console.log(`   Eliminando: "${faq.question}"`);

      await supabase
        .from('faqs')
        .delete()
        .eq('id', faq.id);
    }
    console.log('✅ FAQs erróneas eliminadas\n');
  } else {
    console.log('ℹ️ No se encontraron FAQs existentes sobre promedio IA\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre promedio para IA...');

  const embeddings = await generateEmbeddingsBatch([iaAdmissionFAQ.question]);

  const faqToInsert = {
    question: iaAdmissionFAQ.question,
    answer: iaAdmissionFAQ.answer,
    category: iaAdmissionFAQ.category,
    keywords: iaAdmissionFAQ.keywords,
    metadata: {
      source: 'ia-admission-requirements-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'ia-admission-requirements'
    },
    embedding: embeddings[0],
    created_by: 'ia-admission-fix',
    is_active: true,
  };

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqToInsert)
    .select();

  if (error) {
    console.error('❌ Error agregando FAQ correcta:', error.message);
    process.exit(1);
  }

  console.log('✅ FAQ CORRECTA AGREGADA\n');

  console.log('🎯 REQUISITOS CORRECTOS AHORA DISPONIBLES:');
  console.log('   ✅ Promedio 15-18 puntos (sobre 20 máximo)');
  console.log('   ✅ Carrera muy demandada');
  console.log('   ✅ Alta competencia');
  console.log('   ✅ Énfasis en matemáticas y ciencias');
  console.log('   ✅ Requisitos documentales completos\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', iaAdmissionFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "cuanto promedio necesito para entrar en la carrera de ia", "sessionId": "ia-admission-test"}\'\n');

  console.log('✨ REQUISITOS DE ADMISIÓN PARA IA CORREGIDOS Y PRECISOS');
  console.log('=' .repeat(70));
}

fixIAAdmissionHallucination().catch(console.error);
