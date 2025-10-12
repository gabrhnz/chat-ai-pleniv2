/**
 * Jest Configuration
 * 
 * Configuración para testing con Jest y ES Modules
 */

export default {
  // Use Node's native ESM support
  testEnvironment: 'node',
  
  // Transform settings for ES modules
  transform: {},
  
  // File extensions to consider
  moduleFileExtensions: ['js', 'json'],
  
  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Excluir punto de entrada
    '!**/node_modules/**',
  ],
  
  coverageDirectory: 'coverage',
  
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

