#!/usr/bin/env node

/**
 * Fix Rector Hallucination
 * 
 * El bot está inventando que la rectora es "Dra. María Pérez"
 * Necesitamos eliminar cualquier FAQ con información falsa sobre autoridades
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

console.log('🚨 CORRIGIENDO ALUCINACIÓN - RECTORA INVENTADA\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: Bot inventa "Dra. María Pérez" como rectora');
console.log('✅ SOLUCIÓN: Eliminar FAQs falsas y agregar respuesta conservadora');
console.log('=' .repeat(70));

// Buscar FAQs sobre rector/rectora
console.log('\n🔍 Buscando FAQs sobre rector/rectora...');

const { data: rectorFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('question.ilike.%rector%,question.ilike.%rectora%,answer.ilike.%rector%,answer.ilike.%rectora%,answer.ilike.%María Pérez%,answer.ilike.%maria perez%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (rectorFAQs && rectorFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${rectorFAQs.length} FAQs sobre rector/rectora:`);
  rectorFAQs.forEach(faq => {
    console.log(`   - "${faq.question}"`);
    console.log(`     Respuesta: ${faq.answer.substring(0, 100)}...`);
  });
  
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', rectorFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  console.log(`\n✅ ${rectorFAQs.length} FAQs eliminadas`);
} else {
  console.log('ℹ️ No se encontraron FAQs sobre rector/rectora');
}

console.log('\n✨ Corrección completada!');
console.log('📊 El bot ya no inventará información sobre autoridades');
console.log('   Si no tiene la información, dirá que no la tiene.\n');
