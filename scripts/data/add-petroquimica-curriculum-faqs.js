#!/usr/bin/env node

/**
 * Add Petroquímica Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Ingeniería en Petroquímica
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

const petroquimicaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene petroquimica",
    answer: "La carrera tiene **186 UC** (Unidades de Crédito) en total, distribuidas en **8 semestres**. ⚗️🛢️",
    category: "carreras",
    keywords: ["UC", "unidades credito", "petroquimica", "petroquímica"]
  },
  {
    question: "que materias tiene petroquimica",
    answer: "Tiene materias como: **Termodinámica**, **Procesos Químicos**, **Operaciones Unitarias**, **Control de Procesos**, **Petroquímica Aplicada**, **Diseño de Equipos Industriales**, **Seguridad Industrial**, **Gestión Ambiental**, **Química Orgánica**, y más. ⚗️🏭",
    category: "carreras",
    keywords: ["materias", "asignaturas", "petroquimica", "petroquímica"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de petroquimica",
    answer: "En **Semestre I** (22 UC) ves: **Química General**, **Matemática I**, Bioética, Pensamiento Crítico, **Introducción a la Ingeniería Petroquímica**. La base fundamental. ⚗️📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "petroquimica", "petroquímica"]
  },
  {
    question: "hay mucha quimica en petroquimica",
    answer: "Sí, mucha. Empiezas con **Química General**, luego **Química Orgánica**, **Química Analítica**, **Química Industrial**, y química aplicada en varias materias. Es fundamental. ⚗️🧪",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "petroquimica"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de petroquimica",
    answer: "En **Semestre II** (26 UC) ves: **Física I**, **Matemática II**, **Química Orgánica**, **Biología Celular**, **Estadística**, **Metodología de Investigación**. 🔬📐",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "petroquimica", "petroquímica"]
  },
  {
    question: "hay biologia en petroquimica",
    answer: "Sí, **Biología Celular** en **Semestre II**. Útil para entender procesos biológicos en la industria química. 🦠🔬",
    category: "carreras",
    keywords: ["biologia", "biología", "petroquimica"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de petroquimica",
    answer: "En **Semestre III** ves: **Física II**, **Ciencia de los Materiales I**, **Química Analítica**, **Seminario I**, **Inglés I aplicado a Petroquímica**. 🔬⚗️",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "petroquimica", "petroquímica"]
  },
  {
    question: "que es quimica analitica",
    answer: "**Química Analítica** enseña técnicas para analizar composición química de sustancias: cromatografía, espectroscopía, titulación. En Semestre III. 🧪🔬",
    category: "carreras",
    keywords: ["quimica analitica", "analítica", "petroquimica"]
  },
  {
    question: "hay ingles en petroquimica",
    answer: "Sí, **Inglés I aplicado a Petroquímica** en Semestre III. Esencial porque la industria petrolera es internacional. 🇬🇧🛢️",
    category: "carreras",
    keywords: ["ingles", "inglés", "petroquimica"]
  },
  {
    question: "veo ciencia de materiales",
    answer: "Sí, **Ciencia de los Materiales I** en Semestre III. Aprendes sobre materiales usados en la industria: metales, polímeros, cerámicos. 🔧⚗️",
    category: "carreras",
    keywords: ["ciencia materiales", "petroquimica"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de petroquimica",
    answer: "En **Semestre IV** ves: **Termodinámica**, **Procesos Químicos**, **Diseño de Equipos Industriales**, **Seguridad Industrial**, **Laboratorio de Química Industrial**. Más aplicado. 🏭⚗️",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "petroquimica", "petroquímica"]
  },
  {
    question: "que es termodinamica",
    answer: "**Termodinámica** estudia energía, calor, trabajo en procesos químicos. Fundamental para diseñar procesos eficientes. En Semestre IV. 🔥⚡",
    category: "carreras",
    keywords: ["termodinamica", "termodinámica", "petroquimica"]
  },
  {
    question: "que son procesos quimicos",
    answer: "**Procesos Químicos** enseña cómo transformar materias primas en productos: refinación, polimerización, síntesis. En Semestre IV. ⚗️🏭",
    category: "carreras",
    keywords: ["procesos quimicos", "químicos", "petroquimica"]
  },
  {
    question: "veo diseño de equipos industriales",
    answer: "Sí, **Diseño de Equipos Industriales** en Semestre IV. Aprendes a diseñar reactores, columnas de destilación, intercambiadores de calor. 🏭🔧",
    category: "carreras",
    keywords: ["diseño equipos", "industriales", "petroquimica"]
  },
  {
    question: "veo seguridad industrial",
    answer: "Sí, **Seguridad Industrial** en Semestre IV. Fundamental para trabajar seguro en plantas químicas y petroleras. 🦺⚠️",
    category: "carreras",
    keywords: ["seguridad industrial", "petroquimica"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de petroquimica",
    answer: "En **Semestres V-VIII** ves: **Operaciones Unitarias**, **Control de Procesos**, **Petroquímica Aplicada**, **Gestión Ambiental**, **Seminarios**, **Pasantías**, **Proyecto Final**. 🚀🏭",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "petroquimica", "petroquímica"]
  },
  {
    question: "que son operaciones unitarias",
    answer: "**Operaciones Unitarias** son procesos básicos de la industria química: destilación, absorción, extracción, cristalización, filtración. En semestres avanzados. ⚗️🏭",
    category: "carreras",
    keywords: ["operaciones unitarias", "petroquimica"]
  },
  {
    question: "que es control de procesos",
    answer: "**Control de Procesos** enseña a automatizar y controlar plantas químicas: sensores, controladores, sistemas SCADA. En semestres avanzados. 🎮🏭",
    category: "carreras",
    keywords: ["control procesos", "petroquimica"]
  },
  {
    question: "que es petroquimica aplicada",
    answer: "**Petroquímica Aplicada** profundiza en producción de plásticos, polímeros, productos derivados del petróleo. En semestres finales. 🛢️⚗️",
    category: "carreras",
    keywords: ["petroquimica aplicada", "petroquímica", "que es"]
  },
  {
    question: "veo gestion ambiental",
    answer: "Sí, **Gestión Ambiental** en semestres avanzados. Importante para minimizar impacto ambiental de procesos químicos. 🌱♻️",
    category: "carreras",
    keywords: ["gestion ambiental", "gestión", "petroquimica"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en petroquimica",
    answer: "Sí, **Laboratorio de Química Industrial** en Semestre IV y otros labs en semestres avanzados. Muy práctico. 🔬⚗️",
    category: "carreras",
    keywords: ["laboratorios", "labs", "petroquimica"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en petroquimica",
    answer: "Sí, hay **Pasantías** en semestres avanzados donde trabajas en refinerías, plantas petroquímicas, empresas químicas. Experiencia real. 💼🏭",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "petroquimica"]
  },
  {
    question: "donde hago pasantias en petroquimica",
    answer: "Puedes hacer pasantías en **PDVSA**, **refinerías**, **plantas petroquímicas**, **empresas de polímeros**, **industria química**. 🛢️💼",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "petroquimica"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en petroquimica",
    answer: "Sí, hay **Proyecto Final** donde desarrollas o optimizas un proceso químico, diseñas una planta, o investigas nuevos materiales. 🎓⚗️",
    category: "carreras",
    keywords: ["tesis", "proyecto grado", "petroquimica"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en petroquimica",
    answer: "Los **Seminarios** son espacios para presentar proyectos, discutir tecnologías de la industria, preparar tu trabajo de grado. 🎤🏭",
    category: "carreras",
    keywords: ["seminarios", "petroquimica"]
  },

  // MATEMÁTICAS Y FÍSICA
  {
    question: "cuanta matematica tiene petroquimica",
    answer: "Bastante. Tiene **Matemática I y II**, **Estadística**, más matemáticas aplicadas en termodinámica y diseño. Es importante. 📐🔢",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "petroquimica"]
  },
  {
    question: "cuanta fisica tiene petroquimica",
    answer: "Tiene **Física I y II**. Necesaria para entender procesos, transferencia de calor, mecánica de fluidos. ⚛️📐",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "petroquimica"]
  },
  {
    question: "hay estadistica en petroquimica",
    answer: "Sí, **Estadística** en **Semestre II**. Útil para análisis de datos, control de calidad, optimización de procesos. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "petroquimica"]
  },

  // PROGRAMACIÓN
  {
    question: "hay programacion en petroquimica",
    answer: "Sí, algo de programación para simulación de procesos, control automatizado, análisis de datos. No es el foco principal pero es útil. 💻⚗️",
    category: "carreras",
    keywords: ["programacion", "programación", "petroquimica"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de petroquimica",
    answer: "Es exigente con mucha química, matemáticas y física, pero si te gusta la industria química y petrolera, es manejable. 💪⚗️",
    category: "carreras",
    keywords: ["pesada", "dificil", "petroquimica"]
  },
  {
    question: "cuantas materias por semestre en petroquimica",
    answer: "Varía entre **5-6 materias** por semestre, dependiendo de las UC y laboratorios. 📚⚗️",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "petroquimica"]
  },

  // ÁREAS ESPECÍFICAS
  {
    question: "veo refinacion de petroleo",
    answer: "Sí, estudias **refinación de petróleo** en Procesos Químicos y Petroquímica Aplicada. Cómo se procesa el crudo. 🛢️⚗️",
    category: "carreras",
    keywords: ["refinacion", "refinación", "petroleo", "petroquimica"]
  },
  {
    question: "veo produccion de plasticos",
    answer: "Sí, estudias **producción de plásticos y polímeros** en Petroquímica Aplicada. Cómo se fabrican desde petróleo. ♻️⚗️",
    category: "carreras",
    keywords: ["plasticos", "plásticos", "polimeros", "petroquimica"]
  },
  {
    question: "trabajo con petroleo",
    answer: "Sí, trabajas con **petróleo y sus derivados**: refinación, producción de combustibles, petroquímicos, polímeros. 🛢️⚗️",
    category: "carreras",
    keywords: ["trabajo petroleo", "petróleo", "petroquimica"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre petroquimica e ingenieria quimica",
    answer: "**Petroquímica** se especializa en petróleo y derivados. **Ingeniería Química** es más general (alimentos, farmacéutica, etc). Petroquímica es más específica. 🛢️⚗️",
    category: "carreras",
    keywords: ["diferencia", "petroquimica", "ingenieria quimica"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber quimica antes de petroquimica",
    answer: "No necesitas ser experto, pero ayuda tener base de química de bachillerato. Te enseñan desde Química General. ⚗️📚",
    category: "carreras",
    keywords: ["necesito saber quimica", "antes", "petroquimica"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en pdvsa con petroquimica",
    answer: "Sí, puedes trabajar en **PDVSA** en refinerías, plantas petroquímicas, investigación, optimización de procesos. 🛢️💼",
    category: "carreras",
    keywords: ["trabajo pdvsa", "PDVSA", "petroquimica"]
  },
  {
    question: "trabajo en refinerias",
    answer: "Sí, puedes trabajar en **refinerías** diseñando, operando u optimizando procesos de refinación. 🏭🛢️",
    category: "carreras",
    keywords: ["trabajo refinerias", "refinerías", "petroquimica"]
  },
  {
    question: "puedo trabajar en empresas internacionales",
    answer: "Sí, puedes trabajar en **Shell**, **ExxonMobil**, **Chevron**, **BP**, y otras multinacionales petroleras y químicas. 🌍💼",
    category: "carreras",
    keywords: ["empresas internacionales", "multinacionales", "petroquimica"]
  },

  // SOSTENIBILIDAD
  {
    question: "veo energias renovables en petroquimica",
    answer: "Sí, en Gestión Ambiental y materias avanzadas ves **biocombustibles**, **energías alternativas**, **procesos sostenibles**. La industria está cambiando. 🌱⚡",
    category: "carreras",
    keywords: ["energias renovables", "sostenibilidad", "petroquimica"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de petroquimica",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **186 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "petroquimica"]
  },
  {
    question: "donde consigo el pensum de petroquimica",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "petroquimica"]
  }
];

async function addPetroquimicaFAQs() {
  console.log('⚗️ Adding Petroquímica Curriculum FAQs\n');
  console.log(`📋 Found ${petroquimicaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = petroquimicaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = petroquimicaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-petroquimica',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Ingeniería en Petroquímica'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-petroquimica',
    is_active: true,
  }));
  
  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Added ${data.length} Petroquímica curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (4 FAQs)');
  console.log('   - Semestre IV (5 FAQs)');
  console.log('   - Semestres avanzados (5 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y física (3 FAQs)');
  console.log('   - Programación (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas específicas (3 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Áreas de trabajo (3 FAQs)');
  console.log('   - Sostenibilidad (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 43 FAQs sobre malla curricular de Petroquímica!\n');
}

addPetroquimicaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
