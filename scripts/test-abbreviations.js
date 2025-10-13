#!/usr/bin/env node

/**
 * Test Academic Abbreviations Expansion
 *
 * Verifica que las abreviaturas académicas se expandan correctamente
 */

const testCases = [
  { input: "ing en AI", expected: "ingeniería en inteligencia artificial" },
  { input: "ing IA", expected: "ingeniería en inteligencia artificial" },
  { input: "lic en fis", expected: "licenciatura en física" },
  { input: "lic fis", expected: "licenciatura en física" },
  { input: "ing ciber", expected: "ingeniería en ciberseguridad" },
  { input: "ing robot", expected: "ingeniería en robótica" },
  { input: "ing electro", expected: "ingeniería en electromedicina" },
  { input: "biotecnolog", expected: "biotecnología" },
  { input: "nano tec", expected: "nanotecnología" },
  { input: "oceanolog", expected: "oceanología" },
  { input: "mate", expected: "matemáticas" },
  { input: "filo", expected: "filosofía" },
];

import fetch from 'node-fetch';

async function testAbbreviationExpansion() {
  console.log('🧪 TESTING ACADEMIC ABBREVIATIONS EXPANSION\n');
  console.log('=' .repeat(60));

  let passed = 0;
  let total = testCases.length;

  for (const testCase of testCases) {
    console.log(`\n❓ Testing: "${testCase.input}"`);
    console.log(`🎯 Expected: "${testCase.expected}"`);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `háblame sobre ${testCase.input}`,
          sessionId: `abbr-test-${Date.now()}`
        })
      });

      const result = await response.json();
      const answer = result.answer.toLowerCase();

      // Verificar si la respuesta contiene información sobre la carrera correcta
      const containsExpected = answer.includes(testCase.expected.toLowerCase().replace('ingeniería en ', '').replace('licenciatura en ', ''));

      if (containsExpected) {
        console.log('✅ PASSED: Respuesta contiene información correcta');
        passed++;
      } else {
        console.log('❌ FAILED: No encontró información de la carrera');
        console.log(`   Answer: "${result.answer.substring(0, 100)}..."`);
      }

    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }

    // Pequeña pausa
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESULTS:');
  console.log(`✅ PASSED: ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
  console.log(`❌ FAILED: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 ¡PERFECTO! Todas las abreviaturas funcionan correctamente!');
    console.log('🤖 La IA ahora entiende: ing, lic, ciber, robot, electro, etc.');
  } else {
    console.log('\n⚠️ Algunas abreviaturas necesitan ajuste');
  }

  console.log('\n' + '=' .repeat(60));
}

testAbbreviationExpansion().catch(console.error);
