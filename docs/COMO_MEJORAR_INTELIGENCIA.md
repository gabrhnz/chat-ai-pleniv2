# 🧠 Cómo Hacer el Bot Más Inteligente

El bot usa **RAG (Retrieval-Augmented Generation)**, que combina búsqueda semántica + LLM. Aquí te muestro cómo mejorarlo:

---

## 🎯 NIVEL 1: Mejoras Inmediatas (Sin Código)

### 1. **Agregar Más FAQs** ⭐⭐⭐⭐⭐
**Impacto: ALTO**

Más FAQs = Más conocimiento

```sql
-- Agrega FAQs variadas sobre el mismo tema
INSERT INTO faqs (question, answer, category, keywords) VALUES

-- Diferentes formas de preguntar lo mismo
('¿Cuánto cuesta la UNC?', 'La UNC es gratuita...', 'costos', ARRAY['costo', 'precio']),
('¿Es gratis estudiar en la UNC?', 'Sí, es gratuita...', 'costos', ARRAY['gratis', 'gratuita']),
('¿Hay que pagar matrícula?', 'No, la matrícula es gratuita...', 'costos', ARRAY['matrícula', 'pagar']);
```

### 2. **Mejorar las Respuestas** ⭐⭐⭐⭐⭐
**Impacto: ALTO**

Respuestas más completas = Bot más útil

**❌ Respuesta Mala:**
```
"Sí, hay becas."
```

**✅ Respuesta Buena:**
```
"Sí, la UNC ofrece varios tipos de becas:

1. **Becas Académicas**: Para estudiantes con excelente rendimiento
2. **Becas Socioeconómicas**: Para estudiantes con necesidades económicas
3. **Becas Deportivas**: Para atletas destacados

Para solicitar una beca:
- Completa el formulario en línea
- Presenta documentos de respaldo
- Espera la evaluación (2-3 semanas)

Más información: https://unc.edu.ve/becas o contacta a becas@unc.edu.ve"
```

### 3. **Usar Keywords Inteligentes** ⭐⭐⭐⭐
**Impacto: MEDIO-ALTO**

```sql
-- Incluye sinónimos, variaciones, errores comunes
keywords: ARRAY[
  'inscripción', 'inscripcion', -- sin tilde
  'admisión', 'admision',
  'ingreso', 'entrada',
  'registro', 'matricula',
  'como entrar', 'como ingresar'
]
```

---

## 🎯 NIVEL 2: Ajustar Parámetros (Fácil)

### 1. **Ajustar Similarity Threshold** ⭐⭐⭐⭐
**Impacto: MEDIO**

En Vercel, cambia la variable:

```
SIMILARITY_THRESHOLD=0.7  # Actual (más estricto)
SIMILARITY_THRESHOLD=0.6  # Más flexible (encuentra más FAQs)
SIMILARITY_THRESHOLD=0.8  # Más estricto (solo respuestas muy relevantes)
```

**Recomendación:** Empieza con `0.6` y ajusta según resultados.

### 2. **Aumentar TOP_K_RESULTS** ⭐⭐⭐
**Impacto: MEDIO**

```
TOP_K_RESULTS=5   # Actual
TOP_K_RESULTS=10  # Más contexto (respuestas más completas)
```

**Nota:** Más resultados = respuestas más lentas pero más completas.

### 3. **Ajustar Temperatura** ⭐⭐⭐
**Impacto: MEDIO**

```
TEMPERATURE=0.3  # Actual (más preciso, menos creativo)
TEMPERATURE=0.5  # Balance
TEMPERATURE=0.7  # Más creativo, menos preciso
```

**Recomendación:** `0.3-0.4` para FAQs (precisión), `0.6-0.8` para conversación.

### 4. **Aumentar MAX_TOKENS** ⭐⭐
**Impacto: BAJO-MEDIO**

```
MAX_TOKENS=500   # Actual (respuestas cortas)
MAX_TOKENS=800   # Respuestas más largas
MAX_TOKENS=1000  # Respuestas muy detalladas
```

**Nota:** Más tokens = Mayor costo en OpenRouter.

---

## 🎯 NIVEL 3: Mejoras de Código (Intermedio)

### 1. **Mejorar el System Prompt** ⭐⭐⭐⭐⭐
**Impacto: ALTO**

Edita `src/services/rag.service.js`:

```javascript
const systemPrompt = `Eres un asistente virtual experto de la Universidad Nacional de las Ciencias Dr. Humberto Fernández-Morán (UNC).

PERSONALIDAD:
- Amigable y entusiasta
- Profesional pero cercano
- Usa emojis ocasionalmente 🎓
- Tutea al usuario

CONOCIMIENTO:
- Ubicación: Sector Altos de Pipe, km 11, Miranda, Venezuela
- Lema: "Ciencia, Tecnología e Innovación para el Desarrollo"
- Enfoque: Carreras científicas y tecnológicas de 4 años

INSTRUCCIONES:
1. Responde SOLO con información de las FAQs proporcionadas
2. Si no sabes algo, sugiere contactar: https://unc.edu.ve/ o redes sociales
3. Menciona siempre la duración (4 años) al hablar de carreras
4. Sé específico con ubicaciones, fechas y contactos
5. Si la pregunta es ambigua, pide aclaración
6. Termina con una pregunta de seguimiento cuando sea apropiado

TONO:
- "¡Claro! Te cuento sobre..."
- "La UNC ofrece..."
- "¿Te gustaría saber más sobre...?"

FORMATO:
- Usa listas cuando sea apropiado
- Resalta información importante con **negritas**
- Incluye enlaces cuando sea relevante`;
```

### 2. **Agregar Contexto de Conversación** ⭐⭐⭐⭐
**Impacto: ALTO**

Permite que el bot recuerde la conversación:

```javascript
// En tu frontend
const conversationHistory = [];

async function sendMessage(message) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      context: conversationHistory.slice(-4) // Últimos 4 mensajes
    })
  });
  
  const data = await response.json();
  
  // Guardar en historial
  conversationHistory.push(
    { role: 'user', content: message },
    { role: 'assistant', content: data.reply }
  );
  
  return data.reply;
}
```

### 3. **Agregar Fallback Inteligente** ⭐⭐⭐
**Impacto: MEDIO**

Edita `src/services/rag.service.js` en la función `assembleContext`:

```javascript
if (faqs.length === 0) {
  return {
    systemPrompt,
    userPrompt: `El usuario preguntó: "${query}"

No encontré información específica en la base de datos, pero puedo ayudarte de estas formas:

1. **Preguntas frecuentes disponibles:**
   - Información general de la UNC
   - Carreras y programas
   - Proceso de admisión
   - Ubicación y contacto

2. **Recursos útiles:**
   - Sitio web: https://unc.edu.ve/
   - Instagram: @unc.oficial
   - Email: info@unc.edu.ve

¿Podrías reformular tu pregunta o decirme sobre qué tema específico necesitas información?`,
  };
}
```

---

## 🎯 NIVEL 4: Funciones Avanzadas (Avanzado)

### 1. **Agregar Búsqueda Híbrida** ⭐⭐⭐⭐⭐
**Impacto: ALTO**

Combina búsqueda semántica + búsqueda de texto completo:

```javascript
// En src/services/rag.service.js
async function hybridSearch(query, embedding) {
  // Búsqueda semántica (actual)
  const { data: semanticResults } = await supabase.rpc('match_faqs', {
    query_embedding: embedding,
    match_threshold: SIMILARITY_THRESHOLD,
    match_count: TOP_K_RESULTS,
  });
  
  // Búsqueda de texto completo
  const { data: textResults } = await supabase
    .from('faqs')
    .select('*')
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .limit(5);
  
  // Combinar y eliminar duplicados
  const combined = [...semanticResults, ...textResults];
  const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
  
  return unique.slice(0, TOP_K_RESULTS);
}
```

### 2. **Agregar Analytics** ⭐⭐⭐⭐
**Impacto: MEDIO**

Aprende qué preguntan los usuarios:

```javascript
// Guardar cada pregunta
async function logQuery(query, foundAnswer) {
  await supabase.from('analytics').insert({
    query: query,
    found_answer: foundAnswer,
    timestamp: new Date().toISOString()
  });
}

// Luego analiza qué preguntas no tienen respuesta
SELECT query, COUNT(*) as count
FROM analytics
WHERE found_answer = false
GROUP BY query
ORDER BY count DESC
LIMIT 20;
```

### 3. **Agregar Feedback de Usuario** ⭐⭐⭐⭐⭐
**Impacto: ALTO**

Permite que usuarios califiquen respuestas:

```javascript
// En tu frontend, después de cada respuesta
<button onClick={() => rateResponse(messageId, 'helpful')}>👍 Útil</button>
<button onClick={() => rateResponse(messageId, 'not-helpful')}>👎 No útil</button>

async function rateResponse(messageId, rating) {
  await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message_id: messageId,
      rating: rating
    })
  });
}
```

### 4. **Agregar Sugerencias Automáticas** ⭐⭐⭐⭐
**Impacto: MEDIO-ALTO**

Muestra preguntas relacionadas:

```javascript
// Después de cada respuesta, sugiere preguntas relacionadas
const relatedQuestions = sources
  .slice(1, 4)
  .map(s => s.question);

return {
  reply: answer,
  sources: sources,
  suggestions: relatedQuestions
};
```

---

## 🎯 NIVEL 5: Inteligencia Avanzada (Experto)

### 1. **Fine-tuning del Modelo** ⭐⭐⭐⭐⭐
**Impacto: MUY ALTO** | **Costo: MEDIO**

Entrena un modelo específico para la UNC:

1. Recopila 100-500 conversaciones reales
2. Usa OpenAI Fine-tuning API
3. Entrena modelo personalizado
4. Costo: ~$10-50 USD

### 2. **Multi-turn Conversation** ⭐⭐⭐⭐⭐
**Impacto: MUY ALTO**

Implementa memoria de conversación completa:

```javascript
// Guardar sesiones en Supabase
const sessionId = generateSessionId();

await supabase.from('sessions').insert({
  session_id: sessionId,
  messages: conversationHistory,
  user_id: userId
});
```

### 3. **Procesamiento de Documentos** ⭐⭐⭐⭐⭐
**Impacto: MUY ALTO**

Permite subir PDFs, documentos:

```javascript
// Procesar documento y crear chunks
import { PDFLoader } from 'langchain/document_loaders';

const loader = new PDFLoader('reglamento.pdf');
const docs = await loader.load();

// Dividir en chunks y generar embeddings
for (const doc of docs) {
  const embedding = await generateEmbedding(doc.pageContent);
  await supabase.from('documents').insert({
    content: doc.pageContent,
    embedding: embedding
  });
}
```

---

## 📊 MÉTRICAS PARA MEDIR INTELIGENCIA

### 1. **Tasa de Respuesta**
```sql
SELECT 
  COUNT(CASE WHEN found_answer THEN 1 END) * 100.0 / COUNT(*) as success_rate
FROM analytics;
```

**Meta:** >85% de preguntas respondidas

### 2. **Satisfacción de Usuario**
```sql
SELECT 
  COUNT(CASE WHEN rating = 'helpful' THEN 1 END) * 100.0 / COUNT(*) as satisfaction
FROM feedback;
```

**Meta:** >80% de respuestas útiles

### 3. **Tiempo de Respuesta**
```sql
SELECT AVG(duration) as avg_response_time
FROM analytics
WHERE created_at > NOW() - INTERVAL '7 days';
```

**Meta:** <5 segundos

---

## 🚀 PLAN DE ACCIÓN RECOMENDADO

### Semana 1: Fundamentos
- [ ] Agregar 30-50 FAQs más
- [ ] Mejorar respuestas existentes
- [ ] Ajustar SIMILARITY_THRESHOLD a 0.6
- [ ] Mejorar system prompt

### Semana 2: Optimización
- [ ] Implementar analytics básico
- [ ] Agregar feedback de usuarios
- [ ] Ajustar parámetros según datos
- [ ] Agregar sugerencias de preguntas

### Semana 3: Avanzado
- [ ] Implementar contexto de conversación
- [ ] Agregar búsqueda híbrida
- [ ] Crear interfaz de administración
- [ ] Monitorear y ajustar

### Mes 2+: Expansión
- [ ] Procesar documentos oficiales
- [ ] Fine-tuning si es necesario
- [ ] Multi-idioma (si aplica)
- [ ] Integración con otros sistemas

---

## 💡 TIPS PRO

1. **Calidad > Cantidad**: 50 FAQs buenas > 200 FAQs malas
2. **Itera Constantemente**: Revisa analytics semanalmente
3. **Escucha a los Usuarios**: El feedback es oro
4. **Prueba Todo**: Haz preguntas tú mismo regularmente
5. **Documenta Cambios**: Lleva registro de qué funciona

---

## 🆘 ERRORES COMUNES

### ❌ "El bot responde cosas inventadas"
**Solución:** Baja la TEMPERATURE a 0.2-0.3

### ❌ "No encuentra FAQs obvias"
**Solución:** Baja SIMILARITY_THRESHOLD a 0.5-0.6

### ❌ "Respuestas muy genéricas"
**Solución:** Mejora el system prompt y las FAQs

### ❌ "Muy lento"
**Solución:** Reduce TOP_K_RESULTS y MAX_TOKENS

---

¡Con estas mejoras, tu bot será mucho más inteligente! 🧠✨

**Empieza por el Nivel 1 y ve subiendo gradualmente.** 🚀

