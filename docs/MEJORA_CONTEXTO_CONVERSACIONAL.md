# 🔧 Mejora del Contexto Conversacional

## 🐛 Problema Identificado

Cuando un usuario preguntaba sobre una carrera y luego hacía una pregunta de seguimiento genérica, el bot **perdía el contexto**:

**Ejemplo del problema:**
```
Usuario: "que es nanotecnología"
Bot: "La Nanotecnología manipula materia a escala nanométrica..."

Usuario: "que salida laboral tiene"
Bot: [Respondía sobre Ciberseguridad en lugar de Nanotecnología] ❌
```

## ✅ Solución Implementada

### Cambios en `conversation-memory.service.js`

#### 1. **Detección Mejorada de Preguntas Ambiguas**

**Antes:**
```javascript
const isAmbiguous = query.length < 20 && 
  (query.match(/^(si|sí|la de|el de|esa|ese|esta|este|dame|dime|quiero|cuál)/i));
```

**Ahora:**
```javascript
const isAmbiguous = query.length < 50 && 
  (query.match(/^(si|sí|la de|el de|esa|ese|esta|este|dame|dime|quiero|cuál)/i) ||
   query.match(/(salida|campo|trabaja|hace|oportunidad|empleo)/i) && 
   !query.match(/(ingeniería|licenciatura|carrera de|física|matemática|...)/i));
```

**Mejoras:**
- ✅ Detecta preguntas sobre **salidas laborales, campo laboral, oportunidades**
- ✅ Solo si NO mencionan explícitamente una carrera
- ✅ Aumenta el límite de caracteres a 50

#### 2. **Expansión Contextual de Preguntas sobre Salidas Laborales**

**Nueva lógica agregada:**
```javascript
// Detectar preguntas sobre salidas laborales/campo laboral
if (query.match(/(salida|campo|trabaja|hace|oportunidad|empleo|donde|dónde)/i)) {
  const carreras = extractCarrerasFromText(msg.content);
  if (carreras.length > 0) {
    const carrera = carreras[0];
    
    // Determinar tipo de pregunta
    if (query.match(/(salida|oportunidad|empleo)/i)) {
      contextualQuery = `¿Cuáles son las salidas laborales de ${carrera}?`;
    } else if (query.match(/(donde|dónde|trabaja)/i)) {
      contextualQuery = `¿Dónde puede trabajar un profesional en ${carrera}?`;
    } else if (query.match(/hace/i)) {
      contextualQuery = `¿Qué hace un profesional en ${carrera}?`;
    } else if (query.match(/campo/i)) {
      contextualQuery = `¿Cuál es el campo laboral de ${carrera}?`;
    }
  }
}
```

## 🎯 Casos de Uso Mejorados

### Caso 1: Salida Laboral
```
Usuario: "que es nanotecnología"
Bot: "La Nanotecnología manipula materia..."

Usuario: "que salida laboral tiene"
Sistema: Detecta "nanotecnología" en mensaje anterior
Sistema: Expande a "¿Cuáles son las salidas laborales de Nanotecnología?"
Bot: "Salidas: Investigador en nanotecnología, especialista en nanomateriales..." ✅
```

### Caso 2: Dónde Trabaja
```
Usuario: "que es biotecnología"
Bot: "La Biotecnología aplica organismos vivos..."

Usuario: "donde puede trabajar"
Sistema: Expande a "¿Dónde puede trabajar un profesional en Biotecnología?"
Bot: "Trabajan en: industria farmacéutica, empresas de biotecnología..." ✅
```

### Caso 3: Qué Hace
```
Usuario: "que es ciencia de datos"
Bot: "La Ciencia de Datos forma profesionales..."

Usuario: "que hace"
Sistema: Expande a "¿Qué hace un profesional en Ciencia de Datos?"
Bot: "Analiza grandes volúmenes de información, crea modelos predictivos..." ✅
```

### Caso 4: Campo Laboral
```
Usuario: "que es física nuclear"
Bot: "La Física Nuclear forma científicos..."

Usuario: "campo laboral"
Sistema: Expande a "¿Cuál es el campo laboral de Física Nuclear?"
Bot: "Campo laboral: Físico médico, oficial de protección radiológica..." ✅
```

## 🔍 Palabras Clave Detectadas

El sistema ahora detecta y expande automáticamente preguntas con:
- **salida** / **salidas**
- **campo**
- **trabaja** / **trabajar**
- **hace**
- **oportunidad** / **oportunidades**
- **empleo** / **empleos**
- **donde** / **dónde**

## 📊 Carreras Reconocidas

El sistema extrae automáticamente estas carreras del contexto:
- Inteligencia Artificial / IA / AI
- Ciberseguridad
- Robótica
- Electromedicina
- Petroquímica
- Biomateriales
- Biotecnología
- Ciencia de Datos
- Nanotecnología
- Física Nuclear
- Oceanología
- Ciencia Molecular
- Biología Computacional
- Química Computacional
- Física
- Matemáticas
- Filosofía

## 🚀 Beneficios

1. **Conversaciones más naturales** - El usuario no necesita repetir el nombre de la carrera
2. **Mejor experiencia de usuario** - Respuestas contextuales precisas
3. **Menos frustración** - El bot entiende preguntas de seguimiento
4. **Mayor engagement** - Conversaciones fluidas y coherentes

## 🧪 Cómo Probar

1. Pregunta sobre una carrera: `"que es nanotecnología"`
2. Haz una pregunta de seguimiento: `"que salida laboral tiene"`
3. Verifica que el bot responda sobre **Nanotecnología**, no otra carrera

## 📝 Logs

El sistema ahora registra cuando expande queries:
```
Query expandida con contexto de carrera (salida laboral)
{
  original: "que salida laboral tiene",
  expanded: "¿Cuáles son las salidas laborales de Nanotecnología?",
  carrera: "Nanotecnología",
  sessionId: "..."
}
```

## ⚙️ Configuración

- **Memoria de conversación**: 10 mensajes (últimos)
- **TTL de sesión**: 30 minutos
- **Mensajes recientes analizados**: 3 últimos

---

**Fecha de implementación**: 13 de octubre, 2025
**Versión**: 1.1.0
**Estado**: ✅ Implementado y probado
