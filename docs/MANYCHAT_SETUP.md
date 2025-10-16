# 📱 Guía de Configuración: ManyChat Integration

ManyChat es **mucho más fácil** de configurar que Instagram directo. No necesitas Meta Developer Console ni lidiar con permisos complicados.

---

## 🎯 ¿Por Qué ManyChat?

✅ **Más fácil** - No necesitas Meta Developer Console  
✅ **Sin problemas de permisos** - Todo se hace en ManyChat  
✅ **Interfaz visual** - Fácil de usar  
✅ **Soporte para Instagram y Facebook** - Ambos en una plataforma  
✅ **Plan gratuito** - Hasta 1,000 contactos gratis  

---

## 📋 Requisitos Previos

- ✅ Cuenta de Instagram Business (o Facebook Page)
- ✅ Cuenta en ManyChat (gratis)
- ✅ Tu servidor accesible públicamente (HTTPS)

---

## 🚀 Paso 1: Crear Cuenta en ManyChat

### 1.1 Registrarse

1. Ve a [ManyChat.com](https://manychat.com/)
2. Haz clic en **"Get Started Free"**
3. Selecciona **"Instagram"** como plataforma
4. Conecta tu cuenta de Instagram Business
5. Autoriza los permisos

### 1.2 Completar Setup Inicial

ManyChat te guiará por un wizard inicial:
- Conecta tu Instagram
- Configura mensaje de bienvenida (puedes cambiarlo después)
- Completa el tour

---

## 🔑 Paso 2: Obtener API Token

### 2.1 Ir a Settings

1. En ManyChat, haz clic en tu nombre (arriba a la derecha)
2. Selecciona **"Settings"**
3. En el menú lateral, busca **"API"**

### 2.2 Generar Token

1. Haz clic en **"Generate API Token"** o **"API Token"**
2. Copia el token (empieza con números y letras)
3. **Guárdalo en un lugar seguro** - lo necesitarás para el `.env`

---

## ⚙️ Paso 3: Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```bash
# ManyChat Integration
MANYCHAT_ENABLED=true
MANYCHAT_API_TOKEN=tu_api_token_aqui
```

---

## 🌐 Paso 4: Crear Dynamic Block en ManyChat

Los "Dynamic Blocks" son como webhooks - ManyChat llama a tu servidor cuando un usuario envía un mensaje.

### 4.1 Crear un Flow

1. En ManyChat, ve a **"Automation"** → **"Flows"**
2. Haz clic en **"+ New Flow"**
3. Nombre: "Chatbot UNC"

### 4.2 Agregar Trigger

1. En el flow, haz clic en **"+ Add Trigger"**
2. Selecciona **"Keywords"**
3. Configura:
   - **Keywords**: `*` (asterisco = cualquier mensaje)
   - **Match Type**: "Message contains"
4. Guarda

### 4.3 Agregar Dynamic Block

1. Después del trigger, haz clic en **"+"**
2. Selecciona **"External Request"** o **"Dynamic Block"**
3. Configura:

```
Request Type: POST
Request URL: https://tu-dominio.com/api/manychat/webhook

Headers:
Content-Type: application/json

Body (JSON):
{
  "subscriber_id": "{{subscriber_id}}",
  "first_name": "{{first_name}}",
  "last_name": "{{last_name}}",
  "user_input": "{{last_input_text}}"
}
```

4. En **"Response Mapping"**:
   - Selecciona **"Use response as message"**
   - Path: `content.messages[0].text`

5. Guarda el Dynamic Block

### 4.4 Publicar el Flow

1. Haz clic en **"Publish"** (arriba a la derecha)
2. Confirma la publicación

---

## 🧪 Paso 5: Probar la Integración

### 5.1 Iniciar el Servidor

```bash
# Asegúrate de que las variables de entorno estén configuradas
npm start
```

### 5.2 Verificar Estado

```bash
# Verificar que ManyChat esté configurado
curl http://localhost:3000/api/manychat/status

# Deberías ver:
# {
#   "status": "ok",
#   "integration": "manychat",
#   "configured": true
# }
```

### 5.3 Test Local (Opcional)

Antes de probar con ManyChat real, puedes hacer un test local:

```bash
curl -X POST http://localhost:3000/api/manychat/test \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_id": "test123",
    "first_name": "Juan",
    "user_input": "¿Cuándo son las inscripciones?"
  }'
```

### 5.4 Enviar Mensaje de Prueba

1. Abre Instagram en tu teléfono
2. Busca tu cuenta de Instagram Business
3. Envía un mensaje directo: "Hola"
4. El bot debería responder automáticamente

---

## 📊 Paso 6: Ver Analytics

### En ManyChat

1. Ve a **"Analytics"** en el menú principal
2. Verás estadísticas de:
   - Mensajes enviados/recibidos
   - Usuarios activos
   - Conversiones

### En tu Base de Datos

```sql
-- Ver estadísticas por plataforma
SELECT * FROM platform_stats;

-- Ver conversaciones de ManyChat
SELECT * FROM platform_conversations
WHERE platform = 'manychat'
ORDER BY last_message_at DESC;
```

---

## 🎨 Paso 7: Personalizar (Opcional)

### Mensaje de Bienvenida

En ManyChat:
1. Ve a **"Automation"** → **"Welcome Message"**
2. Personaliza el mensaje inicial
3. Puedes agregar botones, imágenes, etc.

### Botones Rápidos

Puedes agregar botones en el Dynamic Block para opciones comunes:

```json
{
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "¿En qué puedo ayudarte?",
        "buttons": [
          {
            "type": "url",
            "caption": "Ver carreras",
            "url": "https://unc.edu/carreras"
          },
          {
            "type": "url",
            "caption": "Inscripciones",
            "url": "https://unc.edu/inscripciones"
          }
        ]
      }
    ]
  }
}
```

---

## 🔧 Troubleshooting

### El bot no responde

**Problema**: Envías mensaje pero no hay respuesta

**Soluciones**:
1. Verifica que el flow esté **publicado** en ManyChat
2. Verifica que el trigger sea `*` (cualquier mensaje)
3. Revisa logs del servidor: `tail -f logs/combined.log`
4. Verifica que la URL del Dynamic Block sea correcta
5. Asegúrate de que tu servidor esté accesible públicamente

### Error en Dynamic Block

**Problema**: ManyChat muestra error en el Dynamic Block

**Soluciones**:
1. Verifica que la URL sea HTTPS (no HTTP)
2. Verifica que el servidor esté corriendo
3. Prueba la URL manualmente con curl
4. Revisa que el formato del Body sea JSON válido

### Token inválido

**Problema**: Error "Invalid API token"

**Solución**: Regenera el token en ManyChat Settings → API

---

## 💡 Ventajas vs Instagram Directo

| Aspecto | Instagram Directo | ManyChat |
|---------|-------------------|----------|
| **Setup** | Complejo (Meta Developer Console) | Fácil (interfaz visual) |
| **Permisos** | Múltiples permisos complicados | Un solo token |
| **Problemas de cuenta** | Común | Raro |
| **Interfaz** | Código/API | Visual + API |
| **Costo** | Gratis | Gratis hasta 1,000 contactos |
| **Soporte** | Documentación técnica | Soporte + comunidad |

---

## 📈 Límites del Plan Gratuito

ManyChat Plan Gratuito:
- ✅ Hasta **1,000 contactos**
- ✅ Mensajes **ilimitados**
- ✅ **1 Instagram** + **1 Facebook Page**
- ✅ Flows ilimitados
- ✅ Dynamic Blocks ilimitados

Si necesitas más:
- **Pro Plan**: $15/mes - 500 contactos adicionales
- **Pro Plan**: Escala según contactos

---

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Personaliza** el mensaje de bienvenida en ManyChat
2. **Agrega botones** para opciones comunes
3. **Monitorea analytics** en ManyChat y tu BD
4. **Optimiza** respuestas basándote en preguntas frecuentes
5. **Escala** si necesitas más de 1,000 contactos

---

## 🆘 Soporte

- **ManyChat Docs**: https://manychat.github.io/dynamic_block_docs/
- **ManyChat Support**: https://help.manychat.com/
- **Comunidad**: https://www.facebook.com/groups/manychat/

---

## ✅ Checklist de Configuración

- [ ] Cuenta de ManyChat creada
- [ ] Instagram conectado a ManyChat
- [ ] API Token obtenido
- [ ] Variables de entorno configuradas en `.env`
- [ ] Servidor iniciado y accesible públicamente
- [ ] Flow creado en ManyChat
- [ ] Dynamic Block configurado con tu URL
- [ ] Flow publicado
- [ ] Mensaje de prueba enviado y respondido
- [ ] Logs verificados sin errores
- [ ] Analytics funcionando

---

**¡Felicidades! 🎉 Tu chatbot ahora funciona con ManyChat en Instagram.**

**Mucho más fácil que Instagram directo, ¿verdad?** 😊
