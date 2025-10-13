# 🚀 GUÍA RÁPIDA - Chatbot UNC

## 📋 COMANDOS ÚTILES

### Agregar FAQs
```bash
# Método interactivo (RECOMENDADO)
npm run add:faq

# Luego generar embeddings
npm run init:embeddings
```

### Servidor Local
```bash
# Iniciar servidor
npm start

# Servidor con auto-reload
npm dev
```

### Verificar Sistema
```bash
npm run verify
```

---

## 📚 AGREGAR FAQs

### Opción 1: Script Interactivo (Fácil)
```bash
npm run add:faq
```

### Opción 2: SQL Directo (Rápido)
1. Ve a: https://igpdjlfkwjkhvbpvltjg.supabase.co
2. SQL Editor
3. Pega:
```sql
INSERT INTO faqs (question, answer, category, keywords) VALUES
('¿Tu pregunta?', 'Tu respuesta detallada', 'categoria', ARRAY['palabra1', 'palabra2']);
```
4. Run
5. Luego: `npm run init:embeddings`

### Opción 3: Admin API (Programático)
```javascript
const response = await fetch('https://plani-unc-hkm0zkdf7-portfolios-projects-268c19b4.vercel.app/api/admin/faqs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Key': 'plani-unc-admin-2025-secret-key'
  },
  body: JSON.stringify({
    question: "¿Tu pregunta?",
    answer: "Tu respuesta",
    category: "categoria",
    keywords: ["palabra1", "palabra2"]
  })
});
```

---

## 🧠 MEJORAR INTELIGENCIA

### Nivel 1: Inmediato (Sin código)
1. **Agregar más FAQs** (30-50 mínimo)
2. **Mejorar respuestas** (más detalladas)
3. **Agregar keywords** (sinónimos, variaciones)

### Nivel 2: Ajustar Parámetros
En Vercel → Settings → Environment Variables:

```bash
# Más flexible (encuentra más FAQs)
SIMILARITY_THRESHOLD=0.6

# Más contexto
TOP_K_RESULTS=10

# Más preciso
TEMPERATURE=0.3

# Respuestas más largas
MAX_TOKENS=800
```

### Nivel 3: Mejorar Prompt
Edita `src/services/rag.service.js` → `systemPrompt`

---

## 🌐 URLs IMPORTANTES

### Backend Producción
```
https://plani-unc-hkm0zkdf7-portfolios-projects-268c19b4.vercel.app
```

### Supabase Dashboard
```
https://igpdjlfkwjkhvbpvltjg.supabase.co
```

### Vercel Dashboard
```
https://vercel.com/portfolios-projects-268c19b4/plani-unc-bot
```

---

## 📡 ENDPOINTS API

### Chat
```bash
POST /api/chat
{
  "message": "¿Qué carreras ofrece la UNC?"
}
```

### Admin - Listar FAQs
```bash
GET /api/admin/faqs
Headers: X-Admin-Key: plani-unc-admin-2025-secret-key
```

### Admin - Crear FAQ
```bash
POST /api/admin/faqs
Headers: X-Admin-Key: plani-unc-admin-2025-secret-key
Body: { question, answer, category, keywords }
```

### Admin - Actualizar FAQ
```bash
PUT /api/admin/faqs/:id
Headers: X-Admin-Key: plani-unc-admin-2025-secret-key
Body: { answer, ... }
```

### Admin - Eliminar FAQ
```bash
DELETE /api/admin/faqs/:id
Headers: X-Admin-Key: plani-unc-admin-2025-secret-key
```

---

## 🔧 MANTENIMIENTO

### Ver FAQs
```sql
SELECT id, question, category, created_at 
FROM faqs 
ORDER BY created_at DESC;
```

### Actualizar FAQ
```sql
UPDATE faqs 
SET answer = 'Nueva respuesta',
    updated_at = NOW()
WHERE question = '¿Pregunta exacta?';
```

### Eliminar FAQ
```sql
DELETE FROM faqs WHERE id = 'uuid-aqui';
```

### Regenerar Embeddings
```bash
npm run init:embeddings:force
```

---

## 📊 CATEGORÍAS SUGERIDAS

- `general` - Info general UNC
- `admisiones` - Proceso de ingreso
- `carreras` - Programas académicos
- `becas` - Ayuda financiera
- `instalaciones` - Campus y labs
- `horarios` - Calendario
- `contacto` - Info de contacto
- `metodologia` - Enfoque educativo
- `requisitos` - Requisitos
- `costos` - Aranceles

---

## 🆘 SOLUCIÓN RÁPIDA

### Bot no responde bien
1. Ajusta `SIMILARITY_THRESHOLD=0.6`
2. Agrega más FAQs sobre el tema
3. Mejora las respuestas existentes

### Bot responde cosas inventadas
1. Baja `TEMPERATURE=0.2`
2. Mejora el system prompt
3. Agrega más FAQs específicas

### Bot muy lento
1. Reduce `TOP_K_RESULTS=3`
2. Reduce `MAX_TOKENS=400`
3. Verifica Hugging Face API key

### Embeddings no se generan
```bash
npm run init:embeddings:force
```

---

## 📖 DOCUMENTACIÓN COMPLETA

- **Agregar FAQs**: `COMO_AGREGAR_FAQS.md`
- **Mejorar Inteligencia**: `COMO_MEJORAR_INTELIGENCIA.md`
- **Resumen Final**: `RESUMEN_FINAL.md`
- **Hugging Face Setup**: `HUGGINGFACE_SETUP.md`

---

## 💡 TIPS RÁPIDOS

1. **Calidad > Cantidad**: 50 FAQs buenas > 200 malas
2. **Prueba Regularmente**: Haz preguntas tú mismo
3. **Itera**: Ajusta según feedback
4. **Documenta**: Anota qué funciona
5. **Monitorea**: Revisa analytics

---

## 🎯 CHECKLIST DE MEJORA

### Esta Semana
- [ ] Agregar 20-30 FAQs más
- [ ] Mejorar 5 respuestas existentes
- [ ] Ajustar SIMILARITY_THRESHOLD
- [ ] Probar con 10 preguntas diferentes

### Este Mes
- [ ] Llegar a 100+ FAQs
- [ ] Implementar feedback de usuarios
- [ ] Crear interfaz de admin
- [ ] Analizar métricas

---

## 🚀 PRÓXIMOS PASOS

1. Agrega más FAQs con `npm run add:faq`
2. Genera embeddings con `npm run init:embeddings`
3. Prueba el bot
4. Ajusta parámetros según resultados
5. Repite

---

¡Tu chatbot está listo para crecer! 🎉

