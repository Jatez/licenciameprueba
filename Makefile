# ── Licenciame — Makefile ────────────────────────────────────────────────────
# Uso: make <target>
# Requiere: docker, docker-compose (v2 o plugin)

COMPOSE      = docker compose
COMPOSE_DEV  = $(COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml
BACKEND_CTR  = licenciame-backend-1

.PHONY: help dev up down build logs test migrate seed shell-backend shell-db

help:  ## Mostrar esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

dev:  ## Levantar en modo desarrollo (hot-reload)
	$(COMPOSE_DEV) up --build

up:  ## Levantar en modo producción
	$(COMPOSE) up -d --build

down:  ## Bajar todos los servicios
	$(COMPOSE) down

build:  ## Construir (o reconstruir) todas las imágenes
	$(COMPOSE) build --no-cache

logs:  ## Ver logs en tiempo real
	$(COMPOSE) logs -f

test:  ## Correr tests del backend
	$(COMPOSE_DEV) run --rm backend pytest tests/ -v

migrate:  ## Aplicar migraciones Alembic
	$(COMPOSE_DEV) run --rm backend alembic upgrade head

seed:  ## Poblar la BD con datos de prueba
	$(COMPOSE_DEV) run --rm backend python seed.py

shell-backend:  ## Abrir shell interactivo en el container backend
	$(COMPOSE) exec backend /bin/bash

shell-db:  ## Abrir psql directo en la BD
	$(COMPOSE) exec db psql -U $${POSTGRES_USER:-licenciame} $${POSTGRES_DB:-licenciame}
