#!/usr/bin/env node

/**
 * Setup Supabase Database
 * 
 * Este script configura automáticamente la base de datos de Supabase:
 * 1. Crea el schema (tablas, funciones, índices)
 * 2. Carga FAQs de ejemplo
 * 3. Verifica la configuración
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

// Validate environment
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  console.error('   Ejecuta primero: node scripts/setup-env.js');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('\n🗄️  Configurando Supabase Database...\n');

/**
 * Check if extensions are enabled
 */
async function checkExtensions() {
  console.log('📦 Verificando extensiones...');
  
  // Note: Extensions must be enabled via Supabase Dashboard or SQL Editor
  // We can't enable them via the JS client
  console.log('   ⚠️  Asegúrate de habilitar estas extensiones en Supabase Dashboard:');
  console.log('      - uuid-ossp');
  console.log('      - vector (pgvector)');
  console.log('   ');
  console.log('   Ve a: Database → Extensions → Busca "vector" y "uuid-ossp" → Enable');
  console.log('');
}

/**
 * Create tables
 */
async function createTables() {
  console.log('📋 Creando tablas...');
  
  // Read migration file
  const migrationPath = path.join(rootDir, 'supabase', 'migrations', '001_initial_schema.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('   ❌ No se encontró el archivo de migración:', migrationPath);
    return false;
  }
  
  console.log('   ℹ️  Para crear las tablas, ejecuta el SQL manualmente:');
  console.log('   ');
  console.log('   1. Ve a Supabase Dashboard → SQL Editor');
  console.log('   2. Copia y pega el contenido de: supabase/migrations/001_initial_schema.sql');
  console.log('   3. Ejecuta el SQL');
  console.log('   ');
  console.log('   O usa la CLI de Supabase:');
  console.log('   supabase db push');
  console.log('');
  
  return true;
}

/**
 * Check if tables exist
 */
async function checkTables() {
  console.log('🔍 Verificando tablas...');
  
  const tables = ['faqs', 'documents', 'document_chunks', 'chat_sessions', 'analytics'];
  let allExist = true;
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      
      if (error) {
        console.log(`   ❌ Tabla "${table}" no existe o no es accesible`);
        allExist = false;
      } else {
        console.log(`   ✅ Tabla "${table}" existe`);
      }
    } catch (error) {
      console.log(`   ❌ Error verificando tabla "${table}":`, error.message);
      allExist = false;
    }
  }
  
  return allExist;
}

/**
 * Load sample FAQs
 */
async function loadSampleFAQs() {
  console.log('\n📝 Cargando FAQs de ejemplo...');
  
  // Check if FAQs already exist
  const { data: existingFAQs, error: checkError } = await supabase
    .from('faqs')
    .select('id')
    .limit(1);
  
  if (checkError) {
    console.error('   ❌ Error verificando FAQs:', checkError.message);
    return false;
  }
  
  if (existingFAQs && existingFAQs.length > 0) {
    console.log('   ℹ️  Ya existen FAQs en la base de datos');
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('   ¿Deseas agregar más FAQs de ejemplo? (s/n): ', resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() !== 's') {
      console.log('   ⏭️  Saltando carga de FAQs');
      return true;
    }
  }
  
  // Sample FAQs - Universidad Nacional de las Ciencias Dr. Humberto Fernández-Morán
  const sampleFAQs = [
    {
      question: '¿Qué es la UNC y cuál es su misión?',
      answer: 'La Universidad Nacional de las Ciencias Dr. Humberto Fernández-Morán (UNC) es la universidad del futuro con sentido de identidad nacional, a la defensa de la Paz. Fue creada para la formación de futuras generaciones de científicos, tecnólogos e innovadores en áreas prioritarias del país. Somos Ciencia para la Vida.',
      category: 'informacion_general',
      keywords: ['unc', 'mision', 'universidad', 'ciencias', 'humberto fernandez moran'],
      metadata: { priority: 'high', url: 'https://unc.edu.ve/' }
    },
    {
      question: '¿Dónde está ubicada la UNC?',
      answer: 'La UNC está ubicada en el Sector Altos de Pipe, kilómetro 11 de la carretera Panamericana, estado Miranda, Venezuela.',
      category: 'ubicacion',
      keywords: ['ubicacion', 'direccion', 'altos de pipe', 'miranda', 'donde queda'],
      metadata: { address: 'Sector Altos de Pipe, km 11, Panamericana, Miranda' }
    },
    {
      question: '¿Cuándo son las inscripciones en la UNC?',
      answer: 'Según el cronograma administrativo y académico 2025-2026, las inscripciones para estudiantes del 1er Semestre regular se realizan según el día que te corresponde. Puedes inscribirte en línea a través del portal oficial de la UNC. Te recomendamos estar atento a las redes sociales oficiales (Instagram, TikTok, Threads) para conocer las fechas exactas.',
      category: 'inscripciones',
      keywords: ['inscripciones', 'matricula', 'registro', 'primer semestre', 'cronograma'],
      metadata: { priority: 'high', year: '2025-2026' }
    },
    {
      question: '¿Qué carreras ofrece la UNC?',
      answer: 'La UNC ofrece carreras de pregrado en áreas científicas y tecnológicas prioritarias: Biotecnología, Ciencias de la Computación, Ingeniería Química, Neurociencia, Genética, Física, Matemáticas, Oceanología, Filosofía, Biomateriales, Ingeniería en Electromedicina, Nanotecnología, Ingeniería en Ciberseguridad, Ingeniería en Petroquímica, Ciencia Molecular, Biología y Química Computacional, y Física Nuclear. Todas las carreras tienen duración de 4 años (8 semestres).',
      category: 'carreras',
      keywords: ['carreras', 'programas', 'pregrado', 'biotecnologia', 'computacion', 'ingenieria', 'ciencias'],
      metadata: { priority: 'high', total_carreras: 17 }
    },
    {
      question: '¿Cuánto dura cada carrera en la UNC?',
      answer: 'Todas las carreras de pregrado en la UNC tienen una duración de 4 años, divididos en 8 semestres. Los créditos varían entre 181 y 191 U.C. según la carrera.',
      category: 'carreras',
      keywords: ['duracion', 'años', 'semestres', 'creditos', 'tiempo'],
      metadata: { duracion_años: 4, semestres: 8 }
    },
    {
      question: '¿Qué es Biotecnología y qué se estudia?',
      answer: 'Biotecnología en la UNC es una carrera que forma profesionales en investigación avanzada en biología celular y molecular. El campo de estudio incluye ingeniería genética, biología molecular, bioquímica, microbiología, y biotecnología industrial. Los egresados pueden trabajar en industria farmacéutica, alimentaria, agrícola, ambiental, y centros de investigación.',
      category: 'carreras',
      keywords: ['biotecnologia', 'biologia', 'genetica', 'molecular', 'investigacion'],
      metadata: { area: 'Ciencias Naturales', duracion: '4 años' }
    },
    {
      question: '¿Qué es Ingeniería en Ciberseguridad?',
      answer: 'La carrera de Ingeniería en Ciberseguridad en la UNC forma profesionales en seguridad de redes, sistemas operativos, criptografía, gestión de riesgos, y respuesta a incidentes. Duración: 4 años (8 semestres), 187 U.C. Campo laboral: empresas de tecnología, bancos, gobierno, consultoras de seguridad informática.',
      category: 'carreras',
      keywords: ['ciberseguridad', 'seguridad informatica', 'redes', 'hacking', 'tecnologia'],
      metadata: { area: 'Ingeniería y Tecnología', creditos: 187 }
    },
    {
      question: '¿Qué instalaciones tiene la UNC?',
      answer: 'La UNC cuenta con instalaciones de última generación: Laboratorios avanzados de computación con tecnología de punta, Aulas interactivas con aprendizaje dinámico y tecnología moderna, y Centros de investigación para innovar y transformar el futuro. Todos los ambientes están equipados con la más alta tecnología para potenciar el aprendizaje y la creatividad.',
      category: 'instalaciones',
      keywords: ['laboratorios', 'instalaciones', 'aulas', 'tecnologia', 'infraestructura'],
      metadata: { destacados: ['laboratorios_computacion', 'aulas_interactivas', 'centros_investigacion'] }
    },
    {
      question: '¿Qué procesos clave forman parte de la educación en la UNC?',
      answer: 'La formación en la UNC se basa en 6 procesos clave: 1) Investigar: formular preguntas y analizar datos, 2) Desarrollar: ejecutar iniciativas para el país, 3) Innovar: pensar creativamente y proponer soluciones, 4) Producir: crear obras académicas y productos, 5) Aplicar: transferir teorías a la práctica, 6) Transformar: ser agentes de cambio social.',
      category: 'metodologia',
      keywords: ['metodologia', 'formacion', 'investigacion', 'innovacion', 'desarrollo'],
      metadata: { procesos: 6 }
    },
    {
      question: '¿Cómo puedo contactar a la UNC?',
      answer: 'Puedes contactar a la UNC a través de sus redes sociales oficiales: TikTok, Instagram y Threads. También puedes visitar el sitio web oficial https://unc.edu.ve/ o acercarte a las instalaciones en Sector Altos de Pipe, kilómetro 11 de la carretera Panamericana, estado Miranda.',
      category: 'contacto',
      keywords: ['contacto', 'redes sociales', 'instagram', 'tiktok', 'comunicacion'],
      metadata: { website: 'https://unc.edu.ve/', redes: ['TikTok', 'Instagram', 'Threads'] }
    },
    {
      question: '¿Qué es Oceanología y qué campo laboral tiene?',
      answer: 'Oceanología en la UNC es una Licenciatura de 4 años (185 U.C.) en Ciencias Agrícolas y del Mar. Estudia oceanografía física, química, biológica, geología marina y recursos marinos. Campo laboral: investigación en institutos y universidades, gestión ambiental en gobiernos y ONGs, industria (acuicultura, pesca, turismo costero, energía marina), y consultoría ambiental.',
      category: 'carreras',
      keywords: ['oceanologia', 'mar', 'oceanos', 'marina', 'recursos marinos'],
      metadata: { area: 'Ciencias Agrícolas y del Mar', creditos: 185 }
    },
    {
      question: '¿Qué carreras de Ingeniería ofrece la UNC?',
      answer: 'La UNC ofrece varias ingenierías: Ingeniería Química (diseño de procesos y materiales), Ingeniería en Electromedicina (equipos médicos, 191 U.C.), Ingeniería en Ciberseguridad (seguridad informática, 187 U.C.), e Ingeniería en Petroquímica (procesos petroquímicos, 186 U.C.). Todas duran 4 años (8 semestres) y están en el área de Ingeniería y Tecnología.',
      category: 'carreras',
      keywords: ['ingenieria', 'ingeniero', 'tecnologia', 'quimica', 'electronica'],
      metadata: { total_ingenierias: 4, area: 'Ingeniería y Tecnología' }
    },
    {
      question: '¿Qué es Nanotecnología y dónde puedo trabajar?',
      answer: 'Nanotecnología en la UNC es una Licenciatura de 4 años (182 U.C.) que estudia síntesis de nanomateriales, propiedades a nanoescala, nanobiotecnología, nanoelectrónica y nanomateriales para energía. Campo laboral: industria (electrónica, farmacéutica, automotriz, energía), centros de investigación, y sector público en regulación y políticas de nanotecnología.',
      category: 'carreras',
      keywords: ['nanotecnologia', 'nanomateriales', 'nanoparticulas', 'tecnologia avanzada'],
      metadata: { area: 'Ingeniería y Tecnología', creditos: 182 }
    },
    {
      question: '¿Qué carreras de Ciencias Naturales hay en la UNC?',
      answer: 'En Ciencias Naturales, la UNC ofrece: Matemáticas, Física, Genética, Biología y Química Computacional (185 U.C., análisis genómico y diseño de fármacos), y Física Nuclear (181 U.C., estructura atómica, radioactividad, reactores). Todas son licenciaturas de 4 años con enfoque en investigación y aplicaciones tecnológicas.',
      category: 'carreras',
      keywords: ['ciencias naturales', 'matematicas', 'fisica', 'biologia', 'quimica'],
      metadata: { area: 'Ciencias Naturales', carreras: 5 }
    },
    {
      question: '¿La UNC ofrece carreras en el área de salud?',
      answer: 'Sí, la UNC ofrece carreras relacionadas con salud: Ciencia Molecular (182 U.C., biología molecular, genética, biotecnología aplicada a salud), Biomateriales (diseño de dispositivos médicos), e Ingeniería en Electromedicina (191 U.C., equipos médicos, imagenología, mantenimiento biomédico). Todas con enfoque científico y tecnológico.',
      category: 'carreras',
      keywords: ['salud', 'medicina', 'biomedicina', 'equipos medicos', 'biotecnologia'],
      metadata: { area: 'Ciencias Médicas y de la Salud', carreras: 3 }
    }
  ];
  
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert(sampleFAQs)
      .select();
    
    if (error) {
      console.error('   ❌ Error insertando FAQs:', error.message);
      return false;
    }
    
    console.log(`   ✅ ${data.length} FAQs cargadas exitosamente`);
    return true;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

/**
 * Main setup function
 */
async function main() {
  try {
    // Step 1: Check extensions
    await checkExtensions();
    
    // Step 2: Instructions for creating tables
    await createTables();
    
    // Step 3: Check if tables exist
    const tablesExist = await checkTables();
    
    if (!tablesExist) {
      console.log('\n⚠️  Algunas tablas no existen. Por favor:');
      console.log('   1. Ve a Supabase Dashboard → SQL Editor');
      console.log('   2. Ejecuta el contenido de: supabase/migrations/001_initial_schema.sql');
      console.log('   3. Vuelve a ejecutar este script\n');
      process.exit(1);
    }
    
    // Step 4: Load sample FAQs
    await loadSampleFAQs();
    
    console.log('\n✅ Configuración de Supabase completada!\n');
    console.log('🚀 Próximos pasos:');
    console.log('   1. Genera embeddings: npm run init:embeddings');
    console.log('   2. Inicia el servidor: npm start');
    console.log('   3. Prueba el chat: npm run test:chat\n');
    
  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

main();

