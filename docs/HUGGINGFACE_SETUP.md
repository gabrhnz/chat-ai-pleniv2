# 🤗 Configurar Hugging Face API Key (GRATIS)

Para que los embeddings funcionen en producción (Vercel), necesitas una API key de Hugging Face.

## 📝 PASOS

### 1. Crear cuenta en Hugging Face (GRATIS)
- Ve a: https://huggingface.co/join
- Regístrate con tu email

### 2. Crear API Token
- Ve a: https://huggingface.co/settings/tokens
- Haz clic en "New token"
- Nombre: `plani-unc-bot`
- Tipo: **Read** (solo lectura es suficiente)
- Copia el token (empieza con `hf_...`)

### 3. Agregar a Vercel
- Ve a: https://vercel.com/portfolios-projects-268c19b4/plani-unc-bot/settings/environment-variables
- Agrega nueva variable:
  - **Name**: `HUGGINGFACE_API_KEY`
  - **Value**: `hf_tu_token_aqui`
  - **Environment**: Production

### 4. Redesplegar
```bash
vercel --prod --yes
```

---

## ✅ LISTO

Ahora el chatbot funcionará en producción usando Hugging Face para generar embeddings (100% GRATIS).

---

## 💡 NOTA

- La API key de Hugging Face es **GRATUITA** y sin límites para modelos públicos
- No necesitas tarjeta de crédito
- Es completamente segura (solo lectura)

