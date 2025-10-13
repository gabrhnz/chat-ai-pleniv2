#!/usr/bin/env node

/**
 * Add Matemáticas Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Matemática
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

const matematicasFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "que materias tiene matematicas",
    answer: "Tiene materias como: **Análisis Matemático**, **Álgebra**, **Geometría**, **Ecuaciones Diferenciales**, **Análisis Numérico**, **Topología**, **Teoría de Números**, **Lógica Matemática**, **Análisis Funcional**, **Métodos Numéricos**. 📐🔢",
    category: "carreras",
    keywords: ["materias", "asignaturas", "matematicas", "matemáticas"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de matematicas",
    answer: "En **Semestre I** (22 UC) ves: Bioética, Pensamiento Crítico, **Matemática I**, **Introducción a la Matemática**, **Elementos de la Matemática**. La base fundamental. 📐📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "matematicas", "matemáticas"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de matematicas",
    answer: "En **Semestre II** (21 UC) ves: **Matemática II**, **Álgebra I**, Educación Física, **Programación**, **Física I**. Desarrollo de conceptos básicos. 📐🔢",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "matematicas", "matemáticas"]
  },
  {
    question: "hay programacion en matematicas",
    answer: "Sí, **Programación** en **Semestre II**. Útil para algoritmos matemáticos y computación simbólica. 💻📐",
    category: "carreras",
    keywords: ["programacion", "programación", "matematicas"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de matematicas",
    answer: "En **Semestre III** (23 UC) ves: **Matemática III**, **Álgebra II**, **Geometría I**, **Estadística**, **Metodología de la Investigación**. Más avanzado. 📐🔢",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "matematicas", "matemáticas"]
  },
  {
    question: "cuando veo geometria en matematicas",
    answer: "**Geometría I** la ves en el **Semestre III**. Estudia formas, espacios, transformaciones geométricas. 📐🔺",
    category: "carreras",
    keywords: ["geometria", "cuando", "matematicas"]
  },
  {
    question: "hay estadistica en matematicas",
    answer: "Sí, **Estadística** en **Semestre III**. Probabilidad, inferencia estadística, análisis de datos. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "matematicas"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de matematicas",
    answer: "En **Semestre IV** (25 UC) ves: **Análisis Matemático II**, **Análisis Numérico**, **Ecuaciones Diferenciales I**, **Álgebra III**, **Seminario I**, Electiva. Aplicaciones numéricas. 📐🔢",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "matematicas", "matemáticas"]
  },
  {
    question: "que es analisis numerico",
    answer: "**Análisis Numérico** desarrolla algoritmos para resolver problemas matemáticos en computadora: raíces de ecuaciones, integración, interpolación. En Semestre IV. 💻📐",
    category: "carreras",
    keywords: ["analisis numerico", "que es", "matematicas"]
  },
  {
    question: "que es ecuaciones diferenciales",
    answer: "**Ecuaciones Diferenciales** estudia ecuaciones que involucran derivadas: modelado de fenómenos físicos, crecimiento poblacional, circuitos eléctricos. En Semestre IV. 📐⚡",
    category: "carreras",
    keywords: ["ecuaciones diferenciales", "que es", "matematicas"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de matematicas",
    answer: "En **Semestre V** (27 UC) ves: **Ecuaciones Diferenciales II**, **Análisis Matemático III**, **Pasantía I**, Seminario de Trabajo Especial de Grado, Proyecto Sociotecnológico, Electiva. Investigación aplicada. 🚀📐",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "matematicas", "matemáticas"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de matematicas",
    answer: "En **Semestres VI-VIII** ves: **Análisis Matemático IV**, **Topología**, **Lógica Matemática**, **Teoría de Números**, **Métodos Numéricos**, **Cálculo de Variaciones**, **Anillos Conmutativos**, **Análisis Funcional**, **Lógica Computacional**, **Pasantías**, **Trabajo de Grado**. 🚀📐",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "matematicas", "matemáticas"]
  },
  {
    question: "que es topologia",
    answer: "**Topología** estudia propiedades de espacios que se preservan bajo deformaciones continuas: conectividad, compacidad, espacios métricos. En semestres avanzados. 📐🔄",
    category: "carreras",
    keywords: ["topologia", "que es", "matematicas"]
  },
  {
    question: "que es teoria de numeros",
    answer: "**Teoría de Números** estudia propiedades de números enteros: primalidad, congruencias, funciones aritméticas. En semestres avanzados. 📐🔢",
    category: "carreras",
    keywords: ["teoria numeros", "que es", "matematicas"]
  },
  {
    question: "que es analisis funcional",
    answer: "**Análisis Funcional** estudia espacios de funciones infinitodimensionales: operadores, espectros, teoría de Hilbert. En semestres avanzados. 📐⚡",
    category: "carreras",
    keywords: ["analisis funcional", "que es", "matematicas"]
  },
  {
    question: "que es logica computacional",
    answer: "**Lógica Computacional** aplica lógica matemática a computación: algoritmos, complejidad, verificación de programas. En semestres avanzados. 💻📐",
    category: "carreras",
    keywords: ["logica computacional", "que es", "matematicas"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en matematicas",
    answer: "Sí, **Pasantía I** en Semestre V y más pasantías en semestres avanzados. Trabajas en investigación matemática, empresas tech, educación. 💼📐",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "matematicas"]
  },
  {
    question: "donde hago pasantias en matematicas",
    answer: "Puedes hacer pasantías en **universidades**, **centros de investigación**, **empresas tecnológicas**, **bancos** (finanzas matemáticas), **empresas de software**. 🧮💼",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "matematicas"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en matematicas",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación matemática original: teoremas, algoritmos, aplicaciones. 🎓📐",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "matematicas"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en matematicas",
    answer: "Sí, hay **Electivas** en varios semestres donde puedes profundizar en áreas específicas de tu interés matemático. 🎯📐",
    category: "carreras",
    keywords: ["electivas", "optativas", "matematicas"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en matematicas",
    answer: "Los **Seminarios** (I, Trabajo Especial de Grado) discuten avances matemáticos, presentaciones de investigación, problemas abiertos. 🎤📐",
    category: "carreras",
    keywords: ["seminarios", "matematicas"]
  },

  // MATEMÁTICAS
  {
    question: "cuanta matematica tiene matematicas",
    answer: "Todo es matemática. Desde **Matemática I** hasta análisis funcional, topología, teoría de números. Es matemática pura y aplicada. 📐🔢",
    category: "carreras",
    keywords: ["matematica", "cuanta", "matematicas"]
  },

  // FÍSICA
  {
    question: "hay fisica en matematicas",
    answer: "Sí, **Física I** en Semestre II. La matemática se aplica a física, pero no es el foco principal. ⚛️📐",
    category: "carreras",
    keywords: ["fisica", "física", "matematicas"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene matematicas",
    answer: "Tiene **Programación** en Semestre II. Se usa para algoritmos matemáticos, computación simbólica, visualización. 💻📐",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "matematicas"]
  },
  {
    question: "necesito saber programar antes de matematicas",
    answer: "No, te enseñan **Programación** desde cero. Pero ayuda tener interés en lógica computacional. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "matematicas"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de matematicas",
    answer: "Es exigente con demostraciones abstractas y pensamiento lógico, pero si te gusta razonar matemáticamente, es fascinante. Es más conceptual que práctica. 💪📐",
    category: "carreras",
    keywords: ["pesada", "dificil", "matematicas"]
  },
  {
    question: "cuantas materias por semestre en matematicas",
    answer: "Varía entre **5-6 materias** por semestre, con mucho contenido teórico y demostraciones. 📚📐",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "matematicas"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en finanzas con matematicas",
    answer: "Sí, puedes trabajar en **finanzas matemáticas**: modelado de riesgos, derivados, análisis cuantitativo, bancos de inversión. 💰📊",
    category: "carreras",
    keywords: ["trabajo finanzas", "matematicas"]
  },
  {
    question: "trabajo en tecnologia con matematicas",
    answer: "Sí, puedes trabajar en **tecnología**: algoritmos, criptografía, machine learning, investigación en IA, desarrollo de software matemático. 💻🧠",
    category: "carreras",
    keywords: ["trabajo tecnologia", "tecnología", "matematicas"]
  },
  {
    question: "puedo trabajar de profesor de matematicas",
    answer: "Sí, puedes trabajar como **profesor** en universidades, colegios, academias. También investigación docente. 👨‍🏫📐",
    category: "carreras",
    keywords: ["trabajo profesor", "enseñar", "matematicas"]
  },
  {
    question: "trabajo en investigacion matematica",
    answer: "Sí, puedes trabajar en **investigación pura**: teoremas, conjeturas matemáticas, publicaciones en revistas científicas. 🔬📐",
    category: "carreras",
    keywords: ["trabajo investigacion", "investigación", "matematicas"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre matematicas y ciencia de datos",
    answer: "**Matemáticas** es teórica y abstracta (pruebas, teoremas). **Ciencia de Datos** aplica matemáticas a datos reales (estadística, algoritmos). Matemáticas es más pura. 📐 vs 📊",
    category: "carreras",
    keywords: ["diferencia", "matematicas", "ciencia datos"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito ser bueno en logica para matematicas",
    answer: "Sí, definitivamente. Las matemáticas requieren pensamiento lógico, capacidad de abstracción, razonamiento deductivo. Es lo más importante. 🧠📐",
    category: "carreras",
    keywords: ["bueno logica", "lógica", "matematicas"]
  },

  // PROYECTO SOCIOTECNOLÓGICO
  {
    question: "hay proyecto sociotecnologico en matematicas",
    answer: "Sí, **Proyecto Sociotecnológico e Innovador** en Semestre V. Aplicas matemáticas a problemas sociales: optimización urbana, análisis epidemiológico, etc. 🤝📐",
    category: "carreras",
    keywords: ["proyecto sociotecnologico", "sociotecnológico", "matematicas"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de matematicas",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres** con especializaciones avanzadas. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "matematicas"]
  },
  {
    question: "donde consigo el pensum de matematicas",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades: análisis, álgebra, geometría. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "matematicas"]
  }
];

async function addMatematicasFAQs() {
  console.log('📐 Adding Matemáticas Curriculum FAQs\n');
  console.log(`📋 Found ${matematicasFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = matematicasFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = matematicasFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-matematicas',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Matemática'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-matematicas',
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
  
  console.log(`✅ Added ${data.length} Matemáticas curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (1 FAQ)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (3 FAQs)');
  console.log('   - Semestre V (1 FAQ)');
  console.log('   - Semestres avanzados (5 FAQs)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas (1 FAQ)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Proyecto sociotecnológico (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Matemáticas!\n');
}

addMatematicasFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
