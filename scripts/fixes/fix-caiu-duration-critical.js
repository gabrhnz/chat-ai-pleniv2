#!/usr/bin/env node

/**
 * CRITICAL FIX - CAIU Duration Hallucination
 * 
 * ERROR GARRAFAL: Bot dice que CAIU dura 4 años
 * REALIDAD: CAIU es un propedéutico de 12 SEMANAS
 * 
 * Materias del CAIU:
 * - Lingüística
 * - Herramientas Tecnológicas
 * - Filosofía
 * - Pensamiento Lógico Matemático
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

console.log('🚨 CORRECCIÓN CRÍTICA - DURACIÓN DEL CAIU\n');
console.log('=' .repeat(70));
console.log('❌ ERROR GARRAFAL: Bot dice que CAIU dura 4 años');
console.log('✅ REALIDAD: CAIU es un propedéutico de 12 SEMANAS');
console.log('=' .repeat(70));

// Buscar y eliminar FAQs incorrectas sobre duración del CAIU
console.log('\n🗑️ Buscando FAQs incorrectas sobre duración del CAIU...');

const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%CAIU%4 años%,answer.ilike.%CAIU%8 semestres%,answer.ilike.%carrera en el CAIU%,answer.ilike.%Centro de Aprendizaje%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs con información INCORRECTA`);
  oldFAQs.forEach(faq => {
    console.log(`   - "${faq.question}"`);
    console.log(`     Respuesta incorrecta: ${faq.answer.substring(0, 100)}...`);
  });
  
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', oldFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  console.log(`✅ ${oldFAQs.length} FAQs incorrectas ELIMINADAS`);
} else {
  console.log('ℹ️ No se encontraron FAQs con información incorrecta');
}

// FAQs CORRECTAS sobre el CAIU
const correctCAIUDurationFAQs = [
  {
    question: "cuanto dura el caiu",
    answer: "El **CAIU** (Curso de Acompañamiento a la Iniciación Universitaria) es un **propedéutico de 12 semanas**. Es el curso de admisión donde estudias: Lingüística, Herramientas Tecnológicas, Filosofía, y Pensamiento Lógico Matemático. ⏰📚",
    category: "admision",
    keywords: ["cuanto dura", "caiu", "duracion", "tiempo"]
  },
  {
    question: "cuantas semanas dura el caiu",
    answer: "El **CAIU** dura **12 semanas**. Es un propedéutico obligatorio para ingresar a la UNC. Durante este tiempo cursas 4 materias fundamentales para tu formación universitaria. 📅✅",
    category: "admision",
    keywords: ["semanas", "caiu", "duracion"]
  },
  {
    question: "que materias veo en el caiu",
    answer: "En el **CAIU** cursas 4 materias: 📖 **Lingüística** (comunicación), 💻 **Herramientas Tecnológicas** (informática), 🤔 **Filosofía** (pensamiento crítico), y 🔢 **Pensamiento Lógico Matemático** (razonamiento). Son 12 semanas de preparación. 📚",
    category: "admision",
    keywords: ["materias", "caiu", "asignaturas", "curso"]
  },
  {
    question: "que es el caiu exactamente",
    answer: "El **CAIU** es el **Curso de Acompañamiento a la Iniciación Universitaria**, un **propedéutico de 12 semanas** obligatorio para ingresar a la UNC. Cursas Lingüística, Herramientas Tecnológicas, Filosofía y Pensamiento Lógico Matemático. Es tu preparación para la vida universitaria. 🎓",
    category: "admision",
    keywords: ["que es", "caiu", "propedeutico"]
  },
  {
    question: "tengo que hacer el caiu",
    answer: "Sí, el **CAIU es obligatorio** para todos los aspirantes. Es un propedéutico de **12 semanas** donde te preparas para la universidad. Debes aprobar todas las materias (Lingüística, Herramientas Tecnológicas, Filosofía, Pensamiento Lógico Matemático) para ingresar. ✅📚",
    category: "admision",
    keywords: ["tengo que", "caiu", "obligatorio"]
  },
  {
    question: "como funciona el caiu",
    answer: "El **CAIU** funciona así: 1️⃣ Dura **12 semanas**, 2️⃣ Cursas 4 materias fundamentales, 3️⃣ Debes aprobar todas, 4️⃣ Al finalizar, si apruebas, ingresas a tu carrera elegida. Es presencial en la UNC. 📝🎓",
    category: "admision",
    keywords: ["como funciona", "caiu", "proceso"]
  },
  {
    question: "que nota necesito para aprobar el caiu",
    answer: "Para aprobar el **CAIU** necesitas **mínimo 14 puntos sobre 20** en cada materia. Debes aprobar las 4 asignaturas: Lingüística, Herramientas Tecnológicas, Filosofía, y Pensamiento Lógico Matemático. Son 12 semanas de curso. 📊✅",
    category: "admision",
    keywords: ["nota", "aprobar", "caiu"]
  },
  {
    question: "cuando empieza el caiu",
    answer: "El **CAIU** inicia generalmente en **enero-febrero** (primer semestre) y **julio-agosto** (segundo semestre). Dura 12 semanas. Las fechas exactas se publican en la web de la UNC. Contacta a admisiones para el calendario actualizado. 📅",
    category: "admision",
    keywords: ["cuando empieza", "caiu", "inicio"]
  },
  {
    question: "es dificil el caiu",
    answer: "El **CAIU** es exigente pero manejable si te dedicas. Son **12 semanas** de preparación universitaria con 4 materias fundamentales. Requiere compromiso, asistencia y estudio constante. Es tu introducción a la vida universitaria. 💪📚",
    category: "admision",
    keywords: ["dificil", "caiu", "exigente"]
  },
  {
    question: "puedo trabajar mientras hago el caiu",
    answer: "El **CAIU** es **presencial** y demanda tiempo (12 semanas con 4 materias). Es recomendable dedicarte completamente para asegurar tu aprobación. Si trabajas, evalúa si puedes manejar ambas responsabilidades. La asistencia es importante. ⏰💼",
    category: "admision",
    keywords: ["trabajar", "caiu", "tiempo"]
  },
  {
    question: "que pasa si repruebo el caiu",
    answer: "Si repruebas el **CAIU**, puedes presentarlo nuevamente en la siguiente convocatoria (cada semestre). Debes aprobar las 4 materias para ingresar a tu carrera. No hay límite de intentos, pero debes cursarlo completo cada vez (12 semanas). 🔄📚",
    category: "admision",
    keywords: ["repruebo", "caiu", "no aprobar"]
  },
  {
    question: "el caiu tiene costo",
    answer: "El **CAIU** es parte del proceso de admisión de la UNC, que es **universidad pública**. Pueden existir aranceles administrativos mínimos. Para información actualizada sobre costos, contacta directamente a admisiones. 💰📋",
    category: "admision",
    keywords: ["costo", "caiu", "precio"]
  }
];

console.log('\n📝 Agregando FAQs CORRECTAS sobre el CAIU...');
const questions = correctCAIUDurationFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);

const faqsToInsert = correctCAIUDurationFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'critical-fix-caiu-duration',
    fixed_at: new Date().toISOString(),
    issue: 'CRITICAL-caiu-4-years-hallucination',
    correct_info: '12-weeks-propaedeutic',
    priority: 'CRITICAL'
  },
  embedding: embeddings[idx],
  created_by: 'fix-caiu-duration-critical',
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

console.log(`✅ ${data.length} FAQs CORRECTAS agregadas`);
console.log('\n✨ CORRECCIÓN CRÍTICA COMPLETADA!');
console.log('📊 Información correcta:');
console.log('   ✅ CAIU = Propedéutico de 12 SEMANAS');
console.log('   ✅ Materias: Lingüística, Herramientas Tecnológicas, Filosofía, Pensamiento Lógico Matemático');
console.log('   ✅ Obligatorio para ingresar a la UNC');
console.log('   ❌ NO es una carrera de 4 años\n');
