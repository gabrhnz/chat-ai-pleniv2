#!/usr/bin/env node

/**
 * Add Conversational FAQs
 * 
 * Agrega FAQs con lenguaje más natural y conversacional
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

// FAQs conversacionales
const conversationalFAQs = [
  {
    question: "¿Cuáles hay?",
    answer: "**16 carreras**: 6 ingenierías y 10 licenciaturas científicas. 🎓 ¿Cuál área te interesa?",
    category: "carreras",
    keywords: ["cuáles", "lista", "carreras"]
  },
  {
    question: "¿Qué carreras hay?",
    answer: "**16 programas**: Ingenierías (IA, Ciberseguridad, Robótica) y Licenciaturas (Física, Biotecnología, Nanotecnología). 🎓 ¿Cuál prefieres?",
    category: "carreras",
    keywords: ["qué carreras", "lista carreras"]
  },
  {
    question: "Dime las carreras",
    answer: "Tenemos **ingenierías** (IA, Ciberseguridad, Robótica, Electromedicina, Petroquímica, Biomateriales) y **licenciaturas** científicas. 📚 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["dime", "lista", "carreras"]
  },
  {
    question: "¿Cuáles son las carreras?",
    answer: "**16 carreras** en tecnología y ciencias: Ingenierías y Licenciaturas. 🎓 ¿Quieres detalles de alguna?",
    category: "carreras",
    keywords: ["cuáles son", "carreras"]
  },
  {
    question: "Quiero saber las carreras",
    answer: "Ofrecemos **6 ingenierías** y **10 licenciaturas** en áreas científicas. 🔬 ¿Cuál área prefieres?",
    category: "carreras",
    keywords: ["quiero saber", "carreras"]
  },
  {
    question: "¿Qué puedo estudiar?",
    answer: "Puedes estudiar **ingenierías** (IA, Robótica, Ciberseguridad) o **licenciaturas** (Física, Biotecnología, Nanotecnología). 📖 ¿Cuál te gusta?",
    category: "carreras",
    keywords: ["qué puedo estudiar", "opciones"]
  },
  {
    question: "Muéstrame las carreras",
    answer: "**Ingenierías**: IA, Ciberseguridad, Robótica, Electromedicina, Petroquímica, Biomateriales. **Licenciaturas**: 10 programas científicos. 🎓 ¿Cuál?",
    category: "carreras",
    keywords: ["muéstrame", "lista"]
  },
  {
    question: "¿Qué opciones de carrera tienen?",
    answer: "**16 opciones** entre ingenierías tecnológicas y licenciaturas científicas. 🚀 ¿Tecnología o ciencias?",
    category: "carreras",
    keywords: ["opciones", "carrera"]
  }
];

async function addConversationalFAQs() {
  console.log('🚀 Adding Conversational FAQs\n');
  console.log(`📋 Found ${conversationalFAQs.length} FAQs to add\n`);
  
  // Generate embeddings
  console.log('🔢 Generating embeddings...');
  const questions = conversationalFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  // Prepare FAQs
  const faqsToInsert = conversationalFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'conversational',
      added_at: new Date().toISOString(),
    },
    embedding: embeddings[idx],
    created_by: 'conversational',
    is_active: true,
  }));
  
  // Insert
  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Added ${data.length} conversational FAQs\n`);
}

addConversationalFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
