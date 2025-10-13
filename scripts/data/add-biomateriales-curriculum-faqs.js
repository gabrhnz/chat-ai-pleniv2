#!/usr/bin/env node

/**
 * Add Biomateriales Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Ingeniería en Biomateriales
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

const biomaterialesCurriculumFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene ingenieria en biomateriales",
    answer: "La carrera tiene **184 UC** (Unidades de Crédito) en total, distribuidas en **8 semestres**. 🧬🔬",
    category: "carreras",
    keywords: ["UC", "unidades credito", "biomateriales"]
  },
  {
    question: "cuantas horas semanales tiene biomateriales",
    answer: "Son **42 horas semanales** en total, incluyendo clases teóricas, prácticas, laboratorios y trabajo independiente. ⏰📚",
    category: "carreras",
    keywords: ["horas", "semanales", "biomateriales"]
  },
  {
    question: "que materias tiene ingenieria en biomateriales",
    answer: "Tiene materias como: **Química**, **Biología Molecular**, **Biocompatibilidad**, **Nanobiomateriales**, **Ciencia de Materiales**, **Anatomía y Fisiología**, **Aplicaciones en Medicina**, **Síntesis de Nanomateriales**, y más. 🧬💊",
    category: "carreras",
    keywords: ["materias", "asignaturas", "biomateriales"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de biomateriales",
    answer: "En **Semestre I** (22 UC) ves: **Química General**, **Matemática I**, Bioética y Bioseguridad, Pensamiento Crítico, **Introducción a la Ingeniería de Biomateriales**. Es la base. 🔬📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "biomateriales"]
  },
  {
    question: "hay quimica en biomateriales",
    answer: "Sí, mucha. Empiezas con **Química General** en Semestre I, luego **Química Orgánica**, **Bioquímica**, **Fisicoquímica**, **Química Ambiental**. Es fundamental. ⚗️🧪",
    category: "carreras",
    keywords: ["quimica", "química", "biomateriales"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de biomateriales",
    answer: "En **Semestre II** (24 UC) ves: **Física II**, **Estadística**, **Química Orgánica**, **Biología Celular**, **Ciencia de los Materiales I**, Metodología de Investigación. 🔬📊",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "biomateriales"]
  },
  {
    question: "cuando veo biologia celular",
    answer: "**Biología Celular** la ves en el **Semestre II**. Es clave para entender cómo interactúan los biomateriales con las células. 🦠🔬",
    category: "carreras",
    keywords: ["biologia celular", "cuando", "biomateriales"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de biomateriales",
    answer: "En **Semestre III** (25 UC) ves: **Bioquímica**, **Anatomía y Fisiología**, **Fisicoquímica**, **Seminario I**, y electivas. Más especializado. 🧬💊",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "biomateriales"]
  },
  {
    question: "hay anatomia en biomateriales",
    answer: "Sí, **Anatomía y Fisiología** en el **Semestre III**. Necesitas entender el cuerpo humano para diseñar biomateriales médicos. 🦴🫀",
    category: "carreras",
    keywords: ["anatomia", "anatomía", "biomateriales"]
  },
  {
    question: "cuando veo bioquimica en biomateriales",
    answer: "**Bioquímica** la ves en el **Semestre III**. Es esencial para entender reacciones biológicas y materiales. 🧬⚗️",
    category: "carreras",
    keywords: ["bioquimica", "bioquímica", "cuando", "biomateriales"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de biomateriales",
    answer: "En **Semestre IV** (26 UC) ves: **Física III**, **Biocompatibilidad**, Seminario de Trabajo Especial de Grado, Proyecto Sociotecnológico, **Biomateriales y Laboratorio III**, **Pasantía II**, electivas. 🔬💼",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "biomateriales"]
  },
  {
    question: "que es biocompatibilidad",
    answer: "**Biocompatibilidad** estudia cómo los materiales interactúan con el cuerpo sin causar rechazo. Es clave en biomateriales médicos. Lo ves en Semestre IV. 🧬✅",
    category: "carreras",
    keywords: ["biocompatibilidad", "que es", "biomateriales"]
  },
  {
    question: "hay pasantias en biomateriales",
    answer: "Sí, hay **Pasantía I y II** donde trabajas en empresas, hospitales o labs aplicando lo aprendido. Experiencia real. 💼🔬",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "biomateriales"]
  },

  // SEMESTRES AVANZADOS (V-VIII)
  {
    question: "que veo en los ultimos semestres de biomateriales",
    answer: "En **Semestres V-VIII** ves: **Biología Molecular**, **Síntesis de Nanomateriales**, **Nanobiomateriales**, **Aplicaciones de Materiales en Medicina**, **Química Ambiental**, **Aspectos Jurídicos**, **Trabajo Especial de Grado**. 🚀🧬",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "biomateriales"]
  },
  {
    question: "que es nanobiomateriales",
    answer: "**Nanobiomateriales** son materiales a escala nanométrica para aplicaciones médicas (drug delivery, implantes, etc). Lo ves en semestres avanzados. ⚛️💊",
    category: "carreras",
    keywords: ["nanobiomateriales", "nano", "biomateriales"]
  },
  {
    question: "cuando veo biologia molecular en biomateriales",
    answer: "**Biología Molecular** la ves en semestres avanzados (V-VIII). Estudias ADN, proteínas y su aplicación en biomateriales. 🧬🔬",
    category: "carreras",
    keywords: ["biologia molecular", "cuando", "biomateriales"]
  },
  {
    question: "veo aplicaciones medicas en biomateriales",
    answer: "Sí, hay **Aplicaciones de Materiales en Medicina** donde aprendes sobre implantes, prótesis, dispositivos médicos, etc. En semestres finales. 🏥💊",
    category: "carreras",
    keywords: ["aplicaciones medicas", "medicina", "biomateriales"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en biomateriales",
    answer: "Sí, varios: **Laboratorio de Química Integrada**, **Laboratorio de Mecánica y Electricidad**, **Biomateriales y Laboratorio III**, **Técnicas en Biología Molecular**. Muy práctico. 🔬🧪",
    category: "carreras",
    keywords: ["laboratorios", "labs", "biomateriales"]
  },
  {
    question: "cuantos laboratorios tiene biomateriales",
    answer: "Tiene varios labs a lo largo de la carrera: química, física, mecánica, biología molecular, y biomateriales. Es muy hands-on. 🔬👨‍🔬",
    category: "carreras",
    keywords: ["cuantos laboratorios", "biomateriales"]
  },

  // CIENCIAS BÁSICAS
  {
    question: "cuanta fisica tiene biomateriales",
    answer: "Tiene **Física I, II y III** en los primeros semestres, más física aplicada en otras materias. Es importante pero manejable. ⚛️📐",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "biomateriales"]
  },
  {
    question: "cuanta matematica tiene biomateriales",
    answer: "Tiene **Matemática I** y matemáticas aplicadas en otras materias como Estadística y Fisicoquímica. No es tan pesado como otras ingenierías. 📐📊",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "biomateriales"]
  },
  {
    question: "hay estadistica en biomateriales",
    answer: "Sí, **Estadística** en el **Semestre II**. Es útil para análisis de datos experimentales. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "biomateriales"]
  },

  // PROGRAMACIÓN
  {
    question: "hay programacion en biomateriales",
    answer: "Sí, hay **Programación** en semestres intermedios. Útil para simulaciones y análisis de datos. 💻🔬",
    category: "carreras",
    keywords: ["programacion", "programación", "biomateriales"]
  },

  // SERVICIO COMUNITARIO
  {
    question: "hay servicio comunitario en biomateriales",
    answer: "Sí, el **Servicio Comunitario** es obligatorio (**120 horas**). Aplicas tus conocimientos ayudando a la comunidad. 🤝💚",
    category: "carreras",
    keywords: ["servicio comunitario", "biomateriales"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en biomateriales",
    answer: "Sí, hay **Trabajo Especial de Grado** en los últimos semestres donde desarrollas un proyecto de investigación o aplicación. 🎓🔬",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "biomateriales"]
  },
  {
    question: "que es el trabajo especial de grado",
    answer: "Es tu **proyecto final** donde investigas y desarrollas algo innovador en biomateriales (nuevo material, aplicación médica, etc). 🎓💡",
    category: "carreras",
    keywords: ["trabajo especial grado", "proyecto", "biomateriales"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en biomateriales",
    answer: "Sí, hay **electivas** desde Semestre III donde puedes elegir temas específicos según tus intereses. 🎯📚",
    category: "carreras",
    keywords: ["electivas", "optativas", "biomateriales"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en biomateriales",
    answer: "Los **Seminarios** son espacios para presentar investigaciones, discutir avances científicos y preparar tu trabajo de grado. Hay Seminario I, II, etc. 🎤📚",
    category: "carreras",
    keywords: ["seminarios", "biomateriales"]
  },

  // ÁREAS ESPECÍFICAS
  {
    question: "que es sintesis de nanomateriales",
    answer: "**Síntesis de Nanomateriales** enseña a crear materiales a escala nano para aplicaciones médicas y tecnológicas. En semestres avanzados. ⚛️🔬",
    category: "carreras",
    keywords: ["sintesis nanomateriales", "síntesis", "biomateriales"]
  },
  {
    question: "veo aspectos juridicos en biomateriales",
    answer: "Sí, **Aspectos Jurídicos en Biomateriales** te enseña sobre patentes, regulaciones médicas, ética profesional. En semestres finales. ⚖️📋",
    category: "carreras",
    keywords: ["aspectos juridicos", "jurídicos", "legal", "biomateriales"]
  },
  {
    question: "hay quimica ambiental en biomateriales",
    answer: "Sí, **Química Ambiental** en semestres avanzados. Importante para biomateriales sostenibles y su impacto ambiental. 🌱⚗️",
    category: "carreras",
    keywords: ["quimica ambiental", "química", "biomateriales"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de biomateriales",
    answer: "Es exigente (**42 horas semanales**, **184 UC**) con mucha química y biología, pero si te gusta la ciencia y medicina, es manejable. 💪🔬",
    category: "carreras",
    keywords: ["pesada", "dificil", "biomateriales"]
  },
  {
    question: "cuantas materias por semestre en biomateriales",
    answer: "Varía entre **5-7 materias** por semestre, dependiendo de las UC y laboratorios. 📚🔬",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "biomateriales"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre biomateriales y biotecnologia",
    answer: "**Biomateriales** se enfoca en crear materiales para medicina (implantes, prótesis). **Biotecnología** trabaja con organismos vivos (vacunas, fármacos). Ambas tienen biología pero aplicaciones diferentes. 🧬💊",
    category: "carreras",
    keywords: ["diferencia", "biomateriales", "biotecnologia"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber quimica antes de biomateriales",
    answer: "No necesitas ser experto, pero ayuda tener base de química de bachillerato. Te enseñan desde Química General. ⚗️📚",
    category: "carreras",
    keywords: ["necesito saber", "quimica", "antes", "biomateriales"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de biomateriales",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **184 UC**, con todas las materias. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "biomateriales"]
  },
  {
    question: "donde consigo el pensum de biomateriales",
    answer: "El pensum está en **unc.edu.ve** o en la oficina de admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa saber?",
    category: "carreras",
    keywords: ["pensum", "donde", "biomateriales"]
  }
];

async function addBiomaterialesCurriculumFAQs() {
  console.log('🧬 Adding Biomateriales Curriculum FAQs\n');
  console.log(`📋 Found ${biomaterialesCurriculumFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = biomaterialesCurriculumFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = biomaterialesCurriculumFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-biomateriales',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Ingeniería en Biomateriales'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-biomateriales',
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
  
  console.log(`✅ Added ${data.length} Biomateriales curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (3 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (3 FAQs)');
  console.log('   - Semestres avanzados (4 FAQs)');
  console.log('   - Laboratorios (2 FAQs)');
  console.log('   - Ciencias básicas (3 FAQs)');
  console.log('   - Programación (1 FAQ)');
  console.log('   - Servicio comunitario (1 FAQ)');
  console.log('   - Trabajo especial de grado (2 FAQs)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Áreas específicas (3 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 36 FAQs sobre malla curricular de Biomateriales!\n');
}

addBiomaterialesCurriculumFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
