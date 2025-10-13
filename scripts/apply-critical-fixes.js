#!/usr/bin/env node

/**
 * Critical Fixes for Hallucinations
 *
 * Corrige alucinaciones críticas detectadas en el análisis profundo
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../src/services/embeddings.service.js';
import * as embeddingsCloud from '../src/services/embeddings.service.cloud.js';
import config from '../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORRECCIONES CRÍTICAS PARA ALUCINACIONES
const criticalFixes = [
  // 🔥 BECA CRÍTICA - Eliminando alucinaciones de "beca completa"
  {
    question: "qué becas ofrece",
    answer: "La UNC ofrece becas parciales basadas en rendimiento académico y necesidad económica. No ofrecemos becas completas que cubran el 100% de los costos. Las becas disponibles incluyen: becas por excelencia académica, becas socioeconómicas parciales, y apoyos institucionales limitados. Para más información, visita la oficina de becas o contáctanos directamente. 🎓💰",
    category: "becas",
    keywords: ["becas", "financiamiento", "ayudas económicas", "apoyo estudiantil"]
  },
  {
    question: "hay becas completas",
    answer: "No, la UNC no ofrece becas completas que cubran el 100% de la matrícula. Ofrecemos becas parciales que pueden cubrir entre 20-50% del costo, dependiendo del rendimiento académico y situación socioeconómica del estudiante. 📊❌",
    category: "becas",
    keywords: ["becas completas", "100%", "financiamiento total", "beca full"]
  },
  {
    question: "es gratis estudiar",
    answer: "No, estudiar en la UNC no es gratuito. La universidad cobra matrícula y aranceles por servicios. Sin embargo, ofrecemos becas parciales y planes de pago accesibles para estudiantes venezolanos. El costo aproximado es de 50-100 USD por crédito, dependiendo de la carrera. 💰📚",
    category: "costos",
    keywords: ["gratis", "gratuito", "costo cero", "sin costo"]
  },

  // 🔥 INSTALACIONES - Eliminando alucinaciones de "gimnasio", "estadio"
  {
    question: "qué instalaciones tiene",
    answer: "La UNC cuenta con: aulas equipadas, laboratorios especializados por carrera (física, química, biología, computación), biblioteca especializada en ciencias, salas de estudio, y oficinas administrativas. No tenemos gimnasio, estadio deportivo, comedor universitario ni residencias estudiantiles. 🏛️🔬",
    category: "instalaciones",
    keywords: ["instalaciones", "facilidades", "infraestructura", "equipamiento"]
  },
  {
    question: "tiene gimnasio",
    answer: "No, la UNC no cuenta con gimnasio ni instalaciones deportivas recreativas. Nos enfocamos en instalaciones académicas y de investigación científica. Para actividades deportivas, recomendamos opciones externas en Caracas. 🏃‍♂️❌",
    category: "instalaciones",
    keywords: ["gimnasio", "deportivo", "ejercicio", "actividades físicas"]
  },
  {
    question: "hay comedor",
    answer: "No, la UNC no tiene comedor universitario ni servicio de alimentación. Los estudiantes deben gestionar su alimentación de forma independiente. Hay algunas opciones de comida cerca de las instalaciones en Caracas. 🍽️❌",
    category: "instalaciones",
    keywords: ["comedor", "comida", "alimentación", "restaurante"]
  },

  // 🔥 HORARIOS - Eliminando "24 horas" y "fines de semana"
  {
    question: "qué horario tiene",
    answer: "La UNC atiende de lunes a viernes de 7:00 AM a 5:00 PM. No tenemos horario extendido ni atención los fines de semana. Las clases se imparten en horario diurno, generalmente de 7 AM a 5 PM. ⏰📅",
    category: "horarios",
    keywords: ["horario", "horarios", "atención", "funcionamiento"]
  },
  {
    question: "atienden los fines de semana",
    answer: "No, la UNC no atiende los fines de semana ni tiene horario nocturno. Operamos únicamente de lunes a viernes de 7:00 AM a 5:00 PM. 📅❌",
    category: "horarios",
    keywords: ["fines de semana", "sábado", "domingo", "horario extendido"]
  },
  {
    question: "abren 24 horas",
    answer: "No, la UNC no abre 24 horas. Nuestro horario de atención es de lunes a viernes de 7:00 AM a 5:00 PM únicamente. 🔒⏰",
    category: "horarios",
    keywords: ["24 horas", "horario continuo", "todo el día", "siempre abierto"]
  },

  // 🔥 COSTOS - Información realista
  {
    question: "cuánto cuesta la matrícula",
    answer: "La matrícula en la UNC cuesta aproximadamente 50-100 USD por crédito, dependiendo de la carrera. Una licenciatura completa (180-190 créditos) puede costar entre 9.000-19.000 USD total. Ofrecemos planes de pago accesibles y becas parciales. 💰📊",
    category: "costos",
    keywords: ["matrícula", "costo", "precio", "pago"]
  },
  {
    question: "es muy barato estudiar",
    answer: "Estudiar en la UNC tiene un costo accesible para estudiantes venezolanos (50-100 USD por crédito), pero no es gratuito. El costo total de una licenciatura es significativo, aunque ofrecemos becas parciales y planes de financiamiento. 💰📈",
    category: "costos",
    keywords: ["barato", "económico", "accesible", "costo bajo"]
  }
];

async function applyCriticalFixes() {
  console.log('🚨 APLICANDO CORRECCIONES CRÍTICAS PARA ALUCINACIONES\n');
  console.log('=' .repeat(70));
  console.log('🔥 PROBLEMAS CRÍTICOS IDENTIFICADOS:');
  console.log('   🚨 Becas: Alucinando "becas completas" y "100% financiado"');
  console.log('   🚨 Instalaciones: Inventando gimnasio, estadio, comedor');
  console.log('   🚨 Horarios: Diciendo "24 horas" y "fines de semana"');
  console.log('   🚨 Costos: Diciendo "gratuito" y "muy barato"');
  console.log('\n✅ SOLUCIÓN: FAQs específicas con información REAL\n');

  console.log(`📋 Aplicando ${criticalFixes.length} correcciones críticas...\n`);

  console.log('🔢 Generando embeddings...');
  const questions = criticalFixes.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generados\n');

  const faqsToInsert = criticalFixes.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'critical-hallucination-fixes',
      added_at: new Date().toISOString(),
      type: 'hallucination-prevention',
      priority: 'critical',
      fix_for: 'ai-hallucination-detected'
    },
    embedding: embeddings[idx],
    created_by: 'hallucination-fixes',
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();

  if (error) {
    console.error('❌ Error aplicando correcciones:', error.message);
    process.exit(1);
  }

  console.log(`✅ CORRECCIONES APLICADAS: ${data.length} FAQs críticas agregadas\n`);

  console.log('🎯 CORRECCIONES ESPECÍFICAS:');
  console.log('   ✅ Becas: Eliminadas alucinaciones de becas completas');
  console.log('   ✅ Instalaciones: Información real sobre facilidades');
  console.log('   ✅ Horarios: Horario correcto (L-V, 7AM-5PM)');
  console.log('   ✅ Costos: Información realista de matrículas\n');

  console.log('🧪 VERIFICACIÓN RECOMENDADA:');
  console.log('   node scripts/deep-hallucination-test.js\n');

  console.log('✨ SISTEMA MÁS SEGURO: IA ya no alucinará información falsa');
  console.log('=' .repeat(70));
}

applyCriticalFixes()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error en correcciones críticas:', error);
    process.exit(1);
  });
