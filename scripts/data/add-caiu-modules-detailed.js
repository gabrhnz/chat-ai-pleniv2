#!/usr/bin/env node

/**
 * Add CAIU Modules Detailed FAQs
 * 
 * Agrega FAQs detalladas sobre los temas de cada módulo del CAIU
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

console.log('📚 AGREGANDO FAQs DETALLADAS SOBRE MÓDULOS DEL CAIU\n');
console.log('=' .repeat(70));

const caiuModulesFAQs = [
  // Pregunta general sobre todos los módulos
  {
    question: "que temas van a ver en cada materia del caiu",
    answer: "El **CAIU** tiene 4 módulos: 🔢 **Módulo I - Lenguaje Lógico-Matemático** (ecuaciones, funciones, graficación), 📖 **Módulo II - Habilidades Lingüísticas** (comprensión lectora, redacción científica), 🤔 **Módulo III - Filosofía y Metodología** (epistemología, pensamiento crítico), 💻 **Módulo IV - Herramientas Tecnológicas** (TIC, ofimática, Moodle). 📚",
    category: "admision",
    keywords: ["temas", "materias", "caiu", "modulos", "contenido"]
  },

  // Módulo I - Lenguaje Lógico-Matemático
  {
    question: "que veo en lenguaje logico matematico del caiu",
    answer: "En **Lenguaje Lógico-Matemático** ves: 📐 Fundamentos del lenguaje matemático y graficación, 📊 Operaciones y transformaciones con curvas, 🔢 Análisis y resolución de ecuaciones y funciones, y ➕ Aplicaciones prácticas con razonamiento matemático avanzado. 🧮",
    category: "admision",
    keywords: ["lenguaje logico matematico", "caiu", "matematicas", "modulo 1"]
  },
  {
    question: "que temas de matematicas veo en el caiu",
    answer: "En el **CAIU** ves: 📐 Lenguaje matemático y graficación, 📊 Operaciones con curvas y transformaciones, 🔢 Ecuaciones y funciones (análisis y resolución), y ➕ Razonamiento matemático avanzado con aplicaciones prácticas. Es el Módulo I. 🧮",
    category: "admision",
    keywords: ["matematicas", "caiu", "temas"]
  },

  // Módulo II - Habilidades Lingüísticas
  {
    question: "que veo en habilidades linguisticas del caiu",
    answer: "En **Habilidades Lingüísticas** ves: 📖 Comprensión lectora, ✍️ Redacción de textos académico-científicos, 🗣️ Comunicación oral, y 📚 Competencia léxica. Te prepara para la comunicación universitaria efectiva. 📝",
    category: "admision",
    keywords: ["habilidades linguisticas", "caiu", "linguistica", "modulo 2"]
  },
  {
    question: "que es linguistica en el caiu",
    answer: "**Lingüística** en el CAIU (Módulo II - Habilidades Lingüísticas) cubre: 📖 Comprensión lectora, ✍️ Redacción académico-científica, 🗣️ Comunicación oral efectiva, y 📚 Desarrollo de competencia léxica. Fundamental para tu desempeño universitario. 📝",
    category: "admision",
    keywords: ["linguistica", "caiu", "que es"]
  },

  // Módulo III - Filosofía y Metodología
  {
    question: "que veo en filosofia del caiu",
    answer: "En **Filosofía de las Ciencias y Metodología** ves: 🤔 Epistemología y descolonización, 🔬 Validez y límites del conocimiento científico, 📋 Causas aristotélicas y formulación de preguntas de investigación, y 💡 Pensamiento crítico hacia una ciencia ética para la liberación. 🧠",
    category: "admision",
    keywords: ["filosofia", "caiu", "modulo 3"]
  },
  {
    question: "que temas de filosofia veo en el caiu",
    answer: "En **Filosofía** (Módulo III) estudias: 🤔 Epistemología y descolonización del conocimiento, 🔬 Validez y límites de la ciencia, 📋 Causas aristotélicas y metodología de investigación, y 💡 Pensamiento crítico para una ciencia ética. Es filosofía aplicada a las ciencias. 🧠",
    category: "admision",
    keywords: ["filosofia", "temas", "caiu"]
  },
  {
    question: "que es epistemologia en el caiu",
    answer: "**Epistemología** en el CAIU es el estudio de la **validez y límites del conocimiento científico**. Aprendes sobre cómo se construye el conocimiento, descolonización del pensamiento científico, y pensamiento crítico. Es parte del Módulo III - Filosofía. 🤔🔬",
    category: "admision",
    keywords: ["epistemologia", "caiu", "filosofia"]
  },

  // Módulo IV - Herramientas Tecnológicas
  {
    question: "que veo en herramientas tecnologicas del caiu",
    answer: "En **Herramientas Tecnológicas** ves: 💻 Introducción a TIC (Tecnologías de Información y Comunicación), 📊 Herramientas ofimáticas y productivas, 🤝 Herramientas para aprendizaje colaborativo, y 🌐 Aprendizaje en entornos virtuales (incluyendo Moodle). 🖥️",
    category: "admision",
    keywords: ["herramientas tecnologicas", "caiu", "modulo 4", "tecnologia"]
  },
  {
    question: "que es moodle en el caiu",
    answer: "**Moodle** es una plataforma de **aprendizaje virtual** que estudias en el Módulo IV del CAIU. Aprendes a usarla para acceder a contenidos, entregar tareas, participar en foros y gestionar tu aprendizaje en línea. Es fundamental para la vida universitaria. 🌐📚",
    category: "admision",
    keywords: ["moodle", "caiu", "plataforma"]
  },
  {
    question: "que herramientas ofimaticas veo en el caiu",
    answer: "En el **CAIU** (Módulo IV) aprendes herramientas ofimáticas como: 📝 Procesadores de texto, 📊 Hojas de cálculo, 📽️ Presentaciones, y 🤝 Herramientas colaborativas. También ves herramientas productivas para tu desempeño académico. 💻",
    category: "admision",
    keywords: ["herramientas ofimaticas", "caiu", "office"]
  },

  // Preguntas sobre estructura general
  {
    question: "cuantos modulos tiene el caiu",
    answer: "El **CAIU** tiene **4 módulos**: Módulo I (Lenguaje Lógico-Matemático), Módulo II (Habilidades Lingüísticas), Módulo III (Filosofía y Metodología), y Módulo IV (Herramientas Tecnológicas). Todos son obligatorios durante las 12 semanas. 📚",
    category: "admision",
    keywords: ["cuantos modulos", "caiu", "estructura"]
  },
  {
    question: "como esta estructurado el caiu",
    answer: "El **CAIU** está estructurado en **4 módulos** que cursas durante **12 semanas**: 🔢 Lenguaje Lógico-Matemático, 📖 Habilidades Lingüísticas, 🤔 Filosofía y Metodología de Investigación, y 💻 Herramientas Tecnológicas. Debes aprobar todos con mínimo 14/20. ✅",
    category: "admision",
    keywords: ["estructura", "caiu", "organizacion"]
  },

  // Preguntas específicas sobre contenidos
  {
    question: "veo ecuaciones en el caiu",
    answer: "Sí, en el **Módulo I - Lenguaje Lógico-Matemático** ves **análisis y resolución de ecuaciones y funciones**. También estudias graficación, transformaciones con curvas y razonamiento matemático avanzado. 🔢📐",
    category: "admision",
    keywords: ["ecuaciones", "caiu", "matematicas"]
  },
  {
    question: "veo redaccion en el caiu",
    answer: "Sí, en el **Módulo II - Habilidades Lingüísticas** aprendes **redacción de textos académico-científicos**. También desarrollas comprensión lectora, comunicación oral y competencia léxica. Fundamental para la universidad. ✍️📚",
    category: "admision",
    keywords: ["redaccion", "caiu", "escritura"]
  },
  {
    question: "veo metodologia de investigacion en el caiu",
    answer: "Sí, en el **Módulo III - Filosofía y Metodología** estudias **metodología de la investigación**: formulación de preguntas de investigación, causas aristotélicas, epistemología, y pensamiento crítico aplicado a la ciencia. 🔬📋",
    category: "admision",
    keywords: ["metodologia investigacion", "caiu", "investigacion"]
  },
  {
    question: "que aprendo de tecnologia en el caiu",
    answer: "En el **Módulo IV** aprendes: 💻 TIC (Tecnologías de Información), 📊 Herramientas ofimáticas (Office), 🤝 Herramientas colaborativas, y 🌐 Plataformas virtuales como Moodle. Te prepara para el entorno tecnológico universitario. 🖥️",
    category: "admision",
    keywords: ["tecnologia", "caiu", "aprendo"]
  }
];

console.log(`\n📝 Agregando ${caiuModulesFAQs.length} FAQs sobre módulos del CAIU...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = caiuModulesFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = caiuModulesFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'caiu-modules-detailed',
    added_at: new Date().toISOString(),
    type: 'caiu-curriculum',
    modules_covered: 'all-4-modules'
  },
  embedding: embeddings[idx],
  created_by: 'add-caiu-modules-detailed',
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
console.log('📊 Resumen:');
console.log('   - Módulo I: Lenguaje Lógico-Matemático');
console.log('   - Módulo II: Habilidades Lingüísticas');
console.log('   - Módulo III: Filosofía y Metodología');
console.log('   - Módulo IV: Herramientas Tecnológicas\n');
console.log('✨ El bot ahora puede responder en detalle sobre cada módulo del CAIU!\n');
