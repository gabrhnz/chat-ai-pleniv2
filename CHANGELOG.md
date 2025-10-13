# 📝 Changelog

## [2.0.0] - 2025-10-12

### 🎉 Lanzamiento Mayor - Sistema Completo para UNC

#### ✨ Nuevas Funcionalidades

**Sistema RAG Optimizado:**
- ✅ Respuestas balanceadas (15-20 palabras) con call-to-action
- ✅ Expansión automática de consultas ambiguas
- ✅ Sistema de embeddings local y cloud
- ✅ Búsqueda semántica con pgvector

**Web Scraping Automatizado:**
- ✅ Scraper de sitio oficial UNC
- ✅ Generación automática de FAQs con IA
- ✅ Import desde SQL y fuentes verificadas

**Base de Conocimiento:**
- ✅ 183 FAQs verificadas
- ✅ Información completa del CAIU
- ✅ 16 carreras detalladas
- ✅ Datos de admisiones, becas y vida universitaria

**Scripts de Gestión:**
- ✅ Revisión automática de duplicados
- ✅ Limpieza de base de datos
- ✅ Import desde múltiples fuentes
- ✅ Sistema de verificación de calidad

#### 🔧 Mejoras Técnicas

- Optimización de prompts para respuestas concisas
- Sistema de expansión de queries para lenguaje natural
- Manejo de preguntas ambiguas
- Logs estructurados con Winston
- Rate limiting y seguridad con Helmet
- CORS configurado para producción

#### 📚 Documentación

- Guía completa de web scraping
- README actualizado con quick start
- Arquitectura RAG documentada
- Créditos y atribución

#### 🐛 Correcciones

- Corregidas dimensiones de embeddings (384 vs 1536)
- Eliminados 55 duplicados de la base de datos
- Actualizadas fechas del CAIU
- Corregida información de materias y notas

#### 🔒 Seguridad

- .env protegido en .gitignore
- Archivos temporales excluidos del repo
- Sin datos personales almacenados
- Referencias a fuentes oficiales para verificación

---

## [1.0.0] - 2024-12-XX

### 🚀 Lanzamiento Inicial

- Sistema básico de RAG
- Integración con Supabase
- API REST funcional
- FAQs iniciales

---

**Desarrollado por:** [Gabriel Hernández](https://www.gabrhnz.dev/)  
**Para:** Universidad Nacional de las Ciencias (UNC)
