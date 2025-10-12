# 🚀 Quick Start Guide

Get up and running with the Chatbot AI API in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- OpenAI API key

---

## Step 1: Install Dependencies (1 min)

```bash
cd Plani
npm install
```

---

## Step 2: Configure Environment (1 min)

Create `.env` file:

```bash
cp env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

**Get Your API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or login
3. Navigate to API Keys
4. Create new key
5. Copy and paste into `.env`

---

## Step 3: Start the Server (30 seconds)

```bash
npm start
```

You should see:

```
Server started successfully
API Endpoints available:
  root: http://localhost:3000/
  chat: http://localhost:3000/api/chat
  health: http://localhost:3000/api/health
```

---

## Step 4: Test It! (1 min)

### Option A: Using cURL

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Option B: Using the Example Script

```bash
node examples/basic-usage.js
```

### Option C: Using Browser/Postman

Open your API client and send:

**Method**: POST  
**URL**: `http://localhost:3000/api/chat`  
**Headers**: `Content-Type: application/json`  
**Body**:
```json
{
  "message": "Tell me a joke"
}
```

---

## Step 5: Build Something! (∞)

Now you're ready to integrate with any frontend:

### React Example

```jsx
import { useState } from 'react';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  
  const sendMessage = async () => {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setResponse(data.reply);
  };
  
  return (
    <div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>{response}</p>
    </div>
  );
}
```

### Vue Example

```vue
<template>
  <div>
    <input v-model="message" />
    <button @click="sendMessage">Send</button>
    <p>{{ response }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      response: ''
    }
  },
  methods: {
    async sendMessage() {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: this.message })
      });
      const data = await res.json();
      this.response = data.reply;
    }
  }
}
</script>
```

---

## Common Commands

```bash
# Start server
npm start

# Start in development mode (with auto-reload)
npm run dev

# Run tests
npm test

# Check health
curl http://localhost:3000/api/health
```

---

## What's Next?

- 📖 Read the full [README.md](README.md)
- 📡 Check [API.md](API.md) for all endpoints
- 🚀 Deploy using [DEPLOYMENT.md](DEPLOYMENT.md)
- 🎯 See [examples/](examples/) for more code samples

---

## Troubleshooting

### "Missing OpenAI key" error

Make sure you created `.env` file with valid `OPENAI_API_KEY`.

### Port 3000 already in use

Change the port in `.env`:
```env
PORT=3001
```

### npm install fails

Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Need Help?

- 💬 [GitHub Issues](https://github.com/tu-repo/issues)
- 📖 [Full Documentation](README.md)
- 🔍 [API Reference](API.md)

---

**You're all set! Happy coding! 🎉**

