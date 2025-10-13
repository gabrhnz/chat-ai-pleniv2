#!/usr/bin/env node

/**
 * Clean Old Residencias FAQs
 * 
 * Elimina FAQs viejas y contradictorias sobre residencias
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

console.log('🗑️ ELIMINANDO FAQs VIEJAS SOBRE RESIDENCIAS\n');
console.log('=' .repeat(70));

// Buscar FAQs viejas con información incorrecta
const { data: oldFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%No tenemos residencias en campus%,answer.ilike.%¿Te gustaría saber más?%,answer.ilike.%¿Necesitas ayuda con eso?%,answer.ilike.%¿Eres menor?%,answer.ilike.%¿Más reglas?%,answer.ilike.%¿Necesitas el formulario?%')
  .ilike('question', '%residencia%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (oldFAQs && oldFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${oldFAQs.length} FAQs viejas/incorrectas:\n`);
  oldFAQs.forEach((faq, idx) => {
    console.log(`${idx + 1}. "${faq.question}"`);
    console.log(`   Respuesta: ${faq.answer.substring(0, 80)}...`);
    console.log(`   ID: ${faq.id}\n`);
  });
  
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', oldFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  
  console.log(`✅ ${oldFAQs.length} FAQs viejas eliminadas\n`);
} else {
  console.log('ℹ️ No se encontraron FAQs viejas para eliminar\n');
}

console.log('✨ Limpieza completada!');
console.log('📊 Ahora solo quedan las FAQs correctas sobre residencias\n');
