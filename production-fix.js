#!/usr/bin/env node

/**
 * PRODUCTION FIX - Insert Critical FAQs Directly
 *
 * This script directly inserts the critical FAQ fixes into production database
 * No dependencies on complex import paths - uses direct API calls
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: '/Users/gabriel/chat-ai-pleniv2/.env' });

console.log('🔍 Checking environment variables...');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('Please check your .env file at /Users/gabriel/chat-ai-pleniv2/.env');
  process.exit(1);
}

console.log('✅ Environment variables loaded\n');

// Critical FAQ fixes that MUST be in production
const criticalFAQs = [
  {
    question: "que eres",
    answer: "Soy una IA creada por la comunidad para ayudar a estudiantes interesados en la UNC. No tengo relación oficial con la universidad - soy un proyecto comunitario que proporciona información basada en datos públicos. 🤖💬",
    category: "general",
    keywords: ["que eres", "quien eres", "que bot"],
    metadata: {
      source: "bot-presentation-community-project",
      type: "bot-identity-correction",
      priority: "critical",
      bot_presentation: true
    }
  },
  {
    question: "eres oficial de la universidad",
    answer: "No, no soy oficial de la UNC. Soy un proyecto comunitario creado por estudiantes y miembros de la comunidad para ayudar a otros estudiantes con información sobre la universidad. Toda la información que doy viene de fuentes públicas. 🤖💬",
    category: "general",
    keywords: ["oficial", "universidad", "representante"],
    metadata: {
      source: "bot-presentation-community-project",
      type: "bot-identity-correction",
      priority: "critical",
      bot_presentation: true
    }
  },
  {
    question: "hay becas",
    answer: "La UNC ofrece ayudas estudiantiles limitadas basadas en rendimiento académico y necesidad socioeconómica. No ofrecemos becas que cubran el 100% de los costos. Las ayudas disponibles son parciales y están sujetas a disponibilidad presupuestaria y cumplimiento de requisitos específicos. Para más información sobre criterios y proceso de solicitud, contacta a la oficina de asuntos estudiantiles. 💰📚",
    category: "finanzas",
    keywords: ["becas", "ayudas", "financiamiento", "estudiantiles"],
    metadata: {
      source: "scholarships-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "scholarships-information"
    }
  },
  {
    question: "cuanto promedio necesito para entrar en la carrera de ia",
    answer: "Para la Ingeniería en Inteligencia Artificial, que es una carrera muy demandada, necesitas un promedio alto en bachillerato. Generalmente se requiere entre 15-18 puntos sobre 20 como máximo posible. La competencia es alta, por lo que se recomienda un promedio excelente en matemáticas y ciencias. Los requisitos incluyen título de bachiller, notas certificadas y cédula de identidad. 📊🤖",
    category: "admisiones",
    keywords: ["promedio IA", "requisitos IA", "entrar ingeniería IA", "puntos IA"],
    metadata: {
      source: "ia-admission-requirements-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "ia-admission-requirements"
    }
  },
  {
    question: "cuándo son las próximas fechas de inscripción",
    answer: "Las inscripciones en la UNC abren en enero y julio de cada año. Las fechas específicas se anunciarán próximamente. Para inscribirte necesitas: 1) **Título de bachiller original**, 2) **Notas certificadas originales**, 3) **Cédula de identidad original**, y 4) **Certificado de participación OPSU**. Mantente atento a los anuncios oficiales para más detalles. 📅📋",
    category: "admisiones",
    keywords: ["inscripciones", "fechas", "requisitos", "documentos", "inscribirte"],
    metadata: {
      source: "admission-requirements-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "admission-documents"
    }
  },
  {
    question: "hay residencias estudiantiles disponibles",
    answer: "Sí, la UNC ofrece residencias estudiantiles con las siguientes condiciones: 1) **Por promedio académico**: Estudiantes con promedio entre 18-20 puntos, 2) **Por CAIU**: Puntaje mayor a 16 puntos en el Centro de Atención e Información Universitaria. Las residencias son limitadas y NO están garantizadas. Son válidas para estudiantes de cualquier estado de Venezuela EXCEPTO Distrito Capital, La Guaira y Miranda. Para más información, contacta al departamento de asuntos estudiantiles. 🏠📚",
    category: "instalaciones",
    keywords: ["residencias estudiantiles", "alojamiento", "residencia", "vivienda", "dormitorio"],
    metadata: {
      source: "residence-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "residence-information"
    }
  },
  {
    question: "la universidad ofrece programas de postgrado o maestrías",
    answer: "Actualmente la UNC NO ofrece programas de postgrado o maestrías. La universidad se enfoca exclusivamente en carreras de pre-grado (licenciaturas e ingenierías). Los estudiantes que deseen continuar con estudios de postgrado deben buscar oportunidades en otras instituciones universitarias. Para información sobre posibles futuros programas, contacta a la dirección académica. 📚🎓",
    category: "academico",
    keywords: ["postgrado", "maestrías", "doctorado", "post-grado", "especialización"],
    metadata: {
      source: "postgraduate-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "postgraduate-programs"
    }
  },
  {
    question: "hay oportunidades de intercambio estudiantil internacional",
    answer: "La UNC tiene cooperación internacional activa con universidades en **China, Rusia e Irán**. Estas oportunidades incluyen programas de intercambio estudiantil y prácticas internacionales en diversas carreras científicas y tecnológicas. Se requiere un promedio mínimo de 16/20 para participar. No hay convenios formales con universidades de USA, España o Brasil actualmente. Para más información sobre oportunidades disponibles, contacta a la oficina de relaciones internacionales. 🌏",
    category: "internacional",
    keywords: ["intercambio estudiantil", "internacional", "convenios", "cooperación", "prácticas"],
    metadata: {
      source: "international-exchange-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "international-cooperation"
    }
  },
  {
    question: "el transporte es un problema",
    answer: "La UNC sí ofrece transporte universitario que sale desde distintos puntos. Para verificar las rutas actuales y horarios, lo mejor es consultar directamente en la universidad. El transporte facilita el acceso desde varias zonas, pero también puedes usar transporte público o carritos por_apps. 🚇🚌",
    category: "ubicacion",
    keywords: ["transporte", "autobuses", "carritos", "metro", "llegar"],
    metadata: {
      source: "transport-hallucination-fix",
      type: "hallucination-correction",
      priority: "critical",
      fix_for: "transport-information"
    }
  },
  {
    question: "que carreras ofrecen",
    answer: "La UNC ofrece diversas carreras en áreas de ciencias, tecnología, ingeniería y ciencias sociales. Entre las más destacadas están: Ingeniería en Inteligencia Artificial, Ingeniería Civil, Ingeniería Eléctrica, Licenciatura en Física, Licenciatura en Matemáticas, Licenciatura en Biología, y muchas más. Para ver la lista completa actualizada, visita unc.edu.ve o contacta a admisiones. 📚🎓",
    category: "carreras",
    keywords: ["carreras", "programas", "ingenierías", "licenciaturas", "oferta académica"],
    metadata: {
      source: "basic-careers-info",
      type: "essential-information",
      priority: "high"
    }
  }
];

async function insertCriticalFAQs() {
  console.log('🚨 PRODUCTION FIX - INSERTING CRITICAL FAQs');
  console.log('=' .repeat(50));

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < criticalFAQs.length; i++) {
    const faq = criticalFAQs[i];
    const progress = `${i + 1}/${criticalFAQs.length}`;

    console.log(`\n📝 Inserting FAQ ${progress}: "${faq.question}"`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          keywords: faq.keywords,
          metadata: faq.metadata,
          is_active: true,
          created_by: 'production-fix-script'
        })
      });

      if (response.ok) {
        console.log(`   ✅ SUCCESS`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`   ❌ FAILED: ${response.status} - ${errorText}`);
        errorCount++;
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 PRODUCTION FIX RESULTS:');
  console.log(`✅ Successfully inserted: ${successCount} FAQs`);
  console.log(`❌ Failed: ${errorCount} FAQs`);
  console.log('='.repeat(50));

  if (successCount > 0) {
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Run: npm run init:embeddings');
    console.log('2. Test the system in production');
    console.log('3. Verify critical questions now work');
  }

  if (errorCount > 0) {
    console.log('\n⚠️  SOME FAQs FAILED TO INSERT');
    console.log('Check Supabase dashboard for duplicate key errors');
    console.log('Duplicates are OK - the important thing is data is there');
  }
}

// Run the fix
insertCriticalFAQs().catch(console.error);
