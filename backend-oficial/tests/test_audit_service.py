"""Tests for app.services.audit_service — audit log creation."""
import uuid
from datetime import datetime, timezone

import pytest
import pytest_asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import audit_service
from app.models.audit import AuditLog


class TestLogAction:
    @pytest.mark.asyncio
    async def test_creates_audit_log(self, db: AsyncSession, company, user_admin):
        entry = await audit_service.log_action(
            db,
            actor_user_id=user_admin.id,
            company_id=company.id,
            entity_type="user",
            entity_id=user_admin.id,
            action="login",
        )
        assert entry.id is not None
        assert entry.actor_user_id == user_admin.id
        assert entry.company_id == company.id
        assert entry.entity_type == "user"
        assert entry.action == "login"
        assert entry.created_at is not None

    @pytest.mark.asyncio
    async def test_stores_metadata(self, db: AsyncSession, company, user_admin):
        meta = {"ip": "192.168.1.1", "browser": "Chrome"}
        entry = await audit_service.log_action(
            db,
            actor_user_id=user_admin.id,
            company_id=company.id,
            entity_type="package",
            entity_id=uuid.uuid4(),
            action="purchase",
            metadata=meta,
        )
        assert entry.metadata_json == meta

    @pytest.mark.asyncio
    async def test_stores_request_id(self, db: AsyncSession, company, user_admin):
        entry = await audit_service.log_action(
            db,
            actor_user_id=user_admin.id,
            company_id=company.id,
            entity_type="track",
            entity_id=uuid.uuid4(),
            action="create",
            request_id="req_abc123",
        )
        assert entry.request_id == "req_abc123"

    @pytest.mark.asyncio
    async def test_nullable_fields(self, db: AsyncSession):
        entry = await audit_service.log_action(
            db,
            actor_user_id=None,
            company_id=None,
            entity_type="system",
            entity_id=None,
            action="startup",
        )
        assert entry.actor_user_id is None
        assert entry.company_id is None
        assert entry.entity_id is None

    @pytest.mark.asyncio
    async def test_persisted_in_db(self, db: AsyncSession, company, user_admin):
        entry = await audit_service.log_action(
            db, user_admin.id, company.id, "user", user_admin.id, "test_action"
        )
        result = await db.execute(select(AuditLog).where(AuditLog.id == entry.id))
        fetched = result.scalar_one()
        assert fetched.action == "test_action"
