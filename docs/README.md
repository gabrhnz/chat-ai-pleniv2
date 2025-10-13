# 🤖 Chatbot Inteligente UNC - Sistema RAG

Sistema de chatbot con **RAG (Retrieval-Augmented Generation)** y búsqueda semántica para la Universidad Nacional de las Ciencias (UNC). Responde preguntas de estudiantes con información verificada y actualizada.

## 🎯 ¿Qué hace?

Responde automáticamente preguntas de estudiantes buscando en tu base de conocimiento y generando respuestas con IA, **sin alucinaciones**.

- **Búsqueda Semántica:** Encuentra respuestas aunque la pregunta esté redactada diferente
- **Sin Alucinaciones:** Solo responde con información de tu base de datos
- **Admin API:** Gestiona FAQs fácilmente via endpoints REST
- **Analytics:** Track de queries, similarity scores y performance

## ⚡ Quick Start (30 minutos)

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Ejecuta el script interactivo:

```bash
npm run setup:env
```

Te pedirá:
- OpenRouter API Key (obtén en [openrouter.ai](https://openrouter.ai))
- Supabase URL, Anon Key y Service Role Key (obtén en [supabase.com](https://supabase.com))

### 3. Configurar Base de Datos

1. **Habilita extensiones en Supabase**:
   - Ve a Database → Extensions
   - Habilita: `uuid-ossp` y `vector`

2. **Ejecuta el schema SQL**:
   - Ve a SQL Editor en Supabase
   - Copia y pega el contenido de `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

3. **Carga FAQs de ejemplo**:
   ```bash
   npm run setup:supabase
   ```

### 4. Generar Embeddings

```bash
npm run init:embeddings
```

### 5. Verificar Configuración

```bash
npm run verify
```

### 6. Iniciar Servidor

```bash
npm start
```

### 7. Probar

```bash
# Health check
curl http://localhost:3000/api/health

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuándo son las inscripciones?"}'
```

**📖 Guías Detalladas:**
- [INSTRUCCIONES_COMPLETAS.md](./INSTRUCCIONES_COMPLETAS.md) - Guía paso a paso completa
- [QUICKSTART_SETUP.md](./QUICKSTART_SETUP.md) - Setup rápido de 30 minutos
- [V0_INTEGRATION.md](./V0_INTEGRATION.md) - Conectar con frontend de v0.dev
- [DEPLOY_VERCEL_V0.md](./DEPLOY_VERCEL_V0.md) - Deploy en Vercel + v0

## 📊 Stack Tecnológico

- **Backend:** Node.js + Express
- **Vector DB:** Supabase (Postgres + pgvector)
- **LLM:** OpenRouter (GPT-4o-mini)
- **Embeddings:** OpenAI text-embedding-3-small
- **Deploy:** Vercel

## 🏗️ Arquitectura RAG

```
Usuario pregunta
    ↓
1. Genera embedding de la pregunta
    ↓
2. Búsqueda semántica en Supabase (cosine similarity)
    ↓
3. Recupera top 5 FAQs más similares
    ↓
4. Ensambla contexto
    ↓
5. LLM genera respuesta usando SOLO ese contexto
    ↓
Respuesta precisa + fuentes
```

## 🔌 API Endpoints

### Chat (Usuario Final)

```bash
POST /api/chat
Body: {
  "message": "Tu pregunta aquí",
  "sessionId": "opcional",
  "streaming": false
}

Response: {
  "reply": "Respuesta del bot",
  "sources": [
    {
      "id": "uuid",
      "question": "FAQ relevante",
      "category": "matricula",
      "similarity": 0.95
    }
  ],
  "metadata": {
    "duration": 1234,
    "faqsCount": 3,
    "topSimilarity": 0.95
  }
}
```

### Admin (Gestión de FAQs)

Todos requieren header: `X-API-Key: tu-admin-api-key`

```bash
# Listar FAQs
GET /api/admin/faqs?page=1&limit=20&category=matricula

# Crear FAQ
POST /api/admin/faqs
Body: {
  "question": "¿Nueva pregunta?",
  "answer": "Respuesta aquí",
  "category": "categoria",
  "keywords": ["palabra1", "palabra2"]
}

# Actualizar FAQ
PUT /api/admin/faqs/:id

# Eliminar FAQ
DELETE /api/admin/faqs/:id

# Bulk create
POST /api/admin/faqs/bulk

# Regenerar embeddings
POST /api/admin/embeddings/regenerate

# Ver categorías
GET /api/admin/categories

# Ver estadísticas
GET /api/admin/stats?timeRange=7d
```

## 📚 Documentación

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guía completa de implementación
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Setup de base de datos paso a paso
- **[RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md)** - Arquitectura técnica detallada
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue a producción
- **[API.md](./API.md)** - Documentación completa de API
- **[PROYECTO_COMPLETADO.md](./PROYECTO_COMPLETADO.md)** - Resumen ejecutivo

## 🚀 Deploy a Producción

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "Sistema RAG completo"
git push origin main

# 2. Import en vercel.com

# 3. Configura variables de entorno en Vercel

# 4. Deploy automático
```

[Ver guía detallada →](./DEPLOYMENT.md)

## 💰 Costos Estimados

### Plan Gratuito (Suficiente para empezar)

- **Supabase Free:** $0/mes
- **OpenRouter:** ~$5/mes (1,000 queries)
- **Vercel:** $0/mes

**Total: ~$5/mes**

## 🔐 Seguridad

- ✅ API keys en variables de entorno
- ✅ Row Level Security (RLS) en Supabase
- ✅ Admin endpoints protegidos con API key
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Logging completo

## 📊 Features

- ✅ Búsqueda semántica con pgvector
- ✅ Pipeline RAG completo
- ✅ Admin API (CRUD FAQs)
- ✅ Analytics integrado
- ✅ Batch processing de embeddings
- ✅ Streaming responses (SSE)
- ✅ Hybrid search (vector + full-text)
- ✅ Multiple categories
- ✅ Similarity threshold configurable

## 🛠️ Desarrollo

```bash
# Modo desarrollo (hot reload)
npm run dev

# Generar embeddings
npm run init:embeddings

# Regenerar todos los embeddings
npm run init:embeddings:force
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuáles son los requisitos para matricularse?"}'

# Test admin (lista FAQs)
curl -H "X-API-Key: tu-admin-key" \
  http://localhost:3000/api/admin/faqs
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── config/          # Configuración (Supabase, OpenAI)
│   ├── services/        # Lógica de negocio (RAG, embeddings)
│   ├── controllers/     # Controladores de endpoints
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Auth, rate limiting, validation
│   └── utils/           # Logger, helpers
├── supabase/
│   ├── migrations/      # Schema SQL
│   └── seed/            # FAQs de ejemplo
├── scripts/             # Scripts de automatización
└── docs/                # Documentación completa
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE)

## 🆘 Soporte

Si necesitas ayuda:

1. Revisa la [documentación](./IMPLEMENTATION_GUIDE.md)
2. Revisa [troubleshooting](./SUPABASE_SETUP.md#-troubleshooting)
3. Abre un [issue](https://github.com/tu-usuario/tu-repo/issues)

## 🎯 Roadmap

- [ ] Panel admin web (UI con v0.dev)
- [ ] Integración WhatsApp Business API
- [ ] Document chunking para PDFs
- [ ] Multi-tenancy (múltiples universidades)
- [ ] Fine-tuning del modelo
- [ ] Caching con Redis
- [ ] GraphQL API

---

## 👨‍💻 Desarrollado por

**Gabriel Hernández**
- 🌐 Website: [gabrhnz.dev](https://www.gabrhnz.dev/)
- 💼 Portfolio & Contacto

---

**Hecho con ❤️ para la Universidad Nacional de las Ciencias (UNC)**

Sistema desarrollado para mejorar la experiencia de estudiantes mediante IA conversacional.

¿Te fue útil? Dale una ⭐ al repo!
