/**
 * Test Setup
 * 
 * Configuración global para los tests.
 * Se ejecuta antes de todos los tests.
 */

// Configurar timeouts más largos para tests de integración
jest.setTimeout(10000);

// Suprimir logs durante testing (opcional)
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    // Mantener error y warn para debugging
    error: console.error,
    warn: console.warn,
  };
}

// Variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-key-123';
process.env.PORT = '3001'; // Puerto diferente para evitar conflictos

export default {};

