"""Exports API — genera PDFs y CSVs para descargar desde el frontend."""
from __future__ import annotations

import io
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, desc, func, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User
from app.models.packages import LicensePackage
from app.models.catalog import Track
from app.models.publishing import PublishedUsage
from app.services import export_service

router = APIRouter(prefix="/exports", tags=["exports"])


# ── Helpers ───────────────────────────────────────────────────────────────────

def _parse_date(s: str | None, end_of_day: bool = False) -> datetime | None:
    if not s:
        return None
    try:
        d = datetime.strptime(s, "%Y-%m-%d")
        if end_of_day:
            d = d.replace(hour=23, minute=59, second=59)
        return d.replace(tzinfo=timezone.utc)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_DATE_FORMAT")


def _streaming(content: bytes, media_type: str, filename: str) -> StreamingResponse:
    return StreamingResponse(
        io.BytesIO(content),
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


async def _fetch_licenses(
    db: AsyncSession,
    company_id: uuid.UUID,
    date_from: str | None,
    date_to: str | None,
) -> list[dict[str, Any]]:
    """Fetch and serialize up to 10 000 license records for export."""
    where = [PublishedUsage.company_id == company_id]
    dt_from = _parse_date(date_from)
    dt_to = _parse_date(date_to, end_of_day=True)
    if dt_from:
        where.append(PublishedUsage.created_at >= dt_from)
    if dt_to:
        where.append(PublishedUsage.created_at <= dt_to)

    result = await db.execute(
        select(PublishedUsage)
        .where(*where)
        .order_by(desc(PublishedUsage.created_at))
        .limit(10_000)
    )
    usages = list(result.scalars().all())

    track_ids = {u.track_id for u in usages if u.track_id}
    pkg_ids = {u.package_id for u in usages if u.package_id}

    tracks_map: dict[uuid.UUID, Track] = {}
    if track_ids:
        tr = await db.execute(select(Track).where(Track.id.in_(track_ids)))
        tracks_map = {t.id: t for t in tr.scalars().all()}

    pkgs_map: dict[uuid.UUID, LicensePackage] = {}
    if pkg_ids:
        pr = await db.execute(select(LicensePackage).where(LicensePackage.id.in_(pkg_ids)))
        pkgs_map = {p.id: p for p in pr.scalars().all()}

    rows = []
    for u in usages:
        track = tracks_map.get(u.track_id) if u.track_id else None
        pkg = pkgs_map.get(u.package_id) if u.package_id else None
        rows.append({
            "id": str(u.id),
            "track_title": track.title if track else "",
            "artist": track.artist if track else "",
            "platform": u.platform or "",
            "status": u.status or "",
            "usage_type": u.coverage_type or (pkg.package_name if pkg else ""),
            "credits_consumed": 0,
            "issued_at": u.created_at.isoformat() if u.created_at else "",
            "published_at": u.published_at.isoformat() if u.published_at else "",
        })
    return rows


# ── Endpoints ─────────────────────────────────────────────────────────────────


@router.get("/licenses/pdf")
async def export_licenses_pdf(
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Descarga tabla de licencias en PDF."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")

    # Get company name
    from app.models.auth import Company
    company = await db.get(Company, current_user.company_id)
    company_name = company.name if company else "Mi Empresa"

    licenses = await _fetch_licenses(db, current_user.company_id, date_from, date_to)
    pdf_bytes = export_service.export_licenses_pdf(licenses, company_name)

    filename = f"licencias_{datetime.utcnow().strftime('%Y%m%d')}.pdf"
    return _streaming(pdf_bytes, "application/pdf", filename)


@router.get("/licenses/csv")
async def export_licenses_csv(
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Descarga tabla de licencias en CSV."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")

    licenses = await _fetch_licenses(db, current_user.company_id, date_from, date_to)
    csv_bytes = export_service.export_licenses_csv(licenses)

    filename = f"licencias_{datetime.utcnow().strftime('%Y%m%d')}.csv"
    return _streaming(csv_bytes, "text/csv; charset=utf-8-sig", filename)


@router.get("/purchases/csv")
async def export_purchases_csv(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Descarga historial de compras en CSV."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")

    result = await db.execute(
        select(LicensePackage)
        .where(LicensePackage.company_id == current_user.company_id)
        .order_by(desc(LicensePackage.created_at))
        .limit(10_000)
    )
    pkgs = list(result.scalars().all())
    packages = [
        {
            "id": str(p.id),
            "package_name": p.package_name or "",
            "credits_total": p.credits_total,
            "credits_used": p.credits_used,
            "credits_blocked": p.credits_blocked,
            "price_cop": "",
            "start_date": p.start_date.isoformat() if p.start_date else "",
            "end_date": p.end_date.isoformat() if p.end_date else "",
            "status": p.status or "",
        }
        for p in pkgs
    ]
    csv_bytes = export_service.export_purchases_csv(packages)

    filename = f"compras_{datetime.utcnow().strftime('%Y%m%d')}.csv"
    return _streaming(csv_bytes, "text/csv; charset=utf-8-sig", filename)


@router.get("/usage-report/pdf")
async def export_usage_report_pdf(
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Descarga reporte ejecutivo de uso en PDF."""
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="NO_COMPANY")

    from app.models.auth import Company
    company = await db.get(Company, current_user.company_id)
    company_name = company.name if company else "Mi Empresa"

    licenses = await _fetch_licenses(db, current_user.company_id, date_from, date_to)

    # Compute metrics from fetched data
    platforms: dict[str, dict[str, int]] = {}
    statuses: dict[str, int] = {}
    track_ids_set: set[str] = set()
    for lic in licenses:
        plat = lic.get("platform") or "Desconocida"
        platforms.setdefault(plat, {"count": 0, "credits": 0})
        platforms[plat]["count"] += 1
        platforms[plat]["credits"] += int(lic.get("credits_consumed") or 0)
        st = lic.get("status") or "unknown"
        statuses[st] = statuses.get(st, 0) + 1
        if lic.get("track_title"):
            track_ids_set.add(lic["track_title"])

    metrics = {
        "total_licenses": len(licenses),
        "total_credits_used": sum(int(l.get("credits_consumed") or 0) for l in licenses),
        "platforms_count": len(platforms),
        "tracks_count": len(track_ids_set),
        "by_platform": [
            {"platform": k, "count": v["count"], "credits": v["credits"]}
            for k, v in sorted(platforms.items(), key=lambda x: -x[1]["count"])
        ],
        "by_status": [
            {"status": k, "count": v}
            for k, v in sorted(statuses.items(), key=lambda x: -x[1])
        ],
    }

    period = f"{date_from or 'inicio'} — {date_to or 'hoy'}"
    pdf_bytes = export_service.export_usage_report_pdf(metrics, company_name, period)

    filename = f"reporte_uso_{datetime.utcnow().strftime('%Y%m%d')}.pdf"
    return _streaming(pdf_bytes, "application/pdf", filename)
