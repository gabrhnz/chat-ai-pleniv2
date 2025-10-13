#!/usr/bin/env node

/**
 * Import FAQs from SQL format
 * 
 * Procesa FAQs en formato SQL y las inserta en Supabase con embeddings
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

// Select embedding service
const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// FAQs extraídas del SQL (formato adaptado para el chatbot)
const sqlFAQs = [
  // Información General
  {
    question: "¿Qué es la UNC?",
    answer: "Universidad de ciencias inaugurada en **diciembre 2024**. 🎓 ¿Te interesa alguna carrera?",
    category: "informacion_general",
    keywords: ["UNC", "universidad", "qué es"]
  },
  {
    question: "¿Dónde está ubicada la UNC?",
    answer: "En **Altos de Pipe, km 11**, carretera Panamericana, Miranda. 📍 ¿Cómo llegar?",
    category: "ubicacion",
    keywords: ["ubicación", "dirección", "dónde"]
  },
  {
    question: "¿Cuándo fue inaugurada la UNC?",
    answer: "Inaugurada el **12 de diciembre de 2024**. 🎉 ¿Quieres saber más sobre su historia?",
    category: "historia",
    keywords: ["inauguración", "fundación", "cuándo"]
  },
  {
    question: "¿Quién es la rectora de la UNC?",
    answer: "**Gabriela Jiménez Ramírez**, vicepresidenta de Ciencia y Tecnología. 👩‍🏫 ¿Conocer el equipo directivo?",
    category: "autoridades",
    keywords: ["rectora", "autoridades", "directivos"]
  },
  
  // Carreras
  {
    question: "¿Cuántas carreras ofrece la UNC?",
    answer: "**16 carreras de pregrado** en 5 áreas del conocimiento. 🎓 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["carreras", "programas", "cuántas"]
  },
  {
    question: "¿Qué ingenierías ofrece la UNC?",
    answer: "**6 ingenierías**: IA, Ciberseguridad, Robótica, Petroquímica, Electromedicina y Biomateriales. 🤖 ¿Cuál te interesa?",
    category: "carreras",
    keywords: ["ingenierías", "ingeniería"]
  },
  {
    question: "¿Qué licenciaturas ofrece la UNC?",
    answer: "**10 licenciaturas** en ciencias: Biotecnología, Datos, Física, Oceanología, Nanotecnología y más. 🔬 ¿Cuál prefieres?",
    category: "carreras",
    keywords: ["licenciaturas", "licenciatura"]
  },
  {
    question: "¿Cuánto dura cada carrera?",
    answer: "Todas duran **4 años (8 semestres)** con 180-191 UC. ⏱️ ¿Quieres el plan de estudios?",
    category: "duracion",
    keywords: ["duración", "años", "semestres"]
  },
  
  // Ingenierías específicas
  {
    question: "¿Qué es Ingeniería en IA?",
    answer: "**181 UC** en machine learning, redes neuronales y robótica. 🤖 ¿Campo laboral?",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "AI"]
  },
  {
    question: "¿Qué es Ingeniería en Ciberseguridad?",
    answer: "**187 UC** en seguridad de redes, criptografía y gestión de riesgos. 🔒 ¿Salida laboral?",
    category: "carreras",
    keywords: ["ciberseguridad", "seguridad", "hacking"]
  },
  {
    question: "¿Qué es Ingeniería en Robótica?",
    answer: "**180 UC** en diseño de robots, automatización y mecatrónica. 🦾 ¿Dónde trabajar?",
    category: "carreras",
    keywords: ["robótica", "robots", "automatización"]
  },
  {
    question: "¿Qué es Ingeniería en Electromedicina?",
    answer: "**191 UC** en equipos médicos, biomateriales e imagenología. 🏥 ¿Campo laboral?",
    category: "carreras",
    keywords: ["electromedicina", "medicina", "equipos médicos"]
  },
  {
    question: "¿Qué es Ingeniería en Petroquímica?",
    answer: "**186 UC** en procesos petroquímicos, termodinámica y control. ⚗️ ¿Dónde trabajar?",
    category: "carreras",
    keywords: ["petroquímica", "petróleo", "refinería"]
  },
  {
    question: "¿Qué es Ingeniería en Biomateriales?",
    answer: "**184 UC** en ingeniería de tejidos, biomateriales y fármacos. 🧬 ¿Salida laboral?",
    category: "carreras",
    keywords: ["biomateriales", "materiales", "tejidos"]
  },
  
  // Licenciaturas específicas
  {
    question: "¿Qué es Biotecnología?",
    answer: "**182 UC** en biología molecular, genética e ingeniería genética. 🧬 ¿Campo laboral?",
    category: "carreras",
    keywords: ["biotecnología", "biología", "genética"]
  },
  {
    question: "¿Qué es Ciencia de Datos?",
    answer: "**186 UC** en análisis de datos, ML y modelos predictivos. 📊 ¿Dónde trabajar?",
    category: "carreras",
    keywords: ["ciencia de datos", "data science", "datos"]
  },
  {
    question: "¿Qué es Nanotecnología?",
    answer: "**182 UC** en nanomateriales, nanoelectrónica y nanobiotecnología. ⚛️ ¿Salida laboral?",
    category: "carreras",
    keywords: ["nanotecnología", "nano", "nanomateriales"]
  },
  {
    question: "¿Qué es Física Nuclear?",
    answer: "**181 UC** en estructura atómica, radioactividad y reactores. ☢️ ¿Campo laboral?",
    category: "carreras",
    keywords: ["física nuclear", "nuclear", "radioactividad"]
  },
  {
    question: "¿Qué es Oceanología?",
    answer: "**185 UC** en oceanografía, biología marina y recursos marinos. 🌊 ¿Dónde trabajar?",
    category: "carreras",
    keywords: ["oceanología", "océanos", "mar"]
  },
  {
    question: "¿Qué es Ciencia Molecular?",
    answer: "**182 UC** en biología molecular, genética y bioinformática. 🧬 ¿Salida laboral?",
    category: "carreras",
    keywords: ["ciencia molecular", "molecular"]
  },
  {
    question: "¿Qué es Biología Computacional?",
    answer: "**185 UC** en bioinformática, quimioinformática y ML aplicado. 💻 ¿Campo laboral?",
    category: "carreras",
    keywords: ["biología computacional", "bioinformática"]
  },
  {
    question: "¿Qué es Licenciatura en Física?",
    answer: "**181 UC** en mecánica, electromagnetismo y física moderna. ⚛️ ¿Dónde trabajar?",
    category: "carreras",
    keywords: ["física", "mecánica", "cuántica"]
  },
  {
    question: "¿Qué es Licenciatura en Filosofía?",
    answer: "**184 UC** en historia de filosofía, lógica y ética. 📚 ¿Salida laboral?",
    category: "carreras",
    keywords: ["filosofía", "lógica", "ética"]
  },
  
  // Admisión
  {
    question: "¿Cómo me inscribo en la UNC?",
    answer: "Regístrate en el **SNI 2025** y postúlate en **unc.edu.ve**. 📝 ¿Qué documentos necesitas?",
    category: "admisiones",
    keywords: ["inscripción", "postulación", "cómo inscribirse"]
  },
  {
    question: "¿Quiénes pueden postularse?",
    answer: "Estudiantes de **último año** o **bachilleres graduados** registrados en SNI. 🎓 ¿Requisitos?",
    category: "admisiones",
    keywords: ["requisitos", "quién puede", "elegibilidad"]
  },
  {
    question: "¿Qué documentos necesito?",
    answer: "**Cédula, título de bachiller, notas** y constancia SNI. 📄 ¿Cómo postularse?",
    category: "admisiones",
    keywords: ["documentos", "requisitos", "papeles"]
  },
  {
    question: "¿La UNC participa en el SNI?",
    answer: "Sí, con **16 carreras** en el Sistema Nacional de Ingreso. ✅ ¿Cómo registrarse?",
    category: "admisiones",
    keywords: ["SNI", "sistema nacional ingreso"]
  },
  
  // Modalidad
  {
    question: "¿Cuál es la modalidad de estudio?",
    answer: "**Presencial turno diurno** con tecnología de punta. 🏫 ¿Horarios?",
    category: "modalidad",
    keywords: ["modalidad", "presencial", "horario"]
  },
  {
    question: "¿Hay modalidad a distancia?",
    answer: "No, solo **presencial** en Altos de Pipe, Miranda. 🏫 ¿Ubicación?",
    category: "modalidad",
    keywords: ["distancia", "online", "virtual"]
  },
  
  // Modelo educativo
  {
    question: "¿Qué modelo educativo tiene?",
    answer: "**Ciencia abierta** con enfoque en creatividad e innovación. 💡 ¿Metodología?",
    category: "metodologia",
    keywords: ["modelo", "pedagogía", "enfoque"]
  },
  {
    question: "¿Cuántos profesores tiene?",
    answer: "Más de **160 especialistas** nacionales e internacionales. 👨‍🏫 ¿Cooperación internacional?",
    category: "profesores",
    keywords: ["profesores", "docentes", "especialistas"]
  },
  {
    question: "¿Tiene cooperación internacional?",
    answer: "Sí, con **China, Rusia e Irán** en varias carreras. 🌍 ¿En qué áreas?",
    category: "internacional",
    keywords: ["internacional", "cooperación", "convenios"]
  },
  
  // Infraestructura
  {
    question: "¿Qué instalaciones tiene?",
    answer: "**Laboratorios especializados** y tecnología de punta. 🔬 ¿Quieres visitarlas?",
    category: "instalaciones",
    keywords: ["instalaciones", "laboratorios", "infraestructura"]
  },
  {
    question: "¿Tiene laboratorios?",
    answer: "Sí, **labs equipados** para cada área de conocimiento. 🧪 ¿Qué carrera te interesa?",
    category: "instalaciones",
    keywords: ["laboratorios", "labs", "prácticas"]
  },
  
  // Contacto
  {
    question: "¿Cuál es el Instagram de la UNC?",
    answer: "**@unicienciasvzla** con info de admisión y noticias. 📱 ¿Otros contactos?",
    category: "contacto",
    keywords: ["instagram", "redes sociales", "IG"]
  },
  {
    question: "¿Cómo contacto a la UNC?",
    answer: "Web: **unc.edu.ve** | IG: **@unicienciasvzla** | Altos de Pipe, Miranda. 📞 ¿Más info?",
    category: "contacto",
    keywords: ["contacto", "teléfono", "email"]
  },
  
  // Misceláneas
  {
    question: "¿Quién fue Humberto Fernández-Morán?",
    answer: "**Científico venezolano** del siglo XX, inspiración de la UNC. 🔬 ¿Su legado?",
    category: "historia",
    keywords: ["Humberto Fernández", "científico", "historia"]
  },
  {
    question: "¿La UNC es pública o privada?",
    answer: "**Pública** y parte del SNI con 175 instituciones. 🏛️ ¿Es gratuita?",
    category: "informacion_general",
    keywords: ["pública", "privada", "gratuita"]
  },
  {
    question: "¿Cuántos estudiantes tiene?",
    answer: "Inició con **500 estudiantes** en 2025, expandiendo matrícula. 👥 ¿Proceso de admisión?",
    category: "estadisticas",
    keywords: ["estudiantes", "matrícula", "cuántos"]
  },
  
  // Nuevas FAQs - Detalles legales y administrativos
  {
    question: "¿Cuál es la base legal de la UNC?",
    answer: "Creada por **Decreto N° 5.055**, Gaceta 6.863 del 11/12/2024. 📜 ¿Más info institucional?",
    category: "legal",
    keywords: ["decreto", "gaceta", "legal"]
  },
  {
    question: "¿Cuándo inician clases en 2025?",
    answer: "Inicio de formación académica: **26 de mayo de 2025**. 📅 ¿Proceso de admisión?",
    category: "admisiones",
    keywords: ["inicio clases", "mayo 2025"]
  },
  {
    question: "¿Hay transporte estudiantil?",
    answer: "Sí, rutas desde **Los Teques y Caracas**. 🚌 ¿Horarios en Instagram?",
    category: "vida-universitaria",
    keywords: ["transporte", "rutas", "buses"]
  },
  {
    question: "¿La UNC ofrece posgrados?",
    answer: "Sí, **pregrado y estudios avanzados** para talento científico. 🎓 ¿Qué áreas?",
    category: "oferta",
    keywords: ["posgrado", "estudios avanzados", "maestría"]
  },
  {
    question: "¿Quién desarrolla el portal web?",
    answer: "Desarrollado por el **Mincyt** (Ministerio de Ciencia). 💻 ¿Más info?",
    category: "institucional",
    keywords: ["Mincyt", "portal", "web"]
  }
];

async function importSQLFAQs() {
  console.log('🚀 Importing FAQs from SQL format\n');
  console.log(`📋 Found ${sqlFAQs.length} FAQs to import\n`);
  
  // Generate embeddings
  console.log('🔢 Generating embeddings...');
  const questions = sqlFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  // Prepare FAQs for insertion
  const faqsToInsert = sqlFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'sql-import',
      imported_at: new Date().toISOString(),
    },
    embedding: embeddings[idx],
    created_by: 'sql-import',
    is_active: true,
  }));
  
  // Insert in batches
  const batchSize = 10;
  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < faqsToInsert.length; i += batchSize) {
    const batch = faqsToInsert.slice(i, i + batchSize);
    
    console.log(`📤 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(faqsToInsert.length / batchSize)}...`);
    
    const { data, error } = await supabase
      .from('faqs')
      .insert(batch)
      .select();
    
    if (error) {
      console.error(`❌ Error inserting batch:`, error.message);
      errors += batch.length;
    } else {
      inserted += data.length;
      console.log(`✅ Inserted ${data.length} FAQs`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Import completed!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${sqlFAQs.length}\n`);
}

importSQLFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
