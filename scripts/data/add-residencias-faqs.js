#!/usr/bin/env node

/**
 * Add Residencias FAQs
 * 
 * Agrega FAQs sobre residencias estudiantiles de la UNC
 * - Existen pero son extremadamente limitadas
 * - Solo para estudiantes del interior del país
 * - Requieren promedios competitivos
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

console.log('🏠 AGREGANDO FAQs SOBRE RESIDENCIAS ESTUDIANTILES\n');
console.log('=' .repeat(70));

const residenciasFAQs = [
  {
    question: "hay residencias",
    answer: "Sí, la UNC tiene **residencias estudiantiles** pero son **extremadamente limitadas**. Solo están disponibles para estudiantes del **interior del país** con **promedios competitivos**. La disponibilidad es muy reducida y la selección es rigurosa. 🏠📚",
    category: "servicios-estudiantiles",
    keywords: ["residencias", "alojamiento", "hay"]
  },
  {
    question: "tiene residencias la unc",
    answer: "Sí, la UNC ofrece **residencias estudiantiles limitadas**. Están destinadas únicamente a estudiantes del **interior del país** que demuestren **excelencia académica** (promedios competitivos). Los cupos son muy escasos. 🏠✨",
    category: "servicios-estudiantiles",
    keywords: ["residencias", "tiene", "unc"]
  },
  {
    question: "puedo quedarme en la universidad",
    answer: "La UNC tiene **residencias estudiantiles** pero son **extremadamente limitadas**. Solo para estudiantes del **interior del país** con **promedios competitivos**. Si eres de Caracas o Miranda, no calificas. Contacta a asuntos estudiantiles para más información. 🏠",
    category: "servicios-estudiantiles",
    keywords: ["quedarme", "residencias", "alojamiento"]
  },
  {
    question: "donde puedo vivir si estudio en la unc",
    answer: "La UNC ofrece **residencias limitadas** solo para estudiantes del **interior del país** con **promedios competitivos**. Si no calificas, deberás buscar alojamiento privado en Guatire o zonas cercanas. Los cupos de residencia son muy escasos. 🏠🗺️",
    category: "servicios-estudiantiles",
    keywords: ["vivir", "alojamiento", "residencias"]
  },
  {
    question: "como consigo residencia en la unc",
    answer: "Las **residencias de la UNC** son **extremadamente limitadas**. Requisitos: 1️⃣ Ser del **interior del país** (no Caracas/Miranda), 2️⃣ Tener **promedio competitivo** (excelencia académica), 3️⃣ Aplicar en asuntos estudiantiles. Los cupos son muy escasos. 🏠📋",
    category: "servicios-estudiantiles",
    keywords: ["conseguir", "residencia", "como"]
  },
  {
    question: "requisitos para residencia unc",
    answer: "**Requisitos para residencia UNC**: ✅ Ser estudiante del **interior del país** (no Caracas/Miranda), ✅ **Promedio académico competitivo** (excelencia), ✅ Disponibilidad limitada. Contacta a asuntos estudiantiles para aplicar. Los cupos son muy escasos. 🏠📚",
    category: "servicios-estudiantiles",
    keywords: ["requisitos", "residencia"]
  },
  {
    question: "cuantas residencias tiene la unc",
    answer: "La UNC tiene **residencias extremadamente limitadas**. No hay un número específico público, pero los cupos son muy escasos. Solo para estudiantes del **interior del país** con **promedios competitivos**. La demanda supera ampliamente la oferta. 🏠",
    category: "servicios-estudiantiles",
    keywords: ["cuantas", "residencias"]
  },
  {
    question: "soy de caracas puedo tener residencia",
    answer: "No, las **residencias de la UNC** están reservadas únicamente para estudiantes del **interior del país**. Si eres de Caracas o Miranda, no calificas para residencia. Deberás buscar alojamiento privado en Guatire o zonas cercanas. 🏠❌",
    category: "servicios-estudiantiles",
    keywords: ["caracas", "residencia", "puedo"]
  },
  {
    question: "que necesito para aplicar a residencia",
    answer: "Para aplicar a **residencia UNC** necesitas: 1️⃣ Ser del **interior del país**, 2️⃣ **Promedio académico competitivo**, 3️⃣ Documentos que demuestren tu procedencia, 4️⃣ Aplicar en asuntos estudiantiles. Recuerda: los cupos son **extremadamente limitados**. 🏠📋",
    category: "servicios-estudiantiles",
    keywords: ["necesito", "aplicar", "residencia"]
  },
  {
    question: "alojamiento en la unc",
    answer: "La UNC ofrece **alojamiento limitado** en residencias estudiantiles. Solo para estudiantes del **interior del país** con **promedios competitivos**. Los cupos son muy escasos. Si no calificas, busca opciones privadas en Guatire. 🏠",
    category: "servicios-estudiantiles",
    keywords: ["alojamiento", "unc"]
  },
  {
    question: "hay dormitorios en la unc",
    answer: "Sí, hay **dormitorios/residencias** pero son **extremadamente limitados**. Solo para estudiantes del **interior del país** con **excelencia académica** (promedios competitivos). La disponibilidad es muy reducida. Contacta a asuntos estudiantiles. 🏠📚",
    category: "servicios-estudiantiles",
    keywords: ["dormitorios", "hay"]
  },
  {
    question: "la unc tiene alojamiento para estudiantes",
    answer: "Sí, la UNC tiene **alojamiento para estudiantes** pero es **extremadamente limitado**. Requisitos: ser del **interior del país** y tener **promedios competitivos**. Los cupos son muy escasos y la selección es rigurosa. 🏠✨",
    category: "servicios-estudiantiles",
    keywords: ["alojamiento", "estudiantes", "tiene"]
  }
];

console.log(`\n📝 Agregando ${residenciasFAQs.length} FAQs sobre residencias...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = residenciasFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = residenciasFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'residencias-estudiantiles',
    added_at: new Date().toISOString(),
    type: 'student-services',
    availability: 'extremely-limited'
  },
  embedding: embeddings[idx],
  created_by: 'add-residencias-faqs',
  is_active: true,
}));

// Insertar en Supabase
const { data, error } = await supabase
  .from('faqs')
  .insert(faqsToInsert)
  .select();

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log(`✅ ${data.length} FAQs sobre residencias agregadas!\n`);
console.log('🏠 Información agregada:');
console.log('   ✅ Residencias: SÍ existen');
console.log('   ⚠️  Disponibilidad: EXTREMADAMENTE LIMITADA');
console.log('   📍 Requisito 1: Ser del interior del país');
console.log('   📊 Requisito 2: Promedios competitivos');
console.log('   ❌ No aplica: Estudiantes de Caracas/Miranda\n');
console.log('✨ El bot ahora responderá correctamente sobre residencias!\n');
