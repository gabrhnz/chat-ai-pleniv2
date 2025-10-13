#!/usr/bin/env node

/**
 * Add Nanotecnología Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Nanotecnología
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

const nanotecnologiaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene nanotecnologia",
    answer: "La carrera tiene **182 UC** en total, distribuidas en **8 semestres**. ⚛️🔬",
    category: "carreras",
    keywords: ["UC", "unidades credito", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que materias tiene nanotecnologia",
    answer: "Tiene materias como: **Síntesis de Nanomateriales**, **Técnicas de Microscopía**, **Caracterización de Nanomateriales**, **Física del Estado Sólido**, **Mecánica Cuántica**, **Electroquímica**, **Física Moderna**, **Química Inorgánica**. ⚛️🔬",
    category: "carreras",
    keywords: ["materias", "asignaturas", "nanotecnologia", "nanotecnología"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de nanotecnologia",
    answer: "En **Semestre I** (22 UC) ves: **Química General**, **Matemática I**, **Introducción a la Nanotecnología**, Bioética, Pensamiento Crítico. La base fundamental. ⚛️📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que es introduccion a nanotecnologia",
    answer: "**Introducción a la Nanotecnología** enseña conceptos básicos: escala nanométrica, aplicaciones, historia, fundamentos científicos. En Semestre I. ⚛️🔬",
    category: "carreras",
    keywords: ["introduccion nanotecnologia", "que es", "nanotecnologia"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de nanotecnologia",
    answer: "En **Semestre II** (25 UC) ves: **Física I**, **Matemática II**, **Biología General**, Educación Física, **Programación**, **Laboratorio de Química Integrada**. Desarrollo interdisciplinario. ⚛️🔬",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "hay programacion en nanotecnologia",
    answer: "Sí, **Programación** en **Semestre II**. Útil para simulaciones de nanomateriales y análisis de datos. 💻⚛️",
    category: "carreras",
    keywords: ["programacion", "programación", "nanotecnologia"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de nanotecnologia",
    answer: "En **Semestre III** (26 UC) ves: **Física II**, **Matemática III**, **Química Orgánica**, **Biología Celular**, Metodología de Investigación, **Física I**. Más especializado. ⚛️🔬",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "cuando veo biologia celular en nanotecnologia",
    answer: "**Biología Celular** la ves en el **Semestre III**. Importante para entender interacciones nanomateriales-células. 🦠⚛️",
    category: "carreras",
    keywords: ["biologia celular", "cuando", "nanotecnologia"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de nanotecnologia",
    answer: "En **Semestre IV** (21 UC) ves: **Física III**, **Métodos Matemáticos I**, **Química Inorgánica**, **Laboratorio de Física, Mecánica y Electricidad**, Electiva. Aplicaciones prácticas. ⚛️🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que es metodos matematicos en nanotecnologia",
    answer: "**Métodos Matemáticos I** enseña herramientas matemáticas para nanotecnología: cálculo vectorial, ecuaciones diferenciales aplicadas. En Semestre IV. 📐⚛️",
    category: "carreras",
    keywords: ["metodos matematicos", "que es", "nanotecnologia"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de nanotecnologia",
    answer: "En **Semestre V** (24 UC) ves: **Seminario I**, **Física Moderna**, **Síntesis de Nanomateriales**, **Laboratorio de Materiales**, **Electroquímica**, Electiva. Producción de nanomateriales. ⚛️🔬",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que es sintesis de nanomateriales",
    answer: "**Síntesis de Nanomateriales** enseña métodos para crear materiales a escala nano: químicos, físicos, biológicos. En Semestre V. ⚗️⚛️",
    category: "carreras",
    keywords: ["sintesis nanomateriales", "que es", "nanotecnologia"]
  },
  {
    question: "que es electroquimica",
    answer: "**Electroquímica** estudia procesos químicos con transferencia de electrones: baterías, corrosión, síntesis electroquímica. En Semestre V. ⚡⚗️",
    category: "carreras",
    keywords: ["electroquimica", "que es", "nanotecnologia"]
  },

  // SEMESTRE VI
  {
    question: "que veo en sexto semestre de nanotecnologia",
    answer: "En **Semestre VI** (26 UC) ves: **Introducción a la Mecánica Cuántica**, **Técnicas de Microscopía**, **Seminario II**, **Técnicas de Caracterización de Nanomateriales**, **Pasantía I**, Electiva. Análisis y caracterización. ⚛️🔬",
    category: "carreras",
    keywords: ["sexto semestre", "semestre 6", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que es tecnicas de microscopia",
    answer: "**Técnicas de Microscopía** enseña microscopios avanzados: electrónico, de fuerza atómica, confocal. Esenciales para ver nanomateriales. 🔬⚛️",
    category: "carreras",
    keywords: ["tecnicas microscopia", "que es", "nanotecnologia"]
  },
  {
    question: "que es caracterizacion de nanomateriales",
    answer: "**Técnicas de Caracterización de Nanomateriales** enseña métodos para analizar propiedades nano: XRD, TEM, AFM, espectroscopía. En Semestre VI. 🔬⚛️",
    category: "carreras",
    keywords: ["caracterizacion nanomateriales", "que es", "nanotecnologia"]
  },

  // SEMESTRE VII
  {
    question: "que veo en septimo semestre de nanotecnologia",
    answer: "En **Semestre VII** (26 UC) ves: **Física del Estado Sólido**, Seminario de Trabajo Especial de Grado, Proyecto Sociotecnológico, **Laboratorio de Nanotecnología**, **Pasantía II**, Electiva. Aplicaciones avanzadas. 🚀⚛️",
    category: "carreras",
    keywords: ["septimo semestre", "semestre 7", "nanotecnologia", "nanotecnología"]
  },
  {
    question: "que es fisica del estado solido",
    answer: "**Física del Estado Sólido** estudia propiedades físicas de sólidos: cristales, semiconductores, superconductores aplicados a nano. En Semestre VII. 🔬💎",
    category: "carreras",
    keywords: ["fisica estado solido", "que es", "nanotecnologia"]
  },

  // SEMESTRE VIII
  {
    question: "que veo en octavo semestre de nanotecnologia",
    answer: "En **Semestre VIII** (18 UC) ves: **Pasantía III**, **Trabajo Especial de Grado**. Culminación práctica. 🎓⚛️",
    category: "carreras",
    keywords: ["octavo semestre", "semestre 8", "nanotecnologia", "nanotecnología"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en nanotecnologia",
    answer: "Sí, varios: **Laboratorio de Química Integrada**, **Laboratorio de Física, Mecánica y Electricidad**, **Laboratorio de Materiales**, **Laboratorio de Nanotecnología**. Muy prácticos. 🔬⚛️",
    category: "carreras",
    keywords: ["laboratorios", "labs", "nanotecnologia"]
  },
  {
    question: "cuantos laboratorios tiene nanotecnologia",
    answer: "Tiene varios labs especializados: química integrada, física-mecánica-electricidad, materiales, nanotecnología. Es muy experimental. 🔬⚛️",
    category: "carreras",
    keywords: ["cuantos laboratorios", "nanotecnologia"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en nanotecnologia",
    answer: "Sí, **Pasantía I, II y III** en semestres finales. Trabajas en laboratorios de nanotecnología, empresas de nanomateriales. 💼⚛️",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "nanotecnologia"]
  },
  {
    question: "donde hago pasantias en nanotecnologia",
    answer: "Puedes hacer pasantías en **laboratorios universitarios**, **centros de investigación nano**, **empresas farmacéuticas**, **empresas de semiconductores**, **centros tecnológicos**. 🏭⚛️",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "nanotecnologia"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en nanotecnologia",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación o aplicación nanotecnológica original. 🎓⚛️",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "nanotecnologia"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en nanotecnologia",
    answer: "Sí, hay **Electivas** en varios semestres donde puedes especializarte en áreas específicas de nanotecnología. 🎯⚛️",
    category: "carreras",
    keywords: ["electivas", "optativas", "nanotecnologia"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en nanotecnologia",
    answer: "Los **Seminarios** (I, II, Trabajo Especial de Grado) discuten avances nanotecnológicos, ética, aplicaciones, preparación de investigación. 🎤⚛️",
    category: "carreras",
    keywords: ["seminarios", "nanotecnologia"]
  },

  // MATEMÁTICAS Y FÍSICA
  {
    question: "cuanta matematica tiene nanotecnologia",
    answer: "Tiene **Matemática I, II, III**, **Métodos Matemáticos I**. Suficiente para modelado matemático aplicado a nano. 📐⚛️",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "nanotecnologia"]
  },
  {
    question: "cuanta fisica tiene nanotecnologia",
    answer: "Bastante. Tiene **Física I, II, III**, **Física Moderna**, **Física del Estado Sólido**, **Mecánica Cuántica**. Esencial para nanotecnología. ⚛️🔬",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "nanotecnologia"]
  },

  // QUÍMICA Y BIOLOGÍA
  {
    question: "cuanta quimica tiene nanotecnologia",
    answer: "Tiene **Química General**, **Química Orgánica**, **Química Inorgánica**, **Electroquímica**. Fundamental para síntesis nano. ⚗️⚛️",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "nanotecnologia"]
  },
  {
    question: "hay biologia en nanotecnologia",
    answer: "Sí, **Biología General** y **Biología Celular**. Importante para aplicaciones biomédicas de nanotecnología. 🦠⚛️",
    category: "carreras",
    keywords: ["biologia", "biología", "nanotecnologia"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene nanotecnologia",
    answer: "Tiene **Programación** en Semestre II. Se usa para simulaciones, análisis de datos nano, modelado computacional. 💻⚛️",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "nanotecnologia"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de nanotecnologia",
    answer: "Es exigente con física, química y experimentos, pero si te apasiona la nanotecnología, es fascinante. Muy práctica y futurista. 💪⚛️",
    category: "carreras",
    keywords: ["pesada", "dificil", "nanotecnologia"]
  },
  {
    question: "cuantas materias por semestre en nanotecnologia",
    answer: "Varía entre **5-7 materias** por semestre, incluyendo laboratorios especializados. 📚⚛️",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "nanotecnologia"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en medicina con nanotecnologia",
    answer: "Sí, puedes trabajar en **medicina nanotecnológica**: fármacos nano, diagnóstico molecular, terapia génica, implantes nano. 🏥⚛️",
    category: "carreras",
    keywords: ["trabajo medicina", "nanotecnologia"]
  },
  {
    question: "trabajo en electronica con nanotecnologia",
    answer: "Sí, puedes trabajar en **electrónica nano**: semiconductores, transistores nano, sensores, computación cuántica. 💻⚡",
    category: "carreras",
    keywords: ["trabajo electronica", "electrónica", "nanotecnologia"]
  },
  {
    question: "trabajo en energia con nanotecnologia",
    answer: "Sí, puedes trabajar en **energía renovable**: paneles solares nano, baterías, almacenamiento de energía, catalizadores. ⚡🌱",
    category: "carreras",
    keywords: ["trabajo energia", "nanotecnologia"]
  },
  {
    question: "trabajo en investigacion nano",
    answer: "Sí, puedes trabajar en **investigación nanotecnológica** en universidades, centros como IVIC, empresas R&D. 🔬⚛️",
    category: "carreras",
    keywords: ["trabajo investigacion", "investigación", "nanotecnologia"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre nanotecnologia y fisica",
    answer: "**Nanotecnología** aplica física, química y biología a escala nano. **Física** es más general. Nanotecnología es interdisciplinaria aplicada. ⚛️🔬 vs ⚛️📐",
    category: "carreras",
    keywords: ["diferencia", "nanotecnologia", "fisica"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber fisica antes de nanotecnologia",
    answer: "No, te enseñan física desde cero. Pero ayuda tener interés en ciencia y tecnología avanzada. ⚛️📚",
    category: "carreras",
    keywords: ["necesito saber fisica", "antes", "nanotecnologia"]
  },

  // PROYECTO SOCIOTECNOLÓGICO
  {
    question: "hay proyecto sociotecnologico en nanotecnologia",
    answer: "Sí, **Proyecto Sociotecnológico e Innovador** en Semestre VII. Aplicas nanotecnología a problemas sociales: agua limpia, medicina accesible, etc. 🤝⚛️",
    category: "carreras",
    keywords: ["proyecto sociotecnologico", "sociotecnológico", "nanotecnologia"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de nanotecnologia",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **182 UC** con especializaciones nano. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "nanotecnologia"]
  },
  {
    question: "donde consigo el pensum de nanotecnologia",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las aplicaciones: medicina, electrónica, energía. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "nanotecnologia"]
  }
];

async function addNanotecnologiaFAQs() {
  console.log('⚛️ Adding Nanotecnología Curriculum FAQs\n');
  console.log(`📋 Found ${nanotecnologiaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = nanotecnologiaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = nanotecnologiaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-nanotecnologia',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Nanotecnología'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-nanotecnologia',
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
  
  console.log(`✅ Added ${data.length} Nanotecnología curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (2 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestre V (3 FAQs)');
  console.log('   - Semestre VI (3 FAQs)');
  console.log('   - Semestre VII (2 FAQs)');
  console.log('   - Semestre VIII (1 FAQ)');
  console.log('   - Laboratorios (2 FAQs)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y física (2 FAQs)');
  console.log('   - Química y biología (2 FAQs)');
  console.log('   - Programación (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Proyecto sociotecnológico (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 46 FAQs sobre malla curricular de Nanotecnología!\n');
}

addNanotecnologiaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
