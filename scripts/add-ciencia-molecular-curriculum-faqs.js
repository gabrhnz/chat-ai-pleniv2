#!/usr/bin/env node

/**
 * Add Ciencia Molecular Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Ciencia Molecular
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../src/services/embeddings.service.js';
import * as embeddingsCloud from '../src/services/embeddings.service.cloud.js';
import config from '../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cienciaMolecularFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "que materias tiene ciencia molecular",
    answer: "Tiene materias como: **Biología Molecular**, **Genómica y Proteómica**, **Biología de Sistemas**, **Microscopía Electrónica**, **Inmunología**, **Biofísica**, **Genética Molecular**, **Biología Sintética**, **Computación en Ciencia Molecular**. 🧬🔬",
    category: "carreras",
    keywords: ["materias", "asignaturas", "ciencia molecular"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de ciencia molecular",
    answer: "En **Semestre I** (26 UC) ves: **Matemática I**, **Química General**, Bioética, **Introducción a la Ciencia Molecular**, Pensamiento Crítico. La base molecular. 🧬📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "ciencia molecular"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de ciencia molecular",
    answer: "En **Semestre II** (30 UC) ves: **Introducción a la Biotecnología**, **Física I**, **Biología General**, **Programación**, Educación Física, **Laboratorio de Química Integrada**. Más amplio. 🔬🧬",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "ciencia molecular"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de ciencia molecular",
    answer: "En **Semestre III** (24 UC) ves: **Bioinformática**, **Biotecnología Ambiental**, **Biología Celular**, **Laboratorio Rotatorio I**, **Estadística**, Investigación. Aplicado. 🧬💻",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "ciencia molecular"]
  },
  {
    question: "cuando veo bioinformatica en ciencia molecular",
    answer: "**Bioinformática** la ves en el **Semestre III**. Aprendes a analizar secuencias moleculares con computadoras. 💻🧬",
    category: "carreras",
    keywords: ["bioinformatica", "cuando", "ciencia molecular"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de ciencia molecular",
    answer: "En **Semestre IV** (32 UC) ves: **Programación Avanzada**, **Biología General**, **Fisiología Celular**, **Biología del Desarrollo I**, **Bioquímica**, **Microscopía Electrónica**, **Laboratorio Rotatorio II**, Electivas. Muy especializado. 🔬🧬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "ciencia molecular"]
  },
  {
    question: "que es biologia del desarrollo",
    answer: "**Biología del Desarrollo I** estudia cómo se forman los organismos desde células hasta tejidos y órganos. En Semestre IV. 🧬🔬",
    category: "carreras",
    keywords: ["biologia desarrollo", "desarrollo", "que es", "ciencia molecular"]
  },
  {
    question: "que es microscopía electrónica",
    answer: "**Microscopía Electrónica** usa electrones para ver estructuras moleculares con altísima resolución. En Semestre IV. 🔬⚛️",
    category: "carreras",
    keywords: ["microscopía electrónica", "que es", "ciencia molecular"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de ciencia molecular",
    answer: "En **Semestre V** (29 UC) ves: **Estadística Avanzada**, **Biología de Sistemas**, **Pasantías I**, **Seminario II**, **Inmunología**, Electivas. Investigación aplicada. 🚀🧬",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "ciencia molecular"]
  },
  {
    question: "que es biologia de sistemas",
    answer: "**Biología de Sistemas** estudia organismos como sistemas complejos usando modelado matemático y computacional. En Semestre V. 🧬📊",
    category: "carreras",
    keywords: ["biologia sistemas", "que es", "ciencia molecular"]
  },
  {
    question: "veo inmunologia en ciencia molecular",
    answer: "Sí, **Inmunología** en **Semestre V**. Estudias el sistema inmune a nivel molecular: anticuerpos, respuesta inmune, inmunoterapia. 🛡️🧬",
    category: "carreras",
    keywords: ["inmunologia", "inmunología", "ciencia molecular"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de ciencia molecular",
    answer: "En **Semestres VI-VIII** ves: **Genómica y Proteómica**, **Biología Sintética**, **Biología del Desarrollo II**, **Microbiotecnología**, **Genética Molecular**, **Biofísica**, **Física Médica**, **Computación en Ciencia Molecular**, **Pasantías**, **Trabajo de Grado**. 🚀🧬",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "ciencia molecular"]
  },
  {
    question: "que es genomica y proteomica",
    answer: "**Genómica y Proteómica** estudia genomas completos y proteomas usando técnicas de alto rendimiento. En semestres avanzados. 🧬🔬",
    category: "carreras",
    keywords: ["genomica proteomica", "genómica", "proteómica", "que es", "ciencia molecular"]
  },
  {
    question: "que es biologia sintetica",
    answer: "**Biología Sintética** diseña y construye sistemas biológicos nuevos usando ingeniería genética. En semestres avanzados. 🧬🛠️",
    category: "carreras",
    keywords: ["biologia sintetica", "sintética", "que es", "ciencia molecular"]
  },
  {
    question: "veo biofisica en ciencia molecular",
    answer: "Sí, **Biofísica** en semestres avanzados. Aplica física a sistemas biológicos: dinámica molecular, espectroscopía, bioelectricidad. ⚛️🧬",
    category: "carreras",
    keywords: ["biofisica", "biofísica", "ciencia molecular"]
  },
  {
    question: "que es genetica molecular",
    answer: "**Genética Molecular** estudia genes y herencia a nivel molecular: expresión génica, mutaciones, regulación genética. En semestres avanzados. 🧬🧫",
    category: "carreras",
    keywords: ["genetica molecular", "que es", "ciencia molecular"]
  },
  {
    question: "veo fisica medica",
    answer: "Sí, **Física Médica** en semestres avanzados. Aplica física a medicina: radioterapia, diagnóstico por imagen, medicina nuclear. 🏥⚛️",
    category: "carreras",
    keywords: ["fisica medica", "médica", "ciencia molecular"]
  },

  // LABORATORIOS ROTATORIOS
  {
    question: "que son los laboratorios rotatorios",
    answer: "**Laboratorios Rotatorios** (I y II) son prácticas intensivas donde rotas por diferentes técnicas moleculares: biología celular, bioquímica, microscopía, etc. 🔬🧬",
    category: "carreras",
    keywords: ["laboratorios rotatorios", "que son", "ciencia molecular"]
  },
  {
    question: "hay laboratorios en ciencia molecular",
    answer: "Sí, **Laboratorios Rotatorios I y II**, **Laboratorio de Química Integrada**, prácticas en microscopía, biología molecular, etc. Muy experimental. 🔬🧬",
    category: "carreras",
    keywords: ["laboratorios", "labs", "ciencia molecular"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en ciencia molecular",
    answer: "Sí, hay **Pasantías I** en Semestre V y más pasantías en semestres avanzados. Trabajas en laboratorios de investigación molecular. 💼🧬",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "ciencia molecular"]
  },
  {
    question: "donde hago pasantias en ciencia molecular",
    answer: "Puedes hacer pasantías en **laboratorios universitarios**, **centros de investigación biomédica**, **hospitales**, **empresas farmacéuticas**, **IVIC**, **centros genómicos**. 🏥🧬",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "ciencia molecular"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en ciencia molecular",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación original en ciencia molecular aplicada. 🎓🧬",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "ciencia molecular"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en ciencia molecular",
    answer: "Sí, hay **Electivas** en varios semestres donde puedes especializarte en áreas específicas de tu interés molecular. 🎯🧬",
    category: "carreras",
    keywords: ["electivas", "optativas", "ciencia molecular"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en ciencia molecular",
    answer: "Los **Seminarios** (I, II) son espacios para discutir avances en ciencia molecular, metodologías, ética científica, preparar investigación. 🎤🧬",
    category: "carreras",
    keywords: ["seminarios", "ciencia molecular"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene ciencia molecular",
    answer: "Tiene **Matemática I** y matemáticas aplicadas en modelado molecular. No es tan pesada, se enfoca más en ciencias. 📐🧬",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "ciencia molecular"]
  },
  {
    question: "hay estadistica en ciencia molecular",
    answer: "Sí, **Estadística** en Semestre III y **Estadística Avanzada** en Semestre V. Esencial para análisis de datos moleculares. 📊🧬",
    category: "carreras",
    keywords: ["estadistica", "estadística", "ciencia molecular"]
  },

  // FÍSICA
  {
    question: "cuanta fisica tiene ciencia molecular",
    answer: "Tiene **Física I** y física aplicada: **Biofísica**, **Física Médica**, **Microscopía Electrónica**. Importante para técnicas moleculares. ⚛️🧬",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "ciencia molecular"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene ciencia molecular",
    answer: "Tiene **Programación** en Semestre II, **Programación Avanzada** en Semestre IV, más **Computación en Ciencia Molecular** en avanzados. Principalmente para análisis de datos. 💻🧬",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "ciencia molecular"]
  },
  {
    question: "necesito saber programar antes de ciencia molecular",
    answer: "No, te enseñan desde cero en Semestre II. Pero ayuda tener interés en computación por la bioinformática. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "ciencia molecular"]
  },

  // QUÍMICA Y BIOLOGÍA
  {
    question: "cuanta quimica tiene ciencia molecular",
    answer: "Tiene **Química General**, **Laboratorio de Química Integrada**, **Bioquímica**. Es química aplicada a biología molecular. ⚗️🧬",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "ciencia molecular"]
  },
  {
    question: "cuanta biologia tiene ciencia molecular",
    answer: "Mucha. Es la base: **Biología General** (dos veces), **Biología Celular**, **Fisiología Celular**, **Biología del Desarrollo**, **Genética Molecular**, etc. 🧬🔬",
    category: "carreras",
    keywords: ["biologia", "biología", "cuanta", "ciencia molecular"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de ciencia molecular",
    answer: "Es exigente con muchos laboratorios moleculares y técnicas especializadas, pero si te apasiona la investigación molecular, es fascinante. 💪🧬",
    category: "carreras",
    keywords: ["pesada", "dificil", "ciencia molecular"]
  },
  {
    question: "cuantas materias por semestre en ciencia molecular",
    answer: "Varía entre **6-8 materias** por semestre, incluyendo laboratorios rotatorios y seminarios. 📚🧬",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "ciencia molecular"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en investigacion con ciencia molecular",
    answer: "Sí, puedes trabajar en **investigación biomédica**, **centros de investigación molecular**, **laboratorios genómicos**, **desarrollo de fármacos**. 🔬🧬",
    category: "carreras",
    keywords: ["trabajo investigacion", "investigación", "ciencia molecular"]
  },
  {
    question: "trabajo en medicina con ciencia molecular",
    answer: "Sí, puedes trabajar en **medicina molecular**, **diagnóstico molecular**, **medicina personalizada**, **desarrollo de biomarcadores**, **terapias génicas**. 🏥🧬",
    category: "carreras",
    keywords: ["trabajo medicina", "ciencia molecular"]
  },
  {
    question: "puedo trabajar en biotecnologia",
    answer: "Sí, puedes trabajar en **biotecnología molecular**, **ingeniería genética**, **desarrollo de terapias moleculares**, **biología sintética**. 🧬🧫",
    category: "carreras",
    keywords: ["trabajo biotecnologia", "biotecnología", "ciencia molecular"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre ciencia molecular y biotecnologia",
    answer: "**Ciencia Molecular** estudia procesos moleculares (investigación fundamental). **Biotecnología** aplica esos conocimientos a productos (aplicada). La molecular es más básica. 🧬🔬 vs 🧬💊",
    category: "carreras",
    keywords: ["diferencia", "ciencia molecular", "biotecnologia"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber biologia antes de ciencia molecular",
    answer: "No, te enseñan toda la biología molecular necesaria. Pero es útil tener interés en investigación científica. 🧬📚",
    category: "carreras",
    keywords: ["necesito saber biologia", "antes", "ciencia molecular"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de ciencia molecular",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres** con enfoque en investigación molecular. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "ciencia molecular"]
  },
  {
    question: "donde consigo el pensum de ciencia molecular",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades moleculares. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "ciencia molecular"]
  }
];

async function addCienciaMolecularFAQs() {
  console.log('🧬 Adding Ciencia Molecular Curriculum FAQs\n');
  console.log(`📋 Found ${cienciaMolecularFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = cienciaMolecularFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = cienciaMolecularFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-ciencia-molecular',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Ciencia Molecular'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-ciencia-molecular',
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
  
  console.log(`✅ Added ${data.length} Ciencia Molecular curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (1 FAQ)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (1 FAQ)');
  console.log('   - Semestre III (2 FAQs)');
  console.log('   - Semestre IV (3 FAQs)');
  console.log('   - Semestre V (3 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Laboratorios rotatorios (2 FAQs)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Química y biología (2 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (3 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Ciencia Molecular!\n');
}

addCienciaMolecularFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
