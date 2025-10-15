#!/usr/bin/env node

/**
 * Fix Ortografía en FAQs
 * 
 * Revisa y corrige errores ortográficos en preguntas y respuestas,
 * especialmente acentos y tildes
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('✍️  REVISIÓN ORTOGRÁFICA DE FAQs\n');
console.log('=' .repeat(70));

// Diccionario de correcciones comunes
const correcciones = {
  // Palabras interrogativas (SIEMPRE llevan tilde)
  'que ': 'qué ',
  'como ': 'cómo ',
  'cuando ': 'cuándo ',
  'donde ': 'dónde ',
  'cual ': 'cuál ',
  'cuales ': 'cuáles ',
  'quien ': 'quién ',
  'quienes ': 'quiénes ',
  'cuanto ': 'cuánto ',
  'cuanta ': 'cuánta ',
  'cuantos ': 'cuántos ',
  'cuantas ': 'cuántas ',
  
  // Palabras comunes con tilde
  'mas ': 'más ',
  'esta ': 'está ',
  'estas ': 'estás ',
  'estan ': 'están ',
  'sera ': 'será ',
  'seran ': 'serán ',
  'podria ': 'podría ',
  'podrian ': 'podrían ',
  'deberia ': 'debería ',
  'deberian ': 'deberían ',
  'tambien': 'también',
  'ademas': 'además',
  'despues': 'después',
  'dificil': 'difícil',
  'facil': 'fácil',
  'util': 'útil',
  'rapido': 'rápido',
  'rapida': 'rápida',
  'matematica': 'matemática',
  'matematicas': 'matemáticas',
  'fisica': 'física',
  'quimica': 'química',
  'biologia': 'biología',
  'tecnologia': 'tecnología',
  'informacion': 'información',
  'inscripcion': 'inscripción',
  'inscripciones': 'inscripciones',
  'admision': 'admisión',
  'educacion': 'educación',
  'academico': 'académico',
  'academica': 'académica',
  'practicas': 'prácticas',
  'practica': 'práctica',
  'credito': 'crédito',
  'creditos': 'créditos',
  'examen': 'examen',
  'examenes': 'exámenes',
  'pagina': 'página',
  'numero': 'número',
  'telefono': 'teléfono',
  'electronica': 'electrónica',
  'robotica': 'robótica',
  'ciberseguridad': 'ciberseguridad',
  'petroquimica': 'petroquímica',
  'nanotecnologia': 'nanotecnología',
  'biotecnologia': 'biotecnología',
  'oceanologia': 'oceanología',
  'filosofia': 'filosofía',
  'indice': 'índice',
  'calculo': 'cálculo',
  'algebra': 'álgebra',
  'logica': 'lógica',
  'optica': 'óptica',
  'atomica': 'atómica',
  'atomico': 'atómico',
  'electrica': 'eléctrica',
  'electrico': 'eléctrico',
  'mecanica': 'mecánica',
  'mecanico': 'mecánico',
  'organica': 'orgánica',
  'organico': 'orgánico',
  'inorganica': 'inorgánica',
  'basica': 'básica',
  'basico': 'básico',
  'especifica': 'específica',
  'especifico': 'específico',
  'unico': 'único',
  'unica': 'única',
  'publico': 'público',
  'publica': 'pública',
  'medico': 'médico',
  'medica': 'médica',
  'clinico': 'clínico',
  'clinica': 'clínica',
  'cientifico': 'científico',
  'cientifica': 'científica',
  'tecnico': 'técnico',
  'tecnica': 'técnica',
  'practico': 'práctico',
  'teorico': 'teórico',
  'teorica': 'teórica',
  'economico': 'económico',
  'economica': 'económica',
  'historico': 'histórico',
  'historica': 'histórica',
  'codigo': 'código',
  'periodo': 'período',
  'semestre': 'semestre',
  'area': 'área',
  'areas': 'áreas',
  'dia': 'día',
  'dias': 'días',
  'ahi': 'ahí',
  'asi': 'así',
  'solo': 'sólo',
  'si ': 'sí ',
  'tu ': 'tú ',
  'el ': 'él ',
  'mi ': 'mí ',
  'te ': 'té ',
  'se ': 'sé ',
  'de ': 'dé '
};

// Función para corregir texto
function corregirTexto(texto) {
  if (!texto) return texto;
  
  let textoCorregido = texto.toLowerCase();
  
  // Aplicar correcciones
  for (const [incorrecto, correcto] of Object.entries(correcciones)) {
    const regex = new RegExp(incorrecto, 'gi');
    textoCorregido = textoCorregido.replace(regex, correcto);
  }
  
  return textoCorregido;
}

// Función para verificar si necesita corrección
function necesitaCorreccion(texto) {
  const textoCorregido = corregirTexto(texto);
  return texto.toLowerCase() !== textoCorregido;
}

async function revisarYCorregirFAQs() {
  console.log('\n📖 Obteniendo todas las FAQs...\n');
  
  // Obtener todas las FAQs
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('❌ Error al obtener FAQs:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ ${faqs.length} FAQs encontradas\n`);
  console.log('🔍 Revisando ortografía...\n');
  
  const faqsParaCorregir = [];
  
  for (const faq of faqs) {
    const necesitaCorreccionPregunta = necesitaCorreccion(faq.question);
    const necesitaCorreccionRespuesta = necesitaCorreccion(faq.answer);
    
    if (necesitaCorreccionPregunta || necesitaCorreccionRespuesta) {
      faqsParaCorregir.push({
        id: faq.id,
        questionOriginal: faq.question,
        questionCorregida: corregirTexto(faq.question),
        answerOriginal: faq.answer,
        answerCorregida: corregirTexto(faq.answer),
        necesitaCorreccionPregunta,
        necesitaCorreccionRespuesta
      });
    }
  }
  
  console.log('=' .repeat(70));
  console.log(`\n📊 RESULTADOS:\n`);
  console.log(`   Total FAQs revisadas: ${faqs.length}`);
  console.log(`   FAQs con errores: ${faqsParaCorregir.length}`);
  console.log(`   FAQs correctas: ${faqs.length - faqsParaCorregir.length}\n`);
  
  if (faqsParaCorregir.length === 0) {
    console.log('✅ ¡Todas las FAQs tienen ortografía correcta!\n');
    return;
  }
  
  console.log('=' .repeat(70));
  console.log('\n⚠️  FAQs CON ERRORES ORTOGRÁFICOS:\n');
  
  // Mostrar primeras 10 FAQs con errores
  const muestras = faqsParaCorregir.slice(0, 10);
  
  for (let i = 0; i < muestras.length; i++) {
    const faq = muestras[i];
    console.log(`\n${i + 1}. FAQ ID: ${faq.id}`);
    
    if (faq.necesitaCorreccionPregunta) {
      console.log(`   ❌ Pregunta: "${faq.questionOriginal}"`);
      console.log(`   ✅ Corregida: "${faq.questionCorregida}"`);
    }
    
    if (faq.necesitaCorreccionRespuesta) {
      console.log(`   ❌ Respuesta: "${faq.answerOriginal.substring(0, 80)}..."`);
      console.log(`   ✅ Corregida: "${faq.answerCorregida.substring(0, 80)}..."`);
    }
  }
  
  if (faqsParaCorregir.length > 10) {
    console.log(`\n   ... y ${faqsParaCorregir.length - 10} FAQs más con errores\n`);
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('\n⚠️  IMPORTANTE: Este script solo DETECTA errores.');
  console.log('Para CORREGIR automáticamente, ejecuta:');
  console.log('   node scripts/maintenance/apply-ortografia-fixes.js\n');
  
  // Guardar reporte
  const reporte = {
    fecha: new Date().toISOString(),
    totalFAQs: faqs.length,
    faqsConErrores: faqsParaCorregir.length,
    faqsCorrectas: faqs.length - faqsParaCorregir.length,
    errores: faqsParaCorregir
  };
  
  console.log('💾 Guardando reporte en: ortografia-report.json\n');
  
  const fs = await import('fs');
  fs.writeFileSync(
    path.join(rootDir, 'ortografia-report.json'),
    JSON.stringify(reporte, null, 2)
  );
  
  console.log('✅ Reporte guardado exitosamente\n');
}

revisarYCorregirFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
