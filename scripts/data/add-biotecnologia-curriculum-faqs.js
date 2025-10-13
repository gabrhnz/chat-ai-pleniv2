#!/usr/bin/env node

/**
 * Add Biotecnología Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Biotecnología
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

const biotecnologiaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "que materias tiene biotecnologia",
    answer: "Tiene materias como: **Biotecnología Agrícola**, **Biotecnología Médica**, **Biotecnología Animal**, **Microbiología**, **Genética**, **Bioquímica**, **Bioinformática**, **Biotecnología Ambiental**, **Biotecnología Alimentaria**. 🦠🧬",
    category: "carreras",
    keywords: ["materias", "asignaturas", "biotecnologia", "biotecnología"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de biotecnologia",
    answer: "En **Semestre I** (27 UC) ves: **Matemática I**, **Química General**, **Bioquímica**, **Biología Celular**, **Seminario I**, **Técnicas de Purificación de Proteínas**. La base biotecnológica. 🦠📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "biotecnologia", "biotecnología"]
  },
  {
    question: "que es tecnicas de purificacion de proteinas",
    answer: "**Técnicas de Purificación y Análisis de Proteínas** enseña métodos para aislar y caracterizar proteínas: cromatografía, electroforesis, espectroscopía. En Semestre I. 🧬🔬",
    category: "carreras",
    keywords: ["tecnicas purificacion proteinas", "qué es", "biotecnologia"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de biotecnologia",
    answer: "En **Semestre II** (31 UC) ves: **Química Orgánica**, **Estadística**, **Biología Celular**, Metodología de Investigación, **Introducción a la Biotecnología**, Bioética, Pensamiento Crítico. 🦠⚗️",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "biotecnologia", "biotecnología"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de biotecnologia",
    answer: "En **Semestre III** (26 UC) ves: **Bioinformática**, **Fisiología Vegetal**, **Bioquímica Avanzada**, Electivas, **Lenguajes Informáticos**, **Programación Avanzada**. Más aplicado. 🦠💻",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "biotecnologia", "biotecnología"]
  },
  {
    question: "cuando veo bioinformatica en biotecnologia",
    answer: "**Bioinformática** la ves en el **Semestre III**. Aprendes a usar computadoras para analizar datos biológicos. 💻🧬",
    category: "carreras",
    keywords: ["bioinformatica", "cuando", "biotecnologia"]
  },
  {
    question: "veo fisiologia vegetal",
    answer: "Sí, **Fisiología Vegetal** en **Semestre III**. Estudias procesos fisiológicos en plantas aplicados a biotecnología agrícola. 🌱🧬",
    category: "carreras",
    keywords: ["fisiologia vegetal", "vegetal", "biotecnologia"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de biotecnologia",
    answer: "En **Semestre IV** (28 UC) ves: **Microbiología**, **Genética**, **Biotecnología Agrícola**, **Biotecnología Médica**, **Biotecnología Animal**, **Seminario II**, Electivas. Muy especializado. 🦠🏥",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "biotecnologia", "biotecnología"]
  },
  {
    question: "que es biotecnologia agricola",
    answer: "**Biotecnología Agrícola** aplica técnicas biotecnológicas a agricultura: cultivos transgénicos, mejora genética de plantas, biocontrol. En Semestre IV. 🌾🧬",
    category: "carreras",
    keywords: ["biotecnologia agricola", "agrícola", "que es", "biotecnologia"]
  },
  {
    question: "que es biotecnologia medica",
    answer: "**Biotecnología Médica** aplica biotecnología a medicina: producción de fármacos, terapias génicas, diagnóstico molecular, vacunas. En Semestre IV. 🏥💊",
    category: "carreras",
    keywords: ["biotecnologia medica", "médica", "que es", "biotecnologia"]
  },
  {
    question: "que es biotecnologia animal",
    answer: "**Biotecnología Animal** aplica técnicas biotecnológicas a ganadería: clonación, transgénicos, mejora genética animal, reproducción asistida. En Semestre IV. 🐄🧬",
    category: "carreras",
    keywords: ["biotecnologia animal", "animal", "que es", "biotecnologia"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de biotecnologia",
    answer: "En **Semestres V-VIII** ves: **Biotecnología Ambiental**, **Biotecnología Industrial**, **Biorremediación**, **Biotecnología Alimentaria**, **Proyecto Sociotecnológico**, **Pasantías**, **Trabajo Especial de Grado**. 🚀🦠",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "biotecnologia", "biotecnología"]
  },
  {
    question: "que es biotecnologia ambiental",
    answer: "**Biotecnología Ambiental** usa organismos para solucionar problemas ambientales: biorremediación, biodepuración, energías alternativas. En semestres avanzados. 🌱♻️",
    category: "carreras",
    keywords: ["biotecnologia ambiental", "ambiental", "que es", "biotecnologia"]
  },
  {
    question: "que es biotecnologia industrial",
    answer: "**Biotecnología Industrial** aplica biotecnología a procesos industriales: producción de enzimas, antibióticos, bioplásticos, fermentación industrial. En semestres avanzados. 🏭🦠",
    category: "carreras",
    keywords: ["biotecnologia industrial", "industrial", "que es", "biotecnologia"]
  },
  {
    question: "veo biotecnologia alimentaria",
    answer: "Sí, **Biotecnología Alimentaria** en semestres avanzados. Aplica biotecnología a alimentos: fermentación, conservación, alimentos funcionales, alimentos transgénicos. 🍎🧬",
    category: "carreras",
    keywords: ["biotecnologia alimentaria", "alimentaria", "biotecnologia"]
  },
  {
    question: "que es biorremediacion",
    answer: "**Biorremediación** usa microorganismos para limpiar contaminantes ambientales: petróleo, metales pesados, residuos tóxicos. En semestres avanzados. 🌊🦠",
    category: "carreras",
    keywords: ["biorremediacion", "biorremediación", "que es", "biotecnologia"]
  },

  // LABORATORIOS Y PRÁCTICAS
  {
    question: "hay laboratorios en biotecnologia",
    answer: "Sí, hay muchos laboratorios prácticos: microbiología, genética, biotecnología agrícola, médica, animal, análisis de proteínas, etc. Muy hands-on. 🔬🦠",
    category: "carreras",
    keywords: ["laboratorios", "labs", "biotecnologia"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en biotecnologia",
    answer: "Sí, hay **Pasantías** en semestres avanzados. Trabajas en laboratorios de investigación, empresas farmacéuticas, agrícolas, ambientales. 💼🦠",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "biotecnologia"]
  },
  {
    question: "donde hago pasantias en biotecnologia",
    answer: "Puedes hacer pasantías en **laboratorios universitarios**, **empresas farmacéuticas**, **empresas agrícolas**, **centros de investigación biotecnológica**, **empresas ambientales**. 🏥🌾",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "biotecnologia"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en biotecnologia",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación biotecnológica aplicada: nuevo proceso, producto, aplicación. 🎓🦠",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "biotecnologia"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en biotecnologia",
    answer: "Sí, hay **Electivas** en Semestre III y IV donde puedes especializarte en agrícola, médica, animal, ambiental, etc. 🎯🦠",
    category: "carreras",
    keywords: ["electivas", "optativas", "biotecnologia"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en biotecnologia",
    answer: "Los **Seminarios** (I, II) son espacios para discutir avances biotecnológicos, ética, legislación, preparar tu investigación. 🎤🦠",
    category: "carreras",
    keywords: ["seminarios", "biotecnologia"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene biotecnologia",
    answer: "Tiene **Matemática I** y matemáticas aplicadas. No es tan pesada, se enfoca más en ciencias biológicas. 📐🦠",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "biotecnologia"]
  },
  {
    question: "hay estadistica en biotecnologia",
    answer: "Sí, **Estadística** en **Semestre II**. Esencial para análisis de datos experimentales, diseño de experimentos. 📊🦠",
    category: "carreras",
    keywords: ["estadistica", "estadística", "biotecnologia"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene biotecnologia",
    answer: "Tiene **Lenguajes Informáticos** y **Programación Avanzada** en Semestre III, más bioinformática. No es el foco principal pero es útil. 💻🦠",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "biotecnologia"]
  },
  {
    question: "necesito saber programar antes de biotecnologia",
    answer: "No, te enseñan lo necesario. Pero ayuda tener interés en computación ya que hay bioinformática. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "biotecnologia"]
  },

  // QUÍMICA
  {
    question: "cuanta quimica tiene biotecnologia",
    answer: "Bastante. Tiene **Química General**, **Química Orgánica**, **Bioquímica**, **Bioquímica Avanzada**. Es química aplicada a biología. ⚗️🦠",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "biotecnologia"]
  },

  // BIOLOGÍA
  {
    question: "cuanta biologia tiene biotecnologia",
    answer: "Mucha. Es la base: **Biología Celular** (dos veces), **Microbiología**, **Genética**, **Fisiología Vegetal**, más biología aplicada. 🦠🧬",
    category: "carreras",
    keywords: ["biologia", "biología", "cuanta", "biotecnologia"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de biotecnologia",
    answer: "Es exigente con muchos laboratorios y experimentos, pero si te gusta trabajar en laboratorio y la ciencia aplicada, es muy interesante. 💪🦠",
    category: "carreras",
    keywords: ["pesada", "dificil", "biotecnologia"]
  },
  {
    question: "cuantas materias por semestre en biotecnologia",
    answer: "Varía entre **6-8 materias** por semestre, incluyendo seminarios y electivas. 📚🦠",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "biotecnologia"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en agricultura con biotecnologia",
    answer: "Sí, puedes trabajar en **agricultura** desarrollando semillas mejoradas, biocontrol de plagas, cultivos resistentes, mejoramiento genético vegetal. 🌾🦠",
    category: "carreras",
    keywords: ["trabajo agricultura", "biotecnologia"]
  },
  {
    question: "trabajo en medicina con biotecnologia",
    answer: "Sí, puedes trabajar en **medicina** produciendo fármacos, terapias génicas, diagnóstico molecular, desarrollo de vacunas, medicina regenerativa. 🏥💊",
    category: "carreras",
    keywords: ["trabajo medicina", "biotecnologia"]
  },
  {
    question: "trabajo en medio ambiente con biotecnologia",
    answer: "Sí, puedes trabajar en **medio ambiente** con biorremediación, biodepuración, desarrollo de biocombustibles, conservación ambiental. 🌱♻️",
    category: "carreras",
    keywords: ["trabajo medio ambiente", "ambiental", "biotecnologia"]
  },
  {
    question: "puedo trabajar en industria alimentaria",
    answer: "Sí, puedes trabajar en **industria alimentaria** desarrollando alimentos funcionales, conservación de alimentos, fermentación, alimentos transgénicos. 🍎🦠",
    category: "carreras",
    keywords: ["trabajo industria alimentaria", "alimentaria", "biotecnologia"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre biotecnologia y biologia computacional",
    answer: "**Biotecnología** manipula organismos vivos en laboratorio (experimental). **Biología Computacional** modela sistemas biológicos con computadoras (teórico). Se complementan. 🦠 vs 💻",
    category: "carreras",
    keywords: ["diferencia", "biotecnologia", "biologia computacional"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber biologia antes de biotecnologia",
    answer: "No, te enseñan toda la biología necesaria desde cero. Pero es útil tener interés en ciencias biológicas. 🦠📚",
    category: "carreras",
    keywords: ["necesito saber biologia", "antes", "biotecnologia"]
  },

  // PROYECTOS
  {
    question: "hay proyectos sociotecnologicos en biotecnologia",
    answer: "Sí, hay **Proyecto Sociotecnológico e Innovador** donde aplicas biotecnología a problemas sociales: agricultura sostenible, salud comunitaria, medio ambiente. 🤝🦠",
    category: "carreras",
    keywords: ["proyectos sociotecnologicos", "sociotecnológicos", "biotecnologia"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de biotecnologia",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres** con todas las especialidades biotecnológicas. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "biotecnologia"]
  },
  {
    question: "donde consigo el pensum de biotecnologia",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades: agrícola, médica, animal, ambiental. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "biotecnologia"]
  }
];

async function addBiotecnologiaFAQs() {
  console.log('🦠 Adding Biotecnología Curriculum FAQs\n');
  console.log(`📋 Found ${biotecnologiaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = biotecnologiaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = biotecnologiaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-biotecnologia',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Biotecnología'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-biotecnologia',
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
  
  console.log(`✅ Added ${data.length} Biotecnología curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (1 FAQ)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (1 FAQ)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (4 FAQs)');
  console.log('   - Semestres avanzados (5 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Química (1 FAQ)');
  console.log('   - Biología (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Proyectos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Biotecnología!\n');
}

addBiotecnologiaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
