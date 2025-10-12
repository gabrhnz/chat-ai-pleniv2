# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto! Esta guía te ayudará a hacer contribuciones efectivas.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

---

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta profesional. Al participar, te comprometes a:

- Ser respetuoso con todos los contribuidores
- Aceptar críticas constructivas
- Enfocarte en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

---

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug:

1. **Verifica** que no haya sido reportado antes en [Issues](https://github.com/tu-repo/issues)
2. **Crea un nuevo issue** con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Información del entorno (OS, Node version, etc.)

**Template de Bug Report:**

```markdown
**Descripción**
[Descripción clara del bug]

**Pasos para Reproducir**
1. ...
2. ...
3. ...

**Comportamiento Esperado**
[Qué debería pasar]

**Comportamiento Actual**
[Qué está pasando]

**Entorno**
- OS: [e.g. macOS 13.0]
- Node: [e.g. 18.12.0]
- npm: [e.g. 9.1.0]

**Logs/Screenshots**
[Si aplica]
```

### Solicitar Features

Para proponer nuevas funcionalidades:

1. **Abre un issue** con el tag `enhancement`
2. **Describe** el feature detalladamente:
   - ¿Qué problema resuelve?
   - ¿Cómo funcionaría?
   - ¿Casos de uso?
3. **Espera feedback** antes de comenzar a programar

---

## 💻 Proceso de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub

# Clonar tu fork
git clone https://github.com/tu-usuario/chatbot-ai-api.git
cd chatbot-ai-api

# Agregar upstream remote
git remote add upstream https://github.com/repo-original/chatbot-ai-api.git
```

### 2. Setup Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env

# Configurar tu OPENAI_API_KEY en .env
nano .env
```

### 3. Crear Branch

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear branch para tu feature
git checkout -b feature/nombre-descriptivo

# O para bug fixes
git checkout -b fix/nombre-del-bug
```

**Nomenclatura de Branches:**
- `feature/` - Nuevas funcionalidades
- `fix/` - Bug fixes
- `docs/` - Cambios en documentación
- `refactor/` - Refactoring de código
- `test/` - Agregar o mejorar tests
- `chore/` - Mantenimiento general

### 4. Hacer Cambios

Desarrolla tu feature siguiendo los [Estándares de Código](#estándares-de-código).

### 5. Testing

```bash
# Ejecutar tests
npm test

# Verificar cobertura
npm run test:coverage

# Tests deben pasar antes de commit
```

### 6. Commit

```bash
# Stage cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: add streaming support for chat responses"
```

Ver sección [Commit Messages](#commit-messages) para formato.

### 7. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo

# Crear Pull Request en GitHub
```

---

## 📝 Estándares de Código

### JavaScript/ES Modules

- **ES Modules**: Usar `import/export` (no `require`)
- **Node.js**: 18+ compatible
- **Async/Await**: Preferir sobre callbacks o promises chains

### Estilo de Código

```javascript
// ✅ BIEN
async function getUserData(userId) {
  try {
    const user = await userService.findById(userId);
    return user;
  } catch (error) {
    logger.error('Failed to get user', { userId, error });
    throw new AppError('User not found', 404);
  }
}

// ❌ MAL
function getUserData(userId, callback) {
  userService.findById(userId, function(err, user) {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, user);
  });
}
```

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private**: `_privateMethod()` (convención)
- **Files**: `kebab-case.js` o `camelCase.js`

```javascript
// Variables y funciones
const userName = 'John';
function calculateTotal() { }

// Classes
class UserService { }

// Constants
const MAX_RETRY_ATTEMPTS = 3;

// Private (convención)
class MyClass {
  _privateMethod() { }
}
```

### Comentarios

Comentar **por qué**, no **qué**:

```javascript
// ✅ BIEN - Explica el razonamiento
// Limitamos a 10 mensajes para evitar exceder el límite de tokens de OpenAI
const maxContextMessages = 10;

// ❌ MAL - Repite lo obvio
// Asignar 10 a maxContextMessages
const maxContextMessages = 10;
```

### JSDoc para Funciones Públicas

```javascript
/**
 * Genera una respuesta del chatbot usando GPT
 * 
 * @param {string} message - Mensaje del usuario
 * @param {Array} context - Array de mensajes previos
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta del chatbot con metadata
 * @throws {OpenAIError} Si falla la comunicación con OpenAI
 */
async function generateChatResponse(message, context = [], options = {}) {
  // ...
}
```

### Error Handling

- Usar clases de error personalizadas
- Logging apropiado
- Mensajes de error claros

```javascript
// ✅ BIEN
import { AppError } from './middleware/errorHandler.js';

if (!userId) {
  throw new AppError('User ID is required', 400);
}

// ❌ MAL
if (!userId) {
  throw new Error('error');
}
```

### Estructura de Archivos

Mantener archivos pequeños y enfocados:

- **Max 300 líneas** por archivo (guideline, no regla estricta)
- Una clase/service por archivo
- Separar lógica de negocio de routing

---

## 🧪 Testing

### Escribir Tests

Todo código nuevo debe incluir tests:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });
  
  test('should do something specific', async () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = await myFunction(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.value).toBe('expected');
  });
  
  test('should handle errors', async () => {
    await expect(
      myFunction(null)
    ).rejects.toThrow('Expected error');
  });
});
```

### Coverage Requirements

Mantener cobertura mínima:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

```bash
# Verificar coverage
npm run test:coverage
```

### Testing Checklist

- [ ] Tests unitarios para nueva funcionalidad
- [ ] Tests de casos edge
- [ ] Tests de error handling
- [ ] Todos los tests pasan
- [ ] Coverage mantiene o mejora porcentaje

---

## 📬 Commit Messages

Seguimos [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formato, semicolons, etc (no cambios de código)
- `refactor`: Refactoring (ni feat ni fix)
- `test`: Agregar o modificar tests
- `chore`: Mantenimiento, dependencies, etc
- `perf`: Mejoras de performance

### Ejemplos

```bash
# Feature
git commit -m "feat(chat): add streaming support for responses"

# Bug fix
git commit -m "fix(validation): correct message length validation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(openai-service): simplify error handling"

# Test
git commit -m "test(chat): add tests for context handling"

# Breaking change
git commit -m "feat(api): change response format

BREAKING CHANGE: response now includes metadata object"
```

### Rules

- Usar imperativo presente: "add" no "added" ni "adds"
- No capitalizar primera letra
- No punto final
- Máximo 72 caracteres en subject
- Body opcional para explicar el "por qué"
- Footer para breaking changes o issues cerrados

---

## 🔄 Pull Requests

### Antes de Crear PR

- [ ] Tests pasan (`npm test`)
- [ ] Código sigue estándares
- [ ] Commits siguen convención
- [ ] Branch actualizado con main
- [ ] Sin conflictos

### Template de PR

```markdown
## Descripción
[Descripción clara de los cambios]

## Tipo de Cambio
- [ ] Bug fix (non-breaking change)
- [ ] Nueva funcionalidad (non-breaking change)
- [ ] Breaking change (fix o feature que afecta funcionalidad existente)
- [ ] Documentación

## Testing
- [ ] Tests agregados/actualizados
- [ ] Tests pasan localmente
- [ ] Coverage mantiene/mejora porcentaje

## Checklist
- [ ] Código sigue guías de estilo
- [ ] Documentación actualizada
- [ ] Commits siguen convención
- [ ] Sin warnings en console

## Screenshots (si aplica)
[Screenshots]

## Notas Adicionales
[Cualquier información adicional]

## Issues Relacionados
Closes #123
Related to #456
```

### Proceso de Review

1. **CI/CD checks** deben pasar (cuando estén configurados)
2. **Al menos 1 aprobación** de maintainer
3. **Resolver comentarios** del review
4. **Squash & merge** preferido para mantener historia limpia

### Después del Merge

```bash
# Actualizar local
git checkout main
git pull upstream main

# Limpiar branch
git branch -d feature/nombre-descriptivo
```

---

## 🎯 Áreas donde Contribuir

### Good First Issues

Busca issues etiquetados con `good first issue` para empezar.

### Áreas Prioritarias

1. **Testing**: Mejorar cobertura de tests
2. **Documentation**: Mejorar/traducir docs
3. **Error Handling**: Mejorar mensajes de error
4. **Performance**: Optimizaciones
5. **Accessibility**: Hacer API más accesible
6. **Internationalization**: Soporte multi-idioma

### Features Futuros (Roadmap)

- [ ] Streaming de respuestas (SSE/WebSockets)
- [ ] Gestión de sesiones con Redis
- [ ] Tracking de uso por usuario
- [ ] Historial de conversaciones
- [ ] Múltiples modelos de AI
- [ ] Rate limiting por usuario
- [ ] Analytics dashboard
- [ ] SDK oficial para múltiples lenguajes

---

## 📞 Contacto

¿Preguntas sobre contribución?

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Email**: maintainer@example.com

---

## 🙏 Reconocimientos

Todos los contribuidores son reconocidos en el archivo [CONTRIBUTORS.md](CONTRIBUTORS.md).

¡Gracias por contribuir! 🎉

