#!/usr/bin/env node

/**
 * Add Ciencia de Datos Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Ciencia de Datos
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

const cienciaDatosFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "que materias tiene ciencia de datos",
    answer: "Tiene materias como: **Aprendizaje Automático**, **Minería de Datos**, **Procesamiento de Lenguaje Natural**, **Series de Tiempo**, **Visualización de Datos**, **Estadística para Ciencia de Datos**, **Ingeniería de Software**, **Bases de Datos**, **Programación**. 📊💻",
    category: "carreras",
    keywords: ["materias", "asignaturas", "ciencia datos"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de ciencia de datos",
    answer: "En **Semestre I** (17 UC) ves: **Introducción a la Ciencia de Datos**, **Matemática I**, Pensamiento Crítico, Bioética. La base fundamental. 📊📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "ciencia datos"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de ciencia de datos",
    answer: "En **Semestre II** (28 UC) ves: **Estadística**, **Bases de Datos**, **Matemática III**, **Análisis de Datos**, Metodología de Investigación, **Inglés II aplicado a Ciencia de Datos**. Más técnico. 📊🔢",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "ciencia datos"]
  },
  {
    question: "cuando veo estadistica en ciencia de datos",
    answer: "**Estadística** la ves en el **Semestre II**. Es fundamental para análisis de datos y machine learning. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "cuando", "ciencia datos"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de ciencia de datos",
    answer: "En **Semestre III** (29 UC) ves: **Matemática II**, **Programación**, **Física I**, **Inglés I aplicado a Ciencia de Datos**, Educación Física, **Lógica y Algoritmos**. Desarrollo técnico. 💻📐",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "ciencia datos"]
  },
  {
    question: "cuando veo programacion en ciencia de datos",
    answer: "**Programación** la ves en el **Semestre III**. Aprendes lenguajes como Python, fundamentales para data science. 🐍💻",
    category: "carreras",
    keywords: ["programacion", "cuando", "ciencia datos"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de ciencia de datos",
    answer: "En **Semestre IV** (24 UC) ves: **Seminario I**, **Programación y Laboratorio II**, **Estadística para Ciencia de Datos II**, **Ingeniería de Software**, **Visualización y Laboratorio de Datos I**, Electiva. Aplicado. 📊🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "ciencia datos"]
  },
  {
    question: "que es visualizacion de datos",
    answer: "**Visualización y Laboratorio de Datos I** enseña a crear gráficos y dashboards efectivos para comunicar insights de datos. En Semestre IV. 📊📈",
    category: "carreras",
    keywords: ["visualizacion datos", "que es", "ciencia datos"]
  },
  {
    question: "veo ingenieria de software en ciencia de datos",
    answer: "Sí, **Ingeniería de Software** en **Semestre IV**. Aprendes desarrollo de software escalable, arquitectura de sistemas, DevOps. 💻🏗️",
    category: "carreras",
    keywords: ["ingenieria software", "software", "ciencia datos"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de ciencia de datos",
    answer: "En **Semestres V-VIII** ves: **Aprendizaje Automático**, **Minería de Datos**, **Procesamiento de Lenguaje Natural**, **Series de Tiempo**, **Ciencia de Datos en Biología**, **Seguridad de la Información**, **Ética y Aspectos Legales**, **Pasantías**, **Trabajo de Grado**. 🚀📊",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "ciencia datos"]
  },
  {
    question: "cuando veo machine learning en ciencia de datos",
    answer: "**Aprendizaje Automático** (Machine Learning) lo ves en semestres avanzados. Aprendes algoritmos de ML, deep learning, redes neuronales. 🤖🧠",
    category: "carreras",
    keywords: ["machine learning", "cuando", "ciencia datos"]
  },
  {
    question: "que es mineria de datos",
    answer: "**Minería de Datos** extrae patrones y conocimiento útil de grandes bases de datos. En semestres avanzados. 🔍📊",
    category: "carreras",
    keywords: ["mineria datos", "que es", "ciencia datos"]
  },
  {
    question: "veo procesamiento de lenguaje natural",
    answer: "Sí, **Procesamiento de Lenguaje Natural** (NLP) en semestres avanzados. Aprendes análisis de texto, chatbots, traducción automática. 💬🤖",
    category: "carreras",
    keywords: ["procesamiento lenguaje natural", "NLP", "ciencia datos"]
  },
  {
    question: "que son series de tiempo",
    answer: "**Series de Tiempo** analiza datos que cambian con el tiempo: predicción de stocks, clima, ventas. En semestres avanzados. 📈⏰",
    category: "carreras",
    keywords: ["series tiempo", "que son", "ciencia datos"]
  },
  {
    question: "veo ciencia de datos en biologia",
    answer: "Sí, **Ciencia de Datos en Biología** aplica técnicas de data science a genómica, proteómica, análisis de datos biológicos. 🧬📊",
    category: "carreras",
    keywords: ["ciencia datos biologia", "biología", "ciencia datos"]
  },
  {
    question: "veo seguridad de la informacion",
    answer: "**Seguridad de la Información** protege datos sensibles, privacidad, ciberseguridad aplicada a data science. En semestres avanzados. 🔒📊",
    category: "carreras",
    keywords: ["seguridad informacion", "información", "ciencia datos"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en ciencia de datos",
    answer: "Sí, **Programación y Laboratorio II**, **Visualización y Laboratorio de Datos I y II**, prácticas con datasets reales. Muy práctico. 🔬💻",
    category: "carreras",
    keywords: ["laboratorios", "labs", "ciencia datos"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en ciencia de datos",
    answer: "Sí, hay **Pasantías** en semestres avanzados. Trabajas en empresas tech, bancos, consultoras, aplicando data science real. 💼📊",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "ciencia datos"]
  },
  {
    question: "donde hago pasantias en ciencia de datos",
    answer: "Puedes hacer pasantías en **empresas tecnológicas**, **bancos**, **empresas de e-commerce**, **consultoras**, **startups**, **gobiernos**. 💼🌐",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "ciencia datos"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en ciencia de datos",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas un proyecto de data science aplicado: modelo predictivo, análisis de datos, aplicación real. 🎓📊",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "ciencia datos"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en ciencia de datos",
    answer: "Sí, hay **Electivas** en Semestre IV y semestres avanzados donde puedes especializarte en áreas específicas. 🎯📊",
    category: "carreras",
    keywords: ["electivas", "optativas", "ciencia datos"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en ciencia de datos",
    answer: "Los **Seminarios** discuten avances en data science, ética de datos, casos de estudio, metodologías de investigación. 🎤📊",
    category: "carreras",
    keywords: ["seminarios", "ciencia datos"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene ciencia de datos",
    answer: "Bastante. Tiene **Matemática I, II, III**, álgebra lineal, cálculo, estadística avanzada. Esencial para algoritmos y modelos. 📐🔢",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "ciencia datos"]
  },
  {
    question: "hay estadistica en ciencia de datos",
    answer: "Sí, **Estadística** (Semestre II) y **Estadística para Ciencia de Datos II** (Semestre IV). Probabilidad, inferencia, estadística bayesiana. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "ciencia datos"]
  },

  // FÍSICA
  {
    question: "cuanta fisica tiene ciencia de datos",
    answer: "Tiene **Física I** en Semestre III. Física aplicada a computación y simulación. ⚛️💻",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "ciencia datos"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene ciencia de datos",
    answer: "Mucha. **Programación** (Semestre III), **Programación y Laboratorio II** (Semestre IV), más programación en todos los labs. Python, R, SQL. 🐍💻",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "ciencia datos"]
  },
  {
    question: "necesito saber programar antes de ciencia de datos",
    answer: "No, te enseñan desde cero en Semestre III. Pero es útil tener interés en tecnología. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "ciencia datos"]
  },

  // BASES DE DATOS
  {
    question: "veo bases de datos en ciencia de datos",
    answer: "Sí, **Bases de Datos** en **Semestre II**. SQL, NoSQL, diseño de bases de datos, Big Data. 🗄️💾",
    category: "carreras",
    keywords: ["bases datos", "database", "ciencia datos"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de ciencia de datos",
    answer: "Es exigente con matemática, estadística y programación, pero si te gusta analizar datos y programar, es muy interesante y bien pagada. 💪📊",
    category: "carreras",
    keywords: ["pesada", "dificil", "ciencia datos"]
  },
  {
    question: "cuantas materias por semestre en ciencia de datos",
    answer: "Varía entre **5-7 materias** por semestre, con mucho contenido técnico y laboratorios. 📚💻",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "ciencia datos"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en bancos con ciencia de datos",
    answer: "Sí, puedes trabajar en **bancos** analizando riesgos crediticios, detección de fraudes, análisis de mercado, finanzas. 🏦💰",
    category: "carreras",
    keywords: ["trabajo bancos", "ciencia datos"]
  },
  {
    question: "trabajo en empresas tech con ciencia de datos",
    answer: "Sí, puedes trabajar en **empresas tecnológicas** (Google, Meta, Amazon) desarrollando algoritmos, análisis de usuarios, productos de IA. 💼🚀",
    category: "carreras",
    keywords: ["trabajo empresas tech", "tecnológicas", "ciencia datos"]
  },
  {
    question: "puedo trabajar en gobierno",
    answer: "Sí, puedes trabajar en **gobierno** analizando datos públicos, políticas públicas, predicción económica, seguridad. 🏛️📊",
    category: "carreras",
    keywords: ["trabajo gobierno", "ciencia datos"]
  },
  {
    question: "trabajo en salud con ciencia de datos",
    answer: "Sí, puedes trabajar en **salud** analizando datos médicos, predicción de enfermedades, medicina personalizada, investigación clínica. 🏥📊",
    category: "carreras",
    keywords: ["trabajo salud", "ciencia datos"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre ciencia de datos e ingenieria en ia",
    answer: "**Ciencia de Datos** analiza datos para insights y predicciones (estadística + programación). **IA** construye sistemas inteligentes (machine learning avanzado). Se complementan. 📊 vs 🤖",
    category: "carreras",
    keywords: ["diferencia", "ciencia datos", "ingenieria ia"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito ser bueno en matematicas para ciencia de datos",
    answer: "Sí, necesitas base sólida en matemáticas. La carrera tiene mucha estadística, álgebra, cálculo. Pero si te esfuerzas, se puede. 📐💪",
    category: "carreras",
    keywords: ["bueno matematicas", "matemáticas", "ciencia datos"]
  },

  // HERRAMIENTAS
  {
    question: "que herramientas uso en ciencia de datos",
    answer: "Usas **Python** (pandas, scikit-learn), **R**, **SQL**, **Tableau/Power BI** (visualización), **Jupyter**, **Git**, **AWS/GCP** (cloud). 💻📊",
    category: "carreras",
    keywords: ["herramientas", "software", "ciencia datos"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de ciencia de datos",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres** con enfoque en análisis de datos. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "ciencia datos"]
  },
  {
    question: "donde consigo el pensum de ciencia de datos",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades en data science. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "ciencia datos"]
  }
];

async function addCienciaDatosFAQs() {
  console.log('📊 Adding Ciencia de Datos Curriculum FAQs\n');
  console.log(`📋 Found ${cienciaDatosFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = cienciaDatosFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = cienciaDatosFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-ciencia-datos',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Ciencia de Datos'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-ciencia-datos',
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
  
  console.log(`✅ Added ${data.length} Ciencia de Datos curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (1 FAQ)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (2 FAQs)');
  console.log('   - Semestre IV (3 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Bases de datos (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Herramientas (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 38 FAQs sobre malla curricular de Ciencia de Datos!\n');
}

addCienciaDatosFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
