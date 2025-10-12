# 📡 API Documentation - FAQ Bot RAG

Documentación completa de todos los endpoints del sistema.

---

## 🌐 Base URL

- **Local:** `http://localhost:3000`
- **Production:** `https://tu-proyecto.vercel.app`

---

## 🔐 Autenticación

### Endpoints Públicos

No requieren autenticación:
- `GET /`
- `GET /api/health`
- `POST /api/chat`

### Endpoints de Admin

Requieren header de autenticación:
```bash
X-API-Key: tu-admin-api-key
```

O alternativamente:
```bash
Authorization: Bearer tu-admin-api-key
```

---

## 📋 Endpoints

### 1. Health Check

**GET** `/api/health`

Verifica el estado del servicio.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T12:00:00.000Z",
  "services": {
    "openai": "connected"
  },
  "uptime": 12345.67,
  "responseTime": "248ms"
}
```

**Códigos de Estado:**
- `200` - Servicio healthy
- `503` - Servicio degradado

---

### 2. Chat (RAG)

**POST** `/api/chat`

Envía una pregunta y recibe respuesta con contexto de FAQs.

**Request Body:**
```json
{
  "message": "¿Cuándo son las inscripciones?",
  "sessionId": "optional-session-id",
  "userId": "optional-user-id",
  "streaming": false
}
```

**Parameters:**
- `message` (string, required): Pregunta del usuario
- `sessionId` (string, optional): ID de sesión para contexto
- `userId` (string, optional): ID de usuario para analytics
- `streaming` (boolean, optional): Activar streaming SSE (default: false)

**Response (streaming=false):**
```json
{
  "reply": "Las inscripciones para el semestre 2025-1 serán del 1 al 15 de marzo de 2025...",
  "sources": [
    {
      "id": "uuid-123",
      "question": "¿Cuándo son las inscripciones para el próximo semestre?",
      "category": "matricula",
      "similarity": 0.95
    },
    {
      "id": "uuid-456",
      "question": "¿Cuáles son los requisitos para matricularse?",
      "category": "matricula",
      "similarity": 0.82
    }
  ],
  "metadata": {
    "duration": 1234,
    "faqsCount": 2,
    "topSimilarity": 0.95,
    "model": "openai/gpt-4o-mini",
    "tokensUsed": 250,
    "timestamp": "2025-10-12T12:00:00.000Z"
  }
}
```

**Response (streaming=true):**

Server-Sent Events (SSE) stream:

```
data: {"type":"context","sources":[...]}

data: {"type":"chunk","content":"Las inscripciones"}

data: {"type":"chunk","content":" para el semestre"}

data: {"type":"done","metadata":{...}}
```

**Códigos de Estado:**
- `200` - Success
- `400` - Bad request (mensaje faltante o inválido)
- `429` - Rate limit exceeded
- `500` - Server error

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuándo son las inscripciones?"
  }'
```

---

## 👨‍💼 Admin Endpoints

Todos requieren autenticación con API key.

### 3. Listar FAQs

**GET** `/api/admin/faqs`

Lista todas las FAQs con paginación y filtros.

**Query Parameters:**
- `page` (number, default: 1): Página actual
- `limit` (number, default: 20): Items por página
- `category` (string, optional): Filtrar por categoría
- `isActive` (boolean, optional): Filtrar por estado activo
- `search` (string, optional): Búsqueda por texto

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-123",
      "question": "¿Cuándo son las inscripciones?",
      "answer": "Las inscripciones son...",
      "category": "matricula",
      "keywords": ["inscripciones", "matricula", "fechas"],
      "metadata": {},
      "created_at": "2025-10-12T12:00:00.000Z",
      "updated_at": "2025-10-12T12:00:00.000Z",
      "is_active": true,
      "views_count": 42,
      "helpful_count": 15
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Ejemplo:**
```bash
curl -H "X-API-Key: tu-admin-key" \
  "http://localhost:3000/api/admin/faqs?page=1&limit=10&category=matricula"
```

---

### 4. Obtener FAQ

**GET** `/api/admin/faqs/:id`

Obtiene una FAQ específica por ID.

**Response:**
```json
{
  "id": "uuid-123",
  "question": "¿Cuándo son las inscripciones?",
  "answer": "Las inscripciones son del 1 al 15 de marzo...",
  "category": "matricula",
  "keywords": ["inscripciones", "matricula"],
  "metadata": {
    "priority": "high",
    "last_updated": "2025-01-01"
  },
  "embedding": [0.123, 0.456, ...],
  "created_at": "2025-10-12T12:00:00.000Z",
  "updated_at": "2025-10-12T12:00:00.000Z",
  "is_active": true
}
```

**Códigos de Estado:**
- `200` - Success
- `404` - FAQ not found

---

### 5. Crear FAQ

**POST** `/api/admin/faqs`

Crea una nueva FAQ. El embedding se genera automáticamente.

**Request Body:**
```json
{
  "question": "¿Cómo solicito una beca?",
  "answer": "Para solicitar una beca debes: 1) Ingresar al portal...",
  "category": "becas",
  "keywords": ["beca", "ayuda", "financiera", "solicitud"],
  "metadata": {
    "priority": "high",
    "contact_email": "becas@universidad.edu"
  }
}
```

**Validaciones:**
- `question`: requerido, string no vacío
- `answer`: requerido, string no vacío
- `category`: opcional, string
- `keywords`: opcional, array de strings
- `metadata`: opcional, objeto JSON

**Response:**
```json
{
  "id": "uuid-new",
  "question": "¿Cómo solicito una beca?",
  "answer": "Para solicitar una beca debes...",
  "category": "becas",
  "keywords": ["beca", "ayuda", "financiera", "solicitud"],
  "metadata": {...},
  "embedding": [0.123, ...],
  "created_at": "2025-10-12T12:00:00.000Z",
  "updated_at": "2025-10-12T12:00:00.000Z",
  "is_active": true
}
```

**Códigos de Estado:**
- `201` - Created
- `400` - Validation error
- `500` - Server error

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/api/admin/faqs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-key" \
  -d '{
    "question": "¿Cómo solicito una beca?",
    "answer": "Para solicitar una beca debes ir al portal...",
    "category": "becas",
    "keywords": ["beca", "ayuda"]
  }'
```

---

### 6. Actualizar FAQ

**PUT** `/api/admin/faqs/:id`

Actualiza una FAQ existente. Si se cambia la pregunta, el embedding se regenera automáticamente.

**Request Body:**
```json
{
  "question": "¿Cómo solicito una beca? (actualizado)",
  "answer": "Nueva respuesta actualizada...",
  "category": "becas",
  "keywords": ["beca", "ayuda", "solicitud"],
  "metadata": {...},
  "is_active": true
}
```

**Response:** (igual que GET /api/admin/faqs/:id)

**Códigos de Estado:**
- `200` - Updated
- `404` - FAQ not found
- `400` - Validation error

---

### 7. Eliminar FAQ

**DELETE** `/api/admin/faqs/:id`

Elimina o desactiva una FAQ.

**Query Parameters:**
- `hard` (boolean, default: false): Si true, elimina permanentemente. Si false, soft delete (is_active = false)

**Response:**
- Soft delete: devuelve FAQ actualizada con `is_active: false`
- Hard delete: status `204 No Content`

**Ejemplo:**
```bash
# Soft delete (recomendado)
curl -X DELETE \
  -H "X-API-Key: tu-admin-key" \
  http://localhost:3000/api/admin/faqs/uuid-123

# Hard delete (permanente)
curl -X DELETE \
  -H "X-API-Key: tu-admin-key" \
  "http://localhost:3000/api/admin/faqs/uuid-123?hard=true"
```

---

### 8. Bulk Create FAQs

**POST** `/api/admin/faqs/bulk`

Crea múltiples FAQs en una sola petición. Los embeddings se generan para todas.

**Request Body:**
```json
{
  "faqs": [
    {
      "question": "¿Pregunta 1?",
      "answer": "Respuesta 1",
      "category": "categoria1",
      "keywords": ["keyword1"]
    },
    {
      "question": "¿Pregunta 2?",
      "answer": "Respuesta 2",
      "category": "categoria2",
      "keywords": ["keyword2"]
    }
  ]
}
```

**Response:**
```json
{
  "inserted": 2,
  "data": [...]
}
```

**Códigos de Estado:**
- `201` - Created
- `400` - Validation error (debe ser array no vacío)

---

### 9. Regenerar Embeddings

**POST** `/api/admin/embeddings/regenerate`

Regenera embeddings para FAQs específicas o todas.

**Request Body:**
```json
{
  "faqIds": ["uuid-1", "uuid-2"]
}
```

Si `faqIds` no se proporciona o es null, regenera todos los embeddings.

**Response:**
```json
{
  "message": "Embeddings regenerated",
  "success": 10,
  "errors": 0,
  "total": 10
}
```

**Tiempo estimado:** ~1-2 segundos por cada 50 FAQs

**Ejemplo:**
```bash
# Regenerar específicas
curl -X POST http://localhost:3000/api/admin/embeddings/regenerate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-key" \
  -d '{"faqIds": ["uuid-1", "uuid-2"]}'

# Regenerar todas
curl -X POST http://localhost:3000/api/admin/embeddings/regenerate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-key" \
  -d '{}'
```

---

### 10. Obtener Categorías

**GET** `/api/admin/categories`

Lista todas las categorías con conteo de FAQs.

**Response:**
```json
[
  {
    "name": "matricula",
    "count": 15
  },
  {
    "name": "becas",
    "count": 8
  },
  {
    "name": "horarios",
    "count": 12
  }
]
```

---

### 11. Estadísticas

**GET** `/api/admin/stats`

Obtiene estadísticas y analytics del sistema.

**Query Parameters:**
- `timeRange` (string, default: "7d"): Rango de tiempo - "1d", "7d", "30d"

**Response:**
```json
{
  "faqs": {
    "total": 100,
    "categories": 10
  },
  "queries": {
    "total": 1523,
    "timeRange": "7d",
    "avgResponseTimeMs": 1234,
    "avgTopSimilarity": "0.850"
  }
}
```

**Ejemplo:**
```bash
curl -H "X-API-Key: tu-admin-key" \
  "http://localhost:3000/api/admin/stats?timeRange=30d"
```

---

## ⚠️ Códigos de Error

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "message",
      "message": "Message is required"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required",
  "message": "Please provide an API key in Authorization header or X-API-Key header"
}
```

### 403 Forbidden

```json
{
  "error": "Invalid credentials",
  "message": "The provided API key is invalid"
}
```

### 404 Not Found

```json
{
  "error": "Not found",
  "message": "Route GET /api/invalid not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 60 seconds"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Error description",
  "timestamp": "2025-10-12T12:00:00.000Z"
}
```

---

## 🔒 Rate Limiting

### Límites Actuales

- **General:** 100 requests por 15 minutos por IP
- **Chat endpoint:** 20 requests por minuto por IP

Headers de respuesta:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

---

## 📊 Response Headers

Todas las respuestas incluyen:

```
Content-Type: application/json
X-Powered-By: Express
X-Response-Time: 123ms
```

---

## 🧪 Testing con Postman

### Importar Colección

Crea una colección de Postman con estas variables:

```
base_url: http://localhost:3000
admin_api_key: tu-admin-api-key
```

Ejemplos de requests incluidos en el repositorio (próximamente).

---

## 📚 Recursos Adicionales

- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Guía de implementación
- [RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md) - Arquitectura técnica
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup de base de datos

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.
