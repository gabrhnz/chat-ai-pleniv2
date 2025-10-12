"""
Ejemplo de Cliente Python para Chatbot AI API

Este script demuestra cómo interactuar con la API del chatbot
desde Python usando requests.

Instalación:
    pip install requests

Uso:
    python examples/python-client.py
"""

import requests
import json
from typing import List, Dict, Optional
from datetime import datetime


class ChatbotClient:
    """Cliente Python para la API del Chatbot"""
    
    def __init__(self, base_url: str = 'http://localhost:3000'):
        """
        Inicializa el cliente
        
        Args:
            base_url: URL base de la API
        """
        self.base_url = base_url.rstrip('/')
        self.context: List[Dict[str, str]] = []
        self.session_id = self._generate_session_id()
        self.user_id: Optional[str] = None
    
    def _generate_session_id(self) -> str:
        """Genera un ID único de sesión"""
        import random
        import string
        timestamp = int(datetime.now().timestamp())
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
        return f"session-{timestamp}-{random_str}"
    
    def set_user_id(self, user_id: str):
        """Establece el ID de usuario"""
        self.user_id = user_id
    
    def chat(self, message: str) -> Dict:
        """
        Envía un mensaje al chatbot
        
        Args:
            message: Mensaje del usuario
            
        Returns:
            Respuesta del chatbot con metadata
            
        Raises:
            requests.exceptions.RequestException: Si hay error en la request
        """
        url = f"{self.base_url}/api/chat"
        
        payload = {
            'message': message,
            'context': self.context,
            'sessionId': self.session_id,
        }
        
        if self.user_id:
            payload['userId'] = self.user_id
        
        try:
            response = requests.post(
                url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Actualizar contexto
            self.context.append({'role': 'user', 'content': message})
            self.context.append({'role': 'assistant', 'content': data['reply']})
            
            # Limitar contexto a últimos 10 mensajes
            if len(self.context) > 10:
                self.context = self.context[-10:]
            
            return data
            
        except requests.exceptions.HTTPError as e:
            error_data = e.response.json() if e.response.content else {}
            error_msg = error_data.get('error', str(e))
            raise Exception(f"API Error: {error_msg}")
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}")
    
    def health_check(self) -> Optional[Dict]:
        """
        Verifica el estado de la API
        
        Returns:
            Estado del servicio o None si falla
        """
        url = f"{self.base_url}/api/health"
        
        try:
            response = requests.get(url, timeout=10)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Health check failed: {e}")
            return None
    
    def clear_context(self):
        """Limpia el contexto de la conversación"""
        self.context = []
    
    def get_context(self) -> List[Dict[str, str]]:
        """Retorna el contexto actual"""
        return self.context
    
    def get_session_id(self) -> str:
        """Retorna el ID de sesión"""
        return self.session_id


def simple_example():
    """Ejemplo simple de uso"""
    print("=== Ejemplo Simple ===\n")
    
    url = 'http://localhost:3000/api/chat'
    payload = {
        'message': '¿Cuál es la capital de España?'
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        
        print(f"Usuario: {payload['message']}")
        print(f"Bot: {data['reply']}\n")
        print(f"Tokens usados: {data['usage']['total_tokens']}\n")
        
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


def conversation_example():
    """Ejemplo de conversación con contexto"""
    print("=== Conversación con Contexto ===\n")
    
    bot = ChatbotClient()
    bot.set_user_id('user-python-123')
    
    print(f"Session ID: {bot.get_session_id()}\n")
    
    messages = [
        '¿Qué es Python?',
        '¿Cuáles son sus principales características?',
        'Dame un ejemplo de código simple'
    ]
    
    for message in messages:
        print(f"Usuario: {message}")
        
        try:
            response = bot.chat(message)
            print(f"Bot: {response['reply']}\n")
            print(f"Tokens: {response['usage']['total_tokens']}")
            print(f"Modelo: {response['metadata']['model']}")
            print('-' * 50 + '\n')
            
        except Exception as e:
            print(f"Error: {e}\n")


def error_handling_example():
    """Ejemplo de manejo de errores"""
    print("=== Manejo de Errores ===\n")
    
    bot = ChatbotClient()
    
    # Intentar enviar mensaje vacío
    try:
        bot.chat('')
    except Exception as e:
        print(f"Error esperado (validación): {e}\n")
    
    # Intentar conectar a servidor inexistente
    try:
        bot_invalid = ChatbotClient('http://localhost:9999')
        bot_invalid.chat('test')
    except Exception as e:
        print(f"Error esperado (conexión): {e}\n")


def health_check_example():
    """Ejemplo de health check"""
    print("=== Health Check ===\n")
    
    bot = ChatbotClient()
    health = bot.health_check()
    
    if health:
        print(f"Status: {health['status']}")
        print(f"OpenAI: {health['services']['openai']}")
        print(f"Uptime: {health['uptime']:.2f} segundos")
        print(f"Timestamp: {health['timestamp']}\n")
    else:
        print("API no disponible\n")


def rate_limit_example():
    """Ejemplo de rate limiting"""
    print("=== Rate Limiting ===\n")
    
    bot = ChatbotClient()
    
    print("Enviando múltiples requests...\n")
    
    for i in range(1, 6):
        try:
            response = bot.chat(f"Mensaje de prueba {i}")
            print(f"Request {i}: OK - {response['usage']['total_tokens']} tokens")
            
        except Exception as e:
            print(f"Request {i}: Error - {e}")
    
    print()


def interactive_mode():
    """Modo interactivo de chat"""
    print("=== Modo Interactivo ===\n")
    print("Escribe 'exit' para salir, 'clear' para limpiar contexto\n")
    
    bot = ChatbotClient()
    
    while True:
        try:
            message = input("Tú: ").strip()
            
            if not message:
                continue
            
            if message.lower() == 'exit':
                print("\n¡Hasta luego!")
                break
            
            if message.lower() == 'clear':
                bot.clear_context()
                print("Contexto limpiado.\n")
                continue
            
            response = bot.chat(message)
            print(f"Bot: {response['reply']}\n")
            
        except KeyboardInterrupt:
            print("\n\n¡Hasta luego!")
            break
        except Exception as e:
            print(f"Error: {e}\n")


def main():
    """Función principal"""
    print("╔════════════════════════════════════════╗")
    print("║  Cliente Python - Chatbot AI API      ║")
    print("╚════════════════════════════════════════╝\n")
    
    try:
        # Verificar que la API esté disponible
        response = requests.get('http://localhost:3000/api/health', timeout=5)
        if response.status_code != 200:
            raise Exception("API no disponible")
        
        # Ejecutar ejemplos
        simple_example()
        print('\n' + '=' * 50 + '\n')
        
        conversation_example()
        print('\n' + '=' * 50 + '\n')
        
        error_handling_example()
        print('\n' + '=' * 50 + '\n')
        
        health_check_example()
        print('\n' + '=' * 50 + '\n')
        
        rate_limit_example()
        print('\n' + '=' * 50 + '\n')
        
        # Preguntar si quiere modo interactivo
        choice = input("¿Quieres probar el modo interactivo? (s/n): ").strip().lower()
        if choice == 's':
            print()
            interactive_mode()
        
        print("\n✅ Ejemplos completados!\n")
        
    except requests.exceptions.RequestException:
        print("\n❌ Error: No se puede conectar a la API")
        print("\nAsegúrate de que:")
        print("1. El servidor esté corriendo (npm start)")
        print("2. La variable OPENAI_API_KEY esté configurada")
        print("3. El puerto 3000 esté disponible\n")
    except Exception as e:
        print(f"\n❌ Error: {e}\n")


if __name__ == '__main__':
    main()

