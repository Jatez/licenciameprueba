"""
Licenciame API — application entry point.

Responsibilities:
- Configure structured logging before anything else
- Build the FastAPI app with production-grade middleware
- Register global exception handlers
- Mount all API routers
"""

import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# ── Logging must be set up before any other app imports ─────────────────────
from app.core.logging import setup_logging

setup_logging()

import logging

from app.core.config import get_settings

# ── Sentry — inicializar antes de crear la app ───────────────────────────────
try:
    import sentry_sdk
    _sentry_settings = get_settings()
    if _sentry_settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=_sentry_settings.SENTRY_DSN,
            traces_sample_rate=0.1,
            environment=_sentry_settings.APP_ENV,
        )
        logging.getLogger(__name__).info("Sentry inicializado (env=%s)", _sentry_settings.APP_ENV)
except ImportError:
    logging.getLogger(__name__).warning("sentry-sdk no instalado — monitoreo de errores deshabilitado")

from app.core.exceptions import (
    LicenciameError,
    NotFoundError,
    ForbiddenError,
    BusinessRuleError,
    ExternalServiceError,
)
from app.core.scheduler import start_scheduler, stop_scheduler
from app.api import router as health_router
from app.api.auth import router as auth_router
from app.api.packages import router as packages_router
from app.api.tracks import router as tracks_router
from app.api.social import router as social_router
from app.api.monitoring import router as monitoring_router
from app.api.metrics import router as metrics_router
from app.api.admin import router as admin_router
from app.api.meta_oauth import router as meta_oauth_router
from app.api.tiktok_oauth import router as tiktok_oauth_router
from app.api.catalog_ingest import router as catalog_ingest_router
from app.api.publish import router as publish_router
from app.api.licenses import router as licenses_router
from app.api.notifications_api import router as notifications_router
from app.api.exports import router as exports_router
from app.api.payments import router as payments_router

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Rate limiting (slowapi) ──────────────────────────────────────────────────
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
    _slowapi_available = True
except ImportError:
    limiter = None  # type: ignore
    _slowapi_available = False
    logger.warning("slowapi not installed — rate limiting disabled")


# ── Lifespan ────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    tasks = await start_scheduler()
    logger.info("Licenciame API started", extra={"env": settings.APP_ENV})
    yield
    await stop_scheduler(tasks)
    logger.info("Licenciame API shut down")


# ── App factory ─────────────────────────────────────────────────────────────
is_prod = settings.APP_ENV == "production"

app = FastAPI(
    title="Licenciame API",
    version="0.1.0",
    lifespan=lifespan,
    # Disable interactive docs in production
    openapi_url=None if is_prod else "/openapi.json",
    docs_url=None if is_prod else "/docs",
    redoc_url=None if is_prod else "/redoc",
)

# Attach limiter to app state
if _slowapi_available and limiter:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore


# ── Middleware ───────────────────────────────────────────────────────────────

# 1. Trusted hosts (production only)
if is_prod:
    from starlette.middleware.trustedhost import TrustedHostMiddleware

    trusted = [h.strip() for h in settings.TRUSTED_HOSTS.split(",") if h.strip()]
    if trusted:
        app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted)


# 2. Security headers
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security-related HTTP response headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if is_prod:
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )
        return response


app.add_middleware(SecurityHeadersMiddleware)


# 3. Request logging + request-id injection
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every request with method, path, status, duration and request_id."""

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", uuid.uuid4().hex[:16])
        request.state.request_id = request_id
        start = time.monotonic()
        response = await call_next(request)
        duration_ms = round((time.monotonic() - start) * 1000, 2)
        response.headers["X-Request-ID"] = request_id
        logger.info(
            "HTTP request",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "request_id": request_id,
            },
        )
        return response


app.add_middleware(RequestLoggingMiddleware)


# 4. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global exception handlers ────────────────────────────────────────────────

def _request_id(request: Request) -> str:
    return getattr(request.state, "request_id", uuid.uuid4().hex[:16])


def _error_response(request: Request, status_code: int, error: str, detail: str | list) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": error, "detail": detail, "request_id": _request_id(request)},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Return consistent JSON for Pydantic validation errors."""
    return _error_response(
        request,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "ValidationError",
        exc.errors(),
    )


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    return _error_response(request, status.HTTP_404_NOT_FOUND, exc.code, exc.message)


@app.exception_handler(ForbiddenError)
async def forbidden_handler(request: Request, exc: ForbiddenError):
    return _error_response(request, status.HTTP_403_FORBIDDEN, exc.code, exc.message)


@app.exception_handler(BusinessRuleError)
async def business_rule_handler(request: Request, exc: BusinessRuleError):
    return _error_response(request, status.HTTP_409_CONFLICT, exc.code, exc.message)


@app.exception_handler(ExternalServiceError)
async def external_service_handler(request: Request, exc: ExternalServiceError):
    logger.error("External service error: %s", exc.message, exc_info=exc)
    return _error_response(request, status.HTTP_502_BAD_GATEWAY, exc.code, exc.message)


@app.exception_handler(LicenciameError)
async def licenciame_error_handler(request: Request, exc: LicenciameError):
    logger.error("Unhandled domain error: %s", exc.message, exc_info=exc)
    return _error_response(request, status.HTTP_500_INTERNAL_SERVER_ERROR, exc.code, exc.message)


# ── Routers ──────────────────────────────────────────────────────────────────
PREFIX = "/api/v2"
app.include_router(health_router, prefix=PREFIX)
app.include_router(auth_router, prefix=PREFIX)
app.include_router(packages_router, prefix=PREFIX)
app.include_router(tracks_router, prefix=PREFIX)
app.include_router(social_router, prefix=PREFIX)
app.include_router(monitoring_router, prefix=PREFIX)
app.include_router(metrics_router, prefix=PREFIX)
app.include_router(admin_router, prefix=PREFIX)
app.include_router(meta_oauth_router, prefix=PREFIX)
app.include_router(tiktok_oauth_router, prefix=PREFIX)
app.include_router(catalog_ingest_router, prefix=PREFIX)
app.include_router(publish_router, prefix=PREFIX)
app.include_router(licenses_router, prefix=PREFIX)
app.include_router(notifications_router, prefix=PREFIX)
app.include_router(payments_router, prefix=PREFIX)
app.include_router(exports_router, prefix=PREFIX)
