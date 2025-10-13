#!/usr/bin/env node

/**
 * Fix Scholarship Percentages Hallucination
 * 
 * Corrige alucinaciones sobre porcentajes específicos de becas (20%, 50%, 100%)
 * Usa información conservadora sin porcentajes exactos
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

console.log('🎓 CORRIGIENDO ALUCINACIÓN - PORCENTAJES DE BECAS\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: Sistema menciona "20-50%", "100%" y porcentajes exactos');
console.log('✅ SOLUCIÓN: Información conservadora sin porcentajes específicos');
console.log('=' .repeat(70));

// Buscar y eliminar FAQs con porcentajes específicos
console.log('\n🗑️ Buscando FAQs erróneas sobre becas...');

const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%20%%,answer.ilike.%50%%,answer.ilike.%100%%,answer.ilike.%20-50%%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs con porcentajes específicos`);
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
  console.log('ℹ️ No se encontraron FAQs con porcentajes específicos');
}

// FAQs correctas sobre becas (sin porcentajes)
const correctScholarshipFAQs = [
  {
    question: "hay becas",
    answer: "La UNC ofrece **ayudas estudiantiles limitadas** basadas en **rendimiento académico** y **necesidad socioeconómica**. Las ayudas son parciales y están sujetas a disponibilidad presupuestaria. Contacta a asuntos estudiantiles para más información. 🎓💰",
    category: "becas",
    keywords: ["becas", "ayuda economica", "ayuda estudiantil"]
  },
  {
    question: "dan ayuda economica",
    answer: "Sí, la UNC ofrece **ayudas estudiantiles limitadas** basadas en rendimiento académico y necesidad socioeconómica. Son ayudas parciales sujetas a disponibilidad. Contacta a la oficina de asuntos estudiantiles para criterios y proceso. 💰",
    category: "becas",
    keywords: ["ayuda economica", "becas", "apoyo"]
  },
  {
    question: "cuanto es la beca",
    answer: "Las ayudas estudiantiles en la UNC son **parciales** y varían según disponibilidad presupuestaria, rendimiento académico y necesidad socioeconómica. No hay montos fijos. Contacta a asuntos estudiantiles para información actualizada. 📊",
    category: "becas",
    keywords: ["cuanto", "beca", "monto"]
  },
  {
    question: "que porcentaje de beca dan",
    answer: "Las ayudas estudiantiles son **parciales** y varían según cada caso (rendimiento, necesidad, disponibilidad). No hay porcentajes fijos. Contacta a asuntos estudiantiles para información sobre tu caso específico. 📋",
    category: "becas",
    keywords: ["porcentaje", "beca", "cuanto"]
  },
  {
    question: "cubren toda la matricula",
    answer: "Las ayudas estudiantiles en la UNC son **parciales**. La cobertura varía según disponibilidad presupuestaria y cada caso. Para información sobre tu situación específica, contacta a asuntos estudiantiles. 💼",
    category: "becas",
    keywords: ["cubren", "matricula", "toda"]
  },
  {
    question: "hay becas completas",
    answer: "Las ayudas estudiantiles en la UNC son **parciales** y limitadas. No se garantizan ayudas completas. La disponibilidad depende del presupuesto y cada caso. Contacta a asuntos estudiantiles para más información. 📚",
    category: "becas",
    keywords: ["becas completas", "100%", "total"]
  },
  {
    question: "cuanto ayudan con las becas",
    answer: "Las ayudas estudiantiles son **parciales** y varían según rendimiento académico, necesidad socioeconómica y disponibilidad presupuestaria. No hay montos fijos. Contacta a asuntos estudiantiles para tu caso específico. 💰",
    category: "becas",
    keywords: ["cuanto ayudan", "becas", "monto"]
  },
  {
    question: "que tipo de becas tienen",
    answer: "La UNC ofrece **ayudas estudiantiles limitadas** basadas en **rendimiento académico** y **necesidad socioeconómica**. Son ayudas parciales sujetas a disponibilidad presupuestaria. Contacta a asuntos estudiantiles para criterios y proceso. 🎓",
    category: "becas",
    keywords: ["tipo", "becas", "cuales"]
  },
  {
    question: "puedo obtener beca completa",
    answer: "Las ayudas estudiantiles en la UNC son **parciales** y limitadas. La disponibilidad y cobertura varían según cada caso. Para información sobre tu situación específica, contacta a la oficina de asuntos estudiantiles. 📋",
    category: "becas",
    keywords: ["beca completa", "obtener", "total"]
  },
  {
    question: "como funcionan las becas",
    answer: "Las ayudas estudiantiles se otorgan según **rendimiento académico** y **necesidad socioeconómica**. Son parciales y limitadas, sujetas a disponibilidad presupuestaria. Debes solicitarlas en asuntos estudiantiles con documentación de tu situación. 📝",
    category: "becas",
    keywords: ["como funcionan", "becas", "proceso"]
  }
];

console.log('\n📝 Agregando FAQs correctas sobre becas...');
const questions = correctScholarshipFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);

const faqsToInsert = correctScholarshipFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'hallucination-fix-scholarships',
    fixed_at: new Date().toISOString(),
    issue: 'removed-specific-percentages'
  },
  embedding: embeddings[idx],
  created_by: 'fix-scholarship-percentages',
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
console.log('📊 Información ahora es conservadora y sin porcentajes específicos\n');
