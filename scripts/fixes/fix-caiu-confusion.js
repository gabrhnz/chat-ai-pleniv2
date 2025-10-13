#!/usr/bin/env node

/**
 * Fix CAIU Confusion
 * 
 * Corrige la confusión entre:
 * - CAIU = Curso de Acompañamiento a la Iniciación Universitaria (examen)
 * - CAIU = Centro de Atención Integral Universitaria (servicios)
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

console.log('🔧 CORRIGIENDO CONFUSIÓN DE CAIU\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: Bot confunde CAIU (examen) con CAIU (centro)');
console.log('✅ SOLUCIÓN: FAQs específicas para cada significado');
console.log('=' .repeat(70));

// Buscar FAQs incorrectas sobre CAIU
console.log('\n🗑️ Buscando FAQs confusas sobre CAIU...');

const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%Centro de Atención Integral%,answer.ilike.%servicios de orientación académica%')
  .ilike('question', '%caiu%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs confusas sobre CAIU`);
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
  console.log(`✅ ${oldFAQs.length} FAQs confusas eliminadas`);
} else {
  console.log('ℹ️ No se encontraron FAQs confusas');
}

// FAQs correctas diferenciando ambos significados
const correctCAIUFAQs = [
  // CAIU como EXAMEN/CURSO
  {
    question: "dame info del caiu",
    answer: "El **CAIU** (Curso de Acompañamiento a la Iniciación Universitaria) es el **examen de admisión** de la UNC. Evalúa **matemáticas, lógica y comprensión**. Necesitas mínimo **14 puntos sobre 20** para aprobar. Se realiza 2 veces al año. 📝✅",
    category: "admision",
    keywords: ["caiu", "info", "examen", "admision"]
  },
  {
    question: "que es el caiu",
    answer: "El **CAIU** es el **Curso de Acompañamiento a la Iniciación Universitaria**, el examen de admisión de la UNC. Es una **prueba de aptitud académica** que evalúa matemáticas, lógica y comprensión lectora. Debes aprobar con mínimo **14/20**. 📚",
    category: "admision",
    keywords: ["que es", "caiu", "examen"]
  },
  {
    question: "como es el examen caiu",
    answer: "El **CAIU** evalúa: **Matemáticas** (álgebra, geometría), **Lógica** (razonamiento), y **Comprensión lectora**. Es presencial, nota mínima **14/20**. Dura aproximadamente 3 horas. Se realiza en las instalaciones de la UNC. 📝🎓",
    category: "admision",
    keywords: ["como es", "examen", "caiu"]
  },
  {
    question: "cuando es el caiu",
    answer: "El **CAIU** se realiza **2 veces al año**: generalmente en **enero-febrero** (primer semestre) y **julio-agosto** (segundo semestre). Las fechas exactas se publican en la web de la UNC. Contacta a admisiones para fechas actualizadas. 📅",
    category: "admision",
    keywords: ["cuando", "caiu", "fecha"]
  },
  {
    question: "como me preparo para el caiu",
    answer: "Para el **CAIU**: ✅ Repasa **matemáticas de bachillerato** (álgebra, geometría), ✅ Practica **razonamiento lógico**, ✅ Mejora **comprensión lectora**, ✅ Resuelve ejercicios de práctica, ✅ Gestiona bien el tiempo. La UNC puede ofrecer material de apoyo. 📚💪",
    category: "admision",
    keywords: ["preparar", "caiu", "estudiar"]
  },
  {
    question: "que nota necesito en el caiu",
    answer: "Necesitas **mínimo 14 puntos sobre 20** para aprobar el CAIU. Esta es la nota de corte para ser admitido en la UNC. La calificación es sobre 20 puntos. Prepárate bien en matemáticas, lógica y comprensión. 📊✅",
    category: "admision",
    keywords: ["nota", "caiu", "aprobar"]
  },
  {
    question: "cuantas veces puedo presentar el caiu",
    answer: "Puedes presentar el **CAIU** las veces que necesites. Se realiza 2 veces al año (cada semestre). Si no apruebas, puedes intentarlo en la siguiente convocatoria. No hay límite de intentos. 🔄📝",
    category: "admision",
    keywords: ["cuantas veces", "caiu", "presentar"]
  },
  {
    question: "donde se hace el caiu",
    answer: "El **CAIU** se realiza en las **instalaciones de la UNC** en Guatire, Miranda. Es presencial. La dirección exacta y aula se informan al momento de la inscripción. Contacta a admisiones para detalles. 📍🏛️",
    category: "admision",
    keywords: ["donde", "caiu", "lugar"]
  },
  {
    question: "cuanto dura el caiu",
    answer: "El **CAIU** dura aproximadamente **3 horas**. Es un examen presencial que evalúa matemáticas, lógica y comprensión lectora. Debes llegar con anticipación y llevar identificación. ⏰📝",
    category: "admision",
    keywords: ["cuanto dura", "caiu", "tiempo"]
  },
  {
    question: "que temas evalua el caiu",
    answer: "El **CAIU** evalúa: 📐 **Matemáticas** (álgebra, geometría, trigonometría básica), 🧠 **Razonamiento lógico** (secuencias, patrones), 📖 **Comprensión lectora** (análisis de textos). Son conocimientos de bachillerato. 📚",
    category: "admision",
    keywords: ["temas", "evalua", "caiu"]
  },

  // Aclaración sobre el Centro (para evitar confusión)
  {
    question: "que servicios ofrece el centro de atencion integral",
    answer: "El **Centro de Atención Integral Universitaria** (también llamado CAIU) ofrece: 🎓 **Orientación académica**, 💭 **Apoyo psicológico**, 🤝 **Asesoría social**, 📚 **Talleres de desarrollo personal**, y 🎯 **Apoyo en elección de carrera**. Es diferente al examen CAIU. 🏛️",
    category: "servicios-estudiantiles",
    keywords: ["centro atencion", "servicios", "orientacion"]
  },
  {
    question: "hay orientacion psicologica en la unc",
    answer: "Sí, la UNC tiene el **Centro de Atención Integral Universitaria** que ofrece **orientación psicológica** y apoyo emocional a estudiantes. También brinda asesoría académica y social. Contacta a bienestar estudiantil para más información. 💭🤝",
    category: "servicios-estudiantiles",
    keywords: ["orientacion psicologica", "apoyo", "bienestar"]
  }
];

console.log('\n📝 Agregando FAQs correctas sobre CAIU...');
const questions = correctCAIUFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);

const faqsToInsert = correctCAIUFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'hallucination-fix-caiu-confusion',
    fixed_at: new Date().toISOString(),
    issue: 'caiu-ambiguity',
    clarification: 'CAIU can mean exam OR center'
  },
  embedding: embeddings[idx],
  created_by: 'fix-caiu-confusion',
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
console.log('📊 Ahora el bot diferencia correctamente:');
console.log('   - CAIU = Examen de admisión (Curso)');
console.log('   - CAIU = Centro de servicios (Centro de Atención)\n');
