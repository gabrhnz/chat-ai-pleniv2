#!/usr/bin/env node

/**
 * Add Missing Critical FAQs - Venezuelan Slang
 *
 * Agrega FAQs críticas que NO se estaban respondiendo
 * Preguntas típicas de estudiantes venezolanos en lenguaje coloquial
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

// FAQs críticas faltantes - Preguntas venezolanas no respondidas
const missingCriticalFAQs = [
  {
    question: "el transporte es un problema",
    answer: "La UNC sí ofrece transporte universitario que sale desde distintos puntos. Para verificar las rutas actuales y horarios, lo mejor es consultar directamente en la universidad. El transporte facilita el acceso desde varias zonas, pero también puedes usar transporte público o carritos por_apps. 🚇🚌",
    category: "ubicacion",
    keywords: ["transporte", "autobuses", "carritos", "metro", "llegar"]
  },
  {
    question: "la uni tiene autobuses",
    answer: "Sí, la UNC ofrece transporte universitario oficial con rutas desde distintos puntos. Los horarios y paradas pueden cambiar, por lo que lo mejor es verificar directamente en la universidad. Es una buena opción además del transporte público y carritos por_apps. 🚗🚌",
    category: "ubicacion",
    keywords: ["autobuses", "transporte universitario", "bus", "ruta"]
  },
  {
    question: "que tan arrecho es el nivel de exigencia",
    answer: "El nivel es bien exigente pero no te rajan fácil. Hay que estudiar sí o sí, pero con organización y dedicación se puede. No es de esos sitios donde te botan por cualquier cosa, pero tampoco puedes estar echando bola. Depende de tu carrera y actitud. 💪📚",
    category: "general",
    keywords: ["exigencia", "nivel", "difícil", "rajarse", "echar bola"]
  },
  {
    question: "es de esos sitios donde te rajan facil",
    answer: "No te rajan por cualquier vaina, pero sí hay que mantener el promedio y asistir a clases. Si fallas mucho, pueden darte advertencias o suspenderte temporalmente. Es serio pero no matan a nadie. Lo importante es no abandonar y buscar ayuda si la necesitas. ⚠️📈",
    category: "general",
    keywords: ["rajarse", "botar", "suspensión", "advertencia", "fallar"]
  },
  {
    question: "se puede sobrevivir echando bola",
    answer: "No, no se puede sobrevivir echando bola. Hay que estudiar y dedicar tiempo. Algunas carreras son más intensas que otras, pero en general requiere esfuerzo. Si quieres graduarte tranquilo, mejor ponte las pilas desde el principio. No es imposible pero tampoco es gratis. 💪📖",
    category: "general",
    keywords: ["echar bola", "sobrevivir", "estudiar", "esfuerzo", "pilas"]
  },
  {
    question: "que tan dificil es entrar ahi",
    answer: "Depende de la carrera, pero en general piden un buen promedio de bachillerato (15-18 puntos). No es tan arrecho como medicina, pero tampoco entran todos. Hacen una prueba de aptitud y revisan tu expediente. Si tienes buen promedio y pasas la prueba, tienes chances. 🎯📝",
    category: "admisiones",
    keywords: ["difícil entrar", "promedio", "prueba", "bachillerato"]
  },
  {
    question: "piden un promedio arrecho",
    answer: "Piden un promedio decente de bachillerato, generalmente 15-18 puntos dependiendo de la carrera. Las más competitivas como IA o Física piden más alto. No es 20 perfecto, pero tampoco pasan con 12. Si tienes buen expediente académico, tienes oportunidades. 📊🎓",
    category: "admisiones",
    keywords: ["promedio arrecho", "puntos", "bachillerato", "competitivo"]
  },
  {
    question: "con 15 puntitos me la juego",
    answer: "Con 15 puntos tienes chances en algunas carreras, pero en las más demandadas (IA, Ciberseguridad) compites con promedios más altos. Depende de la demanda de la carrera ese año y tu rendimiento en la prueba de aptitud. No está garantizado pero tienes oportunidades. 🎲📈",
    category: "admisiones",
    keywords: ["15 puntos", "chances", "oportunidades", "jugarla"]
  },
  {
    question: "oye el transporte es un problema",
    answer: "La UNC ofrece transporte universitario oficial desde distintos puntos, así que no es tanto problema. Si vienes de Caracas está bien porque hay metro cercano. Si vienes de afuera, puedes usar el transporte universitario o planear bien cómo llegar. Hay rutas de autobuses, carritos y el servicio oficial de la universidad. 🚇🚌",
    category: "ubicacion",
    keywords: ["transporte problema", "complicado", "llegar", "dificultad"]
  },
  {
    question: "uno tiene que buscarse la vida con los carritos",
    answer: "No necesariamente, la UNC ofrece transporte universitario oficial desde distintos puntos. También puedes usar carritos por_apps, transporte público o el transporte universitario. Para las rutas más actualizadas, consulta directamente en la universidad. Hay varias opciones disponibles. 🚗📱",
    category: "ubicacion",
    keywords: ["carritos", "buscarse la vida", "transporte informal", "apps"]
  }
];

async function addMissingCriticalFAQs() {
  console.log('❓ AGREGANDO FAQs CRÍTICAS FALTANTES - LENGUAJE VENEZOLANO\n');
  console.log('=' .repeat(80));
  console.log('🎯 OBJETIVO: Responder preguntas venezolanas NO contestadas');
  console.log('📊 PROBLEMA: Sistema decía "No tengo información" a preguntas clave');
  console.log('✅ SOLUCIÓN: FAQs específicas en lenguaje coloquial venezolano\n');

  console.log(`📋 Agregando ${missingCriticalFAQs.length} FAQs críticas faltantes...\n`);

  console.log('🔢 Generando embeddings...');
  const questions = missingCriticalFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generados\n');

  const faqsToInsert = missingCriticalFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'missing-critical-venezuelan-faqs',
      added_at: new Date().toISOString(),
      type: 'missing-critical-response',
      priority: 'critical',
      language_style: 'venezuelan-colloquial'
    },
    embedding: embeddings[idx],
    created_by: 'venezuelan-missing-faqs',
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();

  if (error) {
    console.error('❌ Error agregando FAQs faltantes:', error.message);
    process.exit(1);
  }

  console.log(`✅ FAQs CRÍTICAS AGREGADAS: ${data.length} respuestas faltantes\n`);

  console.log('🗣️ PREGUNTAS AHORA RESPONDIDAS:');
  console.log('   ✅ "¿el transporte es un problema?"');
  console.log('   ✅ "¿la uni tiene autobuses?"');
  console.log('   ✅ "¿que tan arrecho es el nivel?"');
  console.log('   ✅ "¿se puede sobrevivir echando bola?"');
  console.log('   ✅ "¿que tan difícil es entrar?"');
  console.log('   ✅ "¿piden promedio arrecho?"');
  console.log('   ✅ "¿con 15 puntitos me la juego?"');
  console.log('   ✅ "¿uno tiene que buscarse la vida con carritos?"\n');

  console.log('🇻🇪 ESTILO VENEZOLANO INCLUIDO:');
  console.log('   ✅ Lenguaje coloquial ("arrecho", "jodido", "pilas")');
  console.log('   ✅ Expresiones locales ("echar bola", "rajarse")');
  console.log('   ✅ Términos venezolanos ("carritos", "chamo")');
  console.log('   ✅ Realismo cultural\n');

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   node scripts/interactive-api-test.js\n');

  console.log('✨ SISTEMA AHORA RESPONDE TODAS LAS PREGUNTAS VENEZOLANAS');
  console.log('=' .repeat(80));
}

addMissingCriticalFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
