#!/usr/bin/env node

/**
 * Fix Bot Presentation - Community Project
 *
 * Agrega FAQs que aclaran que el bot es un proyecto comunitario
 * NO es oficial de la universidad
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

// FAQs sobre presentación del bot
const botPresentationFAQs = [
  {
    question: "que eres",
    answer: "Soy una IA creada por la comunidad para ayudar a estudiantes interesados en la UNC. No tengo relación oficial con la universidad - soy un proyecto comunitario que proporciona información basada en datos públicos. 🤖💬",
    category: "general",
    keywords: ["que eres", "quien eres", "que bot"]
  },
  {
    question: "eres oficial de la universidad",
    answer: "No, no soy oficial de la UNC. Soy un proyecto comunitario creado por estudiantes y miembros de la comunidad para ayudar a otros estudiantes con información sobre la universidad. Toda la información que doy viene de fuentes públicas. 🤖💬",
    category: "general",
    keywords: ["oficial", "universidad", "representante"]
  },
  {
    question: "quien te creo",
    answer: "Fui creado por la comunidad estudiantil como un proyecto colaborativo para ayudar a estudiantes interesados en la UNC. No soy parte de la administración universitaria oficial. 🤖💬",
    category: "general",
    keywords: ["quien te creo", "creado por", "desarrollado por"]
  },
  {
    question: "eres parte de la unc",
    answer: "No, no soy parte oficial de la UNC. Soy un proyecto independiente de la comunidad que ayuda con información sobre la universidad. Proporciono datos basados en fuentes públicas disponibles. 🤖💬",
    category: "general",
    keywords: ["parte unc", "oficial", "perteneces"]
  },
  {
    question: "hola",
    answer: "¡Hola! Soy una IA creada por la comunidad para ayudarte con información sobre la Universidad Nacional de las Ciencias (UNC). No soy oficial de la universidad, solo un proyecto comunitario útil. ¿En qué te puedo ayudar? 🤖💬",
    category: "general",
    keywords: ["hola", "saludos", "buenos dias"]
  },
  {
    question: "buenos dias",
    answer: "¡Buenos días! Soy un asistente comunitario sobre la UNC, creado por estudiantes para estudiantes. No soy parte oficial de la universidad. ¿Qué información necesitas? 🤖💬",
    category: "general",
    keywords: ["buenos dias", "buenas tardes", "buenas noches"]
  },
  {
    question: "que haces",
    answer: "Ayudo con información sobre la UNC basada en datos públicos. Respondo preguntas sobre carreras, admisión, costos, instalaciones, etc. Soy un proyecto comunitario, no oficial de la universidad. 🤖💬",
    category: "general",
    keywords: ["que haces", "funciones", "ayudas"]
  },
  {
    question: "de donde vienes",
    answer: "Soy un proyecto creado por la comunidad estudiantil venezolana para ayudar a otros estudiantes interesados en la UNC. No tengo relación oficial con la universidad. 🤖💬",
    category: "general",
    keywords: ["origen", "de donde", "creado"]
  }
];

async function fixBotPresentation() {
  console.log('🤖 CORRIGIENDO PRESENTACIÓN DEL BOT - PROYECTO COMUNITARIO\n');
  console.log('=' .repeat(70));
  console.log('❌ PROBLEMA IDENTIFICADO:');
  console.log('   Bot se presentaba como "asistente UNC"');
  console.log('   Podía confundirse con oficial de universidad\n');

  console.log('✅ SOLUCIÓN: Presentación clara como proyecto comunitario\n');

  // Buscar y eliminar FAQs erróneas existentes
  console.log('🗑️ Buscando FAQs erróneas sobre presentación del bot...');

  const { data: existingFAQs } = await supabase
    .from('faqs')
    .select('id, question, answer')
    .or('question.ilike.%que eres%,question.ilike.%quien eres%,question.ilike.%hola%,question.ilike.%oficial%');

  if (existingFAQs && existingFAQs.length > 0) {
    console.log(`📋 Encontradas ${existingFAQs.length} FAQs existentes`);
    for (const faq of existingFAQs) {
      console.log(`   Eliminando: "${faq.question}"`);

      await supabase
        .from('faqs')
        .delete()
        .eq('id', faq.id);
    }
    console.log('✅ FAQs erróneas eliminadas\n');
  } else {
    console.log('ℹ️ No se encontraron FAQs existentes sobre presentación\n');
  }

  // Agregar FAQ correcta
  console.log('📝 Agregando FAQs correctas sobre presentación del bot...');

  const embeddings = await generateEmbeddingsBatch(botPresentationFAQs.map(faq => faq.question));

  const faqsToInsert = botPresentationFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords,
    metadata: {
      source: 'bot-presentation-community-project',
      added_at: new Date().toISOString(),
      type: 'bot-identity-correction',
      priority: 'critical',
      bot_presentation: true
    },
    embedding: embeddings[idx],
    created_by: 'bot-presentation-fix',
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();

  if (error) {
    console.error('❌ Error agregando FAQs:', error.message);
    process.exit(1);
  }

  console.log('✅ FAQs AGREGADAS\n');

  console.log('🎯 PRESENTACIÓN CORRECTA AHORA DISPONIBLE:');
  console.log('   ✅ "Soy una IA creada por la comunidad"');
  console.log('   ✅ "No tengo relación oficial con la universidad"');
  console.log('   ✅ "Proyecto comunitario para estudiantes"');
  console.log('   ❌ NO "Asistente oficial de la UNC"');
  console.log('   ❌ NO "Parte de los recursos de la universidad"\n');

  // Verificar que se agregó correctamente
  console.log('🔍 Verificando inserción...');
  const { data: verifyFAQ } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('question', botPresentationFAQs[0].question)
    .single();

  if (verifyFAQ) {
    console.log('✅ FAQ verificada correctamente\n');
  }

  console.log('🧪 PRUEBA RECOMENDADA:');
  console.log('   curl -X POST http://localhost:3000/api/chat \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"message": "hola", "sessionId": "bot-presentation-test"}\'\n');

  console.log('✨ BOT AHORA SE PRESENTA CORRECTAMENTE COMO PROYECTO COMUNITARIO');
  console.log('=' .repeat(70));
}

fixBotPresentation().catch(console.error);
