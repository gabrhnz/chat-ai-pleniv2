#!/usr/bin/env node

/**
 * Add IA Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Ingeniería en Inteligencia Artificial
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

const iaCurriculumFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene ingenieria en inteligencia artificial",
    answer: "La carrera tiene **181 UC** (Unidades de Crédito) en total, distribuidas en **8 semestres**. 📚🤖",
    category: "carreras",
    keywords: ["UC", "unidades credito", "inteligencia artificial", "IA"]
  },
  {
    question: "cuantas horas semanales tiene IA",
    answer: "Son **42 horas semanales** en total, incluyendo clases teóricas, prácticas, laboratorios y trabajo independiente. ⏰📚",
    category: "carreras",
    keywords: ["horas", "semanales", "IA", "inteligencia artificial"]
  },
  {
    question: "que materias tiene ingenieria en IA",
    answer: "Tiene materias como: **Machine Learning**, **Big Data**, **Minería de Datos**, **Visión por Computadora**, **Procesamiento de Lenguaje Natural**, **Deep Learning**, **Programación**, **Matemáticas**, **Estadística**, y muchas más. 🤖💻",
    category: "carreras",
    keywords: ["materias", "asignaturas", "IA"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de IA",
    answer: "En **Semestre I** (21 UC) ves: Pensamiento Crítico, Bioética, **Matemática I**, **Introducción a IA**, **Lógica y Algoritmos**, entre otras. Es la base fundamental. 📚🤖",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "IA", "materias"]
  },
  {
    question: "que materias tiene primer semestre de inteligencia artificial",
    answer: "**Semestre I** incluye: Pensamiento Crítico y Comunicación, Bioética y Bioseguridad, **Matemática I**, **Introducción a la Inteligencia Artificial**, **Lógica y Algoritmos**. Total: **21 UC**. 📖",
    category: "carreras",
    keywords: ["primer semestre", "materias", "IA"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de IA",
    answer: "En **Semestre II** (20 UC) ves: **Minería de Datos**, Metodología de Investigación, **Estadística**, **Laboratorio de Programación I**, **Inglés I aplicado a IA**, Teoría de Decisión. 💻📊",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "IA"]
  },
  {
    question: "hay ingles en la carrera de IA",
    answer: "Sí, hay **Inglés I aplicado a IA** en el Semestre II. Es importante porque mucha documentación técnica está en inglés. 🇬🇧💻",
    category: "carreras",
    keywords: ["ingles", "inglés", "IA"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de IA",
    answer: "En **Semestre III** (23 UC) ves: **Matemática II**, **Programación avanzada**, **Laboratorio II**, **Aprendizaje Automático** (Machine Learning), **Big Data**, Modelado y Simulación, **Ingeniería de Datos**. 🤖📈",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "IA"]
  },
  {
    question: "cuando veo machine learning en IA",
    answer: "**Machine Learning (Aprendizaje Automático)** lo ves desde el **Semestre III** y se profundiza en semestres siguientes. Es una materia clave. 🤖📊",
    category: "carreras",
    keywords: ["machine learning", "cuando", "IA"]
  },
  {
    question: "cuando veo big data",
    answer: "**Big Data** lo ves en el **Semestre III**. Aprenderás a manejar grandes volúmenes de datos. 📊💾",
    category: "carreras",
    keywords: ["big data", "cuando", "IA"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de IA",
    answer: "En **Semestre IV** (26 UC) ves: **Laboratorio de Programación III**, **Aprendizaje Automático avanzado**, **Laboratorio de Datos**, **Seminario I**, y electivas. Es más especializado. 🚀💻",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "IA"]
  },
  {
    question: "hay electivas en IA",
    answer: "Sí, desde el **Semestre IV** hay **electivas** donde puedes elegir temas específicos según tus intereses. 🎯📚",
    category: "carreras",
    keywords: ["electivas", "IA", "optativas"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de IA",
    answer: "En **Semestre V** continúas con materias especializadas y debes hacer el **Servicio Comunitario** (120 horas obligatorias). 🤝📚",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "IA"]
  },
  {
    question: "hay servicio comunitario en IA",
    answer: "Sí, el **Servicio Comunitario** es obligatorio (**120 horas**) y se hace en el **Semestre V**. Aplicas tus conocimientos ayudando a la comunidad. 🤝💚",
    category: "carreras",
    keywords: ["servicio comunitario", "IA"]
  },

  // SEMESTRES AVANZADOS (VI-VIII)
  {
    question: "que veo en los ultimos semestres de IA",
    answer: "En **Semestres VI-VIII** ves temas avanzados: **IA en Finanzas**, **IA en Salud**, **IA en Ciberseguridad**, **Visión por Computadora**, **Procesamiento de Lenguaje Natural**, **Sistemas de Recomendación**, **Aprendizaje por Refuerzo**, **Pasantías**. 🚀🤖",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "IA"]
  },
  {
    question: "hay pasantias en IA",
    answer: "Sí, hay **Pasantías** en los últimos semestres donde trabajas en empresas aplicando lo aprendido. Es experiencia real. 💼🚀",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "IA"]
  },
  {
    question: "que es vision por computadora",
    answer: "**Visión por Computadora** es una materia avanzada donde aprendes a que las máquinas \"vean\" e interpreten imágenes y videos. Se ve en semestres finales. 👁️🤖",
    category: "carreras",
    keywords: ["vision por computadora", "computer vision", "IA"]
  },
  {
    question: "que es procesamiento de lenguaje natural",
    answer: "**Procesamiento de Lenguaje Natural (NLP)** es donde aprendes a que las máquinas entiendan y generen texto humano (como chatbots). Se ve en semestres avanzados. 💬🤖",
    category: "carreras",
    keywords: ["procesamiento lenguaje natural", "NLP", "IA"]
  },
  {
    question: "que es aprendizaje por refuerzo",
    answer: "**Aprendizaje por Refuerzo** es una técnica avanzada de IA donde los agentes aprenden por prueba y error (como entrenar robots o juegos). Se ve en semestres finales. 🎮🤖",
    category: "carreras",
    keywords: ["aprendizaje por refuerzo", "reinforcement learning", "IA"]
  },

  // APLICACIONES ESPECÍFICAS
  {
    question: "veo IA aplicada a salud",
    answer: "Sí, hay una materia de **IA en Salud** en semestres avanzados donde aprendes a aplicar IA a diagnóstico médico, análisis de imágenes médicas, etc. 🏥🤖",
    category: "carreras",
    keywords: ["IA salud", "medicina", "aplicaciones"]
  },
  {
    question: "veo IA aplicada a finanzas",
    answer: "Sí, hay **IA en Finanzas** donde aprendes análisis predictivo, trading algorítmico, detección de fraudes, etc. 💰📈",
    category: "carreras",
    keywords: ["IA finanzas", "trading", "aplicaciones"]
  },
  {
    question: "veo IA aplicada a ciberseguridad",
    answer: "Sí, hay **IA en Ciberseguridad** donde aprendes detección de amenazas, análisis de vulnerabilidades con IA, etc. 🔒🤖",
    category: "carreras",
    keywords: ["IA ciberseguridad", "seguridad", "aplicaciones"]
  },

  // LABORATORIOS Y PRÁCTICA
  {
    question: "hay laboratorios en IA",
    answer: "Sí, hay varios **Laboratorios de Programación** (I, II, III), **Laboratorio de Datos**, **Laboratorio de Aplicación Avanzada de IA**. Es muy práctico. 💻🔬",
    category: "carreras",
    keywords: ["laboratorios", "practicas", "IA"]
  },
  {
    question: "cuantos laboratorios tiene IA",
    answer: "Tiene varios laboratorios a lo largo de la carrera: **Laboratorio de Programación I, II, III**, **Laboratorio de Datos**, y **Laboratorio de Aplicación Avanzada de IA**. 🔬💻",
    category: "carreras",
    keywords: ["cuantos laboratorios", "IA"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene IA",
    answer: "Tiene **Matemática I y II** en los primeros semestres, más **Estadística** y matemáticas aplicadas en otras materias. Es importante pero manejable. 📐📊",
    category: "carreras",
    keywords: ["matematica", "matemática", "IA"]
  },
  {
    question: "hay estadistica en IA",
    answer: "Sí, **Estadística** es fundamental y la ves en el **Semestre II**. Es clave para entender machine learning. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "IA"]
  },

  // PROGRAMACIÓN
  {
    question: "que lenguajes de programacion veo en IA",
    answer: "Principalmente **Python** (el más usado en IA), también bases de otros lenguajes. Lo aprendes desde los primeros semestres en Lógica y Algoritmos, y Laboratorios. 🐍💻",
    category: "carreras",
    keywords: ["lenguajes programacion", "python", "IA"]
  },
  {
    question: "necesito saber programar antes de entrar a IA",
    answer: "No, te enseñan desde cero. Empiezas con **Lógica y Algoritmos** en Semestre I y vas avanzando. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "IA"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en IA",
    answer: "Los **Seminarios** son espacios donde presentas investigaciones, proyectos y discutes temas actuales de IA con profes y compañeros. Hay varios a lo largo de la carrera. 🎤📚",
    category: "carreras",
    keywords: ["seminarios", "IA"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de IA",
    answer: "Es exigente (**42 horas semanales**, **181 UC**) pero si te gusta la IA y te organizas, es totalmente manejable. Hay mucho apoyo. 💪📚",
    category: "carreras",
    keywords: ["pesada", "dificil", "IA"]
  },
  {
    question: "cuantas materias por semestre en IA",
    answer: "Varía entre **5-7 materias** por semestre, dependiendo de las UC. Los primeros semestres tienen más materias básicas. 📚",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "IA"]
  },

  // PROYECTO FINAL / TESIS
  {
    question: "hay tesis en IA",
    answer: "Sí, en los últimos semestres desarrollas un **proyecto final** o trabajo de grado aplicando todo lo aprendido. 🎓💻",
    category: "carreras",
    keywords: ["tesis", "proyecto final", "IA"]
  },

  // COMPARACIÓN CON OTRAS CARRERAS
  {
    question: "que diferencia hay entre IA y ciencia de datos",
    answer: "**IA** se enfoca en crear sistemas inteligentes (robots, visión, NLP). **Ciencia de Datos** se enfoca más en análisis de datos y estadística. Ambas usan machine learning pero con enfoques diferentes. 🤖📊",
    category: "carreras",
    keywords: ["diferencia", "IA", "ciencia datos"]
  },

  // PREGUNTAS PRÁCTICAS
  {
    question: "puedo ver la malla completa de IA",
    answer: "Sí, la malla completa está en la web de la UNC o puedes pedirla en admisiones. Tiene **8 semestres**, **181 UC**, con todas las materias detalladas. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "IA"]
  },
  {
    question: "donde consigo el pensum de IA",
    answer: "El pensum está en **unc.edu.ve** o lo puedes pedir en la oficina de admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué semestre te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "IA"]
  }
];

async function addIACurriculumFAQs() {
  console.log('🤖 Adding IA Curriculum FAQs\n');
  console.log(`📋 Found ${iaCurriculumFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = iaCurriculumFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = iaCurriculumFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-ia',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Ingeniería en Inteligencia Artificial'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-ia',
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
  
  console.log(`✅ Added ${data.length} IA curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (3 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestre V (2 FAQs)');
  console.log('   - Semestres avanzados (5 FAQs)');
  console.log('   - Aplicaciones específicas (3 FAQs)');
  console.log('   - Laboratorios (2 FAQs)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Proyecto final (1 FAQ)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Prácticas (2 FAQs)');
  console.log('\n✨ Total: 35 FAQs sobre malla curricular de IA!\n');
}

addIACurriculumFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
