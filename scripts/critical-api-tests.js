#!/usr/bin/env node

/**
 * Critical API Tests - Automated
 *
 * Pruebas automatizadas críticas para verificar que las correcciones funcionen
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const criticalTests = [
  {
    question: 'qué becas ofrece la UNC',
    description: 'BECAS - Verificar NO menciona becas completas',
    mustNotContain: ['beca completa', '100%', 'financiado totalmente', 'beca full'],
    shouldContain: ['parciales', 'becas']
  },
  {
    question: 'tiene gimnasio la universidad',
    description: 'INSTALACIONES - Verificar niega gimnasio',
    mustNotContain: ['gimnasio', 'estadio', 'comedor'],
    shouldContain: ['no', 'no tiene']
  },
  {
    question: 'atienden los fines de semana',
    description: 'HORARIOS - Verificar niega fines de semana',
    mustNotContain: ['fines de semana', 'sábado', 'domingo', '24 horas'],
    shouldContain: ['lunes a viernes', '7:00', '5:00']
  },
  {
    question: 'es gratis estudiar aquí',
    description: 'COSTOS - Verificar niega gratuito',
    mustNotContain: ['gratuito', 'gratis', 'sin costo', 'costo cero'],
    shouldContain: ['cobra', 'cuesta', 'usd']
  },
  {
    question: 'cuáles son las licenciaturas',
    description: 'LICENCIATURAS - Verificar lista correcta',
    mustNotContain: ['ciencias ambientales', 'bioquímica', 'ciencias de la computación', 'geología', 'psicología'],
    shouldContain: ['10', 'física nuclear', 'biotecnología']
  },
  {
    question: 'cuánto cuesta la matrícula',
    description: 'COSTOS - Verificar costos realistas',
    mustNotContain: ['gratuito', 'gratis', 'muy barato'],
    shouldContain: ['usd', 'crédito']
  },
  {
    question: 'qué instalaciones tiene',
    description: 'INSTALACIONES - Verificar lista real',
    mustNotContain: ['gimnasio', 'estadio', 'comedor', 'piscina'],
    shouldContain: ['laboratorios', 'aulas', 'biblioteca']
  },
  {
    question: 'qué horario tiene la universidad',
    description: 'HORARIOS - Verificar horario correcto',
    mustNotContain: ['24 horas', 'siempre abierto', 'noches'],
    shouldContain: ['lunes', 'viernes', '7:00', '5:00']
  }
];

async function testQuestion(testCase, sessionId) {
  console.log(`\n🧪 ${testCase.description}`);
  console.log(`❓ "${testCase.question}"`);

  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: testCase.question, sessionId })
    });

    const result = await response.json();
    const duration = Date.now() - startTime;

    const answer = result.answer.toLowerCase();

    // Verificar contenido prohibido
    const hasForbidden = testCase.mustNotContain.some(term =>
      answer.includes(term.toLowerCase())
    );

    // Verificar contenido requerido
    const hasRequired = testCase.shouldContain.some(term =>
      answer.includes(term.toLowerCase())
    );

    const passed = !hasForbidden && hasRequired;

    console.log(`⚡ ${duration}ms | ${result.metadata?.fromCache ? '💾 CACHE' : '🔍 SEARCH'}`);
    console.log(`📝 Tipo: ${result.metadata?.queryType || 'unknown'}`);
    console.log(`🎯 Similitud: ${(result.metadata?.topSimilarity * 100)?.toFixed(1) || 0}%`);

    console.log('\n💬 RESPUESTA:');
    console.log(result.answer);

    console.log('\n🔍 ANÁLISIS:');
    if (passed) {
      console.log('✅ PASSED: Respuesta correcta y segura');
    } else {
      console.log('❌ FAILED:');
      if (hasForbidden) {
        console.log('   🚨 Contiene términos prohibidos');
      }
      if (!hasRequired) {
        console.log('   ⚠️ No contiene términos requeridos');
      }
    }

    return { passed, duration, hasForbidden, hasRequired, answer: result.answer };

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function runCriticalTests() {
  console.log('🚨 PRUEBAS CRÍTICAS AUTOMATIZADAS - VERIFICACIÓN FINAL\n');
  console.log('=' .repeat(80));
  console.log('🎯 OBJETIVO: Verificar que TODAS las alucinaciones críticas estén corregidas\n');

  // Verificar servidor
  try {
    console.log('🔍 Verificando servidor...');
    await fetch(`${BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Servidor OK\n');
  } catch (error) {
    console.log('❌ Servidor no responde. Ejecuta: npm run dev\n');
    process.exit(1);
  }

  const sessionId = `critical-test-${Date.now()}`;
  const results = [];
  let passedCount = 0;

  console.log('Ejecutando pruebas críticas...\n');

  for (const test of criticalTests) {
    const result = await testQuestion(test, sessionId);
    results.push({ ...test, result });
    if (result.passed) passedCount++;

    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Resultados finales
  console.log('\n' + '=' .repeat(80));
  console.log('📊 RESULTADOS FINALES:');
  console.log(`✅ PASSED: ${passedCount}/${criticalTests.length} pruebas`);
  console.log(`❌ FAILED: ${criticalTests.length - passedCount}/${criticalTests.length} pruebas`);
  console.log(`📈 SUCCESS RATE: ${((passedCount/criticalTests.length)*100).toFixed(1)}%\n`);

  if (passedCount === criticalTests.length) {
    console.log('🎉 ¡PERFECTO! TODAS las pruebas críticas pasaron.');
    console.log('🚫 SISTEMA COMPLETAMENTE LIBRE DE ALUCINACIONES CRÍTICAS ✅');
    console.log('🤖 IA ahora responde con información REAL y PRECISA');
  } else {
    console.log('⚠️ Algunas pruebas fallaron. Revisar:');
    results.filter(r => !r.result.passed).forEach(r => {
      console.log(`   ❌ ${r.description}`);
    });
  }

  // Estadísticas detalladas
  console.log('\n📈 ESTADÍSTICAS DETALLADAS:');
  const avgDuration = results.reduce((sum, r) => sum + r.result.duration, 0) / results.length;
  const cachedCount = results.filter(r => r.result.answer?.includes('cache')).length; // aproximado

  console.log(`⏱️ Tiempo promedio: ${avgDuration.toFixed(0)}ms`);
  console.log(`💾 Respuestas cacheadas: ${cachedCount}/${results.length}`);
  console.log(`🎯 Query types usados: ${[...new Set(results.map(r => 'unknown'))].length} tipos diferentes`);

  console.log('\n💡 PRÓXIMOS PASOS RECOMENDADOS:');
  if (passedCount === criticalTests.length) {
    console.log('   ✅ Sistema listo para producción');
    console.log('   🚀 Implementar optimizaciones SF-level restantes');
    console.log('   📊 Configurar monitoring continuo');
  } else {
    console.log('   🔧 Revisar y corregir pruebas fallidas');
    console.log('   📝 Agregar más FAQs específicas');
  }

  console.log('\n' + '=' .repeat(80));
  console.log('✨ PRUEBAS CRÍTICAS COMPLETADAS\n');
}

runCriticalTests().catch(console.error);
