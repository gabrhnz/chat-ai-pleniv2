# 🎯 Guía de Implementación Completa - FAQ Bot RAG

**Sistema de Chatbot Inteligente con RAG para Universidad**

Esta guía te llevará paso a paso desde cero hasta tener un chatbot funcionando con IA que responde preguntas frecuentes usando tu propia base de conocimiento.

---

## 📚 Índice

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Arquitectura](#arquitectura)
3. [Setup Rápido (30 minutos)](#setup-rápido)
4. [Configuración Detallada](#configuración-detallada)
5. [Agregar tus Propias FAQs](#agregar-tus-propias-faqs)
6. [Despliegue a Producción](#despliegue-a-producción)
7. [Uso del Panel Admin](#uso-del-panel-admin)
8. [Testing](#testing)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Resumen del Sistema

### ¿Qué hace este sistema?

Responde preguntas de estudiantes **automáticamente** usando:
- 🧠 **RAG (Retrieval-Augmented Generation):** Busca en tu base de datos y responde con IA
- 🔍 **Búsqueda Semántica:** Encuentra respuestas relevantes aunque la pregunta esté redactada diferente
- 📊 **Base de Conocimiento:** Tu propia colección de FAQs universitarias
- 🎯 **Sin Alucinaciones:** Solo responde con información que tú proporcionas

### Stack Tecnológico

- **Backend:** Node.js + Express
- **Vector DB:** Supabase (Postgres + pgvector)
- **LLM:** OpenRouter (GPT-4o-mini) - sin restricciones geográficas
- **Embeddings:** OpenAI text-embedding-3-small
- **Frontend:** v0.dev + Next.js (ya generado)
- **Deploy:** Vercel

---

## 🏗️ Arquitectura

```
Usuario → Chat Frontend (v0/Next.js)
           ↓
         Backend API (Express)
           ↓
      RAG Pipeline:
        1. Genera embedding de la pregunta
        2. Busca FAQs similares (pgvector)
        3. Ensambla contexto
        4. Genera respuesta con LLM
           ↓
         Respuesta al usuario
```

---

## ⚡ Setup Rápido (30 minutos)

### Paso 1: Clonar e Instalar (5 min)

```bash
cd /Users/gabriel/Plani/Plani
npm install
```

### Paso 2: Configurar Supabase (10 min)

Sigue la guía completa en: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

**Resumen:**
1. Crear proyecto en [https://supabase.com](https://supabase.com)
2. Copiar URL y API keys
3. Ejecutar migración SQL (`supabase/migrations/001_initial_schema.sql`)
4. Cargar FAQs seed (`supabase/seed/sample_faqs.sql`)

### Paso 3: Configurar Variables de Entorno (5 min)

```bash
# Copiar template
cp env.example .env

# Editar .env con tus credenciales
nano .env  # o tu editor preferido
```

Variables críticas:
```bash
# OpenRouter
OPENAI_API_KEY=sk-or-v1-tu-key-aqui
USE_OPENROUTER=true

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Admin
ADMIN_API_KEY=genera-un-key-aleatorio-seguro
```

### Paso 4: Generar Embeddings (5 min)

```bash
node scripts/init-embeddings.js
```

Este script procesa todas las FAQs y genera sus embeddings para búsqueda semántica.

### Paso 5: Iniciar Servidor (1 min)

```bash
npm start
```

### Paso 6: Probar (2 min)

```bash
# Test health
curl http://localhost:3000/api/health

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuándo son las inscripciones?"}'
```

**Si ves una respuesta con contexto relevante, ¡funciona!** 🎉

---

## 📖 Configuración Detallada

### Arquitectura de Archivos

```
/Users/gabriel/Plani/Plani/
├── src/
│   ├── config/
│   │   ├── environment.js      # Config general
│   │   └── supabase.js         # Cliente Supabase
│   ├── services/
│   │   ├── embeddings.service.js   # Generación de embeddings
│   │   ├── rag.service.js          # Pipeline RAG completo
│   │   └── openai.service.js       # Cliente OpenAI/OpenRouter
│   ├── controllers/
│   │   ├── chat.controller.js      # Endpoint /api/chat (RAG)
│   │   └── admin.controller.js     # Endpoints /api/admin/*
│   ├── routes/
│   │   ├── chat.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   └── auth.js                 # Auth de admin
│   └── index.js                    # Entry point
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Schema completo
│   └── seed/
│       └── sample_faqs.sql         # 25 FAQs de ejemplo
├── scripts/
│   └── init-embeddings.js          # Generar embeddings
├── .env                            # TUS credenciales (NO subir a git)
├── env.example                     # Template de .env
├── RAG_ARCHITECTURE.md             # Documentación técnica
├── SUPABASE_SETUP.md               # Setup de Supabase
└── IMPLEMENTATION_GUIDE.md         # Esta guía
```

### Variables de Entorno Explicadas

```bash
# OpenRouter (recomendado para evitar restricciones geográficas)
OPENAI_API_KEY=sk-or-v1-...          # Tu key de OpenRouter
USE_OPENROUTER=true                  # Usar OpenRouter en lugar de OpenAI
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini      # Modelo a usar

# Embeddings
EMBEDDING_MODEL=text-embedding-3-small   # Modelo para vectores (1536 dims)

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...              # Para operaciones públicas
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # Para admin (bypasses RLS)

# RAG Tuning
TOP_K_RESULTS=5                       # Número de FAQs a recuperar
SIMILARITY_THRESHOLD=0.7              # Umbral de similitud (0-1)
MAX_CONTEXT_LENGTH=3000               # Max caracteres de contexto

# Seguridad
ADMIN_API_KEY=tu-secret-key           # Para endpoints /api/admin/*
ALLOWED_ORIGINS=https://tu-frontend.vercel.app  # CORS

# Servidor
PORT=3000
NODE_ENV=development
```

---

## ➕ Agregar tus Propias FAQs

### Opción 1: Via API Admin (Recomendado)

```bash
# Agregar una FAQ
curl -X POST http://localhost:3000/api/admin/faqs \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-api-key" \
  -d '{
    "question": "¿Cómo solicito una beca?",
    "answer": "Para solicitar una beca, debes: 1) Ingresar al portal estudiantil, 2) Ir a la sección Bienestar, 3) Llenar el formulario de solicitud...",
    "category": "becas",
    "keywords": ["beca", "ayuda", "financiera", "solicitud"]
  }'
```

El embedding se genera automáticamente.

### Opción 2: Via SQL Directo

```sql
-- Insertar en Supabase SQL Editor
INSERT INTO faqs (question, answer, category, keywords) VALUES
('¿Cómo solicito una beca?', 
 'Para solicitar una beca, debes...',
 'becas',
 ARRAY['beca', 'ayuda', 'financiera']);
```

Luego regenera embeddings:
```bash
node scripts/init-embeddings.js
```

### Opción 3: Bulk Import desde CSV

Crea un archivo `faqs.csv`:
```csv
question,answer,category,keywords
"¿Pregunta 1?","Respuesta 1","categoria1","keyword1,keyword2"
"¿Pregunta 2?","Respuesta 2","categoria2","keyword3,keyword4"
```

Luego usa el endpoint bulk:
```bash
# Primero convierte CSV a JSON, luego:
curl -X POST http://localhost:3000/api/admin/faqs/bulk \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-api-key" \
  -d @faqs.json
```

---

## 🚀 Despliegue a Producción

### Backend (Vercel)

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "Sistema RAG completo"
   git push origin main
   ```

2. **Deploy en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Import el repositorio de GitHub
   - Configura variables de entorno (copiar de `.env`)
   - Deploy

3. **Variables de Entorno en Vercel:**
   - Settings → Environment Variables
   - Agregar TODAS las variables de tu `.env`
   - ⚠️ Asegúrate de marcar "Production"

### Frontend (ya generado en v0)

El frontend ya fue generado con v0. Para desplegarlo:

1. En v0.dev, click "Publish" o "Deploy"
2. v0 lo desplegará automáticamente en Vercel
3. Actualiza `ALLOWED_ORIGINS` en el backend con la URL del frontend

### Configurar CORS

```bash
# En Vercel, actualiza la variable de entorno:
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-dominio.com
```

---

## 👨‍💻 Uso del Panel Admin

### Endpoints Disponibles

Todos requieren header: `X-API-Key: tu-admin-api-key`

#### Listar FAQs
```bash
GET /api/admin/faqs?page=1&limit=20&category=matricula
```

#### Obtener FAQ específica
```bash
GET /api/admin/faqs/:id
```

#### Crear FAQ
```bash
POST /api/admin/faqs
Body: {
  "question": "...",
  "answer": "...",
  "category": "...",
  "keywords": [...]
}
```

#### Actualizar FAQ
```bash
PUT /api/admin/faqs/:id
Body: { "answer": "Nueva respuesta actualizada" }
```

#### Eliminar FAQ (soft delete)
```bash
DELETE /api/admin/faqs/:id
```

#### Bulk Create
```bash
POST /api/admin/faqs/bulk
Body: {
  "faqs": [
    { "question": "...", "answer": "..." },
    ...
  ]
}
```

#### Regenerar Embeddings
```bash
POST /api/admin/embeddings/regenerate
Body: { "faqIds": ["uuid1", "uuid2"] }  # Opcional, si no se envía, regenera todos
```

#### Ver Categorías
```bash
GET /api/admin/categories
```

#### Ver Estadísticas
```bash
GET /api/admin/stats?timeRange=7d
```

---

## 🧪 Testing

### Test Manual

```bash
# 1. Test de health
curl http://localhost:3000/api/health

# 2. Test de chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuáles son los requisitos para matricularse?"
  }'

# 3. Verificar respuesta con sources
# Debería retornar:
# {
#   "reply": "Para matricularte necesitas...",
#   "sources": [
#     {
#       "id": "...",
#       "question": "¿Cuáles son los requisitos para matricularse?",
#       "similarity": 0.95,
#       "category": "matricula"
#     }
#   ],
#   "metadata": { ... }
# }
```

### Test de Admin

```bash
# Listar FAQs
curl -H "X-API-Key: tu-admin-key" \
  http://localhost:3000/api/admin/faqs

# Crear FAQ
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-admin-key" \
  -d '{"question":"Test?","answer":"Respuesta de test","category":"test"}' \
  http://localhost:3000/api/admin/faqs
```

### Test de Búsqueda Semántica

Prueba variaciones de la misma pregunta:
```bash
# Pregunta 1 (exacta)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuándo son las inscripciones?"}'

# Pregunta 2 (variación)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "En qué fecha me puedo inscribir?"}'

# Pregunta 3 (variación)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Cuándo es el periodo de matrícula?"}'
```

Todas deberían retornar la misma FAQ relevante.

---

## 🔧 Solución de Problemas

### Error: "SUPABASE_URL is not configured"

**Solución:** Asegúrate de tener `.env` en la raíz con las variables correctas.

### Error: "Cannot find module @supabase/supabase-js"

**Solución:**
```bash
npm install @supabase/supabase-js tiktoken
```

### Error: "extension vector does not exist"

**Solución:** Habilita pgvector en Supabase:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Respuestas no relevantes

**Causa:** Embeddings no generados o threshold muy alto.

**Solución:**
1. Verifica que FAQs tengan embeddings:
   ```sql
   SELECT id, question, embedding IS NOT NULL as has_embedding 
   FROM faqs LIMIT 10;
   ```
2. Regenera embeddings: `node scripts/init-embeddings.js --force`
3. Baja el threshold: `SIMILARITY_THRESHOLD=0.6` en `.env`

### Búsqueda muy lenta

**Causa:** Sin índice vectorial.

**Solución:** (solo si tienes >100 FAQs)
```sql
CREATE INDEX faqs_embedding_idx 
ON faqs 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

### Error 401 en admin endpoints

**Causa:** Falta API key o es incorrecta.

**Solución:**
```bash
curl -H "X-API-Key: tu-admin-key-correcto" \
  http://localhost:3000/api/admin/faqs
```

---

## 📊 Monitoreo y Analytics

### Ver estadísticas

```bash
curl -H "X-API-Key: tu-admin-key" \
  http://localhost:3000/api/admin/stats?timeRange=7d
```

Retorna:
- Total de FAQs
- Categorías
- Total de queries
- Tiempo promedio de respuesta
- Similitud promedio

### Logs en Supabase

1. Ve a **Supabase Dashboard** → **Logs**
2. Selecciona "Postgres Logs" para queries
3. Revisa errores y performance

### Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Click en "Logs" o "Functions"
3. Filtra por errores o warnings

---

## 🎯 Próximos Pasos

Ahora que tienes el sistema funcionando:

1. **Agrega tus FAQs reales** (reemplaza las de ejemplo)
2. **Despliega a producción** (Vercel)
3. **Integra con WhatsApp** (Twilio/WhatsApp Business API)
4. **Crea panel admin web** (con v0.dev)
5. **Monitorea uso** y ajusta threshold según métricas
6. **Expande** con más documentos y fuentes

---

## 📚 Documentación Adicional

- **[RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md):** Arquitectura técnica detallada
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md):** Setup completo de Supabase
- **[API.md](./API.md):** Documentación de API endpoints
- **[DEPLOYMENT.md](./DEPLOYMENT.md):** Guías de deployment

---

## 🆘 Soporte

Si necesitas ayuda:

1. Revisa esta guía y las otras documentaciones
2. Revisa logs en Supabase y Vercel
3. Verifica variables de entorno: todas deben estar configuradas
4. Abre un issue en el repositorio con:
   - Descripción del problema
   - Logs de error
   - Pasos para reproducir

---

**¡Sistema listo para producción!** 🎉

Tu FAQ bot con IA está completamente funcional y listo para ayudar a tu comunidad universitaria.

