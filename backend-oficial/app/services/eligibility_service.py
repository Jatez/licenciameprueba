import uuid
from datetime import date

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import Company
from app.models.packages import LicensePackage, PackageTemplate, PackageTrackEntitlement
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount


async def check_eligibility(
    db: AsyncSession,
    company_id: uuid.UUID,
    track_id: uuid.UUID,
    social_account_id: uuid.UUID,
    content_type: str,
    package_id: uuid.UUID | None = None,
) -> tuple[bool, str, LicensePackage | None]:
    """Returns (eligible, error_code, selected_package)"""

    # 1. Company active
    company = await db.get(Company, company_id)
    if not company or company.status != "active":
        return False, "COMPANY_INACTIVE", None

    # 2. Package active and valid
    today = date.today()
    if package_id:
        pkg = await db.get(LicensePackage, package_id)
        if not pkg or pkg.company_id != company_id:
            return False, "PACKAGE_NOT_FOUND", None
    else:
        result = await db.execute(
            select(LicensePackage).where(
                LicensePackage.company_id == company_id,
                LicensePackage.status == "active",
                LicensePackage.end_date >= today,
            ).order_by(LicensePackage.end_date, LicensePackage.start_date)
        )
        pkgs = list(result.scalars().all())
        pkg = None
        for p in pkgs:
            if p.credits_total - p.credits_used - p.credits_blocked > 0:
                pkg = p
                break
        if not pkg:
            return False, "NO_CREDITS_AVAILABLE", None

    if pkg.status != "active" or pkg.end_date < today:
        return False, "PACKAGE_EXPIRED", None

    # 3. Credits available
    available = pkg.credits_total - pkg.credits_used - pkg.credits_blocked
    if available < 1:
        return False, "NO_CREDITS_AVAILABLE", None

    # 4. Social account connected
    account = await db.get(SocialAccount, social_account_id)
    if not account or account.company_id != company_id or account.status != "connected":
        return False, "SOCIAL_ACCOUNT_INVALID", None

    # 5. Track active
    track = await db.get(Track, track_id)
    if not track or not track.active:
        return False, "TRACK_INACTIVE", None

    # 6. License rule valid
    platform = content_type.split("_")[0]
    if platform == "ig":
        platform = "instagram"
    elif platform == "fb":
        platform = "facebook"

    rules_result = await db.execute(
        select(TrackLicenseRule).where(
            TrackLicenseRule.track_id == track_id,
            TrackLicenseRule.valid_from <= today,
        )
    )
    rules = list(rules_result.scalars().all())

    valid_rule = None
    for rule in rules:
        if rule.valid_until and rule.valid_until < today:
            continue
        if platform not in (rule.allowed_platforms or []):
            continue
        if content_type not in (rule.allowed_content_types or []):
            continue
        # Territory check (empty list = no territories allowed, null = global)
        if rule.territories is not None and company.country_code not in rule.territories:
            continue
        valid_rule = rule
        break

    if not valid_rule:
        return False, "NO_VALID_LICENSE_RULE", None

    # 7. Curated check
    tmpl_result = await db.execute(select(PackageTemplate).where(PackageTemplate.id == pkg.template_id))
    tmpl = tmpl_result.scalar_one_or_none()
    if tmpl and tmpl.catalog_scope == "curated":
        entitlement = await db.execute(
            select(PackageTrackEntitlement).where(
                PackageTrackEntitlement.package_id == pkg.id,
                PackageTrackEntitlement.track_id == track_id,
            )
        )
        if not entitlement.scalar_one_or_none():
            return False, "TRACK_NOT_IN_CURATED_PACKAGE", None

    return True, "", pkg
