"""Licenses API — exposes published_usages as user-visible 'licenses'.

Cada PublishedUsage representa una licencia individual emitida para usar un track
en una publicación específica. Los créditos consumidos vienen del LicensePackage
correspondiente.
"""
from datetime import datetime, timezone
from typing import Any
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User
from app.models.publishing import PublishedUsage
from app.models.packages import LicensePackage
from app.models.catalog import Track

router = APIRouter(prefix="/licenses", tags=["licenses"])


def _serialize(u: PublishedUsage, track: Track | None, pkg: LicensePackage | None) -> dict[str, Any]:
    return {
        "id": str(u.id),
        "track_id": str(u.track_id) if u.track_id else None,
        "track_title": track.title if track else None,
        "artist": track.artist if track else None,
        "license_type": pkg.package_name if pkg else "Uso único",
        "status": u.status,
        "coverage_type": u.coverage_type,
        "platform": u.platform,
        "content_type": u.content_type,
        "external_media_id": u.external_media_id,
        "external_url": u.external_url,
        "published_at": u.published_at.isoformat() if u.published_at else None,
        "issued_at": u.created_at.isoformat() if u.created_at else None,
        "expires_at": pkg.end_date.isoformat() if pkg and pkg.end_date else None,
        "package_id": str(u.package_id) if u.package_id else None,
        "evidence": u.evidence_json or {},
    }


@router.get("/")
async def list_licenses(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    status_filter: str | None = Query(default=None, alias="status"),
    platform: str | None = Query(default=None),
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    where = [PublishedUsage.company_id == current_user.company_id]
    if status_filter:
        where.append(PublishedUsage.status == status_filter)
    if platform:
        where.append(PublishedUsage.platform == platform)
    if date_from:
        try:
            dt = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            where.append(PublishedUsage.created_at >= dt)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_DATE_FROM")
    if date_to:
        try:
            dt = datetime.strptime(date_to, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
            where.append(PublishedUsage.created_at <= dt)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_DATE_TO")

    result = await db.execute(
        select(PublishedUsage).where(*where).order_by(desc(PublishedUsage.created_at)).limit(limit).offset(offset)
    )
    usages = list(result.scalars().all())

    # Cargar tracks y packages relacionados
    track_ids = {u.track_id for u in usages if u.track_id}
    pkg_ids = {u.package_id for u in usages if u.package_id}

    tracks_map: dict[uuid.UUID, Track] = {}
    if track_ids:
        tracks_q = await db.execute(select(Track).where(Track.id.in_(track_ids)))
        tracks_map = {t.id: t for t in tracks_q.scalars().all()}

    pkgs_map: dict[uuid.UUID, LicensePackage] = {}
    if pkg_ids:
        pkgs_q = await db.execute(select(LicensePackage).where(LicensePackage.id.in_(pkg_ids)))
        pkgs_map = {p.id: p for p in pkgs_q.scalars().all()}

    return [_serialize(u, tracks_map.get(u.track_id) if u.track_id else None, pkgs_map.get(u.package_id) if u.package_id else None) for u in usages]


@router.get("/{license_id}")
async def get_license(
    license_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    usage = await db.get(PublishedUsage, license_id)
    if not usage or usage.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LICENSE_NOT_FOUND")

    track = await db.get(Track, usage.track_id) if usage.track_id else None
    pkg = await db.get(LicensePackage, usage.package_id) if usage.package_id else None
    return _serialize(usage, track, pkg)


@router.post("/{license_id}/cancel")
async def cancel_license(
    license_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    usage = await db.get(PublishedUsage, license_id)
    if not usage or usage.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LICENSE_NOT_FOUND")

    if usage.status == "cancelled":
        return {"success": True, "license_id": str(usage.id), "status": "cancelled"}

    usage.status = "cancelled"
    await db.commit()
    return {"success": True, "license_id": str(usage.id), "status": "cancelled"}
