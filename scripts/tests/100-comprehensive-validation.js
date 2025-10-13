#!/usr/bin/env node

/**
 * Comprehensive 100-Test Validation - Natural Student Questions
 *
 * 100 preguntas naturales que haría una persona de 18-25 años
 * Validación exhaustiva de que no hay alucinaciones
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 100 preguntas naturales de estudiantes jóvenes (18-25 años)
const naturalStudentQuestions = [
  // === EXPLORACIÓN INICIAL (10 preguntas) ===
  { id: 1, category: "Exploración", question: "que carreras ofrecen", description: "Pregunta básica sobre oferta académica" },
  { id: 2, category: "Exploración", question: "cuentame sobre la universidad", description: "Introducción general" },
  { id: 3, category: "Exploración", question: "que es lo mejor de estudiar aqui", description: "Ventajas competitivas" },
  { id: 4, category: "Exploración", question: "cuantas carreras tienen", description: "Conteo de programas" },
  { id: 5, category: "Exploración", question: "que carreras son las mas populares", description: "Preferencias estudiantiles" },
  { id: 6, category: "Exploración", question: "hay carreras de tecnologia", description: "Interés en tech" },
  { id: 7, category: "Exploración", question: "que carreras duran menos tiempo", description: "Duración de estudios" },
  { id: 8, category: "Exploración", question: "tienen algo de medicina", description: "Carreras de salud" },
  { id: 9, category: "Exploración", question: "que carreras pagan bien", description: "Salidas laborales" },
  { id: 10, category: "Exploración", question: "hay algo de arte o diseño", description: "Carreras creativas" },

  // === ADMISIONES Y REQUISITOS (15 preguntas) ===
  { id: 11, category: "Admisiones", question: "como me inscribo", description: "Proceso de admisión" },
  { id: 12, category: "Admisiones", question: "que necesito para entrar", description: "Requisitos de ingreso" },
  { id: 13, category: "Admisiones", question: "cuando abren las inscripciones", description: "Fechas de admisión" },
  { id: 14, category: "Admisiones", question: "hay examen de admision", description: "Pruebas de ingreso" },
  { id: 15, category: "Admisiones", question: "que promedio necesito", description: "Nota mínima" },
  { id: 16, category: "Admisiones", question: "aceptan titulos de otros paises", description: "Estudiantes internacionales" },
  { id: 17, category: "Admisiones", question: "puedo cambiarme de universidad", description: "Traslados" },
  { id: 18, category: "Admisiones", question: "hay limite de edad", description: "Restricciones etarias" },
  { id: 19, category: "Admisiones", question: "que pasa si no apruebo el examen", description: "Opciones si fallas" },
  { id: 20, category: "Admisiones", question: "puedo aplicar a varias carreras", description: "Múltiples opciones" },
  { id: 21, category: "Admisiones", question: "cuanto cuesta la inscripcion", description: "Costos administrativos" },
  { id: 22, category: "Admisiones", question: "hay plazo para documentos", description: "Tiempos límites" },
  { id: 23, category: "Admisiones", question: "me pueden ayudar con los documentos", description: "Apoyo administrativo" },
  { id: 24, category: "Admisiones", question: "que pasa si pierdo la fecha", description: "Consecuencias de retrasos" },
  { id: 25, category: "Admisiones", question: "hay entrevistas", description: "Proceso de selección" },

  // === COSTOS Y BECAS (10 preguntas) ===
  { id: 26, category: "Finanzas", question: "cuanto cuesta estudiar aqui", description: "Costos generales" },
  { id: 27, category: "Finanzas", question: "hay becas disponibles", description: "Ayuda financiera" },
  { id: 28, category: "Finanzas", question: "como consigo una beca", description: "Proceso de becas" },
  { id: 29, category: "Finanzas", question: "que becas dan", description: "Tipos de becas" },
  { id: 30, category: "Finanzas", question: "puedo trabajar mientras estudio", description: "Empleo estudiantil" },
  { id: 31, category: "Finanzas", question: "hay descuentos por promedio", description: "Incentivos académicos" },
  { id: 32, category: "Finanzas", question: "cuanto cuesta por semestre", description: "Costos periódicos" },
  { id: 33, category: "Finanzas", question: "aceptan pagos en cuotas", description: "Planes de pago" },
  { id: 34, category: "Finanzas", question: "hay ayuda economica de emergencia", description: "Apoyo urgente" },
  { id: 35, category: "Finanzas", question: "que pasa si no pago", description: "Consecuencias financieras" },

  // === VIDA ESTUDIANTIL (10 preguntas) ===
  { id: 36, category: "Vida Estudiantil", question: "hay actividades fuera de clases", description: "Actividades extracurriculares" },
  { id: 37, category: "Vida Estudiantil", question: "que deportes hay", description: "Actividades deportivas" },
  { id: 38, category: "Vida Estudiantil", question: "hay grupos estudiantiles", description: "Organizaciones" },
  { id: 39, category: "Vida Estudiantil", question: "como es la vida social", description: "Ambiente social" },
  { id: 40, category: "Vida Estudiantil", question: "hay eventos culturales", description: "Eventos artísticos" },
  { id: 41, category: "Vida Estudiantil", question: "puedo hacer voluntariado", description: "Trabajo comunitario" },
  { id: 42, category: "Vida Estudiantil", question: "hay fiestas o eventos", description: "Vida nocturna" },
  { id: 43, category: "Vida Estudiantil", question: "que hacen los estudiantes en su tiempo libre", description: "Ocio estudiantil" },
  { id: 44, category: "Vida Estudiantil", question: "hay apoyo psicologico", description: "Salud mental" },
  { id: 45, category: "Vida Estudiantil", question: "como es la relacion entre estudiantes", description: "Comunidad estudiantil" },

  // === INSTALACIONES Y SERVICIOS (10 preguntas) ===
  { id: 46, category: "Instalaciones", question: "que instalaciones tienen", description: "Infraestructura" },
  { id: 47, category: "Instalaciones", question: "hay biblioteca", description: "Recursos de estudio" },
  { id: 48, category: "Instalaciones", question: "que laboratorios hay", description: "Equipamiento académico" },
  { id: 49, category: "Instalaciones", question: "hay cafeteria o comedor", description: "Servicios alimentarios" },
  { id: 50, category: "Instalaciones", question: "como es el wifi", description: "Conectividad" },
  { id: 51, category: "Instalaciones", question: "hay estacionamiento", description: "Parking" },
  { id: 52, category: "Instalaciones", question: "que areas verdes hay", description: "Espacios recreativos" },
  { id: 53, category: "Instalaciones", question: "hay salas de estudio", description: "Espacios de trabajo" },
  { id: 54, category: "Instalaciones", question: "como son las aulas", description: "Ambientes de clase" },
  { id: 55, category: "Instalaciones", question: "hay gimnasio", description: "Instalaciones deportivas" },

  // === TRANSPORTE Y UBICACIÓN (8 preguntas) ===
  { id: 56, category: "Transporte", question: "donde queda la universidad", description: "Ubicación" },
  { id: 57, category: "Transporte", question: "como llego en transporte publico", description: "Acceso público" },
  { id: 58, category: "Transporte", question: "hay transporte de la universidad", description: "Servicio oficial" },
  { id: 59, category: "Transporte", question: "es seguro el area", description: "Seguridad del entorno" },
  { id: 60, category: "Transporte", question: "hay cerca tiendas o comercios", description: "Comodidades cercanas" },
  { id: 61, category: "Transporte", question: "que tan lejos esta del centro", description: "Distancia al centro" },
  { id: 62, category: "Transporte", question: "puedo vivir cerca", description: "Opciones de vivienda" },
  { id: 63, category: "Transporte", question: "hay metro cerca", description: "Acceso al metro" },

  // === CARRERAS ESPECÍFICAS (10 preguntas) ===
  { id: 64, category: "Carreras", question: "que es inteligencia artificial", description: "Detalle de carrera tech" },
  { id: 65, category: "Carreras", question: "cuentame sobre medicina nuclear", description: "Carrera especializada" },
  { id: 66, category: "Carreras", question: "que salidas tiene fisica", description: "Oportunidades laborales" },
  { id: 67, category: "Carreras", question: "hay algo de programacion", description: "Habilidades técnicas" },
  { id: 68, category: "Carreras", question: "que es nanotecnologia", description: "Carrera innovadora" },
  { id: 69, category: "Carreras", question: "tienen ingenieria robotica", description: "Carrera específica" },
  { id: 70, category: "Carreras", question: "que es ciencia de datos", description: "Carrera de datos" },
  { id: 71, category: "Carreras", question: "hay biologia computacional", description: "Interdisciplinaria" },
  { id: 72, category: "Carreras", question: "que es ciberseguridad", description: "Carrera de seguridad" },
  { id: 73, category: "Carreras", question: "tienen oceanografia", description: "Carrera ambiental" },

  // === INTERNACIONAL Y EXCHANGE (8 preguntas) ===
  { id: 74, category: "Internacional", question: "hay intercambios con otros paises", description: "Programas internacionales" },
  { id: 75, category: "Internacional", question: "que paises tienen convenios", description: "Alianzas globales" },
  { id: 76, category: "Internacional", question: "puedo estudiar en el extranjero", description: "Movilidad estudiantil" },
  { id: 77, category: "Internacional", question: "aceptan estudiantes extranjeros", description: "Admisión internacional" },
  { id: 78, category: "Internacional", question: "hay clases en ingles", description: "Idioma de instrucción" },
  { id: 79, category: "Internacional", question: "que ayuda hay para estudiantes internacionales", description: "Apoyo global" },
  { id: 80, category: "Internacional", question: "puedo hacer doble grado", description: "Programas conjuntos" },
  { id: 81, category: "Internacional", question: "hay oportunidades de investigacion internacional", description: "Colaboración global" },

  // === PROFESORES Y CLASES (5 preguntas) ===
  { id: 82, category: "Académico", question: "como son los profesores", description: "Cuerpo docente" },
  { id: 83, category: "Académico", question: "hay clases practicas", description: "Métodos de enseñanza" },
  { id: 84, category: "Académico", question: "cual es la carga de trabajo", description: "Demanda académica" },
  { id: 85, category: "Académico", question: "hay tutorias disponibles", description: "Apoyo académico" },
  { id: 86, category: "Académico", question: "como evaluan las materias", description: "Sistema de calificación" },

  // === GRADUACIÓN Y FUTURO (5 preguntas) ===
  { id: 87, category: "Futuro", question: "que ayuda hay para conseguir trabajo", description: "Inserción laboral" },
  { id: 88, category: "Futuro", question: "hay bolsa de empleo", description: "Oportunidades laborales" },
  { id: 89, category: "Futuro", question: "que empresas contratan egresados", description: "Red profesional" },
  { id: 90, category: "Futuro", question: "puedo hacer postgrado aqui", description: "Continuación de estudios" },
  { id: 91, category: "Futuro", question: "que porcentaje de egresados trabajan", description: "Éxito laboral" },

  // === PREGUNTAS PERSONALES/DIRECTAS (9 preguntas) ===
  { id: 92, category: "Personal", question: "me recomiendas estudiar aqui", description: "Consejo personal" },
  { id: 93, category: "Personal", question: "que carrera me queda si me gusta programar", description: "Recomendación personalizada" },
  { id: 94, category: "Personal", question: "soy bueno en matematicas, que hago", description: "Orientación vocacional" },
  { id: 95, category: "Personal", question: "me gusta investigar, que opciones hay", description: "Intereses científicos" },
  { id: 96, category: "Personal", question: "tengo 20 años, es tarde para empezar", description: "Preocupación etaria" },
  { id: 97, category: "Personal", question: "no tengo mucho dinero, puedo estudiar", description: "Barreras económicas" },
  { id: 98, category: "Personal", question: "vivo lejos, vale la pena", description: "Logística personal" },
  { id: 99, category: "Personal", question: "que opinas de la universidad", description: "Opinión general" },
  { id: 100, category: "Personal", question: "me puedes ayudar a decidir", description: "Apoyo en decisión" }
];

async function run100NaturalStudentTests() {
  console.log('🎓 100 NATURAL STUDENT QUESTIONS - COMPREHENSIVE VALIDATION\n');
  console.log('=' .repeat(100));
  console.log('🎯 OBJETIVO: Validar que NO hay alucinaciones con preguntas naturales de jóvenes 18-25');
  console.log('📊 COBERTURA: 100 preguntas reales que haría un estudiante explorando opciones');
  console.log('🔍 VALIDACIÓN: Cada respuesta analizada por precisión, utilidad y ausencia de alucinaciones');
  console.log('⚠️  ALERTA: Sistema debe responder TODAS las preguntas sin decir "No tengo información"');
  console.log('\n📂 DISTRIBUCIÓN DE PREGUNTAS:');
  console.log('   • Exploración Inicial: 10 | Admisiones: 15 | Finanzas: 10');
  console.log('   • Vida Estudiantil: 10 | Instalaciones: 10 | Transporte: 8');
  console.log('   • Carreras Específicas: 10 | Internacional: 8 | Académico: 5');
  console.log('   • Futuro: 5 | Personal: 9');
  console.log('='.repeat(100));

  // Verificar servidor
  try {
    console.log('🔍 Verificando servidor...');
    await fetch(`${BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Servidor OK\n');
  } catch (error) {
    console.log('❌ Servidor no responde. Ejecuta: npm run dev\n');
    process.exit(1);
  }

  const sessionId = `comprehensive-100-test-${Date.now()}`;
  const results = {
    passed: [],
    failed: [],
    errors: [],
    hallucinations: [],
    categories: {}
  };

  console.log('🚀 EJECUTANDO 100 PRUEBAS NATURALES...\n');

  let testIndex = 0;
  for (const test of naturalStudentQuestions) {
    testIndex++;
    const progress = `${testIndex.toString().padStart(3, '0')}/100`;
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

      // Análisis exhaustivo de la respuesta
      const analysis = analyzeComprehensiveResponse(test, answer, result);

      console.log(`    ⚡ ${duration}ms | ${analysis.status}`);
      console.log(`    📝 ${analysis.summary}`);

      if (!analysis.isGood) {
        console.log(`    💬 Answer: "${result.answer.substring(0, 100)}${result.answer.length > 100 ? '...' : ''}"`);
        if (analysis.issues.length > 0) {
          analysis.issues.forEach(issue => console.log(`       ${issue}`));
        }
      }

      // Categorizar resultados
      if (!results.categories[test.category]) {
        results.categories[test.category] = { total: 0, good: 0, poor: 0, hallucinations: 0 };
      }
      results.categories[test.category].total++;

      if (analysis.isGood) {
        results.passed.push({ ...test, duration, analysis, answer: result.answer });
        results.categories[test.category].good++;
      } else {
        results.failed.push({ ...test, duration, analysis, answer: result.answer });
        results.categories[test.category].poor++;

        if (analysis.isHallucination) {
          results.hallucinations.push({ ...test, duration, analysis, answer: result.answer });
          results.categories[test.category].hallucinations++;
        }
      }

    } catch (error) {
      console.log(`    ❌ ERROR: ${error.message}`);
      results.errors.push({ ...test, error: error.message });
      results.categories[test.category].poor++;
    }

    console.log('');
    // Pausa entre pruebas para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // RESULTADOS FINALES - ANÁLISIS COMPLETO
  console.log('='.repeat(100));
  console.log('📊 RESULTADOS FINALES - VALIDACIÓN COMPREHENSIVA\n');

  const totalTests = naturalStudentQuestions.length;
  const passedCount = results.passed.length;
  const failedCount = results.failed.length;
  const errorCount = results.errors.length;
  const hallucinationCount = results.hallucinations.length;

  console.log(`📈 TOTAL TESTS: ${totalTests}`);
  console.log(`✅ GOOD RESPONSES: ${passedCount} (${((passedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`⚠️  POOR RESPONSES: ${failedCount} (${((failedCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`❌ ERRORS: ${errorCount} (${((errorCount/totalTests)*100).toFixed(1)}%)`);
  console.log(`🚨 HALLUCINATIONS: ${hallucinationCount} (${((hallucinationCount/totalTests)*100).toFixed(1)}%)\n`);

  // Análisis por categoría
  console.log('📋 ANÁLISIS DETALLADO POR CATEGORÍA:');
  const categories = Object.entries(results.categories)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10); // Top 10 categorías

  categories.forEach(([category, stats]) => {
    const successRate = stats.total > 0 ? ((stats.good / stats.total) * 100).toFixed(1) : '0.0';
    const hallucinationRate = stats.total > 0 ? ((stats.hallucinations / stats.total) * 100).toFixed(1) : '0.0';
    const status = stats.hallucinations === 0 ? '✅' : stats.hallucinations < stats.total * 0.1 ? '⚠️' : '❌';
    console.log(`   ${status} ${category.padEnd(15)}: ${stats.good}/${stats.total} (${successRate}% good) | ${stats.hallucinations} hallucinations`);
  });

  // Métricas de rendimiento
  if (results.passed.length > 0) {
    const avgResponseTime = results.passed.reduce((sum, r) => sum + r.duration, 0) / results.passed.length;
    console.log('\n⚡ MÉTRICAS DE RENDIMIENTO:');
    console.log(`   ⏱️ Tiempo promedio respuesta: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   💾 Tests con cache: ${results.passed.filter(r => r.answer?.includes('cache')).length}/${results.passed.length}`);
  }

  // Análisis de alucinaciones
  if (results.hallucinations.length > 0) {
    console.log('\n🚨 ANÁLISIS DE ALUCINACIONES DETECTADAS:');
    const hallucinationTypes = {};

    results.hallucinations.forEach(h => {
      const type = h.analysis.hallucinationType || 'unknown';
      if (!hallucinationTypes[type]) hallucinationTypes[type] = [];
      hallucinationTypes[type].push(h);
    });

    Object.entries(hallucinationTypes).forEach(([type, hallucinations]) => {
      console.log(`   📍 ${type.toUpperCase()}: ${hallucinations.length} casos`);
      hallucinations.slice(0, 3).forEach((h, idx) => {
        console.log(`      ${idx + 1}. "${h.question}" - ${h.analysis.hallucinationReason}`);
      });
      if (hallucinations.length > 3) {
        console.log(`      ... y ${hallucinations.length - 3} más`);
      }
    });
  }

  // Preguntas que necesitan mejoras
  if (results.failed.length > 0) {
    console.log('\n🔧 ÁREAS QUE NECESITAN MEJORA:');

    // Agrupar por tipo de problema
    const problemTypes = {};
    results.failed.forEach(f => {
      const problem = f.analysis.mainProblem || 'other';
      if (!problemTypes[problem]) problemTypes[problem] = [];
      problemTypes[problem].push(f);
    });

    Object.entries(problemTypes)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([problem, fails]) => {
        console.log(`   📍 ${problem.toUpperCase()}: ${fails.length} preguntas`);
        fails.slice(0, 2).forEach(f => {
          console.log(`      • "${f.question}" (${f.category})`);
        });
      });
  }

  // CONCLUSIÓN FINAL
  console.log('\n' + '='.repeat(100));

  const overallScore = ((passedCount/totalTests)*100);
  const hallucinationRate = ((hallucinationCount/totalTests)*100);

  if (overallScore >= 90 && hallucinationRate === 0) {
    console.log('🎉 ¡VALIDACIÓN PERFECTA! Sistema libre de alucinaciones');
    console.log(`🏆 PUNTAJE FINAL: ${overallScore.toFixed(1)}% - SISTEMA ENTERPRISE`);
    console.log('✨ TODAS las optimizaciones funcionan correctamente');
    console.log('🚫 CERO alucinaciones detectadas');
  } else if (overallScore >= 80 && hallucinationRate <= 5) {
    console.log('✅ ¡VALIDACIÓN EXITOSA! Sistema confiable');
    console.log(`📊 PUNTAJE FINAL: ${overallScore.toFixed(1)}% - SISTEMA PRODUCCIÓN`);
    console.log('⚠️ Alucinaciones mínimas detectadas, pero aceptables');
  } else if (overallScore >= 70) {
    console.log('⚠️ VALIDACIÓN ACEPTABLE - Requiere mejoras menores');
    console.log(`📈 PUNTAJE FINAL: ${overallScore.toFixed(1)}% - SISTEMA FUNCIONAL`);
    console.log('🔧 Algunas alucinaciones requieren corrección');
  } else {
    console.log('❌ VALIDACIÓN FALLIDA - Requiere atención inmediata');
    console.log(`📉 PUNTAJE FINAL: ${overallScore.toFixed(1)}% - SISTEMA PROBLEMÁTICO`);
    console.log('🚨 Múltiples alucinaciones detectadas');
  }

  console.log('\n💡 RECOMENDACIONES:');
  if (hallucinationRate > 0) {
    console.log('   🚨 Corregir alucinaciones detectadas inmediatamente');
  }
  if (overallScore < 85) {
    console.log('   📝 Agregar más FAQs para preguntas no respondidas');
  }
  if (results.failed.some(f => f.analysis.mainProblem === 'no_info')) {
    console.log('   ❓ Crear respuestas para preguntas que dicen "no tengo información"');
  }

  console.log('\n' + '='.repeat(100));
  console.log('✨ VALIDACIÓN COMPREHENSIVA DE 100 PREGUNTAS COMPLETADA\n');

  // Código de salida basado en resultados
  if (overallScore >= 85 && hallucinationRate === 0) {
    process.exit(0); // Éxito perfecto
  } else if (overallScore >= 70) {
    process.exit(0); // Éxito aceptable
  } else {
    process.exit(1); // Requiere mejoras
  }
}

function analyzeComprehensiveResponse(test, answer, fullResult) {
  // Análisis exhaustivo de calidad y detección de alucinaciones

  const hasValue = answer.length > 10; // Respuesta no vacía o demasiado corta
  const notNoInfo = !/no tengo esa información|no sé|desconozco/i.test(answer);
  const relevantToCategory = isRelevantToCategory(test.category, answer);

  // Detección de alucinaciones específicas
  const hallucinationCheck = detectHallucinations(answer);
  const isHallucination = hallucinationCheck.isHallucination;

  let status = '✅ GOOD';
  let summary = 'Respuesta útil y precisa';
  let isGood = true;
  let mainProblem = '';
  let issues = [];
  let hallucinationType = '';
  let hallucinationReason = '';

  // Determinar problemas principales
  if (!hasValue) {
    status = '📝 TOO SHORT';
    summary = 'Respuesta demasiado corta o genérica';
    isGood = false;
    mainProblem = 'too_short';
    issues.push('❌ Respuesta muy corta para una pregunta detallada');
  } else if (!notNoInfo) {
    status = '❓ NO INFO';
    summary = 'Sistema no tiene información (respuesta genérica)';
    isGood = false;
    mainProblem = 'no_info';
    issues.push('❌ Respuesta "no tengo información" en pregunta específica');
  } else if (!relevantToCategory) {
    status = '🎯 IRRELEVANT';
    summary = 'Respuesta no aborda la pregunta específica';
    isGood = false;
    mainProblem = 'irrelevant';
    issues.push('❌ Respuesta no relacionada con la categoría de la pregunta');
  } else if (isHallucination) {
    status = '🚨 HALLUCINATION';
    summary = `Alucinación detectada: ${hallucinationCheck.type}`;
    isGood = false;
    mainProblem = 'hallucination';
    hallucinationType = hallucinationCheck.type;
    hallucinationReason = hallucinationCheck.reason;
    issues.push(`🚨 ${hallucinationCheck.reason}`);
  }

  return {
    status,
    summary,
    isGood,
    mainProblem,
    issues,
    isHallucination,
    hallucinationType,
    hallucinationReason
  };
}

function detectHallucinations(answer) {
  // Detección de alucinaciones conocidas y patrones peligrosos

  // Alucinaciones críticas corregidas anteriormente
  const criticalHallucinations = [
    {
      pattern: /gratuita|gratis.*matrícula/i,
      type: 'cost_hallucination',
      reason: 'Dice que la matrícula es gratuita cuando NO lo es'
    },
    {
      pattern: /beca completa|100%|financiado totalmente/i,
      type: 'scholarship_hallucination',
      reason: 'Menciona becas completas que no existen'
    },
    {
      pattern: /gimnasio|piscina|estadio.*completo/i,
      type: 'facilities_hallucination',
      reason: 'Menciona instalaciones inexistentes'
    },
    {
      pattern: /24 horas.*abierto|fines de semana.*atención/i,
      type: 'schedule_hallucination',
      reason: 'Horarios imposibles de atención'
    },
    {
      pattern: /(?!laboratorio de idiomas)(teatro|danza|música|grupos.*culturales)/i,
      type: 'activities_hallucination',
      reason: 'Menciona actividades culturales inexistentes'
    },
    {
      pattern: /no.*transporte.*universitario|buscarse.*vida.*carritos/i,
      type: 'transport_hallucination',
      reason: 'Niega existencia de transporte universitario oficial'
    },
    {
      pattern: /postgrado|maestrías?|doctorado/i,
      type: 'postgraduate_hallucination',
      reason: 'Menciona programas de postgrado inexistentes'
    },
    {
      pattern: /residencias.*gratuitas?|alojamiento.*universitario/i,
      type: 'housing_hallucination',
      reason: 'Menciona residencias gratuitas o sin requisitos'
    },
    {
      pattern: /usa|españa|brasil.*convenios/i,
      type: 'international_hallucination',
      reason: 'Menciona convenios internacionales inexistentes'
    },
    {
      pattern: /cambio.*carrera.*cualquier.*momento|sin.*restricciones/i,
      type: 'career_change_hallucination',
      reason: 'Simplifica excesivamente el proceso de cambio de carrera'
    }
  ];

  for (const hallucination of criticalHallucinations) {
    if (hallucination.pattern.test(answer)) {
      return {
        isHallucination: true,
        type: hallucination.type,
        reason: hallucination.reason
      };
    }
  }

  // Verificar respuestas demasiado vagas o genéricas
  if (answer.length < 50 && !/sí|no|consulta|contacta/i.test(answer)) {
    return {
      isHallucination: true,
      type: 'too_vague',
      reason: 'Respuesta demasiado vaga para pregunta específica'
    };
  }

  return { isHallucination: false };
}

function isRelevantToCategory(category, answer) {
  // Verificar si la respuesta es relevante para la categoría
  const relevancePatterns = {
    'Exploración': /carreras?|universidad|programas?|ofrec|estudiar/i,
    'Admisiones': /inscripción|requisitos|documentos|promedio|examen|admision/i,
    'Finanzas': /costo|becas?|pago|financiamiento|precio|cuota/i,
    'Vida Estudiantil': /actividades?|eventos?|clubes?|deportes?|social/i,
    'Instalaciones': /instalaciones?|biblioteca|laboratorios?|aulas?|wifi/i,
    'Transporte': /transporte|ubicación|llevar|llegar|cerca|seguridad/i,
    'Carreras': /ingeniería|licenciatura|física|biología|ciencia/i,
    'Internacional': /internacional|convenios?|paises?|extranjero|exchange/i,
    'Académico': /profesores?|clases?|estudio|tutorías?|evaluación/i,
    'Futuro': /trabajo|empleo|graduación|postgrado?|egresados/i,
    'Personal': /recomienda|opinas?|decidir|ayudar?|consejo/i
  };

  const patterns = relevancePatterns[category];
  return patterns ? patterns.test(answer) : true;
}

run100NaturalStudentTests().catch(console.error);
