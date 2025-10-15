#!/usr/bin/env node

/**
 * Add Fundamentos de Carreras FAQs
 * 
 * Agrega FAQs sobre "en qué se basa" cada carrera
 * para evitar que el bot diga que no sabe
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

console.log('🎓 AGREGANDO FUNDAMENTOS DE CARRERAS\n');
console.log('=' .repeat(70));

const fundamentosFAQs = [
  // INGENIERÍAS
  {
    question: "en qué se basa nanotecnología",
    answer: "La **Nanotecnología** se basa en **manipular materia a escala nanométrica** (1-100 nanómetros, millonésimas de milímetro). Combina **física cuántica**, **química de materiales**, **biología molecular** y **matemáticas avanzadas** para crear materiales y dispositivos innovadores con propiedades únicas. Estudias síntesis de nanomateriales, caracterización, y aplicaciones en medicina, electrónica y energía. 🔬⚛️",
    category: "carreras",
    keywords: ["en qué se basa", "nanotecnología", "fundamentos", "base"]
  },
  {
    question: "en qué se basa inteligencia artificial",
    answer: "La **Inteligencia Artificial** se basa en **machine learning**, **redes neuronales**, **algoritmos de aprendizaje** y **procesamiento de datos masivos**. Combina **matemáticas avanzadas** (álgebra lineal, cálculo, estadística), **programación** (Python, frameworks de IA), y **ciencia de datos** para crear sistemas que aprenden y toman decisiones. Estudias deep learning, visión por computadora, NLP y más. 🤖💻",
    category: "carreras",
    keywords: ["en qué se basa", "inteligencia artificial", "IA", "fundamentos"]
  },
  {
    question: "en qué se basa ciberseguridad",
    answer: "La **Ciberseguridad** se basa en **criptografía**, **seguridad de redes**, **hacking ético**, **análisis de vulnerabilidades** y **gestión de riesgos**. Combina **informática**, **matemáticas** (teoría de números, criptografía), **sistemas operativos** (Linux, Windows) y **programación** para proteger sistemas, datos y redes contra ataques. Estudias pentesting, forense digital, seguridad de aplicaciones y más. 🔒💻",
    category: "carreras",
    keywords: ["en qué se basa", "ciberseguridad", "fundamentos", "seguridad"]
  },
  {
    question: "en qué se basa robótica",
    answer: "La **Robótica y Automatización** se basa en **mecatrónica**, **control automático**, **programación de sistemas embebidos**, **inteligencia artificial aplicada** y **visión por computadora**. Combina **mecánica**, **electrónica**, **programación** (C++, Python, ROS) y **matemáticas** para diseñar, programar y controlar robots industriales y autónomos. Estudias cinemática, dinámica, sensores y actuadores. 🤖⚙️",
    category: "carreras",
    keywords: ["en qué se basa", "robótica", "automatización", "fundamentos"]
  },
  {
    question: "en qué se basa electromedicina",
    answer: "La **Electromedicina** se basa en **electrónica médica**, **procesamiento de señales biológicas**, **instrumentación biomédica**, **imagenología** y **biofísica**. Combina **ingeniería electrónica**, **biología** (anatomía, fisiología), **física médica** y **programación** para diseñar, mantener y gestionar equipos médicos como resonancias, tomógrafos, monitores vitales y más. 🏥⚡",
    category: "carreras",
    keywords: ["en qué se basa", "electromedicina", "fundamentos", "biomédica"]
  },
  {
    question: "en qué se basa petroquímica",
    answer: "La **Ingeniería Petroquímica** se basa en **química orgánica**, **termodinámica**, **procesos de refinación**, **operaciones unitarias** y **balance de materia y energía**. Combina **química**, **física**, **matemáticas** y **procesos industriales** para transformar petróleo y gas en productos útiles (combustibles, plásticos, fertilizantes). Estudias destilación, craqueo, polimerización y más. ⚗️🛢️",
    category: "carreras",
    keywords: ["en qué se basa", "petroquímica", "fundamentos", "petróleo"]
  },
  {
    question: "en qué se basa biomateriales",
    answer: "La **Ingeniería en Biomateriales** se basa en **ciencia de materiales**, **química de polímeros**, **biología celular y molecular**, **biocompatibilidad** e **ingeniería de tejidos**. Combina **química**, **biología**, **física de materiales** y **nanotecnología** para diseñar materiales biocompatibles como prótesis, implantes, scaffolds para regeneración de tejidos y sistemas de liberación de fármacos. 🧬💊",
    category: "carreras",
    keywords: ["en qué se basa", "biomateriales", "fundamentos", "materiales"]
  },
  
  // LICENCIATURAS
  {
    question: "en qué se basa física",
    answer: "La **Licenciatura en Física** se basa en **mecánica clásica**, **electromagnetismo**, **termodinámica**, **mecánica cuántica**, **relatividad** y **métodos matemáticos avanzados**. Estudias las leyes fundamentales del universo, desde partículas subatómicas hasta cosmología. Combina **matemáticas**, **experimentación** y **modelado teórico** para entender la naturaleza. ⚛️📐",
    category: "carreras",
    keywords: ["en qué se basa", "física", "fundamentos", "licenciatura"]
  },
  {
    question: "en qué se basa física nuclear",
    answer: "La **Física Nuclear** se basa en **mecánica cuántica**, **física de partículas**, **radiactividad**, **reacciones nucleares** y **física atómica**. Estudias el núcleo atómico, interacciones fundamentales, radiación, detectores nucleares y aplicaciones en energía, medicina y tecnología. Combina **física teórica**, **matemáticas avanzadas** y **experimentación**. ☢️⚛️",
    category: "carreras",
    keywords: ["en qué se basa", "física nuclear", "fundamentos", "nuclear"]
  },
  {
    question: "en qué se basa biotecnología",
    answer: "La **Biotecnología** se basa en **biología molecular**, **genética**, **microbiología**, **bioquímica** y **ingeniería de bioprocesos**. Combina **biología**, **química**, **matemáticas** y **tecnología** para manipular organismos vivos y desarrollar productos útiles: medicamentos, alimentos, biocombustibles, terapias génicas. Estudias cultivo celular, ingeniería genética, fermentación y más. 🧬🔬",
    category: "carreras",
    keywords: ["en qué se basa", "biotecnología", "fundamentos", "biotech"]
  },
  {
    question: "en qué se basa ciencia de datos",
    answer: "La **Ciencia de Datos** se basa en **estadística**, **machine learning**, **programación** (Python, R), **bases de datos**, **visualización de datos** y **análisis predictivo**. Combina **matemáticas**, **estadística**, **informática** y **conocimiento del negocio** para extraer insights de datos masivos. Estudias big data, minería de datos, deep learning y análisis de datos. 📊💻",
    category: "carreras",
    keywords: ["en qué se basa", "ciencia de datos", "data science", "fundamentos"]
  },
  {
    question: "en qué se basa matemáticas",
    answer: "La **Licenciatura en Matemáticas** se basa en **álgebra abstracta**, **análisis matemático**, **geometría**, **topología**, **teoría de números** y **matemática aplicada**. Estudias estructuras matemáticas puras y sus aplicaciones en ciencia, tecnología y economía. Combina **lógica**, **demostración rigurosa** y **modelado matemático**. 📐🔢",
    category: "carreras",
    keywords: ["en qué se basa", "matemáticas", "fundamentos", "matemática"]
  },
  {
    question: "en qué se basa biología computacional",
    answer: "La **Biología y Química Computacional** se basa en **bioinformática**, **modelado molecular**, **simulación de sistemas biológicos**, **análisis de secuencias genéticas** y **química computacional**. Combina **biología**, **química**, **programación** (Python, R, Perl) y **matemáticas** para analizar datos biológicos masivos y simular procesos moleculares. 🧬💻",
    category: "carreras",
    keywords: ["en qué se basa", "biología computacional", "química computacional", "fundamentos"]
  },
  {
    question: "en qué se basa ciencia molecular",
    answer: "La **Ciencia Molecular** se basa en **química orgánica e inorgánica**, **biología molecular**, **bioquímica**, **espectroscopía** y **síntesis molecular**. Estudias la estructura, propiedades y reacciones de moléculas a nivel atómico. Combina **química**, **física**, **biología** y **técnicas de caracterización** para entender y diseñar nuevas moléculas. ⚗️🔬",
    category: "carreras",
    keywords: ["en qué se basa", "ciencia molecular", "fundamentos", "molecular"]
  },
  {
    question: "en qué se basa oceanología",
    answer: "La **Oceanología** se basa en **oceanografía física**, **química marina**, **biología marina**, **geología marina** y **ecología de ecosistemas acuáticos**. Estudias océanos, mares, corrientes, vida marina, contaminación y cambio climático. Combina **biología**, **química**, **física**, **geología** y **ciencias ambientales** para entender y proteger los ecosistemas marinos. 🌊🐠",
    category: "carreras",
    keywords: ["en qué se basa", "oceanología", "fundamentos", "oceanografía"]
  },
  {
    question: "en qué se basa filosofía",
    answer: "La **Licenciatura en Filosofía** se basa en **lógica**, **epistemología** (teoría del conocimiento), **ética**, **metafísica**, **filosofía de la ciencia** y **pensamiento crítico**. Estudias las grandes preguntas sobre existencia, conocimiento, valores y razón. Combina **análisis conceptual**, **argumentación rigurosa** y **historia del pensamiento** para desarrollar pensamiento crítico profundo. 🤔📚",
    category: "carreras",
    keywords: ["en qué se basa", "filosofía", "fundamentos", "filosofía"]
  },
  
  // VARIACIONES DE LA PREGUNTA
  {
    question: "cuál es la base de nanotecnología",
    answer: "La base de **Nanotecnología** es la **manipulación de materia a escala nanométrica** (1-100 nm). Se fundamenta en **física cuántica**, **química de materiales**, **biología molecular** y **matemáticas**. Creas materiales con propiedades únicas para aplicaciones en medicina, electrónica, energía y más. 🔬⚛️",
    category: "carreras",
    keywords: ["cuál es la base", "nanotecnología", "fundamento"]
  },
  {
    question: "en qué se fundamenta inteligencia artificial",
    answer: "La **IA** se fundamenta en **machine learning**, **redes neuronales profundas**, **algoritmos de optimización** y **procesamiento de datos masivos**. Usa **matemáticas avanzadas**, **estadística**, **programación** y **ciencia de datos** para crear sistemas inteligentes que aprenden de datos. 🤖📊",
    category: "carreras",
    keywords: ["en qué se fundamenta", "inteligencia artificial", "IA"]
  },
  {
    question: "qué estudia nanotecnología",
    answer: "**Nanotecnología** estudia la **manipulación de materia a escala nanométrica** para crear materiales y dispositivos con propiedades únicas. Estudias **síntesis de nanomateriales**, **caracterización** (microscopía, espectroscopía), **física cuántica**, **química de superficies** y **aplicaciones** en medicina, electrónica, energía y medio ambiente. 🔬⚛️",
    category: "carreras",
    keywords: ["qué estudia", "nanotecnología", "estudiar"]
  }
];

console.log(`\n📝 Agregando ${fundamentosFAQs.length} FAQs sobre fundamentos de carreras...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = fundamentosFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = fundamentosFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'fundamentos-carreras',
    added_at: new Date().toISOString(),
    type: 'career-fundamentals',
    priority: 'high',
    fixes_no_info_response: true
  },
  embedding: embeddings[idx],
  created_by: 'add-fundamentos-carreras',
  is_active: true,
}));

// Insertar en Supabase
const { data, error } = await supabase
  .from('faqs')
  .insert(faqsToInsert)
  .select();

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log(`✅ ${data.length} FAQs sobre fundamentos agregadas!\n`);
console.log('=' .repeat(70));
console.log('✨ CARRERAS CUBIERTAS:\n');
console.log('   INGENIERÍAS:');
console.log('   - Nanotecnología ✅');
console.log('   - Inteligencia Artificial ✅');
console.log('   - Ciberseguridad ✅');
console.log('   - Robótica y Automatización ✅');
console.log('   - Electromedicina ✅');
console.log('   - Petroquímica ✅');
console.log('   - Biomateriales ✅\n');
console.log('   LICENCIATURAS:');
console.log('   - Física ✅');
console.log('   - Física Nuclear ✅');
console.log('   - Biotecnología ✅');
console.log('   - Ciencia de Datos ✅');
console.log('   - Matemáticas ✅');
console.log('   - Biología Computacional ✅');
console.log('   - Ciencia Molecular ✅');
console.log('   - Oceanología ✅');
console.log('   - Filosofía ✅\n');
console.log('=' .repeat(70));
console.log('\n🎯 Ahora el bot responderá correctamente a:');
console.log('   - "en qué se basa [carrera]"');
console.log('   - "cuál es la base de [carrera]"');
console.log('   - "en qué se fundamenta [carrera]"');
console.log('   - "qué estudia [carrera]"\n');
