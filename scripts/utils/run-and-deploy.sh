#!/bin/bash

# Run and Deploy Script
# Ejecuta un script de FAQs y luego hace auto-deploy
#
# Uso: ./scripts/utils/run-and-deploy.sh <script-path>
# Ejemplo: ./scripts/utils/run-and-deploy.sh scripts/data/add-new-faqs.js

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que se pasó un script
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Debes especificar un script${NC}"
  echo -e "${YELLOW}Uso: ./scripts/utils/run-and-deploy.sh <script-path>${NC}"
  echo -e "${YELLOW}Ejemplo: ./scripts/utils/run-and-deploy.sh scripts/data/add-new-faqs.js${NC}"
  exit 1
fi

SCRIPT_PATH=$1

# Verificar que el script existe
if [ ! -f "$SCRIPT_PATH" ]; then
  echo -e "${RED}❌ Error: El script '$SCRIPT_PATH' no existe${NC}"
  exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 RUN AND DEPLOY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Ejecutar el script
echo -e "${BLUE}📝 Ejecutando: $SCRIPT_PATH${NC}\n"
node "$SCRIPT_PATH"

# Verificar si el script se ejecutó correctamente
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Script ejecutado exitosamente${NC}\n"
  
  # Ejecutar auto-deploy
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}🚀 Iniciando Auto-Deploy...${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
  
  ./scripts/utils/auto-deploy.sh
else
  echo -e "\n${RED}❌ Error ejecutando el script${NC}"
  echo -e "${YELLOW}⚠️  No se hará deploy debido al error${NC}\n"
  exit 1
fi
