#!/usr/bin/env node

/**
 * Add Bot Capabilities FAQs
 * 
 * Agrega FAQs para que el bot pueda explicar sus capacidades
 * y qué tipo de preguntas puede responder
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

console.log('🤖 AGREGANDO FAQs SOBRE CAPACIDADES DEL BOT\n');
console.log('=' .repeat(70));

const botCapabilitiesFAQs = [
  {
    question: "que eres capaz de hacer",
    answer: "Puedo ayudarte con información sobre la **UNC**: 📚 **Carreras** (16 programas), 📝 **Admisión** (requisitos, inscripciones), 🎓 **Currículos** (materias por semestre), 💰 **Costos y becas**, 📍 **Ubicación y contacto**, y ✨ **Recomendaciones académicas**. ¿Qué necesitas saber? 🤖",
    category: "bot-info",
    keywords: ["que eres capaz", "que puedes hacer", "capacidades", "funciones"]
  },
  {
    question: "que puedes hacer",
    answer: "Puedo responder sobre: **Carreras de la UNC** (ingenierías y licenciaturas), **Proceso de admisión**, **Materias por semestre**, **Requisitos de ingreso**, **Becas y ayudas**, **Ubicación**, y **Recomendaciones de estudio**. ¿En qué te ayudo? 💡",
    category: "bot-info",
    keywords: ["que puedes hacer", "funciones", "ayuda"]
  },
  {
    question: "que tipo de preguntas puedes responder",
    answer: "Respondo preguntas sobre: 🎓 **Carreras** (¿qué carreras hay?), 📝 **Admisión** (¿cómo me inscribo?), 📚 **Currículos** (¿qué veo en X semestre?), 💰 **Costos** (¿cuánto cuesta?), 🎯 **Recomendaciones** (¿qué estudiar primero?), y 📍 **Contacto**. ¿Qué necesitas? 🤖",
    category: "bot-info",
    keywords: ["tipo de preguntas", "que respondes", "temas"]
  },
  {
    question: "como puedes ayudarme",
    answer: "Te ayudo con información sobre la **UNC**: ✅ Conocer las **16 carreras**, ✅ Entender el **proceso de admisión**, ✅ Ver **materias por semestre**, ✅ Saber sobre **becas y costos**, ✅ Obtener **recomendaciones académicas**. ¿Qué te interesa? 🎓",
    category: "bot-info",
    keywords: ["como ayudarme", "ayuda", "asistencia"]
  },
  {
    question: "que informacion tienes",
    answer: "Tengo información sobre: 📚 **16 carreras** (6 ingenierías, 10 licenciaturas), 📝 **Admisión y requisitos**, 🎓 **Planes de estudio**, 💰 **Costos y becas**, 📍 **Ubicación y contacto**, ⏰ **Horarios**, y 🎯 **Recomendaciones académicas**. ¿Qué buscas? 🔍",
    category: "bot-info",
    keywords: ["que informacion", "datos", "conocimiento"]
  },
  {
    question: "sobre que temas puedes hablar",
    answer: "Puedo hablar sobre: 🎓 **Carreras de la UNC**, 📝 **Proceso de inscripción**, 📚 **Materias y currículos**, 💰 **Becas y ayudas económicas**, 🏛️ **Historia de la UNC**, 📍 **Ubicación y contacto**, y 🎯 **Consejos académicos**. ¿Qué tema te interesa? 💬",
    category: "bot-info",
    keywords: ["temas", "hablar", "conversar"]
  },
  {
    question: "que sabes de la unc",
    answer: "Sé sobre: 🏛️ **Historia** (fundada en 2023), 🎓 **16 carreras** científicas y tecnológicas, 📝 **Admisión** (CAIU, requisitos), 📚 **Planes de estudio** detallados, 💰 **Costos** (pública y gratuita), 🎯 **Recomendaciones** por carrera, y 📍 **Ubicación** (Guatire). ¿Qué quieres saber? 🔍",
    category: "bot-info",
    keywords: ["que sabes", "conocimiento", "unc"]
  },
  {
    question: "en que me puedes orientar",
    answer: "Te oriento en: 🎯 **Elegir carrera** (según tus intereses), 📝 **Proceso de admisión** (pasos y requisitos), 📚 **Qué estudiar primero** (recomendaciones por carrera), 💰 **Becas disponibles**, ⏰ **Fechas importantes**, y 📍 **Cómo contactar a la UNC**. ¿Qué necesitas? 🧭",
    category: "bot-info",
    keywords: ["orientar", "guiar", "ayudar"]
  },
  {
    question: "cuales son tus funciones",
    answer: "Mis funciones son: ✅ **Informar sobre carreras**, ✅ **Explicar proceso de admisión**, ✅ **Mostrar materias por semestre**, ✅ **Dar recomendaciones académicas**, ✅ **Informar sobre becas y costos**, ✅ **Proporcionar datos de contacto**. ¿En qué te ayudo? 🤖",
    category: "bot-info",
    keywords: ["funciones", "tareas", "trabajo"]
  },
  {
    question: "que preguntas frecuentes respondes",
    answer: "Respondo: ❓ **¿Qué carreras hay?**, ❓ **¿Cómo me inscribo?**, ❓ **¿Cuánto cuesta?**, ❓ **¿Hay becas?**, ❓ **¿Qué veo en X semestre?**, ❓ **¿Dónde está la UNC?**, ❓ **¿Qué estudiar primero en X carrera?**, y muchas más. ¿Cuál es tu pregunta? 💡",
    category: "bot-info",
    keywords: ["preguntas frecuentes", "faqs", "respondo"]
  },
  {
    question: "que tipo de asistente eres",
    answer: "Soy un **asistente informativo** sobre la **Universidad Nacional de las Ciencias (UNC)**. Proporciono información sobre carreras, admisión, currículos, becas y más. **No soy representante oficial** de la UNC, soy un proyecto comunitario independiente. 🤖🎓",
    category: "bot-info",
    keywords: ["tipo de asistente", "quien eres", "que eres"]
  },
  {
    question: "para que sirves",
    answer: "Sirvo para: ✅ **Facilitar información** sobre la UNC, ✅ **Responder dudas** sobre carreras y admisión, ✅ **Orientar estudiantes** en su elección académica, ✅ **Proporcionar recomendaciones** de estudio, ✅ **Ahorrar tiempo** en búsqueda de información. ¿Qué necesitas? 🎯",
    category: "bot-info",
    keywords: ["para que sirves", "utilidad", "proposito"]
  },
  {
    question: "que temas dominas",
    answer: "Domino: 🎓 **Carreras de la UNC** (todas las 16), 📝 **Proceso de admisión** (CAIU, requisitos), 📚 **Planes de estudio** (materias por semestre), 💰 **Información financiera** (costos, becas), 🎯 **Recomendaciones académicas**, y 📍 **Datos de contacto**. ¿Qué tema te interesa? 💡",
    category: "bot-info",
    keywords: ["temas dominas", "especialidad", "conocimiento"]
  },
  {
    question: "que no puedes hacer",
    answer: "**No puedo**: ❌ Inscribirte directamente, ❌ Procesar solicitudes de admisión, ❌ Dar información no verificada, ❌ Acceder a tu expediente, ❌ Hacer trámites oficiales. Para eso, contacta directamente a la **oficina de admisiones** de la UNC. 📧",
    category: "bot-info",
    keywords: ["que no puedes", "limitaciones", "no haces"]
  },
  {
    question: "cuales son tus limitaciones",
    answer: "Mis limitaciones: ⚠️ **No hago trámites oficiales**, ⚠️ **No accedo a sistemas internos**, ⚠️ **No tengo información en tiempo real** (fechas pueden cambiar), ⚠️ **No soy representante oficial**. Para información actualizada, contacta a la UNC directamente. 📞",
    category: "bot-info",
    keywords: ["limitaciones", "restricciones", "no puedo"]
  }
];

console.log(`\n📝 Agregando ${botCapabilitiesFAQs.length} FAQs sobre capacidades del bot...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = botCapabilitiesFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = botCapabilitiesFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'bot-capabilities',
    added_at: new Date().toISOString(),
    type: 'meta-information',
    priority: 'high'
  },
  embedding: embeddings[idx],
  created_by: 'add-bot-capabilities',
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

console.log(`✅ ${data.length} FAQs sobre capacidades del bot agregadas!\n`);
console.log('✨ Ahora el bot puede responder preguntas como:');
console.log('   - "que eres capaz de hacer"');
console.log('   - "que puedes hacer"');
console.log('   - "que tipo de preguntas puedes responder"');
console.log('   - "como puedes ayudarme"');
console.log('   - "que informacion tienes"');
console.log('   - "cuales son tus limitaciones"\n');
