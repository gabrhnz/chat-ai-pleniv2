#!/usr/bin/env node

/**
 * Add Venezuelan-Style FAQs
 * 
 * FAQs con lenguaje natural venezolano para jóvenes 18-25 años
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

const venezuelanStyleFAQs = [
  // PREGUNTAS GENERALES VENEZOLANAS
  {
    question: "hola",
    answer: "¡Hola! 👋 Soy uenece AI. ¿En qué te puedo ayudar? Pregúntame sobre carreras, inscripciones o lo que necesites.",
    category: "general",
    keywords: ["hola", "saludos", "hey"]
  },
  {
    question: "que tal",
    answer: "¡Todo bien! 😊 ¿Qué quieres saber de la UNC? Carreras, inscripciones, becas, lo que sea.",
    category: "general",
    keywords: ["que tal", "como estas", "saludos"]
  },
  {
    question: "buenas",
    answer: "¡Buenas! 👋 ¿En qué te ayudo? Pregúntame sobre las carreras, requisitos, o cualquier cosa de la UNC.",
    category: "general",
    keywords: ["buenas", "saludos"]
  },

  // CARRERAS - ESTILO VENEZOLANO
  {
    question: "cuales carreras hay",
    answer: "Hay **16 carreras**: 6 ingenierías (IA, Ciberseguridad, Robótica, Electromedicina, Petroquímica, Biomateriales) y 10 licenciaturas científicas. 🎓 ¿Cuál te llama?",
    category: "carreras",
    keywords: ["cuales", "carreras", "hay", "lista"]
  },
  {
    question: "que carreras tienen",
    answer: "Tenemos **ingenierías** (IA, Robótica, Ciberseguridad) y **licenciaturas** (Física, Biotecnología, Ciencia de Datos, Nanotecnología). 📚 ¿Cuál te gusta?",
    category: "carreras",
    keywords: ["que carreras", "tienen", "ofrecen"]
  },
  {
    question: "en que se basa nanotecnologia",
    answer: "Se basa en **manipular materia a escala nanométrica** (millonésimas de milímetro) para crear materiales y dispositivos innovadores. Aplica física, química y biología a nanoescala. 🔬⚛️",
    category: "carreras",
    keywords: ["en que se basa", "nanotecnología", "fundamentos"]
  },
  {
    question: "en que se basa inteligencia artificial",
    answer: "Se basa en **machine learning, redes neuronales y algoritmos** que permiten a las máquinas aprender y tomar decisiones. Combina matemáticas, programación y ciencia de datos. 🤖💻",
    category: "carreras",
    keywords: ["en que se basa", "inteligencia artificial", "IA"]
  },
  {
    question: "en que se basa ciberseguridad",
    answer: "Se basa en **criptografía, seguridad de redes, hacking ético y análisis de vulnerabilidades** para proteger sistemas y datos. Combina informática, matemáticas y gestión de riesgos. 🔒💻",
    category: "carreras",
    keywords: ["en que se basa", "ciberseguridad", "fundamentos"]
  },
  {
    question: "que tan dificil es",
    answer: "Depende de tu interés y dedicación. Las carreras tienen nivel universitario exigente pero con buen apoyo académico. Si te gusta el área, es totalmente manejable. 💪📚 ¿Cuál carrera te interesa?",
    category: "carreras",
    keywords: ["dificil", "difícil", "nivel", "exigente"]
  },
  {
    question: "es muy dificil",
    answer: "No es fácil, pero tampoco imposible. Con dedicación y las ganas de aprender, lo logras. Además hay apoyo de profes y compañeros. 🎯💪 ¿Qué carrera te llama la atención?",
    category: "carreras",
    keywords: ["muy dificil", "difícil", "complicado"]
  },

  // INSCRIPCIONES - VENEZOLANO
  {
    question: "como me inscribo",
    answer: "Inscripciones por **página web de la UNC**. Abren en **enero y julio**. Necesitas: título de bachiller, notas, cédula y fotos. 📝 ¿Quieres más detalles?",
    category: "admisiones",
    keywords: ["como me inscribo", "inscripción", "inscribirse"]
  },
  {
    question: "cuando abren inscripciones",
    answer: "Abren **2 veces al año**: en **enero** y en **julio**. Estate pendiente de la web y redes de la UNC para fechas exactas. 📅",
    category: "admisiones",
    keywords: ["cuando abren", "inscripciones", "fechas"]
  },
  {
    question: "que necesito para inscribirme",
    answer: "Necesitas: **título de bachiller**, **notas certificadas**, **cédula**, **fotos tipo carnet**, y llenar planilla en línea. 📄 Todo se entrega en el proceso de admisión.",
    category: "admisiones",
    keywords: ["que necesito", "requisitos", "inscribirse"]
  },
  {
    question: "cuanto cuesta",
    answer: "La UNC es **pública**, la matrícula es **gratuita** para venezolanos. Solo pagas aranceles administrativos mínimos. 💰✨",
    category: "costos",
    keywords: ["cuanto cuesta", "precio", "matrícula"]
  },
  {
    question: "es gratis",
    answer: "Sí, la matrícula es **gratuita** para venezolanos. Solo hay algunos aranceles administrativos pequeños. 🎓💚",
    category: "costos",
    keywords: ["gratis", "gratuita", "costo"]
  },
  {
    question: "hay que pagar",
    answer: "No pagas matrícula, la UNC es pública. Solo aranceles administrativos mínimos. 💰✨",
    category: "costos",
    keywords: ["hay que pagar", "pagar", "costo"]
  },

  // BECAS - VENEZOLANO
  {
    question: "dan becas",
    answer: "Sí, hay **becas académicas** (por mérito) y **becas socioeconómicas**. Puedes solicitarlas al inscribirte o durante la carrera. 💰🎓",
    category: "becas",
    keywords: ["dan becas", "becas", "ayuda"]
  },
  {
    question: "como pido beca",
    answer: "Solicitas durante el proceso de admisión o en Bienestar Estudiantil. Necesitas documentos que justifiquen tu situación. 📝💰",
    category: "becas",
    keywords: ["como pido", "solicitar", "beca"]
  },
  {
    question: "hay ayuda economica",
    answer: "Sí, hay **becas** y programas de **ayuda socioeconómica**. También apoyo para transporte y alimentación. 💰🎓",
    category: "becas",
    keywords: ["ayuda economica", "económica", "apoyo"]
  },

  // DURACIÓN Y HORARIOS
  {
    question: "cuanto dura la carrera",
    answer: "Duran **4 años (8 semestres)**. Entre 180-191 UC según la carrera. ⏱️📚",
    category: "carreras",
    keywords: ["cuanto dura", "duración", "tiempo"]
  },
  {
    question: "cuantos años son",
    answer: "Son **4 años** (8 semestres) para todas las carreras. 🎓⏱️",
    category: "carreras",
    keywords: ["cuantos años", "duración"]
  },
  {
    question: "que horario tienen",
    answer: "Clases de **lunes a viernes**, horario **diurno de 7am a 5pm**. Algunos laboratorios pueden ser en horario extendido. ⏰📚",
    category: "horarios",
    keywords: ["horario", "horarios", "clases"]
  },
  {
    question: "es de dia o de noche",
    answer: "Las clases son de **día** (7am a 5pm), de lunes a viernes. No hay horario nocturno. ☀️📚",
    category: "horarios",
    keywords: ["dia", "noche", "horario"]
  },

  // UBICACIÓN - VENEZOLANO
  {
    question: "donde queda",
    answer: "La UNC está en **Caracas, Venezuela**. Campus principal en la zona. 📍 ¿Necesitas la dirección exacta?",
    category: "ubicacion",
    keywords: ["donde queda", "ubicación", "dirección"]
  },
  {
    question: "como llego",
    answer: "Está en Caracas, accesible por transporte público. Hay rutas de metro y autobús cercanas. 🚇🚌 ¿De qué zona vienes?",
    category: "ubicacion",
    keywords: ["como llego", "transporte", "llegar"]
  },

  // SALIDAS LABORALES - VENEZOLANO
  {
    question: "en que puedo trabajar",
    answer: "Depende de la carrera. Por ejemplo: **IA** (empresas tech, startups), **Ciberseguridad** (bancos, empresas), **Biotecnología** (farmacéuticas, labs). 💼🚀 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["en que puedo trabajar", "trabajo", "empleo"]
  },
  {
    question: "hay trabajo de eso",
    answer: "Sí, todas nuestras carreras tienen **alta demanda laboral**, especialmente en tech (IA, Ciberseguridad, Data Science) y ciencias aplicadas. 💼📈 ¿Cuál te llama?",
    category: "carreras",
    keywords: ["hay trabajo", "demanda", "empleo"]
  },
  {
    question: "se consigue trabajo facil",
    answer: "En carreras como **IA, Ciberseguridad, Data Science y Biotecnología** hay mucha demanda. Con buen perfil, sí consigues. 💼🚀",
    category: "carreras",
    keywords: ["consigue trabajo", "fácil", "demanda"]
  },
  {
    question: "pagan bien",
    answer: "Carreras tech como **IA, Ciberseguridad, Data Science** tienen de los mejores salarios. También **Biotecnología** y **Física Nuclear** pagan bien. 💰📈",
    category: "carreras",
    keywords: ["pagan bien", "salario", "sueldo"]
  },

  // COMPARACIONES - VENEZOLANO
  {
    question: "cual es mejor",
    answer: "No hay una \"mejor\", depende de lo que te guste. **IA y Ciberseguridad** tienen alta demanda. **Biotecnología** si te gusta bio. **Física** si eres más teórico. 🎯 ¿Qué te apasiona?",
    category: "carreras",
    keywords: ["cual es mejor", "mejor carrera", "comparar"]
  },
  {
    question: "que me recomiendas",
    answer: "Depende de tus gustos: ¿Te gusta **programar**? → IA o Data Science. ¿**Seguridad**? → Ciberseguridad. ¿**Biología**? → Biotecnología. ¿**Física**? → Física o Nanotecnología. 🤔 ¿Qué te llama?",
    category: "carreras",
    keywords: ["que me recomiendas", "recomendar", "aconsejar"]
  },
  {
    question: "cual tiene mas futuro",
    answer: "**IA, Ciberseguridad y Data Science** son las del futuro inmediato. **Biotecnología y Nanotecnología** también tienen mucho potencial. 🚀🔮",
    category: "carreras",
    keywords: ["mas futuro", "futuro", "proyección"]
  },

  // REQUISITOS ACADÉMICOS
  {
    question: "necesito ser bueno en matematicas",
    answer: "Para ingenierías y carreras como Física, Matemáticas, sí necesitas base. Pero si te esfuerzas, lo logras. Hay apoyo académico. 📐💪",
    category: "requisitos",
    keywords: ["bueno en matematicas", "matemáticas", "requisitos"]
  },
  {
    question: "tengo que saber programar",
    answer: "No necesitas saber antes. En carreras como **IA, Ciberseguridad, Data Science** te enseñan desde cero. 💻📚",
    category: "requisitos",
    keywords: ["saber programar", "programación", "requisitos"]
  },

  // VIDA UNIVERSITARIA - VENEZOLANO
  {
    question: "como es el ambiente",
    answer: "El ambiente es **chevere**, estudiantes apasionados por ciencia y tech. Hay actividades, grupos de estudio y eventos. 🎓✨",
    category: "general",
    keywords: ["ambiente", "vida universitaria", "como es"]
  },
  {
    question: "hay laboratorios",
    answer: "Sí, hay **laboratorios equipados** para cada carrera: física, química, biología, computación, robótica, etc. 🔬💻",
    category: "instalaciones",
    keywords: ["laboratorios", "labs", "instalaciones"]
  },
  {
    question: "tienen comedor",
    answer: "Sí, hay **comedor estudiantil** con precios accesibles. También hay opciones de beca alimentación. 🍽️",
    category: "servicios",
    keywords: ["comedor", "cafetería", "comida"]
  },

  // PREGUNTAS ESPECÍFICAS VENEZOLANAS
  {
    question: "vale la pena",
    answer: "Sí vale la pena. La UNC tiene **carreras innovadoras** con alta demanda laboral. Es pública, gratuita y con buen nivel académico. 💪🎓",
    category: "general",
    keywords: ["vale la pena", "conviene"]
  },
  {
    question: "es buena universidad",
    answer: "Sí, la UNC es reconocida por sus **carreras científicas y tecnológicas**. Tiene buenos profes y equipamiento. 🎓⭐",
    category: "general",
    keywords: ["buena universidad", "calidad", "nivel"]
  },
  {
    question: "puedo trabajar mientras estudio",
    answer: "Sí puedes, pero las carreras son exigentes. Muchos estudiantes trabajan medio tiempo o freelance. ⏰💼",
    category: "general",
    keywords: ["trabajar mientras estudio", "trabajo", "estudiar"]
  },

  // CONTACTO - VENEZOLANO
  {
    question: "como los contacto",
    answer: "Visita **https://unc.edu.ve/** o búscalos en redes sociales. También puedes ir directo al campus. 📧📱",
    category: "contacto",
    keywords: ["como los contacto", "contactar", "comunicar"]
  },
  {
    question: "tienen instagram",
    answer: "Sí, búscalos en redes como **@unc.venezuela** (verifica el oficial). También están en Facebook y Twitter. 📱✨",
    category: "contacto",
    keywords: ["instagram", "redes sociales", "redes"]
  },
  {
    question: "tienen whatsapp",
    answer: "Para info oficial, mejor visita **unc.edu.ve** o sus redes sociales verificadas. 📱💬",
    category: "contacto",
    keywords: ["whatsapp", "contacto", "teléfono"]
  }
];

async function addVenezuelanStyleFAQs() {
  console.log('🇻🇪 Adding Venezuelan-Style FAQs\n');
  console.log(`📋 Found ${venezuelanStyleFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = venezuelanStyleFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = venezuelanStyleFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'venezuelan-style',
      added_at: new Date().toISOString(),
      type: 'conversational',
      language_style: 'venezuelan-youth'
    },
    embedding: embeddings[idx],
    created_by: 'venezuelan-faqs',
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
  
  console.log(`✅ Added ${data.length} Venezuelan-style FAQs\n`);
  console.log('📊 Categorías:');
  console.log('   - Saludos y general');
  console.log('   - Carreras (estilo venezolano)');
  console.log('   - Inscripciones y requisitos');
  console.log('   - Becas y costos');
  console.log('   - Horarios y ubicación');
  console.log('   - Salidas laborales');
  console.log('   - Vida universitaria');
  console.log('   - Contacto');
  console.log('\n✨ Lenguaje natural venezolano para jóvenes 18-25 años!\n');
}

addVenezuelanStyleFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
