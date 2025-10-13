#!/usr/bin/env node

/**
 * Add More Conversational FAQs
 * 
 * Mejora las respuestas sobre áreas, detalles de carreras y contexto conversacional
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

const moreConversationalFAQs = [
  // ÁREAS DE ESTUDIO
  {
    question: "cuales areas",
    answer: "Tenemos **2 áreas**: **Ingeniería y Tecnología** (IA, Robótica, Ciberseguridad, Electromedicina, Petroquímica, Biomateriales) y **Ciencias** (Física, Biotecnología, Nanotecnología, Data Science, etc). 🎓 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["cuales areas", "áreas", "que areas"]
  },
  {
    question: "que areas tienen",
    answer: "**Ingeniería y Tecnología** (6 ingenierías) y **Ciencias** (10 licenciaturas científicas). 🔬💻 ¿Prefieres ingeniería o ciencias?",
    category: "carreras",
    keywords: ["que areas", "áreas", "tienen"]
  },
  {
    question: "cuales son las areas",
    answer: "Las áreas son: **Ingeniería y Tecnología** y **Ciencias Básicas y Aplicadas**. Cada una con varias carreras. 📚 ¿Cuál área te llama?",
    category: "carreras",
    keywords: ["cuales son", "areas", "áreas"]
  },
  {
    question: "que carreras imparten",
    answer: "Impartimos **16 carreras**: 6 ingenierías (IA, Ciberseguridad, Robótica, Electromedicina, Petroquímica, Biomateriales) y 10 licenciaturas científicas (Física, Biotecnología, Data Science, Nanotecnología, etc). 🎓",
    category: "carreras",
    keywords: ["imparten", "dictan", "ofrecen"]
  },
  {
    question: "que carreras imparten en la universidad",
    answer: "La UNC ofrece **ingenierías** (IA, Ciberseguridad, Robótica) y **licenciaturas** científicas (Física, Biotecnología, Nanotecnología, Data Science). 🎓 ¿Qué área te gusta?",
    category: "carreras",
    keywords: ["imparten", "universidad", "carreras"]
  },

  // DETALLES DE CARRERAS ESPECÍFICAS
  {
    question: "cuales son las ingenierias",
    answer: "Las **6 ingenierías** son: Inteligencia Artificial, Ciberseguridad, Robótica y Automatización, Electromedicina, Petroquímica, y Biomateriales. 🤖🔧 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["cuales ingenierias", "ingenierías", "lista"]
  },
  {
    question: "cuales son las licenciaturas",
    answer: "Las **10 licenciaturas** son: Física Nuclear, Biología y Química Computacional, Biotecnología, Ciencia Molecular, Ciencia de Datos, Física, Matemáticas, Nanotecnología, Filosofía, y Oceanología. 🔬📊",
    category: "carreras",
    keywords: ["cuales licenciaturas", "lista"]
  },
  {
    question: "que es ingenieria",
    answer: "Las **ingenierías** aplican ciencia y matemáticas para resolver problemas reales. En la UNC tenemos 6: IA, Ciberseguridad, Robótica, Electromedicina, Petroquímica y Biomateriales. 🔧💡",
    category: "carreras",
    keywords: ["que es ingenieria", "ingeniería"]
  },
  {
    question: "que es licenciatura",
    answer: "Las **licenciaturas** son carreras científicas enfocadas en investigación y conocimiento profundo. Tenemos 10 en áreas como Física, Biotecnología, Data Science, Nanotecnología, etc. 🔬📚",
    category: "carreras",
    keywords: ["que es licenciatura"]
  },

  // DIFERENCIAS Y COMPARACIONES
  {
    question: "cual es la diferencia entre ingenieria y licenciatura",
    answer: "**Ingenierías** son más aplicadas (resolver problemas, diseñar soluciones). **Licenciaturas** son más teóricas (investigación, ciencia pura). Ambas duran 4 años. 🔧🔬 ¿Cuál prefieres?",
    category: "carreras",
    keywords: ["diferencia", "ingenieria", "licenciatura"]
  },
  {
    question: "que es mejor ingenieria o licenciatura",
    answer: "No hay \"mejor\", depende de ti. Si te gusta **aplicar y crear** → Ingeniería. Si te gusta **investigar y teoría** → Licenciatura. Ambas tienen buenas salidas. 🎯 ¿Qué te gusta más?",
    category: "carreras",
    keywords: ["mejor", "ingenieria", "licenciatura"]
  },

  // PREGUNTAS DE SEGUIMIENTO CONTEXTUALES
  {
    question: "dame mas info",
    answer: "¿Sobre qué quieres más info? Puedo contarte sobre: carreras específicas, inscripciones, costos, becas, horarios, salidas laborales. 📚 ¿Qué te interesa?",
    category: "general",
    keywords: ["dame mas info", "más información", "detalles"]
  },
  {
    question: "cuentame mas",
    answer: "¿Sobre qué tema? Pregúntame sobre carreras, requisitos, inscripciones, becas, o lo que necesites. 💬 ¿Qué quieres saber?",
    category: "general",
    keywords: ["cuentame mas", "cuéntame", "más"]
  },
  {
    question: "y eso",
    answer: "¿Qué aspecto te interesa? Puedo darte info sobre la carrera, salidas laborales, requisitos, o lo que necesites. 🤔 ¿Qué quieres saber?",
    category: "general",
    keywords: ["y eso", "eso"]
  },

  // CARRERAS TECH ESPECÍFICAS
  {
    question: "tienen programacion",
    answer: "Sí, en **Inteligencia Artificial**, **Ciberseguridad**, **Ciencia de Datos**, y **Robótica** hay mucha programación. 💻 ¿Cuál te llama?",
    category: "carreras",
    keywords: ["programacion", "programación", "coding"]
  },
  {
    question: "tienen algo de computacion",
    answer: "Sí, tenemos **Inteligencia Artificial**, **Ciberseguridad**, **Ciencia de Datos**, y **Biología y Química Computacional**. 💻🔬 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["computacion", "computación", "informática"]
  },
  {
    question: "que hay de tecnologia",
    answer: "Tenemos **IA**, **Ciberseguridad**, **Robótica**, **Ciencia de Datos**, y **Nanotecnología**. Todas muy tech. 🤖💻 ¿Cuál te gusta?",
    category: "carreras",
    keywords: ["tecnologia", "tecnología", "tech"]
  },

  // CARRERAS DE CIENCIAS
  {
    question: "tienen algo de biologia",
    answer: "Sí, tenemos **Biotecnología**, **Ciencia Molecular**, **Biología y Química Computacional**, y **Oceanología**. 🧬🌊 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["biologia", "biológicas"]
  },
  {
    question: "tienen fisica",
    answer: "Sí, tenemos **Física** y **Física Nuclear**. Ambas con enfoque en investigación y aplicaciones. ⚛️🔬 ¿Cuál te llama?",
    category: "carreras",
    keywords: ["fisica", "física"]
  },
  {
    question: "tienen quimica",
    answer: "Tenemos **Biología y Química Computacional** y **Petroquímica** (ingeniería). También química en otras carreras. ⚗️ ¿Te interesa alguna?",
    category: "carreras",
    keywords: ["quimica", "química"]
  },

  // NIVEL Y EXIGENCIA
  {
    question: "es muy exigente",
    answer: "Sí, es nivel universitario serio, pero con dedicación lo logras. Hay apoyo de profes y compañeros. 💪📚 ¿Qué carrera te interesa?",
    category: "general",
    keywords: ["exigente", "dificil", "nivel"]
  },
  {
    question: "cuanto hay que estudiar",
    answer: "Depende de la carrera y tu ritmo. En promedio, unas **4-6 horas diarias** entre clases y estudio. Es manejable con organización. ⏰📚",
    category: "general",
    keywords: ["cuanto estudiar", "horas", "tiempo"]
  },

  // ADMISIÓN Y PROCESO
  {
    question: "como es el proceso de admision",
    answer: "**1)** Inscripción online, **2)** Entregar documentos, **3)** Prueba de aptitud, **4)** Entrevista. Abren en enero y julio. 📝 ¿Necesitas más detalles?",
    category: "admisiones",
    keywords: ["proceso admision", "admisión", "ingreso"]
  },
  {
    question: "que documentos necesito",
    answer: "Necesitas: **título de bachiller**, **notas certificadas**, **cédula**, **partida de nacimiento**, **fotos tipo carnet**. 📄 Todo se entrega en el proceso.",
    category: "admisiones",
    keywords: ["documentos", "requisitos", "papeles"]
  },
  {
    question: "hay examen de admision",
    answer: "Sí, hay **prueba de aptitud académica** que evalúa matemáticas, lógica y comprensión. No es imposible, solo prepárate. 📝💪",
    category: "admisiones",
    keywords: ["examen", "prueba", "admision"]
  },

  // VIDA ESTUDIANTIL
  {
    question: "hay actividades",
    answer: "Sí, hay **clubes estudiantiles**, **eventos científicos**, **talleres**, **competencias** y actividades culturales. 🎭🔬 El ambiente es activo.",
    category: "servicios",
    keywords: ["actividades", "eventos", "clubes"]
  },
  {
    question: "puedo hacer deportes",
    answer: "Sí, hay **instalaciones deportivas** y equipos estudiantiles. Puedes practicar varios deportes. ⚽🏀",
    category: "servicios",
    keywords: ["deportes", "deporte", "instalaciones"]
  },
  {
    question: "hay biblioteca",
    answer: "Sí, hay **biblioteca** con libros, recursos digitales y espacios de estudio. 📚💻",
    category: "instalaciones",
    keywords: ["biblioteca", "libros", "recursos"]
  },

  // DESPUÉS DE GRADUARSE
  {
    question: "que pasa despues de graduarme",
    answer: "Puedes **trabajar** en tu área, hacer **postgrados**, **emprender**, o **investigar**. Nuestras carreras tienen buena demanda laboral. 💼🎓 ¿Qué carrera te interesa?",
    category: "carreras",
    keywords: ["despues graduarse", "después", "futuro"]
  },
  {
    question: "puedo hacer postgrado",
    answer: "Sí, después de la licenciatura puedes hacer **maestrías** y **doctorados** en Venezuela o el extranjero. 🎓📚",
    category: "general",
    keywords: ["postgrado", "maestria", "doctorado"]
  },
  {
    question: "puedo trabajar en el extranjero",
    answer: "Sí, carreras como **IA**, **Ciberseguridad**, **Data Science**, **Biotecnología** y **Física** tienen demanda internacional. 🌍✈️",
    category: "carreras",
    keywords: ["extranjero", "internacional", "afuera"]
  },

  // COSTOS Y FINANCIAMIENTO
  {
    question: "cuanto son los aranceles",
    answer: "Los aranceles administrativos son **mínimos** (muy accesibles). La matrícula es gratuita. 💰✨",
    category: "costos",
    keywords: ["aranceles", "cuanto", "costo"]
  },
  {
    question: "hay que comprar muchos libros",
    answer: "Algunos sí, pero hay **biblioteca**, **recursos digitales** y puedes compartir con compañeros. No es muy costoso. 📚💰",
    category: "costos",
    keywords: ["libros", "comprar", "materiales"]
  },

  // UBICACIÓN Y TRANSPORTE
  {
    question: "hay transporte",
    answer: "Está cerca de **rutas de metro y autobús**. Muchos estudiantes usan transporte público. También hay becas de transporte. 🚇🚌",
    category: "ubicacion",
    keywords: ["transporte", "como llegar", "metro"]
  },
  {
    question: "hay estacionamiento",
    answer: "Sí, hay **estacionamiento** para estudiantes que van en carro. 🚗🅿️",
    category: "instalaciones",
    keywords: ["estacionamiento", "parking", "carro"]
  },

  // PREGUNTAS MOTIVACIONALES
  {
    question: "deberia estudiar ahi",
    answer: "Si te gustan las **ciencias y la tecnología**, la UNC es excelente opción. Es pública, gratuita, con carreras innovadoras y buena salida laboral. 💪🎓 ¿Qué carrera te interesa?",
    category: "general",
    keywords: ["deberia estudiar", "debería", "conviene"]
  },
  {
    question: "me conviene",
    answer: "Si buscas **carreras científicas y tecnológicas** con futuro, sí te conviene. Es gratuita y tiene buen nivel. 🎯🎓 ¿Qué área te gusta?",
    category: "general",
    keywords: ["conviene", "me sirve"]
  }
];

async function addMoreConversationalFAQs() {
  console.log('💬 Adding More Conversational FAQs\n');
  console.log(`📋 Found ${moreConversationalFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = moreConversationalFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = moreConversationalFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'conversational-v2',
      added_at: new Date().toISOString(),
      type: 'conversational-enhanced',
      language_style: 'venezuelan-youth'
    },
    embedding: embeddings[idx],
    created_by: 'conversational-v2',
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
  
  console.log(`✅ Added ${data.length} conversational FAQs\n`);
  console.log('📊 Categorías mejoradas:');
  console.log('   - Áreas de estudio (5 FAQs)');
  console.log('   - Detalles de carreras (4 FAQs)');
  console.log('   - Diferencias y comparaciones (2 FAQs)');
  console.log('   - Preguntas de seguimiento (3 FAQs)');
  console.log('   - Carreras tech (3 FAQs)');
  console.log('   - Carreras de ciencias (3 FAQs)');
  console.log('   - Nivel y exigencia (2 FAQs)');
  console.log('   - Admisión y proceso (3 FAQs)');
  console.log('   - Vida estudiantil (3 FAQs)');
  console.log('   - Después de graduarse (3 FAQs)');
  console.log('   - Costos y financiamiento (2 FAQs)');
  console.log('   - Ubicación y transporte (2 FAQs)');
  console.log('   - Preguntas motivacionales (2 FAQs)');
  console.log('\n✨ Total: 37 FAQs conversacionales agregadas!\n');
}

addMoreConversationalFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
