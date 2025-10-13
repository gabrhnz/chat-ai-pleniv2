#!/usr/bin/env node

/**
 * Test de Alucinaciones - 50 Pruebas Exhaustivas
 * 
 * Verifica que el bot no invente información sobre:
 * - Costos y aranceles
 * - Becas y porcentajes
 * - Fechas específicas
 * - Requisitos de admisión
 * - Programas y carreras
 * - Contacto y ubicación
 */

import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });

const API_URL = process.env.API_URL || 'http://localhost:3000/api/chat';

// Categorías de pruebas
const testCases = {
  // COSTOS Y ARANCELES (10 pruebas)
  costos: [
    {
      question: "cuanto cuesta la matricula",
      hallucinations: ["$10", "$20", "$50", "dolares", "bolivares", "precio", "pagar"],
      category: "costos"
    },
    {
      question: "hay que pagar inscripcion",
      hallucinations: ["$10", "$20", "costo", "precio", "monto"],
      category: "costos"
    },
    {
      question: "cuanto cuesta estudiar en la unc",
      hallucinations: ["$", "dolares", "bolivares", "precio exacto", "monto"],
      category: "costos"
    },
    {
      question: "cual es el arancel",
      hallucinations: ["$10", "$20", "precio específico"],
      category: "costos"
    },
    {
      question: "cuanto sale el semestre",
      hallucinations: ["$10", "$20", "$50", "precio"],
      category: "costos"
    },
    {
      question: "hay mensualidad",
      hallucinations: ["$", "precio", "monto mensual"],
      category: "costos"
    },
    {
      question: "cuanto pago por estudiar",
      hallucinations: ["$10", "$20", "monto exacto"],
      category: "costos"
    },
    {
      question: "la universidad cobra",
      hallucinations: ["$10 por semestre", "precio específico"],
      category: "costos"
    },
    {
      question: "hay que pagar algo",
      hallucinations: ["$10", "monto exacto"],
      category: "costos"
    },
    {
      question: "cuales son los costos administrativos",
      hallucinations: ["$10 por semestre", "precio exacto"],
      category: "costos"
    }
  ],

  // BECAS Y PORCENTAJES (10 pruebas)
  becas: [
    {
      question: "hay becas",
      hallucinations: ["20%", "50%", "20-50%", "porcentaje específico", "100%"],
      category: "becas"
    },
    {
      question: "dan ayuda economica",
      hallucinations: ["20%", "30%", "50%", "porcentaje"],
      category: "becas"
    },
    {
      question: "cuanto es la beca",
      hallucinations: ["20%", "50%", "porcentaje exacto"],
      category: "becas"
    },
    {
      question: "que porcentaje de beca dan",
      hallucinations: ["20-50%", "30%", "porcentaje específico"],
      category: "becas"
    },
    {
      question: "cubren toda la matricula",
      hallucinations: ["100%", "cubre todo", "completa"],
      category: "becas"
    },
    {
      question: "hay becas completas",
      hallucinations: ["100%", "cubren el 100%"],
      category: "becas"
    },
    {
      question: "cuanto ayudan con las becas",
      hallucinations: ["20%", "50%", "porcentaje"],
      category: "becas"
    },
    {
      question: "que tipo de becas tienen",
      hallucinations: ["20-50%", "porcentaje específico"],
      category: "becas"
    },
    {
      question: "puedo obtener beca completa",
      hallucinations: ["100%", "cubre todo"],
      category: "becas"
    },
    {
      question: "como funcionan las becas",
      hallucinations: ["20%", "50%", "porcentaje exacto"],
      category: "becas"
    }
  ],

  // FECHAS ESPECÍFICAS (10 pruebas)
  fechas: [
    {
      question: "cuando abren inscripciones",
      hallucinations: ["15 de enero", "20 de julio", "fecha exacta día/mes"],
      category: "fechas"
    },
    {
      question: "cual es la fecha de inscripcion",
      hallucinations: ["día específico", "15 de", "20 de"],
      category: "fechas"
    },
    {
      question: "cuando empiezan las clases",
      hallucinations: ["día exacto", "fecha específica"],
      category: "fechas"
    },
    {
      question: "cuando cierran inscripciones",
      hallucinations: ["fecha exacta", "día específico"],
      category: "fechas"
    },
    {
      question: "hasta cuando puedo inscribirme",
      hallucinations: ["fecha límite exacta", "día específico"],
      category: "fechas"
    },
    {
      question: "cuando son los examenes de admision",
      hallucinations: ["fecha exacta", "día específico"],
      category: "fechas"
    },
    {
      question: "cuando entregan resultados",
      hallucinations: ["fecha exacta", "día específico"],
      category: "fechas"
    },
    {
      question: "cual es el calendario academico",
      hallucinations: ["fechas exactas", "días específicos"],
      category: "fechas"
    },
    {
      question: "cuando termina el semestre",
      hallucinations: ["fecha exacta", "día específico"],
      category: "fechas"
    },
    {
      question: "cuando son las vacaciones",
      hallucinations: ["fecha exacta", "día específico"],
      category: "fechas"
    }
  ],

  // REQUISITOS DE ADMISIÓN (10 pruebas)
  requisitos: [
    {
      question: "que nota necesito para entrar",
      hallucinations: ["18 puntos", "16 puntos", "nota mínima exacta"],
      category: "requisitos"
    },
    {
      question: "cual es el promedio minimo",
      hallucinations: ["18", "16", "número específico"],
      category: "requisitos"
    },
    {
      question: "cuantos puntos necesito",
      hallucinations: ["puntaje exacto", "número específico"],
      category: "requisitos"
    },
    {
      question: "hay examen de admision",
      hallucinations: ["puntaje mínimo", "nota de corte"],
      category: "requisitos"
    },
    {
      question: "que puntaje piden",
      hallucinations: ["número exacto", "puntaje específico"],
      category: "requisitos"
    },
    {
      question: "necesito prueba de ingles",
      hallucinations: ["nivel B2", "puntaje TOEFL", "certificación específica"],
      category: "requisitos"
    },
    {
      question: "piden certificado medico especifico",
      hallucinations: ["exámenes específicos", "análisis exactos"],
      category: "requisitos"
    },
    {
      question: "cuantas fotos necesito",
      hallucinations: ["número exacto de fotos"],
      category: "requisitos"
    },
    {
      question: "que tipo de fotos piden",
      hallucinations: ["tamaño exacto", "especificaciones precisas"],
      category: "requisitos"
    },
    {
      question: "necesito apostillar documentos",
      hallucinations: ["costo de apostilla", "lugar específico"],
      category: "requisitos"
    }
  ],

  // PROGRAMAS Y CARRERAS (10 pruebas)
  carreras: [
    {
      question: "hay medicina",
      hallucinations: ["sí, medicina", "carrera de medicina"],
      category: "carreras"
    },
    {
      question: "tienen derecho",
      hallucinations: ["sí, derecho", "carrera de derecho"],
      category: "carreras"
    },
    {
      question: "hay psicologia",
      hallucinations: ["sí, psicología", "carrera de psicología"],
      category: "carreras"
    },
    {
      question: "ofrecen administracion",
      hallucinations: ["sí, administración", "carrera de administración"],
      category: "carreras"
    },
    {
      question: "hay arquitectura",
      hallucinations: ["sí, arquitectura", "carrera de arquitectura"],
      category: "carreras"
    },
    {
      question: "tienen contaduria",
      hallucinations: ["sí, contaduría", "carrera de contaduría"],
      category: "carreras"
    },
    {
      question: "hay postgrados",
      hallucinations: ["maestrías específicas", "nombres de postgrados"],
      category: "carreras"
    },
    {
      question: "ofrecen doctorados",
      hallucinations: ["sí, doctorados", "programas específicos"],
      category: "carreras"
    },
    {
      question: "hay diplomados",
      hallucinations: ["nombres específicos de diplomados"],
      category: "carreras"
    },
    {
      question: "cuantas carreras tienen",
      hallucinations: ["número exacto mayor a 16"],
      category: "carreras"
    }
  ]
};

// Función para hacer consulta al API
async function queryAPI(question) {
  try {
    const response = await axios.post(API_URL, {
      message: question,
      sessionId: `test_${Date.now()}`
    }, {
      timeout: 15000
    });
    
    return {
      success: true,
      reply: response.data.reply,
      sources: response.data.sources || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para detectar alucinaciones
function detectHallucinations(reply, hallucinationPatterns) {
  const detected = [];
  const lowerReply = reply.toLowerCase();
  
  for (const pattern of hallucinationPatterns) {
    if (lowerReply.includes(pattern.toLowerCase())) {
      detected.push(pattern);
    }
  }
  
  return detected;
}

// Función principal de pruebas
async function runHallucinationTests() {
  console.log('🔍 INICIANDO PRUEBAS DE ALUCINACIONES\n');
  console.log('=' .repeat(70));
  console.log(`📊 Total de pruebas: 50`);
  console.log('=' .repeat(70));
  console.log('');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0,
    byCategory: {}
  };
  
  // Ejecutar todas las pruebas
  for (const [categoryName, tests] of Object.entries(testCases)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📂 CATEGORÍA: ${categoryName.toUpperCase()}`);
    console.log('='.repeat(70));
    
    results.byCategory[categoryName] = {
      total: tests.length,
      passed: 0,
      failed: 0,
      errors: 0,
      details: []
    };
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      results.total++;
      
      console.log(`\n[${results.total}/50] Pregunta: "${test.question}"`);
      
      const response = await queryAPI(test.question);
      
      if (!response.success) {
        console.log(`❌ ERROR: ${response.error}`);
        results.errors++;
        results.byCategory[categoryName].errors++;
        results.byCategory[categoryName].details.push({
          question: test.question,
          status: 'error',
          error: response.error
        });
        continue;
      }
      
      const hallucinations = detectHallucinations(response.reply, test.hallucinations);
      
      if (hallucinations.length > 0) {
        console.log(`❌ FALLÓ - Alucinaciones detectadas:`);
        hallucinations.forEach(h => console.log(`   • "${h}"`));
        console.log(`📝 Respuesta: ${response.reply.substring(0, 150)}...`);
        results.failed++;
        results.byCategory[categoryName].failed++;
        results.byCategory[categoryName].details.push({
          question: test.question,
          status: 'failed',
          hallucinations,
          reply: response.reply
        });
      } else {
        console.log(`✅ PASÓ - Sin alucinaciones detectadas`);
        console.log(`📝 Respuesta: ${response.reply.substring(0, 150)}...`);
        results.passed++;
        results.byCategory[categoryName].passed++;
        results.byCategory[categoryName].details.push({
          question: test.question,
          status: 'passed',
          reply: response.reply
        });
      }
      
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Reporte final
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 REPORTE FINAL DE ALUCINACIONES');
  console.log('='.repeat(70));
  console.log(`\n✅ Pruebas pasadas: ${results.passed}/${results.total} (${((results.passed/results.total)*100).toFixed(1)}%)`);
  console.log(`❌ Pruebas fallidas: ${results.failed}/${results.total} (${((results.failed/results.total)*100).toFixed(1)}%)`);
  console.log(`⚠️  Errores: ${results.errors}/${results.total}`);
  
  console.log('\n📂 RESULTADOS POR CATEGORÍA:\n');
  for (const [category, data] of Object.entries(results.byCategory)) {
    const passRate = ((data.passed / data.total) * 100).toFixed(1);
    const icon = passRate >= 80 ? '✅' : passRate >= 50 ? '⚠️' : '❌';
    console.log(`${icon} ${category.toUpperCase()}: ${data.passed}/${data.total} (${passRate}%)`);
  }
  
  // Detalles de fallos
  if (results.failed > 0) {
    console.log('\n\n' + '='.repeat(70));
    console.log('❌ DETALLES DE ALUCINACIONES DETECTADAS');
    console.log('='.repeat(70));
    
    for (const [category, data] of Object.entries(results.byCategory)) {
      const failures = data.details.filter(d => d.status === 'failed');
      if (failures.length > 0) {
        console.log(`\n📂 ${category.toUpperCase()}:`);
        failures.forEach((failure, idx) => {
          console.log(`\n${idx + 1}. Pregunta: "${failure.question}"`);
          console.log(`   Alucinaciones: ${failure.hallucinations.join(', ')}`);
          console.log(`   Respuesta: ${failure.reply.substring(0, 200)}...`);
        });
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🏁 PRUEBAS COMPLETADAS');
  console.log('='.repeat(70));
  
  // Exit code basado en resultados
  if (results.failed > 0) {
    console.log('\n⚠️  Se detectaron alucinaciones. Revisar FAQs y system prompts.');
    process.exit(1);
  } else {
    console.log('\n✅ No se detectaron alucinaciones. Sistema funcionando correctamente.');
    process.exit(0);
  }
}

// Ejecutar pruebas
runHallucinationTests().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
