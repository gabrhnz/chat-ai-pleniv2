#!/usr/bin/env node

/**
 * Add Robótica y Automatización Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Ingeniería en Robótica y Automatización
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

const roboticaCurriculumFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene robotica",
    answer: "La carrera tiene **180 UC** (Unidades de Crédito) aproximadamente, distribuidas en **8 semestres**. 🤖⚙️",
    category: "carreras",
    keywords: ["UC", "unidades credito", "robotica", "robótica"]
  },
  {
    question: "que materias tiene robotica",
    answer: "Tiene materias como: **Machine Learning**, **Control de Robots**, **Sistemas Embebidos**, **Robótica Móvil**, **Cinemática de Robots**, **Redes Neuronales**, **Nanotecnología aplicada**, **Programación**, **CAD**, y más. 🤖💻",
    category: "carreras",
    keywords: ["materias", "asignaturas", "robotica", "robótica"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de robotica",
    answer: "En **Semestre I** (20 UC) ves: **Introducción a la Robótica y Automatización**, Pensamiento Crítico, Bioética, **Matemática I**, **Lógica y Algoritmos**. La base fundamental. 🤖📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "robotica", "robótica"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de robotica",
    answer: "En **Semestre II** ves: **Matemática III**, **Estadística**, **Física II**, Metodología de Investigación, **Inglés II aplicado a Robótica**. 📐🔬",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "robotica", "robótica"]
  },
  {
    question: "hay ingles en robotica",
    answer: "Sí, hay **Inglés I y II aplicados a Robótica y Automatización**. Esencial porque mucha documentación técnica está en inglés. 🇬🇧🤖",
    category: "carreras",
    keywords: ["ingles", "inglés", "robotica", "robótica"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de robotica",
    answer: "En **Semestre III** ves: **Matemática II**, **Física I**, **Programación**, **Machine Learning para Automatización**, **Laboratorio de Control de Robots**, **Sistemas Embebidos**, **Laboratorio de Electrónica**. Muy práctico. 🤖💻",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "robotica", "robótica"]
  },
  {
    question: "cuando veo machine learning en robotica",
    answer: "**Machine Learning para Automatización** lo ves en el **Semestre III**. Aprendes a que los robots aprendan y se adapten. 🤖🧠",
    category: "carreras",
    keywords: ["machine learning", "cuando", "robotica", "robótica"]
  },
  {
    question: "que son sistemas embebidos",
    answer: "**Sistemas Embebidos** son computadoras integradas en robots y dispositivos. Aprendes a programar microcontroladores, Arduino, Raspberry Pi. Lo ves en Semestre III. 🔌💻",
    category: "carreras",
    keywords: ["sistemas embebidos", "embedded", "robotica"]
  },
  {
    question: "cuando veo control de robots",
    answer: "**Laboratorio de Control de Robots** lo ves en el **Semestre III**. Aprendes a controlar movimientos, sensores, actuadores. 🎮🤖",
    category: "carreras",
    keywords: ["control robots", "cuando", "robotica"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de robotica",
    answer: "En **Semestre IV** ves: **Teoría del Diseño y CAD**, **Programación Avanzada**, **Laboratorio de Prototipado Rápido**, **Cinemática de Robots**, Seminario de Trabajo de Grado, **Pasantía II**, Proyecto Sociotecnológico, electivas. 🔧🤖",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "robotica", "robótica"]
  },
  {
    question: "que es CAD en robotica",
    answer: "**CAD (Computer-Aided Design)** es diseño asistido por computadora. Aprendes a diseñar robots en 3D con software como SolidWorks, AutoCAD. En Semestre IV. 🖥️📐",
    category: "carreras",
    keywords: ["CAD", "diseño", "robotica"]
  },
  {
    question: "que es prototipado rapido",
    answer: "**Prototipado Rápido** es crear prototipos de robots rápidamente usando impresión 3D, corte láser, etc. Muy práctico. En Semestre IV. 🖨️🤖",
    category: "carreras",
    keywords: ["prototipado rapido", "rápido", "3D", "robotica"]
  },
  {
    question: "que es cinematica de robots",
    answer: "**Cinemática de Robots** estudia el movimiento de robots: brazos robóticos, articulaciones, trayectorias. Matemáticas del movimiento. En Semestre IV. 🦾📐",
    category: "carreras",
    keywords: ["cinematica", "cinemática", "robots", "robotica"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de robotica",
    answer: "En **Semestres V-VIII** ves: **Robótica Móvil**, **Seguridad de Sistemas Robóticos**, **Nanotecnología aplicada a Robótica**, **Control Avanzado**, **Redes Neuronales para Robótica**, **Pasantías**, **Seminarios**, **Trabajo Especial de Grado**. 🚀🤖",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "robotica", "robótica"]
  },
  {
    question: "que es robotica movil",
    answer: "**Robótica Móvil** son robots que se mueven: drones, robots autónomos, vehículos sin conductor. Aprendes navegación, sensores, mapeo. En semestres avanzados. 🚗🤖",
    category: "carreras",
    keywords: ["robotica movil", "móvil", "drones", "robotica"]
  },
  {
    question: "veo seguridad en robotica",
    answer: "Sí, **Seguridad de Sistemas Robóticos** en semestres avanzados. Importante para proteger robots de hackeos, garantizar operación segura. 🔒🤖",
    category: "carreras",
    keywords: ["seguridad", "robotica", "robótica"]
  },
  {
    question: "veo nanotecnologia en robotica",
    answer: "Sí, **Nanotecnología aplicada a Robótica** donde aprendes sobre nanorobots, materiales avanzados, aplicaciones médicas. En semestres finales. ⚛️🤖",
    category: "carreras",
    keywords: ["nanotecnologia", "nanotecnología", "robotica"]
  },
  {
    question: "que es control avanzado de robots",
    answer: "**Control Avanzado** son técnicas sofisticadas para controlar robots: control adaptativo, control óptimo, control inteligente. En semestres finales. 🎮🤖",
    category: "carreras",
    keywords: ["control avanzado", "robotica"]
  },
  {
    question: "veo redes neuronales en robotica",
    answer: "Sí, **Redes Neuronales para Robótica** donde aprendes deep learning aplicado a robots: visión artificial, reconocimiento de objetos, toma de decisiones. 🧠🤖",
    category: "carreras",
    keywords: ["redes neuronales", "deep learning", "robotica"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en robotica",
    answer: "Sí, muchos: **Lab de Control de Robots**, **Lab de Electrónica**, **Lab de Prototipado Rápido**, **Lab de Cinemática**, y más. Muy hands-on. 🔬🤖",
    category: "carreras",
    keywords: ["laboratorios", "labs", "robotica", "robótica"]
  },
  {
    question: "cuantos laboratorios tiene robotica",
    answer: "Tiene varios labs a lo largo de la carrera: control, electrónica, prototipado, cinemática, diseño. Es muy práctico, construyes robots reales. 🔧🤖",
    category: "carreras",
    keywords: ["cuantos laboratorios", "robotica", "robótica"]
  },

  // ELECTRÓNICA
  {
    question: "hay electronica en robotica",
    answer: "Sí, **Laboratorio de Electrónica Digital y Analógica** en Semestre III. Fundamental para entender circuitos, sensores, actuadores de robots. ⚡🔌",
    category: "carreras",
    keywords: ["electronica", "electrónica", "robotica"]
  },

  // MATEMÁTICAS Y FÍSICA
  {
    question: "cuanta matematica tiene robotica",
    answer: "Bastante. Tiene **Matemática I, II y III** en los primeros semestres, más matemáticas aplicadas en control y cinemática. Es importante pero manejable. 📐🔢",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "robotica"]
  },
  {
    question: "cuanta fisica tiene robotica",
    answer: "Tiene **Física I y II** en los primeros semestres. Necesaria para entender mecánica, movimiento, fuerzas en robots. ⚛️📐",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "robotica"]
  },
  {
    question: "hay estadistica en robotica",
    answer: "Sí, **Estadística** en **Semestre II**. Útil para análisis de datos de sensores, machine learning, optimización. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "robotica"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene robotica",
    answer: "Mucha. Ves **Programación** (Semestre III), **Programación Avanzada** (Semestre IV), y programación en todos los laboratorios. Principalmente **Python, C++, ROS**. 🐍💻",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "robotica"]
  },
  {
    question: "que lenguajes de programacion veo en robotica",
    answer: "Principalmente **Python** (IA, machine learning), **C++** (control de robots), **ROS (Robot Operating System)**. También Arduino y otros. 🐍🤖",
    category: "carreras",
    keywords: ["lenguajes programacion", "programación", "robotica"]
  },
  {
    question: "necesito saber programar antes de robotica",
    answer: "No, te enseñan desde cero. Empiezas con **Lógica y Algoritmos** en Semestre I y luego **Programación**. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "robotica"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en robotica",
    answer: "Sí, hay **Pasantía II** en Semestre IV y más pasantías en semestres avanzados. Trabajas en empresas de automatización, manufactura, tech. 💼🤖",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "robotica", "robótica"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en robotica",
    answer: "Sí, hay **Trabajo Especial de Grado** donde diseñas y construyes un robot o sistema de automatización. 🎓🤖",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "robotica"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en robotica",
    answer: "Sí, hay **electivas** desde Semestre IV donde puedes especializarte en áreas específicas (drones, robots industriales, etc). 🎯🤖",
    category: "carreras",
    keywords: ["electivas", "optativas", "robotica"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en robotica",
    answer: "Los **Seminarios** son espacios para presentar proyectos, discutir avances tecnológicos, preparar tu trabajo de grado. Hay varios a lo largo de la carrera. 🎤🤖",
    category: "carreras",
    keywords: ["seminarios", "robotica"]
  },

  // APLICACIONES ESPECÍFICAS
  {
    question: "puedo hacer drones en robotica",
    answer: "Sí, en **Robótica Móvil** aprendes sobre drones, vehículos autónomos, navegación. Puedes especializarte en eso. 🚁🤖",
    category: "carreras",
    keywords: ["drones", "UAV", "robotica"]
  },
  {
    question: "veo robots industriales",
    answer: "Sí, aprendes sobre **robots industriales** (brazos robóticos, automatización de manufactura) en varias materias y labs. 🏭🦾",
    category: "carreras",
    keywords: ["robots industriales", "manufactura", "robotica"]
  },
  {
    question: "puedo hacer robots autonomos",
    answer: "Sí, en **Robótica Móvil** y con **Machine Learning** aprendes a crear robots autónomos que toman decisiones. 🤖🧠",
    category: "carreras",
    keywords: ["robots autonomos", "autónomos", "robotica"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de robotica",
    answer: "Es exigente con mucha matemática, física y programación, pero si te gustan los robots y te organizas, es manejable. Muy práctica y divertida. 💪🤖",
    category: "carreras",
    keywords: ["pesada", "dificil", "robotica"]
  },
  {
    question: "cuantas materias por semestre en robotica",
    answer: "Varía entre **5-8 materias** por semestre, dependiendo de las UC y laboratorios. Algunos semestres son más cargados. 📚🤖",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "robotica"]
  },

  // HERRAMIENTAS Y SOFTWARE
  {
    question: "que software uso en robotica",
    answer: "Usas **ROS (Robot Operating System)**, **MATLAB**, **SolidWorks/AutoCAD** (diseño), **Python**, **C++**, **Arduino IDE**, **Gazebo** (simulación), entre otros. 💻🤖",
    category: "carreras",
    keywords: ["software", "herramientas", "robotica"]
  },
  {
    question: "que es ROS en robotica",
    answer: "**ROS (Robot Operating System)** es el framework más usado para programar robots. Lo aprendes en varios laboratorios. Es estándar en la industria. 🤖💻",
    category: "carreras",
    keywords: ["ROS", "robot operating system", "robotica"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre robotica e inteligencia artificial",
    answer: "**Robótica** crea robots físicos (hardware + software). **IA** crea algoritmos inteligentes (solo software). Robótica usa IA para robots inteligentes. Se complementan. 🤖🧠",
    category: "carreras",
    keywords: ["diferencia", "robotica", "inteligencia artificial"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de robotica",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **~180 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "robotica"]
  },
  {
    question: "donde consigo el pensum de robotica",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "robotica"]
  }
];

async function addRoboticaCurriculumFAQs() {
  console.log('🤖 Adding Robótica y Automatización Curriculum FAQs\n');
  console.log(`📋 Found ${roboticaCurriculumFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = roboticaCurriculumFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = roboticaCurriculumFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-robotica',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Ingeniería en Robótica y Automatización'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-robotica',
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
  
  console.log(`✅ Added ${data.length} Robótica curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (4 FAQs)');
  console.log('   - Semestre IV (4 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Laboratorios (2 FAQs)');
  console.log('   - Electrónica (1 FAQ)');
  console.log('   - Matemáticas y física (3 FAQs)');
  console.log('   - Programación (3 FAQs)');
  console.log('   - Pasantías (1 FAQ)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Aplicaciones específicas (3 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Herramientas y software (2 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 42 FAQs sobre malla curricular de Robótica!\n');
}

addRoboticaCurriculumFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
