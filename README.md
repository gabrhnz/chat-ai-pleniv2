# Chatbot AI API - Backend Service

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991)

API RESTful profesional para chatbot con inteligencia artificial, construida con Node.js, Express y OpenAI GPT. Diseñada para ser escalable, segura y fácil de integrar con cualquier frontend o aplicación móvil.

## 🚀 Características

- ✅ **Integración completa con OpenAI** (GPT-3.5/GPT-4)
- ✅ **Manejo de contexto conversacional** para sesiones multi-turno
- ✅ **Rate limiting** para prevenir abuso
- ✅ **Logging avanzado** con Winston
- ✅ **Validación robusta** de requests
- ✅ **Manejo de errores centralizado** con respuestas JSON uniformes
- ✅ **Seguridad** con Helmet y CORS configurables
- ✅ **Tests unitarios** con Jest
- ✅ **Arquitectura modular** y escalable
- ✅ **ES Modules** (Node.js 18+)
- ✅ **Health checks** para monitoreo
- ✅ **Documentación completa**

## 📋 Tabla de Contenidos

- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Arquitectura](#-arquitectura)
- [Seguridad](#-seguridad)
- [Escalabilidad](#-escalabilidad)
- [Troubleshooting](#-troubleshooting)
- [Contribución](#-contribución)

## 🔧 Requisitos

- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior (o yarn 1.22+)
- **Cuenta de OpenAI** con API key activa
- **Sistema operativo**: Linux, macOS, o Windows

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <repository-url>
cd Plani
```

### 2. Instalar dependencias

```bash
npm install
```

O con yarn:

```bash
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-tu-clave-de-openai-aqui
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OpenAI Request Configuration
MAX_TOKENS=500
TEMPERATURE=0.7

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

### 4. Obtener API Key de OpenAI

1. Visita [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** en tu dashboard
4. Crea una nueva API key
5. Copia la key y pégala en tu archivo `.env`

⚠️ **Importante**: Nunca subas tu archivo `.env` a repositorios públicos.

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Default | Requerida |
|----------|-------------|---------|-----------|
| `OPENAI_API_KEY` | Tu API key de OpenAI | - | ✅ Sí |
| `OPENAI_MODEL` | Modelo de GPT a usar | `gpt-3.5-turbo` | ❌ No |
| `PORT` | Puerto del servidor | `3000` | ❌ No |
| `NODE_ENV` | Entorno (development/production) | `development` | ❌ No |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting (ms) | `900000` | ❌ No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests por ventana | `100` | ❌ No |
| `MAX_TOKENS` | Tokens máximos por respuesta | `500` | ❌ No |
| `TEMPERATURE` | Creatividad del modelo (0-2) | `0.7` | ❌ No |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:3000` | ❌ No |
| `LOG_LEVEL` | Nivel de logging | `info` | ❌ No |

### Modelos de OpenAI Soportados

- `gpt-3.5-turbo` (recomendado para desarrollo, más económico)
- `gpt-4` (más potente, más costoso)
- `gpt-4-turbo-preview` (balance entre calidad y costo)

## 🎮 Uso

### Desarrollo

Iniciar el servidor en modo desarrollo (con auto-reload):

```bash
npm run dev
```

### Producción

Iniciar el servidor en modo producción:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado).

## 📡 API Endpoints

### Root Endpoint

```
GET /
```

Retorna información básica de la API.

**Response:**
```json
{
  "message": "Chatbot AI API - Backend Service",
  "version": "1.0.0",
  "status": "operational",
  "endpoints": {
    "chat": "POST /api/chat",
    "health": "GET /api/health"
  }
}
```

---

### Chat Endpoint

```
POST /api/chat
```

Endpoint principal para interactuar con el chatbot.

**Request Body:**
```json
{
  "message": "¿Cuál es la capital de Francia?",
  "context": [
    {
      "role": "user",
      "content": "Hola"
    },
    {
      "role": "assistant",
      "content": "¡Hola! ¿Cómo puedo ayudarte?"
    }
  ],
  "sessionId": "session-123",
  "userId": "user-456"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `message` | string | ✅ Sí | Mensaje del usuario (1-4000 caracteres) |
| `context` | array | ❌ No | Historial de conversación |
| `sessionId` | string | ❌ No | ID de sesión para tracking |
| `userId` | string | ❌ No | ID de usuario para analytics |

**Response 200 (Success):**
```json
{
  "reply": "La capital de Francia es París.",
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

**Response 400 (Validation Error):**
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

**Response 429 (Rate Limit):**
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

**Response 502 (OpenAI Error):**
```json
{
  "error": "Error communicating with OpenAI service",
  "details": {
    "type": "rate_limit_exceeded",
    "originalMessage": "Rate limit exceeded"
  }
}
```

---

### Health Check Endpoint

```
GET /api/health
```

Verifica el estado del servicio y conectividad con OpenAI.

**Response 200 (Healthy):**
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

**Response 503 (Degraded):**
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

## 💡 Ejemplos de Uso

### Usando cURL

#### Mensaje simple:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué es la inteligencia artificial?"
  }'
```

#### Con contexto conversacional:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Y cuáles son sus aplicaciones?",
    "context": [
      {
        "role": "user",
        "content": "¿Qué es la inteligencia artificial?"
      },
      {
        "role": "assistant",
        "content": "La inteligencia artificial es..."
      }
    ]
  }'
```

#### Health check:

```bash
curl http://localhost:3000/api/health
```

---

### Usando JavaScript (fetch)

```javascript
async function sendMessage(message, context = []) {
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
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const data = await response.json();
    console.log('Bot:', data.reply);
    console.log('Tokens usados:', data.usage.total_tokens);
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uso simple
await sendMessage('Hola, ¿cómo estás?');

// Con contexto
await sendMessage('¿Y tú?', [
  { role: 'user', content: 'Hola, ¿cómo estás?' },
  { role: 'assistant', content: 'Estoy bien, gracias.' }
]);
```

---

### Usando Python (requests)

```python
import requests

def send_message(message, context=None):
    url = 'http://localhost:3000/api/chat'
    payload = {
        'message': message,
    }
    
    if context:
        payload['context'] = context
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"Bot: {data['reply']}")
        print(f"Tokens: {data['usage']['total_tokens']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Uso
send_message("¿Cuál es la capital de España?")
```

---

### Usando TypeScript (axios)

```typescript
import axios from 'axios';

interface ChatRequest {
  message: string;
  context?: Array<{ role: string; content: string }>;
  sessionId?: string;
  userId?: string;
}

interface ChatResponse {
  reply: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata: {
    model: string;
    finishReason: string;
    timestamp: string;
  };
}

async function sendMessage(
  message: string,
  context: Array<{ role: string; content: string }> = []
): Promise<ChatResponse | null> {
  try {
    const response = await axios.post<ChatResponse>(
      'http://localhost:3000/api/chat',
      {
        message,
        context,
      }
    );
    
    console.log('Bot:', response.data.reply);
    console.log('Tokens:', response.data.usage.total_tokens);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error:', error.response?.data.error);
    }
    return null;
  }
}

// Uso
await sendMessage('Explícame qué es Node.js');
```

## 🧪 Testing

### Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Estructura de tests

```
tests/
├── chat.test.js       # Tests del endpoint de chat
└── setup.js           # Configuración global de tests
```

### Cobertura de código

Los tests están configurados para mantener un mínimo de 70% de cobertura en:
- Branches
- Functions
- Lines
- Statements

## 🚀 Deployment

### Vercel

1. **Instalar Vercel CLI:**

```bash
npm install -g vercel
```

2. **Crear archivo `vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Deploy:**

```bash
vercel
```

4. **Configurar variables de entorno en Vercel Dashboard:**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega `OPENAI_API_KEY` y otras variables necesarias

---

### Render

1. **Crear `render.yaml`:**

```yaml
services:
  - type: web
    name: chatbot-ai-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENAI_API_KEY
        sync: false
```

2. **Conectar repositorio en Render.com:**
   - Crea cuenta en [render.com](https://render.com)
   - New → Web Service
   - Conecta tu repositorio
   - Render detectará automáticamente `render.yaml`

3. **Configurar variables de entorno:**
   - En el dashboard de Render
   - Environment → Add Environment Variable
   - Agrega `OPENAI_API_KEY`

---

### Railway

1. **Instalar Railway CLI:**

```bash
npm install -g @railway/cli
```

2. **Deploy:**

```bash
railway login
railway init
railway up
```

3. **Configurar variables:**

```bash
railway variables set OPENAI_API_KEY=sk-your-key
railway variables set NODE_ENV=production
```

---

### Heroku

1. **Crear `Procfile`:**

```
web: node src/index.js
```

2. **Deploy:**

```bash
heroku create chatbot-ai-api
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set NODE_ENV=production
git push heroku main
```

---

### Docker

1. **Crear `Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

2. **Crear `.dockerignore`:**

```
node_modules
npm-debug.log
.env
.git
coverage
logs
```

3. **Build y Run:**

```bash
docker build -t chatbot-ai-api .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-your-key \
  -e NODE_ENV=production \
  chatbot-ai-api
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
Plani/
├── src/
│   ├── config/
│   │   └── environment.js      # Configuración centralizada
│   ├── controllers/
│   │   └── chat.controller.js  # Lógica de negocio
│   ├── middleware/
│   │   ├── errorHandler.js     # Manejo de errores
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── validation.js       # Validación de requests
│   ├── routes/
│   │   └── chat.routes.js      # Definición de rutas
│   ├── services/
│   │   └── openai.service.js   # Servicio de OpenAI
│   ├── utils/
│   │   └── logger.js           # Sistema de logging
│   └── index.js                # Punto de entrada
├── tests/
│   ├── chat.test.js            # Tests unitarios
│   └── setup.js                # Setup de tests
├── .gitignore
├── env.example
├── jest.config.js
├── package.json
└── README.md
```

### Flujo de Request

```
Client Request
    ↓
Express App
    ↓
Rate Limiter → (429 si excede límite)
    ↓
Validation → (400 si inválido)
    ↓
Controller
    ↓
OpenAI Service → (502 si error)
    ↓
Response → (200 si éxito)
```

### Principios de Diseño

- **Separation of Concerns**: Cada módulo tiene una responsabilidad única
- **Dependency Injection**: Facilita testing y mocking
- **Error Handling Centralizado**: Respuestas consistentes
- **Configuration Management**: Variables de entorno centralizadas
- **Logging Estructurado**: Facilita debugging y monitoreo
- **Async/Await**: Código limpio y legible

## 🔒 Seguridad

### Medidas Implementadas

1. **Helmet**: Headers de seguridad HTTP
   - XSS Protection
   - Content Security Policy
   - HSTS

2. **CORS**: Control de orígenes permitidos
   - Configurable por ambiente
   - Whitelist de dominios

3. **Rate Limiting**: Prevención de abuso
   - Límites por IP
   - Ventanas de tiempo configurables

4. **Input Validation**: Sanitización de entrada
   - Validación de tipos
   - Límites de longitud
   - Sanitización de caracteres peligrosos

5. **Environment Variables**: Protección de secretos
   - API keys nunca en código
   - .env en .gitignore

6. **Error Messages**: No exponer información sensible
   - Stack traces solo en desarrollo
   - Mensajes genéricos en producción

### Recomendaciones Adicionales

Para producción, considera:

- **HTTPS**: Usar certificados SSL/TLS
- **API Gateway**: Kong, AWS API Gateway
- **Authentication**: JWT tokens, OAuth
- **WAF**: Web Application Firewall
- **Monitoring**: Sentry, New Relic
- **Secrets Management**: AWS Secrets Manager, HashiCorp Vault

## 📈 Escalabilidad

### Preparado para Escalar

El código está diseñado con comentarios TODO para facilitar escalabilidad:

#### 1. **Gestión de Sesiones**

```javascript
// TODO: Implementar gestión de sesiones
// if (sessionId) {
//   const sessionContext = await sessionService.getContext(sessionId);
//   context.push(...sessionContext);
// }
```

**Implementación sugerida**: Redis para caché de sesiones

#### 2. **Rate Limiting Distribuido**

```javascript
// TODO: Para producción escalable, usar Redis store:
// store: new RedisStore({
//   client: redisClient,
//   prefix: 'rl:',
// }),
```

**Implementación sugerida**: Redis con `rate-limit-redis`

#### 3. **Tracking de Uso por Usuario**

```javascript
// TODO: Implementar tracking de uso por usuario
// if (userId) {
//   await usageService.trackRequest(userId);
//   await usageService.checkQuota(userId);
// }
```

**Implementación sugerida**: PostgreSQL o MongoDB para analytics

#### 4. **Historial de Conversaciones**

```javascript
// TODO: Guardar conversación en base de datos
// await conversationService.saveMessage(sessionId, {
//   userMessage: message,
//   botReply: response.reply,
//   timestamp: new Date(),
// });
```

**Implementación sugerida**: MongoDB para documentos conversacionales

#### 5. **Streaming de Respuestas**

```javascript
// TODO: Implementar streaming para respuestas en tiempo real
// stream: true
```

**Implementación sugerida**: Server-Sent Events (SSE) o WebSockets

#### 6. **Internacionalización**

```javascript
// TODO: Para internacionalización futura:
// body('language')
//   .optional()
//   .isIn(['en', 'es', 'fr', 'de'])
```

**Implementación sugerida**: i18next

#### 7. **System Prompts Customizables**

```javascript
// TODO: Externalizar system prompts
```

**Implementación sugerida**: Configuración en base de datos o archivos JSON

### Arquitectura Escalable

Para múltiples instancias:

```
Load Balancer (nginx, AWS ALB)
        ↓
    ┌───┴───┐
    ↓       ↓
 API 1   API 2  (N instancias)
    ↓       ↓
    └───┬───┘
        ↓
  Redis (Cache/Sessions)
        ↓
  PostgreSQL/MongoDB
        ↓
    OpenAI API
```

## 🔍 Troubleshooting

### Problema: "Missing OpenAI key"

**Causa**: Variable `OPENAI_API_KEY` no configurada

**Solución**:
```bash
# Verificar .env existe
cat .env

# Agregar la key
echo "OPENAI_API_KEY=sk-tu-key" >> .env
```

---

### Problema: Rate Limit de OpenAI

**Error**: "OpenAI rate limit exceeded"

**Solución**:
1. Verificar cuota en OpenAI dashboard
2. Ajustar `RATE_LIMIT_MAX_REQUESTS` en `.env`
3. Considerar upgrade de plan de OpenAI

---

### Problema: Puerto ya en uso

**Error**: "EADDRINUSE: address already in use"

**Solución**:
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en .env
PORT=3001
```

---

### Problema: Errores de validación

**Error**: "Validation failed"

**Solución**: Verificar que el request incluya:
- `message` (string, 1-4000 caracteres)
- `context` (array opcional con estructura correcta)

---

### Problema: Tests fallan

**Solución**:
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar variables de entorno para testing
export NODE_ENV=test
export OPENAI_API_KEY=test-key

# Ejecutar tests
npm test
```

## 📊 Monitoring y Logs

### Estructura de Logs

Los logs se organizan en:
- **Console**: Desarrollo (colorizado)
- **Files**: Producción
  - `logs/error.log`: Solo errores
  - `logs/combined.log`: Todos los logs

### Niveles de Log

- `error`: Errores críticos
- `warn`: Advertencias
- `info`: Información general
- `http`: Requests HTTP
- `debug`: Debugging detallado

### Ejemplo de Log

```json
{
  "timestamp": "2024-01-15 10:30:00",
  "level": "info",
  "message": "Chat request received",
  "messageLength": 25,
  "contextLength": 2,
  "sessionId": "session-123",
  "ip": "192.168.1.1"
}
```

## 🤝 Contribución

### Guías para Contribuir

1. Fork el repositorio
2. Crea una branch: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push a la branch: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Estándares de Código

- **ESLint**: Seguir configuración del proyecto
- **Comentarios**: Documentar funciones complejas
- **Tests**: Agregar tests para nuevas funcionalidades
- **Commits**: Mensajes descriptivos en inglés

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-repo/issues)
- **Documentación**: Este README
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

## 🎉 Changelog

### v1.0.0 (2024-01-15)

- ✅ Implementación inicial
- ✅ Integración con OpenAI
- ✅ Rate limiting
- ✅ Validación de requests
- ✅ Tests unitarios
- ✅ Documentación completa

---

**Construido con ❤️ y Node.js**

¿Necesitas ayuda? Abre un issue en GitHub o consulta la documentación de OpenAI.

