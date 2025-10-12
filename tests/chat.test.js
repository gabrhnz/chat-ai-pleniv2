/**
 * Chat Endpoint Tests
 * 
 * Tests unitarios y de integración para el endpoint principal de chat.
 * Incluye tests de validación, rate limiting, y respuestas correctas.
 */

import request from 'supertest';
import { jest } from '@jest/globals';

// Mock del servicio de OpenAI antes de importar la app
const mockGenerateChatResponse = jest.fn();

// Mock dinámico del módulo OpenAI
jest.unstable_mockModule('../src/services/openai.service.js', () => ({
  default: {
    generateChatResponse: mockGenerateChatResponse,
    healthCheck: jest.fn().mockResolvedValue(true),
  },
}));

// Mock de la configuración para testing
jest.unstable_mockModule('../src/config/environment.js', () => ({
  default: {
    openai: {
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7,
    },
    server: {
      port: 3000,
      env: 'test',
      isDevelopment: false,
      isProduction: false,
    },
    rateLimit: {
      windowMs: 900000,
      maxRequests: 100,
    },
    security: {
      allowedOrigins: ['http://localhost:3000'],
    },
    logging: {
      level: 'error', // Solo errores en tests
    },
  },
  config: {
    openai: {
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.7,
    },
    server: {
      port: 3000,
      env: 'test',
      isDevelopment: false,
      isProduction: false,
    },
    rateLimit: {
      windowMs: 900000,
      maxRequests: 100,
    },
    security: {
      allowedOrigins: ['http://localhost:3000'],
    },
    logging: {
      level: 'error',
    },
  },
}));

// Importar la app después de los mocks
const { createApp } = await import('../src/index.js');

describe('POST /api/chat', () => {
  let app;
  
  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    
    // Setup default mock response
    mockGenerateChatResponse.mockResolvedValue({
      reply: 'This is a test response from the chatbot',
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      },
      model: 'gpt-3.5-turbo',
      finishReason: 'stop',
      metadata: {
        duration: '100ms',
        timestamp: new Date().toISOString(),
      },
    });
  });
  
  describe('Successful requests', () => {
    test('should return 200 with valid message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello, chatbot!',
        })
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('reply');
      expect(response.body).toHaveProperty('usage');
      expect(response.body.usage).toHaveProperty('prompt_tokens');
      expect(response.body.usage).toHaveProperty('completion_tokens');
      expect(response.body.usage).toHaveProperty('total_tokens');
      expect(response.body).toHaveProperty('metadata');
      
      expect(mockGenerateChatResponse).toHaveBeenCalledTimes(1);
      expect(mockGenerateChatResponse).toHaveBeenCalledWith(
        'Hello, chatbot!',
        [],
      );
    });
    
    test('should handle message with context', async () => {
      const context = [
        { role: 'user', content: 'Previous message' },
        { role: 'assistant', content: 'Previous response' },
      ];
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Follow-up question',
          context,
        })
        .expect(200);
      
      expect(response.body.reply).toBe('This is a test response from the chatbot');
      expect(mockGenerateChatResponse).toHaveBeenCalledWith(
        'Follow-up question',
        context,
      );
    });
    
    test('should handle optional sessionId and userId', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          sessionId: 'session-123',
          userId: 'user-456',
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('reply');
    });
    
    test('should include usage statistics in response', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
        })
        .expect(200);
      
      expect(response.body.usage).toEqual({
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30,
      });
    });
  });
  
  describe('Validation errors', () => {
    test('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/validation/i);
      expect(mockGenerateChatResponse).not.toHaveBeenCalled();
    });
    
    test('should return 400 if message is empty string', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '',
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(mockGenerateChatResponse).not.toHaveBeenCalled();
    });
    
    test('should return 400 if message is too long', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'a'.repeat(5000), // Excede límite de 4000
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(mockGenerateChatResponse).not.toHaveBeenCalled();
    });
    
    test('should return 400 if context is not an array', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          context: 'not an array',
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(mockGenerateChatResponse).not.toHaveBeenCalled();
    });
    
    test('should return 400 if context messages have invalid structure', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          context: [
            { role: 'user' }, // Falta content
          ],
        })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('OpenAI service errors', () => {
    test('should return 502 on OpenAI API error', async () => {
      mockGenerateChatResponse.mockRejectedValue(
        new Error('OpenAI API error')
      );
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
        })
        .expect(502);
      
      expect(response.body).toHaveProperty('error');
    });
    
    test('should handle rate limit errors from OpenAI', async () => {
      const error = new Error('Rate limit exceeded');
      error.type = 'rate_limit_exceeded';
      mockGenerateChatResponse.mockRejectedValue(error);
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
        })
        .expect(502);
      
      expect(response.body.error).toMatch(/OpenAI/i);
    });
  });
});

describe('GET /api/health', () => {
  let app;
  
  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });
  
  test('should return 200 with health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('services');
    expect(response.body.services).toHaveProperty('openai');
  });
  
  test('should return 503 if OpenAI is not available', async () => {
    // Mock dinámico para este test específico
    const openaiService = await import('../src/services/openai.service.js');
    openaiService.default.healthCheck.mockResolvedValue(false);
    
    const response = await request(app)
      .get('/api/health')
      .expect(503);
    
    expect(response.body.status).toBe('degraded');
    expect(response.body.services.openai).toBe('disconnected');
  });
});

describe('GET /', () => {
  let app;
  
  beforeEach(() => {
    app = createApp();
  });
  
  test('should return API information', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
    expect(response.body.endpoints).toHaveProperty('chat');
    expect(response.body.endpoints).toHaveProperty('health');
  });
});

describe('404 handling', () => {
  let app;
  
  beforeEach(() => {
    app = createApp();
  });
  
  test('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/not found/i);
  });
});

/**
 * TODO: Tests adicionales para implementar:
 * 
 * - Rate limiting: Verificar que después de N requests se rechacen
 * - Security: Verificar headers de seguridad (helmet)
 * - CORS: Verificar configuración de CORS
 * - Logging: Verificar que se loguean las requests correctamente
 * - Performance: Tests de carga
 * - Integration: Tests end-to-end con OpenAI real (en CI/CD)
 */

