"""Tests for app.core.dependencies — auth helpers and role checks."""
import uuid

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, require_roles, get_request_id
from app.core.security import create_access_token
from app.models.auth import User


class TestGetCurrentUser:
    @pytest.mark.asyncio
    async def test_valid_token_returns_user(self, db: AsyncSession, user_admin):
        token = create_access_token(str(user_admin.id), user_admin.role, str(user_admin.company_id))
        creds = MagicMock()
        creds.credentials = token

        user = await get_current_user(credentials=creds, db=db)
        assert user.id == user_admin.id
        assert user.email == "admin@acme.com"

    @pytest.mark.asyncio
    async def test_invalid_token_raises_401(self, db: AsyncSession):
        creds = MagicMock()
        creds.credentials = "invalid.jwt.token"

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=creds, db=db)
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_suspended_user_raises_401(self, db: AsyncSession, user_inactive):
        token = create_access_token(str(user_inactive.id), user_inactive.role, str(user_inactive.company_id))
        creds = MagicMock()
        creds.credentials = token

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=creds, db=db)
        assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_nonexistent_user_raises_401(self, db: AsyncSession, company):
        fake_id = str(uuid.uuid4())
        token = create_access_token(fake_id, "admin", str(company.id))
        creds = MagicMock()
        creds.credentials = token

        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(credentials=creds, db=db)
        assert exc_info.value.status_code == 401


class TestRequireRoles:
    @pytest.mark.asyncio
    async def test_allowed_role_passes(self, db: AsyncSession, user_admin):
        checker = require_roles("admin", "super_admin")
        # checker is a dependency that receives a user
        result = await checker(user=user_admin)
        assert result.role == "admin"

    @pytest.mark.asyncio
    async def test_disallowed_role_raises_403(self, db: AsyncSession, user_creator):
        checker = require_roles("admin", "super_admin")
        with pytest.raises(HTTPException) as exc_info:
            await checker(user=user_creator)
        assert exc_info.value.status_code == 403


class TestGetRequestId:
    def test_returns_header_value(self):
        request = MagicMock()
        request.headers.get.return_value = "req-12345"
        assert get_request_id(request) == "req-12345"

    def test_generates_id_when_no_header(self):
        request = MagicMock()
        request.headers = {}  # real dict so .get() default works
        req_id = get_request_id(request)
        assert req_id is not None
        assert len(req_id) > 0
