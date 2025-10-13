#!/usr/bin/env node

/**
 * Add Licenciaturas FAQs with Descriptions and Career Paths
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

const licenciaturasFAQs = [
  // FÍSICA NUCLEAR
  {
    question: "¿De qué trata la Licenciatura en Física Nuclear?",
    answer: "La Física Nuclear forma científicos especializados en el estudio del núcleo atómico, radiación, y aplicaciones nucleares. Estudiarás física de partículas, reactores nucleares, protección radiológica, física médica nuclear, detectores de radiación, y aplicaciones en medicina, energía e investigación. Es la ciencia que explora la estructura fundamental de la materia. ⚛️🔬",
    category: "carreras",
    keywords: ["física nuclear", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un licenciado en Física Nuclear?",
    answer: "Un físico nuclear investiga fenómenos nucleares, trabaja en protección radiológica, opera equipos de radiación, desarrolla aplicaciones médicas (radioterapia, medicina nuclear), realiza dosimetría, trabaja en centrales nucleares, investiga nuevas fuentes de energía, y asegura el uso seguro de materiales radiactivos. ☢️🔬",
    category: "carreras",
    keywords: ["física nuclear", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un físico nuclear?",
    answer: "Trabajan en: **hospitales** (radioterapia, medicina nuclear), **centrales nucleares**, **centros de investigación** (CERN, IAEA), **universidades**, **empresas de protección radiológica**, **industria petrolera** (perfilaje de pozos), **organismos reguladores nucleares**, **laboratorios de física de partículas**, y **empresas de tecnología médica**. 🏥⚡",
    category: "carreras",
    keywords: ["física nuclear", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuáles son las salidas laborales de Física Nuclear?",
    answer: "**Salidas**: Físico médico (radioterapia), oficial de protección radiológica, investigador en física nuclear, docente universitario, especialista en dosimetría, consultor en seguridad nuclear, físico de reactores, investigador en energía nuclear. Demanda en medicina y energía. 🚀⚛️",
    category: "carreras",
    keywords: ["física nuclear", "salidas", "oportunidades", "empleos"]
  },

  // BIOLOGÍA Y QUÍMICA COMPUTACIONAL
  {
    question: "¿Qué es Biología y Química Computacional?",
    answer: "Combina biología, química y computación para modelar sistemas biológicos y químicos. Estudiarás bioinformática, modelado molecular, diseño de fármacos por computadora, análisis de genomas, dinámica molecular, machine learning en biología, y química cuántica computacional. La ciencia del futuro en investigación biomédica. 🧬💻",
    category: "carreras",
    keywords: ["biología computacional", "química computacional", "descripción"]
  },
  {
    question: "¿Qué hace un licenciado en Biología y Química Computacional?",
    answer: "Desarrolla modelos computacionales de sistemas biológicos, diseña fármacos mediante simulación molecular, analiza secuencias genómicas, crea algoritmos para análisis de proteínas, simula reacciones químicas, aplica IA a descubrimiento de medicamentos, y desarrolla herramientas bioinformáticas. 🔬💻",
    category: "carreras",
    keywords: ["biología computacional", "química computacional", "hace"]
  },
  {
    question: "¿Dónde trabaja en Biología y Química Computacional?",
    answer: "Trabajan en: **industria farmacéutica** (Pfizer, Novartis, Roche), **empresas de biotecnología**, **centros de investigación genómica**, **universidades**, **startups de drug discovery**, **hospitales** (medicina de precisión), **empresas de IA en salud**, y pueden emprender en **bioinformática**. 🏥💊",
    category: "carreras",
    keywords: ["biología computacional", "química computacional", "trabajo"]
  },
  {
    question: "¿Qué oportunidades tiene Biología y Química Computacional?",
    answer: "**Oportunidades**: Bioinformático, científico de datos en salud, diseñador computacional de fármacos, analista genómico, investigador en medicina de precisión, desarrollador de software científico, especialista en modelado molecular. Área en explosivo crecimiento. 📈🧬",
    category: "carreras",
    keywords: ["biología computacional", "química computacional", "oportunidades"]
  },

  // BIOTECNOLOGÍA
  {
    question: "¿De qué se trata la Licenciatura en Biotecnología?",
    answer: "La Biotecnología aplica organismos vivos y procesos biológicos para crear productos innovadores. Estudiarás ingeniería genética, cultivo de células, producción de biofármacos, biología molecular, microbiología industrial, fermentación, bioingeniería, y aplicaciones en medicina, agricultura y medio ambiente. 🧬🔬",
    category: "carreras",
    keywords: ["biotecnología", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un biotecnólogo?",
    answer: "Desarrolla productos biológicos (vacunas, insulina, anticuerpos), modifica genéticamente organismos, produce biocombustibles, crea cultivos resistentes, desarrolla terapias génicas, trabaja en diagnóstico molecular, produce enzimas industriales, y crea soluciones biotecnológicas. 🦠💉",
    category: "carreras",
    keywords: ["biotecnología", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un biotecnólogo?",
    answer: "Trabajan en: **industria farmacéutica**, **empresas de biotecnología** (Genentech, Amgen), **laboratorios de diagnóstico molecular**, **empresas agrícolas** (Monsanto, Bayer), **centros de investigación**, **empresas de biocombustibles**, **hospitales**, **startups biotech**, y pueden emprender. 🏭🧬",
    category: "carreras",
    keywords: ["biotecnología", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuál es el campo laboral de Biotecnología?",
    answer: "**Campo laboral**: Investigador en biotecnología, especialista en ingeniería genética, productor de biofármacos, biotecnólogo agrícola, especialista en diagnóstico molecular, desarrollador de terapias génicas, biotecnólogo ambiental. Sector en auge. 🚀🌱",
    category: "carreras",
    keywords: ["biotecnología", "campo", "salidas", "oportunidades"]
  },

  // CIENCIA MOLECULAR
  {
    question: "¿Qué es la Licenciatura en Ciencia Molecular?",
    answer: "La Ciencia Molecular estudia procesos biológicos a nivel molecular para entender enfermedades y desarrollar tratamientos. Estudiarás biología molecular, genética, bioquímica, proteómica, genómica, biología celular, técnicas de laboratorio avanzadas, y medicina de precisión. 🧬🔬",
    category: "carreras",
    keywords: ["ciencia molecular", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un científico molecular?",
    answer: "Investiga genes y proteínas, estudia mecanismos de enfermedades, desarrolla diagnósticos moleculares, realiza análisis genéticos, investiga terapias dirigidas, trabaja en secuenciación de ADN, estudia expresión génica, y contribuye a medicina personalizada. 🔬💊",
    category: "carreras",
    keywords: ["ciencia molecular", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un científico molecular?",
    answer: "Trabajan en: **centros de investigación biomédica**, **hospitales universitarios**, **industria farmacéutica**, **laboratorios de genética**, **empresas de medicina de precisión**, **universidades**, **institutos de cáncer**, **startups de genómica**, y pueden emprender. 🏥🧬",
    category: "carreras",
    keywords: ["ciencia molecular", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué salidas laborales tiene Ciencia Molecular?",
    answer: "**Salidas**: Investigador en biología molecular, genetista, especialista en diagnóstico molecular, científico en desarrollo de fármacos, investigador en cáncer, especialista en medicina de precisión, docente universitario. Alta demanda. 🚀🔬",
    category: "carreras",
    keywords: ["ciencia molecular", "salidas", "oportunidades", "empleos"]
  },

  // CIENCIA DE DATOS
  {
    question: "¿De qué trata la Licenciatura en Ciencia de Datos?",
    answer: "La Ciencia de Datos forma profesionales en análisis e interpretación de grandes volúmenes de datos. Estudiarás estadística avanzada, machine learning, big data, programación (Python, R), bases de datos, visualización de datos, minería de datos, y análisis predictivo. La profesión más demandada del siglo XXI. 📊💻",
    category: "carreras",
    keywords: ["ciencia de datos", "data science", "descripción", "qué es"]
  },
  {
    question: "¿Qué hace un científico de datos?",
    answer: "Analiza grandes volúmenes de información, crea modelos predictivos, desarrolla algoritmos de machine learning, visualiza datos complejos, identifica patrones, automatiza análisis, genera insights para negocios, y toma decisiones basadas en datos. 📈🔍",
    category: "carreras",
    keywords: ["ciencia de datos", "data science", "hace", "función"]
  },
  {
    question: "¿Dónde puede trabajar un científico de datos?",
    answer: "Trabajan en: **empresas tecnológicas** (Google, Meta, Amazon), **bancos y fintech**, **e-commerce**, **consultoras** (McKinsey, Deloitte), **empresas de salud**, **startups**, **marketing digital**, **gobierno**, **telecomunicaciones**, y pueden emprender. 💼🌐",
    category: "carreras",
    keywords: ["ciencia de datos", "data science", "trabajo", "dónde trabajar"]
  },
  {
    question: "¿Cuáles son las oportunidades en Ciencia de Datos?",
    answer: "**Oportunidades**: Científico de datos, analista de datos, ingeniero de machine learning, especialista en big data, analista de business intelligence, data engineer, especialista en visualización, consultor en analytics. Una de las mejor pagadas. 💰🚀",
    category: "carreras",
    keywords: ["ciencia de datos", "data science", "oportunidades", "salidas"]
  },

  // FÍSICA
  {
    question: "¿Qué es la Licenciatura en Física?",
    answer: "La Física estudia las leyes fundamentales del universo, desde partículas subatómicas hasta galaxias. Estudiarás mecánica clásica y cuántica, electromagnetismo, termodinámica, óptica, física de materiales, astrofísica, física computacional. La ciencia que explica cómo funciona todo. 🌌⚛️",
    category: "carreras",
    keywords: ["física", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un físico?",
    answer: "Investiga fenómenos naturales, desarrolla teorías y modelos, realiza experimentos, aplica física a tecnología, trabaja en desarrollo de materiales, investiga energías alternativas, desarrolla instrumentación científica, modela sistemas complejos. 🔬🌟",
    category: "carreras",
    keywords: ["física", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un licenciado en Física?",
    answer: "Trabajan en: **centros de investigación** (CERN, NASA), **universidades**, **industria tecnológica** (semiconductores, óptica), **empresas de energía**, **laboratorios de materiales**, **empresas aeroespaciales**, **finanzas**, **startups tech**, **consultoría científica**. 🚀🔬",
    category: "carreras",
    keywords: ["física", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué salidas laborales tiene Física?",
    answer: "**Salidas**: Investigador científico, docente universitario, físico de materiales, astrofísico, físico médico, consultor científico, desarrollador de instrumentación, físico computacional, analista cuantitativo (finanzas). Muy versátil. 🌟💼",
    category: "carreras",
    keywords: ["física", "salidas", "oportunidades", "empleos"]
  },

  // MATEMÁTICAS
  {
    question: "¿De qué se trata la Licenciatura en Matemáticas?",
    answer: "Las Matemáticas son el lenguaje universal de la ciencia y tecnología. Estudiarás cálculo avanzado, álgebra abstracta, análisis matemático, ecuaciones diferenciales, teoría de números, matemáticas aplicadas, estadística, optimización, y modelado matemático. 🔢📐",
    category: "carreras",
    keywords: ["matemáticas", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un matemático?",
    answer: "Desarrolla modelos matemáticos, resuelve problemas complejos, crea algoritmos, aplica matemáticas a finanzas y economía, trabaja en criptografía, optimiza procesos, realiza análisis estadístico, investiga teoría matemática, y aplica matemáticas a data science, IA y física. 🧮💡",
    category: "carreras",
    keywords: ["matemáticas", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un matemático?",
    answer: "Trabajan en: **bancos y finanzas** (análisis de riesgo, trading), **empresas tecnológicas** (algoritmos, IA), **aseguradoras** (actuaría), **universidades**, **consultoras**, **empresas de criptografía**, **gobierno**, **startups de IA y data science**, y pueden emprender. 💼📊",
    category: "carreras",
    keywords: ["matemáticas", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuáles son las oportunidades en Matemáticas?",
    answer: "**Oportunidades**: Matemático aplicado, actuario, analista cuantitativo, científico de datos, criptógrafo, investigador matemático, docente universitario, consultor en optimización, desarrollador de algoritmos. Extremadamente versátil. 🚀💰",
    category: "carreras",
    keywords: ["matemáticas", "oportunidades", "salidas", "empleos"]
  },

  // NANOTECNOLOGÍA
  {
    question: "¿Qué es la Licenciatura en Nanotecnología?",
    answer: "La Nanotecnología manipula materia a escala nanométrica para crear materiales y dispositivos revolucionarios. Estudiarás nanomateriales, nanofabricación, nanoelectrónica, nanomedicina, caracterización de nanoestructuras, física y química a nanoescala. La tecnología del futuro. 🔬⚛️",
    category: "carreras",
    keywords: ["nanotecnología", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un nanotecnólogo?",
    answer: "Diseña y fabrica nanomateriales, desarrolla nanopartículas para medicina, crea dispositivos nanoelectrónicos, investiga propiedades a nanoescala, desarrolla sistemas de drug delivery, trabaja en energía solar nanoestructurada, crea sensores nanométricos. 🔬💊",
    category: "carreras",
    keywords: ["nanotecnología", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un especialista en Nanotecnología?",
    answer: "Trabajan en: **industria farmacéutica** (nanomedicina), **empresas de semiconductores** (Intel, Samsung), **centros de investigación**, **empresas de materiales avanzados**, **industria de energía solar**, **laboratorios de nanotecnología**, **universidades**, **startups nanotech**. 🏭🔬",
    category: "carreras",
    keywords: ["nanotecnología", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué salidas laborales tiene Nanotecnología?",
    answer: "**Salidas**: Investigador en nanotecnología, especialista en nanomateriales, desarrollador de nanomedicina, ingeniero de nanofabricación, científico de materiales, especialista en nanoelectrónica, investigador en energía nanoestructurada. Área emergente. 🚀⚛️",
    category: "carreras",
    keywords: ["nanotecnología", "salidas", "oportunidades", "empleos"]
  },

  // FILOSOFÍA
  {
    question: "¿De qué trata la Licenciatura en Filosofía?",
    answer: "La Filosofía estudia las preguntas fundamentales sobre existencia, conocimiento, ética, razón y realidad. Estudiarás historia de la filosofía, lógica, ética, epistemología, filosofía política, filosofía de la ciencia, pensamiento crítico, y argumentación. 🤔📚",
    category: "carreras",
    keywords: ["filosofía", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un filósofo?",
    answer: "Analiza problemas complejos, desarrolla pensamiento crítico, investiga cuestiones éticas, escribe ensayos, enseña filosofía, asesora en ética empresarial y bioética, trabaja en consultoría estratégica, analiza políticas públicas, y aplica razonamiento filosófico a problemas contemporáneos. 💭📖",
    category: "carreras",
    keywords: ["filosofía", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un licenciado en Filosofía?",
    answer: "Trabajan en: **universidades**, **empresas** (consultoría en ética), **medios de comunicación**, **editoriales**, **ONGs** (derechos humanos), **gobierno** (políticas públicas), **empresas tecnológicas** (ética en IA), **centros de investigación**, **comités de bioética**. 🏛️💼",
    category: "carreras",
    keywords: ["filosofía", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuáles son las salidas laborales de Filosofía?",
    answer: "**Salidas**: Docente universitario, investigador filosófico, consultor en ética, analista de políticas públicas, escritor y ensayista, periodista especializado, asesor en bioética, consultor en ética empresarial, especialista en ética de IA. 🎓💡",
    category: "carreras",
    keywords: ["filosofía", "salidas", "oportunidades", "empleos"]
  },

  // OCEANOLOGÍA
  {
    question: "¿Qué es la Licenciatura en Oceanología?",
    answer: "La Oceanología estudia los océanos: su física, química, biología y geología para entender y proteger ecosistemas marinos. Estudiarás oceanografía física y química, biología marina, geología marina, ecología marina, cambio climático, conservación marina, y tecnologías de exploración oceánica. 🌊🐋",
    category: "carreras",
    keywords: ["oceanología", "oceanografía", "descripción", "qué es"]
  },
  {
    question: "¿Qué hace un oceanólogo?",
    answer: "Estudia ecosistemas marinos, investiga corrientes oceánicas y clima, analiza química del agua, estudia vida marina, monitorea contaminación oceánica, investiga cambio climático, realiza expediciones marinas, desarrolla estrategias de conservación, y gestiona recursos marinos. 🌊🔬",
    category: "carreras",
    keywords: ["oceanología", "oceanografía", "hace", "función"]
  },
  {
    question: "¿Dónde trabaja un oceanólogo?",
    answer: "Trabajan en: **institutos de investigación marina**, **universidades**, **organismos ambientales**, **empresas petroleras** (exploración offshore), **acuarios**, **ONGs ambientales** (WWF, Greenpeace), **gobierno** (gestión costera), **empresas de acuicultura**, **consultoras ambientales**. 🏖️🐠",
    category: "carreras",
    keywords: ["oceanología", "oceanografía", "trabajo", "dónde trabajar"]
  },
  {
    question: "¿Qué salidas laborales tiene Oceanología?",
    answer: "**Salidas**: Investigador marino, oceanógrafo, biólogo marino, consultor ambiental marino, especialista en conservación oceánica, gestor de áreas marinas protegidas, investigador en cambio climático, especialista en acuicultura. Creciente demanda. 🌊🚀",
    category: "carreras",
    keywords: ["oceanología", "oceanografía", "salidas", "oportunidades"]
  },

  // PREGUNTAS GENERALES
  {
    question: "¿Cuál licenciatura tiene mejor salida laboral?",
    answer: "**Ciencia de Datos** es la más demandada con excelentes salarios. **Biotecnología** y **Biología y Química Computacional** tienen alta demanda en farmacéuticas. **Física** y **Matemáticas** son muy versátiles. 📊🔬 ¿Qué área te apasiona?",
    category: "carreras",
    keywords: ["mejor", "licenciatura", "salida laboral", "comparación"]
  },
  {
    question: "¿Qué licenciatura estudiar si me gusta la biología?",
    answer: "Si te gusta la biología: **Biotecnología** (aplicaciones prácticas), **Ciencia Molecular** (investigación médica), **Biología y Química Computacional** (bioinformática), u **Oceanología** (vida marina). 🧬🌊 ¿Prefieres medicina, tecnología o medio ambiente?",
    category: "carreras",
    keywords: ["biología", "ciencias biológicas", "recomendar"]
  },
  {
    question: "¿Qué licenciatura tiene que ver con tecnología?",
    answer: "Las más tech: **Ciencia de Datos** (análisis y ML), **Biología y Química Computacional** (bioinformática), **Física** (física computacional), y **Matemáticas** (algoritmos y criptografía). 💻🔢 ¿Qué problemas te gustaría resolver?",
    category: "carreras",
    keywords: ["tecnología", "programación", "computación"]
  },
  {
    question: "Quiero hacer investigación científica, ¿qué licenciatura?",
    answer: "Todas tienen fuerte componente de investigación. **Física**, **Ciencia Molecular**, **Física Nuclear**, y **Nanotecnología** son muy orientadas a investigación pura. **Biotecnología** y **Oceanología** combinan investigación con aplicaciones. 🔬🌟 ¿Qué área te fascina?",
    category: "carreras",
    keywords: ["investigación", "científica", "investigador"]
  },
  {
    question: "¿Cuál licenciatura para trabajar en el extranjero?",
    answer: "**Ciencia de Datos**, **Física**, **Matemáticas**, y **Biotecnología** tienen alta demanda internacional. **Física Nuclear** abre puertas a CERN e IAEA. **Nanotecnología** es muy valorada en países desarrollados. 🌍✈️ ¿Qué región te interesa?",
    category: "carreras",
    keywords: ["extranjero", "internacional", "exterior"]
  },
  {
    question: "¿Qué licenciatura para trabajar en medicina o salud?",
    answer: "Para salud: **Física Nuclear** (medicina nuclear, radioterapia), **Ciencia Molecular** (investigación médica), **Biotecnología** (biofármacos), **Biología y Química Computacional** (diseño de fármacos), o **Nanotecnología** (nanomedicina). 🏥💊 ¿Qué aspecto te interesa?",
    category: "carreras",
    keywords: ["medicina", "salud", "médica", "hospital"]
  }
];

async function addLicenciaturasFAQs() {
  console.log('🚀 Adding Licenciaturas FAQs with Descriptions and Career Paths\n');
  console.log(`📋 Found ${licenciaturasFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = licenciaturasFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = licenciaturasFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'licenciaturas-detailed',
      added_at: new Date().toISOString(),
      type: 'career-description'
    },
    embedding: embeddings[idx],
    created_by: 'licenciaturas-faqs',
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
  
  console.log(`✅ Added ${data.length} licenciaturas FAQs\n`);
  console.log('📊 Summary:');
  console.log('   - Física Nuclear: 4 FAQs');
  console.log('   - Biología y Química Computacional: 4 FAQs');
  console.log('   - Biotecnología: 4 FAQs');
  console.log('   - Ciencia Molecular: 4 FAQs');
  console.log('   - Ciencia de Datos: 4 FAQs');
  console.log('   - Física: 4 FAQs');
  console.log('   - Matemáticas: 4 FAQs');
  console.log('   - Nanotecnología: 4 FAQs');
  console.log('   - Filosofía: 4 FAQs');
  console.log('   - Oceanología: 4 FAQs');
  console.log('   - Preguntas generales: 6 FAQs');
  console.log('\n✨ Total: 46 FAQs agregadas exitosamente!\n');
}

addLicenciaturasFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
