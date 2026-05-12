"""Tests for app.services.auth_service."""
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import User, RefreshToken
from app.core.security import hash_password, hash_token
from app.services import auth_service


class TestAuthenticateUser:
    async def test_valid_credentials(self, db: AsyncSession, user_admin: User):
        user = await auth_service.authenticate_user(db, "admin@acme.com", "Admin123!")
        assert user is not None
        assert user.email == "admin@acme.com"

    async def test_wrong_password(self, db: AsyncSession, user_admin: User):
        user = await auth_service.authenticate_user(db, "admin@acme.com", "WrongPass")
        assert user is None

    async def test_nonexistent_email(self, db: AsyncSession):
        user = await auth_service.authenticate_user(db, "nobody@e.com", "Pass")
        assert user is None

    async def test_failed_attempts_increment(self, db: AsyncSession, user_admin: User):
        await auth_service.authenticate_user(db, "admin@acme.com", "bad1")
        await db.refresh(user_admin)
        assert user_admin.failed_login_attempts == 1

        await auth_service.authenticate_user(db, "admin@acme.com", "bad2")
        await db.refresh(user_admin)
        assert user_admin.failed_login_attempts == 2

    async def test_lockout_at_5_attempts(self, db: AsyncSession, user_admin: User):
        for i in range(5):
            await auth_service.authenticate_user(db, "admin@acme.com", f"bad{i}")
        await db.refresh(user_admin)
        assert user_admin.locked_until is not None
        # Even correct password should fail while locked
        user = await auth_service.authenticate_user(db, "admin@acme.com", "Admin123!")
        assert user is None

    async def test_success_resets_failed_attempts(self, db: AsyncSession, user_admin: User):
        # Fail a few times
        await auth_service.authenticate_user(db, "admin@acme.com", "bad1")
        await auth_service.authenticate_user(db, "admin@acme.com", "bad2")
        # Then succeed
        user = await auth_service.authenticate_user(db, "admin@acme.com", "Admin123!")
        assert user is not None
        assert user.failed_login_attempts == 0
        assert user.locked_until is None


class TestCreateTokenPair:
    async def test_returns_tokens(self, db: AsyncSession, user_admin: User):
        result = await auth_service.create_token_pair(db, user_admin)
        assert "access_token" in result
        assert "refresh_token" in result
        assert result["token_type"] == "bearer"

    async def test_stores_refresh_in_db(self, db: AsyncSession, user_admin: User):
        result = await auth_service.create_token_pair(db, user_admin)
        raw = result["refresh_token"]
        h = hash_token(raw)
        from sqlalchemy import select
        row = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == h))
        rt = row.scalar_one_or_none()
        assert rt is not None
        assert rt.user_id == user_admin.id
        assert rt.is_revoked is False


class TestRotateRefreshToken:
    async def test_rotate_valid_token(self, db: AsyncSession, user_admin: User):
        pair = await auth_service.create_token_pair(db, user_admin)
        new_pair = await auth_service.rotate_refresh_token(db, pair["refresh_token"])
        assert new_pair is not None
        assert new_pair["refresh_token"] != pair["refresh_token"]

    async def test_rotate_invalid_token(self, db: AsyncSession):
        result = await auth_service.rotate_refresh_token(db, "completely-fake-token")
        assert result is None

    async def test_reused_token_revokes_family(self, db: AsyncSession, user_admin: User):
        pair1 = await auth_service.create_token_pair(db, user_admin)
        old_raw = pair1["refresh_token"]

        # Rotate → pair2
        pair2 = await auth_service.rotate_refresh_token(db, old_raw)
        assert pair2 is not None

        # Try reusing old token → family revoked
        result = await auth_service.rotate_refresh_token(db, old_raw)
        assert result is None

        # Even pair2's refresh should be revoked now
        result2 = await auth_service.rotate_refresh_token(db, pair2["refresh_token"])
        assert result2 is None
