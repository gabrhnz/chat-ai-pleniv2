#!/usr/bin/env python3
"""
Servidor de embeddings local usando sentence-transformers
Genera embeddings de 512 dimensiones compatibles con la base de datos
"""

import sys
import json
from sentence_transformers import SentenceTransformer

# Modelo ligero y rápido (25MB)
MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
EMBEDDING_DIMENSIONS = 384

def load_model():
    """Carga el modelo de embeddings"""
    try:
        print(f"Cargando modelo {MODEL_NAME}...", file=sys.stderr)
        model = SentenceTransformer(MODEL_NAME)
        print(f"✓ Modelo cargado correctamente", file=sys.stderr)
        return model
    except Exception as e:
        print(f"✗ Error cargando modelo: {e}", file=sys.stderr)
        sys.exit(1)

def generate_embeddings(model, texts):
    """Genera embeddings para una lista de textos"""
    try:
        # Generar embeddings
        embeddings = model.encode(texts, show_progress_bar=False)
        
        # Convertir a lista de listas
        embeddings_list = [emb.tolist() for emb in embeddings]
        
        return embeddings_list
    except Exception as e:
        print(f"✗ Error generando embeddings: {e}", file=sys.stderr)
        return None

def main():
    """Función principal"""
    # Cargar modelo
    model = load_model()
    
    # Leer textos desde stdin (JSON)
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        texts = data.get('texts', [])
        
        if not texts:
            print(json.dumps({'error': 'No texts provided'}))
            sys.exit(1)
        
        # Generar embeddings
        embeddings = generate_embeddings(model, texts)
        
        if embeddings is None:
            print(json.dumps({'error': 'Failed to generate embeddings'}))
            sys.exit(1)
        
        # Retornar resultado
        result = {
            'embeddings': embeddings,
            'model': MODEL_NAME,
            'dimensions': EMBEDDING_DIMENSIONS
        }
        
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON input: {e}'}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'error': f'Unexpected error: {e}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()

