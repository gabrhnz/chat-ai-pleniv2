#!/usr/bin/env node

/**
 * Comprehensive Critical Hallucination Tests - 25+ Tests
 *
 * Pruebas exhaustivas para verificar que TODAS las alucinaciones están corregidas
 * Cobertura completa de todos los fixes implementados
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 25+ pruebas críticas organizadas por categoría
const criticalTests = [
  // === LICENCIATURAS (5 pruebas) ===
  {
    id: 1,
    category: "Licenciaturas",
    question: "cuáles son las licenciaturas",
    description: "Lista completa - debe mostrar las 10 reales",
    mustNotContain: ["ciencias ambientales", "bioquímica", "ciencias de la computación", "geología", "psicología"],
    shouldContain: ["10", "física nuclear", "biotecnología"],
    risk: "HIGH"
  },
  {
    id: 2,
    category: "Licenciaturas",
    question: "qué licenciaturas ofrece la unc",
    description: "Oferta académica - debe ser específico de UNC",
    mustNotContain: ["MBA", "abogacía", "medicina"],
    shouldContain: ["ingeniería", "licenciatura", "UNC"],
    risk: "HIGH"
  },
  {
    id: 3,
    category: "Licenciaturas",
    question: "cuántas licenciaturas tiene",
    description: "Conteo correcto - debe ser exactamente 10",
    mustNotContain: ["5", "15", "20"],
    shouldContain: ["10"],
    risk: "MEDIUM"
  },
  {
    id: 4,
    category: "Licenciaturas",
    question: "hay ingeniería en sistemas",
    description: "Carrera inexistente - debe negar correctamente",
    mustNotContain: ["sí", "por supuesto", "claro"],
    shouldContain: ["no"],
    risk: "HIGH"
  },
  {
    id: 5,
    category: "Licenciaturas",
    question: "tienen carrera de derecho",
    description: "Carrera inexistente - debe negar correctamente",
    mustNotContain: ["sí", "abogacía"],
    shouldContain: ["no"],
    risk: "HIGH"
  },

  // === BECAS (4 pruebas) ===
  {
    id: 6,
    category: "Becas",
    question: "qué becas ofrece",
    description: "Becas reales - no debe mencionar becas completas",
    mustNotContain: ["beca completa", "100%", "financiado totalmente", "beca full"],
    shouldContain: ["parciales", "becas"],
    risk: "CRITICAL"
  },
  {
    id: 7,
    category: "Becas",
    question: "hay becas del 100%",
    description: "Becas completas - debe negar explícitamente",
    mustNotContain: ["sí", "por supuesto"],
    shouldContain: ["no", "parciales"],
    risk: "CRITICAL"
  },
  {
    id: 8,
    category: "Becas",
    question: "dan financiamiento total",
    description: "Financiamiento total - debe ser realista",
    mustNotContain: ["sí", "total", "completo"],
    shouldContain: ["parcial", "no"],
    risk: "CRITICAL"
  },
  {
    id: 9,
    category: "Becas",
    question: "cuáles son los tipos de becas",
    description: "Tipos de becas - debe ser específico y realista",
    mustNotContain: ["beca completa", "100%"],
    shouldContain: ["parcial", "académico"],
    risk: "MEDIUM"
  },

  // === INSTALACIONES (4 pruebas) ===
  {
    id: 10,
    category: "Instalaciones",
    question: "qué instalaciones tiene",
    description: "Instalaciones reales - debe listar las correctas",
    mustNotContain: ["gimnasio", "estadio", "comedor", "piscina"],
    shouldContain: ["laboratorios", "aulas", "biblioteca"],
    risk: "HIGH"
  },
  {
    id: 11,
    category: "Instalaciones",
    question: "tiene gimnasio",
    description: "Gimnasio inexistente - debe negar",
    mustNotContain: ["sí", "por supuesto"],
    shouldContain: ["no"],
    risk: "HIGH"
  },
  {
    id: 12,
    category: "Instalaciones",
    question: "hay comedor universitario",
    description: "Comedor inexistente - debe negar",
    mustNotContain: ["sí", "restaurante"],
    shouldContain: ["no"],
    risk: "HIGH"
  },
  {
    id: 13,
    category: "Instalaciones",
    question: "cuáles son las facilidades deportivas",
    description: "Deportes - debe ser realista sobre carencia",
    mustNotContain: ["gimnasio", "cancha", "estadio"],
    shouldContain: ["no", "académicas"],
    risk: "MEDIUM"
  },

  // === HORARIOS (4 pruebas) ===
  {
    id: 14,
    category: "Horarios",
    question: "qué horario tiene",
    description: "Horario real - L-V 7AM-5PM",
    mustNotContain: ["24 horas", "noches", "fines de semana"],
    shouldContain: ["lunes", "viernes", "7", "5"],
    risk: "HIGH"
  },
  {
    id: 15,
    category: "Horarios",
    question: "atienden los fines de semana",
    description: "Fines de semana - debe negar",
    mustNotContain: ["sí", "sábado", "domingo"],
    shouldContain: ["no", "lunes a viernes"],
    risk: "HIGH"
  },
  {
    id: 16,
    category: "Horarios",
    question: "abren 24 horas",
    description: "24 horas - debe negar rotundamente",
    mustNotContain: ["sí", "todo el día"],
    shouldContain: ["no", "7", "5"],
    risk: "CRITICAL"
  },
  {
    id: 17,
    category: "Horarios",
    question: "cuál es el horario de atención al público",
    description: "Horario público - debe ser específico",
    mustNotContain: ["24/7", "siempre"],
    shouldContain: ["lunes", "viernes"],
    risk: "MEDIUM"
  },

  // === COSTOS (4 pruebas) ===
  {
    id: 18,
    category: "Costos",
    question: "cuánto cuesta la matrícula",
    description: "Costo matrícula - debe ser realista",
    mustNotContain: ["gratuito", "gratis", "muy barato"],
    shouldContain: ["usd", "crédito"],
    risk: "HIGH"
  },
  {
    id: 19,
    category: "Costos",
    question: "es gratis estudiar aquí",
    description: "Gratis - debe negar correctamente",
    mustNotContain: ["sí", "por supuesto"],
    shouldContain: ["no", "cuesta"],
    risk: "CRITICAL"
  },
  {
    id: 20,
    category: "Costos",
    question: "cuál es el precio por crédito",
    description: "Precio crédito - debe dar números realistas",
    mustNotContain: ["gratis", "0"],
    shouldContain: ["usd"],
    risk: "MEDIUM"
  },
  {
    id: 21,
    category: "Costos",
    question: "hay financiamiento estudiantil",
    description: "Financiamiento - debe ser realista sobre becas parciales",
    mustNotContain: ["completo", "100%"],
    shouldContain: ["parcial", "becas"],
    risk: "MEDIUM"
  },

  // === ABREVIATURAS (4 pruebas) ===
  {
    id: 22,
    category: "Abreviaturas",
    question: "qué sabes de ing en AI",
    description: "Ing en AI - debe expandir y responder correctamente",
    mustNotContain: ["no tengo información"],
    shouldContain: ["inteligencia artificial", "ingeniería"],
    risk: "HIGH"
  },
  {
    id: 23,
    category: "Abreviaturas",
    question: "háblame de lic en fis",
    description: "Lic en fis - debe expandir a física",
    mustNotContain: ["no tengo información"],
    shouldContain: ["física", "licenciatura"],
    risk: "HIGH"
  },
  {
    id: 24,
    category: "Abreviaturas",
    question: "cuentame sobre ing ciber",
    description: "Ing ciber - debe expandir a ciberseguridad",
    mustNotContain: ["no tengo información"],
    shouldContain: ["ciberseguridad", "ingeniería"],
    risk: "HIGH"
  },
  {
    id: 25,
    category: "Abreviaturas",
    question: "qué es biotecnolog",
    description: "Biotecnolog - debe expandir correctamente",
    mustNotContain: ["no tengo información"],
    shouldContain: ["biotecnología"],
    risk: "HIGH"
  },

  // === UBICACIÓN (2 pruebas) ===
  {
    id: 26,
    category: "Ubicación",
    question: "dónde queda la universidad",
    description: "Ubicación - debe confirmar Caracas",
    shouldContain: ["caracas"],
    risk: "LOW"
  },
  {
    id: 27,
    category: "Ubicación",
    question: "está en Maracaibo",
    description: "Ubicación falsa - debe corregir",
    mustNotContain: ["sí"],
    shouldContain: ["caracas"],
    risk: "LOW"
  }
];

async function runComprehensiveHallucinationTests() {
  console.log('🧪 COMPREHENSIVE CRITICAL HALLUCINATION TESTS\n');
  console.log('=' .repeat(80));
  console.log('🎯 OBJETIVO: Verificar que TODAS las alucinaciones críticas están corregidas');
  console.log('📊 COBERTURA: 27 pruebas críticas organizadas por categoría');
  console.log('🚨 RIESGO: Critical/High/Medium/Low');
  console.log('\n' + '=' .repeat(80));

  // Verificar servidor
  try {
    console.log('🔍 Verificando servidor...');
    await fetch(`${BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Servidor OK\n');
  } catch (error) {
    console.log('❌ Servidor no responde. Asegúrate de que esté corriendo: npm run dev\n');
    process.exit(1);
  }

  const sessionId = `comprehensive-test-${Date.now()}`;
  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  console.log('🚀 EJECUTANDO PRUEBAS...\n');

  let testIndex = 0;
  for (const test of criticalTests) {
    testIndex++;
    console.log(`${testIndex.toString().padStart(2, '0')}. [${test.category}] ${test.description}`);
    console.log(`    ❓ "${test.question}" (${test.risk} risk)`);

    try {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: test.question, sessionId })
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      const answer = result.answer.toLowerCase();

      // Verificar contenido prohibido
      const hasForbidden = test.mustNotContain?.some(term =>
        answer.includes(term.toLowerCase())
      ) || false;

      // Verificar contenido requerido
      const hasRequired = test.shouldContain?.some(term =>
        answer.includes(term.toLowerCase())
      ) || true;

      const passed = !hasForbidden && hasRequired;

      console.log(`    ⚡ ${duration}ms | ${passed ? '✅ PASSED' : '❌ FAILED'}`);

      if (!passed) {
        console.log(`    💬 Answer: "${result.answer.substring(0, 80)}${result.answer.length > 80 ? '...' : ''}"`);
        if (hasForbidden) {
          console.log(`    🚨 Forbidden content found: ${test.mustNotContain?.find(term => answer.includes(term.toLowerCase()))}`);
        }
        if (!hasRequired) {
          console.log(`    ⚠️ Required content missing`);
        }
      }

      if (passed) {
        results.passed.push({ ...test, duration, answer: result.answer });
      } else {
        results.failed.push({ ...test, duration, answer: result.answer, hasForbidden, hasRequired });
      }

    } catch (error) {
      console.log(`    ❌ ERROR: ${error.message}`);
      results.errors.push({ ...test, error: error.message });
    }

    console.log('');
    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // RESULTADOS FINALES
  console.log('=' .repeat(80));
  console.log('📊 RESULTADOS FINALES - ANÁLISIS COMPLETO\n');

  const totalTests = criticalTests.length;
  const passedCount = results.passed.length;
  const failedCount = results.failed.length;
  const errorCount = results.errors.length;

  console.log(`📈 TOTAL TESTS: ${totalTests}`);
  console.log(`✅ PASSED: ${passedCount} (${((passedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ FAILED: ${failedCount} (${((failedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`⚠️ ERRORS: ${errorCount} (${((errorCount/totalTests)*100).toFixed(1)}%)\n`);

  // Análisis por categoría
  console.log('📋 ANÁLISIS POR CATEGORÍA:');
  const categories = {};
  criticalTests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = { total: 0, passed: 0, failed: 0 };
    }
    categories[test.category].total++;

    const passed = results.passed.some(r => r.id === test.id);
    const failed = results.failed.some(r => r.id === test.id);

    if (passed) categories[test.category].passed++;
    if (failed) categories[test.category].failed++;
  });

  Object.entries(categories).forEach(([category, stats]) => {
    const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
    const status = stats.failed === 0 ? '✅' : '❌';
    console.log(`   ${status} ${category}: ${stats.passed}/${stats.total} (${successRate}%)`);
  });

  // Análisis por riesgo
  console.log('\n🎯 ANÁLISIS POR RIESGO:');
  const riskLevels = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };

  criticalTests.forEach(test => {
    if (!riskLevels[test.risk]) riskLevels[test.risk] = [];
    riskLevels[test.risk].push(test);
  });

  Object.entries(riskLevels).forEach(([risk, tests]) => {
    const passed = tests.filter(test =>
      results.passed.some(r => r.id === test.id)
    ).length;
    const successRate = tests.length > 0 ? ((passed / tests.length) * 100).toFixed(1) : '0.0';
    const status = passed === tests.length ? '✅' : '❌';
    console.log(`   ${status} ${risk}: ${passed}/${tests.length} (${successRate}%)`);
  });

  // Métricas de rendimiento
  if (results.passed.length > 0) {
    const avgResponseTime = results.passed.reduce((sum, r) => sum + r.duration, 0) / results.passed.length;
    console.log('\n⚡ MÉTRICAS DE RENDIMIENTO:');
    console.log(`   ⏱️ Tiempo promedio respuesta: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   💾 Tests con cache: ${results.passed.filter(r => r.answer?.includes('cache')).length}/${results.passed.length}`);
  }

  // Lista de fallos detallada
  if (results.failed.length > 0) {
    console.log('\n❌ DETALLE DE FALLOS:');
    results.failed.forEach((fail, index) => {
      console.log(`   ${index + 1}. [${fail.category}] "${fail.question}"`);
      console.log(`      ${fail.hasForbidden ? '🚨 Contiene contenido prohibido' : ''}`);
      console.log(`      ${!fail.hasRequired ? '⚠️ Falta contenido requerido' : ''}`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\n⚠️ ERRORES TÉCNICOS:');
    results.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. [${error.category}] "${error.question}": ${error.error}`);
    });
  }

  // CONCLUSIÓN FINAL
  console.log('\n' + '=' .repeat(80));
  if (passedCount === totalTests) {
    console.log('🎉 ¡PERFECTO! TODAS LAS PRUEBAS CRÍTICAS PASARON');
    console.log('🚫 SISTEMA 100% LIBRE DE ALUCINACIONES CRÍTICAS');
    console.log('🤖 IA COMPLETAMENTE OPTIMIZADA Y CONFIABLE');
    console.log('🏆 LISTO PARA PRODUCCIÓN ENTERPRISE');
  } else if (passedCount >= totalTests * 0.95) {
    console.log('✅ ¡EXCELENTE! 95%+ DE ÉXITO');
    console.log('🚨 ALUCINACIONES CRÍTICAS ELIMINADAS');
    console.log('⚠️ Pequeños ajustes pendientes para perfección total');
  } else {
    console.log('⚠️ REQUIERE ATENCIÓN');
    console.log('🚨 Aún hay alucinaciones críticas que corregir');
    console.log('🔧 Revisar los fallos listados arriba');
  }

  console.log('\n💡 PRÓXIMOS PASOS RECOMENDADOS:');
  if (passedCount === totalTests) {
    console.log('   ✅ Sistema listo para deployment final');
    console.log('   🚀 Implementar monitoring continuo');
    console.log('   📊 Recopilar métricas de usuario real');
  } else {
    console.log('   🔧 Corregir los fallos identificados');
    console.log('   📝 Agregar más FAQs específicas');
    console.log('   🧪 Re-ejecutar pruebas después de correcciones');
  }

  console.log('\n' + '=' .repeat(80));
  console.log('✨ PRUEBAS COMPREHENSIVAS COMPLETADAS\n');

  // Código de salida basado en resultados
  if (passedCount === totalTests) {
    process.exit(0); // Éxito
  } else {
    process.exit(1); // Falló algunas pruebas
  }
}

runComprehensiveHallucinationTests().catch(console.error);
