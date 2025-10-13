#!/usr/bin/env node

/**
 * Add Engineering FAQs with Descriptions and Career Paths
 * 
 * Agrega FAQs detalladas sobre las 6 ingenierías con descripciones
 * y salidas laborales de forma natural y conversacional
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

// FAQs detalladas de las ingenierías
const engineeringFAQs = [
  // ========== INGENIERÍA EN ELECTROMEDICINA ==========
  {
    question: "¿De qué trata Ingeniería en Electromedicina?",
    answer: "La Ingeniería en Electromedicina forma profesionales especializados en el diseño, mantenimiento y gestión de equipos médicos y tecnología hospitalaria. Aprenderás sobre imagenología médica (rayos X, resonancia magnética, tomografía), equipos de diagnóstico, dispositivos de monitoreo vital, sistemas de electrocirugía, y biomateriales. Es la combinación perfecta entre ingeniería electrónica y ciencias de la salud. 🏥⚡",
    category: "carreras",
    keywords: ["electromedicina", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero en Electromedicina?",
    answer: "Un ingeniero en Electromedicina diseña y mantiene equipos médicos, gestiona tecnología hospitalaria, calibra instrumentos de diagnóstico, asegura el funcionamiento de equipos de imagenología, desarrolla dispositivos biomédicos, y garantiza la seguridad de los sistemas electromédicos. También trabaja en la implementación de nuevas tecnologías en hospitales y clínicas. 🔧🏥",
    category: "carreras",
    keywords: ["electromedicina", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un ingeniero en Electromedicina?",
    answer: "Los ingenieros en Electromedicina trabajan en: **hospitales y clínicas** (mantenimiento de equipos), **empresas de tecnología médica** (diseño y desarrollo), **compañías de imagenología** (GE Healthcare, Siemens Healthineers, Philips), **centros de investigación biomédica**, **empresas de distribución de equipos médicos**, **organismos reguladores de salud**, y pueden emprender con **servicios de consultoría técnica hospitalaria**. 💼🏥",
    category: "carreras",
    keywords: ["electromedicina", "trabajo", "dónde trabajar", "salida laboral", "campo laboral"]
  },
  {
    question: "¿Cuáles son las salidas laborales de Electromedicina?",
    answer: "**Salidas laborales**: Ingeniero biomédico hospitalario, especialista en imagenología médica, técnico de equipos de diagnóstico, gerente de tecnología hospitalaria, diseñador de dispositivos médicos, consultor en tecnología sanitaria, investigador en biomedicina, y emprendedor en soluciones de salud digital. La demanda es alta por la modernización constante de hospitales. 🚀🏥",
    category: "carreras",
    keywords: ["electromedicina", "salidas", "oportunidades", "empleos"]
  },

  // ========== INGENIERÍA EN ROBÓTICA Y AUTOMATIZACIÓN ==========
  {
    question: "¿De qué se trata Ingeniería en Robótica y Automatización?",
    answer: "Esta ingeniería forma expertos en diseño, programación y control de robots y sistemas automatizados. Estudiarás mecatrónica, inteligencia artificial aplicada a robots, visión artificial, control de procesos industriales, sistemas embebidos, manufactura automatizada, y robótica colaborativa. Es ideal si te apasiona crear máquinas inteligentes que transformen la industria. 🤖⚙️",
    category: "carreras",
    keywords: ["robótica", "automatización", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero en Robótica?",
    answer: "Un ingeniero en Robótica diseña y programa robots industriales y de servicio, automatiza procesos de manufactura, desarrolla sistemas de control inteligente, implementa soluciones de visión artificial, optimiza líneas de producción, crea robots colaborativos (cobots), y desarrolla sistemas autónomos para diversas aplicaciones. 🦾🔧",
    category: "carreras",
    keywords: ["robótica", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un ingeniero en Robótica y Automatización?",
    answer: "Trabajan en: **industrias manufactureras** (automotriz, electrónica, alimentos), **empresas de automatización** (ABB, Siemens, Fanuc), **compañías de robótica** (Boston Dynamics, KUKA), **startups tecnológicas**, **centros de investigación en IA y robótica**, **empresas de logística** (Amazon, DHL), **sector aeroespacial**, y pueden crear sus propias **empresas de soluciones robóticas**. 🏭🚀",
    category: "carreras",
    keywords: ["robótica", "automatización", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué oportunidades laborales tiene Robótica?",
    answer: "**Oportunidades**: Ingeniero de automatización industrial, programador de robots, especialista en visión artificial, diseñador de sistemas mecatrónicos, consultor en Industria 4.0, desarrollador de robots de servicio, ingeniero de control de procesos, y emprendedor en robótica. Es una de las áreas con mayor crecimiento y demanda global. 📈🤖",
    category: "carreras",
    keywords: ["robótica", "oportunidades", "salidas", "empleos"]
  },

  // ========== INGENIERÍA EN BIOMATERIALES ==========
  {
    question: "¿Qué es Ingeniería en Biomateriales?",
    answer: "La Ingeniería en Biomateriales se enfoca en diseñar y desarrollar materiales para aplicaciones médicas y biológicas. Estudiarás ingeniería de tejidos, desarrollo de prótesis e implantes, biomateriales para regeneración celular, diseño de fármacos y sistemas de liberación controlada, nanotecnología médica, y biocompatibilidad. Es la ingeniería que salva vidas creando soluciones innovadoras en salud. 🧬💊",
    category: "carreras",
    keywords: ["biomateriales", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero en Biomateriales?",
    answer: "Un ingeniero en Biomateriales desarrolla implantes y prótesis biocompatibles, diseña materiales para regeneración de tejidos, crea sistemas de liberación de fármacos, investiga nuevos biomateriales para aplicaciones médicas, desarrolla scaffolds para ingeniería de tejidos, y trabaja en la innovación de dispositivos médicos implantables. 🔬🦴",
    category: "carreras",
    keywords: ["biomateriales", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un ingeniero en Biomateriales?",
    answer: "Trabajan en: **industria farmacéutica** (desarrollo de fármacos), **empresas de dispositivos médicos** (Medtronic, Johnson & Johnson), **centros de investigación biomédica**, **hospitales universitarios** (investigación clínica), **empresas de biotecnología**, **laboratorios de ingeniería de tejidos**, **compañías de implantes y prótesis**, y pueden emprender en **desarrollo de biomateriales innovadores**. 🏥🔬",
    category: "carreras",
    keywords: ["biomateriales", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuál es el campo laboral de Biomateriales?",
    answer: "**Campo laboral**: Investigador en biomateriales, ingeniero de desarrollo de productos médicos, especialista en ingeniería de tejidos, diseñador de implantes, consultor en biocompatibilidad, desarrollador de sistemas de drug delivery, y emprendedor en biotecnología médica. Sector en crecimiento por el envejecimiento poblacional y avances médicos. 🚀💉",
    category: "carreras",
    keywords: ["biomateriales", "campo", "salidas", "oportunidades"]
  },

  // ========== INGENIERÍA EN PETROQUÍMICA ==========
  {
    question: "¿De qué trata Ingeniería en Petroquímica?",
    answer: "La Ingeniería en Petroquímica forma profesionales en el diseño y optimización de procesos para transformar petróleo y gas en productos químicos valiosos. Estudiarás refinación de petróleo, producción de polímeros y plásticos, termodinámica aplicada, diseño de reactores químicos, control de procesos industriales, y tecnologías de energía. Fundamental para la industria energética y química. ⚗️🛢️",
    category: "carreras",
    keywords: ["petroquímica", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero Petroquímico?",
    answer: "Un ingeniero Petroquímico diseña y optimiza procesos de refinación, desarrolla métodos de producción de químicos y polímeros, gestiona plantas petroquímicas, supervisa la calidad de productos derivados del petróleo, implementa tecnologías de eficiencia energética, y trabaja en la transición hacia procesos más sostenibles y energías alternativas. ⚙️🔥",
    category: "carreras",
    keywords: ["petroquímica", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un ingeniero en Petroquímica?",
    answer: "Trabajan en: **refinerías de petróleo** (PDVSA, ExxonMobil, Shell), **plantas petroquímicas**, **empresas de gas natural**, **industria de polímeros y plásticos**, **compañías de energía**, **empresas de consultoría energética**, **centros de investigación en energías alternativas**, **organismos reguladores ambientales**, y pueden emprender en **tecnologías de procesos químicos**. 🏭⚡",
    category: "carreras",
    keywords: ["petroquímica", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué salidas laborales tiene Petroquímica?",
    answer: "**Salidas laborales**: Ingeniero de procesos petroquímicos, supervisor de refinería, especialista en producción de polímeros, consultor energético, ingeniero de control de calidad, investigador en energías alternativas, gerente de planta química, y emprendedor en tecnologías de procesos. Alta demanda en países con industria petrolera y química. 💼🛢️",
    category: "carreras",
    keywords: ["petroquímica", "salidas", "oportunidades", "empleos"]
  },

  // ========== INGENIERÍA EN INTELIGENCIA ARTIFICIAL ==========
  {
    question: "¿Qué es Ingeniería en Inteligencia Artificial?",
    answer: "La Ingeniería en IA forma expertos en crear sistemas inteligentes que aprenden y toman decisiones. Estudiarás machine learning, deep learning, redes neuronales, procesamiento de lenguaje natural (NLP), visión por computadora, robótica inteligente, big data, y ética en IA. Es la carrera del futuro, transformando todas las industrias con tecnología de punta. 🤖🧠",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero en IA?",
    answer: "Un ingeniero en IA desarrolla modelos de machine learning, crea chatbots y asistentes virtuales, diseña sistemas de reconocimiento de imágenes y voz, implementa algoritmos de predicción y análisis de datos, desarrolla sistemas de recomendación, automatiza procesos con IA, y crea soluciones de inteligencia artificial para resolver problemas complejos. 💻🚀",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde puede trabajar un ingeniero en Inteligencia Artificial?",
    answer: "Trabajan en: **empresas tecnológicas** (Google, Meta, Microsoft, Amazon), **startups de IA**, **bancos y fintech** (análisis de riesgo), **empresas de salud** (diagnóstico médico), **industria automotriz** (vehículos autónomos), **e-commerce** (sistemas de recomendación), **consultoras tecnológicas**, **centros de investigación en IA**, y pueden crear sus propias **startups de IA**. 🌐💡",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Cuáles son las oportunidades laborales en IA?",
    answer: "**Oportunidades**: Ingeniero de machine learning, científico de datos, desarrollador de IA, especialista en NLP, ingeniero de visión por computadora, arquitecto de soluciones de IA, investigador en deep learning, consultor en transformación digital con IA, y emprendedor tech. Una de las carreras mejor pagadas y con mayor demanda mundial. 💰🚀",
    category: "carreras",
    keywords: ["inteligencia artificial", "IA", "oportunidades", "salidas", "empleos"]
  },

  // ========== INGENIERÍA EN CIBERSEGURIDAD ==========
  {
    question: "¿De qué se trata Ingeniería en Ciberseguridad?",
    answer: "La Ingeniería en Ciberseguridad forma profesionales en protección de sistemas, redes y datos contra amenazas cibernéticas. Estudiarás hacking ético, criptografía, seguridad de redes, análisis forense digital, gestión de riesgos informáticos, respuesta a incidentes, seguridad en la nube, y cumplimiento normativo. Esencial en la era digital para proteger información crítica. 🔒🛡️",
    category: "carreras",
    keywords: ["ciberseguridad", "descripción", "qué es", "trata"]
  },
  {
    question: "¿Qué hace un ingeniero en Ciberseguridad?",
    answer: "Un ingeniero en Ciberseguridad protege sistemas y redes de ataques, realiza pruebas de penetración (pentesting), implementa medidas de seguridad informática, monitorea amenazas cibernéticas, responde a incidentes de seguridad, audita sistemas, desarrolla políticas de seguridad, y asegura el cumplimiento de normativas de protección de datos. 🕵️‍♂️💻",
    category: "carreras",
    keywords: ["ciberseguridad", "hace", "función", "trabajo"]
  },
  {
    question: "¿Dónde trabaja un ingeniero en Ciberseguridad?",
    answer: "Trabajan en: **bancos y sector financiero**, **empresas tecnológicas** (Microsoft, Cisco, Palo Alto Networks), **consultoras de seguridad** (Deloitte, PwC), **gobierno y defensa**, **empresas de telecomunicaciones**, **hospitales** (protección de datos médicos), **e-commerce**, **startups fintech**, **agencias de ciberseguridad**, y pueden emprender con **servicios de consultoría en seguridad**. 🏦🔐",
    category: "carreras",
    keywords: ["ciberseguridad", "trabajo", "dónde trabajar", "salida laboral"]
  },
  {
    question: "¿Qué salidas laborales tiene Ciberseguridad?",
    answer: "**Salidas laborales**: Analista de seguridad informática, pentester (hacker ético), ingeniero de seguridad de redes, especialista en respuesta a incidentes, auditor de seguridad, arquitecto de seguridad, analista forense digital, consultor en ciberseguridad, y emprendedor en soluciones de seguridad. Demanda crítica y creciente por aumento de ciberataques. 🚨💼",
    category: "carreras",
    keywords: ["ciberseguridad", "salidas", "oportunidades", "empleos"]
  },

  // ========== PREGUNTAS GENERALES CONVERSACIONALES ==========
  {
    question: "¿Cuál ingeniería tiene mejor salida laboral?",
    answer: "Todas nuestras ingenierías tienen excelente salida laboral, pero **Inteligencia Artificial** y **Ciberseguridad** están entre las más demandadas globalmente con salarios competitivos. **Robótica** y **Electromedicina** también tienen alta demanda por la automatización y modernización hospitalaria. La mejor opción depende de tus intereses. ¿Cuál área te apasiona más? 🎯",
    category: "carreras",
    keywords: ["mejor", "salida laboral", "demanda", "comparación"]
  },
  {
    question: "¿Qué ingeniería estudiar si me gusta la salud?",
    answer: "Si te gusta la salud, te recomiendo **Ingeniería en Electromedicina** (equipos médicos y tecnología hospitalaria) o **Ingeniería en Biomateriales** (implantes, prótesis, ingeniería de tejidos). Ambas combinan ingeniería con aplicaciones médicas directas. 🏥🔬 ¿Prefieres trabajar con equipos o con materiales?",
    category: "carreras",
    keywords: ["salud", "medicina", "médica", "recomendar"]
  },
  {
    question: "¿Qué ingeniería tiene que ver con tecnología?",
    answer: "Todas nuestras ingenierías son tecnológicas, pero las más orientadas a tech puro son: **Inteligencia Artificial** (IA y machine learning), **Ciberseguridad** (seguridad informática), y **Robótica y Automatización** (robots y sistemas inteligentes). 🤖💻 ¿Qué tipo de tecnología te interesa?",
    category: "carreras",
    keywords: ["tecnología", "tech", "informática", "computación"]
  },
  {
    question: "Quiero trabajar en empresas grandes, ¿qué ingeniería?",
    answer: "Para empresas grandes (Google, Microsoft, Amazon, etc.), te recomiendo **Inteligencia Artificial**, **Ciberseguridad**, o **Robótica**. También **Electromedicina** te abre puertas en multinacionales como GE Healthcare, Siemens, Philips. **Petroquímica** en empresas como Shell, ExxonMobil. 🏢🌐 ¿Qué sector te atrae?",
    category: "carreras",
    keywords: ["empresas grandes", "multinacionales", "corporaciones"]
  },
  {
    question: "¿Cuál ingeniería es mejor para emprender?",
    answer: "Todas permiten emprender, pero **Inteligencia Artificial** y **Robótica** son ideales para startups tecnológicas. **Ciberseguridad** para consultorías. **Biomateriales** para innovación médica. **Electromedicina** para servicios técnicos hospitalarios. Lo importante es tu visión emprendedora. 🚀💡 ¿Qué tipo de negocio te imaginas?",
    category: "carreras",
    keywords: ["emprender", "startup", "negocio", "empresa propia"]
  }
];

async function addEngineeringFAQs() {
  console.log('🚀 Adding Engineering FAQs with Descriptions and Career Paths\n');
  console.log(`📋 Found ${engineeringFAQs.length} FAQs to add\n`);
  
  // Generate embeddings
  console.log('🔢 Generating embeddings...');
  const questions = engineeringFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  // Prepare FAQs
  const faqsToInsert = engineeringFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'engineering-detailed',
      added_at: new Date().toISOString(),
      type: 'career-description'
    },
    embedding: embeddings[idx],
    created_by: 'engineering-faqs',
    is_active: true,
  }));
  
  // Insert
  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Added ${data.length} engineering FAQs\n`);
  console.log('📊 Summary:');
  console.log('   - Electromedicina: 4 FAQs');
  console.log('   - Robótica y Automatización: 4 FAQs');
  console.log('   - Biomateriales: 4 FAQs');
  console.log('   - Petroquímica: 4 FAQs');
  console.log('   - Inteligencia Artificial: 4 FAQs');
  console.log('   - Ciberseguridad: 4 FAQs');
  console.log('   - Preguntas generales: 5 FAQs');
  console.log('\n✨ Total: 29 FAQs agregadas exitosamente!\n');
}

addEngineeringFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
