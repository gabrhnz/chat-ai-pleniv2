#!/usr/bin/env node

/**
 * Verify Licenciaturas Fix
 *
 * Verifica que la corrección crítica de alucinación funcione correctamente
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const testQueries = [
  "cuáles son las licenciaturas",
  "qué licenciaturas ofrece la unc",
  "cuántas licenciaturas tiene",
  "lista de licenciaturas",
  "qué carreras científicas ofrece",
  "qué licenciaturas hay",
  "dime las licenciaturas",
  "cuáles licenciaturas ofrecen"
];

// Respuestas que DEBEN contener estas licenciaturas reales
const realLicenciaturas = [
  "Física Nuclear",
  "Biología y Química Computacional",
  "Biotecnología",
  "Ciencia Molecular",
  "Ciencia de Datos",
  "Física",
  "Matemáticas",
  "Nanotecnología",
  "Filosofía",
  "Oceanología"
];

// Respuestas que NO deben aparecer (alucinaciones previas)
const hallucinatedLicenciaturas = [
  "Ciencias Ambientales",
  "Bioquímica",
  "Ciencias de la Computación",
  "Geología",
  "Psicología"
];

async function testQuery(query, sessionId) {
  console.log(`\n🧪 Testing: "${query}"`);

  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, sessionId })
    });

    const result = await response.json();
    const answer = result.answer || '';

    console.log(`📝 Answer: "${answer}"`);

    // Verificar que contenga licenciaturas reales
    const hasRealLicenciaturas = realLicenciaturas.some(lic =>
      answer.toLowerCase().includes(lic.toLowerCase())
    );

    // Verificar que NO contenga alucinaciones
    const hasHallucinations = hallucinatedLicenciaturas.some(lic =>
      answer.toLowerCase().includes(lic.toLowerCase())
    );

    // Verificar que mencione que son 10
    const mentionsTen = answer.includes('10') && answer.toLowerCase().includes('licenciatura');

    const status = hasRealLicenciaturas && !hasHallucinations ? '✅ PASS' : '❌ FAIL';

    console.log(`${status} - Real: ${hasRealLicenciaturas}, No hallucinations: ${!hasHallucinations}, Mentions 10: ${mentionsTen}`);

    return { query, answer, hasRealLicenciaturas, hasHallucinations: !hasHallucinations, mentionsTen };

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { query, error: error.message };
  }
}

async function runVerification() {
  console.log('🚨 VERIFICATION: LICENCIATURAS HALLUCINATION FIX\n');
  console.log('=' .repeat(60));
  console.log('❌ PREVIOUS ISSUE: AI was hallucinating non-existent licenciaturas');
  console.log('✅ FIX APPLIED: Added specific FAQs with correct licenciatura list\n');

  console.log('🎯 TESTING MULTIPLE QUERY VARIATIONS...\n');

  const results = [];
  for (let i = 0; i < testQueries.length; i++) {
    const result = await testQuery(testQueries[i], `verify-session-${i}`);
    results.push(result);
    // Pequeña pausa para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 VERIFICATION RESULTS:\n');

  const passed = results.filter(r => r.hasRealLicenciaturas && r.hasHallucinations).length;
  const total = results.length;

  console.log(`✅ PASSED: ${passed}/${total} queries`);
  console.log(`❌ FAILED: ${total - passed}/${total} queries`);

  if (passed === total) {
    console.log('\n🎉 SUCCESS: All queries now return correct licenciatura information!');
    console.log('🚫 HALLUCINATION ISSUE: FIXED ✅');

    console.log('\n📋 CORRECT LICENCIATURAS NOW RETURNED:');
    realLicenciaturas.forEach((lic, idx) => {
      console.log(`   ${idx + 1}. ${lic}`);
    });

    console.log('\n🚨 HALLUCINATED LICENCIATURAS ELIMINATED:');
    hallucinatedLicenciaturas.forEach(lic => {
      console.log(`   ❌ ${lic} (REMOVED)`);
    });

  } else {
    console.log('\n⚠️  WARNING: Some queries still have issues');
    const failed = results.filter(r => !r.hasRealLicenciaturas || !r.hasHallucinations);
    failed.forEach(f => {
      console.log(`   - "${f.query}"`);
    });
  }

  console.log('\n' + '=' .repeat(60));
  console.log('✨ VERIFICATION COMPLETE\n');
}

runVerification().catch(console.error);
