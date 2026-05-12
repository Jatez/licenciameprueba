import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.auth import Company, User
from app.models.packages import PackageTemplate, LicensePackage
from app.models.catalog import Track
from app.models.social import SocialAccount
from app.models.audit import AuditLog
from app.schemas.auth import CompanyResponse, UserResponse, CompanyUpdate
from app.services import audit_service

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_roles("admin", "super_admin"))])


@router.get("/companies", response_model=list[CompanyResponse])
async def list_companies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company).order_by(Company.name))
    return [CompanyResponse.model_validate(c, from_attributes=True) for c in result.scalars().all()]


@router.patch("/companies/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: uuid.UUID,
    body: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "super_admin")),
):
    company = await db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="COMPANY_NOT_FOUND")
    if body.name is not None:
        company.name = body.name
    if body.status is not None:
        company.status = body.status
    await db.flush()
    await audit_service.log_action(
        db, current_user.id, company_id, "company", company_id, "update",
        metadata=body.model_dump(exclude_none=True),
    )
    return CompanyResponse.model_validate(company, from_attributes=True)


@router.get("/users", response_model=list[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.email))
    return [UserResponse.model_validate(u, from_attributes=True) for u in result.scalars().all()]


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: uuid.UUID,
    role: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("super_admin")),
):
    valid_roles = {"viewer", "creator", "manager", "admin", "super_admin"}
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(sorted(valid_roles))}")
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="USER_NOT_FOUND")
    user.role = role
    await db.flush()
    await audit_service.log_action(
        db, current_user.id, user.company_id, "user", user_id, "role_change",
        metadata={"new_role": role},
    )
    return {"id": str(user.id), "email": user.email, "role": user.role}


@router.patch("/tracks/{track_id}/toggle")
async def toggle_track(
    track_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "super_admin")),
):
    """Activate or deactivate a track (for takedown / reactivation)."""
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="TRACK_NOT_FOUND")
    track.active = not track.active
    await db.flush()
    await audit_service.log_action(
        db, current_user.id, None, "track", track_id,
        "activate" if track.active else "deactivate",
    )
    return {"id": str(track.id), "title": track.title, "active": track.active}


@router.get("/audit-logs")
async def list_audit_logs(limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)
    )
    logs = result.scalars().all()
    return [
        {
            "id": str(log.id),
            "actor_user_id": str(log.actor_user_id) if log.actor_user_id else None,
            "entity_type": log.entity_type,
            "entity_id": str(log.entity_id) if log.entity_id else None,
            "action": log.action,
            "request_id": log.request_id,
            "metadata_json": log.metadata_json,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


@router.get("/stats")
async def admin_stats(db: AsyncSession = Depends(get_db)):
    """Overview stats for admin dashboard."""
    companies = await db.execute(select(func.count(Company.id)))
    users = await db.execute(select(func.count(User.id)))
    accounts = await db.execute(select(func.count(SocialAccount.id)).where(SocialAccount.status == "connected"))
    packages = await db.execute(select(func.count(LicensePackage.id)).where(LicensePackage.status == "active"))
    tracks = await db.execute(select(func.count(Track.id)).where(Track.active == True))
    return {
        "total_companies": companies.scalar() or 0,
        "total_users": users.scalar() or 0,
        "connected_accounts": accounts.scalar() or 0,
        "active_packages": packages.scalar() or 0,
        "active_tracks": tracks.scalar() or 0,
    }
