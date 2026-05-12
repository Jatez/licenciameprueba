# Licenciame 🎵

Plataforma para gestión de licencias de contenido musical en redes sociales. Detecta, analiza y gestiona el uso de música en Instagram, TikTok y Facebook usando reconocimiento de audio (ACRCloud) y scraping inteligente.

---

## Arquitectura

```
                        ┌─────────────────────────────────────────┐
                        │              Internet / Usuario          │
                        └──────────────────┬──────────────────────┘
                                           │ :80 / :443
                        ┌──────────────────▼──────────────────────┐
                        │            Nginx (reverse proxy)         │
                        │         SSL termination · rate limit     │
                        └────────┬────────────────────┬───────────┘
                                 │ /api               │ /
              ┌──────────────────▼──────┐  ┌──────────▼──────────────┐
              │   Backend (FastAPI)      │  │  Frontend (React + Vite) │
              │   Python 3.12            │  │  Nginx sirve SPA         │
              │   :8000                  │  │  :80                     │
              └──┬───────────┬──────────┘  └─────────────────────────┘
                 │           │
     ┌───────────▼──┐  ┌─────▼────────┐
     │  PostgreSQL  │  │    Redis      │
     │  (datos)     │  │  (caché/jobs) │
     └──────────────┘  └──────────────┘
```

---

## Requisitos previos

- Docker ≥ 24 y Docker Compose plugin (`docker compose version`)
- Make
- Node 20+ (solo para desarrollo sin Docker)
- Python 3.12+ (solo para desarrollo sin Docker)

---

## Setup local (3 comandos)

```bash
git clone https://github.com/tu-org/licenciame.git && cd licenciame
cp backend-oficial/.env.example .env   # edita las variables
make dev
```

La aplicación estará disponible en:
- Frontend → http://localhost:5173
- Backend API → http://localhost:8000/docs
- Swagger UI → http://localhost:8000/api/v2/docs

---

## Variables de entorno importantes

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión async a PostgreSQL | `postgresql+asyncpg://user:pass@db/licenciame` |
| `REDIS_URL` | Conexión a Redis | `redis://:pass@redis:6379/0` |
| `JWT_SECRET_KEY` | Clave firma tokens JWT (**cambiar en prod**) | `openssl rand -hex 32` |
| `FERNET_KEY` | Cifrado simétrico datos sensibles | `Fernet.generate_key()` |
| `STORAGE_BACKEND` | `local` o `s3` | `s3` en producción |
| `AWS_S3_BUCKET` | Bucket S3 para archivos | `licenciame-prod-storage` |
| `META_APP_ID` / `META_APP_SECRET` | OAuth Instagram/Facebook | Panel Meta Developers |
| `TIKTOK_CLIENT_KEY` | OAuth TikTok | Panel TikTok Developers |
| `ACRCLOUD_ACCESS_KEY` | API reconocimiento audio | Panel ACRCloud |
| `APP_ENV` | Entorno: `local`, `staging`, `production` | `production` |

Ver `.env.example` para la lista completa con comentarios.

---

## Deploy en AWS (paso a paso)

### 1. Prerrequisitos AWS
```bash
aws configure   # configura Access Key + región
```

### 2. Crear repositorios ECR
```bash
aws ecr create-repository --repository-name licenciame/backend --region us-east-1
aws ecr create-repository --repository-name licenciame/frontend --region us-east-1
```

### 3. Build y push de imágenes
```bash
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1
ECR=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com

aws ecr get-login-password | docker login --username AWS --password-stdin $ECR

docker build -t $ECR/licenciame/backend:latest ./backend-oficial
docker build -t $ECR/licenciame/frontend:latest ./frontend-figma-v2
docker push $ECR/licenciame/backend:latest
docker push $ECR/licenciame/frontend:latest
```

### 4. RDS (PostgreSQL)
```bash
aws rds create-db-instance \
  --db-instance-identifier licenciame-prod \
  --db-instance-class db.t4g.micro \
  --engine postgres --engine-version 16 \
  --master-username licenciame \
  --master-user-password <SECURE_PASSWORD> \
  --allocated-storage 20 \
  --no-publicly-accessible
```

### 5. ElastiCache (Redis)
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id licenciame-redis \
  --engine redis \
  --cache-node-type cache.t4g.micro \
  --num-cache-nodes 1
```

### 6. ECS Fargate
- Crear cluster: `aws ecs create-cluster --cluster-name licenciame-prod`
- Crear Task Definition con las dos imágenes (backend + frontend), variables de entorno desde AWS Secrets Manager o Parameter Store.
- Crear Service con `FARGATE` launch type.

### 7. ALB (Application Load Balancer)
- Target group backend → puerto 8000, health check `/api/v2/health`
- Target group frontend → puerto 80
- Reglas listener: `/api/*` → backend, `/*` → frontend
- Añadir certificado ACM para HTTPS.

---

## Comandos útiles

```bash
make help           # Lista todos los targets disponibles
make dev            # Desarrollo con hot-reload
make up             # Producción
make down           # Apagar
make build          # Re-construir imágenes
make logs           # Logs en vivo
make migrate        # Alembic upgrade head
make seed           # Datos de prueba
make shell-backend  # Shell en container backend
make shell-db       # psql directo a la BD
```

---

## Estructura de carpetas

```
Licenciame/
├── backend-oficial/        # API FastAPI (Python 3.12)
│   ├── app/
│   │   ├── api/            # Routers por módulo
│   │   ├── core/           # Config, seguridad, DB
│   │   ├── models/         # SQLAlchemy models
│   │   └── services/       # Lógica de negocio
│   ├── alembic/            # Migraciones
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend-figma-v2/      # SPA React + Vite + Tailwind
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/                  # Config nginx producción
│   └── nginx.conf
├── docker-compose.yml      # Producción
├── docker-compose.dev.yml  # Override desarrollo
├── Makefile
└── .env                    # (no en git) — copia de .env.example
```

---

## Credenciales de prueba

> Solo válidas con `make seed` ejecutado.

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@licenciame.com | `Admin1234!` |
| Artista | artista@licenciame.com | `Test1234!` |
| Sello | sello@licenciame.com | `Test1234!` |

---

## Licencia

Propietario — Cristian Agiraldo © 2026. Todos los derechos reservados.
