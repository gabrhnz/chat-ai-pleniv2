#!/usr/bin/env node

/**
 * Fix Ortografía en FAQs (Versión Inteligente)
 * 
 * Corrige solo errores ortográficos reales, especialmente:
 * - Palabras interrogativas sin tilde (qué, cómo, cuándo, dónde, cuál)
 * - Palabras comunes sin tilde
 * - Mantiene mayúsculas y formato original
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

console.log('✍️  CORRECCIÓN INTELIGENTE DE ORTOGRAFÍA\n');
console.log('=' .repeat(70));

// Correcciones específicas (preservando mayúsculas)
const patronesCorreccion = [
  // Palabras interrogativas (en contexto de pregunta)
  { pattern: /\bque\b/gi, replacement: (match) => match === 'que' ? 'qué' : 'Qué', context: 'question' },
  { pattern: /\bcomo\b/gi, replacement: (match) => match === 'como' ? 'cómo' : 'Cómo', context: 'question' },
  { pattern: /\bcuando\b/gi, replacement: (match) => match === 'cuando' ? 'cuándo' : 'Cuándo', context: 'question' },
  { pattern: /\bdonde\b/gi, replacement: (match) => match === 'donde' ? 'dónde' : 'Dónde', context: 'question' },
  { pattern: /\bcual\b/gi, replacement: (match) => match === 'cual' ? 'cuál' : 'Cuál', context: 'question' },
  { pattern: /\bcuales\b/gi, replacement: (match) => match === 'cuales' ? 'cuáles' : 'Cuáles', context: 'question' },
  { pattern: /\bquien\b/gi, replacement: (match) => match === 'quien' ? 'quién' : 'Quién', context: 'question' },
  { pattern: /\bquienes\b/gi, replacement: (match) => match === 'quienes' ? 'quiénes' : 'Quiénes', context: 'question' },
  { pattern: /\bcuanto\b/gi, replacement: (match) => match === 'cuanto' ? 'cuánto' : 'Cuánto', context: 'question' },
  { pattern: /\bcuanta\b/gi, replacement: (match) => match === 'cuanta' ? 'cuánta' : 'Cuánta', context: 'question' },
  { pattern: /\bcuantos\b/gi, replacement: (match) => match === 'cuantos' ? 'cuántos' : 'Cuántos', context: 'question' },
  { pattern: /\bcuantas\b/gi, replacement: (match) => match === 'cuantas' ? 'cuántas' : 'Cuántas', context: 'question' },
  
  // Palabras comunes (en cualquier contexto)
  { pattern: /\bmas\s/gi, replacement: (match) => match.toLowerCase() === 'mas ' ? 'más ' : 'Más ' },
  { pattern: /\btambien\b/gi, replacement: (match) => match === 'tambien' ? 'también' : 'También' },
  { pattern: /\bademas\b/gi, replacement: (match) => match === 'ademas' ? 'además' : 'Además' },
  { pattern: /\bdespues\b/gi, replacement: (match) => match === 'despues' ? 'después' : 'Después' },
  { pattern: /\bdificil\b/gi, replacement: (match) => match === 'dificil' ? 'difícil' : 'Difícil' },
  { pattern: /\bfacil\b/gi, replacement: (match) => match === 'facil' ? 'fácil' : 'Fácil' },
  
  // Áreas académicas
  { pattern: /\bmatematica\b/gi, replacement: (match) => match === 'matematica' ? 'matemática' : 'Matemática' },
  { pattern: /\bmatematicas\b/gi, replacement: (match) => match === 'matematicas' ? 'matemáticas' : 'Matemáticas' },
  { pattern: /\bfisica\b/gi, replacement: (match) => match === 'fisica' ? 'física' : 'Física' },
  { pattern: /\bquimica\b/gi, replacement: (match) => match === 'quimica' ? 'química' : 'Química' },
  { pattern: /\bbiologia\b/gi, replacement: (match) => match === 'biologia' ? 'biología' : 'Biología' },
  
  // Términos universitarios
  { pattern: /\binformacion\b/gi, replacement: (match) => match === 'informacion' ? 'información' : 'Información' },
  { pattern: /\binscripcion\b/gi, replacement: (match) => match === 'inscripcion' ? 'inscripción' : 'Inscripción' },
  { pattern: /\binscripciones\b/gi, replacement: (match) => match === 'inscripciones' ? 'inscripciones' : 'Inscripciones' },
  { pattern: /\badmision\b/gi, replacement: (match) => match === 'admision' ? 'admisión' : 'Admisión' },
  { pattern: /\bacademico\b/gi, replacement: (match) => match === 'academico' ? 'académico' : 'Académico' },
  { pattern: /\bacademica\b/gi, replacement: (match) => match === 'academica' ? 'académica' : 'Académica' },
  { pattern: /\bpagina\b/gi, replacement: (match) => match === 'pagina' ? 'página' : 'Página' },
];

function corregirTexto(texto, esPregunta = false) {
  if (!texto) return texto;
  
  let textoCorregido = texto;
  
  for (const { pattern, replacement, context } of patronesCorreccion) {
    // Si el patrón requiere contexto de pregunta, solo aplicar en preguntas
    if (context === 'question' && !esPregunta) continue;
    
    if (typeof replacement === 'function') {
      textoCorregido = textoCorregido.replace(pattern, replacement);
    } else {
      textoCorregido = textoCorregido.replace(pattern, replacement);
    }
  }
  
  return textoCorregido;
}

async function corregirFAQs() {
  console.log('\n📖 Obteniendo FAQs activas...\n');
  
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ ${faqs.length} FAQs encontradas\n`);
  console.log('🔍 Corrigiendo ortografía...\n');
  
  let corregidas = 0;
  const cambios = [];
  
  for (const faq of faqs) {
    const preguntaCorregida = corregirTexto(faq.question, true);
    const respuestaCorregida = corregirTexto(faq.answer, false);
    
    const cambio = 
      preguntaCorregida !== faq.question ||
      respuestaCorregida !== faq.answer;
    
    if (cambio) {
      cambios.push({
        id: faq.id,
        preguntaAntes: faq.question,
        preguntaDespues: preguntaCorregida,
        respuestaAntes: faq.answer.substring(0, 100),
        respuestaDespues: respuestaCorregida.substring(0, 100),
        cambioPregunta: preguntaCorregida !== faq.question,
        cambioRespuesta: respuestaCorregida !== faq.answer
      });
      
      // Actualizar en la base de datos
      const { error: updateError } = await supabase
        .from('faqs')
        .update({
          question: preguntaCorregida,
          answer: respuestaCorregida,
          metadata: {
            ...faq.metadata,
            ortografia_corregida: true,
            correccion_fecha: new Date().toISOString()
          }
        })
        .eq('id', faq.id);
      
      if (updateError) {
        console.error(`❌ Error al actualizar FAQ ${faq.id}:`, updateError.message);
      } else {
        corregidas++;
      }
    }
  }
  
  console.log('=' .repeat(70));
  console.log(`\n📊 RESULTADOS:\n`);
  console.log(`   Total FAQs revisadas: ${faqs.length}`);
  console.log(`   FAQs corregidas: ${corregidas}`);
  console.log(`   FAQs sin cambios: ${faqs.length - corregidas}\n`);
  
  if (cambios.length > 0) {
    console.log('=' .repeat(70));
    console.log('\n✅ EJEMPLOS DE CORRECCIONES (primeras 10):\n');
    
    const muestras = cambios.slice(0, 10);
    
    for (let i = 0; i < muestras.length; i++) {
      const cambio = muestras[i];
      console.log(`\n${i + 1}. FAQ ID: ${cambio.id}`);
      
      if (cambio.cambioPregunta) {
        console.log(`   ❌ "${cambio.preguntaAntes}"`);
        console.log(`   ✅ "${cambio.preguntaDespues}"`);
      }
      
      if (cambio.cambioRespuesta) {
        console.log(`   📝 Respuesta también corregida`);
      }
    }
    
    if (cambios.length > 10) {
      console.log(`\n   ... y ${cambios.length - 10} FAQs más corregidas\n`);
    }
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('\n✅ Corrección ortográfica completada\n');
}

corregirFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
