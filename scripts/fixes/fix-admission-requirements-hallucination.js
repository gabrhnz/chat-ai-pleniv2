#!/usr/bin/env node

/**
 * Fix Admission Requirements Hallucination
 *
 * CORRIGE los requisitos erróneos de inscripción
 * Actualiza con los documentos CORRECTOS requeridos
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

// FAQ correcta sobre fechas y requisitos de inscripción
const admissionFAQ = {
  question: "cuándo son las próximas fechas de inscripción",
  answer: "Las inscripciones en la UNC abren en enero y julio de cada año. Las fechas específicas se anunciarán próximamente. Para inscribirte necesitas: 1) **Título de bachiller original**, 2) **Notas certificadas originales**, 3) **Cédula de identidad original**, y 4) **Certificado de participación OPSU**. Mantente atento a los anuncios oficiales para más detalles sobre el proceso. 📅📋",
  category: "admisiones",
  keywords: ["inscripciones", "fechas", "requisitos", "documentos", "inscribirte"]
};

async function fixAdmissionRequirementsHallucination() {
  console.log('📅 CORRIGIENDO ALUCINACIÓN - REQUISITOS DE INSCRIPCIÓN\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema menciona "certificado médico"');
  console.log('   Información de requisitos INCORRECTA\n');

  console.log('✅ SOLUCIÓN: Requisitos precisos y actualizados\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre requisitos de inscripción...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .ilike('question', '%inscripciones%')
    .or('ilike(question, "%inscribirte%")')
    .or('ilike(question, "%requisitos%")');

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
    console.log('ℹ️ No se encontraron FAQs existentes sobre inscripciones\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre requisitos de inscripción...');

  const embeddings = await generateEmbeddingsBatch([admissionFAQ.question]);

  const faqToInsert = {
    question: admissionFAQ.question,
    answer: admissionFAQ.answer,
    category: admissionFAQ.category,
    keywords: admissionFAQ.keywords,
    metadata: {
      source: 'admission-requirements-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'admission-documents'
    },
    embedding: embeddings[0],
    created_by: 'admission-requirements-fix',
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
  console.log('   ✅ Título de bachiller original');
  console.log('   ✅ Notas certificadas originales');
  console.log('   ✅ Cédula de identidad original');
  console.log('   ✅ Certificado de participación OPSU');
  console.log('   ❌ NO certificado médico\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', admissionFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "cuándo son las próximas fechas de inscripción", "sessionId": "admission-test"}\'\n');

  console.log('✨ REQUISITOS DE INSCRIPCIÓN CORREGIDOS Y PRECISOS');
  console.log('=' .repeat(70));
}

fixAdmissionRequirementsHallucination().catch(console.error);
