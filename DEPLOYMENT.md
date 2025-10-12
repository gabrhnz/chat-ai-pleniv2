# 🚀 Guía de Deployment

Esta guía proporciona instrucciones detalladas para desplegar la API del chatbot en diferentes plataformas.

## Tabla de Contenidos

- [Vercel](#vercel)
- [Render](#render)
- [Railway](#railway)
- [Heroku](#heroku)
- [AWS (EC2 + PM2)](#aws-ec2--pm2)
- [DigitalOcean](#digitalocean)
- [Docker + Kubernetes](#docker--kubernetes)
- [Variables de Entorno en Producción](#variables-de-entorno-en-producción)

---

## Vercel

### Paso 1: Preparar el Proyecto

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Paso 2: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 3: Deploy

```bash
# Login
vercel login

# Deploy (seguir prompts)
vercel

# Deploy a producción
vercel --prod
```

### Paso 4: Configurar Variables de Entorno

En el dashboard de Vercel:
1. Ve a tu proyecto
2. Settings → Environment Variables
3. Agrega:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `RATE_LIMIT_WINDOW_MS`
   - `RATE_LIMIT_MAX_REQUESTS`
   - Otras variables según necesites

### Ventajas de Vercel

- ✅ Deploy automático desde Git
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Serverless
- ⚠️ Límite de 10 segundos por request (puede ser limitante)

---

## Render

### Paso 1: Crear `render.yaml`

```yaml
services:
  - type: web
    name: chatbot-ai-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENAI_API_KEY
        sync: false
      - key: OPENAI_MODEL
        value: gpt-3.5-turbo
      - key: PORT
        value: 10000
      - key: MAX_TOKENS
        value: 500
      - key: TEMPERATURE
        value: 0.7
```

### Paso 2: Conectar Repositorio

1. Ve a [render.com](https://render.com)
2. Sign Up o Log In
3. New → Web Service
4. Conecta tu repositorio de GitHub/GitLab
5. Render detectará automáticamente `render.yaml`

### Paso 3: Configurar Variables Secretas

En el dashboard de Render:
1. Environment → Add Environment Variable
2. Agrega `OPENAI_API_KEY` (marcada como secreta)

### Ventajas de Render

- ✅ Free tier generoso
- ✅ Deploy automático
- ✅ Fácil configuración
- ✅ Health checks integrados
- ✅ Logs en tiempo real

---

## Railway

### Paso 1: Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### Paso 2: Inicializar y Deploy

```bash
# Login
railway login

# Inicializar proyecto
railway init

# Deploy
railway up
```

### Paso 3: Configurar Variables

```bash
# Via CLI
railway variables set OPENAI_API_KEY=sk-your-key
railway variables set NODE_ENV=production
railway variables set OPENAI_MODEL=gpt-3.5-turbo

# O via Dashboard
# 1. Ve a railway.app
# 2. Selecciona tu proyecto
# 3. Variables → Add Variable
```

### Paso 4: Obtener URL

```bash
railway domain
```

### Ventajas de Railway

- ✅ Muy fácil de usar
- ✅ Deploy instantáneo
- ✅ Base de datos integradas (PostgreSQL, Redis)
- ✅ $5 crédito gratis mensual

---

## Heroku

### Paso 1: Crear `Procfile`

```
web: node src/index.js
```

### Paso 2: Preparar Heroku

```bash
# Instalar Heroku CLI
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Descargar desde https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

### Paso 3: Crear App y Deploy

```bash
# Crear app
heroku create chatbot-ai-api

# Configurar variables
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set NODE_ENV=production
heroku config:set OPENAI_MODEL=gpt-3.5-turbo

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir app
heroku open
```

### Ventajas de Heroku

- ✅ Plataforma madura
- ✅ Muchos add-ons disponibles
- ✅ Fácil escalabilidad
- ⚠️ Ya no tiene free tier

---

## AWS (EC2 + PM2)

### Paso 1: Lanzar Instancia EC2

1. Ve a AWS Console → EC2
2. Launch Instance
3. Selecciona Ubuntu Server 22.04 LTS
4. Tipo: t2.micro (free tier eligible)
5. Configura Security Group:
   - SSH (22) desde tu IP
   - HTTP (80) desde anywhere
   - HTTPS (443) desde anywhere
   - Custom TCP (3000) desde anywhere

### Paso 2: Conectar y Configurar Servidor

```bash
# Conectar via SSH
ssh -i tu-key.pem ubuntu@tu-ip-publica

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositorio
git clone https://github.com/tu-repo/chatbot-ai-api.git
cd chatbot-ai-api
```

### Paso 3: Configurar Aplicación

```bash
# Instalar dependencias
npm install

# Crear archivo .env
nano .env
# Pega tus variables de entorno
# Ctrl+X, Y, Enter para guardar

# Crear directorio de logs
mkdir -p logs
```

### Paso 4: Iniciar con PM2

```bash
# Iniciar aplicación
pm2 start src/index.js --name chatbot-api

# Configurar PM2 para auto-start
pm2 startup
pm2 save

# Monitoreo
pm2 status
pm2 logs chatbot-api
pm2 monit
```

### Paso 5: Configurar Nginx (Opcional)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Configurar reverse proxy
sudo nano /etc/nginx/sites-available/chatbot-api
```

Contenido del archivo:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/chatbot-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Paso 6: Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Auto-renovación
sudo certbot renew --dry-run
```

### Ventajas de AWS EC2

- ✅ Control total del servidor
- ✅ Altamente escalable
- ✅ Free tier por 12 meses
- ✅ Integración con otros servicios AWS

---

## DigitalOcean

Similar a AWS pero más simple:

### Paso 1: Crear Droplet

1. Ve a [digitalocean.com](https://digitalocean.com)
2. Create → Droplets
3. Selecciona:
   - Ubuntu 22.04
   - Basic plan ($6/mes)
   - Datacenter region cercano a tu audiencia

### Paso 2: One-Click Apps (Opcional)

Selecciona "Node.js on Ubuntu" para tener Node pre-instalado.

### Paso 3: Deploy

Sigue los mismos pasos que AWS EC2 (Paso 2 en adelante).

### Ventajas de DigitalOcean

- ✅ Interfaz más simple que AWS
- ✅ Pricing predecible
- ✅ Excelente documentación
- ✅ One-click backups

---

## Docker + Kubernetes

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Application
COPY . .

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-3.5-turbo
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatbot-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatbot-api
  template:
    metadata:
      labels:
        app: chatbot-api
    spec:
      containers:
      - name: api
        image: tu-registro/chatbot-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: chatbot-api-service
spec:
  selector:
    app: chatbot-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Variables de Entorno en Producción

### Checklist de Variables

Variables esenciales para producción:

- ✅ `OPENAI_API_KEY` (REQUERIDA)
- ✅ `NODE_ENV=production`
- ✅ `PORT` (según plataforma)
- ✅ `OPENAI_MODEL`
- ✅ `RATE_LIMIT_WINDOW_MS`
- ✅ `RATE_LIMIT_MAX_REQUESTS`
- ✅ `MAX_TOKENS`
- ✅ `TEMPERATURE`
- ✅ `ALLOWED_ORIGINS` (CORS)
- ✅ `LOG_LEVEL`

### Gestión Segura de Secretos

#### Opción 1: Servicios de Secrets Management

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Cloud Secret Manager**

#### Opción 2: Variables de Entorno Encriptadas

La mayoría de plataformas (Vercel, Render, Railway) encriptan automáticamente las variables marcadas como secretas.

#### Opción 3: dotenv-vault

```bash
npm install dotenv-vault

# Encriptar .env
npx dotenv-vault push
npx dotenv-vault keys
```

---

## Monitoreo Post-Deploy

### Health Checks

Configura monitoreo automático:

```bash
# Usando curl
*/5 * * * * curl -f https://tu-api.com/api/health || echo "API Down"

# Usando servicios
# - UptimeRobot (gratis)
# - Pingdom
# - StatusCake
```

### Logging en Producción

Servicios recomendados:

- **Sentry**: Error tracking
- **Logtail**: Log aggregation
- **Datadog**: Monitoreo completo
- **New Relic**: APM

### Alertas

Configura alertas para:
- API down (health check falla)
- Rate limit de OpenAI
- Errores 5xx
- Latencia alta

---

## Performance y Optimización

### 1. Habilitar Compresión

```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Caché de Respuestas (Opcional)

Para respuestas idénticas:

```javascript
import apicache from 'apicache';
let cache = apicache.middleware;
app.use('/api/chat', cache('5 minutes'));
```

### 3. Clustering (Multi-Core)

```javascript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  startServer();
}
```

---

## Rollback en Caso de Problemas

### Vercel
```bash
vercel rollback
```

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Docker
```bash
docker tag chatbot-api:previous chatbot-api:latest
docker-compose up -d
```

### Git-based Platforms
```bash
git revert HEAD
git push origin main
```

---

## Costos Estimados

| Plataforma | Free Tier | Paid (básico) | Notas |
|------------|-----------|---------------|-------|
| Vercel | Sí (limitado) | $20/mes | Serverless |
| Render | Sí (limitado) | $7/mes | Siempre activo |
| Railway | $5 crédito | $5+/uso | Pay-as-you-go |
| Heroku | No | $7/mes | Dynos |
| AWS EC2 | 12 meses | $5-10/mes | t2.micro |
| DigitalOcean | No | $6/mes | Droplet |

**Nota**: OpenAI tiene costos adicionales según uso.

---

## Checklist Pre-Deploy

- [ ] Tests pasan (`npm test`)
- [ ] Variables de entorno configuradas
- [ ] OpenAI API key válida
- [ ] CORS configurado para dominio correcto
- [ ] Rate limiting apropiado para producción
- [ ] Logging configurado
- [ ] Health checks funcionando
- [ ] HTTPS habilitado
- [ ] Monitoreo configurado
- [ ] Plan de rollback definido

---

**¿Problemas con el deployment?** Consulta la sección de Troubleshooting en el README principal o abre un issue en GitHub.

