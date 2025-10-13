#!/usr/bin/env node

/**
 * Add CAIU Modules Overview FAQs
 * 
 * Agrega FAQs para cuando preguntan sobre conocer/ver los módulos del CAIU
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

console.log('📚 AGREGANDO FAQs SOBRE CONOCER LOS MÓDULOS DEL CAIU\n');
console.log('=' .repeat(70));

const modulesOverviewFAQs = [
  {
    question: "quiero conocer los modulos del caiu",
    answer: "El **CAIU** tiene **4 módulos** obligatorios durante 12 semanas: 🔢 **Módulo I** - Lenguaje Lógico-Matemático (ecuaciones, funciones, graficación), 📖 **Módulo II** - Habilidades Lingüísticas (comprensión lectora, redacción), 🤔 **Módulo III** - Filosofía y Metodología (epistemología, pensamiento crítico), 💻 **Módulo IV** - Herramientas Tecnológicas (TIC, Moodle). 📚",
    category: "admision",
    keywords: ["conocer", "modulos", "caiu", "cuales son"]
  },
  {
    question: "cuales son los modulos del caiu",
    answer: "Los **4 módulos del CAIU** son: 🔢 **Módulo I** - Lenguaje Lógico-Matemático, 📖 **Módulo II** - Habilidades Lingüísticas, 🤔 **Módulo III** - Filosofía de las Ciencias y Metodología, 💻 **Módulo IV** - Herramientas Tecnológicas. Todos son obligatorios durante las 12 semanas. 📚",
    category: "admision",
    keywords: ["cuales son", "modulos", "caiu"]
  },
  {
    question: "que modulos tiene el caiu",
    answer: "El **CAIU** tiene **4 módulos**: 1️⃣ Lenguaje Lógico-Matemático, 2️⃣ Habilidades Lingüísticas, 3️⃣ Filosofía y Metodología de Investigación, 4️⃣ Herramientas Tecnológicas. Son 12 semanas de preparación universitaria. 📚",
    category: "admision",
    keywords: ["que modulos", "tiene", "caiu"]
  },
  {
    question: "dime los modulos del caiu",
    answer: "Los **módulos del CAIU** son: 🔢 **Lenguaje Lógico-Matemático** (matemáticas y razonamiento), 📖 **Habilidades Lingüísticas** (comunicación), 🤔 **Filosofía y Metodología** (pensamiento crítico), 💻 **Herramientas Tecnológicas** (TIC y Moodle). Son 4 módulos en 12 semanas. 📚",
    category: "admision",
    keywords: ["dime", "modulos", "caiu"]
  },
  {
    question: "quiero saber los modulos del caiu",
    answer: "El **CAIU** tiene **4 módulos** que cursas en 12 semanas: 1️⃣ **Lenguaje Lógico-Matemático**, 2️⃣ **Habilidades Lingüísticas**, 3️⃣ **Filosofía de las Ciencias y Metodología**, 4️⃣ **Herramientas Tecnológicas**. Todos son obligatorios para ingresar a la UNC. 📚✅",
    category: "admision",
    keywords: ["quiero saber", "modulos", "caiu"]
  },
  {
    question: "muestrame los modulos del caiu",
    answer: "**Módulos del CAIU** (12 semanas): 🔢 **Módulo I** - Lenguaje Lógico-Matemático (ecuaciones, funciones), 📖 **Módulo II** - Habilidades Lingüísticas (redacción, comprensión), 🤔 **Módulo III** - Filosofía y Metodología (epistemología), 💻 **Módulo IV** - Herramientas Tecnológicas (TIC, Moodle). 📚",
    category: "admision",
    keywords: ["muestrame", "modulos", "caiu"]
  },
  {
    question: "cuantos modulos tiene el caiu",
    answer: "El **CAIU** tiene **4 módulos**: Lenguaje Lógico-Matemático, Habilidades Lingüísticas, Filosofía y Metodología, y Herramientas Tecnológicas. Los cursas durante 12 semanas y debes aprobar todos con mínimo 14/20. 📚✅",
    category: "admision",
    keywords: ["cuantos modulos", "caiu"]
  },
  {
    question: "como se llaman los modulos del caiu",
    answer: "Los **módulos del CAIU** se llaman: 1️⃣ **Lenguaje Lógico-Matemático**, 2️⃣ **Habilidades Lingüísticas**, 3️⃣ **Filosofía de las Ciencias y Metodología de la Investigación**, 4️⃣ **Herramientas Tecnológicas para el Entorno Universitario**. Son 4 módulos en total. 📚",
    category: "admision",
    keywords: ["como se llaman", "modulos", "caiu"]
  },
  {
    question: "informacion sobre los modulos del caiu",
    answer: "El **CAIU** tiene **4 módulos** (12 semanas): 🔢 **Lenguaje Lógico-Matemático** (fundamentos matemáticos), 📖 **Habilidades Lingüísticas** (comunicación académica), 🤔 **Filosofía y Metodología** (pensamiento crítico científico), 💻 **Herramientas Tecnológicas** (TIC y plataformas virtuales). 📚",
    category: "admision",
    keywords: ["informacion", "modulos", "caiu"]
  },
  {
    question: "que voy a ver en los modulos del caiu",
    answer: "En los **4 módulos del CAIU** verás: 🔢 Matemáticas y razonamiento lógico, 📖 Comprensión lectora y redacción científica, 🤔 Epistemología y metodología de investigación, 💻 TIC, herramientas ofimáticas y Moodle. Son 12 semanas de preparación integral. 📚",
    category: "admision",
    keywords: ["que voy a ver", "modulos", "caiu"]
  },
  {
    question: "explica los modulos del caiu",
    answer: "**Módulos del CAIU** (12 semanas): 🔢 **Módulo I** - Matemáticas (ecuaciones, funciones, graficación), 📖 **Módulo II** - Lingüística (redacción, comprensión), 🤔 **Módulo III** - Filosofía (epistemología, metodología científica), 💻 **Módulo IV** - Tecnología (TIC, Office, Moodle). Debes aprobar todos. 📚✅",
    category: "admision",
    keywords: ["explica", "modulos", "caiu"]
  },
  {
    question: "dame informacion de los modulos del caiu",
    answer: "El **CAIU** consta de **4 módulos** obligatorios: 1️⃣ **Lenguaje Lógico-Matemático** (fundamentos matemáticos), 2️⃣ **Habilidades Lingüísticas** (comunicación efectiva), 3️⃣ **Filosofía y Metodología** (pensamiento crítico), 4️⃣ **Herramientas Tecnológicas** (TIC). Duración: 12 semanas. 📚",
    category: "admision",
    keywords: ["dame informacion", "modulos", "caiu"]
  }
];

console.log(`\n📝 Agregando ${modulesOverviewFAQs.length} FAQs sobre módulos del CAIU...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = modulesOverviewFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = modulesOverviewFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'caiu-modules-overview',
    added_at: new Date().toISOString(),
    type: 'overview-query',
    intent: 'list-all-modules'
  },
  embedding: embeddings[idx],
  created_by: 'add-caiu-modules-overview',
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

console.log(`✅ ${data.length} FAQs sobre módulos del CAIU agregadas!\n`);
console.log('✨ Ahora el bot detectará preguntas como:');
console.log('   - "quiero conocer los modulos del caiu"');
console.log('   - "cuales son los modulos del caiu"');
console.log('   - "que modulos tiene el caiu"');
console.log('   - "dime los modulos del caiu"\n');
