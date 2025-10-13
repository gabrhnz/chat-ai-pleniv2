#!/usr/bin/env node

/**
 * Fix Student Residences Hallucination
 *
 * CORRIGE la información falsa sobre residencias estudiantiles
 * Agrega FAQ precisa con información real sobre residencias UNC
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

// FAQ correcta sobre residencias estudiantiles
const residenceFAQ = {
  question: "hay residencias estudiantiles disponibles",
  answer: "Sí, la UNC ofrece residencias estudiantiles con las siguientes condiciones: 1) **Por promedio académico**: Estudiantes con promedio entre 18-20 puntos, 2) **Por CAIU**: Puntaje mayor a 16 puntos en el Centro de Atención e Información Universitaria. Las residencias son limitadas y NO están garantizadas. Son válidas para estudiantes de cualquier estado de Venezuela EXCEPTO Distrito Capital, La Guaira y Miranda. Para más información, contacta al departamento de asuntos estudiantiles. 🏠📚",
  category: "instalaciones",
  keywords: ["residencias estudiantiles", "alojamiento", "residencia", "vivienda", "dormitorio"]
};

async function fixResidenceHallucination() {
  console.log('🏠 CORRIGIENDO ALUCINACIÓN - RESIDENCIAS ESTUDIANTILES\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema dice que NO hay residencias estudiantiles');
  console.log('   Información COMPLETAMENTE FALSA\n');

  console.log('✅ SOLUCIÓN: Información precisa y detallada\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre residencias...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .ilike('question', '%residencia%')
    .or('ilike(question, "%alojamiento%")');

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
    console.log('ℹ️ No se encontraron FAQs existentes sobre residencias\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre residencias...');

  const embeddings = await generateEmbeddingsBatch([residenceFAQ.question]);

  const faqToInsert = {
    question: residenceFAQ.question,
    answer: residenceFAQ.answer,
    category: residenceFAQ.category,
    keywords: residenceFAQ.keywords,
    metadata: {
      source: 'residence-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'residence-information'
    },
    embedding: embeddings[0],
    created_by: 'residence-fix',
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
  console.log('   ✅ SÍ hay residencias estudiantiles');
  console.log('   ✅ Promedio 18-20 O CAIU >16 puntos');
  console.log('   ✅ NO garantizadas (limitadas)');
  console.log('   ✅ Válido para todos los estados EXCEPTO DC, La Guaira, Miranda\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', residenceFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "hay residencias estudiantiles disponibles", "sessionId": "residence-test"}\'\n');

  console.log('✨ INFORMACIÓN DE RESIDENCIAS CORREGIDA Y PRECISA');
  console.log('=' .repeat(70));
}

fixResidenceHallucination().catch(console.error);
