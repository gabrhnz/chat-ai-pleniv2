#!/usr/bin/env node

/**
 * Add Ciberseguridad Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de Licenciatura en Ciberseguridad
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

const ciberseguridadCurriculumFAQs = [
  // INFORMACIÓN GENERAL
  {
    question: "cuantas UC tiene ciberseguridad",
    answer: "La carrera tiene **187 UC** (Unidades de Crédito) en total, distribuidas en **8 semestres**. 🔒💻",
    category: "carreras",
    keywords: ["UC", "unidades credito", "ciberseguridad"]
  },
  {
    question: "cuantas horas semanales tiene ciberseguridad",
    answer: "Son **43 horas semanales** en total, incluyendo clases teóricas, prácticas, laboratorios y trabajo independiente. ⏰🔐",
    category: "carreras",
    keywords: ["horas", "semanales", "ciberseguridad"]
  },
  {
    question: "que materias tiene ciberseguridad",
    answer: "Tiene materias como: **Hacking Ético**, **Análisis Forense Digital**, **Criptografía**, **Seguridad en Redes**, **Blockchain**, **IA aplicada a Ciberseguridad**, **Ciber Inteligencia**, **Auditoría de Sistemas**, y más. 🔒🕵️",
    category: "carreras",
    keywords: ["materias", "asignaturas", "ciberseguridad"]
  },

  // SEMESTRE I
  {
    question: "que veo en primer semestre de ciberseguridad",
    answer: "En **Semestre I** (21 UC) ves: **Introducción a la Ciberseguridad**, Pensamiento Crítico, Bioética, **Matemática I**, **Lógica y Algoritmos**. La base fundamental. 🔐📚",
    category: "carreras",
    keywords: ["primer semestre", "semestre 1", "ciberseguridad"]
  },

  // SEMESTRE II
  {
    question: "que veo en segundo semestre de ciberseguridad",
    answer: "En **Semestre II** (24 UC) ves: **Inglés II aplicado a Ciberseguridad**, **Programación**, **Bases de Datos**, **Fundamentos de Redes**, **Sistemas Operativos I**, **Estadística**, Metodología de Investigación. 💻🔒",
    category: "carreras",
    keywords: ["segundo semestre", "semestre 2", "ciberseguridad"]
  },
  {
    question: "hay ingles en ciberseguridad",
    answer: "Sí, hay **Inglés II aplicado a Ciberseguridad** en Semestre II. Esencial porque mucha documentación técnica está en inglés. 🇬🇧💻",
    category: "carreras",
    keywords: ["ingles", "inglés", "ciberseguridad"]
  },
  {
    question: "cuando veo redes en ciberseguridad",
    answer: "**Fundamentos de Redes** lo ves desde el **Semestre II** (Sistemas Operativos I) y continúa en **Semestre IV** (Sistemas Operativos II). También hay **Monitoreo y Análisis de Redes** en semestres avanzados. 🌐🔒",
    category: "carreras",
    keywords: ["redes", "cuando", "ciberseguridad"]
  },

  // SEMESTRE III
  {
    question: "que veo en tercer semestre de ciberseguridad",
    answer: "En **Semestre III** (24 UC) ves: **Políticas y Marco Legal de Ciberseguridad**, **Seguridad en Dispositivos Móviles**, **Seminario I**, **Laboratorio de Ciberseguridad II**, y más. 📱🔐",
    category: "carreras",
    keywords: ["tercer semestre", "semestre 3", "ciberseguridad"]
  },
  {
    question: "veo leyes de ciberseguridad",
    answer: "Sí, **Políticas y Marco Legal de la Ciberseguridad** en **Semestre III**. Aprendes sobre regulaciones, compliance, leyes de protección de datos. ⚖️🔒",
    category: "carreras",
    keywords: ["leyes", "legal", "marco legal", "ciberseguridad"]
  },
  {
    question: "veo seguridad movil",
    answer: "Sí, **Seguridad en Dispositivos Móviles** en **Semestre III**. Aprendes a proteger smartphones, tablets, apps móviles. 📱🔐",
    category: "carreras",
    keywords: ["seguridad movil", "móvil", "dispositivos", "ciberseguridad"]
  },

  // SEMESTRE IV
  {
    question: "que veo en cuarto semestre de ciberseguridad",
    answer: "En **Semestre IV** (24 UC) ves: **Laboratorio I de Ciberseguridad**, **Fundamentos de Redes y Sistemas Operativos II**, **Programación Avanzada**, y electivas. Más práctico. 💻🔬",
    category: "carreras",
    keywords: ["cuarto semestre", "semestre 4", "ciberseguridad"]
  },
  {
    question: "cuando veo programacion avanzada",
    answer: "**Programación Avanzada** la ves en el **Semestre IV**. Aprendes técnicas avanzadas para desarrollo seguro y análisis de código. 💻🔒",
    category: "carreras",
    keywords: ["programacion avanzada", "cuando", "ciberseguridad"]
  },

  // SEMESTRES AVANZADOS (V-VIII)
  {
    question: "que veo en los ultimos semestres de ciberseguridad",
    answer: "En **Semestres V-VIII** ves: **Análisis Forense Digital**, **Ciber Inteligencia**, **IA aplicada a Ciberseguridad**, **Blockchain**, **Auditoría de Sistemas**, **Seguridad en Sistemas Industriales**, **Pasantías**, **Trabajo Especial de Grado**. 🚀🔐",
    category: "carreras",
    keywords: ["ultimos semestres", "avanzados", "ciberseguridad"]
  },
  {
    question: "que es analisis forense digital",
    answer: "**Análisis Forense Digital** es investigar cibercrímenes, recuperar evidencia digital, analizar ataques. Como ser detective digital. Lo ves en semestres avanzados. 🕵️💻",
    category: "carreras",
    keywords: ["analisis forense", "forense digital", "ciberseguridad"]
  },
  {
    question: "que es ciber inteligencia",
    answer: "**Ciber Inteligencia** es recopilar y analizar información sobre amenazas cibernéticas, predecir ataques, identificar actores maliciosos. En semestres avanzados. 🕵️🔒",
    category: "carreras",
    keywords: ["ciber inteligencia", "cyber intelligence", "ciberseguridad"]
  },
  {
    question: "veo blockchain en ciberseguridad",
    answer: "Sí, hay **Laboratorio de Blockchain** en semestres avanzados. Aprendes sobre criptomonedas, contratos inteligentes, seguridad blockchain. ⛓️🔐",
    category: "carreras",
    keywords: ["blockchain", "ciberseguridad"]
  },
  {
    question: "veo inteligencia artificial en ciberseguridad",
    answer: "Sí, **Inteligencia Artificial Aplicada a la Ciberseguridad** donde aprendes a usar IA para detectar amenazas, analizar patrones, automatizar defensa. 🤖🔒",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "ciberseguridad"]
  },
  {
    question: "que es auditoria de sistemas",
    answer: "**Auditoría de Sistemas** es evaluar la seguridad de sistemas, encontrar vulnerabilidades, hacer pentesting, generar reportes. En semestres avanzados. 🔍🔒",
    category: "carreras",
    keywords: ["auditoria", "auditoría", "sistemas", "ciberseguridad"]
  },

  // HACKING ÉTICO Y PENTESTING
  {
    question: "veo hacking etico",
    answer: "Sí, el **hacking ético (pentesting)** se ve en varios laboratorios y materias avanzadas. Aprendes a hackear sistemas legalmente para encontrar vulnerabilidades. 🕵️💻",
    category: "carreras",
    keywords: ["hacking etico", "ético", "pentesting", "ciberseguridad"]
  },
  {
    question: "cuando veo pentesting",
    answer: "**Pentesting** lo practicas en los **Laboratorios de Ciberseguridad** (I, II) y en **Auditoría de Sistemas**. Desde semestre III en adelante. 🔓💻",
    category: "carreras",
    keywords: ["pentesting", "cuando", "ciberseguridad"]
  },

  // LABORATORIOS
  {
    question: "hay laboratorios en ciberseguridad",
    answer: "Sí, varios: **Laboratorio de Ciberseguridad I y II**, **Laboratorio de Blockchain**, y prácticas en otras materias. Muy hands-on. 🔬💻",
    category: "carreras",
    keywords: ["laboratorios", "labs", "ciberseguridad"]
  },
  {
    question: "cuantos laboratorios tiene ciberseguridad",
    answer: "Tiene **Laboratorio de Ciberseguridad I y II**, **Laboratorio de Blockchain**, más prácticas en varias materias. Es muy práctico. 🔬🔒",
    category: "carreras",
    keywords: ["cuantos laboratorios", "ciberseguridad"]
  },

  // CRIPTOGRAFÍA
  {
    question: "veo criptografia en ciberseguridad",
    answer: "Sí, **Criptografía** es fundamental y se ve en varias materias. Aprendes cifrado, algoritmos de seguridad, protección de datos. 🔐🔢",
    category: "carreras",
    keywords: ["criptografia", "criptografía", "cifrado", "ciberseguridad"]
  },

  // SEGURIDAD EN SISTEMAS INDUSTRIALES
  {
    question: "que es seguridad en sistemas industriales",
    answer: "**Seguridad en Sistemas Industriales** protege infraestructura crítica (plantas eléctricas, fábricas, sistemas SCADA). En semestres avanzados. 🏭🔒",
    category: "carreras",
    keywords: ["sistemas industriales", "SCADA", "ciberseguridad"]
  },

  // CIENCIA DE DATOS
  {
    question: "hay ciencia de datos en ciberseguridad",
    answer: "Sí, **Ciencia de Datos** en semestres avanzados. Útil para analizar grandes volúmenes de logs, detectar anomalías, predecir ataques. 📊🔒",
    category: "carreras",
    keywords: ["ciencia datos", "data science", "ciberseguridad"]
  },

  // TELECOMUNICACIONES
  {
    question: "veo telecomunicaciones en ciberseguridad",
    answer: "Sí, **Telecomunicaciones** en semestres avanzados. Aprendes sobre seguridad en comunicaciones, protocolos, redes. 📡🔐",
    category: "carreras",
    keywords: ["telecomunicaciones", "ciberseguridad"]
  },

  // INGENIERÍA SOCIAL
  {
    question: "que es ingenieria social",
    answer: "**Ingeniería Social** son técnicas de manipulación psicológica para obtener información (phishing, pretexting). Lo ves en **Ciber Inteligencia e Ingeniería Social**. 🎭🔒",
    category: "carreras",
    keywords: ["ingenieria social", "social engineering", "ciberseguridad"]
  },

  // PASANTÍAS
  {
    question: "hay pasantias en ciberseguridad",
    answer: "Sí, hay **Pasantías** en semestres avanzados donde trabajas en empresas, bancos o consultoras aplicando ciberseguridad. Experiencia real. 💼🔒",
    category: "carreras",
    keywords: ["pasantias", "pasantías", "ciberseguridad"]
  },

  // TRABAJO ESPECIAL DE GRADO
  {
    question: "hay tesis en ciberseguridad",
    answer: "Sí, hay **Trabajo Especial de Grado** donde desarrollas un proyecto de investigación o aplicación en ciberseguridad. 🎓🔐",
    category: "carreras",
    keywords: ["tesis", "trabajo grado", "ciberseguridad"]
  },

  // ELECTIVAS
  {
    question: "hay electivas en ciberseguridad",
    answer: "Sí, hay **electivas** desde Semestre IV donde puedes especializarte en áreas específicas de tu interés. 🎯📚",
    category: "carreras",
    keywords: ["electivas", "optativas", "ciberseguridad"]
  },

  // SEMINARIOS
  {
    question: "que son los seminarios en ciberseguridad",
    answer: "Los **Seminarios** son espacios para presentar investigaciones, discutir amenazas actuales, preparar tu trabajo de grado. Hay varios a lo largo de la carrera. 🎤🔒",
    category: "carreras",
    keywords: ["seminarios", "ciberseguridad"]
  },

  // MATEMÁTICAS Y ESTADÍSTICA
  {
    question: "cuanta matematica tiene ciberseguridad",
    answer: "Tiene **Matemática I** y **Estadística**, más matemáticas aplicadas en criptografía. Es manejable. 📐🔢",
    category: "carreras",
    keywords: ["matematica", "matemática", "cuanta", "ciberseguridad"]
  },
  {
    question: "hay estadistica en ciberseguridad",
    answer: "Sí, **Estadística** en **Semestre II**. Útil para análisis de datos, detección de anomalías, análisis forense. 📊📈",
    category: "carreras",
    keywords: ["estadistica", "estadística", "ciberseguridad"]
  },

  // PROGRAMACIÓN
  {
    question: "cuanta programacion tiene ciberseguridad",
    answer: "Bastante. Ves **Programación** (Semestre II), **Programación Avanzada** (Semestre IV), y programación en varios laboratorios. Principalmente **Python**. 🐍💻",
    category: "carreras",
    keywords: ["programacion", "programación", "cuanta", "ciberseguridad"]
  },
  {
    question: "necesito saber programar antes de ciberseguridad",
    answer: "No, te enseñan desde cero. Empiezas con **Lógica y Algoritmos** en Semestre I y luego **Programación**. 💻📚",
    category: "carreras",
    keywords: ["necesito saber programar", "antes", "ciberseguridad"]
  },

  // BASES DE DATOS
  {
    question: "veo bases de datos en ciberseguridad",
    answer: "Sí, **Bases de Datos y Estructuras I** en **Semestre II**. Importante para entender seguridad de bases de datos. 🗄️🔒",
    category: "carreras",
    keywords: ["bases datos", "database", "ciberseguridad"]
  },

  // DURACIÓN Y CARGA
  {
    question: "es muy pesada la carrera de ciberseguridad",
    answer: "Es exigente (**43 horas semanales**, **187 UC**) pero si te gusta la seguridad informática y te organizas, es manejable. 💪🔒",
    category: "carreras",
    keywords: ["pesada", "dificil", "ciberseguridad"]
  },
  {
    question: "cuantas materias por semestre en ciberseguridad",
    answer: "Varía entre **5-7 materias** por semestre, dependiendo de las UC y laboratorios. 📚🔐",
    category: "carreras",
    keywords: ["cuantas materias", "semestre", "ciberseguridad"]
  },

  // CERTIFICACIONES
  {
    question: "puedo sacar certificaciones en ciberseguridad",
    answer: "Sí, durante y después de la carrera puedes sacar certificaciones como **CEH**, **CISSP**, **CompTIA Security+**, etc. Te prepara para ellas. 🎓🔒",
    category: "carreras",
    keywords: ["certificaciones", "CEH", "CISSP", "ciberseguridad"]
  },

  // PRÁCTICO
  {
    question: "puedo ver la malla completa de ciberseguridad",
    answer: "Sí, la malla completa está en la web de la UNC o en admisiones. Tiene **8 semestres**, **187 UC**. 📋 ¿Quieres info de algún semestre específico?",
    category: "carreras",
    keywords: ["malla completa", "pensum", "ciberseguridad"]
  },
  {
    question: "donde consigo el pensum de ciberseguridad",
    answer: "El pensum está en **unc.edu.ve** o en admisiones. También te puedo contar sobre materias específicas. 📄 ¿Qué te interesa?",
    category: "carreras",
    keywords: ["pensum", "donde", "ciberseguridad"]
  }
];

async function addCiberseguridadCurriculumFAQs() {
  console.log('🔒 Adding Ciberseguridad Curriculum FAQs\n');
  console.log(`📋 Found ${ciberseguridadCurriculumFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = ciberseguridadCurriculumFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = ciberseguridadCurriculumFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-ciberseguridad',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Licenciatura en Ciberseguridad'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-ciberseguridad',
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
  
  console.log(`✅ Added ${data.length} Ciberseguridad curriculum FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Información general (3 FAQs)');
  console.log('   - Semestre I (1 FAQ)');
  console.log('   - Semestre II (3 FAQs)');
  console.log('   - Semestre III (3 FAQs)');
  console.log('   - Semestre IV (2 FAQs)');
  console.log('   - Semestres avanzados (6 FAQs)');
  console.log('   - Hacking ético (2 FAQs)');
  console.log('   - Laboratorios (2 FAQs)');
  console.log('   - Áreas específicas (6 FAQs)');
  console.log('   - Pasantías (1 FAQ)');
  console.log('   - Trabajo especial de grado (1 FAQ)');
  console.log('   - Electivas (1 FAQ)');
  console.log('   - Seminarios (1 FAQ)');
  console.log('   - Matemáticas y estadística (2 FAQs)');
  console.log('   - Programación (3 FAQs)');
  console.log('   - Duración y carga (2 FAQs)');
  console.log('   - Certificaciones (1 FAQ)');
  console.log('   - Práctico (2 FAQs)');
  console.log('\n✨ Total: 42 FAQs sobre malla curricular de Ciberseguridad!\n');
}

addCiberseguridadCurriculumFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
