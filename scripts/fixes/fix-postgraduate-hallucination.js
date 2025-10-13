#!/usr/bin/env node

/**
 * Fix Postgraduate Programs Hallucination
 *
 * CORRIGE la información falsa sobre programas de postgrado y maestrías
 * La UNC actualmente NO ofrece postgrados, solo pre-grado
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

// FAQ correcta sobre programas de postgrado
const postgraduateFAQ = {
  question: "la universidad ofrece programas de postgrado o maestrías",
  answer: "Actualmente la UNC NO ofrece programas de postgrado o maestrías. La universidad se enfoca exclusivamente en carreras de pre-grado (licenciaturas e ingenierías). Los estudiantes que deseen continuar con estudios de postgrado deben buscar oportunidades en otras instituciones universitarias. Para información sobre posibles futuros programas, contacta a la dirección académica. 📚🎓",
  category: "academico",
  keywords: ["postgrado", "maestrías", "doctorado", "post-grado", "especialización"]
};

async function fixPostgraduateHallucination() {
  console.log('🎓 CORRIGIENDO ALUCINACIÓN - PROGRAMAS DE POSTGRADO\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema dice que ofrece maestrías y postgrados');
  console.log('   Información COMPLETAMENTE FALSA\n');

  console.log('✅ SOLUCIÓN: Información precisa y clara\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre postgrados...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .ilike('question', '%postgrado%')
    .or('ilike(question, "%maestría%")')
    .or('ilike(question, "%doctorado%")');

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
    console.log('ℹ️ No se encontraron FAQs existentes sobre postgrados\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre postgrados...');

  const embeddings = await generateEmbeddingsBatch([postgraduateFAQ.question]);

  const faqToInsert = {
    question: postgraduateFAQ.question,
    answer: postgraduateFAQ.answer,
    category: postgraduateFAQ.category,
    keywords: postgraduateFAQ.keywords,
    metadata: {
      source: 'postgraduate-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'postgraduate-programs'
    },
    embedding: embeddings[0],
    created_by: 'postgraduate-fix',
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

  console.log('🎯 INFORMACIÓN CORRECTA AHORA DISPONIBLE:');
  console.log('   ❌ NO ofrece programas de postgrado');
  console.log('   ✅ Solo carreras de pre-grado');
  console.log('   ✅ Enfoque exclusivo en licenciaturas e ingenierías');
  console.log('   ✅ Recomienda buscar en otras instituciones\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', postgraduateFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "la universidad ofrece programas de postgrado o maestrías", "sessionId": "postgraduate-test"}\'\n');

  console.log('✨ INFORMACIÓN DE POSTGRADOS CORREGIDA Y PRECISA');
  console.log('=' .repeat(70));
}

fixPostgraduateHallucination().catch(console.error);
