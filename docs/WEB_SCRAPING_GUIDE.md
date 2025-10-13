# 🕷️ Guía de Web Scraping para FAQs

Esta guía explica cómo extraer información automáticamente de la web de la UNC y generar FAQs con IA.

---

## 🎯 ¿Qué hace el sistema?

1. **Scrape** la web oficial de la UNC (https://unc.edu.ve/)
2. **Extrae** contenido relevante (títulos, párrafos, listas)
3. **Genera FAQs** automáticamente usando GPT-4o-mini
4. **Crea embeddings** para búsqueda semántica
5. **Inserta** las FAQs en la base de datos

---

## 🚀 Uso Rápido

### 1. Scrape la web y genera FAQs

```bash
npm run scrape:web
```

Esto creará un archivo `generated-faqs.json` con las FAQs generadas.

### 2. Revisa las FAQs generadas

Abre `generated-faqs.json` y verifica que las FAQs sean correctas y relevantes.

### 3. Inserta en la base de datos

```bash
npm run insert:scraped
```

---

## ⚙️ Configuración

### URLs a Scrape

Edita `scripts/scrape-unc-website.js` línea ~180:

```javascript
const urls = [
  'https://unc.edu.ve/',
  'https://unc.edu.ve/admisiones',
  'https://unc.edu.ve/carreras',
  'https://unc.edu.ve/becas',
  'https://unc.edu.ve/contacto',
  // Agrega más URLs aquí
];
```

### Personalizar el Prompt

Edita el prompt en `scripts/scrape-unc-website.js` línea ~90 para ajustar:
- Número de FAQs generadas (3-8 por defecto)
- Longitud de respuestas (máximo 20 palabras)
- Categorías
- Formato de respuestas

---

## 📊 Ejemplo de Output

```json
{
  "question": "¿Qué programas científicos ofrece la UNC?",
  "answer": "Ofrecemos **Biotecnología**, **Neurociencia**, y más. 🔬 ¿Te interesa alguno en particular?",
  "category": "carreras",
  "keywords": ["programas científicos", "Biotecnología"],
  "metadata": {
    "source_url": "https://unc.edu.ve/",
    "source_title": "UNC – Universidad Nacional de las Ciencias...",
    "generated_at": "2025-10-12T23:44:10.667Z"
  }
}
```

---

## 🔧 Troubleshooting

### Error 404 en URLs

Algunas páginas pueden no existir. El scraper las saltará automáticamente.

**Solución:** Verifica las URLs correctas en la web de la UNC y actualiza el array de URLs.

### FAQs de baja calidad

Si las FAQs generadas no son buenas:

1. **Mejora el prompt** - Sé más específico sobre qué tipo de FAQs quieres
2. **Agrega más contexto** - Scrape páginas con más información
3. **Ajusta la temperatura** - Reduce para respuestas más conservadoras

### Rate Limiting

Si haces muchas requests:

1. El script tiene un delay de 2 segundos entre páginas
2. Puedes aumentarlo en línea ~200:
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos
   ```

---

## 🎨 Personalización Avanzada

### Extraer más tipos de contenido

En `scrapePage()` puedes agregar:

```javascript
// Extraer tablas
$('table').each((i, el) => {
  // ... procesar tablas
});

// Extraer imágenes con alt text
$('img[alt]').each((i, el) => {
  const alt = $(el).attr('alt');
  // ... procesar imágenes
});
```

### Filtrar contenido irrelevante

```javascript
// Ignorar secciones específicas
$('.ads, .sidebar, .comments').remove();
```

### Generar FAQs en otros idiomas

Modifica el prompt del sistema:

```javascript
content: 'Eres un experto en crear FAQs. Responde en inglés...'
```

---

## 📈 Mejores Prácticas

1. **Revisa siempre** las FAQs generadas antes de insertarlas
2. **Scrape periódicamente** para mantener la información actualizada
3. **Archiva los JSONs** generados para referencia futura
4. **Monitorea la calidad** de las respuestas del chatbot

---

## 🔄 Automatización

Para scrape automático periódico, puedes usar:

### Cron Job (Linux/Mac)

```bash
# Scrape cada semana los lunes a las 2am
0 2 * * 1 cd /path/to/project && npm run scrape:web
```

### GitHub Actions

Crea `.github/workflows/scrape.yml`:

```yaml
name: Weekly Scrape
on:
  schedule:
    - cron: '0 2 * * 1'  # Lunes 2am
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run scrape:web
      - run: npm run insert:scraped
```

---

## 💡 Ideas de Expansión

1. **Scrape PDFs** - Extraer información de documentos oficiales
2. **Scrape redes sociales** - Instagram, Twitter de la UNC
3. **Scrape noticias** - Mantener FAQs actualizadas con eventos
4. **Multi-idioma** - Generar FAQs en inglés y español
5. **Validación automática** - Verificar que las FAQs no sean duplicadas

---

## 📚 Recursos

- [Cheerio Docs](https://cheerio.js.org/)
- [Axios Docs](https://axios-http.com/)
- [OpenAI API](https://platform.openai.com/docs)

---

## ⚠️ Consideraciones Legales

- Respeta el `robots.txt` del sitio
- No hagas scraping agresivo (usa delays)
- Verifica los términos de servicio del sitio
- Da crédito a la fuente original

---

¡Happy Scraping! 🕷️✨
