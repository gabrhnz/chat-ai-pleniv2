#!/usr/bin/env node
/**
 * Script para agregar FAQs fácilmente
 * Uso: node scripts/agregar-faqs.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pregunta(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function agregarFAQ() {
  console.log('\n📚 AGREGAR NUEVA FAQ\n');
  console.log('═'.repeat(50));
  
  // Recopilar información
  const question = await pregunta('\n❓ Pregunta: ');
  if (!question.trim()) {
    console.log('❌ La pregunta no puede estar vacía');
    rl.close();
    return;
  }
  
  const answer = await pregunta('\n💬 Respuesta: ');
  if (!answer.trim()) {
    console.log('❌ La respuesta no puede estar vacía');
    rl.close();
    return;
  }
  
  const category = await pregunta('\n🏷️  Categoría (ej: admisiones, carreras, becas): ');
  
  const keywordsInput = await pregunta('\n🔑 Keywords (separadas por comas): ');
  const keywords = keywordsInput
    ? keywordsInput.split(',').map(k => k.trim()).filter(k => k)
    : [];
  
  console.log('\n' + '═'.repeat(50));
  console.log('\n📋 RESUMEN:');
  console.log(`\n❓ Pregunta: ${question}`);
  console.log(`💬 Respuesta: ${answer.substring(0, 100)}${answer.length > 100 ? '...' : ''}`);
  console.log(`🏷️  Categoría: ${category || 'sin categoría'}`);
  console.log(`🔑 Keywords: ${keywords.join(', ') || 'ninguna'}`);
  
  const confirmar = await pregunta('\n✅ ¿Confirmar? (s/n): ');
  
  if (confirmar.toLowerCase() !== 's') {
    console.log('\n❌ Cancelado');
    rl.close();
    return;
  }
  
  // Insertar en Supabase
  console.log('\n⏳ Insertando FAQ...');
  
  const { data, error } = await supabase
    .from('faqs')
    .insert({
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || null,
      keywords: keywords.length > 0 ? keywords : null,
      metadata: {
        source: 'manual',
        created_by: 'admin',
        last_updated: new Date().toISOString()
      }
    })
    .select()
    .single();
  
  if (error) {
    console.error('\n❌ Error al insertar FAQ:', error.message);
    rl.close();
    return;
  }
  
  console.log('\n✅ FAQ agregada exitosamente!');
  console.log(`📝 ID: ${data.id}`);
  
  // Preguntar si quiere generar embeddings
  const genEmbeddings = await pregunta('\n🔄 ¿Generar embeddings ahora? (s/n): ');
  
  if (genEmbeddings.toLowerCase() === 's') {
    console.log('\n⚠️  Para generar embeddings, ejecuta:');
    console.log('   npm run init:embeddings\n');
  }
  
  // Preguntar si quiere agregar otra
  const otra = await pregunta('➕ ¿Agregar otra FAQ? (s/n): ');
  
  if (otra.toLowerCase() === 's') {
    await agregarFAQ();
  } else {
    console.log('\n✅ ¡Listo! No olvides generar los embeddings.\n');
    rl.close();
  }
}

// Iniciar
console.log('\n🤖 ASISTENTE PARA AGREGAR FAQs');
console.log('═'.repeat(50));

agregarFAQ().catch(error => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});

