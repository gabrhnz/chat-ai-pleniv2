#!/usr/bin/env node

/**
 * Add Biología y Química Computacional Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Biología y Química Computacional
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

const biologiaComputacionalFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene biologia computacional",
    answer: "La carrera tiene **185 UC** en total, distribuidas en **8 semestres**. 🧬💻",
    category: "carreras",
    keywords: ["UC", "unidades credito", "biologia computacional"]
  },
  {
    question: "que materias tiene biologia computacional",
    answer: "Tiene materias como: **Bioinformática**, **Biología Molecular**, **Modelaje Molecular**, **Química Cuántica**, **Biología de Sistemas**, **Programación Avanzada**, **Fisicoquímica**, **Bioquímica**. 🧬🔬💻",
    category: "carreras",
    keywords: ["materias", "asignaturas", "biologia computacional"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de biologia computacional",
    answer: "En **Semestre I** (23 UC) ves: **Matemática I**, **Química General**, Bioética, **Introducción a Biología y Química Computacional**, Pensamiento Crítico. La base fundamental. 🧬📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "biologia computacional"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de biologia computacional",
    answer: "En **Semestre II** (23 UC) ves: **Física II**, **Biología Celular**, **Estadística**, **Química Orgánica**, **Metodología de Investigación**. 🔬🧬",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "biologia computacional"]
  },
  {
    question: "cuando veo biologia celular en biologia computacional",
    answer: "**Biología Celular** la ves en el **Semestre II**. Es fundamental para entender procesos celulares que modelas computacionalmente. 🦠🔬",
    category: "carreras",
    keywords: ["biologia celular", "cuando", "biologia computacional"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de biologia computacional",
    answer: "En **Semestre III** (24 UC) ves: **Laboratorio Rotatorio II**, **Biología Molecular**, **Seminario I**, **Bioinformática**, **Lenguajes Informáticos**, Electiva. Más aplicado. 🧬💻",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "biologia computacional"]
  },
  {
    question: "que es bioinformatica",
    answer: "**Bioinformática** usa computadoras para analizar datos biológicos: secuencias de ADN, proteínas, genomas. En Semestre III. Es clave en la carrera. 🧬💻",
    category: "carreras",
    keywords: ["bioinformatica", "que es", "biologia computacional"]
  },
  {
    question: "cuando veo lenguajes informaticos",
    answer: "**Lenguajes Informáticos** lo ves en el **Semestre III**. Aprendes lenguajes para análisis de datos biológicos. 💻🧬",
    category: "carreras",
    keywords: ["lenguajes informaticos", "cuando", "biologia computacional"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de biologia computacional",
    answer: "En **Semestre IV** (35 UC) ves: **Laboratorio Rotatorio I**, **Programación Avanzada**, Seminario Trabajo Especial de Grado, Proyecto Sociotecnológico, **Pasantía II**, **Química Cuántica**, **Biología de Sistemas**, Electiva. 🚀🧬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "biologia computacional"]
  },
  {
    question: "que es quimica cuantica",
    answer: "**Química Cuántica** usa mecánica cuántica para entender enlaces químicos y reacciones moleculares. En Semestre IV. Esencial para modelaje computacional. ⚛️🔬",
    category: "carreras",
    keywords: ["quimica cuantica", "cuántica", "que es", "biologia computacional"]
  },
  {
    question: "que es biologia de sistemas",
    answer: "**Biología de Sistemas** estudia organismos como sistemas complejos usando modelado matemático y computacional. En Semestre IV. 🔬🧬",
    category: "carreras",
    keywords: ["biologia sistemas", "que es", "biologia computacional"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de biologia computacional",
    answer: "En **Semestres V-VIII** ves: **Fisicoquímica**, **Química Inorgánica**, **Bioquímica**, **Biofísica**, **Biología Estructural**, **Modelaje Molecular**, **Pasantías**, **Trabajo de Grado**. 🚀🧬",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "biologia computacional"]
  },
  {
    question: "que es modelaje molecular",
    answer: "**Modelaje Molecular** usa computadoras para simular y predecir comportamiento de moléculas: fármacos, proteínas, interacciones químicas. En semestres avanzados. 💻🧬",
    category: "carreras",
    keywords: ["modelaje molecular", "modeling", "biologia computacional"]
  },
  {
    question: "veo bioquimica en biologia computacional",
    answer: "Sí, **Bioquímica** en semestres avanzados. Estudias reacciones bioquímicas usando modelado computacional. 🧬⚗️",
    category: "carreras",
    keywords: ["bioquimica", "bioquímica", "biologia computacional"]
  },
  {
    question: "veo biofisica",
    answer: "Sí, **Biofísica** en semestres avanzados. Aplica física a sistemas biológicos usando modelado computacional. ⚛️🧬",
    category: "carreras",
    keywords: ["biofisica", "biofísica", "biologia computacional"]
  },

  // LABORATORIOS ROTATORIOS
  {
    question: "que son los laboratorios rotatorios",
    answer: "**Laboratorios Rotatorios** (I y II) son prácticas intensivas donde rotas por diferentes áreas de laboratorio: química, biología, computacional. Muy prácticos. 🔬🧬",
    category: "carreras",
    keywords: ["laboratorios rotatorios", "que son", "biologia computacional"]
  },
  {
    question: "hay laboratorios en biologia computacional",
    answer: "Sí, **Laboratorios Rotatorios I y II** donde aprendes técnicas experimentales que luego modelas computacionalmente. 🔬🧬💻",
    category: "carreras",
    keywords: ["laboratorios", "labs", "biologia computacional"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en biologia computacional",
    answer: "Sí, hay **Pasantía II** en Semestre IV y más pasantías en semestres avanzados. Trabajas en laboratorios de investigación, empresas farmacéuticas, centros de bioinformática. 💼🧬",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "biologia computacional"]
  },
  {
    question: "donde hago pasantias en biologia computacional",
    answer: "Puedes hacer pasantías en **laboratorios universitarios**, **empresas farmacéuticas**, **centros de investigación genética**, **empresas de biotecnología**, **centros de bioinformática**. 🏥💻",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "biologia computacional"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en biologia computacional",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación computacional aplicada a biología o química. 🎓🧬💻",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "biologia computacional"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en biologia computacional",
    answer: "Sí, hay **Electivas** en Semestre III y IV donde puedes elegir temas específicos de tu interés. 🎯🧬",
    category: "carreras",
    keywords: ["electivas", "optativas", "biologia computacional"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en biologia computacional",
    answer: "Los **Seminarios** (I, Trabajo Especial de Grado) son espacios para discutir avances científicos, metodologías computacionales, preparar tu investigación. 🎤🧬",
    category: "carreras",
    keywords: ["seminarios", "biologia computacional"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene biologia computacional",
    answer: "Tiene **Matemática I** y matemáticas aplicadas en modelado, estadística. Es manejable pero importante para algoritmos. 📐🧬",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "biologia computacional"]
  },
  {
    question: "hay estadistica en biologia computacional",
    answer: "Sí, **Estadística** en **Semestre II**. Esencial para análisis de datos biológicos y validación de modelos. 📊🧬",
    category: "carreras",
    keywords: ["estadistica", "estadística", "biologia computacional"]
  },

  // FÍSICA
  {
    question: "cuanta fisica tiene biologia computacional",
    answer: "Tiene **Física II** y física aplicada en biofísica y fisicoquímica. No es tan pesada como otras carreras. ⚛️🧬",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "biologia computacional"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene biologia computacional",
    answer: "Bastante. Ves **Lenguajes Informáticos**, **Programación Avanzada**, y programación en bioinformática y modelaje molecular. Principalmente **Python, R**. 🐍💻",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "biologia computacional"]
  },
  {
    question: "necesito saber programar antes de biologia computacional",
    answer: "No, te enseñan desde cero. Empiezas con **Lenguajes Informáticos** en Semestre III. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "biologia computacional"]
  },

  // QUÍMICA
  {
    question: "cuanta quimica tiene biologia computacional",
    answer: "Mucha. Tiene **Química General**, **Química Orgánica**, **Química Cuántica**, **Bioquímica**, **Fisicoquímica**. Es química aplicada computacionalmente. ⚗️🧬",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "biologia computacional"]
  },

  // BIOLOGÍA
  {
    question: "cuanta biologia tiene biologia computacional",
    answer: "Bastante. Tiene **Biología Celular**, **Biología Molecular**, **Biología de Sistemas**, **Biología Estructural**, más biología aplicada. 🦠🧬",
    category: "carreras",
    keywords: ["biologia", "biología", "cuanta", "biologia computacional"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de biologia computacional",
    answer: "Es exigente con química, biología y programación, pero si te gusta la intersección de estas áreas, es muy interesante y manejable. 💪🧬💻",
    category: "carreras",
    keywords: ["pesada", "dificil", "biologia computacional"]
  },
  {
    question: "cuantas materias por semestre en biologia computacional",
    answer: "Varía entre **5-7 materias** por semestre, incluyendo laboratorios rotatorios intensivos. 📚🧬",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "biologia computacional"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en farmacia con biologia computacional",
    answer: "Sí, puedes trabajar en **industria farmacéutica** diseñando fármacos, modelando interacciones moleculares, discovery de medicamentos. 💊🧬💻",
    category: "carreras",
    keywords: ["trabajo farmacia", "farmacéutica", "biologia computacional"]
  },
  {
    question: "trabajo en investigacion genetica",
    answer: "Sí, puedes trabajar en **investigación genética**, análisis de genomas, bioinformática aplicada a genética. 🧬🔬",
    category: "carreras",
    keywords: ["trabajo investigacion genetica", "genética", "biologia computacional"]
  },
  {
    question: "puedo trabajar en biotecnologia",
    answer: "Sí, puedes trabajar en **empresas de biotecnología** desarrollando modelos computacionales para procesos biológicos, optimización de bioprocesos. 🧬🏭",
    category: "carreras",
    keywords: ["trabajo biotecnologia", "biotecnología", "biologia computacional"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre biologia computacional y biotecnologia",
    answer: "**Biología Computacional** usa computadoras para modelar sistemas biológicos (más teórico). **Biotecnología** manipula organismos vivos (más experimental). Se complementan. 🧬💻 vs 🦠",
    category: "carreras",
    keywords: ["diferencia", "biologia computacional", "biotecnologia"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber biologia antes de biologia computacional",
    answer: "No, te enseñan toda la biología necesaria. Pero es útil tener interés en ciencias y computación. 🧬📚",
    category: "carreras",
    keywords: ["necesito saber biologia", "antes", "biologia computacional"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de biologia computacional",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **185 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "biologia computacional"]
  },
  {
    question: "donde consigo el pensum de biologia computacional",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "biologia computacional"]
  }
];

async function addBiologiaComputacionalFAQs() {
  console.log('🧬 Adding Biología y Química Computacional Curriculum FAQs\n');
  console.log(`📋 Found ${biologiaComputacionalFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = biologiaComputacionalFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = biologiaComputacionalFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-biologia-computacional',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Biología y Química Computacional'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-biologia-computacional',
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
  
  console.log(`✅ Added ${data.length} Biología y Química Computacional curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (4 FAQs)');
  console.log('   - Semestres avanzados (4 FAQs)');
  console.log('   - Laboratorios rotatorios (2 FAQs)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Física (1 FAQ)');
  console.log('   - Programación (2 FAQs)');
  console.log('   - Química (1 FAQ)');
  console.log('   - Biología (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (3 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Biología y Química Computacional!\n');
}

addBiologiaComputacionalFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
