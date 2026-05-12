#!/bin/bash
# ─────────────────────────────────────────────
# Licenciame — Script de arranque local
# Backend:  FastAPI (puerto 8000)
# Frontend: Vite/React (puerto 8080)
# ngrok:    túnel público al backend (dominio reservado)
# ─────────────────────────────────────────────

set -e

BASE="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$BASE/backend-oficial"
FRONTEND="$BASE/frontend-figma-v2"
PY312="${PY312:-/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12}"
NGROK_DOMAIN="gregory-quittable-tyra.ngrok-free.dev"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}▶ Iniciando Licenciame...${NC}"

# ── Limpia procesos viejos en los puertos ───────────────────────────────
for PORT in 8000 8080; do
  PID=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    echo -e "${YELLOW}  Liberando puerto $PORT (PID $PID)${NC}"
    kill $PID 2>/dev/null || true
    sleep 1
  fi
done
pkill -f "ngrok http" 2>/dev/null || true

# ── Backend ──────────────────────────────────
echo -e "${YELLOW}→ Backend (puerto 8000)${NC}"

# Si el venv apunta a un python inexistente lo recreamos
if [ -d "$BACKEND/venv" ]; then
  if ! "$BACKEND/venv/bin/python" --version >/dev/null 2>&1; then
    echo -e "${YELLOW}  venv corrupto, recreando con $PY312${NC}"
    rm -rf "$BACKEND/venv"
  fi
fi

if [ ! -d "$BACKEND/venv" ]; then
  if [ ! -x "$PY312" ]; then
    echo -e "${RED}  ✗ No se encontró python3.12 en $PY312${NC}"
    echo "    Exporta PY312=/ruta/a/python3.12 antes de correr este script."
    exit 1
  fi
  "$PY312" -m venv "$BACKEND/venv"
  "$BACKEND/venv/bin/pip" install --upgrade pip -q
  "$BACKEND/venv/bin/pip" install -r "$BACKEND/requirements.txt" -q
fi

cd "$BACKEND"
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/licenciame_backend.log 2>&1 &
BACKEND_PID=$!
echo "  PID backend: $BACKEND_PID (logs: /tmp/licenciame_backend.log)"

# ── ngrok ────────────────────────────────────
echo -e "${YELLOW}→ ngrok (https://$NGROK_DOMAIN → :8000)${NC}"
nohup ngrok http --domain="$NGROK_DOMAIN" 8000 > /tmp/licenciame_ngrok.log 2>&1 &
NGROK_PID=$!
echo "  PID ngrok: $NGROK_PID (logs: /tmp/licenciame_ngrok.log)"

# ── Frontend ─────────────────────────────────
echo -e "${YELLOW}→ Frontend (puerto 8080)${NC}"
cd "$FRONTEND"
if [ ! -d "node_modules" ]; then
  echo "  Instalando dependencias..."
  npm install -q
fi
nohup npm run dev > /tmp/licenciame_frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  PID frontend: $FRONTEND_PID (logs: /tmp/licenciame_frontend.log)"

# ── Espera y abre ────────────────────────────
sleep 5
echo ""
echo -e "${GREEN}✅ Licenciame corriendo${NC}"
echo "   Backend local:    http://localhost:8000/docs"
echo "   Backend público:  https://$NGROK_DOMAIN/docs"
echo "   Frontend:         http://localhost:8080"
echo ""
echo "   Login: manager@acme.com / Manager123!"
echo ""
echo "Presiona Ctrl+C para detener TODOS los servicios."

open http://localhost:8080 2>/dev/null || true

trap "echo ''; echo 'Deteniendo...'; kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
