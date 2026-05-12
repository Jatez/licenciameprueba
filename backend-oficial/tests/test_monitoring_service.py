"""Tests for app.services.monitoring_service."""
import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import Company, User
from app.models.catalog import Track
from app.models.monitoring import ExternalContent, AudioDetection
from app.models.packages import LicensePackage
from app.models.social import SocialAccount
from app.services import monitoring_service


# ── Helper to create test content + detection directly ──

async def _create_content(
    db: AsyncSession,
    company: Company,
    account: SocialAccount,
    status: str = "unmatched",
    content_type: str = "ig_reel",
) -> ExternalContent:
    c = ExternalContent(
        company_id=company.id,
        social_account_id=account.id,
        platform=account.platform,
        content_type=content_type,
        external_media_id=f"ext_{uuid.uuid4().hex[:10]}",
        external_url=f"https://www.instagram.com/reel/{uuid.uuid4().hex[:10]}",
        posted_at=datetime.now(timezone.utc),
        reconciliation_status=status,
    )
    db.add(c)
    await db.flush()
    return c


async def _create_detection(
    db: AsyncSession,
    company: Company,
    content: ExternalContent,
    track: Track | None = None,
    status: str = "matched",
    confidence: float = 0.92,
) -> AudioDetection:
    d = AudioDetection(
        company_id=company.id,
        external_content_id=content.id,
        detector_provider="acrcloud",
        detection_status=status,
        matched_track_id=track.id if track else None,
        confidence_score=confidence,
        matched_title=track.title if track else "Unknown",
        matched_artist=track.artist if track else "Unknown",
        raw_result_json={},
        created_at=datetime.now(timezone.utc),
    )
    db.add(d)
    await db.flush()
    return d


class TestSyncAccount:
    async def test_wrong_account_raises(self, db: AsyncSession, company: Company):
        with pytest.raises(ValueError, match="SOCIAL_ACCOUNT_NOT_FOUND"):
            await monitoring_service.sync_account(db, company.id, uuid.uuid4())

    async def test_missing_username_raises(
        self, db: AsyncSession, company: Company, social_account_no_username: SocialAccount
    ):
        with pytest.raises(ValueError, match="MISSING_USERNAME"):
            await monitoring_service.sync_account(db, company.id, social_account_no_username.id)

    async def test_sync_status_invalid_company(self, db: AsyncSession):
        """Syncing with a completely invalid company+account combo should raise."""
        with pytest.raises(ValueError):
            await monitoring_service.sync_account(db, uuid.uuid4(), uuid.uuid4())


class TestGetExternalContents:
    async def test_returns_company_contents(
        self, db: AsyncSession, company: Company, social_account_ig: SocialAccount
    ):
        await _create_content(db, company, social_account_ig, status="matched_usage")
        await _create_content(db, company, social_account_ig, status="unmatched")
        await _create_content(db, company, social_account_ig, status="manual_review")
        contents = await monitoring_service.get_external_contents(db, company.id)
        assert len(contents) == 3

    async def test_filter_by_status(
        self, db: AsyncSession, company: Company, social_account_ig: SocialAccount
    ):
        await _create_content(db, company, social_account_ig, status="matched_usage")
        await _create_content(db, company, social_account_ig, status="matched_usage")
        await _create_content(db, company, social_account_ig, status="manual_review")
        matched = await monitoring_service.get_external_contents(db, company.id, status="matched_usage")
        review = await monitoring_service.get_external_contents(db, company.id, status="manual_review")
        assert len(matched) == 2
        assert len(review) == 1

    async def test_sync_status_returns_expected_fields(
        self, db: AsyncSession, company: Company, social_account_ig: SocialAccount
    ):
        """Verify that content objects returned have expected attributes."""
        await _create_content(db, company, social_account_ig, status="unmatched")
        contents = await monitoring_service.get_external_contents(db, company.id)
        assert len(contents) == 1
        c = contents[0]
        assert hasattr(c, "reconciliation_status")
        assert hasattr(c, "company_id")
        assert hasattr(c, "platform")
        assert c.company_id == company.id

    async def test_empty_for_unknown_company(self, db: AsyncSession):
        contents = await monitoring_service.get_external_contents(db, uuid.uuid4())
        assert contents == []


class TestGetDetectionsForContent:
    async def test_returns_detections(
        self, db: AsyncSession, company: Company, social_account_ig: SocialAccount, track: Track
    ):
        content = await _create_content(db, company, social_account_ig)
        await _create_detection(db, company, content, track)
        det = await monitoring_service.get_detections_for_content(db, content.id)
        assert len(det) == 1
        assert det[0].matched_track_id == track.id


class TestResolveTrack:
    async def test_resolves_content(
        self, db: AsyncSession, company: Company, social_account_ig: SocialAccount,
        track: Track, package_active: LicensePackage, user_admin: User,
    ):
        content = await _create_content(db, company, social_account_ig, status="manual_review")
        await _create_detection(db, company, content, status="uncertain", confidence=0.6)
        resolved = await monitoring_service.resolve_track(
            db, content, track.id, package_active.id, "Matched manually", user_admin.id,
        )
        assert resolved.reconciliation_status == "matched_usage"
