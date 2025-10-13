# 🚀 Guía de Despliegue - Vercel

Despliegue del sistema FAQ Bot RAG en Vercel (backend + frontend).

---

## 📋 Prerrequisitos

- [ ] Código funcionando en local (`npm start`)
- [ ] Supabase configurado y con FAQs con embeddings
- [ ] Cuenta GitHub
- [ ] Cuenta Vercel
- [ ] Frontend generado en v0.dev (opcional)

---

## 🎯 Despliegue del Backend

### Paso 1: Preparar Repositorio

```bash
# Asegúrate de tener .gitignore correcto
cat .gitignore

# Debe incluir:
# .env
# node_modules/
# *.log

# Commit todo
git add .
git commit -m "Sistema RAG listo para deploy"
git push origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import tu repositorio de GitHub
4. Vercel detectará automáticamente el proyecto Node.js

### Paso 3: Configurar Proyecto

**Framework Preset:** `Other` (o déjalo en blanco)

**Build Settings:**
- Build Command: (dejar vacío)
- Output Directory: (dejar vacío)
- Install Command: `npm install`

**Root Directory:** `/` (raíz del proyecto)

### Paso 4: Variables de Entorno

Click en "Environment Variables" y agrega TODAS estas variables:

#### OpenRouter

```
OPENAI_API_KEY=sk-or-v1-tu-key-completa
USE_OPENROUTER=true
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
OPENROUTER_APP_NAME=FAQ-Bot-Universitario
OPENROUTER_SITE_URL=https://tu-dominio.vercel.app
```

#### Supabase

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### RAG Config

```
TOP_K_RESULTS=5
SIMILARITY_THRESHOLD=0.7
MAX_CONTEXT_LENGTH=3000
```

#### Servidor

```
NODE_ENV=production
```

#### Seguridad

```
ADMIN_API_KEY=genera-una-key-aleatoria-segura-32-caracteres
```

⚠️ **IMPORTANTE:**
- Marca "Production", "Preview" y "Development" para cada variable
- `ADMIN_API_KEY` debe ser un string aleatorio fuerte (min 32 caracteres)
- `SUPABASE_SERVICE_ROLE_KEY` es sensible - nunca lo expongas en frontend

### Paso 5: Deploy

1. Click "Deploy"
2. Espera 2-3 minutos
3. Vercel te dará una URL: `https://tu-proyecto.vercel.app`

### Paso 6: Verificar

```bash
# Test health
curl https://tu-proyecto.vercel.app/api/health

# Test chat
curl -X POST https://tu-proyecto.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuándo son las inscripciones?"}'
```

Si funciona, ¡backend deployed! ✅

---

## 🎨 Despliegue del Frontend (v0.dev)

### Opción A: Deploy Directo desde v0

1. En v0.dev, click "Publish" o "Deploy"
2. v0 creará repo en tu GitHub y desplegará en Vercel automáticamente
3. Copia la URL del frontend

### Opción B: Deploy Manual

1. Export código de v0
2. Crea nuevo repo en GitHub
3. Push el código
4. Import en Vercel
5. Deploy

### Configurar URL del Backend en Frontend

En el código del frontend (v0), busca la URL del API:

```typescript
// Cambiar de:
const API_URL = 'http://localhost:3000';

// A:
const API_URL = 'https://tu-backend.vercel.app';
```

O mejor, usa variable de entorno:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

En Vercel del frontend, agrega:
```
NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app
```

---

## 🔗 Conectar Frontend con Backend

### Actualizar CORS en Backend

1. Ve a Vercel dashboard de tu backend
2. Settings → Environment Variables
3. Actualiza `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-dominio-custom.com
```

4. Redeploy el backend (Deployments → ... → Redeploy)

### Verificar Conexión

Desde el frontend deployed, intenta enviar un mensaje. Deberías recibir respuesta del backend.

Si hay error CORS:
1. Verifica que la URL del frontend esté en `ALLOWED_ORIGINS`
2. Verifica que el frontend esté llamando a la URL correcta del backend
3. Revisa logs en Vercel

---

## 🔄 Redeploys Automáticos

Vercel está configurado para redeploy automático en cada push a `main`:

```bash
git add .
git commit -m "Actualización"
git push origin main
# Vercel hace deploy automático en ~2 min
```

---

## 🔧 Troubleshooting

### Error: "SUPABASE_URL is not configured"

**Causa:** Variables de entorno no configuradas

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que TODAS las variables estén configuradas
3. Redeploy

### Error 500 en /api/chat

**Causa:** Problema con Supabase o OpenRouter

**Solución:**
1. Ve a Vercel → Functions → Logs
2. Busca el error específico
3. Verifica credenciales de Supabase y OpenRouter

### Error CORS

**Causa:** Frontend no está en `ALLOWED_ORIGINS`

**Solución:**
```bash
# En Vercel backend, actualiza:
ALLOWED_ORIGINS=https://tu-frontend.vercel.app
# Redeploy
```

### Función tarda mucho / Timeout

**Causa:** Vercel Free tiene timeout de 10s

**Solución:**
1. Optimiza queries de Supabase (crea índices vectoriales)
2. Reduce `TOP_K_RESULTS`
3. Considera Vercel Pro ($20/mes) con timeout de 60s

### Embeddings no se generan en deploy

**Causa:** Los embeddings deben generarse ANTES del deploy

**Solución:**
1. Genera embeddings en local: `npm run init:embeddings`
2. Los embeddings se guardan en Supabase (persisten en deploy)
3. No necesitas regenerarlos en cada deploy

---

## 📊 Monitoreo Post-Deploy

### Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Click "Analytics"
3. Activa Analytics (gratis)
4. Ver métricas de tráfico, performance

### Vercel Logs

1. Deployments → Latest → Functions
2. Ve logs en tiempo real
3. Filtra por errores

### Supabase Logs

1. Ve a Supabase dashboard
2. Logs → Postgres Logs
3. Revisa queries lentas o errores

---

## ⚙️ Optimizaciones

### Vercel Edge Config (opcional)

Para cache de FAQs frecuentes:

```bash
npm install @vercel/edge-config
```

Configura en Vercel Dashboard.

### Caching Headers

Agrega a respuestas de `/api/chat`:

```javascript
res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
```

### Índices Vectoriales

Si tienes >100 FAQs, crea índices en Supabase:

```sql
CREATE INDEX faqs_embedding_idx 
ON faqs 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

---

## 🌐 Dominio Custom

### Agregar Dominio Propio

1. Ve a Vercel → Settings → Domains
2. Add Domain: `chat.tuuniversidad.edu`
3. Configura DNS según instrucciones de Vercel
4. Actualiza `ALLOWED_ORIGINS` en backend
5. Actualiza `OPENROUTER_SITE_URL`

---

## 💰 Costos en Producción

### Vercel

**Hobby Plan (Gratis):**
- 100 GB bandwidth
- Serverless Functions ilimitadas
- 10s timeout por función

**Pro Plan ($20/mes):**
- 1 TB bandwidth
- 60s timeout por función
- Edge Functions
- Analytics avanzado

### Supabase

**Free Plan:**
- 500 MB database
- Unlimited API requests
- 5 GB bandwidth/mes

**Pro Plan ($25/mes):**
- 8 GB database
- 250 GB bandwidth/mes
- Daily backups

### OpenRouter

**Pay-as-you-go:**
- GPT-4o-mini: $0.15 / 1M input tokens
- text-embedding-3-small: $0.02 / 1M tokens
- ~$5-50/mes según uso

---

## 📈 Escalabilidad

### Para 100+ usuarios simultáneos:

1. **Vercel Pro** ($20/mes) - mejor performance
2. **Supabase Pro** ($25/mes) - más DB
3. **Índices vectoriales** - queries más rápidas
4. **Connection pooling** en Supabase
5. **Edge Functions** en Vercel (más rápido)

---

## 🎯 Checklist Pre-Deploy

Backend:
- [ ] Tests locales exitosos
- [ ] Variables de entorno documentadas
- [ ] .env en .gitignore
- [ ] FAQs con embeddings en Supabase
- [ ] Índices vectoriales creados (si >100 FAQs)

Frontend:
- [ ] URL del backend correcta
- [ ] CORS configurado
- [ ] Environment variables configuradas
- [ ] Build exitoso

Post-Deploy:
- [ ] Health check funciona
- [ ] Chat endpoint responde
- [ ] Admin endpoints protegidos
- [ ] Logs sin errores
- [ ] Analytics configurado

---

## 🆘 Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **OpenRouter Docs:** https://openrouter.ai/docs

---

¡Deploy completo! 🎉 Tu FAQ Bot está en producción.
