import uuid
from datetime import date, timedelta, timezone, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.packages import PackageTemplate, LicensePackage, PackageTrackEntitlement
from app.models.auth import User, Company


async def get_templates(db: AsyncSession) -> list[PackageTemplate]:
    result = await db.execute(select(PackageTemplate).where(PackageTemplate.is_active == True).order_by(PackageTemplate.credits_total))
    return list(result.scalars().all())


async def purchase_package(db: AsyncSession, company_id: uuid.UUID, template_id: uuid.UUID, start_date: date, idempotency_key: str | None = None) -> LicensePackage:
    # Check idempotency
    if idempotency_key:
        existing = await db.execute(
            select(LicensePackage).where(
                LicensePackage.company_id == company_id,
                LicensePackage.idempotency_key == idempotency_key,
            )
        )
        found = existing.scalar_one_or_none()
        if found:
            return found

    # Get template
    tmpl_result = await db.execute(select(PackageTemplate).where(PackageTemplate.id == template_id))
    tmpl = tmpl_result.scalar_one_or_none()
    if not tmpl or not tmpl.is_active:
        raise ValueError("TEMPLATE_NOT_FOUND")

    end_date = start_date + timedelta(days=tmpl.duration_days)

    pkg = LicensePackage(
        company_id=company_id,
        template_id=template_id,
        package_name=tmpl.name,
        credits_total=tmpl.credits_total,
        credits_used=0,
        credits_blocked=0,
        start_date=start_date,
        end_date=end_date,
        status="active",
        idempotency_key=idempotency_key,
    )
    db.add(pkg)
    await db.flush()
    return pkg


async def get_company_packages(db: AsyncSession, company_id: uuid.UUID) -> list[LicensePackage]:
    result = await db.execute(
        select(LicensePackage).where(LicensePackage.company_id == company_id).order_by(LicensePackage.end_date)
    )
    return list(result.scalars().all())


async def get_current_package(db: AsyncSession, company_id: uuid.UUID) -> LicensePackage | None:
    today = date.today()
    result = await db.execute(
        select(LicensePackage).where(
            LicensePackage.company_id == company_id,
            LicensePackage.status == "active",
            LicensePackage.end_date >= today,
        ).order_by(LicensePackage.end_date, LicensePackage.start_date)
    )
    packages = list(result.scalars().all())
    for pkg in packages:
        if pkg.credits_total - pkg.credits_used - pkg.credits_blocked > 0:
            return pkg
    return packages[0] if packages else None


async def get_template_for_package(db: AsyncSession, template_id: uuid.UUID) -> PackageTemplate | None:
    result = await db.execute(select(PackageTemplate).where(PackageTemplate.id == template_id))
    return result.scalar_one_or_none()


async def get_company(db: AsyncSession, company_id: uuid.UUID) -> Company | None:
    result = await db.execute(select(Company).where(Company.id == company_id))
    return result.scalar_one_or_none()
