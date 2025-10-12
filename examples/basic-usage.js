/**
 * Ejemplo Básico de Uso de la API del Chatbot
 * 
 * Este archivo demuestra cómo interactuar con la API del chatbot
 * usando diferentes métodos y patrones.
 */

// ============================================
// 1. Ejemplo Simple con fetch
// ============================================

async function simpleChat() {
  console.log('=== Ejemplo Simple ===\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '¿Cuál es la capital de Francia?',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Usuario: ¿Cuál es la capital de Francia?');
    console.log(`Bot: ${data.reply}\n`);
    console.log(`Tokens usados: ${data.usage.total_tokens}\n`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================
// 2. Conversación con Contexto
// ============================================

async function conversationWithContext() {
  console.log('=== Conversación con Contexto ===\n');
  
  const context = [];
  
  // Primera pregunta
  const message1 = '¿Qué es Node.js?';
  const response1 = await chatWithContext(message1, context);
  
  console.log(`Usuario: ${message1}`);
  console.log(`Bot: ${response1.reply}\n`);
  
  // Agregar al contexto
  context.push(
    { role: 'user', content: message1 },
    { role: 'assistant', content: response1.reply }
  );
  
  // Segunda pregunta (usa contexto)
  const message2 = '¿Cuáles son sus ventajas?';
  const response2 = await chatWithContext(message2, context);
  
  console.log(`Usuario: ${message2}`);
  console.log(`Bot: ${response2.reply}\n`);
  
  console.log(`Total de tokens en conversación: ${response1.usage.total_tokens + response2.usage.total_tokens}\n`);
}

async function chatWithContext(message, context = []) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// ============================================
// 3. Clase Cliente Completa
// ============================================

class ChatbotClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.context = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
  }
  
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  setUserId(userId) {
    this.userId = userId;
  }
  
  async chat(message) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: this.context,
          sessionId: this.sessionId,
          userId: this.userId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Actualizar contexto
      this.context.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.reply }
      );
      
      // Limitar contexto a últimos 10 mensajes
      if (this.context.length > 10) {
        this.context = this.context.slice(-10);
      }
      
      return data;
      
    } catch (error) {
      console.error('Chat error:', error.message);
      throw error;
    }
  }
  
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error.message);
      return null;
    }
  }
  
  clearContext() {
    this.context = [];
  }
  
  getContext() {
    return this.context;
  }
  
  getSessionId() {
    return this.sessionId;
  }
}

async function clientExample() {
  console.log('=== Ejemplo con Cliente ===\n');
  
  const bot = new ChatbotClient('http://localhost:3000');
  bot.setUserId('user-123');
  
  console.log(`Session ID: ${bot.getSessionId()}\n`);
  
  // Conversación
  const messages = [
    '¿Qué es la inteligencia artificial?',
    '¿Cuáles son sus aplicaciones principales?',
    'Dame un ejemplo de uso en medicina',
  ];
  
  for (const message of messages) {
    console.log(`Usuario: ${message}`);
    const response = await bot.chat(message);
    console.log(`Bot: ${response.reply}\n`);
    console.log(`Tokens: ${response.usage.total_tokens}`);
    console.log('---\n');
  }
  
  // Health check
  console.log('=== Health Check ===');
  const health = await bot.healthCheck();
  console.log(`Status: ${health.status}`);
  console.log(`OpenAI: ${health.services.openai}\n`);
}

// ============================================
// 4. Manejo de Errores
// ============================================

async function errorHandlingExample() {
  console.log('=== Manejo de Errores ===\n');
  
  try {
    // Intentar enviar mensaje vacío (debería fallar)
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.log('Error esperado (validación):');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${error.error}`);
      if (error.details) {
        console.log('Detalles:', error.details);
      }
      console.log();
    }
    
  } catch (error) {
    console.error('Error de red:', error.message);
  }
}

// ============================================
// 5. Rate Limiting
// ============================================

async function rateLimitExample() {
  console.log('=== Ejemplo de Rate Limiting ===\n');
  
  console.log('Enviando múltiples requests...\n');
  
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Mensaje de prueba ${i}`,
        }),
      });
      
      // Leer headers de rate limit
      const rateLimit = response.headers.get('RateLimit-Limit');
      const rateRemaining = response.headers.get('RateLimit-Remaining');
      const rateReset = response.headers.get('RateLimit-Reset');
      
      console.log(`Request ${i}:`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Rate Limit: ${rateRemaining}/${rateLimit} remaining`);
      if (rateReset) {
        const resetDate = new Date(parseInt(rateReset) * 1000);
        console.log(`  Reset at: ${resetDate.toLocaleTimeString()}`);
      }
      console.log();
      
      if (!response.ok) {
        const error = await response.json();
        console.log(`  Error: ${error.error}`);
        if (error.retryAfter) {
          console.log(`  Retry after: ${error.retryAfter} seconds`);
        }
      }
      
    } catch (error) {
      console.error(`Request ${i} failed:`, error.message);
    }
  }
}

// ============================================
// 6. Streaming (Para implementación futura)
// ============================================

// NOTA: Esta funcionalidad no está implementada aún,
// pero aquí está el patrón que se usaría

async function streamingExample() {
  console.log('=== Ejemplo de Streaming (futuro) ===\n');
  
  console.log('Esta funcionalidad se implementará en versiones futuras.');
  console.log('Permitirá recibir respuestas del chatbot en tiempo real.\n');
  
  // Patrón propuesto:
  /*
  const response = await fetch('http://localhost:3000/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '¿Qué es la inteligencia artificial?',
      stream: true,
    }),
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    process.stdout.write(chunk); // Imprimir en tiempo real
  }
  */
}

// ============================================
// Ejecutar Ejemplos
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Ejemplos de Uso - Chatbot AI API     ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    // Verificar que la API esté funcionando
    const healthResponse = await fetch('http://localhost:3000/api/health');
    if (!healthResponse.ok) {
      throw new Error('API no está disponible. Asegúrate de que el servidor esté corriendo.');
    }
    
    // Ejecutar ejemplos
    await simpleChat();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await conversationWithContext();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await clientExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await errorHandlingExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await rateLimitExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await streamingExample();
    
    console.log('\n✅ Todos los ejemplos completados!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nAsegúrate de que:');
    console.error('1. El servidor esté corriendo (npm start)');
    console.error('2. La variable OPENAI_API_KEY esté configurada');
    console.error('3. El puerto 3000 esté disponible\n');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Exportar para uso como módulo
export {
  simpleChat,
  conversationWithContext,
  ChatbotClient,
  clientExample,
  errorHandlingExample,
  rateLimitExample,
};

