#!/usr/bin/env node

/**
 * Add Oceanología Curriculum FAQs
 *
 * FAQs sobre la malla curricular de Licenciatura en Oceanología
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

const oceanologiaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene oceanologia",
    answer: "La carrera tiene **185 UC** en total, distribuidas en **8 semestres**. 🌊🐋",
    category: "carreras",
    keywords: ["UC", "unidades credito", "oceanologia", "oceanografía"]
  },
  {
    question: "que materias tiene oceanologia",
    answer: "Tiene materias como: **Oceanología Química**, **Geología Marina**, **Biología Marina**, **Dinámica de Fluidos Oceánicos**, **Gestión de Zonas Costeras**, **Oceanología Física**, **Oceanología Satelital**, **Ciclos Biogeoquímicos**, **Microbiología Marina**. 🌊🔬",
    category: "carreras",
    keywords: ["materias", "asignaturas", "oceanologia", "oceanografía"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de oceanologia",
    answer: "En **Semestre I** (23 UC) ves: **Matemática I**, **Química General**, Bioética, **Introducción a la Oceanología**, Pensamiento Crítico. Los fundamentos oceánicos. 🌊📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "oceanologia", "oceanografía"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de oceanologia",
    answer: "En **Semestre II** (24 UC) ves: Metodología de Investigación, **Física II**, **Geología Marina**, **Biología Marina**, **Estadística**, **Oceanología Química**. Ciencia oceánica aplicada. 🌊🔬",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "oceanologia", "oceanografía"]
  },
  {
    question: "que es geologia marina",
    answer: "**Geología Marina** estudia fondo oceánico, volcanes submarinos, sedimentos marinos, tectónica de placas oceánicas. En Semestre II. 🌊🗿",
    category: "carreras",
    keywords: ["geologia marina", "que es", "oceanologia"]
  },
  {
    question: "que es biologia marina",
    answer: "**Biología Marina** estudia organismos marinos: peces, mamíferos marinos, algas, bacterias oceánicas, ecosistemas marinos. En Semestre II. 🐋🌊",
    category: "carreras",
    keywords: ["biologia marina", "que es", "oceanologia"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de oceanologia",
    answer: "En **Semestre III** (30 UC) ves: **Física I**, **Biología General**, **Matemática I**, **Química General**, **Biología Pesquera**, **Estresores Marinos**. Ecología y recursos marinos. 🌊🐟",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "oceanologia", "oceanografía"]
  },
  {
    question: "que es biologia pesquera",
    answer: "**Biología Pesquera** estudia especies comerciales, reproducción, crecimiento de peces, gestión sostenible de pesquerías. En Semestre III. 🐟🌊",
    category: "carreras",
    keywords: ["biologia pesquera", "que es", "oceanologia"]
  },
  {
    question: "que son estresores marinos",
    answer: "**Estresores Marinos** estudia contaminantes, cambio climático, acidificación oceánica, impacto humano en ecosistemas marinos. En Semestre III. 🌊⚠️",
    category: "carreras",
    keywords: ["estresores marinos", "que son", "oceanologia"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de oceanologia",
    answer: "En **Semestre IV** (28 UC) ves: **Oceanología Geológica**, **Hidrogeoquímica**, **Seminario I**, Electiva, **Biología General**, **Geofísica**, **Química**. Especialización técnica. 🌊🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "oceanologia", "oceanografía"]
  },
  {
    question: "que es hidrogeoquimica",
    answer: "**Hidrogeoquímica** estudia composición química del agua marina, procesos geoquímicos oceánicos, ciclos de nutrientes. En Semestre IV. 🌊⚗️",
    category: "carreras",
    keywords: ["hidrogeoquimica", "que es", "oceanologia"]
  },
  {
    question: "que es oceanologia geologica",
    answer: "**Oceanología Geológica** estudia formación de océanos, historia geológica marina, procesos sedimentarios oceánicos. En Semestre IV. 🌊🗿",
    category: "carreras",
    keywords: ["oceanologia geologica", "que es", "oceanologia"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de oceanologia",
    answer: "En **Semestre V** (24 UC) ves: **Proyecto Sociotecnológico**, **Dinámica de Fluidos Oceánicos**, **Gestión de Zonas Costeras**, **Pasantía II**, Seminario de Trabajo Especial de Grado, Electiva. Aplicación práctica. 🌊💼",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "oceanologia", "oceanografía"]
  },
  {
    question: "que es dinamica de fluidos oceanicos",
    answer: "**Dinámica de Fluidos Oceánicos** estudia corrientes marinas, ondas, mareas, circulación oceánica global. En Semestre V. 🌊🌊",
    category: "carreras",
    keywords: ["dinamica fluidos oceanicos", "que es", "oceanologia"]
  },
  {
    question: "que es gestion de zonas costeras",
    answer: "**Gestión de Zonas Costeras e Insulares** estudia planificación costera, conservación marina, desarrollo sostenible litoral. En Semestre V. 🏖️🌊",
    category: "carreras",
    keywords: ["gestion zonas costeras", "que es", "oceanologia"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de oceanologia",
    answer: "En **Semestres VI-VIII** ves: **Oceanología Física**, **Oceanología Satelital**, **Oceanología Biológica**, **Ciclos Biogeoquímicos**, **Microbiología Marina**, **Biogeoquímica Ambiental**, **Contaminación Marina**, **Técnicas de Muestreo**, **Pasantías**, **Trabajo de Grado**. 🚀🌊",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "oceanologia", "oceanografía"]
  },
  {
    question: "que es oceanologia fisica",
    answer: "**Oceanología Física** estudia propiedades físicas del océano: temperatura, salinidad, densidad, óptica marina, acústica. En semestres avanzados. 🌊⚛️",
    category: "carreras",
    keywords: ["oceanologia fisica", "que es", "oceanologia"]
  },
  {
    question: "que es oceanologia satelital",
    answer: "**Oceanología Satelital** usa satélites para monitorear océanos: temperatura superficial, corrientes, nivel del mar, fitoplancton. En semestres avanzados. 🛰️🌊",
    category: "carreras",
    keywords: ["oceanologia satelital", "que es", "oceanologia"]
  },
  {
    question: "que es oceanologia biologica",
    answer: "**Oceanología Biológica** estudia vida marina: productividad primaria, cadenas tróficas, biodiversidad oceánica, adaptación marina. En semestres avanzados. 🐋🌊",
    category: "carreras",
    keywords: ["oceanologia biologica", "que es", "oceanologia"]
  },
  {
    question: "que son ciclos biogeoquimicos",
    answer: "**Ciclos Biogeoquímicos** estudia circulación de nutrientes en océanos: carbono, nitrógeno, fósforo, oxígeno, impacto del cambio climático. En semestres avanzados. 🔄🌊",
    category: "carreras",
    keywords: ["ciclos biogeoquimicos", "que son", "oceanologia"]
  },
  {
    question: "que es microbiologia marina",
    answer: "**Microbiología Marina** estudia bacterias, virus, protistas oceánicos, su rol en ciclos biogeoquímicos y contaminación. En semestres avanzados. 🦠🌊",
    category: "carreras",
    keywords: ["microbiologia marina", "que es", "oceanologia"]
  },
  {
    question: "que es contaminacion marina",
    answer: "**Contaminación Marina** estudia impacto de plásticos, metales pesados, hidrocarburos, eutrofización en ecosistemas oceánicos. En semestres avanzados. 🌊⚠️",
    category: "carreras",
    keywords: ["contaminacion marina", "que es", "oceanologia"]
  },

  // LABORATORIOS Y PRÁCTICAS
  {
    question: "hay laboratorios en oceanologia",
    answer: "Sí, hay laboratorios de química marina, biología marina, geología marina, técnicas de muestreo, análisis instrumental. Muy práctico. 🔬🌊",
    category: "carreras",
    keywords: ["laboratorios", "labs", "oceanologia"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en oceanologia",
    answer: "Sí, hay **Pasantía II** en Semestre V y más pasantías en semestres avanzados. Trabajas en investigación marina, acuarios, empresas pesqueras. 💼🌊",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "oceanologia"]
  },
  {
    question: "donde hago pasantias en oceanologia",
    answer: "Puedes hacer pasantías en **IVIC**, **acuarios**, **empresas pesqueras**, **guardacostas**, **parques nacionales marinos**, **empresas ambientales**, **universidades**. 🐋💼",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "oceanologia"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en oceanologia",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación oceánica original: estudio de ecosistemas, impacto ambiental, modelado oceánico. 🎓🌊",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "oceanologia"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en oceanologia",
    answer: "Sí, hay **Electivas** en varios semestres donde puedes especializarte en biología marina, geología marina, oceanografía física, etc. 🎯🌊",
    category: "carreras",
    keywords: ["electivas", "optativas", "oceanologia"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en oceanologia",
    answer: "Los **Seminarios** (I, Trabajo Especial de Grado) discuten avances científicos, investigación marina, conservación oceánica. 🎤🌊",
    category: "carreras",
    keywords: ["seminarios", "oceanologia"]
  },

  // PROYECTO SOCIOTECNOLÓGICO
  {
    question: "hay proyecto sociotecnologico en oceanologia",
    answer: "Sí, **Proyecto Sociotecnológico e Innovador** en Semestre V. Aplicas oceanología a problemas sociales: pesca sostenible, contaminación costera, etc. 🤝🌊",
    category: "carreras",
    keywords: ["proyecto sociotecnologico", "sociotecnológico", "oceanologia"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene oceanologia",
    answer: "Tiene **Matemática I** y matemáticas aplicadas en modelado oceánico, estadística, dinámica de fluidos. 📐🌊",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "oceanologia"]
  },
  {
    question: "hay estadistica en oceanologia",
    answer: "Sí, **Estadística** en Semestre II. Esencial para análisis de datos oceanográficos, modelado estadístico. 📊🌊",
    category: "carreras",
    keywords: ["estadistica", "estadística", "oceanologia"]
  },

  // FÍSICA Y QUÍMICA
  {
    question: "cuanta fisica tiene oceanologia",
    answer: "Tiene **Física I y II**, **Geofísica**, oceanología física. Aplicada a procesos oceánicos. ⚛️🌊",
    category: "carreras",
    keywords: ["fisica", "física", "cuanta", "oceanologia"]
  },
  {
    question: "cuanta quimica tiene oceanologia",
    answer: "Tiene **Química General**, **Oceanología Química**, **Hidrogeoquímica**, química analítica instrumental. Aplicada a agua marina. ⚗️🌊",
    category: "carreras",
    keywords: ["quimica", "química", "cuanta", "oceanologia"]
  },

  // BIOLOGÍA
  {
    question: "cuanta biologia tiene oceanologia",
    answer: "Mucha. Tiene **Biología General** (dos veces), **Biología Marina**, **Biología Pesquera**, microbiología marina, ecología marina. 🐋🌊",
    category: "carreras",
    keywords: ["biologia", "biología", "cuanta", "oceanologia"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de oceanologia",
    answer: "Es exigente con ciencias básicas y especializadas, pero si te apasiona el mar y la investigación, es fascinante. Tiene mucho trabajo de campo. 💪🌊",
    category: "carreras",
    keywords: ["pesada", "dificil", "oceanologia"]
  },
  {
    question: "cuantas materias por semestre en oceanologia",
    answer: "Varía entre **5-7 materias** por semestre, incluyendo seminarios y proyectos. 📚🌊",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "oceanologia"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo en investigacion marina con oceanologia",
    answer: "Sí, puedes trabajar en **investigación oceanográfica** en universidades, IVIC, centros de investigación marina. 🔬🌊",
    category: "carreras",
    keywords: ["trabajo investigacion marina", "investigación", "oceanologia"]
  },
  {
    question: "trabajo en conservacion ambiental con oceanologia",
    answer: "Sí, puedes trabajar en **conservación marina**, **parques nacionales**, **ONGs ambientales**, gestión de áreas protegidas. 🌊🐋",
    category: "carreras",
    keywords: ["trabajo conservacion ambiental", "conservación", "oceanologia"]
  },
  {
    question: "trabajo en pesca con oceanologia",
    answer: "Sí, puedes trabajar en **industria pesquera**, **acuicultura**, **gestión de recursos marinos**, **biología pesquera**. 🐟🌊",
    category: "carreras",
    keywords: ["trabajo pesca", "pesquera", "oceanologia"]
  },
  {
    question: "trabajo en gobierno con oceanologia",
    answer: "Sí, puedes trabajar en **Ministerio del Ambiente**, **guardacostas**, **políticas ambientales**, **monitoreo costero**. 🏛️🌊",
    category: "carreras",
    keywords: ["trabajo gobierno", "oceanologia"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre oceanologia y biologia marina",
    answer: "**Oceanología** es interdisciplinaria (física, química, geología, biología). **Biología Marina** se enfoca solo en organismos marinos. Oceanología es más amplia. 🌊🔬 vs 🐋🔬",
    category: "carreras",
    keywords: ["diferencia", "oceanologia", "biologia marina"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito saber nadar para oceanologia",
    answer: "No es obligatorio, pero ayuda. El trabajo de campo incluye barcos y muestreo en mar, pero hay seguridad y equipo. 🚤🌊",
    category: "carreras",
    keywords: ["saber nadar", "nadar", "oceanologia"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de oceanologia",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **185 UC** con especialización en ciencias oceánicas. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "oceanologia"]
  },
  {
    question: "donde consigo el pensum de oceanologia",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las especialidades oceánicas que estudias. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "oceanologia"]
  }
];

async function addOceanologiaFAQs() {
  console.log('🌊 Adding Oceanología Curriculum FAQs\n');
  console.log(`📋 Found ${oceanologiaFAQs.length} FAQs to add\n`);

  console.log('🔢 Generating embeddings...');
  const questions = oceanologiaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');

  const faqsToInsert = oceanologiaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-oceanologia',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Oceanología'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-oceanologia',
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

  console.log(`✅ Added ${data.length} Oceanología curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (3 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (3 FAQs)');
  console.log('   - Semestre V (3 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Laboratorios (1 FAQ)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Proyecto sociotecnológico (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Física y química (2 FAQs)');
  console.log('   - Biología (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 43 FAQs sobre malla curricular de Oceanología!\n');
}

addOceanologiaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
