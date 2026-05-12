"""Tests for app.services.eligibility_service — 8-point eligibility check."""
import uuid
from datetime import date, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import Company, User
from app.models.packages import PackageTemplate, LicensePackage, PackageTrackEntitlement
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount
from app.services.eligibility_service import check_eligibility


class TestCheckEligibility:
    """Each test isolates one check-point of the 8-point system."""

    async def test_happy_path(
        self, db: AsyncSession, company, package_active, track, license_rule, social_account_ig
    ):
        ok, err, pkg = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is True
        assert err == ""
        assert pkg is not None

    async def test_company_inactive(
        self, db: AsyncSession, company_inactive, package_active, track, license_rule, social_account_ig
    ):
        ok, err, _ = await check_eligibility(
            db, company_inactive.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "COMPANY_INACTIVE"

    async def test_no_package(self, db: AsyncSession, company, track, license_rule, social_account_ig):
        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_CREDITS_AVAILABLE"

    async def test_package_expired(
        self, db: AsyncSession, company, template_pro, track, license_rule, social_account_ig
    ):
        expired = LicensePackage(
            company_id=company.id, template_id=template_pro.id, package_name="Old",
            credits_total=50, credits_used=0, credits_blocked=0,
            start_date=date.today() - timedelta(days=60), end_date=date.today() - timedelta(days=1),
            status="active",
        )
        db.add(expired)
        await db.flush()

        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False

    async def test_no_credits_available(
        self, db: AsyncSession, company, template_pro, track, license_rule, social_account_ig
    ):
        full = LicensePackage(
            company_id=company.id, template_id=template_pro.id, package_name="Full",
            credits_total=10, credits_used=10, credits_blocked=0,
            start_date=date.today() - timedelta(days=5), end_date=date.today() + timedelta(days=25),
            status="active",
        )
        db.add(full)
        await db.flush()

        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_CREDITS_AVAILABLE"

    async def test_social_account_disconnected(
        self, db: AsyncSession, company, package_active, track, license_rule, social_account_disconnected
    ):
        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_disconnected.id, "ig_reel",
        )
        assert ok is False
        assert err == "SOCIAL_ACCOUNT_INVALID"

    async def test_track_inactive(
        self, db: AsyncSession, company, package_active, track_inactive, license_rule, social_account_ig
    ):
        ok, err, _ = await check_eligibility(
            db, company.id, track_inactive.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "TRACK_INACTIVE"

    async def test_no_license_rule(self, db: AsyncSession, company, package_active, track, social_account_ig):
        """Track exists but has no license rule → fails."""
        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_VALID_LICENSE_RULE"

    async def test_wrong_platform(
        self, db: AsyncSession, company, package_active, track, social_account_ig
    ):
        rule = TrackLicenseRule(
            track_id=track.id,
            allowed_platforms=["other_platform"],  # Not instagram
            allowed_content_types=["other_type"],
            valid_from=date.today() - timedelta(days=10),
        )
        db.add(rule)
        await db.flush()

        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_VALID_LICENSE_RULE"

    async def test_wrong_content_type(
        self, db: AsyncSession, company, package_active, track, social_account_ig
    ):
        rule = TrackLicenseRule(
            track_id=track.id,
            allowed_platforms=["instagram"],
            allowed_content_types=["ig_story"],  # Not ig_reel
            valid_from=date.today() - timedelta(days=10),
        )
        db.add(rule)
        await db.flush()

        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_VALID_LICENSE_RULE"

    async def test_territory_mismatch(
        self, db: AsyncSession, company, package_active, track, social_account_ig
    ):
        rule = TrackLicenseRule(
            track_id=track.id,
            allowed_platforms=["instagram"],
            allowed_content_types=["ig_reel"],
            territories=["US", "UK"],  # company is CO
            valid_from=date.today() - timedelta(days=10),
        )
        db.add(rule)
        await db.flush()

        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "NO_VALID_LICENSE_RULE"

    async def test_curated_requires_entitlement(
        self, db: AsyncSession, company, track, license_rule, social_account_ig, template_curated
    ):
        pkg = LicensePackage(
            company_id=company.id, template_id=template_curated.id, package_name="Curated",
            credits_total=10, credits_used=0, credits_blocked=0,
            start_date=date.today() - timedelta(days=5), end_date=date.today() + timedelta(days=25),
            status="active",
        )
        db.add(pkg)
        await db.flush()

        # No entitlement → fails
        ok, err, _ = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is False
        assert err == "TRACK_NOT_IN_CURATED_PACKAGE"

    async def test_curated_with_entitlement_passes(
        self, db: AsyncSession, company, user_admin, track, license_rule, social_account_ig, template_curated
    ):
        pkg = LicensePackage(
            company_id=company.id, template_id=template_curated.id, package_name="Curated",
            credits_total=10, credits_used=0, credits_blocked=0,
            start_date=date.today() - timedelta(days=5), end_date=date.today() + timedelta(days=25),
            status="active",
        )
        db.add(pkg)
        await db.flush()

        ent = PackageTrackEntitlement(
            package_id=pkg.id, track_id=track.id, activated_by_user_id=user_admin.id,
        )
        db.add(ent)
        await db.flush()

        ok, err, sel_pkg = await check_eligibility(
            db, company.id, track.id, social_account_ig.id, "ig_reel",
        )
        assert ok is True
        assert sel_pkg.id == pkg.id
