#!/usr/bin/env node

/**
 * Test de Alucinaciones - 10 Pruebas Críticas
 * 
 * Verifica las alucinaciones más comunes y críticas
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

// 10 pruebas críticas
const criticalTests = [
  // COSTOS (3 pruebas)
  {
    question: "cuanto cuesta la matricula",
    hallucinations: ["$10", "$20", "dolares", "bolivares", "precio exacto"],
    category: "costos"
  },
  {
    question: "cuanto pago por estudiar",
    hallucinations: ["$10", "$20", "monto exacto"],
    category: "costos"
  },
  {
    question: "cuales son los costos administrativos",
    hallucinations: ["$10 por semestre", "precio exacto"],
    category: "costos"
  },

  // BECAS (4 pruebas)
  {
    question: "hay becas",
    hallucinations: ["20%", "50%", "20-50%", "100%"],
    category: "becas"
  },
  {
    question: "cuanto es la beca",
    hallucinations: ["20%", "50%", "porcentaje exacto"],
    category: "becas"
  },
  {
    question: "hay becas completas",
    hallucinations: ["100%", "cubren el 100%"],
    category: "becas"
  },
  {
    question: "que porcentaje de beca dan",
    hallucinations: ["20-50%", "30%", "porcentaje específico"],
    category: "becas"
  },

  // REQUISITOS (2 pruebas)
  {
    question: "que nota necesito para entrar",
    hallucinations: ["18 puntos", "16 puntos", "15 a 18 puntos"],
    category: "requisitos"
  },
  {
    question: "cual es el promedio minimo",
    hallucinations: ["18", "16", "número específico"],
    category: "requisitos"
  },

  // CARRERAS (1 prueba)
  {
    question: "hay medicina",
    hallucinations: ["sí, medicina", "carrera de medicina"],
    category: "carreras"
  }
];

// Función para hacer consulta al API
async function queryAPI(question) {
  try {
    const response = await axios.post(API_URL, {
      message: question,
      sessionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
      error: error.response?.data?.error || error.message
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
async function runQuickTests() {
  console.log('🔍 PRUEBAS RÁPIDAS DE ALUCINACIONES (10 PRUEBAS CRÍTICAS)\n');
  console.log('=' .repeat(70));
  
  const results = {
    total: 10,
    passed: 0,
    failed: 0,
    errors: 0,
    details: []
  };
  
  for (let i = 0; i < criticalTests.length; i++) {
    const test = criticalTests[i];
    
    console.log(`\n[${i + 1}/10] 📝 ${test.question}`);
    console.log(`Categoría: ${test.category}`);
    
    const response = await queryAPI(test.question);
    
    if (!response.success) {
      console.log(`❌ ERROR: ${response.error}`);
      results.errors++;
      results.details.push({
        question: test.question,
        category: test.category,
        status: 'error',
        error: response.error
      });
      
      // Pausa más larga si hay error de rate limit
      if (response.error.includes('429') || response.error.includes('Too many')) {
        console.log('⏳ Rate limit detectado, esperando 10 segundos...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      continue;
    }
    
    const hallucinations = detectHallucinations(response.reply, test.hallucinations);
    
    if (hallucinations.length > 0) {
      console.log(`❌ FALLÓ - Alucinaciones detectadas:`);
      hallucinations.forEach(h => console.log(`   • "${h}"`));
      console.log(`📄 Respuesta: ${response.reply.substring(0, 200)}...`);
      results.failed++;
      results.details.push({
        question: test.question,
        category: test.category,
        status: 'failed',
        hallucinations,
        reply: response.reply
      });
    } else {
      console.log(`✅ PASÓ - Sin alucinaciones`);
      console.log(`📄 Respuesta: ${response.reply.substring(0, 150)}...`);
      results.passed++;
      results.details.push({
        question: test.question,
        category: test.category,
        status: 'passed',
        reply: response.reply
      });
    }
    
    // Pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Reporte final
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 REPORTE FINAL');
  console.log('='.repeat(70));
  console.log(`\n✅ Pruebas pasadas: ${results.passed}/10 (${(results.passed/10*100).toFixed(1)}%)`);
  console.log(`❌ Pruebas fallidas: ${results.failed}/10 (${(results.failed/10*100).toFixed(1)}%)`);
  console.log(`⚠️  Errores: ${results.errors}/10`);
  
  // Resumen por categoría
  const byCategory = {
    costos: { passed: 0, failed: 0, errors: 0 },
    becas: { passed: 0, failed: 0, errors: 0 },
    requisitos: { passed: 0, failed: 0, errors: 0 },
    carreras: { passed: 0, failed: 0, errors: 0 }
  };
  
  results.details.forEach(d => {
    if (d.status === 'passed') byCategory[d.category].passed++;
    else if (d.status === 'failed') byCategory[d.category].failed++;
    else if (d.status === 'error') byCategory[d.category].errors++;
  });
  
  console.log('\n📂 POR CATEGORÍA:\n');
  Object.entries(byCategory).forEach(([cat, data]) => {
    const total = data.passed + data.failed + data.errors;
    const rate = total > 0 ? (data.passed / total * 100).toFixed(1) : 0;
    const icon = rate >= 80 ? '✅' : rate >= 50 ? '⚠️' : '❌';
    console.log(`${icon} ${cat.toUpperCase()}: ${data.passed}/${total} (${rate}%)`);
  });
  
  // Detalles de fallos
  const failures = results.details.filter(d => d.status === 'failed');
  if (failures.length > 0) {
    console.log('\n\n' + '='.repeat(70));
    console.log('❌ ALUCINACIONES DETECTADAS');
    console.log('='.repeat(70));
    
    failures.forEach((failure, idx) => {
      console.log(`\n${idx + 1}. "${failure.question}" (${failure.category})`);
      console.log(`   Alucinaciones: ${failure.hallucinations.join(', ')}`);
      console.log(`   Respuesta: ${failure.reply.substring(0, 200)}...`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🏁 PRUEBAS COMPLETADAS');
  console.log('='.repeat(70));
  
  // Exit code
  if (results.failed > 0) {
    console.log('\n⚠️  Se detectaron alucinaciones.');
    process.exit(1);
  } else if (results.errors > 0) {
    console.log('\n⚠️  Hubo errores durante las pruebas.');
    process.exit(1);
  } else {
    console.log('\n✅ Todas las pruebas pasaron exitosamente.');
    process.exit(0);
  }
}

// Ejecutar
runQuickTests().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
