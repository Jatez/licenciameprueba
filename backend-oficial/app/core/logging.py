"""
Structured logging configuration for Licenciame.

- Production  → JSON via python-json-logger, level INFO
- Development → Human-readable, level DEBUG
"""

import logging
import sys

from app.core.config import get_settings


def setup_logging() -> None:
    """Configure root logger. Call once at application startup."""
    settings = get_settings()
    is_prod = settings.APP_ENV == "production"
    level = logging.INFO if is_prod else logging.DEBUG

    if is_prod:
        try:
            from pythonjsonlogger import jsonlogger  # type: ignore

            handler = logging.StreamHandler(sys.stdout)
            formatter = jsonlogger.JsonFormatter(
                fmt="%(asctime)s %(levelname)s %(name)s %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%SZ",
            )
            handler.setFormatter(formatter)
        except ImportError:
            # Fallback if package not installed — still safe
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(
                logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")
            )
    else:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s [%(levelname)-8s] %(name)s: %(message)s",
                datefmt="%H:%M:%S",
            )
        )

    root = logging.getLogger()
    root.setLevel(level)
    # Remove any existing handlers to avoid duplicate output
    root.handlers.clear()
    root.addHandler(handler)

    # Silence noisy libraries in production
    if is_prod:
        for noisy in ("sqlalchemy.engine", "httpx", "httpcore"):
            logging.getLogger(noisy).setLevel(logging.WARNING)
