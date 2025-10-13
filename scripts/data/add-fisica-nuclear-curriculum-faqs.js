#!/usr/bin/env node

/**
 * Add Física Nuclear Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Física Nuclear
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

const fisicaNuclearFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene fisica nuclear",
    answer: "La carrera tiene **187 UC** aproximadamente, distribuidas en **8 semestres**. ⚛️☢️",
    category: "carreras",
    keywords: ["UC", "unidades credito", "fisica nuclear"]
  },
  {
    question: "que materias tiene fisica nuclear",
    answer: "Tiene materias como: **Física Nuclear**, **Mecánica Cuántica**, **Protección Radiológica**, **Instrumentación Nuclear**, **Física Atómica**, **Reactores Nucleares**, **Dosimetría**, **Física Médica**. ⚛️🔬",
    category: "carreras",
    keywords: ["materias", "asignaturas", "fisica nuclear"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de fisica nuclear",
    answer: "En **Semestre I** (23 UC) ves: **Matemática I**, **Introducción a la Física Nuclear**, Bioética, Pensamiento Crítico, **Química General**. La base fundamental. ⚛️📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "fisica nuclear"]
  },
  {
    question: "hay quimica en fisica nuclear",
    answer: "Sí, **Química General** en Semestre I. Es importante para entender reacciones nucleares. ⚗️⚛️",
    category: "carreras",
    keywords: ["quimica", "química", "fisica nuclear"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de fisica nuclear",
    answer: "En **Semestre II** (29 UC) ves: **Matemática II**, **Programación**, **Física I**, Seminario I, **Mecánica Estadística**, **Física Moderna**. Más especializado. 🔬⚛️",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "fisica nuclear"]
  },
  {
    question: "hay programacion en fisica nuclear",
    answer: "Sí, **Programación** en Semestre II. Útil para simular procesos nucleares y análisis de datos. 💻⚛️",
    category: "carreras",
    keywords: ["programacion", "programación", "fisica nuclear"]
  },
  {
    question: "que es fisica moderna",
    answer: "**Física Moderna** estudia relatividad y mecánica cuántica básica. En Semestre II. Es fundamental para física nuclear. ⚛️🌌",
    category: "carreras",
    keywords: ["fisica moderna", "que es", "fisica nuclear"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de fisica nuclear",
    answer: "En **Semestre III** (23 UC) ves: **Matemática III**, **Física Computacional**, **Física II**, Metodología de Investigación, **Protección Radiológica**. 🔬⚠️",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "fisica nuclear"]
  },
  {
    question: "que es fisica computacional",
    answer: "**Física Computacional** usa computadoras para resolver problemas físicos complejos. En Semestre III. Esencial para simulaciones nucleares. 💻⚛️",
    category: "carreras",
    keywords: ["fisica computacional", "que es", "fisica nuclear"]
  },
  {
    question: "cuando veo proteccion radiologica",
    answer: "**Protección Radiológica** lo ves en el **Semestre III**. Aprendes a proteger contra radiación y normas de seguridad. 🛡️☢️",
    category: "carreras",
    keywords: ["proteccion radiologica", "cuando", "fisica nuclear"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de fisica nuclear",
    answer: "En **Semestre IV** (18 UC) ves: **Métodos Matemáticos II**, **Física III**, **Instrumentación y Electrónica Nuclear**, Electiva II. Muy especializado. ⚛️🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "fisica nuclear"]
  },
  {
    question: "que es instrumentacion nuclear",
    answer: "**Instrumentación y Electrónica Nuclear** diseña y usa detectores de radiación, contadores Geiger, espectrómetros. En Semestre IV. Es la parte práctica. 🔬⚛️",
    category: "carreras",
    keywords: ["instrumentacion nuclear", "que es", "fisica nuclear"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de fisica nuclear",
    answer: "En **Semestre V** (26 UC) ves: **Seminario II**, **Pasantía I**, **Mecánica Cuántica**, **Física Atómica y Nuclear**, Proyecto Sociotecnológico. 🚀⚛️",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "fisica nuclear"]
  },
  {
    question: "cuando veo mecanica cuantica",
    answer: "**Mecánica Cuántica** la ves en el **Semestre V**. Es fundamental para entender el núcleo atómico. ⚛️🔬",
    category: "carreras",
    keywords: ["mecanica cuantica", "cuando", "fisica nuclear"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de fisica nuclear",
    answer: "En **Semestres VI-VIII** ves: **Física de Radiación y Dosimetría**, **Reactores**, **Energía Nuclear**, **Biofísica**, **Física Médica**, **Astrofísica**, **Pasantías**, **Trabajo de Grado**. 🚀⚛️",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "fisica nuclear"]
  },
  {
    question: "que es fisica de radiacion",
    answer: "**Física de Radiación y Dosimetría** estudia cómo medir y controlar la radiación. En semestres avanzados. Esencial para aplicaciones médicas. ☢️📏",
    category: "carreras",
    keywords: ["fisica radiacion", "dosimetria", "fisica nuclear"]
  },
  {
    question: "veo reactores nucleares",
    answer: "Sí, ves **Reactores y Ciclo de Combustible Nuclear** en semestres avanzados. Aprendes sobre energía nuclear. ⚡🏭",
    category: "carreras",
    keywords: ["reactores nucleares", "fisica nuclear"]
  },
  {
    question: "veo fisica medica",
    answer: "Sí, **Física Médica** en semestres avanzados. Aplicaciones de física nuclear en radioterapia, medicina nuclear, diagnóstico. 🏥⚛️",
    category: "carreras",
    keywords: ["fisica medica", "medicina", "fisica nuclear"]
  },
  {
    question: "veo astrofisica",
    answer: "Sí, **Astrofísica** en semestres avanzados. Estudia procesos nucleares en estrellas y universo. 🌌⚛️",
    category: "carreras",
    keywords: ["astrofisica", "astrophysics", "fisica nuclear"]
  },
  {
    question: "veo relatividad",
    answer: "Sí, **Relatividad General** en semestres avanzados. Parte de la física moderna aplicada a sistemas nucleares. ⚛️🌌",
    category: "carreras",
    keywords: ["relatividad", "general", "fisica nuclear"]
  },

  // LABORATORIOS Y PRÁCTICA
  {
    question: "hay laboratorios en fisica nuclear",
    answer: "Sí, hay laboratorios de física, química, instrumentación nuclear, y prácticas con equipos de radiación. Muy práctico. 🔬⚛️",
    category: "carreras",
    keywords: ["laboratorios", "labs", "fisica nuclear"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en fisica nuclear",
    answer: "Sí, hay **Pasantía I** en Semestre V y más pasantías en semestres avanzados. Trabajas en centros de investigación, hospitales, centrales nucleares. 💼⚛️",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "fisica nuclear"]
  },
  {
    question: "donde hago pasantias en fisica nuclear",
    answer: "Puedes hacer pasantías en **hospitales** (radioterapia), **centros nucleares**, **universidades**, **IVIC**, **empresas de radiación**, **organismos regulatorios**. 🏥⚛️",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "fisica nuclear"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en fisica nuclear",
    answer: "Sí, hay **Trabajo de Grado** donde desarrollas investigación original en física nuclear o aplicaciones. 🎓⚛️",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "fisica nuclear"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en fisica nuclear",
    answer: "Sí, hay **Electiva II** en Semestre IV y más electivas en semestres avanzados para especializarte. 🎯⚛️",
    category: "carreras",
    keywords: ["electivas", "optativas", "fisica nuclear"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en fisica nuclear",
    answer: "Los **Seminarios** (I, II) son espacios para discutir avances en física nuclear, presentar investigaciones, preparar tu trabajo de grado. 🎤⚛️",
    category: "carreras",
    keywords: ["seminarios", "fisica nuclear"]
  },

  // MATEMÁTICAS
  {
    question: "cuanta matematica tiene fisica nuclear",
    answer: "Bastante. Tiene **Matemática I, II, III**, **Métodos Matemáticos II**. Esencial para ecuaciones diferenciales, cálculo tensorial, matemáticas avanzadas. 📐⚛️",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "fisica nuclear"]
  },

  // FÍSICA
  {
    question: "cuanta fisica tiene fisica nuclear",
    answer: "Mucha. Tiene **Física I, II, III**, **Física Moderna**, **Física Computacional**, **Mecánica Estadística**, **Mecánica Cuántica**. Es la base de todo. ⚛️🔬",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "fisica nuclear"]
  },

  // PROGRAMACIÓN
  {
    question: "necesito saber programar antes de fisica nuclear",
    answer: "No, te enseñan **Programación** desde cero en Semestre II. Pero es útil tener base matemática fuerte. 💻⚛️",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "fisica nuclear"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de fisica nuclear",
    answer: "Es exigente con mucha matemática y física avanzada, pero si te apasiona la física nuclear, es manejable. Es más teórica que práctica. 💪⚛️",
    category: "carreras",
    keywords: ["pesada", "dificil", "fisica nuclear"]
  },
  {
    question: "cuantas materias por semestre en fisica nuclear",
    answer: "Varía entre **5-7 materias** por semestre, con mucho contenido teórico y matemático. 📚⚛️",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "fisica nuclear"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en medicina con fisica nuclear",
    answer: "Sí, puedes trabajar en **radioterapia**, **medicina nuclear**, **diagnóstico por imágenes**, **dosimetría médica**. Es una de las salidas más importantes. 🏥⚛️",
    category: "carreras",
    keywords: ["trabajo medicina", "fisica nuclear"]
  },
  {
    question: "trabajo en energia nuclear",
    answer: "Sí, puedes trabajar en **centrales nucleares**, **energía nuclear**, **ciclo de combustible**, **seguridad nuclear**. ⚡🏭",
    category: "carreras",
    keywords: ["trabajo energia nuclear", "fisica nuclear"]
  },
  {
    question: "trabajo en investigacion",
    answer: "Sí, puedes trabajar en **centros de investigación** como IVIC, universidades, CERN, investigación nuclear fundamental. 🔬📚",
    category: "carreras",
    keywords: ["trabajo investigacion", "fisica nuclear"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre fisica nuclear y fisica",
    answer: "**Física Nuclear** se especializa en núcleo atómico, radiación, reactores. **Física** es más general. Física Nuclear es más aplicada y específica. ⚛️🔬",
    category: "carreras",
    keywords: ["diferencia", "fisica nuclear", "fisica"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito ser bueno en matematicas para fisica nuclear",
    answer: "Sí, necesitas base sólida en matemáticas. La carrera tiene mucha matemática avanzada: cálculo, álgebra, ecuaciones diferenciales. 📐💪",
    category: "carreras",
    keywords: ["bueno matematicas", "matemáticas", "fisica nuclear"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de fisica nuclear",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **~187 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "fisica nuclear"]
  },
  {
    question: "donde consigo el pensum de fisica nuclear",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "fisica nuclear"]
  }
];

async function addFisicaNuclearFAQs() {
  console.log('⚛️ Adding Física Nuclear Curriculum FAQs\n');
  console.log(`📋 Found ${fisicaNuclearFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = fisicaNuclearFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = fisicaNuclearFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-fisica-nuclear',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Física Nuclear'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-fisica-nuclear',
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
  
  console.log(`✅ Added ${data.length} Física Nuclear curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (3 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestre V (2 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas (1 FAQ)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (3 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 38 FAQs sobre malla curricular de Física Nuclear!\n');
}

addFisicaNuclearFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
