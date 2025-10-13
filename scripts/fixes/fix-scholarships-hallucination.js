#!/usr/bin/env node

/**
 * Fix Scholarships Hallucination
 *
 * CORRIGE la información inexacta sobre becas parciales
 * Información más precisa y conservadora sobre ayudas estudiantiles
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

// FAQ correcta sobre becas
const scholarshipsFAQ = {
  question: "hay becas",
  answer: "La UNC ofrece ayudas estudiantiles limitadas basadas en rendimiento académico y necesidad socioeconómica. No ofrecemos becas que cubran el 100% de los costos. Las ayudas disponibles son parciales y están sujetas a disponibilidad presupuestaria y cumplimiento de requisitos específicos. Para más información sobre criterios y proceso de solicitud, contacta a la oficina de asuntos estudiantiles. 💰📚",
  category: "finanzas",
  keywords: ["becas", "ayudas", "financiamiento", "estudiantiles"]
};

async function fixScholarshipsHallucination() {
  console.log('💰 CORRIGIENDO ALUCINACIÓN - INFORMACIÓN SOBRE BECAS\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Sistema da porcentajes específicos (20-50%) que pueden no ser precisos');
  console.log('   Información sobre becas parciales inexacta\n');

  console.log('✅ SOLUCIÓN: Información conservadora y precisa\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre becas...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .ilike('question', '%becas%')
    .or('ilike(question, "%ayudas%")')
    .or('ilike(question, "%financiamiento%")');

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
    console.log('ℹ️ No se encontraron FAQs existentes sobre becas\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQ correcta sobre becas...');

  const embeddings = await generateEmbeddingsBatch([scholarshipsFAQ.question]);

  const faqToInsert = {
    question: scholarshipsFAQ.question,
    answer: scholarshipsFAQ.answer,
    category: scholarshipsFAQ.category,
    keywords: scholarshipsFAQ.keywords,
    metadata: {
      source: 'scholarships-hallucination-fix',
      added_at: new Date().toISOString(),
      type: 'hallucination-correction',
      priority: 'critical',
      fix_for: 'scholarships-information'
    },
    embedding: embeddings[0],
    created_by: 'scholarships-fix',
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
  console.log('   ✅ Ayudas estudiantiles limitadas');
  console.log('   ✅ Basadas en rendimiento académico y necesidad socioeconómica');
  console.log('   ❌ NO becas que cubran 100%');
  console.log('   ✅ Sujetas a disponibilidad presupuestaria');
  console.log('   ✅ Requisitos específicos aplican\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', scholarshipsFAQ.question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "hay becas", "sessionId": "scholarships-test"}\'\n');

  console.log('✨ INFORMACIÓN DE BECAS CORREGIDA Y PRECISA');
  console.log('=' .repeat(70));
}

fixScholarshipsHallucination().catch(console.error);
