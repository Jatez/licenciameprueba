"""Tests for health endpoint."""
import pytest
from httpx import AsyncClient


class TestHealthEndpoint:
    async def test_health_returns_200(self, client: AsyncClient):
        resp = await client.get("/api/v2/health")
        assert resp.status_code == 200

    async def test_health_includes_status(self, client: AsyncClient):
        resp = await client.get("/api/v2/health")
        data = resp.json()
        assert "status" in data
        assert data["status"] == "ok"

    async def test_health_no_auth_required(self, client: AsyncClient):
        """Health endpoint must be publicly accessible — no Bearer token needed."""
        resp = await client.get("/api/v2/health")
        assert resp.status_code != 401
        assert resp.status_code != 403
