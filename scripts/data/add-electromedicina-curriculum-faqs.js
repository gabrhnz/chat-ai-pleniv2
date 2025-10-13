#!/usr/bin/env node

/**
 * Add Electromedicina Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Ingeniería en Electromedicina
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

const electromedicinaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene electromedicina",
    answer: "La carrera tiene **191 UC** (Unidades de Crédito) en total, distribuidas en **8 semestres**. 🏥⚡",
    category: "carreras",
    keywords: ["UC", "unidades credito", "electromedicina"]
  },
  {
    question: "que materias tiene electromedicina",
    answer: "Tiene materias como: **Imagenología Médica**, **Diseño de Equipos Médicos**, **Mantenimiento de Equipos**, **Radiofísica**, **Protección Radiológica**, **Diagnóstico por Imagen**, **Materiales Biomédicos**, **Morfofisiología**, y más. 🏥🔧",
    category: "carreras",
    keywords: ["materias", "asignaturas", "electromedicina"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de electromedicina",
    answer: "En **Semestre I** (20 UC) ves: **Matemática I**, Pensamiento Crítico, Bioética, **Química General**, **Introducción a Electromedicina**. La base fundamental. 🏥📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "electromedicina"]
  },
  {
    question: "hay quimica en electromedicina",
    answer: "Sí, **Química General** en Semestre I y **Laboratorio de Química Integrada** en Semestre II. Necesaria para entender materiales y reacciones. ⚗️🔬",
    category: "carreras",
    keywords: ["quimica", "química", "electromedicina"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de electromedicina",
    answer: "En **Semestre II** ves: **Morfofisiología**, **Estadística**, **Física I**, **Inglés I aplicado a Electromedicina**, **Laboratorio de Química**, **Seminario I**. 🔬📊",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "electromedicina"]
  },
  {
    question: "que es morfofisiologia",
    answer: "**Morfofisiología** estudia la estructura (anatomía) y función (fisiología) del cuerpo humano. Esencial para entender cómo funcionan los equipos médicos en el cuerpo. En Semestre II. 🫀🔬",
    category: "carreras",
    keywords: ["morfofisiologia", "morfofisiología", "anatomia", "electromedicina"]
  },
  {
    question: "hay ingles en electromedicina",
    answer: "Sí, **Inglés I aplicado a Electromedicina** en Semestre II. Importante porque manuales técnicos y documentación están en inglés. 🇬🇧🏥",
    category: "carreras",
    keywords: ["ingles", "inglés", "electromedicina"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de electromedicina",
    answer: "En **Semestre III** ves: **Física II**, **Materiales e Instrumentación Biomédica**, **Laboratorio de Física II**, **Imagenología Médica**, **Radiofísica Sanitaria**, **Protección Radiológica**. Más especializado. 🏥⚡",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "electromedicina"]
  },
  {
    question: "que es imagenologia medica",
    answer: "**Imagenología Médica** estudia equipos de diagnóstico por imagen: rayos X, tomografía, resonancia magnética, ecografía. Cómo funcionan y cómo mantenerlos. En Semestre III. 🏥📸",
    category: "carreras",
    keywords: ["imagenologia", "imagenología", "medica", "electromedicina"]
  },
  {
    question: "que es radiofisica sanitaria",
    answer: "**Radiofísica Sanitaria** estudia la física de las radiaciones en medicina: cómo funcionan los rayos X, dosis de radiación, seguridad. En Semestre III. ☢️🏥",
    category: "carreras",
    keywords: ["radiofisica", "radiofísica", "sanitaria", "electromedicina"]
  },
  {
    question: "que es proteccion radiologica",
    answer: "**Protección Radiológica** enseña a proteger pacientes y personal médico de la radiación: blindaje, dosimetría, normas de seguridad. En Semestre III. 🛡️☢️",
    category: "carreras",
    keywords: ["proteccion radiologica", "radiológica", "electromedicina"]
  },
  {
    question: "veo materiales biomedicos",
    answer: "Sí, **Materiales e Instrumentación Biomédica** en Semestre III. Aprendes sobre materiales usados en equipos médicos, implantes, sensores. 🔬🏥",
    category: "carreras",
    keywords: ["materiales biomedicos", "biomédicos", "electromedicina"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de electromedicina",
    answer: "En **Semestre IV** ves: **Diseño de Equipos Médicos**, **Diagnóstico por Imagen**, **Mantenimiento de Equipos Médicos**, **Ética Profesional y Legislación Sanitaria**, **Seminario II**. Muy práctico. 🔧🏥",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "electromedicina"]
  },
  {
    question: "veo diseño de equipos medicos",
    answer: "Sí, **Diseño de Equipos Médicos** en Semestre IV. Aprendes a diseñar y desarrollar dispositivos médicos, considerando seguridad y funcionalidad. 🔧💡",
    category: "carreras",
    keywords: ["diseño equipos medicos", "médicos", "electromedicina"]
  },
  {
    question: "cuando veo mantenimiento de equipos",
    answer: "**Mantenimiento de Equipos Médicos** lo ves en **Semestre IV**. Aprendes a mantener, calibrar y reparar equipos hospitalarios. Muy práctico. 🔧🏥",
    category: "carreras",
    keywords: ["mantenimiento equipos", "cuando", "electromedicina"]
  },
  {
    question: "que es diagnostico por imagen",
    answer: "**Diagnóstico por Imagen** profundiza en técnicas de imagen médica: TAC, resonancia, ultrasonido, medicina nuclear. Cómo interpretar y mantener equipos. En Semestre IV. 🏥📊",
    category: "carreras",
    keywords: ["diagnostico imagen", "diagnóstico", "electromedicina"]
  },
  {
    question: "veo leyes en electromedicina",
    answer: "Sí, **Ética Profesional y Legislación Sanitaria** en Semestre IV. Aprendes normas, regulaciones médicas, responsabilidad profesional. ⚖️🏥",
    category: "carreras",
    keywords: ["leyes", "legislacion", "legislación", "etica", "electromedicina"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de electromedicina",
    answer: "En **Semestres V-VIII** ves materias avanzadas de tecnología médica, **Pasantías** en hospitales, **Proyecto Final de Grado**, prácticas profesionales con equipos reales. 🏥🚀",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "electromedicina"]
  },

  // EQUIPOS ESPECÍFICOS
  {
    question: "que equipos medicos veo en electromedicina",
    answer: "Ves: **rayos X**, **tomógrafos**, **resonancia magnética**, **ecógrafos**, **electrocardiógrafos**, **monitores de signos vitales**, **equipos de electrocirugía**, **ventiladores**, **bombas de infusión**, y más. 🏥⚡",
    category: "carreras",
    keywords: ["equipos medicos", "médicos", "cuales", "electromedicina"]
  },
  {
    question: "veo resonancia magnetica",
    answer: "Sí, estudias **resonancia magnética** en Imagenología y Diagnóstico por Imagen. Aprendes cómo funciona, mantenimiento, seguridad. 🧲🏥",
    category: "carreras",
    keywords: ["resonancia magnetica", "magnética", "MRI", "electromedicina"]
  },
  {
    question: "veo rayos x",
    answer: "Sí, estudias **rayos X** en varias materias: Imagenología, Radiofísica, Protección Radiológica. Cómo funcionan, mantenimiento, seguridad. ☢️🏥",
    category: "carreras",
    keywords: ["rayos x", "radiografia", "electromedicina"]
  },
  {
    question: "veo tomografia",
    answer: "Sí, estudias **tomografía (TAC/CT)** en Imagenología y Diagnóstico por Imagen. Funcionamiento, mantenimiento, interpretación. 🏥📸",
    category: "carreras",
    keywords: ["tomografia", "tomografía", "TAC", "CT", "electromedicina"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en electromedicina",
    answer: "Sí, varios: **Laboratorio de Química**, **Laboratorio de Física II**, y prácticas con equipos médicos reales en semestres avanzados. 🔬🏥",
    category: "carreras",
    keywords: ["laboratorios", "labs", "electromedicina"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en electromedicina",
    answer: "Sí, hay **Pasantías** en semestres avanzados donde trabajas en hospitales, clínicas, empresas de equipos médicos. Experiencia real. 💼🏥",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "electromedicina"]
  },
  {
    question: "donde hago pasantias en electromedicina",
    answer: "Puedes hacer pasantías en **hospitales**, **clínicas**, **empresas de equipos médicos** (GE Healthcare, Siemens, Philips), **centros de diagnóstico**. 🏥💼",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "electromedicina"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en electromedicina",
    answer: "Sí, hay **Proyecto Final de Grado** donde desarrollas o mejoras un equipo médico, sistema de mantenimiento, o investigación aplicada. 🎓🔧",
    category: "carreras",
    keywords: ["tesis", "proyecto grado", "electromedicina"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en electromedicina",
    answer: "Los **Seminarios** (I, II) son espacios para presentar casos clínicos, discutir tecnología médica, preparar tu proyecto de grado. 🎤🏥",
    category: "carreras",
    keywords: ["seminarios", "electromedicina"]
  },

  // MATEMÁTICAS Y FÍSICA
  {
    question: "cuanta matematica tiene electromedicina",
    answer: "Tiene **Matemática I** y **Estadística**, más matemáticas aplicadas en física y electrónica. Es manejable. 📐📊",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "electromedicina"]
  },
  {
    question: "cuanta fisica tiene electromedicina",
    answer: "Tiene **Física I y II** con laboratorios. Fundamental para entender cómo funcionan los equipos médicos. ⚛️🔬",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "electromedicina"]
  },
  {
    question: "hay estadistica en electromedicina",
    answer: "Sí, **Estadística** en **Semestre II**. Útil para análisis de datos clínicos, investigación, control de calidad. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "electromedicina"]
  },

  // ELECTRÓNICA Y PROGRAMACIÓN
  {
    question: "hay electronica en electromedicina",
    answer: "Sí, estudias electrónica aplicada a equipos médicos: circuitos, sensores, actuadores. Fundamental para la carrera. ⚡🔌",
    category: "carreras",
    keywords: ["electronica", "electrónica", "electromedicina"]
  },
  {
    question: "hay programacion en electromedicina",
    answer: "Sí, algo de programación para control de equipos, análisis de datos, software médico. No es el foco principal pero es útil. 💻🏥",
    category: "carreras",
    keywords: ["programacion", "programación", "electromedicina"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de electromedicina",
    answer: "Es exigente con física, química y tecnología médica, pero si te gusta la medicina y la tecnología, es manejable. Muy práctica. 💪🏥",
    category: "carreras",
    keywords: ["pesada", "dificil", "electromedicina"]
  },
  {
    question: "cuantas materias por semestre en electromedicina",
    answer: "Varía entre **5-6 materias** por semestre, dependiendo de las UC y laboratorios. 📚🏥",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "electromedicina"]
  },

  // CERTIFICACIONES Y REGULACIONES
  {
    question: "necesito certificaciones en electromedicina",
    answer: "Sí, después de graduarte puedes certificarte en **mantenimiento de equipos específicos**, **protección radiológica**, **gestión de tecnología hospitalaria**. 🎓📋",
    category: "carreras",
    keywords: ["certificaciones", "electromedicina"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre electromedicina y biomateriales",
    answer: "**Electromedicina** trabaja con equipos médicos electrónicos (rayos X, monitores). **Biomateriales** diseña materiales para implantes y prótesis. Ambas son tech médico pero diferentes enfoques. 🏥🔧",
    category: "carreras",
    keywords: ["diferencia", "electromedicina", "biomateriales"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber medicina antes de electromedicina",
    answer: "No, te enseñan lo necesario de anatomía y fisiología. Es más ingeniería que medicina. Te enfocas en la tecnología médica. 🔧🏥",
    category: "carreras",
    keywords: ["necesito saber medicina", "antes", "electromedicina"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en hospitales con electromedicina",
    answer: "Sí, puedes trabajar en **departamentos de ingeniería biomédica** de hospitales, manteniendo y gestionando equipos médicos. 🏥🔧",
    category: "carreras",
    keywords: ["trabajo hospitales", "electromedicina"]
  },
  {
    question: "puedo trabajar en empresas de equipos medicos",
    answer: "Sí, puedes trabajar en **GE Healthcare**, **Siemens Healthineers**, **Philips**, **Medtronic**, diseñando, vendiendo o dando soporte técnico. 💼🏥",
    category: "carreras",
    keywords: ["empresas equipos medicos", "médicos", "electromedicina"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de electromedicina",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **191 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "electromedicina"]
  },
  {
    question: "donde consigo el pensum de electromedicina",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "electromedicina"]
  }
];

async function addElectromedicinaFAQs() {
  console.log('🏥 Adding Electromedicina Curriculum FAQs\n');
  console.log(`📋 Found ${electromedicinaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = electromedicinaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = electromedicinaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-electromedicina',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Ingeniería en Electromedicina'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-electromedicina',
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
  
  console.log(`✅ Added ${data.length} Electromedicina curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (3 FAQs)');
  console.log('   - Semestre III (5 FAQs)');
  console.log('   - Semestre IV (5 FAQs)');
  console.log('   - Semestres avanzados (1 FAQ)');
  console.log('   - Equipos específicos (4 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y física (3 FAQs)');
  console.log('   - Electrónica y programación (2 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Certificaciones (1 FAQ)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Áreas de trabajo (2 FAQs)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 41 FAQs sobre malla curricular de Electromedicina!\n');
}

addElectromedicinaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
