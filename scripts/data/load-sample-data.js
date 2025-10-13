#!/usr/bin/env node

/**
 * Load Sample Data Script
 * 
 * Carga las FAQs de ejemplo en la base de datos usando la API admin.
 * Esto resuelve el problema de "No rows returned".
 */

import dotenv from 'dotenv';
import { supabaseAdmin } from '../../src/config/supabase.js';
import { generateEmbeddingsBatch } from '../../src/services/embeddings.service.js';
import logger from '../../src/utils/logger.js';

// Load environment variables
dotenv.config();

const SAMPLE_FAQS = [
  {
    question: '¿Cuándo son las inscripciones?',
    answer: 'Las inscripciones para el semestre 2025-1 serán del 1 al 15 de marzo de 2025. Puedes inscribirte en línea en el portal estudiantil o presencialmente en la oficina de registro académico.',
    category: 'matricula',
    keywords: ['inscripciones', 'matricula', 'fechas', 'semestre'],
    metadata: { priority: 'high', contact: 'registro@universidad.edu' }
  },
  {
    question: '¿Cuáles son los requisitos para matricularse?',
    answer: 'Para matricularse necesitas: 1) Documento de identidad, 2) Certificado de bachillerato, 3) Completar formulario de inscripción, 4) Pago de matrícula, 5) Examen de admisión (si aplica).',
    category: 'matricula',
    keywords: ['requisitos', 'matricula', 'documentos', 'inscripcion'],
    metadata: { priority: 'high' }
  },
  {
    question: '¿Cómo solicito una beca?',
    answer: 'Para solicitar una beca: 1) Ingresa al portal estudiantil, 2) Ve a "Servicios Financieros", 3) Completa el formulario de beca, 4) Adjunta documentos requeridos, 5) Envía la solicitud antes del 20 de febrero.',
    category: 'becas',
    keywords: ['beca', 'ayuda', 'financiera', 'solicitud'],
    metadata: { priority: 'high', deadline: '2025-02-20' }
  },
  {
    question: '¿Dónde está la biblioteca?',
    answer: 'La biblioteca central está ubicada en el edificio A, piso 2. Horario: Lunes a Viernes 7:00 AM - 10:00 PM, Sábados 8:00 AM - 6:00 PM. También tenemos bibliotecas en los edificios B y C.',
    category: 'ubicaciones',
    keywords: ['biblioteca', 'ubicacion', 'horario', 'edificio'],
    metadata: { building: 'A', floor: 2 }
  },
  {
    question: '¿Cómo puedo contactar a mi profesor?',
    answer: 'Puedes contactar a tu profesor por: 1) Email institucional (nombre.apellido@universidad.edu), 2) Horario de oficina (ver en portal), 3) Plataforma de clases virtuales, 4) WhatsApp del grupo de clase.',
    category: 'contacto',
    keywords: ['profesor', 'contacto', 'email', 'horario'],
    metadata: { method: 'email' }
  },
  {
    question: '¿Cuáles son los horarios de clases?',
    answer: 'Los horarios varían por carrera y semestre. Puedes consultar tu horario en el portal estudiantil o en la oficina de registro. Las clases suelen ser de 7:00 AM a 10:00 PM de lunes a viernes.',
    category: 'horarios',
    keywords: ['horario', 'clases', 'carrera', 'semestre'],
    metadata: { schedule: 'flexible' }
  },
  {
    question: '¿Cómo puedo acceder al WiFi?',
    answer: 'Para acceder al WiFi: 1) Conecta a la red "Universidad-Estudiantes", 2) Usa tu usuario y contraseña del portal, 3) Si tienes problemas, contacta al área de TI en el edificio C, piso 1.',
    category: 'tecnologia',
    keywords: ['wifi', 'internet', 'conexion', 'ti'],
    metadata: { network: 'Universidad-Estudiantes' }
  },
  {
    question: '¿Dónde puedo comer en la universidad?',
    answer: 'Tenemos varias opciones: 1) Cafetería principal (edificio A), 2) Cafetería de ingeniería (edificio B), 3) Kioscos en cada edificio, 4) Restaurantes cercanos en el campus. Horarios: 7:00 AM - 8:00 PM.',
    category: 'servicios',
    keywords: ['comida', 'cafeteria', 'restaurante', 'alimentacion'],
    metadata: { location: 'multiple' }
  },
  {
    question: '¿Cómo puedo solicitar un carné estudiantil?',
    answer: 'Para solicitar tu carné: 1) Ve a la oficina de registro, 2) Lleva una foto tamaño carné, 3) Paga la tarifa correspondiente, 4) Recoge tu carné en 3 días hábiles. El carné es obligatorio para acceder a instalaciones.',
    category: 'documentos',
    keywords: ['carne', 'identificacion', 'estudiante', 'foto'],
    metadata: { required: true, processing_time: '3 days' }
  },
  {
    question: '¿Qué servicios de salud ofrece la universidad?',
    answer: 'Contamos con: 1) Consultorio médico (edificio D), 2) Servicio de psicología, 3) Farmacia estudiantil, 4) Seguro médico estudiantil. Horario: Lunes a Viernes 8:00 AM - 5:00 PM.',
    category: 'salud',
    keywords: ['medico', 'salud', 'psicologia', 'farmacia'],
    metadata: { building: 'D', insurance: true }
  }
];

async function loadSampleData() {
  console.log('\n📚 CARGANDO DATOS DE EJEMPLO');
  console.log('='.repeat(50));
  
  try {
    // 1. Verificar conexión
    console.log('1️⃣ Verificando conexión a la base de datos...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('faqs')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    
    // 2. Verificar si ya existen FAQs
    const { count: existingCount } = await supabaseAdmin
      .from('faqs')
      .select('*', { count: 'exact', head: true });
    
    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} FAQs en la base de datos`);
      console.log('💡 Si quieres cargar de nuevo, elimina las existentes primero');
      return;
    }
    
    // 3. Generar embeddings para todas las preguntas
    console.log('\n2️⃣ Generando embeddings...');
    const questions = SAMPLE_FAQS.map(faq => faq.question);
    const embeddings = await generateEmbeddingsBatch(questions);
    
    console.log(`✅ Embeddings generados para ${embeddings.length} preguntas`);
    
    // 4. Preparar datos con embeddings
    console.log('\n3️⃣ Preparando datos para insertar...');
    const faqsWithEmbeddings = SAMPLE_FAQS.map((faq, index) => ({
      ...faq,
      embedding: embeddings[index],
      created_by: 'sample-data-loader',
    }));
    
    // 5. Insertar en la base de datos
    console.log('\n4️⃣ Insertando FAQs en la base de datos...');
    const { data: insertedFAQs, error: insertError } = await supabaseAdmin
      .from('faqs')
      .insert(faqsWithEmbeddings)
      .select();
    
    if (insertError) {
      console.error('❌ Error al insertar FAQs:', insertError.message);
      return;
    }
    
    console.log(`✅ ${insertedFAQs.length} FAQs insertadas exitosamente`);
    
    // 6. Resumen por categorías
    console.log('\n📊 RESUMEN POR CATEGORÍAS:');
    const categories = {};
    insertedFAQs.forEach(faq => {
      categories[faq.category] = (categories[faq.category] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} FAQs`);
    });
    
    console.log('\n🎉 ¡Datos cargados exitosamente!');
    console.log('💡 Ahora puedes probar tu chatbot con: npm run test:chat');
    
  } catch (error) {
    console.error('\n❌ Error cargando datos:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar
loadSampleData().catch(console.error);

