# 🔐 Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | ✅ Yes            |
| < 2.0   | ❌ No             |

---

## 🛡️ Security Features

Este proyecto implementa las siguientes medidas de seguridad:

### 1. API Key Protection
- ✅ OpenRouter API key en variables de entorno
- ✅ Supabase Service Role Key nunca expuesto en frontend
- ✅ Admin API key requerida para endpoints de administración

### 2. Database Security
- ✅ Row Level Security (RLS) en Supabase
- ✅ Connection pooling
- ✅ Prepared statements (previene SQL injection)

### 3. API Security
- ✅ Rate limiting (100 req/15min general, 20 req/min en chat)
- ✅ Input validation con express-validator
- ✅ CORS configurado restrictivo
- ✅ Headers de seguridad (Helmet.js recomendado)

### 4. Authentication
- ✅ Admin endpoints protegidos con API key
- ✅ Header `X-API-Key` o `Authorization: Bearer`
- ✅ Keys rotables sin downtime

### 5. Logging & Monitoring
- ✅ Logs completos con Winston
- ✅ No se loggean API keys
- ✅ Tracking de IPs en rate limiting

---

## 🚨 Reporting a Vulnerability

Si descubres una vulnerabilidad de seguridad:

### ❌ NO hacer:
- No abras un issue público en GitHub
- No compartas detalles en redes sociales
- No explotes la vulnerabilidad

### ✅ SÍ hacer:

1. **Reporta en privado:**
   - Email: [tu-email-seguridad@universidad.edu]
   - Subject: "SECURITY: [descripción breve]"

2. **Incluye:**
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Versión afectada
   - (Opcional) Propuesta de solución

3. **Tiempo de respuesta:**
   - Confirmaremos recepción en 48 horas
   - Evaluaremos severidad en 7 días
   - Fix y patch en 14-30 días según severidad

---

## 🔑 Best Practices

### Para Desarrolladores

1. **Nunca commitear secrets:**
   ```bash
   # ❌ MAL
   git add .env
   
   # ✅ BIEN
   git add .env.example
   # .env debe estar en .gitignore
   ```

2. **Rotar API keys regularmente:**
   ```bash
   # Cada 90 días o si hay compromiso sospechoso
   # 1. Genera nueva key en OpenRouter/Supabase
   # 2. Actualiza en Vercel
   # 3. Redeploy
   # 4. Revoca key antigua
   ```

3. **Admin API Key segura:**
   ```bash
   # Genera con:
   openssl rand -hex 32
   # o
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Mínimo 32 caracteres
   ```

4. **CORS restrictivo:**
   ```javascript
   // Solo dominios específicos
   ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tudominio.com
   ```

### Para Deployment

1. **Variables de entorno:**
   - Marca todas como "Sensitive" en Vercel
   - No expongas `SUPABASE_SERVICE_ROLE_KEY` en frontend
   - Usa `SUPABASE_ANON_KEY` solo en operaciones públicas

2. **Database:**
   - Habilita RLS en todas las tablas
   - Revisa policies regularmente
   - Backups automáticos activados

3. **Monitoring:**
   - Vercel Analytics activado
   - Logs de Supabase revisados semanalmente
   - Alertas de rate limiting

---

## 🔍 Security Checklist

Antes de desplegar a producción:

- [ ] `.env` en `.gitignore`
- [ ] API keys en variables de entorno de Vercel
- [ ] Admin API key con 32+ caracteres aleatorios
- [ ] CORS configurado con dominios específicos
- [ ] Rate limiting activado
- [ ] RLS habilitado en Supabase
- [ ] Logs configurados (sin incluir secrets)
- [ ] HTTPS en producción (Vercel lo maneja automáticamente)
- [ ] Dependencies actualizadas (`npm audit`)
- [ ] No hay secrets hardcodeados en código

---

## 🛠️ Auditoría de Seguridad

### Revisar Dependencias

```bash
# Check vulnerabilidades
npm audit

# Fix automático
npm audit fix

# Fix forzado (con breaking changes)
npm audit fix --force
```

### Revisar Supabase RLS

```sql
-- En Supabase SQL Editor
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

---

## 📋 Vulnerabilidades Conocidas

### Ninguna reportada actualmente

Última revisión: 2025-10-12

---

## 🏆 Hall of Fame

Si reportas una vulnerabilidad de forma responsable, te reconoceremos aquí (con tu permiso):

- [Pendiente]

---

## 📚 Recursos de Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security](https://vercel.com/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Última actualización:** 2025-10-12

¿Preguntas sobre seguridad? Abre un issue o contacta al equipo.
