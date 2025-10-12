# 📚 API Reference

Documentación detallada de todos los endpoints de la API del Chatbot.

## Base URL

```
http://localhost:3000
```

En producción, reemplaza con tu dominio.

---

## Endpoints

### 1. Root Endpoint

Información básica de la API.

```http
GET /
```

#### Response

```json
{
  "message": "Chatbot AI API - Backend Service",
  "version": "1.0.0",
  "status": "operational",
  "documentation": "/api/docs",
  "endpoints": {
    "chat": "POST /api/chat",
    "health": "GET /api/health"
  }
}
```

---

### 2. Chat Endpoint

Procesa mensajes y retorna respuestas del chatbot AI.

```http
POST /api/chat
```

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body

```json
{
  "message": "string",
  "context": [
    {
      "role": "user|assistant|system",
      "content": "string"
    }
  ],
  "sessionId": "string",
  "userId": "string"
}
```

#### Parameters

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| message | string | ✅ Yes | User message | 1-4000 characters |
| context | array | ❌ No | Conversation history | Max 10 messages recommended |
| context[].role | string | If context | Message role | 'user', 'assistant', or 'system' |
| context[].content | string | If context | Message content | Any string |
| sessionId | string | ❌ No | Session identifier | 1-100 characters |
| userId | string | ❌ No | User identifier | 1-100 characters |

#### Success Response (200 OK)

```json
{
  "reply": "This is the chatbot response",
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 15,
    "total_tokens": 40
  },
  "metadata": {
    "model": "gpt-3.5-turbo",
    "finishReason": "stop",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

##### 400 Bad Request - Validation Error

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "message",
      "message": "Message is required",
      "value": ""
    }
  ]
}
```

##### 429 Too Many Requests - Rate Limit

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

##### 502 Bad Gateway - OpenAI Error

```json
{
  "error": "Error communicating with OpenAI service",
  "details": {
    "type": "rate_limit_exceeded",
    "originalMessage": "Rate limit exceeded"
  }
}
```

##### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

#### Examples

##### Simple Message

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?"
  }'
```

##### With Context

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you explain more?",
    "context": [
      {
        "role": "user",
        "content": "What is AI?"
      },
      {
        "role": "assistant",
        "content": "AI is the simulation of human intelligence..."
      }
    ]
  }'
```

##### With Session and User IDs

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionId": "session-abc123",
    "userId": "user-xyz789"
  }'
```

---

### 3. Health Check Endpoint

Verifica el estado del servicio y conectividad con OpenAI.

```http
GET /api/health
```

#### Success Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "openai": "connected"
  },
  "uptime": 3600.5,
  "responseTime": "50ms"
}
```

#### Degraded Response (503 Service Unavailable)

```json
{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "openai": "disconnected"
  },
  "uptime": 3600.5,
  "responseTime": "2000ms"
}
```

#### Example

```bash
curl http://localhost:3000/api/health
```

---

## Rate Limiting

La API implementa rate limiting por dirección IP para prevenir abuso.

### Límites Predeterminados

- **Endpoint**: `/api/chat`
- **Ventana**: 15 minutos (900,000 ms)
- **Máximo**: 100 requests por ventana

### Headers de Rate Limit

Cada respuesta incluye headers informativos:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1673784600
```

### Cuando se Excede el Límite

**Status Code**: 429 Too Many Requests

**Response**:
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

**Retry After**: Número de segundos hasta que se resetee el límite.

---

## Error Handling

Todos los errores retornan JSON con la siguiente estructura:

```json
{
  "error": "Error message description",
  "details": {} // Optional, provides additional context
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Validation error, malformed request |
| 404 | Not Found | Endpoint doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 502 | Bad Gateway | Error communicating with OpenAI |
| 503 | Service Unavailable | Service degraded or down |

---

## Data Types

### Message Object

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

### Usage Object

```typescript
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

### Metadata Object

```typescript
interface Metadata {
  model: string;
  finishReason: string;
  timestamp: string; // ISO 8601 format
}
```

---

## Best Practices

### 1. Context Management

Para mantener conversaciones coherentes:

```javascript
let conversationContext = [];

async function chat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context: conversationContext
    })
  });
  
  const data = await response.json();
  
  // Agregar al contexto
  conversationContext.push(
    { role: 'user', content: message },
    { role: 'assistant', content: data.reply }
  );
  
  // Limitar contexto a últimos 10 mensajes
  if (conversationContext.length > 10) {
    conversationContext = conversationContext.slice(-10);
  }
  
  return data;
}
```

### 2. Error Handling

Siempre manejar errores apropiadamente:

```javascript
async function chat(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
      }
      
      throw new Error(error.error);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Chat error:', error.message);
    throw error;
  }
}
```

### 3. Token Management

Monitorear uso de tokens:

```javascript
let totalTokensUsed = 0;

async function chat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  totalTokensUsed += data.usage.total_tokens;
  
  console.log('Tokens in this request:', data.usage.total_tokens);
  console.log('Total tokens used:', totalTokensUsed);
  
  return data;
}
```

### 4. Timeout Handling

Implementar timeouts para requests largos:

```javascript
async function chatWithTimeout(message, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal
    });
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## SDKs y Wrappers

### JavaScript/TypeScript

```typescript
// chatbot-client.ts
class ChatbotClient {
  private baseUrl: string;
  private context: Array<{role: string, content: string}> = [];
  
  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }
  
  async chat(message: string) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: this.context
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    this.context.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.reply }
    );
    
    return data;
  }
  
  clearContext() {
    this.context = [];
  }
}

// Uso
const bot = new ChatbotClient('https://api.tudominio.com');
const response = await bot.chat('Hello!');
console.log(response.reply);
```

### Python

```python
# chatbot_client.py
import requests
from typing import List, Dict, Optional

class ChatbotClient:
    def __init__(self, base_url: str = 'http://localhost:3000'):
        self.base_url = base_url
        self.context: List[Dict[str, str]] = []
    
    def chat(self, message: str) -> Dict:
        response = requests.post(
            f'{self.base_url}/api/chat',
            json={
                'message': message,
                'context': self.context
            }
        )
        response.raise_for_status()
        
        data = response.json()
        
        self.context.append({'role': 'user', 'content': message})
        self.context.append({'role': 'assistant', 'content': data['reply']})
        
        return data
    
    def clear_context(self):
        self.context = []

# Uso
bot = ChatbotClient('https://api.tudominio.com')
response = bot.chat('Hello!')
print(response['reply'])
```

---

## Testing

### Ejemplo con Postman

1. Crear nueva request
2. Method: POST
3. URL: `http://localhost:3000/api/chat`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "message": "Test message"
}
```

### Ejemplo con HTTPie

```bash
http POST localhost:3000/api/chat message="Test message"
```

---

## Versionado

Esta API sigue versionado semántico (SemVer):

- **Versión Actual**: 1.0.0
- **Endpoint**: `/api/...`

Futuras versiones podrían incluir:
- `/api/v2/chat`
- `/api/v3/chat`

---

## Soporte

¿Preguntas o problemas con la API?

- 📖 Consulta el [README.md](README.md)
- 🐛 Reporta bugs en [GitHub Issues](https://github.com/tu-repo/issues)
- 💬 Discusiones en [GitHub Discussions](https://github.com/tu-repo/discussions)

---

**Última actualización**: Enero 2024

