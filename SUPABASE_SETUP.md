# 🗄️ Supabase Setup Guide

Guía paso a paso para configurar Supabase con pgvector para el sistema RAG.

---

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Node.js 18+ instalado
- Git y acceso al repositorio

---

## 🚀 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear proyecto nuevo

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Click en "New Project"
3. Configuración:
   - **Name:** `faq-bot-universitario` (o el nombre que prefieras)
   - **Database Password:** Genera una contraseña segura y **guárdala**
   - **Region:** Elige la más cercana (por ejemplo: `South America (São Paulo)`)
   - **Pricing Plan:** Free (suficiente para empezar)
4. Click "Create new project"
5. Espera 2-3 minutos mientras Supabase inicializa el proyecto

### 1.2 Obtener credenciales

Una vez creado el proyecto, ve a **Settings** > **API**:

```bash
# Copia estos valores para tu .env

SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:**
- `SUPABASE_ANON_KEY`: Para operaciones públicas (leer FAQs)
- `SUPABASE_SERVICE_ROLE_KEY`: Para operaciones de admin (bypasses RLS) - **nunca la expongas en frontend**

---

## 🧩 Paso 2: Habilitar Extensión pgvector

### 2.1 Acceder al Editor SQL

1. En tu proyecto Supabase, ve a **SQL Editor** en el menú lateral
2. Click en "New query"

### 2.2 Habilitar pgvector

Ejecuta el siguiente SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

Deberías ver un resultado confirmando que `vector` está instalado.

---

## 🏗️ Paso 3: Ejecutar Migraciones

### 3.1 Ejecutar schema inicial

En el **SQL Editor**, copia y pega el contenido completo de:

```
supabase/migrations/001_initial_schema.sql
```

Esto creará:
- ✅ Tablas: `faqs`, `documents`, `document_chunks`, `chat_sessions`, `analytics`
- ✅ Funciones: `match_faqs`, `match_document_chunks`, `hybrid_search`
- ✅ Índices para búsqueda vectorial y full-text
- ✅ Row Level Security (RLS) policies
- ✅ Triggers para `updated_at`

Click **Run** y verifica que no haya errores.

### 3.2 Verificar tablas creadas

```sql
-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver: `analytics`, `chat_sessions`, `document_chunks`, `documents`, `faqs`

---

## 🌱 Paso 4: Cargar FAQs de Ejemplo

### 4.1 Insertar FAQs seed

En el **SQL Editor**, ejecuta:

```
supabase/seed/sample_faqs.sql
```

Esto insertará ~25 FAQs de ejemplo sobre temas universitarios comunes.

### 4.2 Verificar inserción

```sql
-- Contar FAQs
SELECT COUNT(*) FROM faqs;

-- Ver primeras 5 FAQs
SELECT id, question, category FROM faqs LIMIT 5;

-- Ver categorías
SELECT category, COUNT(*) 
FROM faqs 
GROUP BY category 
ORDER BY COUNT(*) DESC;
```

---

## 🔢 Paso 5: Generar Embeddings para FAQs

Los embeddings se generan desde el backend de Node.js (no desde SQL).

### 5.1 Configurar .env local

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp env.example .env
```

Edita `.env` y agrega las credenciales de Supabase que copiaste en el Paso 1.2:

```bash
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenRouter
OPENAI_API_KEY=sk-or-v1-your-key
USE_OPENROUTER=true
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
EMBEDDING_MODEL=text-embedding-3-small

# Admin
ADMIN_API_KEY=tu-secret-admin-key-change-this
```

### 5.2 Instalar dependencias

```bash
npm install
```

### 5.3 Ejecutar script de embeddings

```bash
node scripts/init-embeddings.js
```

Este script:
1. Lee todas las FAQs sin embedding de Supabase
2. Genera embeddings para cada pregunta usando OpenAI/OpenRouter
3. Actualiza las FAQs con sus embeddings
4. Muestra progreso en tiempo real

**Tiempo estimado:** ~1-2 minutos para 25 FAQs

---

## 📊 Paso 6: Crear Índice Vectorial

⚠️ **IMPORTANTE:** Los índices vectoriales tipo `ivfflat` se deben crear DESPUÉS de tener al menos 100 rows con embeddings. Para desarrollo, puedes saltar este paso inicialmente.

### 6.1 Crear índice (cuando tengas >100 FAQs)

```sql
-- Índice vectorial para FAQs
CREATE INDEX IF NOT EXISTS faqs_embedding_idx 
ON faqs 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Índice vectorial para document chunks
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

**Parámetro `lists`:**
- `lists = 100`: Para 1,000 - 100,000 rows
- `lists = 1000`: Para >100,000 rows
- Regla general: `lists = sqrt(total_rows)`

---

## ✅ Paso 7: Verificar Setup Completo

### 7.1 Probar búsqueda semántica

En el **SQL Editor**:

```sql
-- Test de búsqueda semántica
-- Nota: Necesitas un embedding real aquí, este es solo un ejemplo
SELECT 
  id,
  question,
  category,
  1 - (embedding <=> '[0.1, 0.2, ...]'::vector) as similarity
FROM faqs
WHERE is_active = true
  AND embedding IS NOT NULL
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

Para probar con un embedding real, usa la función RPC:

```sql
-- Requiere un embedding generado desde el backend
-- Esta función se usará desde Node.js, no directamente
```

### 7.2 Probar desde el backend

```bash
# Inicia el servidor
npm start

# En otra terminal, prueba el endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuándo son las inscripciones?"
  }'
```

Deberías recibir una respuesta con:
- ✅ Reply basado en el contexto de FAQs
- ✅ Sources: FAQs relevantes encontradas
- ✅ Metadata: similitud, tokens, etc.

---

## 🛠️ Configuración Adicional (Opcional)

### 8.1 Configurar Realtime (opcional)

Si quieres recibir notificaciones en tiempo real cuando se agregan FAQs:

1. Ve a **Database** > **Replication**
2. Habilita replication para la tabla `faqs`

### 8.2 Configurar Backup Automático

Supabase Free tier incluye backups diarios automáticos (7 días de retención).

Para backups más frecuentes:
1. Ve a **Settings** > **Database**
2. Configura Point-in-Time Recovery (PITR) - requiere plan Pro

### 8.3 Monitorear Uso

Ve a **Settings** > **Usage** para monitorear:
- Database size
- API requests
- Bandwidth
- Storage

---

## 📊 Límites del Plan Free

- **Database:** 500 MB
- **API Requests:** Unlimited (con rate limiting razonable)
- **Bandwidth:** 5 GB/mes
- **Storage:** 1 GB
- **Backup:** 7 días (diario)

Para un FAQ bot universitario pequeño-mediano, esto es más que suficiente.

---

## 🚨 Troubleshooting

### Error: "extension vector does not exist"

```sql
-- Solución
CREATE EXTENSION IF NOT EXISTS vector;
```

### Error: "permission denied for function match_faqs"

Asegúrate de usar `SUPABASE_SERVICE_ROLE_KEY` para operaciones de admin.

### Error: "index row size exceeds maximum"

Los embeddings de 1536 dimensiones son muy grandes para ciertos índices. Solución:

```sql
-- Usar HNSW en lugar de ivfflat (Supabase v2.0+)
CREATE INDEX faqs_embedding_hnsw_idx 
ON faqs 
USING hnsw (embedding vector_cosine_ops);
```

### Error: "could not open extension control file"

pgvector no está disponible. Contacta soporte de Supabase o usa un proyecto nuevo.

### Búsqueda muy lenta

1. Verifica que los índices vectoriales estén creados
2. Aumenta el parámetro `lists` si tienes muchos rows
3. Considera usar HNSW en lugar de ivfflat

---

## 🎯 Checklist Final

Antes de desplegar a producción, verifica:

- [ ] Extensión pgvector habilitada
- [ ] Schema completo ejecutado (todas las tablas creadas)
- [ ] FAQs seed cargadas
- [ ] Embeddings generados para todas las FAQs
- [ ] Índices vectoriales creados (si >100 rows)
- [ ] Variables de entorno configuradas en `.env`
- [ ] API key de admin configurada y segura
- [ ] Backend funciona con `npm start`
- [ ] Endpoint `/api/chat` responde con contexto RAG
- [ ] Endpoint `/api/admin/faqs` protegido con API key

---

## 🔐 Seguridad - Mejores Prácticas

1. **Nunca expongas** `SUPABASE_SERVICE_ROLE_KEY` en el frontend
2. **Usa RLS** (Row Level Security) para todas las tablas públicas
3. **Configura** `ADMIN_API_KEY` con un valor aleatorio fuerte (min 32 caracteres)
4. **Limita** CORS origins en producción
5. **Monitorea** uso de API para detectar abuso
6. **Habilita** rate limiting en Supabase (Settings > API)

---

## 📚 Recursos Adicionales

- [Supabase Docs](https://supabase.com/docs)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Vector Search Best Practices](https://supabase.com/blog/openai-embeddings-postgres-vector)

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en **Supabase Dashboard** > **Logs**
2. Verifica variables de entorno con `node scripts/check-config.js`
3. Contacta soporte de Supabase: [support@supabase.com](mailto:support@supabase.com)
4. Abre un issue en el repositorio

---

**¡Setup completo!** 🎉 Tu sistema RAG está listo para responder preguntas frecuentes con contexto inteligente.

