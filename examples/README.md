# Examples

Esta carpeta contiene ejemplos de uso de la Chatbot AI API en diferentes lenguajes y escenarios.

## 📁 Contenido

### JavaScript/Node.js

#### `basic-usage.js`

Ejemplos completos en JavaScript que demuestran:
- Mensajes simples
- Conversaciones con contexto
- Clase cliente reutilizable
- Manejo de errores
- Rate limiting
- Modo interactivo

**Ejecutar**:
```bash
node examples/basic-usage.js
```

**Requisitos**:
- Servidor corriendo en `localhost:3000`
- Variable `OPENAI_API_KEY` configurada

---

### Python

#### `python-client.py`

Cliente Python completo con ejemplos de:
- Uso simple
- Conversaciones contextuales
- Manejo de errores
- Health checks
- Modo interactivo

**Instalar dependencias**:
```bash
pip install requests
```

**Ejecutar**:
```bash
python examples/python-client.py
```

---

## 🚀 Casos de Uso

### 1. Integración con Frontend

```javascript
// React/Vue/Angular
import { ChatbotClient } from './chatbot-client';

const bot = new ChatbotClient('https://api.tudominio.com');

async function handleUserMessage(message) {
  const response = await bot.chat(message);
  return response.reply;
}
```

### 2. Bot de Telegram

```python
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
from chatbot_client import ChatbotClient

bot_api = ChatbotClient('https://api.tudominio.com')

def message_handler(update: Update, context):
    user_message = update.message.text
    response = bot_api.chat(user_message)
    update.message.reply_text(response['reply'])

# Setup Telegram bot...
```

### 3. Slack Bot

```javascript
const { App } = require('@slack/bolt');
const { ChatbotClient } = require('./chatbot-client');

const app = new App({ token: process.env.SLACK_BOT_TOKEN });
const bot = new ChatbotClient('https://api.tudominio.com');

app.message(async ({ message, say }) => {
  const response = await bot.chat(message.text);
  await say(response.reply);
});
```

### 4. Discord Bot

```javascript
const { Client, Intents } = require('discord.js');
const { ChatbotClient } = require('./chatbot-client');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const bot = new ChatbotClient('https://api.tudominio.com');

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  const response = await bot.chat(message.content);
  message.reply(response.reply);
});
```

### 5. CLI Interactive

```bash
# Ya incluido en basic-usage.js y python-client.py
node examples/basic-usage.js
# Luego elegir modo interactivo
```

---

## 📝 Templates

### Template de Cliente Genérico

```javascript
class ChatbotAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.context = [];
  }
  
  async send(message) {
    const response = await fetch(`${this.apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: this.context
      })
    });
    
    const data = await response.json();
    
    // Actualizar contexto
    this.context.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.reply }
    );
    
    return data;
  }
  
  clear() {
    this.context = [];
  }
}
```

---

## 🔧 Personalización

### Custom System Prompt

Para personalizar el comportamiento del bot, puedes incluir un mensaje de sistema en el contexto:

```javascript
const context = [
  {
    role: 'system',
    content: 'You are a helpful assistant specialized in programming. Always provide code examples.'
  }
];

const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'How do I sort an array in JavaScript?',
    context: context
  })
});
```

### Diferentes Personalidades

```javascript
// Asistente técnico
const technicalAssistant = {
  role: 'system',
  content: 'You are a senior software engineer. Be concise and technical.'
};

// Tutor educativo
const educationalTutor = {
  role: 'system',
  content: 'You are a patient teacher. Explain concepts simply with examples.'
};

// Asistente creativo
const creativeAssistant = {
  role: 'system',
  content: 'You are a creative writer. Be imaginative and engaging.'
};
```

---

## 🧪 Testing

### Test Básico

```bash
# Health check
curl http://localhost:3000/api/health

# Test simple
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

### Load Testing

```bash
# Instalar ab (Apache Bench)
# macOS: brew install httpd
# Ubuntu: apt-get install apache2-utils

# Test con 100 requests, 10 concurrentes
ab -n 100 -c 10 -p post_data.json -T application/json \
  http://localhost:3000/api/chat
```

---

## 💡 Tips

### 1. Gestión de Contexto

```javascript
// Limitar contexto para evitar exceder límites de tokens
function limitContext(context, maxMessages = 10) {
  return context.slice(-maxMessages);
}
```

### 2. Retry Logic

```javascript
async function chatWithRetry(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await bot.chat(message);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. Streaming (Futuro)

```javascript
// Patrón para cuando se implemente streaming
async function streamChat(message) {
  const response = await fetch('http://localhost:3000/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, stream: true })
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    process.stdout.write(chunk);
  }
}
```

---

## 🤝 Contribuir

¿Tienes un ejemplo útil? ¡Contribuye!

1. Crea tu ejemplo
2. Documenta el uso
3. Abre un Pull Request

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para más detalles.

---

## 📚 Recursos Adicionales

- [API Reference](../API.md)
- [README Principal](../README.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [OpenAI Documentation](https://platform.openai.com/docs)

---

**¿Preguntas?** Abre un issue en GitHub o consulta la documentación completa.

