# 🎨 Integración con v0.dev - Guía Completa

Esta guía te ayudará a conectar tu chatbot de v0.dev con el backend de Plani.

---

## 📋 Resumen

Tu chatbot tiene dos partes:
1. **Frontend (v0.dev)**: La interfaz visual que ya creaste
2. **Backend (este proyecto)**: La API que procesa las preguntas con RAG

Necesitas conectarlos para que funcionen juntos.

---

## 🔧 Paso 1: Identificar el Código de Conexión en v0

En tu código de v0, busca donde se hace la llamada al API. Puede verse así:

### Ejemplo 1: Usando `fetch`

```typescript
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userMessage
  })
});

const data = await response.json();
console.log(data.reply); // La respuesta del bot
```

### Ejemplo 2: Usando `axios`

```typescript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/chat', {
  message: userMessage
});

console.log(response.data.reply); // La respuesta del bot
```

### Ejemplo 3: En un componente React

```typescript
const [messages, setMessages] = useState([]);
const [isLoading, setIsLoading] = useState(false);

const sendMessage = async (userMessage: string) => {
  setIsLoading(true);
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    
    setMessages([
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: data.reply }
    ]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🌐 Paso 2: Configurar la URL del Backend

### Para Desarrollo Local

Crea un archivo de configuración o usa una constante:

```typescript
// config.ts o constants.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Luego en tu componente:
import { API_URL } from './config';

const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  // ...
});
```

### Para Producción (Vercel)

Cuando despliegues, necesitarás la URL de producción:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend.vercel.app';
```

---

## 📡 Paso 3: Formato de Request y Response

### Request (Lo que envías)

```typescript
{
  "message": "¿Cuándo son las inscripciones?",
  "sessionId": "optional-session-id",  // Opcional
  "userId": "optional-user-id"          // Opcional
}
```

### Response (Lo que recibes)

```typescript
{
  "reply": "Las inscripciones para el semestre 2025-1 serán del 1 al 15 de marzo...",
  "sources": [
    {
      "id": "uuid-123",
      "question": "¿Cuándo son las inscripciones?",
      "category": "matricula",
      "similarity": 0.95
    }
  ],
  "metadata": {
    "duration": 1234,
    "faqsCount": 2,
    "topSimilarity": 0.95,
    "model": "openai/gpt-4o-mini",
    "tokensUsed": 250
  }
}
```

---

## 💻 Paso 4: Implementación Completa en v0

### Componente de Chat Completo

```typescript
'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Source {
  id: string;
  question: string;
  category: string;
  similarity: number;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: 'session-123', // Opcional: puedes generar un ID único
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Agregar respuesta del bot
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply 
      }]);

      // Guardar fuentes (opcional, para mostrar referencias)
      setSources(data.sources || []);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
                : 'bg-gray-200 text-gray-900 mr-auto max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-gray-200 text-gray-900 p-4 rounded-lg mr-auto max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Fuentes (opcional) */}
      {sources.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold mb-2">Fuentes consultadas:</p>
          {sources.map((source, idx) => (
            <div key={idx} className="text-gray-600">
              • {source.question} ({Math.round(source.similarity * 100)}% relevancia)
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
```

---

## 🔒 Paso 5: Configurar CORS

Para que tu frontend pueda comunicarse con el backend, necesitas configurar CORS.

### En Desarrollo Local

El backend ya está configurado para aceptar requests de `localhost`. No necesitas hacer nada.

### En Producción

1. Despliega tu frontend en Vercel (v0 lo hace automáticamente)
2. Copia la URL del frontend (ej: `https://tu-frontend.vercel.app`)
3. En el backend, actualiza la variable de entorno `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://otro-dominio.com
```

---

## 🧪 Paso 6: Probar la Conexión

### Test 1: Desde el navegador

1. Inicia el backend: `npm start` (puerto 3000)
2. Inicia tu frontend de v0 (probablemente puerto 5173 o 3001)
3. Abre el frontend en el navegador
4. Envía un mensaje: "¿Cuándo son las inscripciones?"
5. Deberías ver la respuesta del bot

### Test 2: Verificar en DevTools

Abre las DevTools del navegador (F12) y ve a la pestaña "Network":

1. Envía un mensaje
2. Busca la request a `/api/chat`
3. Verifica:
   - ✅ Status: 200 OK
   - ✅ Response contiene `reply`, `sources`, `metadata`
   - ✅ No hay errores CORS

### Test 3: Manejo de Errores

Prueba estos escenarios:

1. **Backend apagado**: Deberías ver un mensaje de error
2. **Mensaje vacío**: El botón debe estar deshabilitado
3. **Request lenta**: Debe mostrar indicador de carga

---

## 🚀 Paso 7: Deploy a Producción

### 7.1 Deploy del Backend

```bash
# En el directorio del backend
git add .
git commit -m "Backend listo para producción"
git push origin main

# En Vercel
# 1. Import repositorio
# 2. Configura variables de entorno
# 3. Deploy
```

Tu backend estará en: `https://plani-backend.vercel.app`

### 7.2 Deploy del Frontend (v0)

1. En v0.dev, click **"Publish"**
2. v0 desplegará automáticamente en Vercel
3. Copia la URL: `https://plani-frontend.vercel.app`

### 7.3 Conectar Frontend con Backend

En Vercel del **frontend**, agrega variable de entorno:

```
NEXT_PUBLIC_API_URL=https://plani-backend.vercel.app
```

En Vercel del **backend**, actualiza `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://plani-frontend.vercel.app
```

Redeploy ambos proyectos.

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
```bash
# Verifica que el backend esté corriendo
curl http://localhost:3000/api/health

# Verifica la URL en tu código
console.log('API_URL:', API_URL);
```

### Error: "CORS policy"

**Causa**: El frontend no está en `ALLOWED_ORIGINS`

**Solución**:
```bash
# En .env del backend
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001

# O en producción
ALLOWED_ORIGINS=https://tu-frontend.vercel.app
```

### Error: "Network request failed"

**Causa**: Problema de red o timeout

**Solución**:
- Verifica tu conexión a internet
- Aumenta el timeout del fetch
- Verifica que Supabase esté accesible

### La respuesta tarda mucho

**Causa**: Primera query genera embeddings, búsqueda en DB, llamada a LLM

**Solución**:
- Normal: 2-5 segundos
- Muestra un indicador de carga
- Considera implementar streaming (SSE)

---

## 📊 Monitoreo

### Ver Logs del Backend

```bash
# En desarrollo
npm start
# Los logs aparecen en la consola

# En producción (Vercel)
# Ve a: Vercel Dashboard → Tu proyecto → Functions → View Logs
```

### Ver Requests en Supabase

1. Ve a Supabase Dashboard
2. Logs → Postgres Logs
3. Filtra por tabla `analytics`

---

## 🎯 Checklist de Integración

- [ ] Backend corriendo en `localhost:3000`
- [ ] Frontend corriendo en `localhost:5173` (o similar)
- [ ] URL del backend configurada en el frontend
- [ ] Request a `/api/chat` funciona
- [ ] Response muestra el `reply` correctamente
- [ ] Indicador de carga funciona
- [ ] Manejo de errores implementado
- [ ] CORS configurado para desarrollo
- [ ] Backend desplegado en Vercel
- [ ] Frontend desplegado en Vercel
- [ ] CORS configurado para producción
- [ ] Variables de entorno configuradas en Vercel
- [ ] Tests en producción exitosos

---

## 💡 Tips Adicionales

### 1. Agregar Typing Indicator

```typescript
{isLoading && (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
  </div>
)}
```

### 2. Mostrar Fuentes

```typescript
{sources.length > 0 && (
  <div className="text-xs text-gray-500 mt-2">
    Basado en: {sources.map(s => s.category).join(', ')}
  </div>
)}
```

### 3. Persistir Conversación

```typescript
// Guardar en localStorage
useEffect(() => {
  localStorage.setItem('chat-messages', JSON.stringify(messages));
}, [messages]);

// Cargar al iniciar
useEffect(() => {
  const saved = localStorage.getItem('chat-messages');
  if (saved) setMessages(JSON.parse(saved));
}, []);
```

### 4. Generar Session ID Único

```typescript
const [sessionId] = useState(() => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
});
```

---

## 📚 Recursos

- [Documentación de la API](./API.md)
- [Guía de Deployment](./DEPLOYMENT.md)
- [v0.dev Docs](https://v0.dev/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

¿Tienes problemas? Revisa los logs del backend y del navegador para más detalles.

**¡Listo para conectar tu chatbot! 🚀**

