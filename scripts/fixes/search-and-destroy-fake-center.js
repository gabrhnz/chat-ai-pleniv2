#!/usr/bin/env node

/**
 * Search and Destroy Fake CAIU Center
 * 
 * Busca y elimina TODAS las FAQs que mencionen el inexistente
 * "Centro de Atención Integral Universitaria"
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

console.log('🔍 BUSCANDO TODAS LAS FAQs SOBRE CENTRO INEXISTENTE\n');
console.log('=' .repeat(70));

// Buscar con múltiples patrones
const searchPatterns = [
  'Centro de Atención Integral',
  'CAIU ofrece servicios',
  'apoyo académico, psicológico',
  'tutorías, orientación vocacional',
  'asesoría psicológica',
  'actividades recreativas',
  'bienestar estudiantil'
];

console.log('🔎 Buscando con múltiples patrones...\n');

let allFakeFAQs = [];

for (const pattern of searchPatterns) {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .ilike('answer', `%${pattern}%`);
  
  if (error) {
    console.error(`❌ Error buscando "${pattern}":`, error.message);
    continue;
  }
  
  if (data && data.length > 0) {
    console.log(`📋 Patrón "${pattern}": ${data.length} FAQs encontradas`);
    allFakeFAQs.push(...data);
  }
}

// Eliminar duplicados por ID
const uniqueFAQs = Array.from(new Map(allFakeFAQs.map(faq => [faq.id, faq])).values());

console.log(`\n⚠️ Total de FAQs únicas encontradas: ${uniqueFAQs.length}\n`);

if (uniqueFAQs.length > 0) {
  console.log('📄 FAQs que serán eliminadas:\n');
  uniqueFAQs.forEach((faq, idx) => {
    console.log(`${idx + 1}. Pregunta: "${faq.question}"`);
    console.log(`   Respuesta: ${faq.answer.substring(0, 150)}...`);
    console.log(`   ID: ${faq.id}\n`);
  });
  
  // Eliminar todas
  const { error: deleteError } = await supabase
    .from('faqs')
    .delete()
    .in('id', uniqueFAQs.map(f => f.id));
  
  if (deleteError) {
    console.error('❌ Error eliminando FAQs:', deleteError.message);
    process.exit(1);
  }
  
  console.log(`✅ ${uniqueFAQs.length} FAQs sobre centro inexistente ELIMINADAS\n`);
} else {
  console.log('✅ No se encontraron FAQs sobre el centro inexistente\n');
}

console.log('=' .repeat(70));
console.log('📊 IMPORTANTE:');
console.log('   ❌ NO existe "Centro de Atención Integral Universitaria"');
console.log('   ✅ CAIU = Solo el propedéutico de 12 semanas');
console.log('   ✅ Servicios estudiantiles = Dirección Estudiantil\n');
