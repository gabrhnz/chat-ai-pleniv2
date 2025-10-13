#!/usr/bin/env node

/**
 * Deep Hallucination Detection Test
 *
 * Prueba profunda para detectar alucinaciones en múltiples categorías
 * Identifica preguntas críticas que necesitan FAQs específicas
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const testCategories = {
  // ✅ YA ARREGLADO - Licenciaturas
  licenciaturas: {
    name: "Licenciaturas",
    status: "FIXED ✅",
    queries: [
      "cuáles son las licenciaturas",
      "qué carreras ofrece la unc",
      "cuántas licenciaturas tiene"
    ],
    expectedContains: ["10", "Física Nuclear", "Biotecnología"],
    shouldNotContain: ["Ciencias Ambientales", "Psicología", "Geología"]
  },

  // 🔍 POR REVISAR - Programas de posgrado
  posgrados: {
    name: "Posgrados",
    status: "UNKNOWN ❓",
    queries: [
      "qué maestrías ofrece",
      "cuáles son los posgrados",
      "qué especializaciones tiene"
    ],
    expectedContains: [], // No sabemos si existen
    shouldNotContain: ["MBA", "Derecho", "Medicina"] // Probablemente no existen
  },

  // 🔍 POR REVISAR - Instalaciones
  instalaciones: {
    name: "Instalaciones",
    status: "UNKNOWN ❓",
    queries: [
      "qué instalaciones tiene",
      "cuáles son las facilidades",
      "qué laboratorios hay",
      "tiene biblioteca"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["gimnasio", "estadio", "comedor"] // Probablemente no
  },

  // 🔍 POR REVISAR - Profesores/Investigadores
  profesores: {
    name: "Profesores",
    status: "UNKNOWN ❓",
    queries: [
      "cuáles son los profesores",
      "quiénes son los docentes",
      "qué investigadores trabajan aquí"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["Premio Nobel", "internacionalmente reconocidos"] // Probablemente no
  },

  // 🔍 POR REVISAR - Becas y financiamiento
  becas: {
    name: "Becas",
    status: "UNKNOWN ❓",
    queries: [
      "qué becas ofrece",
      "cuáles son las ayudas económicas",
      "hay financiamiento estudiantil"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["beca completa", "100% financiado"] // Probablemente no
  },

  // 🔍 POR REVISAR - Admisión específica
  admision: {
    name: "Admisión Detallada",
    status: "UNKNOWN ❓",
    queries: [
      "cuáles son los requisitos de ingreso",
      "qué documentos necesito para inscribirme",
      "cómo es el proceso de admisión"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["examen de admisión", "prueba de ingreso"] // Probablemente no para UNC
  },

  // 🔍 POR REVISAR - Ubicación y contacto
  ubicacion: {
    name: "Ubicación",
    status: "UNKNOWN ❓",
    queries: [
      "dónde queda exactamente",
      "cuál es la dirección",
      "cómo llegar desde Caracas"
    ],
    expectedContains: ["Caracas"], // Sabemos que está en Caracas
    shouldNotContain: ["Maracaibo", "Valencia", "Maracay"] // Probablemente no
  },

  // 🔍 POR REVISAR - Horarios
  horarios: {
    name: "Horarios",
    status: "UNKNOWN ❓",
    queries: [
      "qué horario tiene clases",
      "a qué hora abren",
      "cuál es el horario de atención"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["24 horas", "fines de semana"] // Probablemente no
  },

  // 🔍 POR REVISAR - Costos específicos
  costos: {
    name: "Costos Detallados",
    status: "UNKNOWN ❓",
    queries: [
      "cuánto cuesta la matrícula",
      "qué precio tiene el semestre",
      "cuál es el costo por crédito"
    ],
    expectedContains: [], // No sabemos
    shouldNotContain: ["gratuito", "muy barato"] // Probablemente no
  },

  // 🔍 POR REVISAR - Duración de carreras
  duracion: {
    name: "Duración de Carreras",
    status: "UNKNOWN ❓",
    queries: [
      "cuántos años dura una licenciatura",
      "cuál es la duración de las carreras",
      "cuántos semestres tiene"
    ],
    expectedContains: ["4 años", "8 semestres"], // Sabemos esto
    shouldNotContain: ["3 años", "5 años", "10 semestres"] // Probablemente no
  }
};

async function testQuery(query, sessionId, category) {
  console.log(`\n🧪 [${category.name}] "${query}"`);

  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, sessionId })
    });

    const result = await response.json();
    const answer = result.answer || '';
    const duration = Date.now() - startTime;

    console.log(`⚡ ${duration}ms | "${answer.substring(0, 100)}${answer.length > 100 ? '...' : ''}"`);

    // Análisis de alucinaciones
    const hasExpected = category.expectedContains.length === 0 ||
      category.expectedContains.some(term => answer.toLowerCase().includes(term.toLowerCase()));

    const hasForbidden = category.shouldNotContain.some(term =>
      answer.toLowerCase().includes(term.toLowerCase())
    );

    let status = '✅ SAFE';
    let issues = [];

    if (!hasExpected && category.expectedContains.length > 0) {
      status = '⚠️ MISSING INFO';
      issues.push('Falta información esperada');
    }

    if (hasForbidden) {
      status = '🚨 HALLUCINATION';
      issues.push('Contiene información probablemente falsa');
    }

    if (answer.toLowerCase().includes('no tengo esa información')) {
      status = '❓ NO INFO';
      issues.push('Sistema admite no tener información');
    }

    console.log(`   ${status}${issues.length > 0 ? ` - ${issues.join(', ')}` : ''}`);

    return {
      query,
      answer,
      category: category.name,
      status,
      hasExpected,
      hasForbidden,
      duration,
      issues
    };

  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { query, category: category.name, error: error.message };
  }
}

async function runDeepTest() {
  console.log('🔍 DEEP HALLUCINATION DETECTION TEST\n');
  console.log('=' .repeat(80));
  console.log('🎯 OBJETIVO: Identificar todas las preguntas que causan alucinaciones');
  console.log('🚨 HALLUCINATION: IA inventando información falsa');
  console.log('⚠️ MISSING INFO: Sistema no tiene información pero no lo admite');
  console.log('❓ NO INFO: Sistema correctamente dice que no sabe');
  console.log('✅ SAFE: Respuesta correcta o segura\n');

  const allResults = [];
  let categoryIndex = 0;

  for (const [key, category] of Object.entries(testCategories)) {
    console.log(`\n📂 CATEGORY: ${category.name} [${category.status}]`);
    console.log('-'.repeat(50));

    const categoryResults = [];

    for (const query of category.queries) {
      const result = await testQuery(query, `deep-test-${key}-${Date.now()}`, category);
      categoryResults.push(result);
      allResults.push(result);

      // Pausa para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Resumen por categoría
    const hallucinations = categoryResults.filter(r => r.status === '🚨 HALLUCINATION').length;
    const missingInfo = categoryResults.filter(r => r.status === '⚠️ MISSING INFO').length;
    const noInfo = categoryResults.filter(r => r.status === '❓ NO INFO').length;
    const safe = categoryResults.filter(r => r.status === '✅ SAFE').length;

    console.log(`\n📊 ${category.name} SUMMARY:`);
    console.log(`   🚨 Hallucinations: ${hallucinations}`);
    console.log(`   ⚠️ Missing Info: ${missingInfo}`);
    console.log(`   ❓ No Info: ${noInfo}`);
    console.log(`   ✅ Safe: ${safe}`);

    categoryIndex++;
  }

  // Análisis global
  console.log('\n' + '='.repeat(80));
  console.log('📈 GLOBAL ANALYSIS\n');

  const totalQueries = allResults.length;
  const hallucinations = allResults.filter(r => r.status === '🚨 HALLUCINATION').length;
  const missingInfo = allResults.filter(r => r.status === '⚠️ MISSING INFO').length;
  const noInfo = allResults.filter(r => r.status === '❓ NO INFO').length;
  const safe = allResults.filter(r => r.status === '✅ SAFE').length;

  console.log(`📊 TOTAL QUERIES TESTED: ${totalQueries}`);
  console.log(`🚨 HALLUCINATIONS FOUND: ${hallucinations} (${((hallucinations/totalQueries)*100).toFixed(1)}%)`);
  console.log(`⚠️ MISSING INFO ISSUES: ${missingInfo} (${((missingInfo/totalQueries)*100).toFixed(1)}%)`);
  console.log(`❓ CORRECT "NO INFO": ${noInfo} (${((noInfo/totalQueries)*100).toFixed(1)}%)`);
  console.log(`✅ SAFE RESPONSES: ${safe} (${((safe/totalQueries)*100).toFixed(1)}%)`);

  // Identificar categorías problemáticas
  console.log('\n🚨 CATEGORIES NEEDING ATTENTION:');
  const problematicCategories = Object.entries(testCategories)
    .map(([key, cat]) => {
      const catResults = allResults.filter(r => r.category === cat.name);
      const catHallucinations = catResults.filter(r => r.status === '🚨 HALLUCINATION').length;
      return { name: cat.name, hallucinations: catHallucinations, total: catResults.length };
    })
    .filter(cat => cat.hallucinations > 0)
    .sort((a, b) => b.hallucinations - a.hallucinations);

  if (problematicCategories.length === 0) {
    console.log('   🎉 No hallucinations detected! All categories are safe.');
  } else {
    problematicCategories.forEach(cat => {
      console.log(`   🚨 ${cat.name}: ${cat.hallucinations}/${cat.total} queries hallucinating`);
    });
  }

  // Recomendaciones
  console.log('\n💡 RECOMMENDATIONS:');
  if (hallucinations > 0) {
    console.log('   1. Create specific FAQs for hallucinating categories');
    console.log('   2. Add "I don\'t have that information" responses for unknown topics');
    console.log('   3. Implement stricter fact-checking in responses');
  }
  if (missingInfo > 0) {
    console.log('   4. Gather more information about missing topics');
    console.log('   5. Add FAQs for commonly asked questions');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ DEEP TEST COMPLETE\n');
}

runDeepTest().catch(console.error);
