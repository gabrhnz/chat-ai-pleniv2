#!/usr/bin/env node

/**
 * Add Filosofía Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Filosofía
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

const filosofiaFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene filosofia",
    answer: "La carrera tiene **184 UC** en total, distribuidas en **8 semestres**. 🤔📚",
    category: "carreras",
    keywords: ["UC", "unidades credito", "filosofia", "filosofía"]
  },
  {
    question: "que materias tiene filosofia",
    answer: "Tiene materias como: **Filosofía Antigua**, **Filosofía Medieval**, **Filosofía Moderna**, **Filosofía Contemporánea**, **Lógica**, **Ética**, **Epistemología**, **Filosofía Política**, **Filosofía Latinoamericana**, **Filosofía Venezolana**. 🤔📖",
    category: "carreras",
    keywords: ["materias", "asignaturas", "filosofia", "filosofía"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de filosofia",
    answer: "En **Semestre I** (23 UC) ves: **Introducción a la Filosofía**, **Filosofía Antigua**, **Filosofía de la Ciencia**, Bioética, Pensamiento Crítico. Los fundamentos filosóficos. 🤔📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "filosofia", "filosofía"]
  },
  {
    question: "que es filosofia antigua",
    answer: "**Filosofía Antigua** estudia pensadores griegos como Sócrates, Platón, Aristóteles, y tradiciones orientales. En Semestre I. 🏛️🤔",
    category: "carreras",
    keywords: ["filosofia antigua", "que es", "filosofia"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de filosofia",
    answer: "En **Semestre II** (24 UC) ves: **Filosofía de la Modernidad**, **Filosofía de la Liberación**, **Epistemología de la Ciencia**, **Filosofía Ética para la Vida**, **Filosofía Política para la Liberación**. Filosofía moderna y aplicada. 🤔📖",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "filosofia", "filosofía"]
  },
  {
    question: "que es filosofia de la liberacion",
    answer: "**Filosofía de la Liberación** es corriente latinoamericana que combina filosofía con lucha por justicia social, liberación económica y cultural. En Semestre II. 🇻🇪🤔",
    category: "carreras",
    keywords: ["filosofia liberacion", "que es", "filosofia"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de filosofia",
    answer: "En **Semestre III** (24 UC) ves: **Filosofía Medieval**, **Lógica**, **Filosofía Latinoamericana**, Metodología de Investigación, **Filosofía Venezolana**. Pensamiento medieval y americano. 🤔📚",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "filosofia", "filosofía"]
  },
  {
    question: "que es logica en filosofia",
    answer: "**Lógica** estudia razonamiento correcto, argumentos válidos, falacias. Base para todo pensamiento crítico. En Semestre III. 🧠🤔",
    category: "carreras",
    keywords: ["logica", "lógica", "que es", "filosofia"]
  },
  {
    question: "que es filosofia venezolana",
    answer: "**Filosofía Venezolana** estudia pensadores venezolanos y pensamiento filosófico nacional. En Semestre III. 🇻🇪🤔",
    category: "carreras",
    keywords: ["filosofia venezolana", "que es", "filosofia"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de filosofia",
    answer: "En **Semestre IV** (20 UC) ves: **Filosofía para la Transformación Social**, **Seminario II**, **Epistemología de las Ciencias Naturales**, **Proyecto Interdisciplinario I**, Electiva. Aplicación social. 🤔📖",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "filosofia", "filosofía"]
  },
  {
    question: "que es epistemologia",
    answer: "**Epistemología** estudia la naturaleza del conocimiento: ¿cómo sabemos?, ¿qué es verdad?, teorías del conocimiento. En Semestre IV. 🧠🤔",
    category: "carreras",
    keywords: ["epistemologia", "que es", "filosofia"]
  },

  // SEMESTRE V
  {
    question: "que veo en quinto semestre de filosofia",
    answer: "En **Semestre V** (30 UC) ves: **Filosofía del Sur**, **Problemas Filosóficos Contemporáneos**, **Seminario I**, **Epistemología de las Ciencias Sociales**, **Economía Política**, Electiva. Filosofía contemporánea. 🤔📚",
    category: "carreras",
    keywords: ["quinto semestre", "semestre 5", "filosofia", "filosofía"]
  },
  {
    question: "que es filosofia del sur",
    answer: "**Filosofía del Sur** es corriente filosófica desde perspectiva de países en desarrollo, crítica al eurocentrismo, pensamiento descolonial. En Semestre V. 🌍🤔",
    category: "carreras",
    keywords: ["filosofia sur", "que es", "filosofia"]
  },
  {
    question: "hay economia en filosofia",
    answer: "Sí, **Economía Política** en Semestre V. Estudia economía desde perspectiva filosófica y crítica. 💰🤔",
    category: "carreras",
    keywords: ["economia", "economía", "filosofia"]
  },

  // SEMESTRES AVANZADOS
  {
    question: "que veo en los ultimos semestres de filosofia",
    answer: "En **Semestres VI-VIII** ves: **Semiótica**, **Filosofía Crítica de la Comunicación**, **Filosofía del Arte**, **Filosofía del Derecho**, **Filosofía del Lenguaje**, **Filosofía del Caribe**, **Geopolítica del Conocimiento**, **Pasantías**, **Trabajo de Grado**. 🚀🤔",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "filosofia", "filosofía"]
  },
  {
    question: "que es semiotica",
    answer: "**Semiótica** estudia signos, símbolos, lenguaje, comunicación. Cómo construimos significado. En semestres avanzados. 📝🤔",
    category: "carreras",
    keywords: ["semiotica", "que es", "filosofia"]
  },
  {
    question: "que es filosofia del arte",
    answer: "**Filosofía del Arte** estudia naturaleza del arte, estética, creatividad, valor artístico. En semestres avanzados. 🎨🤔",
    category: "carreras",
    keywords: ["filosofia arte", "que es", "filosofia"]
  },
  {
    question: "que es filosofia del derecho",
    answer: "**Filosofía del Derecho** estudia fundamentos del derecho, justicia, legalidad, ética jurídica. En semestres avanzados. ⚖️🤔",
    category: "carreras",
    keywords: ["filosofia derecho", "que es", "filosofia"]
  },
  {
    question: "que es filosofia del lenguaje",
    answer: "**Filosofía del Lenguaje** estudia naturaleza del lenguaje, significado, comunicación, lógica del lenguaje. En semestres avanzados. 💬🤔",
    category: "carreras",
    keywords: ["filosofia lenguaje", "que es", "filosofia"]
  },
  {
    question: "que es geopolitica del conocimiento",
    answer: "**Geopolítica del Conocimiento** estudia cómo el conocimiento se produce y distribuye globalmente, desigualdades epistémicas. En semestres avanzados. 🌍🤔",
    category: "carreras",
    keywords: ["geopolitica conocimiento", "que es", "filosofia"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en filosofia",
    answer: "Sí, hay **Pasantías** en semestres avanzados. Trabajas en investigación, educación, organizaciones sociales, ONGs. 💼🤔",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "filosofia"]
  },
  {
    question: "donde hago pasantias en filosofia",
    answer: "Puedes hacer pasantías en **universidades**, **centros de investigación**, **ONGs**, **medios de comunicación**, **organizaciones sociales**, **editoriales**. 🏛️💼",
    category: "carreras",
    keywords: ["donde pasantias", "pasantías", "filosofia"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en filosofia",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas investigación filosófica original: ensayo, tesis, proyecto aplicado. 🎓🤔",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "filosofia"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en filosofia",
    answer: "Sí, hay **Electivas** en varios semestres donde puedes profundizar en áreas específicas de tu interés filosófico. 🎯🤔",
    category: "carreras",
    keywords: ["electivas", "optativas", "filosofia"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en filosofia",
    answer: "Los **Seminarios** (I, II) son espacios intensivos para discutir textos filosóficos, desarrollar pensamiento crítico, preparar investigación. 🎤🤔",
    category: "carreras",
    keywords: ["seminarios", "filosofia"]
  },

  // PROYECTOS
  {
    question: "hay proyectos en filosofia",
    answer: "Sí, hay **Proyecto Interdisciplinario I** en Semestre IV. Integra filosofía con otras disciplinas para resolver problemas. 🤝🤔",
    category: "carreras",
    keywords: ["proyectos", "interdisciplinario", "filosofia"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de filosofia",
    answer: "Es exigente con mucha lectura y pensamiento abstracto, pero si te gusta reflexionar y cuestionar, es apasionante. Es más conceptual que técnica. 💪🤔",
    category: "carreras",
    keywords: ["pesada", "dificil", "filosofia"]
  },
  {
    question: "cuantas materias por semestre en filosofia",
    answer: "Varía entre **4-6 materias** por semestre, con mucho contenido teórico y lecturas. 📚🤔",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "filosofia"]
  },

  // ÁREAS DE TRABAJO
  {
    question: "trabajo de profesor con filosofia",
    answer: "Sí, puedes trabajar como **profesor** de filosofía en universidades, colegios, academias. También investigación académica. 👨‍🏫🤔",
    category: "carreras",
    keywords: ["trabajo profesor", "enseñar", "filosofia"]
  },
  {
    question: "trabajo en comunicacion con filosofia",
    answer: "Sí, puedes trabajar en **medios de comunicación**, **periodismo filosófico**, **análisis social**, **consultoría ética**. 📺🤔",
    category: "carreras",
    keywords: ["trabajo comunicacion", "comunicación", "filosofia"]
  },
  {
    question: "trabajo en ong con filosofia",
    answer: "Sí, puedes trabajar en **ONGs**, **organizaciones sociales**, **derechos humanos**, **desarrollo comunitario**, **ética empresarial**. 🤝🤔",
    category: "carreras",
    keywords: ["trabajo ong", "ONG", "filosofia"]
  },
  {
    question: "trabajo en gobierno con filosofia",
    answer: "Sí, puedes trabajar en **políticas públicas**, **ética gubernamental**, **análisis social**, **planificación estratégica**. 🏛️🤔",
    category: "carreras",
    keywords: ["trabajo gobierno", "filosofia"]
  },

  // COMPARACIONES
  {
    question: "que diferencia hay entre filosofia y otras carreras",
    answer: "**Filosofía** desarrolla pensamiento crítico, cuestionamiento, ética, lógica. No es técnica como ingenierías, sino humanística y reflexiva. 🤔📚",
    category: "carreras",
    keywords: ["diferencia", "filosofia", "otras carreras"]
  },

  // REQUISITOS PREVIOS
  {
    question: "necesito ser bueno leyendo para filosofia",
    answer: "Sí, definitivamente. La filosofía requiere mucha lectura crítica, análisis de textos complejos, capacidad de síntesis. 📖🤔",
    category: "carreras",
    keywords: ["bueno leyendo", "lectura", "filosofia"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de filosofia",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **184 UC** con enfoque en pensamiento crítico. 📋 ¿Quieres info de algún semestre?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "filosofia"]
  },
  {
    question: "donde consigo el pensum de filosofia",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre las corrientes filosóficas que estudias. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "filosofia"]
  }
];

async function addFilosofiaFAQs() {
  console.log('🤔 Adding Filosofía Curriculum FAQs\n');
  console.log(`📋 Found ${filosofiaFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = filosofiaFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = filosofiaFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-filosofia',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Filosofía'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-filosofia',
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
  
  console.log(`✅ Added ${data.length} Filosofía curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (2 FAQs)');
  console.log('   - Semestre I (2 FAQs)');
  console.log('   - Semestre II (2 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestre V (3 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Pasantías (2 FAQs)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Proyectos (1 FAQ)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Áreas de trabajo (4 FAQs)');
  console.log('   - Comparaciones (1 FAQ)');
  console.log('   - Requisitos previos (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 40 FAQs sobre malla curricular de Filosofía!\n');
}

addFilosofiaFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
