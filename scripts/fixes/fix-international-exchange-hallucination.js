#!/usr/bin/env node

/**
 * Fix International Exchange Hallucination
 *
 * CORRIGE la información falsa sobre convenios internacionales
 * Actualiza con información precisa sobre cooperación internacional
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../src/services/embeddings.service.js';
import * as embeddingsCloud from '../src/services/embeddings.service.cloud.js';
import config from '../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// FAQ correcta sobre oportunidades de intercambio internacional
const exchangeFAQ = {
  question: "hay oportunidades de intercambio estudiantil internacional",
  answer: "La UNC tiene cooperación internacional activa con universidades en **China, Rusia e Irán**. Estas oportunidades incluyen programas de intercambio estudiantil y prácticas internacionales en diversas carreras científicas y tecnológicas. Se requiere un promedio mínimo de 16/20 para participar. No hay convenios formales con universidades de USA, España o Brasil actualmente. Para más información sobre oportunidades disponibles, contacta a la oficina de relaciones internacionales. 🌏",
  category: "internacional",
  keywords: ["intercambio estudiantil", "internacional", "convenios", "cooperación", "prácticas"]
};

async function fixInternationalExchangeHallucination() {
  console.log('🌏 CORRIGIENDO ALUCINACIÓN - INTERCAMBIO INTERNACIONAL\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema menciona convenios con USA, España, Brasil');
  console.log('   Información COMPLETAMENTE FALSA\n');

  console.log('✅ SOLUCIÓN: Información precisa sobre cooperación real\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre intercambios internacionales...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .ilike('question', '%intercambio%')
    .or('ilike(question, "%internacional%")')
    .or('ilike(question, "%convenios%")');

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
    console.log('ℹ️ No se encontraron FAQs existentes sobre intercambios\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre intercambios internacionales...');

  const embeddings = await generateEmbeddingsBatch([exchangeFAQ.question]);

  const faqToInsert = {
    question: exchangeFAQ.question,
    answer: exchangeFAQ.answer,
    category: exchangeFAQ.category,
    keywords: exchangeFAQ.keywords,
    metadata: {
      source: 'international-exchange-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'international-cooperation'
    },
    embedding: embeddings[0],
    created_by: 'international-exchange-fix',
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

  console.log('🎯 COOPERACIÓN INTERNACIONAL REAL AHORA DISPONIBLE:');
  console.log('   ✅ Cooperación con China');
  console.log('   ✅ Cooperación con Rusia');
  console.log('   ✅ Cooperación con Irán');
  console.log('   ❌ NO convenios con USA');
  console.log('   ❌ NO convenios con España');
  console.log('   ❌ NO convenios con Brasil');
  console.log('   ✅ Promedio mínimo 16/20\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', exchangeFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "hay oportunidades de intercambio estudiantil internacional", "sessionId": "international-test"}\'\n');

  console.log('✨ COOPERACIÓN INTERNACIONAL CORREGIDA Y PRECISA');
  console.log('=' .repeat(70));
}

fixInternationalExchangeHallucination().catch(console.error);
