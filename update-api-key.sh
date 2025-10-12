#!/bin/bash

# Script para actualizar la API key de OpenAI

echo "🔑 Actualizar API Key de OpenAI"
echo "================================"
echo ""
echo "Por favor, pega tu API key de OpenAI:"
read -s API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ No ingresaste ninguna API key"
    exit 1
fi

# Validar longitud aproximada
KEY_LENGTH=${#API_KEY}
if [ $KEY_LENGTH -lt 100 ]; then
    echo "⚠️  Advertencia: La API key parece muy corta ($KEY_LENGTH caracteres)"
    echo "Las API keys de OpenAI suelen tener ~164 caracteres"
    echo ""
    echo "¿Continuar de todas formas? (s/n)"
    read -n 1 CONFIRM
    echo ""
    if [ "$CONFIRM" != "s" ]; then
        echo "Cancelado"
        exit 1
    fi
fi

# Backup del .env actual
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ Backup creado: .env.backup"
fi

# Actualizar la API key
sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$API_KEY|" .env

echo "✅ API key actualizada en .env"
echo ""
echo "Ahora reinicia el servidor:"
echo "  1. Detén el servidor actual (Ctrl+C)"
echo "  2. Ejecuta: npm start"
echo ""

