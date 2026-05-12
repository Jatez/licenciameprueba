"""Tests for authentication API endpoints."""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import User
from app.services import auth_service


class TestLogin:
    async def test_login_success(self, client: AsyncClient, user_admin: User, db: AsyncSession):
        await db.commit()
        resp = await client.post("/api/v2/auth/login", json={
            "email": "admin@acme.com",
            "password": "Admin123!",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_wrong_password(self, client: AsyncClient, user_admin: User, db: AsyncSession):
        await db.commit()
        resp = await client.post("/api/v2/auth/login", json={
            "email": "admin@acme.com",
            "password": "WrongPassword!",
        })
        assert resp.status_code == 401

    async def test_login_nonexistent_user(self, client: AsyncClient):
        resp = await client.post("/api/v2/auth/login", json={
            "email": "nobody@nowhere.com",
            "password": "SomePass123!",
        })
        assert resp.status_code == 401

    async def test_login_inactive_user(self, client: AsyncClient, user_inactive: User, db: AsyncSession):
        await db.commit()
        resp = await client.post("/api/v2/auth/login", json={
            "email": "inactive@acme.com",
            "password": "Pass123!",
        })
        assert resp.status_code == 403


class TestRefreshToken:
    async def test_refresh_token_valid(self, client: AsyncClient, user_admin: User, db: AsyncSession):
        await db.commit()
        login = await client.post("/api/v2/auth/login", json={
            "email": "admin@acme.com",
            "password": "Admin123!",
        })
        refresh_token = login.json()["refresh_token"]
        resp = await client.post("/api/v2/auth/refresh", json={"refresh_token": refresh_token})
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data

    async def test_refresh_token_invalid(self, client: AsyncClient):
        resp = await client.post("/api/v2/auth/refresh", json={"refresh_token": "fake-token-xyz"})
        assert resp.status_code == 401

    async def test_refresh_token_reuse_rejected(self, client: AsyncClient, user_admin: User, db: AsyncSession):
        """Using a refresh token twice should fail on second use."""
        await db.commit()
        login = await client.post("/api/v2/auth/login", json={
            "email": "admin@acme.com",
            "password": "Admin123!",
        })
        rt = login.json()["refresh_token"]
        # First rotation succeeds
        r1 = await client.post("/api/v2/auth/refresh", json={"refresh_token": rt})
        assert r1.status_code == 200
        # Second use of original token should fail
        r2 = await client.post("/api/v2/auth/refresh", json={"refresh_token": rt})
        assert r2.status_code == 401


class TestProtectedEndpoints:
    async def test_no_token_returns_401(self, client: AsyncClient, user_admin: User, db: AsyncSession):
        await db.commit()
        resp = await client.get("/api/v2/auth/me")
        assert resp.status_code == 403  # HTTPBearer returns 403 when no credentials

    async def test_valid_token_returns_200(self, client: AsyncClient, auth_headers: dict):
        resp = await client.get("/api/v2/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "admin@acme.com"

    async def test_invalid_token_returns_403(self, client: AsyncClient):
        resp = await client.get("/api/v2/auth/me", headers={"Authorization": "Bearer invalid.token.here"})
        assert resp.status_code == 401
