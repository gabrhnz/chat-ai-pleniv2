# 🌐 Configuración de OpenRouter

OpenRouter es una alternativa a OpenAI que **funciona desde cualquier país**, sin restricciones geográficas.

## ¿Por qué OpenRouter?

✅ **Funciona en países bloqueados** (Cuba, Venezuela, etc.)  
✅ **Sin necesidad de VPN**  
✅ **Acceso a múltiples modelos** (OpenAI, Claude, Gemini, Llama)  
✅ **API compatible con OpenAI** (cambio mínimo)  
✅ **A veces más barato**  

---

## 🚀 Setup Rápido

### 1. Obtener API Key de OpenRouter

1. Ve a: https://openrouter.ai/
2. Sign up / Login
3. Ve a "Keys" → "Create Key"
4. Copia tu API key (empieza con `sk-or-...`)

### 2. Configurar Variables de Entorno

Edita tu archivo `.env`:

```bash
# OpenRouter Configuration
OPENAI_API_KEY=sk-or-tu-key-de-openrouter-aqui
USE_OPENROUTER=true
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Modelo (OpenRouter soporta muchos)
OPENAI_MODEL=openai/gpt-3.5-turbo
# Alternativas:
# OPENAI_MODEL=openai/gpt-4
# OPENAI_MODEL=anthropic/claude-3-sonnet
# OPENAI_MODEL=google/gemini-pro
# OPENAI_MODEL=meta-llama/llama-3-70b

# App info (opcional, para analytics en OpenRouter)
OPENROUTER_APP_NAME=Chatbot-AI-API
OPENROUTER_SITE_URL=http://localhost:8080
```

### 3. Actualizar el Código

El código ya está preparado para soportar OpenRouter. Solo necesitas actualizar `src/config/environment.js`:

---

## 💰 Costos Comparativos

| Modelo | OpenAI Directo | OpenRouter |
|--------|----------------|------------|
| GPT-3.5 Turbo | $0.002/1K tokens | $0.002/1K tokens |
| GPT-4 | $0.03/1K tokens | $0.03/1K tokens |
| Claude 3 Sonnet | N/A | $0.003/1K tokens |
| Gemini Pro | N/A | Gratis (limitado) |
| Llama 3 70B | N/A | $0.0007/1K tokens |

**Créditos iniciales**: OpenRouter suele dar $1-5 gratis para probar.

---

## 🎯 Modelos Disponibles

### OpenAI (via OpenRouter)
- `openai/gpt-3.5-turbo` - Rápido y económico
- `openai/gpt-4` - Más potente
- `openai/gpt-4-turbo` - Balance

### Anthropic Claude
- `anthropic/claude-3-sonnet` - Excelente para conversaciones
- `anthropic/claude-3-opus` - Más avanzado
- `anthropic/claude-3-haiku` - Más económico

### Google
- `google/gemini-pro` - A menudo gratis
- `google/gemini-pro-vision` - Con visión

### Meta
- `meta-llama/llama-3-70b` - Open source, económico
- `meta-llama/llama-3-8b` - Muy económico

### Y muchos más...
Ver lista completa: https://openrouter.ai/models

---

## 🔧 Ejemplos de Uso

### Con GPT-3.5 (igual que OpenAI)
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola!"}'
```

### Con Claude 3
Solo cambia `OPENAI_MODEL=anthropic/claude-3-sonnet` en `.env` y reinicia.

### Con múltiples modelos
Puedes crear diferentes endpoints o permitir que el cliente especifique el modelo.

---

## 📊 Ventajas vs Desventajas

### ✅ Ventajas
- Sin restricciones geográficas
- Acceso a múltiples proveedores
- Failover automático entre modelos
- Mejor para experimentación
- Dashboard con analytics

### ⚠️ Consideraciones
- Latencia ligeramente mayor (proxy)
- Algunos modelos pueden tener menos disponibilidad
- API key diferente

---

## 🚨 Solución de Problemas

### Error: "Insufficient credits"
1. Ve a https://openrouter.ai/credits
2. Agrega créditos ($5 mínimo)

### Error: "Model not found"
Verifica que el nombre del modelo es correcto:
- Correcto: `openai/gpt-3.5-turbo`
- Incorrecto: `gpt-3.5-turbo`

### Error: "Rate limit"
OpenRouter tiene límites por tier:
- Free tier: ~10 req/min
- Paid: Mucho más alto

---

## 🔄 Migración desde OpenAI

### Cambios Necesarios

1. **API Key**: Usar key de OpenRouter (`sk-or-...`)
2. **Base URL**: `https://openrouter.ai/api/v1`
3. **Modelo**: Prefijo con proveedor (`openai/gpt-3.5-turbo`)

### Lo que NO Cambia
- ✅ Formato de requests
- ✅ Formato de responses
- ✅ API compatible
- ✅ SDK de OpenAI funciona

---

## 📝 Notas

- OpenRouter es **completamente legal** y oficial
- Ideal para desarrollo en países con restricciones
- Perfecto para comparar modelos
- Buena opción para producción

---

## 🔗 Links Útiles

- **Dashboard**: https://openrouter.ai/
- **Documentación**: https://openrouter.ai/docs
- **Modelos**: https://openrouter.ai/models
- **Precios**: https://openrouter.ai/models (comparador)
- **Status**: https://status.openrouter.ai/

---

**¿Listo para probarlo?** Ejecuta: `./configure-openrouter.sh`

