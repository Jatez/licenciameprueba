"""Tests for app.core.exceptions domain exception classes."""
import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.exceptions import (
    LicenciameError,
    NotFoundError,
    ForbiddenError,
    BusinessRuleError,
    ExternalServiceError,
)


# ── Unit tests for exception classes ────────────────────────────────────────

class TestExceptionClasses:
    def test_not_found_error_has_message(self):
        err = NotFoundError("Track not found", code="TRACK_NOT_FOUND")
        assert err.message == "Track not found"
        assert err.code == "TRACK_NOT_FOUND"
        assert isinstance(err, LicenciameError)

    def test_not_found_default_code(self):
        err = NotFoundError("missing")
        assert err.code == "NotFoundError"

    def test_forbidden_error(self):
        err = ForbiddenError("Not allowed")
        assert err.message == "Not allowed"
        assert isinstance(err, LicenciameError)

    def test_business_rule_error(self):
        err = BusinessRuleError("Quota exceeded", code="QUOTA_EXCEEDED")
        assert err.code == "QUOTA_EXCEEDED"
        assert isinstance(err, LicenciameError)

    def test_external_service_error(self):
        err = ExternalServiceError("ACRCloud down", code="ACRCLOUD_ERROR")
        assert err.code == "ACRCLOUD_ERROR"
        assert isinstance(err, LicenciameError)

    def test_licenciame_error_is_exception(self):
        with pytest.raises(LicenciameError):
            raise LicenciameError("test")

    def test_not_found_is_exception(self):
        with pytest.raises(NotFoundError):
            raise NotFoundError("not found")


# ── Integration tests: exception handlers via HTTP client ────────────────────

class TestExceptionHandlers:
    async def test_not_found_returns_404(self, client: AsyncClient):
        """NotFoundError should map to 404 via global exception handler."""
        from app.main import app
        from fastapi import APIRouter

        # Register a temporary test route
        temp_router = APIRouter()

        @temp_router.get("/test-not-found")
        async def _raise():
            raise NotFoundError("resource missing", code="RESOURCE_NOT_FOUND")

        app.include_router(temp_router, prefix="/api/v2")

        resp = await client.get("/api/v2/test-not-found")
        assert resp.status_code == 404
        body = resp.json()
        assert body["error"] == "RESOURCE_NOT_FOUND"

    async def test_forbidden_returns_403(self, client: AsyncClient):
        from app.main import app
        from fastapi import APIRouter

        temp_router = APIRouter()

        @temp_router.get("/test-forbidden")
        async def _raise():
            raise ForbiddenError("nope", code="NOPE")

        app.include_router(temp_router, prefix="/api/v2")
        resp = await client.get("/api/v2/test-forbidden")
        assert resp.status_code == 403

    async def test_business_rule_returns_409(self, client: AsyncClient):
        from app.main import app
        from fastapi import APIRouter

        temp_router = APIRouter()

        @temp_router.get("/test-business")
        async def _raise():
            raise BusinessRuleError("quota exceeded", code="QUOTA_EXCEEDED")

        app.include_router(temp_router, prefix="/api/v2")
        resp = await client.get("/api/v2/test-business")
        assert resp.status_code == 409

    async def test_validation_error_returns_422(self, client: AsyncClient):
        """Sending bad JSON body to a typed endpoint should return 422."""
        resp = await client.post("/api/v2/auth/login", json={"wrong_field": "value"})
        assert resp.status_code == 422
        body = resp.json()
        assert "error" in body or "detail" in body
