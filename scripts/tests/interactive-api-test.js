#!/usr/bin/env node

/**
 * Interactive API Testing for Hallucination Fixes
 *
 * Pruebas interactivas directas con la API para verificar correcciones
 */

import fetch from 'node-fetch';
import readline from 'readline';

const BASE_URL = 'http://localhost:3000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function testQuery(message, sessionId) {
  console.log('\n' + '='.repeat(80));
  console.log(`🧪 TESTING: "${message}"`);
  console.log('⏳ Sending request...');

  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });

    const result = await response.json();
    const duration = Date.now() - startTime;

    console.log('\n📊 RESPONSE ANALYSIS:');
    console.log('='.repeat(50));

    // Metadata detallada
    console.log(`⚡ Response time: ${duration}ms`);
    console.log(`📝 Query type: ${result.metadata?.queryType || 'unknown'}`);
    console.log(`🔍 Search params: ${result.metadata?.searchParams?.description || 'default'}`);
    console.log(`💾 From cache: ${result.metadata?.fromCache ? 'YES' : 'NO'}`);
    if (result.metadata?.fromCache) {
      console.log(`   Cache similarity: ${(result.metadata.cacheSimilarity * 100).toFixed(1)}%`);
    }
    console.log(`📊 FAQs used: ${result.metadata?.faqsCount || 0}`);
    console.log(`🎯 Top similarity: ${(result.metadata?.topSimilarity * 100).toFixed(1)}%`);
    console.log(`🤖 Model: ${result.metadata?.model || 'unknown'}`);
    console.log(`🔢 Tokens: ${result.metadata?.tokensUsed || 0}`);

    console.log('\n💬 ANSWER:');
    console.log('-'.repeat(50));
    console.log(result.answer);
    console.log('-'.repeat(50));

    // Análisis de seguridad
    const answer = result.answer.toLowerCase();
    const hasHallucinations = checkForHallucinations(answer);
    const isSafe = !hasHallucinations && result.answer.length > 10;

    console.log('\n🔍 HALLUCINATION CHECK:');
    if (isSafe) {
      console.log('✅ SAFE: No hallucinations detected');
    } else {
      console.log('🚨 ISSUES:');
      hasHallucinations.forEach(issue => console.log(`   - ${issue}`));
    }

    console.log('\n' + '='.repeat(80));

    return { success: true, result, duration, isSafe, hallucinations: hasHallucinations };

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('='.repeat(80));
    return { success: false, error };
  }
}

function checkForHallucinations(answer) {
  const issues = [];

  // Becas alucinadas
  if (answer.includes('beca completa') || answer.includes('100%') || answer.includes('financiado totalmente')) {
    issues.push('ALUCINACIÓN: Menciona becas completas que no existen');
  }

  // Instalaciones inexistentes
  if (answer.includes('gimnasio') || answer.includes('estadio') || answer.includes('comedor')) {
    issues.push('ALUCINACIÓN: Menciona instalaciones que no existen');
  }

  // Horarios imposibles
  if (answer.includes('24 horas') || answer.includes('siempre abierto') || answer.includes('fines de semana')) {
    issues.push('ALUCINACIÓN: Menciona horarios irreales');
  }

  // Costos irreales
  if (answer.includes('gratuito') || answer.includes('gratis') || answer.includes('sin costo')) {
    issues.push('ALUCINACIÓN: Dice que es gratuito cuando no lo es');
  }

  // Licenciaturas inexistentes (del problema original)
  if (answer.includes('ciencias ambientales') || answer.includes('bioquímica') ||
      answer.includes('ciencias de la computación') || answer.includes('geología') ||
      answer.includes('psicología')) {
    issues.push('ALUCINACIÓN: Menciona licenciaturas inexistentes');
  }

  return issues;
}

async function runInteractiveTest() {
  console.log('🎯 INTERACTIVE API TESTING - HALLUCINATION DETECTION\n');
  console.log('=' .repeat(80));
  console.log('💡 INSTRUCCIONES:');
  console.log('   • Escribe preguntas para probar el sistema');
  console.log('   • El sistema verificará automáticamente alucinaciones');
  console.log('   • Escribe "exit" para salir');
  console.log('   • Escribe "test-critical" para ejecutar pruebas críticas predefinidas\n');

  const sessionId = `interactive-test-${Date.now()}`;

  while (true) {
    const input = await askQuestion('\n❓ Tu pregunta (o "exit" para salir, "test-critical" para pruebas críticas): ');

    if (input.toLowerCase() === 'exit') {
      console.log('\n👋 ¡Hasta luego! Gracias por probar el sistema.');
      rl.close();
      break;
    }

    if (input.toLowerCase() === 'test-critical') {
      console.log('\n🚨 EJECUTANDO PRUEBAS CRÍTICAS PREDEFINIDAS...\n');

      const criticalTests = [
        { q: 'qué becas ofrece la UNC', desc: 'BECAS - Verificar no menciona becas completas' },
        { q: 'tiene gimnasio la universidad', desc: 'INSTALACIONES - Verificar niega gimnasio' },
        { q: 'atienden los fines de semana', desc: 'HORARIOS - Verificar niega fines de semana' },
        { q: 'es gratis estudiar aquí', desc: 'COSTOS - Verificar niega gratuito' },
        { q: 'cuáles son las licenciaturas', desc: 'LICENCIATURAS - Verificar lista correcta' },
        { q: 'cuánto cuesta la matrícula', desc: 'COSTOS - Verificar costos realistas' },
        { q: 'qué instalaciones tiene', desc: 'INSTALACIONES - Verificar lista real' }
      ];

      let passed = 0;
      let total = 0;

      for (const test of criticalTests) {
        console.log(`\n🎯 ${test.desc}`);
        const result = await testQuery(test.q, sessionId);
        if (result.isSafe) passed++;
        total++;

        // Pequeña pausa
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('\n📊 RESULTADOS DE PRUEBAS CRÍTICAS:');
      console.log(`✅ PASSED: ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
      console.log(`❌ FAILED: ${total - passed}/${total} (${(((total-passed)/total)*100).toFixed(1)}%)`);

      if (passed === total) {
        console.log('\n🎉 ¡EXCELENTE! Todas las pruebas críticas pasaron.');
        console.log('🚫 SISTEMA LIBRE DE ALUCINACIONES CRÍTICAS ✅');
      } else {
        console.log('\n⚠️ Algunas pruebas fallaron. Revisar las correcciones.');
      }

      continue;
    }

    if (input.trim()) {
      await testQuery(input, sessionId);
    }
  }
}

// Verificar que el servidor esté corriendo
async function checkServer() {
  try {
    console.log('🔍 Verificando que el servidor esté corriendo...');
    const response = await fetch(`${BASE_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ Servidor OK');
    return true;
  } catch (error) {
    console.log('❌ Servidor no responde. Asegúrate de que esté corriendo: npm run dev');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  const serverUp = await checkServer();
  if (!serverUp) {
    process.exit(1);
  }

  await runInteractiveTest();
}

main().catch(console.error);
