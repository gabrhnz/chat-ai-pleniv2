# 📚 GUÍA COMPLETA PARA AGREGAR FAQs AL CHATBOT UNC

## 🎯 Objetivo
Esta guía te permitirá agregar FAQs sobre mallas curriculares y otros temas siguiendo el formato y estilo establecido.

---

## 📋 ESTRUCTURA DE UN SCRIPT DE FAQs

### Plantilla Base (Copiar y Modificar)

```javascript
#!/usr/bin/env node

/**
 * Add [NOMBRE_CARRERA] Curriculum FAQs
 * 
 * FAQs sobre la malla curricular de [NOMBRE_COMPLETO_CARRERA]
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../src/services/embeddings.service.js';
import * as embeddingsCloud from '../src/services/embeddings.service.cloud.js';
import config from '../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// AQUÍ VAN LAS FAQs
const nombreCarreraFAQs = [
  {
    question: "pregunta en minúsculas sin signos de interrogación",
    answer: "Respuesta concisa con **negritas** en conceptos clave. Emojis relevantes al final. 🎓",
    category: "carreras",
    keywords: ["palabra1", "palabra2", "palabra3"]
  },
  // ... más FAQs
];

async function addNombreCarreraFAQs() {
  console.log('🎓 Adding [NOMBRE] Curriculum FAQs\n');
  console.log(`📋 Found ${nombreCarreraFAQs.length} FAQs to add\n`);
  
  console.log('🔢 Generating embeddings...');
  const questions = nombreCarreraFAQs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  const faqsToInsert = nombreCarreraFAQs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: {
      source: 'curriculum-nombrecarrera',
      added_at: new Date().toISOString(),
      type: 'curriculum',
      career: 'Nombre Completo de la Carrera'
    },
    embedding: embeddings[idx],
    created_by: 'curriculum-nombrecarrera',
    is_active: true,
  }));
  
  const { data, error } = await supabase
    .from('faqs')
    .insert(faqsToInsert)
    .select();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Added ${data.length} [NOMBRE] curriculum FAQs\n`);
  console.log('\n✨ Total FAQs agregadas!\n');
}

addNombreCarreraFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

---

## 🎨 ESTILO Y FORMATO DE FAQs

### ✅ REGLAS OBLIGATORIAS

#### 1. **Formato de Preguntas**
- ✅ **Minúsculas**: "que veo en primer semestre"
- ✅ **Sin signos de interrogación**: NO usar ¿?
- ✅ **Lenguaje venezolano natural**: "cuanto cuesta", "donde queda"
- ✅ **Cortas y directas**: máximo 10 palabras

**Ejemplos correctos:**
```javascript
"cuantas UC tiene robotica"
"que veo en primer semestre de IA"
"cuando veo machine learning"
"hay laboratorios en biomateriales"
"donde hago pasantias"
```

**Ejemplos INCORRECTOS:**
```javascript
"¿Cuántas UC tiene Robótica?" // ❌ Tiene signos y mayúsculas
"Dime cuántas unidades de crédito tiene la carrera" // ❌ Muy largo
```

#### 2. **Formato de Respuestas**
- ✅ **Concisas**: 2-4 líneas máximo
- ✅ **Negritas** en conceptos clave: `**Machine Learning**`
- ✅ **Emojis relevantes** al final: 🤖💻🔬
- ✅ **Datos específicos**: números, semestres, UC
- ✅ **Tono cercano**: tuteo, venezolano

**Estructura ideal:**
```
[Información principal con **conceptos clave**]. [Detalle adicional]. [Emoji relevante]
```

**Ejemplos correctos:**
```javascript
answer: "La carrera tiene **181 UC** en total, distribuidas en **8 semestres**. 🤖💻"

answer: "En **Semestre III** (23 UC) ves: **Machine Learning**, **Big Data**, **Ingeniería de Datos**. 🤖📈"

answer: "Sí, hay **Pasantías** en semestres avanzados donde trabajas en empresas aplicando lo aprendido. 💼🚀"
```

#### 3. **Keywords (Palabras Clave)**
- ✅ Incluir **variaciones** de la pregunta
- ✅ Incluir **sinónimos**
- ✅ Incluir **términos relacionados**
- ✅ En minúsculas

**Ejemplo:**
```javascript
keywords: ["machine learning", "cuando", "IA", "inteligencia artificial", "ML"]
```

---

## 📝 CATEGORÍAS DE FAQs PARA MALLAS CURRICULARES

### 1. **Información General** (2-3 FAQs)
```javascript
{
  question: "cuantas UC tiene [carrera]",
  answer: "La carrera tiene **X UC** en total, distribuidas en **8 semestres**. [emoji]",
  category: "carreras",
  keywords: ["UC", "unidades credito", "carrera"]
}

{
  question: "que materias tiene [carrera]",
  answer: "Tiene materias como: **Materia1**, **Materia2**, **Materia3**, y más. [emoji]",
  category: "carreras",
  keywords: ["materias", "asignaturas", "carrera"]
}

{
  question: "cuantas horas semanales tiene [carrera]",
  answer: "Son **X horas semanales** en total, incluyendo clases, labs y trabajo independiente. [emoji]",
  category: "carreras",
  keywords: ["horas", "semanales", "carrera"]
}
```

### 2. **Por Semestre** (1-2 FAQs por semestre)
```javascript
{
  question: "que veo en primer semestre de [carrera]",
  answer: "En **Semestre I** (X UC) ves: **Materia1**, **Materia2**, **Materia3**. La base fundamental. [emoji]",
  category: "carreras",
  keywords: ["primer semestre", "semestre 1", "carrera"]
}

{
  question: "que veo en segundo semestre de [carrera]",
  answer: "En **Semestre II** (X UC) ves: **Materia1**, **Materia2**, **Materia3**. [emoji]",
  category: "carreras",
  keywords: ["segundo semestre", "semestre 2", "carrera"]
}
```

### 3. **Materias Específicas** (3-5 FAQs)
```javascript
{
  question: "cuando veo [materia] en [carrera]",
  answer: "**[Materia]** lo ves en el **Semestre X**. [Breve descripción]. [emoji]",
  category: "carreras",
  keywords: ["materia", "cuando", "carrera"]
}

{
  question: "que es [materia]",
  answer: "**[Materia]** es [explicación breve]. Lo ves en Semestre X. [emoji]",
  category: "carreras",
  keywords: ["materia", "que es", "carrera"]
}
```

### 4. **Laboratorios** (2 FAQs)
```javascript
{
  question: "hay laboratorios en [carrera]",
  answer: "Sí, varios: **Lab1**, **Lab2**, **Lab3**. Muy práctico. [emoji]",
  category: "carreras",
  keywords: ["laboratorios", "labs", "carrera"]
}

{
  question: "cuantos laboratorios tiene [carrera]",
  answer: "Tiene varios labs: [lista]. Es muy hands-on. [emoji]",
  category: "carreras",
  keywords: ["cuantos laboratorios", "carrera"]
}
```

### 5. **Pasantías** (2 FAQs)
```javascript
{
  question: "hay pasantias en [carrera]",
  answer: "Sí, hay **Pasantías** en semestres avanzados donde trabajas en [lugares]. [emoji]",
  category: "carreras",
  keywords: ["pasantias", "pasantías", "carrera"]
}

{
  question: "donde hago pasantias en [carrera]",
  answer: "Puedes hacer pasantías en **[empresas/lugares]**. [emoji]",
  category: "carreras",
  keywords: ["donde pasantias", "pasantías", "carrera"]
}
```

### 6. **Matemáticas y Ciencias** (2-3 FAQs)
```javascript
{
  question: "cuanta matematica tiene [carrera]",
  answer: "Tiene **Matemática I, II** [y otras]. Es [nivel]. [emoji]",
  category: "carreras",
  keywords: ["matematica", "matemática", "cuanta", "carrera"]
}

{
  question: "cuanta fisica tiene [carrera]",
  answer: "Tiene **Física I, II** [y otras]. [Para qué sirve]. [emoji]",
  category: "carreras",
  keywords: ["fisica", "física", "cuanta", "carrera"]
}
```

### 7. **Programación** (si aplica, 2 FAQs)
```javascript
{
  question: "cuanta programacion tiene [carrera]",
  answer: "[Cantidad]. Principalmente **[lenguajes]**. [emoji]",
  category: "carreras",
  keywords: ["programacion", "programación", "cuanta", "carrera"]
}

{
  question: "necesito saber programar antes de [carrera]",
  answer: "No, te enseñan desde cero. Empiezas con [materia]. [emoji]",
  category: "carreras",
  keywords: ["necesito saber programar", "antes", "carrera"]
}
```

### 8. **Duración y Carga** (2 FAQs)
```javascript
{
  question: "es muy pesada la carrera de [carrera]",
  answer: "Es exigente [detalles] pero si te gusta [área], es manejable. [emoji]",
  category: "carreras",
  keywords: ["pesada", "dificil", "carrera"]
}

{
  question: "cuantas materias por semestre en [carrera]",
  answer: "Varía entre **X-Y materias** por semestre. [emoji]",
  category: "carreras",
  keywords: ["cuantas materias", "semestre", "carrera"]
}
```

### 9. **Comparaciones** (1-2 FAQs)
```javascript
{
  question: "que diferencia hay entre [carrera1] y [carrera2]",
  answer: "**[Carrera1]** [enfoque]. **[Carrera2]** [enfoque]. [Similitudes/diferencias]. [emoji]",
  category: "carreras",
  keywords: ["diferencia", "carrera1", "carrera2"]
}
```

### 10. **Práctico** (2 FAQs)
```javascript
{
  question: "puedo ver la malla completa de [carrera]",
  answer: "Sí, la malla está en la web de la UNC o en admisiones. Tiene **8 semestres**, **X UC**. 📋 ¿Quieres info de algún semestre?",
  category: "carreras",
  keywords: ["malla completa", "pensum", "carrera"]
}

{
  question: "donde consigo el pensum de [carrera]",
  answer: "El pensum está en **unc.edu.ve** o en admisiones. 📄 ¿Qué te interesa?",
  category: "carreras",
  keywords: ["pensum", "donde", "carrera"]
}
```

---

## 🎯 CANTIDAD RECOMENDADA DE FAQs POR CARRERA

**Mínimo**: 35 FAQs
**Óptimo**: 40-45 FAQs
**Distribución sugerida**:
- Información general: 3 FAQs
- Por semestre (I-IV): 8 FAQs (2 por semestre)
- Semestres avanzados: 2 FAQs
- Materias específicas: 8-10 FAQs
- Laboratorios: 2 FAQs
- Pasantías: 2 FAQs
- Matemáticas/Física: 3 FAQs
- Programación: 2 FAQs
- Duración y carga: 2 FAQs
- Comparaciones: 1 FAQ
- Áreas de trabajo: 2-3 FAQs
- Práctico: 2 FAQs

---

## 🚀 PASOS PARA AGREGAR FAQs DE UNA NUEVA CARRERA

### Paso 1: Crear el archivo
```bash
# Nombre del archivo
scripts/add-[nombre-carrera]-curriculum-faqs.js

# Ejemplos:
scripts/add-fisica-curriculum-faqs.js
scripts/add-biotecnologia-curriculum-faqs.js
```

### Paso 2: Copiar la plantilla base
Copiar el código de la plantilla al inicio de este documento.

### Paso 3: Modificar los nombres
Reemplazar:
- `[NOMBRE_CARRERA]` → nombre corto (ej: "Física")
- `[NOMBRE_COMPLETO_CARRERA]` → nombre completo (ej: "Licenciatura en Física")
- `nombreCarreraFAQs` → nombre de la variable (ej: `fisicaFAQs`)
- `addNombreCarreraFAQs` → nombre de la función (ej: `addFisicaFAQs`)

### Paso 4: Agregar las FAQs
Seguir las categorías y formato descritos arriba.

### Paso 5: Ejecutar el script
```bash
node scripts/add-[nombre-carrera]-curriculum-faqs.js
```

---

## 📊 EMOJIS RECOMENDADOS POR ÁREA

**Tecnología/IA**: 🤖💻🧠⚡
**Robótica**: 🤖🦾⚙️🔧
**Ciberseguridad**: 🔒🛡️🕵️💻
**Biomateriales**: 🧬💊🔬🦴
**Electromedicina**: 🏥⚡🔧📸
**Petroquímica**: ⚗️🛢️🏭🔥
**Física**: ⚛️🔬🌌📐
**Biotecnología**: 🧬🦠💉🔬
**Matemáticas**: 📐🔢📊🧮
**Ciencia de Datos**: 📊💻📈🔍
**Nanotecnología**: ⚛️🔬💊
**Oceanología**: 🌊🐋🐠🏖️
**Filosofía**: 🤔📚💭🏛️

---

## ⚠️ ERRORES COMUNES A EVITAR

### ❌ NO HACER:
1. Usar signos de interrogación en preguntas
2. Usar mayúsculas al inicio de preguntas
3. Respuestas muy largas (más de 4 líneas)
4. Olvidar emojis
5. No usar negritas en conceptos clave
6. Keywords en mayúsculas
7. Respuestas genéricas sin datos específicos

### ✅ SÍ HACER:
1. Preguntas en minúsculas sin signos
2. Respuestas concisas con datos específicos
3. Negritas en conceptos importantes
4. Emojis relevantes al final
5. Keywords variadas y relacionadas
6. Tono cercano y venezolano
7. Mencionar semestres y UC específicas

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
chat-ai-pleniv2/
├── scripts/
│   ├── add-ia-curriculum-faqs.js ✅
│   ├── add-biomateriales-curriculum-faqs.js ✅
│   ├── add-ciberseguridad-curriculum-faqs.js ✅
│   ├── add-robotica-curriculum-faqs.js ✅
│   ├── add-electromedicina-curriculum-faqs.js ✅
│   ├── add-petroquimica-curriculum-faqs.js ✅
│   ├── add-fisica-curriculum-faqs.js ⏳ (pendiente)
│   ├── add-biotecnologia-curriculum-faqs.js ⏳
│   ├── add-matematicas-curriculum-faqs.js ⏳
│   └── ... (más carreras)
```

---

## 🎓 CARRERAS PENDIENTES

### Licenciaturas que faltan:
1. **Física Nuclear**
2. **Biología y Química Computacional**
3. **Biotecnología**
4. **Ciencia Molecular**
5. **Ciencia de Datos**
6. **Física**
7. **Matemáticas**
8. **Nanotecnología**
9. **Filosofía**
10. **Oceanología**

---

## 💡 TIPS PARA OTRA IA

1. **Lee los scripts existentes** para entender el patrón
2. **Copia la estructura exacta** de un script que funcione
3. **Mantén el mismo estilo** de preguntas y respuestas
4. **Usa los emojis apropiados** para cada área
5. **Verifica que las preguntas sean naturales** (como hablaría un venezolano)
6. **Incluye datos específicos** (UC, semestres, nombres de materias)
7. **Prueba el script** antes de considerar que está listo

---

## 🔍 EJEMPLO COMPLETO DE FAQ BIEN HECHA

```javascript
{
  question: "cuando veo machine learning en robotica",
  answer: "**Machine Learning para Automatización** lo ves en el **Semestre III**. Aprendes a que los robots aprendan y se adapten. 🤖🧠",
  category: "carreras",
  keywords: ["machine learning", "cuando", "robotica", "robótica", "ML", "aprendizaje automatico"]
}
```

**Por qué está bien:**
- ✅ Pregunta en minúsculas sin signos
- ✅ Lenguaje natural venezolano
- ✅ Respuesta concisa (2 líneas)
- ✅ Negritas en conceptos clave
- ✅ Datos específicos (Semestre III)
- ✅ Emojis relevantes
- ✅ Keywords variadas

---

## 📞 CONTACTO Y SOPORTE

Si tienes dudas, revisa:
1. Los scripts existentes en `/scripts/add-*-curriculum-faqs.js`
2. Este documento
3. El archivo `COMO_AGREGAR_FAQS.md` (versión anterior)

---

**Última actualización**: 13 de octubre, 2025
**Versión**: 2.0
**Estado**: ✅ Listo para usar

¡Éxito agregando más FAQs! 🚀🎓
