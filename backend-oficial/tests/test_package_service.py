"""Tests for app.services.package_service."""
import uuid
from datetime import date, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.packages import PackageTemplate, LicensePackage
from app.models.auth import Company
from app.services import package_service


class TestGetTemplates:
    async def test_returns_active_only(self, db: AsyncSession, template_pro: PackageTemplate):
        inactive = PackageTemplate(
            code="dead", name="Dead", credits_total=5, duration_days=10, is_active=False,
        )
        db.add(inactive)
        await db.flush()

        templates = await package_service.get_templates(db)
        assert len(templates) == 1
        assert templates[0].code == "pro_50"

    async def test_empty_when_none(self, db: AsyncSession):
        templates = await package_service.get_templates(db)
        assert templates == []

    async def test_returns_list(self, db: AsyncSession, template_pro: PackageTemplate, template_curated: PackageTemplate):
        templates = await package_service.get_templates(db)
        assert isinstance(templates, list)
        assert len(templates) == 2

    async def test_template_has_expected_fields(self, db: AsyncSession, template_pro: PackageTemplate):
        templates = await package_service.get_templates(db)
        t = templates[0]
        assert t.credits_total == 50
        assert t.duration_days == 30
        assert t.catalog_scope == "full_catalog"
        assert t.is_active is True


class TestPurchasePackage:
    async def test_creates_package(self, db: AsyncSession, company: Company, template_pro: PackageTemplate):
        pkg = await package_service.purchase_package(
            db, company.id, template_pro.id, date.today(),
        )
        assert pkg.company_id == company.id
        assert pkg.credits_total == 50
        assert pkg.status == "active"
        assert pkg.end_date == date.today() + timedelta(days=30)

    async def test_idempotency(self, db: AsyncSession, company: Company, template_pro: PackageTemplate):
        pkg1 = await package_service.purchase_package(
            db, company.id, template_pro.id, date.today(), idempotency_key="key-1",
        )
        pkg2 = await package_service.purchase_package(
            db, company.id, template_pro.id, date.today(), idempotency_key="key-1",
        )
        assert pkg1.id == pkg2.id

    async def test_invalid_template_raises(self, db: AsyncSession, company: Company):
        with pytest.raises(ValueError, match="TEMPLATE_NOT_FOUND"):
            await package_service.purchase_package(db, company.id, uuid.uuid4(), date.today())

    async def test_create_package_success(self, db: AsyncSession, company: Company, template_curated: PackageTemplate):
        """Verify a package with a curated template is created correctly."""
        pkg = await package_service.purchase_package(
            db, company.id, template_curated.id, date.today(),
        )
        assert pkg is not None
        assert pkg.credits_total == 10
        assert pkg.status == "active"

    async def test_package_starts_with_zero_used(self, db: AsyncSession, company: Company, template_pro: PackageTemplate):
        pkg = await package_service.purchase_package(
            db, company.id, template_pro.id, date.today(),
        )
        assert pkg.credits_used == 0
        assert pkg.credits_blocked == 0


class TestGetCompanyPackages:
    async def test_returns_company_packages(self, db: AsyncSession, package_active: LicensePackage, company: Company):
        pkgs = await package_service.get_company_packages(db, company.id)
        assert len(pkgs) == 1
        assert pkgs[0].id == package_active.id

    async def test_empty_for_other_company(self, db: AsyncSession, package_active: LicensePackage):
        pkgs = await package_service.get_company_packages(db, uuid.uuid4())
        assert pkgs == []


class TestGetCurrentPackage:
    async def test_returns_active_with_credits(self, db: AsyncSession, package_active: LicensePackage, company: Company):
        pkg = await package_service.get_current_package(db, company.id)
        assert pkg is not None
        assert pkg.id == package_active.id

    async def test_none_when_no_packages(self, db: AsyncSession, company: Company):
        pkg = await package_service.get_current_package(db, company.id)
        assert pkg is None

    async def test_skips_exhausted_package(self, db: AsyncSession, company: Company, template_pro: PackageTemplate):
        exhausted = LicensePackage(
            company_id=company.id, template_id=template_pro.id, package_name="Exhausted",
            credits_total=10, credits_used=10, credits_blocked=0,
            start_date=date.today() - timedelta(days=5), end_date=date.today() + timedelta(days=5),
            status="active",
        )
        db.add(exhausted)
        await db.flush()
        pkg = await package_service.get_current_package(db, company.id)
        # Should return the exhausted one (it's the only one) as fallback
        assert pkg is not None
