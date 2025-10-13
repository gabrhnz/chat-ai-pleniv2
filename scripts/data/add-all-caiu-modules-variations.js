#!/usr/bin/env node

/**
 * Add All CAIU Modules Variations
 * 
 * Agrega variaciones de preguntas para los 4 módulos del CAIU
 * para que el bot detecte mejor cuando preguntan por módulo 1, 2, 3 o 4
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

console.log('📚 AGREGANDO VARIACIONES PARA LOS 4 MÓDULOS DEL CAIU\n');
console.log('=' .repeat(70));

const allModulesVariationsFAQs = [
  // ========================================
  // MÓDULO 1 - Lenguaje Lógico-Matemático
  // ========================================
  {
    question: "que vere en el modulo 1",
    answer: "En el **Módulo I - Lenguaje Lógico-Matemático** verás: 📐 Fundamentos del lenguaje matemático y graficación, 📊 Operaciones y transformaciones con curvas, 🔢 Análisis y resolución de ecuaciones y funciones, y ➕ Razonamiento matemático avanzado con aplicaciones prácticas. 🧮",
    category: "admision",
    keywords: ["modulo 1", "modulo I", "modulo uno", "caiu", "matematicas"]
  },
  {
    question: "que veo en el modulo 1 del caiu",
    answer: "El **Módulo 1** del CAIU es **Lenguaje Lógico-Matemático**. Estudias: 📐 Lenguaje matemático y graficación, 📊 Transformaciones con curvas, 🔢 Ecuaciones y funciones, y ➕ Razonamiento matemático avanzado. Es la base matemática para tu carrera. 🧮",
    category: "admision",
    keywords: ["modulo 1", "caiu", "matematicas"]
  },
  {
    question: "modulo 1 caiu",
    answer: "**Módulo 1 - Lenguaje Lógico-Matemático**: Cubre 📐 fundamentos del lenguaje matemático y graficación, 📊 operaciones y transformaciones con curvas, 🔢 análisis y resolución de ecuaciones y funciones, y ➕ razonamiento matemático avanzado. 🧮",
    category: "admision",
    keywords: ["modulo 1", "caiu"]
  },
  {
    question: "modulo I caiu",
    answer: "**Módulo I - Lenguaje Lógico-Matemático**: Incluye fundamentos matemáticos, graficación, transformaciones con curvas, ecuaciones, funciones y razonamiento matemático avanzado. Es el módulo de matemáticas del CAIU. 📐🧮",
    category: "admision",
    keywords: ["modulo I", "caiu"]
  },
  {
    question: "que temas tiene el modulo 1",
    answer: "El **Módulo 1** tiene: 📐 **Lenguaje matemático y graficación**, 📊 **Operaciones y transformaciones con curvas**, 🔢 **Ecuaciones y funciones** (análisis y resolución), y ➕ **Razonamiento matemático avanzado** con aplicaciones prácticas. 🧮",
    category: "admision",
    keywords: ["temas", "modulo 1", "caiu"]
  },
  {
    question: "modulo uno del caiu",
    answer: "El **Módulo Uno** es **Lenguaje Lógico-Matemático**. Estudias fundamentos matemáticos, graficación, transformaciones, ecuaciones, funciones y razonamiento matemático. Es la preparación matemática para tu carrera científica. 📐🧮",
    category: "admision",
    keywords: ["modulo uno", "caiu"]
  },

  // ========================================
  // MÓDULO 2 - Habilidades Lingüísticas
  // ========================================
  {
    question: "que vere en el modulo 2",
    answer: "En el **Módulo II - Habilidades Lingüísticas** verás: 📖 Comprensión lectora, ✍️ Redacción de textos académico-científicos, 🗣️ Comunicación oral, y 📚 Competencia léxica. Te prepara para la comunicación universitaria efectiva. 📝",
    category: "admision",
    keywords: ["modulo 2", "modulo II", "modulo dos", "caiu", "linguistica"]
  },
  {
    question: "que veo en el modulo 2 del caiu",
    answer: "El **Módulo 2** del CAIU es **Habilidades Lingüísticas**. Estudias: 📖 Comprensión lectora, ✍️ Redacción académico-científica, 🗣️ Comunicación oral efectiva, y 📚 Competencia léxica. Fundamental para tu desempeño universitario. 📝",
    category: "admision",
    keywords: ["modulo 2", "caiu", "linguistica"]
  },
  {
    question: "modulo 2 caiu",
    answer: "**Módulo 2 - Habilidades Lingüísticas**: Cubre 📖 comprensión lectora, ✍️ redacción de textos académico-científicos, 🗣️ comunicación oral, y 📚 competencia léxica. Es el módulo de comunicación del CAIU. 📝",
    category: "admision",
    keywords: ["modulo 2", "caiu"]
  },
  {
    question: "modulo II caiu",
    answer: "**Módulo II - Habilidades Lingüísticas**: Incluye comprensión lectora, redacción académica, comunicación oral y desarrollo léxico. Te prepara para comunicarte efectivamente en el entorno universitario. 📖✍️",
    category: "admision",
    keywords: ["modulo II", "caiu"]
  },
  {
    question: "que temas tiene el modulo 2",
    answer: "El **Módulo 2** tiene: 📖 **Comprensión lectora**, ✍️ **Redacción de textos académico-científicos**, 🗣️ **Comunicación oral**, y 📚 **Competencia léxica**. Son habilidades fundamentales para la universidad. 📝",
    category: "admision",
    keywords: ["temas", "modulo 2", "caiu"]
  },
  {
    question: "modulo dos del caiu",
    answer: "El **Módulo Dos** es **Habilidades Lingüísticas**. Desarrollas comprensión lectora, redacción académica, comunicación oral y competencia léxica. Es tu preparación en comunicación para la vida universitaria. 📖📝",
    category: "admision",
    keywords: ["modulo dos", "caiu"]
  },

  // ========================================
  // MÓDULO 4 - Herramientas Tecnológicas
  // ========================================
  {
    question: "que vere en el modulo 4",
    answer: "En el **Módulo IV - Herramientas Tecnológicas** verás: 💻 Introducción a TIC (Tecnologías de Información y Comunicación), 📊 Herramientas ofimáticas y productivas, 🤝 Herramientas para aprendizaje colaborativo, y 🌐 Aprendizaje en entornos virtuales (Moodle). 🖥️",
    category: "admision",
    keywords: ["modulo 4", "modulo IV", "modulo cuatro", "caiu", "tecnologia"]
  },
  {
    question: "que veo en el modulo 4 del caiu",
    answer: "El **Módulo 4** del CAIU es **Herramientas Tecnológicas**. Estudias: 💻 TIC, 📊 Herramientas ofimáticas (Office), 🤝 Herramientas colaborativas, y 🌐 Plataformas virtuales como Moodle. Te prepara para el entorno tecnológico universitario. 🖥️",
    category: "admision",
    keywords: ["modulo 4", "caiu", "tecnologia"]
  },
  {
    question: "modulo 4 caiu",
    answer: "**Módulo 4 - Herramientas Tecnológicas**: Cubre 💻 introducción a TIC, 📊 herramientas ofimáticas y productivas, 🤝 herramientas para aprendizaje colaborativo, y 🌐 aprendizaje en entornos virtuales (Moodle). 🖥️",
    category: "admision",
    keywords: ["modulo 4", "caiu"]
  },
  {
    question: "modulo IV caiu",
    answer: "**Módulo IV - Herramientas Tecnológicas para el Entorno Universitario**: Incluye TIC, herramientas ofimáticas, herramientas colaborativas y plataformas virtuales. Es el módulo de tecnología del CAIU. 💻🌐",
    category: "admision",
    keywords: ["modulo IV", "caiu"]
  },
  {
    question: "que temas tiene el modulo 4",
    answer: "El **Módulo 4** tiene: 💻 **TIC** (Tecnologías de Información), 📊 **Herramientas ofimáticas** (Office), 🤝 **Herramientas colaborativas**, y 🌐 **Entornos virtuales** (Moodle). Son herramientas esenciales para la universidad. 🖥️",
    category: "admision",
    keywords: ["temas", "modulo 4", "caiu"]
  },
  {
    question: "modulo cuatro del caiu",
    answer: "El **Módulo Cuatro** es **Herramientas Tecnológicas**. Aprendes TIC, herramientas ofimáticas, herramientas colaborativas y plataformas virtuales como Moodle. Es tu preparación tecnológica para la universidad. 💻🌐",
    category: "admision",
    keywords: ["modulo cuatro", "caiu"]
  },

  // Preguntas adicionales sobre módulos específicos
  {
    question: "de que trata el modulo 1 del caiu",
    answer: "El **Módulo 1** trata sobre **Lenguaje Lógico-Matemático**. Aprendes fundamentos matemáticos, graficación, transformaciones, ecuaciones, funciones y razonamiento matemático. Es la base matemática para tu carrera científica. 📐🧮",
    category: "admision",
    keywords: ["de que trata", "modulo 1", "caiu"]
  },
  {
    question: "de que trata el modulo 2 del caiu",
    answer: "El **Módulo 2** trata sobre **Habilidades Lingüísticas**. Desarrollas comprensión lectora, redacción académica, comunicación oral y competencia léxica. Es fundamental para tu comunicación universitaria. 📖✍️",
    category: "admision",
    keywords: ["de que trata", "modulo 2", "caiu"]
  },
  {
    question: "de que trata el modulo 4 del caiu",
    answer: "El **Módulo 4** trata sobre **Herramientas Tecnológicas para el Entorno Universitario**. Aprendes TIC, herramientas ofimáticas, herramientas colaborativas y plataformas virtuales. Es tu preparación tecnológica. 💻🌐",
    category: "admision",
    keywords: ["de que trata", "modulo 4", "caiu"]
  },
  {
    question: "que aprendo en el modulo 1",
    answer: "En el **Módulo 1** aprendes: 📐 **Lenguaje matemático** y graficación, 📊 **Transformaciones** con curvas, 🔢 **Ecuaciones y funciones**, y ➕ **Razonamiento matemático** avanzado. Son las matemáticas fundamentales para tu carrera. 🧮",
    category: "admision",
    keywords: ["aprendo", "modulo 1", "caiu"]
  },
  {
    question: "que aprendo en el modulo 2",
    answer: "En el **Módulo 2** aprendes: 📖 **Comprensión lectora** efectiva, ✍️ **Redacción** académico-científica, 🗣️ **Comunicación oral** profesional, y 📚 **Competencia léxica**. Son habilidades de comunicación esenciales. 📝",
    category: "admision",
    keywords: ["aprendo", "modulo 2", "caiu"]
  },
  {
    question: "que aprendo en el modulo 4",
    answer: "En el **Módulo 4** aprendes: 💻 **TIC** (uso de tecnologías), 📊 **Herramientas ofimáticas** (Office), 🤝 **Herramientas colaborativas**, y 🌐 **Plataformas virtuales** (Moodle). Son herramientas tecnológicas para la universidad. 🖥️",
    category: "admision",
    keywords: ["aprendo", "modulo 4", "caiu"]
  }
];

console.log(`\n📝 Agregando ${allModulesVariationsFAQs.length} variaciones para los 4 módulos...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = allModulesVariationsFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = allModulesVariationsFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'all-caiu-modules-variations',
    added_at: new Date().toISOString(),
    type: 'query-variations',
    modules: 'I-II-III-IV'
  },
  embedding: embeddings[idx],
  created_by: 'add-all-caiu-modules-variations',
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

console.log(`✅ ${data.length} variaciones para los 4 módulos agregadas!\n`);
console.log('📊 Resumen:');
console.log('   - Módulo 1/I: 6 variaciones');
console.log('   - Módulo 2/II: 6 variaciones');
console.log('   - Módulo 3/III: Ya agregado (10 variaciones)');
console.log('   - Módulo 4/IV: 6 variaciones');
console.log('   - Preguntas adicionales: 6\n');
console.log('✨ El bot ahora detectará preguntas sobre cualquier módulo!\n');
