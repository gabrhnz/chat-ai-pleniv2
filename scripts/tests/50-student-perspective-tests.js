#!/usr/bin/env node

/**
 * 50 Critical Tests - Current Students Perspective
 *
 * Pruebas exhaustivas desde la perspectiva de estudiantes que YA están en la universidad
 * 50 preguntas realistas que harían estudiantes activos
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 50 preguntas críticas desde perspectiva de estudiante actual
const studentQuestions = [
  // === VIDA ACADÉMICA (10 preguntas) ===
  { id: 1, category: "Académico", question: "como veo mis calificaciones", description: "Acceso a notas" },
  { id: 2, category: "Académico", question: "donde encuentro el pensum actualizado", description: "Plan de estudios" },
  { id: 3, category: "Académico", question: "como cambio de carrera", description: "Cambio de especialidad" },
  { id: 4, category: "Académico", question: "que hago si repruebo una materia", description: "Recuperación académica" },
  { id: 5, category: "Académico", question: "cuantas veces puedo repetir una materia", description: "Límite de repeticiones" },
  { id: 6, category: "Académico", question: "como solicito equivalencias", description: "Traslados de otras universidades" },
  { id: 7, category: "Académico", question: "que es el indice academico", description: "Promedio acumulado" },
  { id: 8, category: "Académico", question: "como hago para graduarme", description: "Proceso de graduación" },
  { id: 9, category: "Académico", question: "que documentos necesito para graduarme", description: "Requisitos de graduación" },
  { id: 10, category: "Académico", question: "puedo hacer doble titulacion", description: "Dos carreras simultáneas" },

  // === PROFESORES Y CLASES (8 preguntas) ===
  { id: 11, category: "Profesores", question: "como contacto a mis profesores", description: "Comunicación con docentes" },
  { id: 12, category: "Profesores", question: "donde veo el horario de clases", description: "Calendario académico" },
  { id: 13, category: "Profesores", question: "que hago si un profesor no viene", description: "Ausencias de profesores" },
  { id: 14, category: "Profesores", question: "puedo cambiar de grupo", description: "Cambio de sección" },
  { id: 15, category: "Profesores", question: "como evaluo a mis profesores", description: "Sistema de evaluación docente" },
  { id: 16, category: "Profesores", question: "que pasa si pierdo una clase", description: "Asistencia y faltas" },
  { id: 17, category: "Profesores", question: "hay tutores disponibles", description: "Apoyo académico" },
  { id: 18, category: "Profesores", question: "como veo mis profesores evaluaciones", description: "Ratings de docentes" },

  // === EXAMENES Y EVALUACIONES (6 preguntas) ===
  { id: 19, category: "Exámenes", question: "cuando son los examenes finales", description: "Calendario de exámenes" },
  { id: 20, category: "Exámenes", question: "como veo mis examenes pasados", description: "Revisión de evaluaciones" },
  { id: 21, category: "Exámenes", question: "que hago si pierdo un examen", description: "Exámenes perdidos" },
  { id: 22, category: "Exámenes", question: "hay recuperaciones de examenes", description: "Exámenes extraordinarios" },
  { id: 23, category: "Exámenes", question: "como veo la rúbrica de evaluacion", description: "Criterios de calificación" },
  { id: 24, category: "Exámenes", question: "puedo apelar una calificacion", description: "Apelaciones académicas" },

  // === SERVICIOS ESTUDIANTILES (8 preguntas) ===
  { id: 25, category: "Servicios", question: "donde esta la oficina de becas", description: "Ubicación servicios" },
  { id: 26, category: "Servicios", question: "como renuevo mi beca", description: "Mantenimiento de becas" },
  { id: 27, category: "Servicios", question: "hay servicios psicologicos", description: "Salud mental estudiantil" },
  { id: 28, category: "Servicios", question: "donde encuentro apoyo academico", description: "Tutorías y apoyo" },
  { id: 29, category: "Servicios", question: "como uso la biblioteca", description: "Recursos bibliotecarios" },
  { id: 30, category: "Servicios", question: "hay wifi en toda la universidad", description: "Conectividad" },
  { id: 31, category: "Servicios", question: "donde imprimo documentos", description: "Servicios de impresión" },
  { id: 32, category: "Servicios", question: "hay lockers para estudiantes", description: "Almacenamiento personal" },

  // === ACTIVIDADES ESTUDIANTILES (6 preguntas) ===
  { id: 33, category: "Actividades", question: "que clubes estudiantiles hay", description: "Organizaciones estudiantiles" },
  { id: 34, category: "Actividades", question: "como me uno a un club", description: "Participación en clubes" },
  { id: 35, category: "Actividades", question: "hay eventos deportivos", description: "Actividades deportivas" },
  { id: 36, category: "Actividades", question: "que actividades culturales hay", description: "Eventos culturales" },
  { id: 37, category: "Actividades", question: "como organizo un evento estudiantil", description: "Organización de eventos" },
  { id: 38, category: "Actividades", question: "hay voluntariado disponible", description: "Oportunidades de voluntariado" },

  // === PROBLEMAS COMUNES (6 preguntas) ===
  { id: 39, category: "Problemas", question: "que hago si pierdo mi carnet estudiantil", description: "Reposición de documentos" },
  { id: 40, category: "Problemas", question: "como reporto acoso estudiantil", description: "Protocolos de seguridad" },
  { id: 41, category: "Problemas", question: "que hago si tengo problemas economicos", description: "Apoyo financiero de emergencia" },
  { id: 42, category: "Problemas", question: "como cambio mi informacion personal", description: "Actualización de datos" },
  { id: 43, category: "Problemas", question: "que hago si tengo conflicto con un profesor", description: "Resolución de conflictos" },
  { id: 44, category: "Problemas", question: "como solicito readmision si me retire", description: "Reingreso a la universidad" },

  // === TECNOLOGÍA Y SISTEMAS (4 preguntas) ===
  { id: 45, category: "Tecnología", question: "como accedo al portal estudiantil", description: "Sistema de información" },
  { id: 46, category: "Tecnología", question: "que hago si olvido mi contraseña", description: "Recuperación de acceso" },
  { id: 47, category: "Tecnología", question: "hay app movil de la universidad", description: "Aplicaciones móviles" },
  { id: 48, category: "Tecnología", question: "como veo mi horario en el telefono", description: "Acceso móvil al calendario" },

  // === FINANZAS Y PAGOS (2 preguntas) ===
  { id: 49, category: "Finanzas", question: "como veo mi estado de cuenta", description: "Información financiera" },
  { id: 50, category: "Finanzas", question: "que hago si no puedo pagar", description: "Planes de pago y moratorias" }
];

async function run50StudentTests() {
  console.log('🎓 50 CRITICAL TESTS - CURRENT STUDENT PERSPECTIVE\n');
  console.log('=' .repeat(90));
  console.log('🎯 OBJETIVO: Validar respuestas para estudiantes que YA están en la universidad');
  console.log('📊 COBERTURA: 50 preguntas realistas de estudiantes activos');
  console.log('🔍 VALIDACIÓN: Cada respuesta analizada por precisión y utilidad');
  console.log('\n📂 CATEGORÍAS:');
  console.log('   • Académico (10) | Profesores (8) | Exámenes (6)');
  console.log('   • Servicios (8) | Actividades (6) | Problemas (6)');
  console.log('   • Tecnología (4) | Finanzas (2)');
  console.log('='.repeat(90));

  // Verificar servidor
  try {
    console.log('🔍 Verificando servidor...');
    await fetch(`${BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Servidor OK\n');
  } catch (error) {
    console.log('❌ Servidor no responde. Ejecuta: npm run dev\n');
    process.exit(1);
  }

  const sessionId = `student-perspective-test-${Date.now()}`;
  const results = {
    passed: [],
    failed: [],
    errors: [],
    categories: {}
  };

  console.log('🚀 EJECUTANDO 50 PRUEBAS CRÍTICAS...\n');

  let testIndex = 0;
  for (const test of studentQuestions) {
    testIndex++;
    const progress = `${testIndex.toString().padStart(2, '0')}/50`;
    console.log(`${progress}. [${test.category}] ${test.description}`);
    console.log(`    ❓ "${test.question}"`);

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

      // Análisis de calidad de respuesta
      const analysis = analyzeStudentResponse(test, answer, result);

      console.log(`    ⚡ ${duration}ms | ${analysis.status}`);
      console.log(`    📝 ${analysis.summary}`);

      if (!analysis.isGood) {
        console.log(`    💬 Answer: "${result.answer.substring(0, 80)}${result.answer.length > 80 ? '...' : ''}"`);
      }

      // Categorizar resultados
      if (!results.categories[test.category]) {
        results.categories[test.category] = { total: 0, good: 0, poor: 0 };
      }
      results.categories[test.category].total++;

      if (analysis.isGood) {
        results.passed.push({ ...test, duration, analysis, answer: result.answer });
        results.categories[test.category].good++;
      } else {
        results.failed.push({ ...test, duration, analysis, answer: result.answer });
        results.categories[test.category].poor++;
      }

    } catch (error) {
      console.log(`    ❌ ERROR: ${error.message}`);
      results.errors.push({ ...test, error: error.message });
      results.categories[test.category].poor++;
    }

    console.log('');
    // Pequeña pausa entre pruebas para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // RESULTADOS FINALES
  console.log('='.repeat(90));
  console.log('📊 RESULTADOS FINALES - ANÁLISIS COMPLETO\n');

  const totalTests = studentQuestions.length;
  const passedCount = results.passed.length;
  const failedCount = results.failed.length;
  const errorCount = results.errors.length;

  console.log(`📈 TOTAL TESTS: ${totalTests}`);
  console.log(`✅ GOOD RESPONSES: ${passedCount} (${((passedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`⚠️ POOR RESPONSES: ${failedCount} (${((failedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ ERRORS: ${errorCount} (${((errorCount/totalTests)*100).toFixed(1)}%)\n`);

  // Análisis por categoría
  console.log('📋 ANÁLISIS POR CATEGORÍA:');
  const categories = Object.entries(results.categories).sort((a, b) => b[1].total - a[1].total);

  categories.forEach(([category, stats]) => {
    const successRate = stats.total > 0 ? ((stats.good / stats.total) * 100).toFixed(1) : '0.0';
    const status = stats.poor === 0 ? '✅' : stats.good > stats.poor ? '⚠️' : '❌';
    console.log(`   ${status} ${category} (${stats.total}): ${stats.good} good, ${stats.poor} poor (${successRate}% success)`);
  });

  // Métricas de rendimiento
  if (results.passed.length > 0) {
    const avgResponseTime = results.passed.reduce((sum, r) => sum + r.duration, 0) / results.passed.length;
    console.log('\n⚡ MÉTRICAS DE RENDIMIENTO:');
    console.log(`   ⏱️ Tiempo promedio respuesta: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   💾 Tests con cache: ${results.passed.filter(r => r.answer?.includes('cache')).length}/${results.passed.length}`);
  }

  // Preguntas problemáticas
  if (results.failed.length > 0) {
    console.log('\n⚠️ RESPUESTAS PROBLEMÁTICAS (TOP 10):');
    results.failed.slice(0, 10).forEach((fail, index) => {
      console.log(`   ${index + 1}. [${fail.category}] "${fail.question}"`);
      console.log(`      ${fail.analysis.reason}`);
    });

    if (results.failed.length > 10) {
      console.log(`   ... y ${results.failed.length - 10} más`);
    }
  }

  // Preguntas que necesitan FAQs
  const needsFAQs = results.failed.filter(f => f.analysis.reason?.includes('No info'));
  if (needsFAQs.length > 0) {
    console.log('\n📝 PREGUNTAS QUE NECESITAN FAQs ESPECÍFICAS:');
    needsFAQs.forEach((faq, index) => {
      console.log(`   ${index + 1}. "${faq.question}" (${faq.category})`);
    });
  }

  // CONCLUSIÓN FINAL
  console.log('\n' + '='.repeat(90));
  const overallScore = ((passedCount/totalTests)*100);

  if (overallScore >= 80) {
    console.log('🎉 ¡EXCELENTE! Sistema maneja bien preguntas de estudiantes actuales');
    console.log(`🏆 OVERALL SCORE: ${overallScore.toFixed(1)}% - Nivel Enterprise`);
  } else if (overallScore >= 60) {
    console.log('⚠️ BUENO, pero necesita mejoras para estudiantes actuales');
    console.log(`📊 OVERALL SCORE: ${overallScore.toFixed(1)}% - Necesita optimización`);
  } else {
    console.log('❌ CRÍTICO: Sistema no maneja bien estudiantes actuales');
    console.log(`📈 OVERALL SCORE: ${overallScore.toFixed(1)}% - Requiere atención inmediata`);
  }

  console.log('\n💡 RECOMENDACIONES:');
  if (results.failed.length > needsFAQs.length) {
    console.log('   🔧 Crear FAQs específicas para preguntas sin respuesta');
  }
  if (results.failed.some(f => f.analysis.reason?.includes('incorrect'))) {
    console.log('   📚 Actualizar información incorrecta en FAQs existentes');
  }
  if (avgResponseTime > 2000) {
    console.log('   ⚡ Optimizar tiempos de respuesta');
  }

  console.log('\n' + '='.repeat(90));
  console.log('✨ PRUEBAS DE ESTUDIANTES ACTUALES COMPLETADAS\n');

  // Código de salida basado en resultados
  if (overallScore >= 70) {
    process.exit(0); // Éxito
  } else {
    process.exit(1); // Requiere mejoras
  }
}

function analyzeStudentResponse(test, answer, fullResult) {
  // Verificar si la respuesta es útil para un estudiante actual
  const hasValue = answer.length > 20; // Respuesta no vacía
  const notHallucinating = !checkForHallucinations(answer);
  const relevantToCategory = isRelevantToCategory(test.category, answer);

  // Verificar frases que indican falta de información
  const lacksInfo = /no tengo esa información|no sé|desconozco/i.test(answer);

  let status = '✅ GOOD';
  let summary = 'Respuesta útil y relevante';
  let isGood = true;
  let reason = '';

  if (lacksInfo) {
    status = '❓ NO INFO';
    summary = 'Sistema admite no tener información';
    isGood = false;
    reason = 'No info - Crear FAQ específica';
  } else if (!hasValue) {
    status = '📝 TOO SHORT';
    summary = 'Respuesta muy corta o genérica';
    isGood = false;
    reason = 'Too short - Needs detailed answer';
  } else if (!relevantToCategory) {
    status = '🎯 IRRELEVANT';
    summary = 'Respuesta no aborda la pregunta específica';
    isGood = false;
    reason = 'Irrelevant - FAQ needs updating';
  } else if (!notHallucinating) {
    status = '🚨 HALLUCINATION';
    summary = 'Contiene información potencialmente falsa';
    isGood = false;
    reason = 'Hallucination detected';
  }

  return { status, summary, isGood, reason };
}

function checkForHallucinations(answer) {
  // Verificar alucinaciones conocidas
  const hallucinationPatterns = [
    /gratuita|gratis/i, // Costos incorrectos
    /beca completa|100%/i, // Becas irreales
    /gimnasio|piscina/i, // Instalaciones inexistentes
    /24 horas|fines de semana/i, // Horarios imposibles
    /ciencias ambientales|bioquímica|geología|psicología/i // Carreras inexistentes
  ];

  return hallucinationPatterns.some(pattern => pattern.test(answer));
}

function isRelevantToCategory(category, answer) {
  // Verificar si la respuesta es relevante para la categoría
  const relevancePatterns = {
    'Académico': /calificaciones|pensum|carrera|materia|índice|graduar/i,
    'Profesores': /profesor|clase|horario|contacto|evaluación|tutor/i,
    'Exámenes': /examen|calificación|evaluación|apelación|recuperación/i,
    'Servicios': /oficina|beca|psicológico|biblioteca|wifi|imprimir/i,
    'Actividades': /club|evento|deportivo|cultural|voluntariado/i,
    'Problemas': /carnet|acoso|conflicto|readmisión|información/i,
    'Tecnología': /portal|contraseña|app|móvil|teléfono/i,
    'Finanzas': /cuenta|pago|estado financiero/i
  };

  const patterns = relevancePatterns[category];
  return patterns ? patterns.test(answer) : true; // Si no hay patrón específico, asumir relevante
}

run50StudentTests().catch(console.error);
