import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User, Company
from app.models.packages import LicensePackage
from app.schemas.packages import PackageTemplateResponse, PurchaseRequest, PackageResponse, ActivateTrackRequest, TEMPLATE_DESCRIPTIONS
from app.services import package_service, audit_service

router = APIRouter(prefix="/packages", tags=["packages"])


@router.get("/templates", response_model=list[PackageTemplateResponse])
async def list_templates(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    templates = await package_service.get_templates(db)
    return [
        PackageTemplateResponse(
            **{c.key: getattr(t, c.key) for c in t.__table__.columns},
            description=TEMPLATE_DESCRIPTIONS.get(t.code, ""),
            price_per_credit_cop=t.price_cop // t.credits_total if t.credits_total else 0,
        )
        for t in templates
    ]


@router.post("/", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
async def purchase(body: PurchaseRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")
    try:
        pkg = await package_service.purchase_package(
            db,
            company_id=current_user.company_id,
            template_id=body.template_id,
            start_date=body.start_date or date.today(),
            idempotency_key=body.idempotency_key,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    tmpl = await package_service.get_template_for_package(db, pkg.template_id)
    company = await package_service.get_company(db, pkg.company_id)
    await audit_service.log_action(db, current_user.id, current_user.company_id, "license_package", pkg.id, "purchase")

    return PackageResponse(
        id=pkg.id,
            company_id=pkg.company_id,
            company_name=company.name if company else "",
            template_id=pkg.template_id,
            template_code=tmpl.code if tmpl else "",
            package_name=pkg.package_name,
            credits_total=pkg.credits_total,
            credits_used=pkg.credits_used,
            credits_blocked=pkg.credits_blocked,
            credits_available=pkg.credits_total - pkg.credits_used - pkg.credits_blocked,
            duration_days=tmpl.duration_days if tmpl else 0,
            start_date=pkg.start_date,
            end_date=pkg.end_date,
            status=pkg.status,
            catalog_scope=tmpl.catalog_scope if tmpl else "full",
            active_track_limit=tmpl.active_track_limit if tmpl else None,
            created_at=pkg.created_at,
        )


@router.get("/", response_model=list[PackageResponse])
async def list_packages(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.company_id:
        return []
    pkgs = await package_service.get_company_packages(db, current_user.company_id)
    company = await package_service.get_company(db, current_user.company_id)
    results = []
    for pkg in pkgs:
        tmpl = await package_service.get_template_for_package(db, pkg.template_id)
        results.append(PackageResponse(
            id=pkg.id,
            company_id=pkg.company_id,
            company_name=company.name if company else "",
            template_id=pkg.template_id,
            template_code=tmpl.code if tmpl else "",
            package_name=pkg.package_name,
            credits_total=pkg.credits_total,
            credits_used=pkg.credits_used,
            credits_blocked=pkg.credits_blocked,
            credits_available=pkg.credits_total - pkg.credits_used - pkg.credits_blocked,
            duration_days=tmpl.duration_days if tmpl else 0,
            start_date=pkg.start_date,
            end_date=pkg.end_date,
            status=pkg.status,
            catalog_scope=tmpl.catalog_scope if tmpl else "full",
            active_track_limit=tmpl.active_track_limit if tmpl else None,
            created_at=pkg.created_at,
        ))
    return results


class PurchaseRequestV2(BaseModel):
    template_id: uuid.UUID
    payment_method: str = "manual"


@router.post("/purchase", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
async def purchase_v2(body: PurchaseRequestV2, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new LicensePackage for the current user's company."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")
    try:
        pkg = await package_service.purchase_package(
            db,
            company_id=current_user.company_id,
            template_id=body.template_id,
            start_date=date.today(),
            idempotency_key=None,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    tmpl = await package_service.get_template_for_package(db, pkg.template_id)
    company = await package_service.get_company(db, pkg.company_id)
    await audit_service.log_action(db, current_user.id, current_user.company_id, "license_package", pkg.id, "purchase_v2", metadata={"payment_method": body.payment_method})

    return PackageResponse(
        id=pkg.id,
        company_id=pkg.company_id,
        company_name=company.name if company else "",
        template_id=pkg.template_id,
        template_code=tmpl.code if tmpl else "",
        package_name=pkg.package_name,
        credits_total=pkg.credits_total,
        credits_used=pkg.credits_used,
        credits_blocked=pkg.credits_blocked,
        credits_available=pkg.credits_total - pkg.credits_used - pkg.credits_blocked,
        duration_days=tmpl.duration_days if tmpl else 0,
        start_date=pkg.start_date,
        end_date=pkg.end_date,
        status=pkg.status,
        catalog_scope=tmpl.catalog_scope if tmpl else "full",
        active_track_limit=tmpl.active_track_limit if tmpl else None,
        created_at=pkg.created_at,
    )


class ValidateRequest(BaseModel):
    track_id: uuid.UUID
    usage_type: str = "standard"




@router.post("/{package_id}/activate-track")
async def activate_track(
    package_id: uuid.UUID,
    body: ActivateTrackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a track to the curated entitlements of a package owned by the current company."""
    from app.models.packages import PackageTrackEntitlement, PackageTemplate
    from datetime import datetime, timezone

    pkg = await db.get(LicensePackage, package_id)
    if not pkg or pkg.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PACKAGE_NOT_FOUND")
    if pkg.status != "active":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="PACKAGE_NOT_ACTIVE")

    # If already activated, return idempotently
    existing = await db.execute(
        select(PackageTrackEntitlement).where(
            PackageTrackEntitlement.package_id == package_id,
            PackageTrackEntitlement.track_id == body.track_id,
        )
    )
    if existing.scalar_one_or_none():
        return {"package_id": str(package_id), "track_id": str(body.track_id), "status": "already_active"}

    # Enforce active_track_limit
    tmpl_q = await db.execute(select(PackageTemplate).where(PackageTemplate.id == pkg.template_id))
    tmpl = tmpl_q.scalar_one_or_none()
    if tmpl and tmpl.active_track_limit:
        count_q = await db.execute(
            select(PackageTrackEntitlement).where(PackageTrackEntitlement.package_id == package_id)
        )
        count = len(count_q.scalars().all())
        if count >= tmpl.active_track_limit:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ACTIVE_TRACK_LIMIT_REACHED")

    entitlement = PackageTrackEntitlement(
        package_id=package_id,
        track_id=body.track_id,
        activated_at=datetime.now(timezone.utc),
        activated_by_user_id=current_user.id,
    )
    db.add(entitlement)
    await db.commit()
    await audit_service.log_action(db, current_user.id, current_user.company_id, "license_package", package_id, "activate_track", metadata={"track_id": str(body.track_id)})
    return {"package_id": str(package_id), "track_id": str(body.track_id), "status": "activated"}


@router.post("/validate")
async def validate_credits(body: ValidateRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Check if the company has available credits for a given track and usage type."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")

    result = await db.execute(
        select(LicensePackage).where(
            LicensePackage.company_id == current_user.company_id,
            LicensePackage.status == "active",
        )
    )
    packages = result.scalars().all()

    best_pkg = None
    best_available = 0
    for pkg in packages:
        available = pkg.credits_total - pkg.credits_used - pkg.credits_blocked
        if available > best_available:
            best_available = available
            best_pkg = pkg

    valid = best_available > 0
    return {
        "valid": valid,
        "available_credits": best_available,
        "package_id": str(best_pkg.id) if best_pkg else None,
    }


@router.get("/my-subscription")
async def get_my_subscription(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return the active LicensePackage for the current company, or null if none."""
    if not current_user.company_id:
        return None

    result = await db.execute(
        select(LicensePackage).where(
            LicensePackage.company_id == current_user.company_id,
            LicensePackage.status == "active",
        ).order_by(LicensePackage.created_at.desc()).limit(1)
    )
    pkg = result.scalars().first()
    if not pkg:
        return None

    tmpl = await package_service.get_template_for_package(db, pkg.template_id)
    return {
        "id": str(pkg.id),
        "package_id": str(pkg.template_id),
        "status": pkg.status,
        "current_period_starts_at": pkg.start_date.isoformat() if pkg.start_date else None,
        "current_period_ends_at": pkg.end_date.isoformat() if pkg.end_date else None,
        "cancel_at_period_end": False,
        "licenses_used_this_period": int(pkg.credits_used),
        "package_name": pkg.package_name,
        "credits_total": pkg.credits_total,
        "credits_available": pkg.credits_total - pkg.credits_used - pkg.credits_blocked,
        "template_code": tmpl.code if tmpl else "",
    }
