# 📚 Cómo Agregar Más FAQs

Hay **3 formas** de agregar FAQs a tu chatbot:

---

## 🎯 MÉTODO 1: Usando SQL (Más Rápido)

### Paso 1: Crear archivo SQL con tus FAQs

Crea un archivo `nuevas_faqs.sql`:

```sql
-- Insertar nuevas FAQs
INSERT INTO faqs (question, answer, category, keywords, metadata) VALUES

-- FAQ 1
('¿Cuál es el proceso de admisión en la UNC?',
'El proceso de admisión en la UNC incluye: 1) Inscripción en línea, 2) Presentación de documentos, 3) Prueba de aptitud académica, 4) Entrevista personal. Las inscripciones suelen abrir en enero y julio.',
'admisiones',
ARRAY['admisión', 'inscripción', 'ingreso', 'proceso'],
'{"source": "admisiones", "last_updated": "2025-01-12"}'::jsonb),

-- FAQ 2
('¿La UNC ofrece becas?',
'Sí, la UNC ofrece becas académicas basadas en mérito y becas socioeconómicas. Los estudiantes pueden solicitar becas durante el proceso de admisión o durante su carrera universitaria.',
'becas',
ARRAY['becas', 'ayuda financiera', 'apoyo económico'],
'{"source": "becas", "last_updated": "2025-01-12"}'::jsonb),

-- FAQ 3
('¿Qué horarios tienen las clases?',
'Las clases en la UNC se imparten en horario diurno de lunes a viernes, de 7:00 AM a 5:00 PM. Algunas carreras pueden tener laboratorios en horarios extendidos.',
'horarios',
ARRAY['horarios', 'clases', 'horario'],
'{"source": "academico", "last_updated": "2025-01-12"}'::jsonb);
```

### Paso 2: Ejecutar en Supabase

1. Ve a: https://igpdjlfkwjkhvbpvltjg.supabase.co
2. Clic en **SQL Editor**
3. Pega el SQL
4. Clic en **Run**

### Paso 3: Generar embeddings

```bash
npm run init:embeddings
```

---

## 🎯 MÉTODO 2: Usando el Admin API (Programático)

### Crear script para agregar FAQs:

```javascript
// agregar-faqs.js
const API_URL = 'https://plani-unc-hkm0zkdf7-portfolios-projects-268c19b4.vercel.app';
const ADMIN_KEY = 'plani-unc-admin-2025-secret-key';

const nuevasFAQs = [
  {
    question: "¿Cuál es el proceso de admisión en la UNC?",
    answer: "El proceso incluye inscripción en línea, documentos, prueba y entrevista.",
    category: "admisiones",
    keywords: ["admisión", "inscripción", "ingreso"]
  },
  {
    question: "¿La UNC ofrece becas?",
    answer: "Sí, ofrecemos becas académicas y socioeconómicas.",
    category: "becas",
    keywords: ["becas", "ayuda financiera"]
  }
];

async function agregarFAQs() {
  for (const faq of nuevasFAQs) {
    const response = await fetch(`${API_URL}/api/admin/faqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_KEY
      },
      body: JSON.stringify(faq)
    });
    
    const result = await response.json();
    console.log('FAQ agregada:', result);
  }
}

agregarFAQs();
```

Ejecutar:
```bash
node agregar-faqs.js
```

---

## 🎯 MÉTODO 3: Desde tu Frontend (Interfaz Admin)

Puedes crear una página de administración en tu frontend:

```javascript
async function agregarFAQ(faq) {
  const response = await fetch('https://tu-backend.vercel.app/api/admin/faqs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': 'plani-unc-admin-2025-secret-key'
    },
    body: JSON.stringify({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: faq.keywords
    })
  });
  
  return await response.json();
}
```

---

## 📋 ESTRUCTURA DE UNA FAQ

```javascript
{
  "question": "Pregunta clara y específica",
  "answer": "Respuesta detallada y completa",
  "category": "categoria", // admisiones, carreras, becas, etc.
  "keywords": ["palabra1", "palabra2", "palabra3"], // Opcional
  "metadata": {
    "source": "origen",
    "last_updated": "2025-01-12"
  } // Opcional
}
```

---

## 💡 CONSEJOS PARA BUENAS FAQs

### ✅ HACER:
- Preguntas claras y directas
- Respuestas completas (2-3 párrafos)
- Usar lenguaje natural
- Incluir información de contacto cuando sea relevante
- Agregar palabras clave relacionadas

### ❌ EVITAR:
- Preguntas muy genéricas ("¿Qué es esto?")
- Respuestas de una sola palabra
- Información desactualizada
- Duplicar preguntas similares

---

## 🔄 ACTUALIZAR FAQs EXISTENTES

### Método 1: SQL
```sql
UPDATE faqs 
SET answer = 'Nueva respuesta actualizada',
    updated_at = NOW()
WHERE question = '¿Pregunta exacta?';
```

### Método 2: Admin API
```javascript
const response = await fetch(`${API_URL}/api/admin/faqs/${faq_id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Key': ADMIN_KEY
  },
  body: JSON.stringify({
    answer: "Nueva respuesta actualizada"
  })
});
```

---

## 🗑️ ELIMINAR FAQs

### SQL:
```sql
DELETE FROM faqs WHERE id = 'uuid-de-la-faq';
```

### Admin API:
```javascript
await fetch(`${API_URL}/api/admin/faqs/${faq_id}`, {
  method: 'DELETE',
  headers: { 'X-Admin-Key': ADMIN_KEY }
});
```

---

## 📊 VER TODAS LAS FAQs

### SQL:
```sql
SELECT id, question, category, created_at 
FROM faqs 
ORDER BY created_at DESC;
```

### Admin API:
```bash
curl -H "X-Admin-Key: plani-unc-admin-2025-secret-key" \
  https://tu-backend.vercel.app/api/admin/faqs
```

---

## ⚡ REGENERAR EMBEDDINGS

Después de agregar/actualizar FAQs, regenera los embeddings:

```bash
# Local
npm run init:embeddings

# O forzar regeneración
npm run init:embeddings:force
```

---

## 🎯 CATEGORÍAS SUGERIDAS

- `general` - Información general de la UNC
- `admisiones` - Proceso de ingreso
- `carreras` - Programas académicos
- `becas` - Ayuda financiera
- `instalaciones` - Campus y laboratorios
- `horarios` - Horarios y calendario
- `contacto` - Información de contacto
- `metodologia` - Enfoque educativo
- `requisitos` - Requisitos de ingreso
- `costos` - Aranceles y costos

---

## 📝 EJEMPLO COMPLETO

```sql
INSERT INTO faqs (question, answer, category, keywords, metadata) VALUES

('¿Cuánto cuesta estudiar en la UNC?',
'La UNC es una universidad pública, por lo que la matrícula es gratuita para estudiantes venezolanos. Solo se cobran algunos aranceles administrativos mínimos. Además, ofrecemos becas para gastos de transporte y alimentación.',
'costos',
ARRAY['costo', 'precio', 'matrícula', 'aranceles', 'gratuita'],
'{"source": "administracion", "last_updated": "2025-01-12", "priority": "high"}'::jsonb),

('¿La UNC tiene residencias estudiantiles?',
'Actualmente la UNC no cuenta con residencias estudiantiles en el campus. Sin embargo, trabajamos con aliados para facilitar opciones de alojamiento cercanas a la universidad.',
'instalaciones',
ARRAY['residencias', 'alojamiento', 'dormitorios', 'vivienda'],
'{"source": "servicios", "last_updated": "2025-01-12"}'::jsonb);
```

Luego:
```bash
npm run init:embeddings
```

---

## 🚀 TIPS PRO

1. **Agrupa FAQs relacionadas** - Facilita el mantenimiento
2. **Usa keywords inteligentes** - Mejora la búsqueda
3. **Actualiza regularmente** - Mantén la información fresca
4. **Prueba las respuestas** - Verifica que el bot responda bien
5. **Monitorea analytics** - Ve qué preguntas son más comunes

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "Los embeddings no se generan"
```bash
# Verificar conexión a Supabase
npm run verify

# Regenerar forzadamente
npm run init:embeddings:force
```

### "El bot no encuentra la nueva FAQ"
- Verifica que los embeddings se generaron
- Revisa que la pregunta sea clara
- Asegúrate que `is_active = true`

### "Error al insertar FAQ"
- Verifica la sintaxis SQL
- Asegúrate que los campos requeridos estén presentes
- Revisa que no haya comillas sin escapar

---

¡Listo! Ahora puedes agregar todas las FAQs que necesites. 🎉

