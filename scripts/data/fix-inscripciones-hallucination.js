#!/usr/bin/env node

/**
 * Fix Inscripciones Hallucination - Corrección Crítica
 * 
 * Corrige información sobre inscripciones y requisitos:
 * - Requisitos: quitar "fotos", agregar "Certificado de participación OPSU"
 * - Inscripciones: 2 veces al año pero SIN fechas específicas
 * - Proceso 1: Admisión interna de la universidad
 * - Proceso 2: Sistema Nacional de Ingreso (SNI/OPSU)
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

console.log('📝 CORRIGIENDO INFORMACIÓN DE INSCRIPCIONES\n');
console.log('=' .repeat(70));
console.log('✅ Requisitos correctos: título, notas, cédula, certificado OPSU');
console.log('✅ Inscripciones: 2 veces al año (sin fechas específicas)');
console.log('✅ Proceso 1: Admisión interna UNC');
console.log('✅ Proceso 2: SNI/OPSU (Sistema Nacional de Ingreso)');
console.log('=' .repeat(70));

const inscripcionesFAQs = [
  // REQUISITOS DE INSCRIPCIÓN
  {
    question: "que documentos necesito para inscribirme",
    answer: "Para inscribirte en la UNC necesitas: 1) **Título de bachiller** (original), 2) **Notas certificadas** (originales), 3) **Cédula de identidad** (original), y 4) **Certificado de participación OPSU**. Estos son los documentos básicos requeridos. 📄✅",
    category: "admisiones",
    keywords: ["documentos", "requisitos", "inscripción", "necesito", "papeles"]
  },
  {
    question: "cuales son los requisitos para inscribirme",
    answer: "Los requisitos para inscribirte son: ✅ **Título de bachiller** original, ✅ **Notas certificadas** originales, ✅ **Cédula de identidad** original, ✅ **Certificado de participación OPSU**. Además, debes cumplir con el promedio mínimo según la carrera. 📋🎓",
    category: "admisiones",
    keywords: ["requisitos", "inscribirme", "necesito", "documentos"]
  },
  {
    question: "que papeles piden para la inscripcion",
    answer: "Los papeles requeridos son: **Título de bachiller**, **Notas certificadas**, **Cédula de identidad**, y **Certificado de participación OPSU**. Todos deben ser documentos originales. 📄✨",
    category: "admisiones",
    keywords: ["papeles", "piden", "inscripción", "documentos"]
  },
  
  // PROCESO DE INSCRIPCIÓN
  {
    question: "como me inscribo",
    answer: "Hay **2 formas de inscribirte** en la UNC: 1️⃣ **Proceso de admisión interno** de la universidad (consulta en https://unc.edu.ve/), 2️⃣ **Sistema Nacional de Ingreso (SNI/OPSU)**. Ambos procesos abren 2 veces al año. Verifica en el sitio web las fechas actualizadas. 📝🎓",
    category: "admisiones",
    keywords: ["como inscribirme", "inscripción", "proceso", "admisión"]
  },
  {
    question: "cuando abren las inscripciones",
    answer: "Las inscripciones abren **2 veces al año**. Hay dos procesos: 1️⃣ **Admisión interna de la UNC**, 2️⃣ **Sistema Nacional de Ingreso (SNI/OPSU)**. Para fechas exactas y actualizadas, consulta **https://unc.edu.ve/** o sus redes sociales @unicienciasvzla. 📅✨",
    category: "admisiones",
    keywords: ["cuando", "inscripciones", "abren", "fechas"]
  },
  {
    question: "cuando son las inscripciones",
    answer: "Las inscripciones se realizan **2 veces al año** mediante: **Proceso interno UNC** o **SNI/OPSU** (Sistema Nacional de Ingreso). Las fechas específicas varían cada año. Consulta **https://unc.edu.ve/** para información actualizada. 📆🎓",
    category: "admisiones",
    keywords: ["cuando son", "inscripciones", "fechas"]
  },
  {
    question: "cuantas veces al año hay inscripciones",
    answer: "Hay inscripciones **2 veces al año**. Puedes ingresar por: 1️⃣ **Admisión interna** de la UNC, o 2️⃣ **SNI/OPSU** (Sistema Nacional de Ingreso). Verifica fechas en https://unc.edu.ve/ 📅✅",
    category: "admisiones",
    keywords: ["cuantas veces", "inscripciones", "año"]
  },
  
  // SNI/OPSU
  {
    question: "que es el sni",
    answer: "El **SNI (Sistema Nacional de Ingreso)** es el sistema centralizado de admisión universitaria en Venezuela, también conocido como **OPSU**. Es una de las 2 formas de ingresar a la UNC, junto con el proceso de admisión interno de la universidad. 🎓📝",
    category: "admisiones",
    keywords: ["sni", "sistema nacional ingreso", "que es"]
  },
  {
    question: "que es opsu",
    answer: "**OPSU (Oficina de Planificación del Sector Universitario)** es el sistema nacional de ingreso a universidades en Venezuela, también llamado **SNI**. Es una de las vías para ingresar a la UNC. La otra vía es el proceso de admisión interno de la universidad. 📚🎓",
    category: "admisiones",
    keywords: ["opsu", "que es", "sistema"]
  },
  {
    question: "puedo entrar por opsu",
    answer: "Sí, puedes ingresar a la UNC a través de **OPSU/SNI** (Sistema Nacional de Ingreso). Esta es una de las 2 vías de admisión. La otra es el proceso interno de la universidad. Necesitas tu **Certificado de participación OPSU** como requisito. ✅📝",
    category: "admisiones",
    keywords: ["entrar", "opsu", "puedo", "ingresar"]
  },
  {
    question: "como funciona el proceso de admision",
    answer: "Hay **2 procesos de admisión**: 1️⃣ **Admisión interna UNC** → Inscripción directa en https://unc.edu.ve/, presentas documentos y haces prueba de aptitud. 2️⃣ **SNI/OPSU** → Sistema Nacional de Ingreso, proceso centralizado nacional. Ambos abren 2 veces al año. 🎓📝",
    category: "admisiones",
    keywords: ["como funciona", "proceso admision", "ingreso"]
  },
  {
    question: "cual es la diferencia entre admision interna y opsu",
    answer: "**Admisión interna**: Proceso directo de la UNC, te inscribes en su sitio web y sigues sus requisitos. **OPSU/SNI**: Sistema nacional centralizado que asigna cupos en todas las universidades públicas. Ambos son válidos para ingresar a la UNC. 🎯📚",
    category: "admisiones",
    keywords: ["diferencia", "admision interna", "opsu", "sni"]
  },
  
  // CERTIFICADO OPSU
  {
    question: "necesito certificado opsu",
    answer: "Sí, el **Certificado de participación OPSU** es uno de los requisitos para inscribirte en la UNC, junto con: título de bachiller, notas certificadas y cédula de identidad. 📄✅",
    category: "admisiones",
    keywords: ["certificado opsu", "necesito", "requisito"]
  },
  {
    question: "donde saco el certificado opsu",
    answer: "El **Certificado de participación OPSU** lo obtienes al registrarte en el Sistema Nacional de Ingreso (SNI/OPSU). Para más información sobre cómo obtenerlo, consulta el portal oficial de OPSU o pregunta en tu liceo. 📄🎓",
    category: "admisiones",
    keywords: ["donde saco", "certificado opsu", "obtener"]
  },
  
  // FECHAS (SIN ESPECIFICAR)
  {
    question: "cuando empiezan las clases",
    answer: "Las clases comienzan después de completar el proceso de inscripción. Las fechas específicas varían cada período académico. Consulta **https://unc.edu.ve/** o las redes sociales @unicienciasvzla para el calendario académico actualizado. 📅🎓",
    category: "admisiones",
    keywords: ["cuando empiezan", "clases", "inicio"]
  },
  {
    question: "hasta cuando puedo inscribirme",
    answer: "Las fechas límite de inscripción varían según el período. Para conocer las fechas exactas del proceso actual, consulta **https://unc.edu.ve/** o contacta a la oficina de admisiones. Las inscripciones abren 2 veces al año. ⏰📝",
    category: "admisiones",
    keywords: ["hasta cuando", "inscribirme", "fecha limite"]
  }
];

console.log(`\n📝 Agregando ${inscripcionesFAQs.length} FAQs corregidas sobre inscripciones...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = inscripcionesFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = inscripcionesFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'inscripciones-hallucination-fix',
    added_at: new Date().toISOString(),
    type: 'hallucination-correction',
    priority: 'critical',
    fix_for: 'inscripciones-requirements',
    correct_requirements: ['título bachiller', 'notas certificadas', 'cédula', 'certificado OPSU'],
    no_photos_required: true,
    two_admission_processes: ['admisión interna UNC', 'SNI/OPSU']
  },
  embedding: embeddings[idx],
  created_by: 'fix-inscripciones-hallucination',
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

console.log(`✅ ${data.length} FAQs sobre inscripciones corregidas!\n`);
console.log('=' .repeat(70));
console.log('✨ CORRECCIONES APLICADAS:');
console.log('   ✅ Requisitos: título, notas, cédula, certificado OPSU');
console.log('   ❌ Removido: fotos (NO es requisito)');
console.log('   ✅ 2 procesos: Admisión interna UNC + SNI/OPSU');
console.log('   ✅ Inscripciones: 2 veces al año (sin fechas específicas)');
console.log('=' .repeat(70));
console.log('\n📋 FAQs agregadas:');
console.log('   - Requisitos de inscripción (3 FAQs)');
console.log('   - Proceso de inscripción (4 FAQs)');
console.log('   - SNI/OPSU (5 FAQs)');
console.log('   - Certificado OPSU (2 FAQs)');
console.log('   - Fechas (2 FAQs - sin especificar)\n');
