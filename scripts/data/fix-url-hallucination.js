#!/usr/bin/env node

/**
 * Fix URL Hallucination - Corrección Crítica
 * 
 * El bot estaba inventando URLs que no existen.
 * ÚNICA URL VÁLIDA: https://unc.edu.ve/
 * REDES SOCIALES: @unicienciasvzla (Instagram y TikTok)
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

console.log('🔗 CORRIGIENDO ALUCINACIÓN DE URLs\n');
console.log('=' .repeat(70));
console.log('⚠️  CRÍTICO: El bot NO debe inventar URLs');
console.log('✅ ÚNICA URL VÁLIDA: https://unc.edu.ve/');
console.log('✅ REDES SOCIALES: @unicienciasvzla (Instagram y TikTok)');
console.log('=' .repeat(70));

const urlCorrectionFAQs = [
  // PENSUM Y DOCUMENTOS
  {
    question: "donde encuentro el pensum",
    answer: "Puedes encontrar el pensum actualizado en el sitio web oficial de la UNC: **https://unc.edu.ve/** o consultando directamente con tu coordinador de carrera. También puedes solicitarlo en la oficina de asuntos estudiantiles. 📚📋",
    category: "sistema_academico",
    keywords: ["pensum", "plan estudios", "donde", "encontrar", "curriculum"]
  },
  {
    question: "cual es el pensum",
    answer: "El pensum varía según la carrera. Puedes consultarlo en **https://unc.edu.ve/** o contactar a tu coordinador de carrera para obtener el plan de estudios actualizado de tu programa. 📚🎓",
    category: "sistema_academico",
    keywords: ["cual pensum", "plan estudios", "materias"]
  },
  {
    question: "donde veo el pensum actualizado",
    answer: "El pensum actualizado está disponible en **https://unc.edu.ve/** en la sección de tu carrera, o puedes solicitarlo directamente en la coordinación de tu programa académico. 📋✨",
    category: "sistema_academico",
    keywords: ["pensum actualizado", "donde ver", "plan estudios"]
  },
  
  // PÁGINA WEB Y CONTACTO
  {
    question: "cual es la pagina web de la unc",
    answer: "La página web oficial de la UNC es: **https://unc.edu.ve/** 🌐 Ahí encontrarás información sobre carreras, admisiones, noticias y contacto.",
    category: "contacto",
    keywords: ["pagina web", "sitio web", "url", "website"]
  },
  {
    question: "donde puedo ver mas informacion",
    answer: "Puedes ver más información en el sitio web oficial: **https://unc.edu.ve/** o seguir las redes sociales: **@unicienciasvzla** en Instagram y TikTok. 📱🌐",
    category: "contacto",
    keywords: ["mas informacion", "donde ver", "información"]
  },
  {
    question: "como contacto a la universidad",
    answer: "Puedes contactar a la UNC a través de: 🌐 **Sitio web**: https://unc.edu.ve/ 📱 **Redes sociales**: @unicienciasvzla (Instagram y TikTok). También puedes visitar las oficinas administrativas directamente. 📞",
    category: "contacto",
    keywords: ["contacto", "contactar", "comunicar", "universidad"]
  },
  
  // REDES SOCIALES
  {
    question: "cuales son las redes sociales de la unc",
    answer: "Las redes sociales oficiales de la UNC son: 📱 **Instagram**: @unicienciasvzla 🎵 **TikTok**: @unicienciasvzla 🌐 **Web**: https://unc.edu.ve/",
    category: "contacto",
    keywords: ["redes sociales", "instagram", "tiktok", "social media"]
  },
  {
    question: "tienen instagram",
    answer: "Sí, la UNC está en Instagram como **@unicienciasvzla** 📱 Síguelos para noticias, eventos y contenido sobre la universidad. También están en TikTok con el mismo usuario.",
    category: "contacto",
    keywords: ["instagram", "ig", "redes sociales"]
  },
  {
    question: "tienen tiktok",
    answer: "Sí, la UNC está en TikTok como **@unicienciasvzla** 🎵 Síguelos para contenido dinámico sobre la vida universitaria. También están en Instagram con el mismo usuario.",
    category: "contacto",
    keywords: ["tiktok", "redes sociales"]
  },
  {
    question: "como los sigo en redes",
    answer: "Puedes seguir a la UNC en: 📱 **Instagram**: @unicienciasvzla 🎵 **TikTok**: @unicienciasvzla. Publican contenido sobre carreras, eventos, vida estudiantil y más. ✨",
    category: "contacto",
    keywords: ["seguir", "redes", "social media"]
  },
  
  // INSCRIPCIONES Y ADMISIONES
  {
    question: "donde me inscribo",
    answer: "Las inscripciones se realizan a través del sitio web oficial: **https://unc.edu.ve/** cuando abren los períodos de admisión (enero y julio). Sigue las instrucciones en la sección de admisiones. 📝✨",
    category: "admisiones",
    keywords: ["donde inscribirse", "inscripciones", "registro"]
  },
  {
    question: "como hago la inscripcion online",
    answer: "La inscripción online se hace en **https://unc.edu.ve/** durante los períodos de admisión. Necesitarás tus documentos digitalizados (título de bachiller, notas, cédula). Sigue el proceso paso a paso en el sitio. 💻📝",
    category: "admisiones",
    keywords: ["inscripcion online", "registro", "como inscribirse"]
  },
  
  // INFORMACIÓN GENERAL
  {
    question: "donde puedo conseguir mas detalles",
    answer: "Puedes conseguir más detalles en: 🌐 **https://unc.edu.ve/** (sitio oficial) 📱 **@unicienciasvzla** (Instagram y TikTok) 🏛️ **Oficinas administrativas** (visita presencial). ¿Qué información específica necesitas? 💡",
    category: "general",
    keywords: ["mas detalles", "información", "donde conseguir"]
  },
  {
    question: "tienen portal estudiantil",
    answer: "Para información sobre el portal estudiantil y acceso a sistemas internos, consulta en **https://unc.edu.ve/** o contacta directamente a la oficina de sistemas de la universidad. 💻🎓",
    category: "sistema_academico",
    keywords: ["portal estudiantil", "sistema", "plataforma"]
  }
];

console.log(`\n📝 Agregando ${urlCorrectionFAQs.length} FAQs con URLs correctas...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = urlCorrectionFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = urlCorrectionFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'url-hallucination-fix',
    added_at: new Date().toISOString(),
    type: 'hallucination-correction',
    priority: 'critical',
    fix_for: 'url-invention',
    valid_url: 'https://unc.edu.ve/',
    valid_social: '@unicienciasvzla'
  },
  embedding: embeddings[idx],
  created_by: 'fix-url-hallucination',
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

console.log(`✅ ${data.length} FAQs con URLs correctas agregadas!\n`);
console.log('=' .repeat(70));
console.log('✨ CORRECCIÓN APLICADA:');
console.log('   ✅ ÚNICA URL VÁLIDA: https://unc.edu.ve/');
console.log('   ✅ Instagram: @unicienciasvzla');
console.log('   ✅ TikTok: @unicienciasvzla');
console.log('   ❌ El bot NO inventará URLs falsas');
console.log('=' .repeat(70));
console.log('\n📋 Preguntas corregidas:');
console.log('   - Pensum y documentos (3 FAQs)');
console.log('   - Página web y contacto (3 FAQs)');
console.log('   - Redes sociales (4 FAQs)');
console.log('   - Inscripciones (2 FAQs)');
console.log('   - Información general (2 FAQs)\n');
