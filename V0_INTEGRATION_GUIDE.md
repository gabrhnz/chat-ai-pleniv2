# 🎨 Guía de Integración con v0.dev

Esta guía te muestra cómo diseñar tu frontend en v0.dev e integrarlo con tu backend.

## 📋 Plan de Acción Recomendado

### FASE 1: Deploy del Backend ✅ (30 minutos)

**¿Por qué primero?**
- Tendrás una URL pública para conectar
- Podrás probar en v0 con datos reales
- CORS ya configurado para producción

#### Pasos Rápidos:

1. **Subir a GitHub** (si no lo has hecho)
```bash
cd /Users/gabriel/Plani/Plani
git init
git add .
git commit -m "Initial commit: Chatbot API backend"
git branch -M main
git remote add origin https://github.com/tu-usuario/chatbot-api.git
git push -u origin main
```

2. **Deploy en Vercel**
   - Ve a: https://vercel.com/new
   - Importa tu repo de GitHub
   - Configura variables de entorno:
     ```
     OPENAI_API_KEY = sk-or-v1-tu-key-de-openrouter
     USE_OPENROUTER = true
     OPENROUTER_BASE_URL = https://openrouter.ai/api/v1
     OPENAI_MODEL = openai/gpt-4o-mini
     NODE_ENV = production
     ALLOWED_ORIGINS = https://tu-app.vercel.app,https://v0.dev
     ```
   - Deploy!

3. **Verificar**
```bash
# Reemplaza con tu URL de Vercel
curl https://tu-chatbot-api.vercel.app/api/health
```

---

### FASE 2: Diseño en v0.dev 🎨 (1-2 horas)

#### Paso 1: Ir a v0.dev

1. Ve a: https://v0.dev
2. Login con tu cuenta de Vercel

#### Paso 2: Prompt para v0

Usa este prompt en v0 para generar tu chatbot:

```
Crea un chatbot moderno y elegante con las siguientes características:

DISEÑO:
- Interfaz limpia estilo ChatGPT
- Dark mode por defecto con toggle
- Mensajes del usuario a la derecha (azul)
- Mensajes del bot a la izquierda (gris)
- Input con botón de enviar
- Indicador de "escribiendo..." mientras espera respuesta
- Scroll automático a último mensaje
- Responsive (mobile-first)

COMPONENTES:
- Header con título "AI Chatbot" y botón de dark mode
- Área de mensajes con scroll
- Input box fijo en la parte inferior
- Avatar para usuario y bot
- Timestamp en cada mensaje
- Botón para limpiar conversación

TECNOLOGÍA:
- React con TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide icons

FUNCIONALIDAD:
- Enviar mensaje con Enter
- Mantener historial de conversación
- Loading state mientras espera respuesta
- Error handling visual
- Clear chat button
```

#### Paso 3: Ajustar el Diseño

v0 generará el código. Puedes pedirle ajustes:
- "Hazlo más moderno"
- "Agrega animaciones sutiles"
- "Cambia los colores a [tu paleta]"
- "Agrega un sidebar para historial"

#### Paso 4: Exportar el Código

1. Click en "Code" en v0
2. Descarga el proyecto
3. O copia el código directamente

---

### FASE 3: Conectar Frontend con Backend 🔌 (15 minutos)

#### En el código de v0, busca donde hace el fetch y reemplázalo:

**ANTES (código generado por v0):**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
});
```

**DESPUÉS (apuntando a tu backend en Vercel):**
```typescript
const API_URL = 'https://tu-chatbot-api.vercel.app';

const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    message: userMessage,
    context: conversationHistory 
  })
});

const data = await response.json();
const botReply = data.reply;
```

#### Ejemplo Completo de Integración:

```typescript
'use client'

import { useState } from 'react'

const API_URL = 'https://tu-chatbot-api.vercel.app'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Preparar contexto (últimos 10 mensajes)
      const context = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: context
        })
      })

      if (!response.ok) {
        throw new Error('Error al comunicarse con el servidor')
      }

      const data = await response.json()

      const botMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      // Mostrar error al usuario
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    // Tu UI aquí
    <div>
      {/* Código del diseño de v0 */}
    </div>
  )
}
```

---

### FASE 4: Deploy del Frontend 🚀 (10 minutos)

#### Opción A: Deploy en Vercel desde v0

1. En v0, click en "Publish"
2. v0 deployará automáticamente a Vercel
3. Tendrás una URL como: `https://tu-chatbot.vercel.app`

#### Opción B: Deploy Manual

```bash
# Desde la carpeta del frontend
vercel

# O si quieres configurarlo
vercel --prod
```

#### Configurar Variables de Entorno del Frontend

En el proyecto del frontend en Vercel:
```
NEXT_PUBLIC_API_URL = https://tu-chatbot-api.vercel.app
```

Luego en tu código:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
```

---

## 🎯 Flujo Final

```
Usuario → Frontend (v0/Vercel)
           ↓
      tu-chatbot.vercel.app
           ↓
       fetch /api/chat
           ↓
      Backend (Vercel)
           ↓
  tu-chatbot-api.vercel.app
           ↓
       OpenRouter
           ↓
       GPT-4o-mini
           ↓
      ← Respuesta ←
```

---

## 💡 Tips y Mejores Prácticas

### 1. CORS
Tu backend ya tiene CORS configurado. Solo asegúrate de agregar tu dominio de frontend:
```env
ALLOWED_ORIGINS=https://tu-chatbot.vercel.app,https://v0.dev
```

### 2. Loading States
```typescript
{loading && (
  <div className="flex items-center gap-2">
    <Loader2 className="animate-spin" />
    <span>Pensando...</span>
  </div>
)}
```

### 3. Error Handling
```typescript
try {
  const response = await fetch(...)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error desconocido')
  }
} catch (error) {
  // Mostrar error al usuario
  toast.error(error.message)
}
```

### 4. Persistencia (opcional)
```typescript
// Guardar en localStorage
useEffect(() => {
  localStorage.setItem('chat-history', JSON.stringify(messages))
}, [messages])

// Cargar al iniciar
useEffect(() => {
  const saved = localStorage.getItem('chat-history')
  if (saved) {
    setMessages(JSON.parse(saved))
  }
}, [])
```

### 5. Markdown Support (opcional)
```bash
npm install react-markdown
```

```typescript
import ReactMarkdown from 'react-markdown'

<ReactMarkdown>{message.content}</ReactMarkdown>
```

---

## 🎨 Prompts Alternativos para v0

### Opción 1: Estilo Minimalista
```
Crea un chatbot minimalista y elegante:
- Fondo blanco con acentos en negro
- Tipografía Geist
- Sin avatares
- Mensajes como burbujas simples
- Animaciones sutiles
```

### Opción 2: Estilo Moderno/Glassmorphism
```
Crea un chatbot con estilo glassmorphism:
- Fondo con gradiente
- Mensajes con efecto glass (backdrop-blur)
- Colores vibrantes
- Animaciones suaves
- Icons de Lucide
```

### Opción 3: Estilo Dashboard
```
Crea un chatbot tipo dashboard:
- Sidebar con historial de chats
- Área principal para conversación actual
- Stats de tokens usados
- Selector de modelo de IA
- Export conversation button
```

---

## 📱 Features Adicionales (Futuro)

Una vez que tengas lo básico funcionando, puedes agregar:

### Nivel 1 (Fácil)
- [ ] Cambiar tema (light/dark)
- [ ] Copy mensaje del bot
- [ ] Clear chat
- [ ] Scroll automático

### Nivel 2 (Intermedio)
- [ ] Historial de chats en sidebar
- [ ] Búsqueda en conversaciones
- [ ] Exportar chat (PDF/TXT)
- [ ] Shortcuts de teclado

### Nivel 3 (Avanzado)
- [ ] Voice input
- [ ] Streaming de respuestas
- [ ] Markdown rendering
- [ ] Code syntax highlighting
- [ ] Múltiples sesiones
- [ ] Autenticación de usuarios

---

## 🐛 Troubleshooting

### Error: CORS
**Solución**: Agrega tu dominio frontend a `ALLOWED_ORIGINS` en el backend

### Error: Network request failed
**Solución**: Verifica que la URL del API sea correcta

### Respuestas lentas
**Solución**: Normal con OpenRouter, considera agregar loading skeleton

### No mantiene contexto
**Solución**: Asegúrate de enviar el array `context` en cada request

---

## 📚 Recursos

- **v0.dev**: https://v0.dev
- **Vercel Docs**: https://vercel.com/docs
- **Shadcn/ui**: https://ui.shadcn.com
- **Backend API Docs**: Ver `API.md` en este proyecto

---

## ✅ Checklist de Integración

- [ ] Backend deployado en Vercel
- [ ] URL del backend funcionando
- [ ] Variables de entorno configuradas
- [ ] Diseño creado en v0
- [ ] Código de v0 adaptado para tu API
- [ ] Contexto conversacional implementado
- [ ] Error handling agregado
- [ ] Loading states implementados
- [ ] Frontend deployado
- [ ] CORS configurado correctamente
- [ ] Probado en producción

---

**¡Listo para crear tu frontend!** 🎨

Siguiente paso: Deploy tu backend y empieza a diseñar en v0.

