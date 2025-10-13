#!/usr/bin/env node

/**
 * Remove Fake CAIU Center FAQs
 * 
 * Elimina FAQs sobre "Centro de Atención Integral Universitaria"
 * que NO EXISTE. Los servicios estudiantiles están en Dirección Estudiantil.
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

console.log('🗑️ ELIMINANDO FAQs SOBRE CENTRO DE ATENCIÓN INEXISTENTE\n');
console.log('=' .repeat(70));
console.log('❌ PROBLEMA: FAQs sobre "Centro de Atención Integral" que NO EXISTE');
console.log('✅ REALIDAD: Servicios estudiantiles están en Dirección Estudiantil');
console.log('=' .repeat(70));

// Buscar FAQs sobre el centro inexistente
console.log('\n🔍 Buscando FAQs sobre Centro de Atención Integral...');

const { data: fakeCenterFAQs, error: searchError } = await supabase
  .from('faqs')
  .select('*')
  .or('answer.ilike.%Centro de Atención Integral%,question.ilike.%centro de atencion integral%,answer.ilike.%también llamado CAIU%');

if (searchError) {
  console.error('❌ Error buscando FAQs:', searchError.message);
  process.exit(1);
}

if (fakeCenterFAQs && fakeCenterFAQs.length > 0) {
  console.log(`⚠️ Encontradas ${fakeCenterFAQs.length} FAQs sobre centro INEXISTENTE:`);
  fakeCenterFAQs.forEach(faq => {
    console.log(`   - "${faq.question}"`);
    console.log(`     Respuesta: ${faq.answer.substring(0, 100)}...`);
  });
  
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', fakeCenterFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  console.log(`\n✅ ${fakeCenterFAQs.length} FAQs sobre centro inexistente ELIMINADAS`);
} else {
  console.log('ℹ️ No se encontraron FAQs sobre centro inexistente');
}

console.log('\n✨ Limpieza completada!');
console.log('📊 Ahora:');
console.log('   ✅ CAIU = Solo el propedéutico de 12 semanas');
console.log('   ✅ Servicios estudiantiles = Dirección Estudiantil');
console.log('   ❌ NO existe "Centro de Atención Integral Universitaria"\n');
