#!/bin/bash

# Auto Deploy Script
# Hace commit y push automático después de agregar FAQs
# Esto activa el deploy automático en Vercel

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AUTO DEPLOY - Preparando cambios...${NC}\n"

# Verificar si hay cambios
if [[ -z $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  No hay cambios para hacer commit${NC}"
  exit 0
fi

# Mostrar archivos modificados
echo -e "${BLUE}📝 Archivos modificados:${NC}"
git status -s

# Agregar archivos de scripts y servicios
echo -e "\n${BLUE}➕ Agregando archivos...${NC}"
git add scripts/data/*.js scripts/fixes/*.js src/services/*.js 2>/dev/null

# Crear mensaje de commit automático con timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="chore: auto-update FAQs - $TIMESTAMP"

echo -e "\n${BLUE}💾 Haciendo commit...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Commit exitoso${NC}"
  
  echo -e "\n${BLUE}📤 Pusheando a GitHub...${NC}"
  git push origin main
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Push exitoso - Deploy en Vercel iniciado automáticamente${NC}"
    echo -e "${BLUE}🔗 Verifica el deploy en: https://vercel.com/dashboard${NC}\n"
  else
    echo -e "\n${YELLOW}⚠️  Error en push - verifica tu conexión${NC}\n"
    exit 1
  fi
else
  echo -e "\n${YELLOW}⚠️  No hay cambios para hacer commit${NC}\n"
  exit 0
fi
