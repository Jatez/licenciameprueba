#!/bin/bash
# deploy-frontend-figma.sh — Levanta el frontend-figma-v2 en puerto 8081
# Este es el frontend donde van los cambios de diseño basados en Figma.
# NO usar para el frontend-semi-oficial (ese corre en :8080 y no se toca).

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/frontend-figma-v2"

echo "🎨 Iniciando frontend-figma-v2 en :8081..."

cd "$FRONTEND"

if [ ! -d node_modules ]; then
  echo "   📦 Instalando dependencias npm..."
  npm install
fi

echo "   ✅ Abriendo en http://localhost:8081"
echo "   (Para detener: Ctrl+C)"
echo ""

# Vite tiene el puerto 8080 en vite.config.ts, lo sobreescribimos con --port
npm run dev -- --port 8081
