import base64
import logging

from cryptography.fernet import Fernet
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings
from functools import lru_cache

logger = logging.getLogger(__name__)

DEFAULT_JWT_SECRET = "local-dev-secret-change-in-production-abc123"


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://dualtee:dualtee_local_2026@localhost:5432/dualtee"
    DATABASE_URL_SYNC: str = "postgresql://dualtee:dualtee_local_2026@localhost:5432/dualtee"
    REDIS_URL: str = "redis://:licenciame_redis_2026@localhost:6379/0"

    JWT_SECRET_KEY: str = DEFAULT_JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    FERNET_KEY: str = "ZmVybmV0LWtleS1mb3ItbG9jYWwtZGV2ZWxvcG1lbnQ="

    STORAGE_BACKEND: str = "local"
    LOCAL_STORAGE_PATH: str = "./storage"

    ACRCLOUD_HOST: str = ""
    ACRCLOUD_ACCESS_KEY: str = ""
    ACRCLOUD_ACCESS_SECRET: str = ""

    YTDLP_COOKIES_FROM_BROWSER: str = ""

    INSTAGRAM_USERNAME: str = ""
    INSTAGRAM_PASSWORD: str = ""

    # Meta (Facebook/Instagram) OAuth
    META_APP_ID: str = ""
    META_APP_SECRET: str = ""
    META_REDIRECT_URI: str = "http://localhost:8000/api/v2/auth/meta/callback"
    META_FB_REDIRECT_URI: str = "http://localhost:8000/api/v2/auth/meta/fb-callback"

    FB_APP_ID: str = ""
    FB_APP_SECRET: str = ""

    # TikTok OAuth
    TIKTOK_CLIENT_KEY: str = ""
    TIKTOK_CLIENT_SECRET: str = ""
    TIKTOK_REDIRECT_URI: str = "http://localhost:8000/api/v2/auth/tiktok/callback"

    # ── SMTP transaccional ──────────────────────────────────────────────────
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    # ── Sentry ──────────────────────────────────────────────────────────────
    SENTRY_DSN: str = ""

    APP_ENV: str = "local"
    APP_DEBUG: bool = True
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:8080,http://localhost:8081"

    # URL del frontend a la que el backend redirige después del callback OAuth.
    # Independiente de CORS_ORIGINS porque éste suele contener varios orígenes (ngrok, vercel, etc).
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Wompi (pasarela de pago colombiana) ────────────────
    WOMPI_PUBLIC_KEY: str = "pub_test_sandbox_key_here"
    WOMPI_PRIVATE_KEY: str = "prv_test_sandbox_key_here"
    WOMPI_EVENTS_SECRET: str = "test_events_secret_here"

    # Rate limiting (requests per minute for auth endpoints)
    AUTH_RATE_LIMIT: str = "10/minute"

    # Trusted hosts (comma-separated, used in production)
    TRUSTED_HOSTS: str = "localhost,127.0.0.1"

    model_config = {"env_file": "../.env", "env_file_encoding": "utf-8", "extra": "ignore"}

    @field_validator("FERNET_KEY")
    @classmethod
    def validate_fernet_key(cls, v: str) -> str:
        """Ensure FERNET_KEY is a valid 32-byte URL-safe base64 Fernet key."""
        try:
            Fernet(v.encode() if isinstance(v, str) else v)
        except Exception as exc:
            raise ValueError(
                f"FERNET_KEY is not a valid Fernet key: {exc}. "
                "Generate one with: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
            ) from exc
        return v

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        """Fail fast if insecure defaults are used in production."""
        if self.APP_ENV == "production":
            if self.JWT_SECRET_KEY == DEFAULT_JWT_SECRET:
                raise ValueError(
                    "JWT_SECRET_KEY must not use the default value in production. "
                    "Set a strong random secret in your environment."
                )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
