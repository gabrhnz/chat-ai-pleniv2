#!/usr/bin/env node

/**
 * Add Career Recommendations FAQs
 * 
 * Agrega FAQs con recomendaciones para cada carrera
 * - 6 Ingenierías
 * - 10 Licenciaturas
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

console.log('🎓 AGREGANDO FAQs DE RECOMENDACIONES POR CARRERA\n');
console.log('=' .repeat(70));
console.log('📚 16 carreras: 6 Ingenierías + 10 Licenciaturas');
console.log('=' .repeat(70));

const careerRecommendationsFAQs = [
  // ========================================
  // INGENIERÍAS (6)
  // ========================================
  
  // 1. Inteligencia Artificial
  {
    question: "que deberia enfocarme a estudiar primero en inteligencia artificial",
    answer: "En **Ingeniería en IA**, enfócate primero en: **Matemática I** (cálculo y álgebra), **Lógica y Algoritmos** (programación base), y **Pensamiento Crítico** (análisis). Estas bases son fundamentales para machine learning y redes neuronales. 🤖📊",
    category: "inteligencia-artificial",
    keywords: ["enfocarme", "estudiar primero", "ia", "inteligencia artificial", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en ia",
    answer: "Las materias clave en **IA** son: **Matemática** (álgebra lineal, cálculo), **Lógica y Algoritmos** (programación), **Machine Learning**, **Redes Neuronales**, y **Procesamiento de Lenguaje Natural**. Domina las matemáticas primero. 🧮🤖",
    category: "inteligencia-artificial",
    keywords: ["materias importantes", "ia", "clave"]
  },

  // 2. Ciberseguridad
  {
    question: "que deberia enfocarme a estudiar primero en ciberseguridad",
    answer: "En **Ingeniería en Ciberseguridad**, prioriza: **Fundamentos de Redes** (cómo funcionan), **Programación** (Python, C), **Sistemas Operativos** (Linux), y **Criptografía básica**. Estas bases son esenciales para seguridad avanzada. 🔐💻",
    category: "ciberseguridad",
    keywords: ["enfocarme", "estudiar primero", "ciberseguridad", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en ciberseguridad",
    answer: "Las materias clave en **Ciberseguridad** son: **Redes de Computadoras**, **Criptografía**, **Seguridad de Sistemas**, **Ethical Hacking**, **Análisis Forense**, y **Programación**. Domina redes y programación primero. 🛡️🔒",
    category: "ciberseguridad",
    keywords: ["materias importantes", "ciberseguridad", "clave"]
  },

  // 3. Robótica
  {
    question: "que deberia enfocarme a estudiar primero en robotica",
    answer: "En **Ingeniería en Robótica**, enfócate en: **Física** (mecánica, cinemática), **Matemática** (cálculo, álgebra), **Programación** (C++, Python), y **Electrónica básica**. Estas bases son cruciales para diseño y control de robots. 🤖⚙️",
    category: "robotica",
    keywords: ["enfocarme", "estudiar primero", "robotica", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en robotica",
    answer: "Las materias clave en **Robótica** son: **Mecánica**, **Control Automático**, **Electrónica**, **Programación**, **Visión por Computadora**, y **Sistemas Embebidos**. Domina física y matemáticas primero. 🦾🔧",
    category: "robotica",
    keywords: ["materias importantes", "robotica", "clave"]
  },

  // 4. Electromedicina
  {
    question: "que deberia enfocarme a estudiar primero en electromedicina",
    answer: "En **Ingeniería en Electromedicina**, prioriza: **Biología** (anatomía, fisiología), **Física** (electromagnetismo), **Electrónica básica**, y **Matemática**. Estas bases son esenciales para equipos médicos y diagnóstico. 🏥⚡",
    category: "electromedicina",
    keywords: ["enfocarme", "estudiar primero", "electromedicina", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en electromedicina",
    answer: "Las materias clave en **Electromedicina** son: **Biofísica**, **Electrónica Médica**, **Procesamiento de Señales**, **Instrumentación Biomédica**, **Anatomía**, y **Fisiología**. Domina biología y electrónica primero. 💉🔬",
    category: "electromedicina",
    keywords: ["materias importantes", "electromedicina", "clave"]
  },

  // 5. Petroquímica
  {
    question: "que deberia enfocarme a estudiar primero en petroquimica",
    answer: "En **Ingeniería Petroquímica**, enfócate en: **Química General** (reacciones, estequiometría), **Matemática** (cálculo), **Física** (termodinámica), y **Química Orgánica**. Estas bases son fundamentales para procesos industriales. ⚗️🛢️",
    category: "petroquimica",
    keywords: ["enfocarme", "estudiar primero", "petroquimica", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en petroquimica",
    answer: "Las materias clave en **Petroquímica** son: **Química Orgánica**, **Termodinámica**, **Procesos Químicos**, **Refinación de Petróleo**, **Balance de Materia**, y **Operaciones Unitarias**. Domina química y física primero. 🧪⚡",
    category: "petroquimica",
    keywords: ["materias importantes", "petroquimica", "clave"]
  },

  // 6. Biomateriales
  {
    question: "que deberia enfocarme a estudiar primero en biomateriales",
    answer: "En **Ingeniería en Biomateriales**, prioriza: **Química** (orgánica, inorgánica), **Biología** (celular, molecular), **Física** (propiedades de materiales), y **Matemática**. Estas bases son cruciales para diseño de materiales biocompatibles. 🧬🔬",
    category: "biomateriales",
    keywords: ["enfocarme", "estudiar primero", "biomateriales", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en biomateriales",
    answer: "Las materias clave en **Biomateriales** son: **Ciencia de Materiales**, **Química de Polímeros**, **Biocompatibilidad**, **Ingeniería de Tejidos**, **Nanomateriales**, y **Biología Celular**. Domina química y biología primero. 💊🧪",
    category: "biomateriales",
    keywords: ["materias importantes", "biomateriales", "clave"]
  },

  // ========================================
  // LICENCIATURAS (10)
  // ========================================

  // 1. Física Nuclear
  {
    question: "que deberia enfocarme a estudiar primero en fisica nuclear",
    answer: "En **Física Nuclear**, enfócate en: **Matemática** (cálculo avanzado, ecuaciones diferenciales), **Física General** (mecánica, electromagnetismo), y **Química**. Estas bases son fundamentales para física cuántica y nuclear. ⚛️📐",
    category: "fisica-nuclear",
    keywords: ["enfocarme", "estudiar primero", "fisica nuclear", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en fisica nuclear",
    answer: "Las materias clave en **Física Nuclear** son: **Mecánica Cuántica**, **Física Atómica**, **Física de Partículas**, **Radiactividad**, **Física Estadística**, y **Métodos Matemáticos**. Domina matemáticas y física general primero. ☢️🔬",
    category: "fisica-nuclear",
    keywords: ["materias importantes", "fisica nuclear", "clave"]
  },

  // 2. Biología y Química Computacional
  {
    question: "que deberia enfocarme a estudiar primero en biologia y quimica computacional",
    answer: "En **Biología y Química Computacional**, prioriza: **Programación** (Python, R), **Biología** (molecular, celular), **Química** (orgánica), y **Matemática** (estadística). Estas bases son esenciales para modelado molecular. 🧬💻",
    category: "biologia-quimica-computacional",
    keywords: ["enfocarme", "estudiar primero", "biologia quimica computacional", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en biologia y quimica computacional",
    answer: "Las materias clave son: **Bioinformática**, **Modelado Molecular**, **Química Computacional**, **Programación Científica**, **Estadística**, y **Biología Molecular**. Domina programación y biología primero. 🔬💾",
    category: "biologia-quimica-computacional",
    keywords: ["materias importantes", "biologia quimica computacional", "clave"]
  },

  // 3. Biotecnología
  {
    question: "que deberia enfocarme a estudiar primero en biotecnologia",
    answer: "En **Biotecnología**, enfócate en: **Biología** (celular, molecular, genética), **Química** (orgánica, bioquímica), **Matemática**, y **Microbiología**. Estas bases son fundamentales para ingeniería genética y procesos biotecnológicos. 🧬🔬",
    category: "biotecnologia",
    keywords: ["enfocarme", "estudiar primero", "biotecnologia", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en biotecnologia",
    answer: "Las materias clave en **Biotecnología** son: **Genética**, **Biología Molecular**, **Ingeniería Genética**, **Bioquímica**, **Microbiología Industrial**, y **Bioingeniería**. Domina biología y química primero. 💉🧪",
    category: "biotecnologia",
    keywords: ["materias importantes", "biotecnologia", "clave"]
  },

  // 4. Ciencia Molecular
  {
    question: "que deberia enfocarme a estudiar primero en ciencia molecular",
    answer: "En **Ciencia Molecular**, prioriza: **Química** (general, orgánica, inorgánica), **Física** (cuántica), **Matemática** (cálculo), y **Biología Molecular**. Estas bases son cruciales para entender estructuras y reacciones moleculares. ⚗️🔬",
    category: "ciencia-molecular",
    keywords: ["enfocarme", "estudiar primero", "ciencia molecular", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en ciencia molecular",
    answer: "Las materias clave en **Ciencia Molecular** son: **Química Cuántica**, **Espectroscopía**, **Química Física**, **Síntesis Molecular**, **Cristalografía**, y **Termodinámica Molecular**. Domina química y física primero. 🧪⚛️",
    category: "ciencia-molecular",
    keywords: ["materias importantes", "ciencia molecular", "clave"]
  },

  // 5. Ciencia de Datos
  {
    question: "que deberia enfocarme a estudiar primero en ciencia de datos",
    answer: "En **Ciencia de Datos**, enfócate en: **Matemática** (estadística, álgebra lineal), **Programación** (Python, R), **Probabilidad**, y **Bases de Datos**. Estas bases son fundamentales para análisis y machine learning. 📊💻",
    category: "ciencia-datos",
    keywords: ["enfocarme", "estudiar primero", "ciencia de datos", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en ciencia de datos",
    answer: "Las materias clave en **Ciencia de Datos** son: **Estadística**, **Machine Learning**, **Minería de Datos**, **Visualización de Datos**, **Big Data**, y **Programación**. Domina matemáticas y programación primero. 📈🤖",
    category: "ciencia-datos",
    keywords: ["materias importantes", "ciencia de datos", "clave"]
  },

  // 6. Física
  {
    question: "que deberia enfocarme a estudiar primero en fisica",
    answer: "En **Física**, prioriza: **Matemática** (cálculo, álgebra lineal, ecuaciones diferenciales), **Física General** (mecánica, electromagnetismo), y **Laboratorio**. Estas bases son esenciales para física avanzada. 🌌📐",
    category: "fisica",
    keywords: ["enfocarme", "estudiar primero", "fisica", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en fisica",
    answer: "Las materias clave en **Física** son: **Mecánica Clásica**, **Electromagnetismo**, **Termodinámica**, **Mecánica Cuántica**, **Física Estadística**, y **Métodos Matemáticos**. Domina matemáticas primero. ⚡🔬",
    category: "fisica",
    keywords: ["materias importantes", "fisica", "clave"]
  },

  // 7. Matemáticas
  {
    question: "que deberia enfocarme a estudiar primero en matematicas",
    answer: "En **Matemáticas**, enfócate en: **Cálculo** (diferencial, integral), **Álgebra Lineal**, **Lógica Matemática**, y **Teoría de Conjuntos**. Estas bases son fundamentales para matemáticas avanzadas y análisis. 🔢📐",
    category: "matematicas",
    keywords: ["enfocarme", "estudiar primero", "matematicas", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en matematicas",
    answer: "Las materias clave en **Matemáticas** son: **Análisis Real**, **Álgebra Abstracta**, **Topología**, **Ecuaciones Diferenciales**, **Teoría de Números**, y **Geometría**. Domina cálculo y álgebra primero. ∞➗",
    category: "matematicas",
    keywords: ["materias importantes", "matematicas", "clave"]
  },

  // 8. Nanotecnología
  {
    question: "que deberia enfocarme a estudiar primero en nanotecnologia",
    answer: "En **Nanotecnología**, prioriza: **Física** (cuántica, estado sólido), **Química** (general, orgánica), **Matemática**, y **Ciencia de Materiales**. Estas bases son cruciales para manipulación a escala nanométrica. ⚡🔬",
    category: "nanotecnologia",
    keywords: ["enfocarme", "estudiar primero", "nanotecnologia", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en nanotecnologia",
    answer: "Las materias clave en **Nanotecnología** son: **Física Cuántica**, **Nanomateriales**, **Microscopía Electrónica**, **Química de Superficies**, **Nanofabricación**, y **Caracterización de Materiales**. Domina física y química primero. 🔬⚛️",
    category: "nanotecnologia",
    keywords: ["materias importantes", "nanotecnologia", "clave"]
  },

  // 9. Filosofía
  {
    question: "que deberia enfocarme a estudiar primero en filosofia",
    answer: "En **Filosofía**, enfócate en: **Historia de la Filosofía** (antigua, moderna), **Lógica** (formal, simbólica), **Epistemología**, y **Ética**. Estas bases son fundamentales para pensamiento crítico y análisis filosófico. 🤔📚",
    category: "filosofia",
    keywords: ["enfocarme", "estudiar primero", "filosofia", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en filosofia",
    answer: "Las materias clave en **Filosofía** son: **Metafísica**, **Epistemología**, **Ética**, **Filosofía de la Ciencia**, **Lógica**, y **Filosofía Política**. Domina lógica e historia de la filosofía primero. 💭📖",
    category: "filosofia",
    keywords: ["materias importantes", "filosofia", "clave"]
  },

  // 10. Oceanología
  {
    question: "que deberia enfocarme a estudiar primero en oceanologia",
    answer: "En **Oceanología**, prioriza: **Biología** (marina, ecología), **Química** (oceanográfica), **Física** (fluidos, termodinámica), y **Matemática**. Estas bases son esenciales para estudiar océanos y ecosistemas marinos. 🌊🐠",
    category: "oceanologia",
    keywords: ["enfocarme", "estudiar primero", "oceanologia", "recomendaciones"]
  },
  {
    question: "que materias son mas importantes en oceanologia",
    answer: "Las materias clave en **Oceanología** son: **Oceanografía Física**, **Biología Marina**, **Química Oceanográfica**, **Geología Marina**, **Ecología Marina**, y **Meteorología**. Domina biología y química primero. 🌊🔬",
    category: "oceanologia",
    keywords: ["materias importantes", "oceanologia", "clave"]
  }
];

console.log(`\n📝 Agregando ${careerRecommendationsFAQs.length} FAQs de recomendaciones...\n`);

// Generar embeddings
console.log('🔢 Generando embeddings...');
const questions = careerRecommendationsFAQs.map(faq => faq.question);
const embeddings = await generateEmbeddingsBatch(questions);
console.log('✅ Embeddings generados\n');

// Preparar FAQs para insertar
const faqsToInsert = careerRecommendationsFAQs.map((faq, idx) => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  keywords: faq.keywords,
  metadata: {
    source: 'career-recommendations',
    added_at: new Date().toISOString(),
    type: 'recommendations',
    career_type: faq.category.includes('ingenieria') || 
                 ['inteligencia-artificial', 'ciberseguridad', 'robotica', 'electromedicina', 'petroquimica', 'biomateriales'].includes(faq.category) 
                 ? 'ingenieria' : 'licenciatura'
  },
  embedding: embeddings[idx],
  created_by: 'add-career-recommendations',
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

console.log(`✅ ${data.length} FAQs de recomendaciones agregadas exitosamente!\n`);
console.log('📊 Resumen:');
console.log('   - 6 Ingenierías: 12 FAQs (2 por carrera)');
console.log('   - 10 Licenciaturas: 20 FAQs (2 por carrera)');
console.log('   - Total: 32 FAQs de recomendaciones\n');
console.log('✨ Ahora el bot puede responder preguntas como:');
console.log('   - "que deberia enfocarme a estudiar primero en [carrera]"');
console.log('   - "que materias son mas importantes en [carrera]"\n');
