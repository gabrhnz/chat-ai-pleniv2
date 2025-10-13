#!/usr/bin/env node

/**
 * Fix Cost Hallucination V2
 * 
 * Corrige alucinaciones sobre costos específicos ($10, precios exactos)
 * Usa información conservadora y precisa
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

console.log('💰 CORRIGIENDO ALUCINACIÓN - COSTOS ESPECÍFICOS\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: Sistema menciona "$10" y precios exactos');
console.log('✅ SOLUCIÓN: Información conservadora sin montos específicos');
console.log('=' .repeat(70));

// Buscar y eliminar FAQs con información incorrecta
console.log('\n🗑️ Buscando FAQs erróneas sobre costos...');

const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%$10%,answer.ilike.%costo mensual%,answer.ilike.%precio específico%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs con información incorrecta`);
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
  console.log('ℹ️ No se encontraron FAQs con información incorrecta');
}

// FAQs correctas sobre costos
const correctCostFAQs = [
  {
    question: "cuanto cuesta la matricula",
    answer: "La UNC es **pública y gratuita** para venezolanos. Pueden existir **aranceles administrativos mínimos**, pero la matrícula no tiene costo. Para información actualizada sobre cualquier arancel, contacta a admisiones. 🎓",
    category: "costos",
    keywords: ["costo", "matricula", "precio", "cuanto cuesta"]
  },
  {
    question: "hay que pagar inscripcion",
    answer: "La UNC es **universidad pública**, por lo que la inscripción es **gratuita**. Pueden existir aranceles administrativos mínimos. Contacta a admisiones para información actualizada sobre cualquier costo. 📋",
    category: "costos",
    keywords: ["pagar", "inscripcion", "costo"]
  },
  {
    question: "cuanto cuesta estudiar en la unc",
    answer: "La UNC es **pública y gratuita** para venezolanos. No hay costo de matrícula. Pueden existir gastos personales (transporte, materiales) y aranceles administrativos mínimos. Contacta a admisiones para detalles actualizados. 💰",
    category: "costos",
    keywords: ["costo", "estudiar", "precio"]
  },
  {
    question: "cual es el arancel",
    answer: "Los aranceles administrativos en la UNC son **mínimos** ya que es universidad pública. Para información actualizada sobre montos específicos, contacta directamente a la oficina de administración o admisiones. 📊",
    category: "costos",
    keywords: ["arancel", "costo", "administrativo"]
  },
  {
    question: "cuanto sale el semestre",
    answer: "La UNC es **pública y gratuita**. No hay costo de matrícula por semestre. Pueden existir aranceles administrativos mínimos. Para información actualizada, contacta a admisiones. 🎓",
    category: "costos",
    keywords: ["semestre", "costo", "precio"]
  },
  {
    question: "hay mensualidad",
    answer: "**No hay mensualidad**. La UNC es universidad pública y gratuita para venezolanos. Pueden existir aranceles administrativos mínimos. Contacta a admisiones para información actualizada. 📅",
    category: "costos",
    keywords: ["mensualidad", "pago mensual", "costo"]
  },
  {
    question: "cuanto pago por estudiar",
    answer: "La UNC es **pública y gratuita** para venezolanos. No pagas matrícula. Pueden existir aranceles administrativos mínimos y gastos personales (transporte, materiales). Contacta a admisiones para detalles. 💳",
    category: "costos",
    keywords: ["pagar", "estudiar", "costo"]
  },
  {
    question: "la universidad cobra",
    answer: "La UNC es **universidad pública**, por lo que **no cobra matrícula**. Pueden existir aranceles administrativos mínimos. Para información actualizada sobre cualquier costo, contacta a admisiones. 🏛️",
    category: "costos",
    keywords: ["cobra", "costo", "precio"]
  },
  {
    question: "hay que pagar algo",
    answer: "La UNC es **gratuita** (universidad pública). Pueden existir **aranceles administrativos mínimos**. No hay costo de matrícula. Para información actualizada, contacta a admisiones. ✅",
    category: "costos",
    keywords: ["pagar", "costo", "algo"]
  },
  {
    question: "cuales son los costos administrativos",
    answer: "Los costos administrativos en la UNC son **mínimos** por ser universidad pública. Para información actualizada sobre montos específicos, contacta directamente a la oficina de administración o admisiones. 📋",
    category: "costos",
    keywords: ["costos administrativos", "aranceles"]
  }
];

console.log('\n📝 Agregando FAQs correctas sobre costos...');
const questions = correctCostFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);

const faqsToInsert = correctCostFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'hallucination-fix-costs-v2',
    fixed_at: new Date().toISOString(),
    issue: 'removed-specific-prices'
  },
  embedding: embeddings[idx],
  created_by: 'fix-cost-hallucination-v2',
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
console.log('📊 Información ahora es conservadora y sin precios específicos\n');
