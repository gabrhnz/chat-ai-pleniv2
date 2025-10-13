#!/usr/bin/env node

/**
 * Add Física Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Física
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

const fisicaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "que materias tiene fisica",
    answer: "Tiene materias como: **Mecánica Clásica**, **Mecánica Cuántica**, **Física del Estado Sólido**, **Astrofísica**, **Relatividad General**, **Biofísica**, **Geofísica**, **Física Médica**, **Teoría de Cuerdas**, **Física de Altas Energías**. ⚛️🌌",
    category: "carreras",
    keywords: ["materias", "asignaturas", "fisica"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de fisica",
    answer: "En **Semestre I** (23 UC) ves: **Matemática I**, **Introducción a la Física**, Bioética, Pensamiento Crítico, **Química General**. La base fundamental. ⚛️📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "fisica"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de fisica",
    answer: "En **Semestre II** (27 UC) ves: **Matemática II**, **Física I**, **Programación**, Educación Física, **Biología General**, **Laboratorio de Química Integrada**. Más experimental. 🔬⚛️",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "fisica"]
  },
  {
    question: "hay programacion en fisica",
    answer: "Sí, **Programación** en **Semestre II**. Útil para simulaciones físicas y análisis de datos experimentales. 💻⚛️",
    category: "carreras",
    keywords: ["programacion", "programación", "fisica"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de fisica",
    answer: "En **Semestre III** (25 UC) ves: **Matemática III**, **Física Computacional**, **Física II**, Metodología de Investigación, **Seminario I**, **Protección Radiológica**. Más avanzado. 💻⚛️",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "fisica"]
  },
  {
    question: "que es fisica computacional",
    answer: "**Física Computacional** usa computadoras para resolver problemas físicos complejos: simulaciones, modelado numérico. En Semestre III. 💻⚛️",
    category: "carreras",
    keywords: ["fisica computacional", "que es", "fisica"]
  },
  {
    question: "cuando veo proteccion radiologica en fisica",
    answer: "**Protección Radiológica** la ves en el **Semestre III**. Aprendes seguridad con radiaciones, dosimetría, normas de protección. 🛡️☢️",
    category: "carreras",
    keywords: ["proteccion radiologica", "cuando", "fisica"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de fisica",
    answer: "En **Semestre IV** (18 UC) ves: **Métodos Matemáticos II**, **Física III**, **Instrumentación y Electrónica**, Electiva. Especialización técnica. ⚛️🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "fisica"]
  },
  {
    question: "que es instrumentacion y electronica",
    answer: "**Instrumentación y Electrónica** diseña y construye equipos científicos: detectores, amplificadores, sistemas de medición. En Semestre IV. 🔬⚡",
    category: "carreras",
    keywords: ["instrumentacion electronica", "que es", "fisica"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de fisica",
    answer: "En **Semestre V** (34 UC) ves: **Pasantía I**, **Mecánica Cuántica**, **Mecánica Clásica**, **Física del Estado Sólido**, Proyecto Sociotecnológico, Seminario de Trabajo Final, Electiva. Investigación aplicada. 🚀⚛️",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "fisica"]
  },
  {
    question: "cuando veo mecanica cuantica",
    answer: "**Mecánica Cuántica** la ves en el **Semestre V**. Es la base de la física moderna, explica el mundo subatómico. ⚛️🔬",
    category: "carreras",
    keywords: ["mecanica cuantica", "cuando", "fisica"]
  },
  {
    question: "que es fisica del estado solido",
    answer: "**Física del Estado Sólido** estudia propiedades físicas de sólidos: cristales, semiconductores, superconductores. En Semestre V. 🔬💎",
    category: "carreras",
    keywords: ["fisica estado solido", "que es", "fisica"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de fisica",
    answer: "En **Semestres VI-VIII** ves: **Astrofísica**, **Relatividad General**, **Física de Altas Energías**, **Biofísica**, **Geofísica**, **Física Médica**, **Teoría de Cuerdas**, **Pasantías**, **Trabajo Final de Grado**. 🚀🌌",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "fisica"]
  },
  {
    question: "que es astrofisica",
    answer: "**Astrofísica** aplica física a estudio del universo: estrellas, galaxias, cosmología, agujeros negros. En semestres avanzados. 🌌⭐",
    category: "carreras",
    keywords: ["astrofisica", "que es", "fisica"]
  },
  {
    question: "veo relatividad general",
    answer: "Sí, **Relatividad General** en semestres avanzados. Teoría de Einstein sobre gravedad, espacio-tiempo, agujeros negros. ⚛️🌌",
    category: "carreras",
    keywords: ["relatividad general", "fisica"]
  },
  {
    question: "que es fisica de altas energias",
    answer: "**Física de Altas Energías** estudia partículas elementales con aceleradores: LHC, colisionadores, física nuclear avanzada. En semestres avanzados. ⚛️🔬",
    category: "carreras",
    keywords: ["fisica altas energias", "que es", "fisica"]
  },
  {
    question: "veo biofisica",
    answer: "Sí, **Biofísica** en semestres avanzados. Aplica física a sistemas biológicos: dinámica molecular, bioelectricidad, resonancia magnética. 🧬⚛️",
    category: "carreras",
    keywords: ["biofisica", "fisica"]
  },
  {
    question: "veo geofisica",
    answer: "Sí, **Geofísica** en semestres avanzados. Estudia física de la Tierra: terremotos, magnetismo terrestre, exploración sísmica. 🌍⚛️",
    category: "carreras",
    keywords: ["geofisica", "fisica"]
  },
  {
    question: "que es teoria de cuerdas",
    answer: "**Teoría de Cuerdas** es teoría unificada fundamental que intenta reconciliar mecánica cuántica con relatividad general. Física teórica avanzada. ⚛️🎸",
    category: "carreras",
    keywords: ["teoria cuerdas", "que es", "fisica"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en fisica",
    answer: "Sí, **Laboratorio de Química Integrada** y laboratorios especializados en física experimental, instrumentación, computacional. 🔬⚛️",
    category: "carreras",
    keywords: ["laboratorios", "labs", "fisica"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en fisica",
    answer: "Sí, **Pasantía I** en Semestre V y más pasantías en semestres avanzados. Trabajas en laboratorios de investigación, centros científicos, universidades. 💼⚛️",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "fisica"]
  },
  {
    question: "donde hago pasantias en fisica",
    answer: "Puedes hacer pasantías en **IVIC**, **observatorios astronómicos**, **centros de investigación**, **universidades**, **empresas tecnológicas**, **hospitales** (física médica). 🔭⚛️",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "fisica"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en fisica",
    answer: "Sí, hay **Trabajo Final de Grado** donde desarrollas investigación original en física aplicada o teórica. 🎓⚛️",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "fisica"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en fisica",
    answer: "Sí, hay **Electivas** en Semestre IV y V donde puedes especializarte en astrofísica, física médica, física computacional, etc. 🎯⚛️",
    category: "carreras",
    keywords: ["electivas", "optativas", "fisica"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en fisica",
    answer: "Los **Seminarios** (I, Trabajo Final de Grado) discuten avances científicos, metodologías de investigación, ética en ciencia. 🎤⚛️",
    category: "carreras",
    keywords: ["seminarios", "fisica"]
  },

  // MATEMÁTICAS
  {
    question: "cuanta matematica tiene fisica",
    answer: "Mucha. Tiene **Matemática I, II, III**, **Métodos Matemáticos II**, cálculo, álgebra, ecuaciones diferenciales. Esencial para física. 📐⚛️",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "fisica"]
  },

  // FÍSICA
  {
    question: "cuanta fisica tiene fisica",
    answer: "Es la base de todo. Tiene **Física I, II, III**, física computacional, mecánica clásica, cuántica, estado sólido, astrofísica, etc. Todo es física. ⚛️🔬",
    category: "carreras",
    keywords: ["fisica", "cuanta", "fisica"]
  },

  // PROGRAMACIÓN
  {
    question: "hay programacion en fisica",
    answer: "Sí, **Programación** en Semestre II y física computacional en Semestre III. Para simulaciones y análisis de datos. 💻⚛️",
    category: "carreras",
    keywords: ["programacion", "programación", "fisica"]
  },

  // QUÍMICA Y BIOLOGÍA
  {
    question: "hay quimica en fisica",
    answer: "Sí, **Química General** y **Laboratorio de Química Integrada** en primeros semestres. Base para entender materia. ⚗️⚛️",
    category: "carreras",
    keywords: ["quimica", "química", "fisica"]
  },
  {
    question: "hay biologia en fisica",
    answer: "Sí, **Biología General** en Semestre II. Útil para biofísica y física médica. 🧬⚛️",
    category: "carreras",
    keywords: ["biologia", "biología", "fisica"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de fisica",
    answer: "Es exigente con mucha matemática y física teórica, pero si te apasiona entender el universo, es fascinante. Es más conceptual que experimental. 💪⚛️",
    category: "carreras",
    keywords: ["pesada", "dificil", "fisica"]
  },
  {
    question: "cuantas materias por semestre en fisica",
    answer: "Varía entre **5-7 materias** por semestre, con mucho contenido matemático y teórico. 📚⚛️",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "fisica"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en investigacion con fisica",
    answer: "Sí, puedes trabajar en **investigación científica** en universidades, centros como IVIC, CERN, NASA, investigación fundamental. 🔬⚛️",
    category: "carreras",
    keywords: ["trabajo investigacion", "investigación", "fisica"]
  },
  {
    question: "trabajo en tecnologia con fisica",
    answer: "Sí, puedes trabajar en **tecnología** desarrollando sensores, instrumentos científicos, física aplicada en ingeniería. 💼⚡",
    category: "carreras",
    keywords: ["trabajo tecnologia", "tecnología", "fisica"]
  },
  {
    question: "trabajo en medicina con fisica",
    answer: "Sí, puedes trabajar en **medicina** con física médica: radioterapia, diagnóstico por imagen, medicina nuclear, biomagnetismo. 🏥⚛️",
    category: "carreras",
    keywords: ["trabajo medicina", "fisica"]
  },
  {
    question: "puedo trabajar en astronomia",
    answer: "Sí, puedes trabajar en **astronomía** en observatorios, investigación astrofísica, cosmología, planetología. 🔭🌌",
    category: "carreras",
    keywords: ["trabajo astronomia", "astronomía", "fisica"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre fisica y fisica nuclear",
    answer: "**Física** es general (todas las leyes físicas). **Física Nuclear** se especializa en núcleo atómico, radiaciones, reactores. Física es más amplia. ⚛️🔬 vs ⚛️☢️",
    category: "carreras",
    keywords: ["diferencia", "fisica", "fisica nuclear"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito ser bueno en matematicas para fisica",
    answer: "Sí, definitivamente. La física requiere matemática avanzada: cálculo, álgebra, ecuaciones diferenciales. Es la herramienta principal. 📐⚛️",
    category: "carreras",
    keywords: ["bueno matematicas", "matemáticas", "fisica"]
  },

  // PROYECTO SOCIOTECNOLÓGICO
  {
    question: "hay proyecto sociotecnologico en fisica",
    answer: "Sí, **Proyecto Sociotecnológico e Innovador** en Semestre V. Aplicas física a problemas sociales: energía sostenible, tecnología médica, etc. 🤝⚛️",
    category: "carreras",
    keywords: ["proyecto sociotecnologico", "sociotecnológico", "fisica"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de fisica",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres** con especializaciones avanzadas. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "fisica"]
  },
  {
    question: "donde consigo el pensum de fisica",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades: astrofísica, física médica, geofísica. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "fisica"]
  }
];

async function addFisicaFAQs() {
  console.log('⚛️ Adding Física Curriculum FAQs\n');
  console.log(`📋 Found ${fisicaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = fisicaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = fisicaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-fisica',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Física'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-fisica',
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
  
  console.log(`✅ Added ${data.length} Física curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (1 FAQ)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestre V (3 FAQs)');
  console.log('   - Semestres avanzados (7 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas (1 FAQ)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (1 FAQ)');
  console.log('   - Química y biología (2 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Proyecto sociotecnológico (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Física!\n');
}

addFisicaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
