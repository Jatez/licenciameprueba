from datetime import datetime, timezone, date as date_type
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, case, distinct, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User
from app.models.packages import LicensePackage
from app.models.catalog import Track
from app.models.social import SocialAccount
from app.models.monitoring import ExternalContent, AudioDetection
from app.models.publishing import PublishedUsage
from app.schemas.monitoring import MetricsOverviewResponse

router = APIRouter(prefix="/metrics", tags=["metrics"])


def _parse_date(s: str | None, end_of_day: bool = False) -> datetime | None:
    """Parse a YYYY-MM-DD string into a tz-aware UTC datetime, or return None."""
    if not s:
        return None
    try:
        d = datetime.strptime(s, "%Y-%m-%d")
        if end_of_day:
            d = d.replace(hour=23, minute=59, second=59)
        return d.replace(tzinfo=timezone.utc)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"INVALID_DATE: '{s}' debe tener formato YYYY-MM-DD",
        )


@router.get("/overview", response_model=MetricsOverviewResponse)
async def overview(
    date_from: str | None = Query(default=None, description="Filter from this date (YYYY-MM-DD)"),
    date_to: str | None = Query(default=None, description="Filter until this date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cid = current_user.company_id
    dt_from = _parse_date(date_from)
    dt_to = _parse_date(date_to, end_of_day=True)

    # Total credits (no time filter — credits are a current snapshot of the package)
    pkg_result = await db.execute(
        select(
            func.coalesce(func.sum(LicensePackage.credits_total), 0),
            func.coalesce(func.sum(LicensePackage.credits_used), 0),
            func.coalesce(func.sum(LicensePackage.credits_blocked), 0),
        ).where(LicensePackage.company_id == cid, LicensePackage.status == "active")
    )
    row = pkg_result.one()
    total, used, blocked = int(row[0]), int(row[1]), int(row[2])

    # External content counts — filtered by posted_at
    ext_where = [ExternalContent.company_id == cid]
    if dt_from:
        ext_where.append(ExternalContent.posted_at >= dt_from)
    if dt_to:
        ext_where.append(ExternalContent.posted_at <= dt_to)

    ext_result = await db.execute(
        select(ExternalContent.reconciliation_status, func.count())
        .where(*ext_where)
        .group_by(ExternalContent.reconciliation_status)
    )
    external_by_status = {row[0]: row[1] for row in ext_result.all()}

    # Total tracks in catalog
    tracks_total_result = await db.execute(select(func.count()).select_from(Track).where(Track.active == True))
    total_tracks = tracks_total_result.scalar() or 0

    # Tracks by genre
    genre_result = await db.execute(
        select(func.coalesce(Track.genre, 'sin género'), func.count())
        .where(Track.active == True)
        .group_by(Track.genre)
        .order_by(func.count().desc())
    )
    tracks_by_genre = {row[0]: row[1] for row in genre_result.all()}

    # Social accounts for company
    social_result = await db.execute(
        select(func.count()).select_from(SocialAccount).where(SocialAccount.company_id == cid, SocialAccount.status == "connected")
    )
    total_social_accounts = social_result.scalar() or 0

    # Detection stats (for this company) — filtered by AudioDetection.created_at
    det_where = [AudioDetection.company_id == cid]
    if dt_from:
        det_where.append(AudioDetection.created_at >= dt_from)
    if dt_to:
        det_where.append(AudioDetection.created_at <= dt_to)

    det_result = await db.execute(
        select(
            func.count().label("total"),
            func.count(case((AudioDetection.detection_status == "matched", 1))).label("matched"),
            func.count(case((AudioDetection.detection_status == "uncertain", 1))).label("uncertain"),
            func.count(case((AudioDetection.detection_status == "no_match", 1))).label("no_match"),
            func.count(distinct(AudioDetection.matched_track_id)).label("unique_tracks"),
        ).where(*det_where)
    )
    det_row = det_result.one()

    # Total external content scanned — same date filter as external_by_status
    ext_total_result = await db.execute(
        select(func.count()).select_from(ExternalContent).where(*ext_where)
    )
    total_scanned = ext_total_result.scalar() or 0

    # Platform breakdown for external content — same date filter
    platform_result = await db.execute(
        select(ExternalContent.platform, func.count())
        .where(*ext_where)
        .group_by(ExternalContent.platform)
        .order_by(func.count().desc())
    )
    scanned_by_platform = {row[0]: row[1] for row in platform_result.all()}

    # Publication stats (suma de views/likes/comments/shares de external_contents)
    pub_stats_q = await db.execute(
        select(
            func.coalesce(func.sum(ExternalContent.views), 0).label("views"),
            func.coalesce(func.sum(ExternalContent.likes), 0).label("likes"),
            func.coalesce(func.sum(ExternalContent.comments), 0).label("comments"),
            func.coalesce(func.sum(ExternalContent.shares), 0).label("shares"),
        ).where(*ext_where)
    )
    pub_stats = pub_stats_q.one()
    pub_views = int(pub_stats.views)
    pub_likes = int(pub_stats.likes)
    pub_comments = int(pub_stats.comments)
    pub_shares = int(pub_stats.shares)

    # Publication stats by platform
    pub_by_platform_q = await db.execute(
        select(
            ExternalContent.platform,
            func.coalesce(func.sum(ExternalContent.views), 0).label("views"),
            func.coalesce(func.sum(ExternalContent.likes), 0).label("likes"),
            func.coalesce(func.sum(ExternalContent.comments), 0).label("comments"),
            func.coalesce(func.sum(ExternalContent.shares), 0).label("shares"),
            func.count().label("publications"),
        ).where(*ext_where).group_by(ExternalContent.platform)
    )
    publications_by_platform: dict[str, dict[str, int]] = {}
    for row in pub_by_platform_q.all():
        publications_by_platform[row.platform] = {
            "publications": int(row.publications),
            "views": int(row.views),
            "likes": int(row.likes),
            "comments": int(row.comments),
            "shares": int(row.shares),
            "interactions": int(row.likes) + int(row.comments) + int(row.shares),
        }

    return MetricsOverviewResponse(
        credits_total=total,
        credits_used=used,
        credits_blocked=blocked,
        credits_available=total - used - blocked,
        external_by_status=external_by_status,
        total_tracks=total_tracks,
        tracks_by_genre=tracks_by_genre,
        total_social_accounts=total_social_accounts,
        total_detections=int(det_row.total),
        detections_matched=int(det_row.matched),
        detections_uncertain=int(det_row.uncertain),
        detections_no_match=int(det_row.no_match),
        unique_tracks_detected=int(det_row.unique_tracks),
        total_content_scanned=total_scanned,
        scanned_by_platform=scanned_by_platform,
        publications_views=pub_views,
        publications_likes=pub_likes,
        publications_comments=pub_comments,
        publications_shares=pub_shares,
        publications_interactions=pub_likes + pub_comments + pub_shares,
        publications_by_platform=publications_by_platform,
        period_start=dt_from.isoformat() if dt_from else None,
        period_end=dt_to.isoformat() if dt_to else None,
    )


@router.get("/recent-activity")
async def recent_activity(
    limit: int = Query(default=20, ge=1, le=100),
    cursor: str | None = Query(default=None),
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Return recent activity items: licenses issued, content scanned, and music detections."""
    cid = current_user.company_id
    dt_from = _parse_date(date_from)
    dt_to = _parse_date(date_to, end_of_day=True)

    items: list[dict] = []

    # 1. Licenses issued (published usages)
    usages_where = [PublishedUsage.company_id == cid]
    if dt_from:
        usages_where.append(PublishedUsage.created_at >= dt_from)
    if dt_to:
        usages_where.append(PublishedUsage.created_at <= dt_to)

    usages_result = await db.execute(
        select(PublishedUsage).where(*usages_where).order_by(desc(PublishedUsage.created_at)).limit(limit)
    )
    for u in usages_result.scalars().all():
        items.append({
            "id": str(u.id),
            "type": "license_issued",
            "created_at": u.created_at.isoformat() if u.created_at else datetime.now(timezone.utc).isoformat(),
            "actor": {"user_id": str(current_user.id), "user_name": current_user.email, "avatar_url": None},
            "payload": {
                "track_id": str(u.track_id) if u.track_id else None,
                "session_id": str(u.publish_session_id) if u.publish_session_id else None,
                "platform": u.platform,
                "external_url": u.external_url,
            },
        })

    # 2. Music detections (matched + uncertain) — show real product usage
    det_where = [AudioDetection.company_id == cid]
    if dt_from:
        det_where.append(AudioDetection.created_at >= dt_from)
    if dt_to:
        det_where.append(AudioDetection.created_at <= dt_to)

    det_result = await db.execute(
        select(AudioDetection).where(*det_where).order_by(desc(AudioDetection.created_at)).limit(limit)
    )
    for d in det_result.scalars().all():
        items.append({
            "id": str(d.id),
            "type": "detection",
            "created_at": d.created_at.isoformat() if d.created_at else datetime.now(timezone.utc).isoformat(),
            "actor": {"user_id": None, "user_name": "Sistema · ACRCloud", "avatar_url": None},
            "payload": {
                "detection_status": d.detection_status,
                "matched_track_id": str(d.matched_track_id) if d.matched_track_id else None,
                "matched_title": d.matched_title,
                "matched_artist": d.matched_artist,
                "confidence_score": float(d.confidence_score) if d.confidence_score is not None else None,
                "external_content_id": str(d.external_content_id) if d.external_content_id else None,
            },
        })

    # 3. External content scanned (sin detección)
    ext_where = [ExternalContent.company_id == cid]
    if dt_from:
        ext_where.append(ExternalContent.created_at >= dt_from)
    if dt_to:
        ext_where.append(ExternalContent.created_at <= dt_to)

    ext_result = await db.execute(
        select(ExternalContent).where(*ext_where).order_by(desc(ExternalContent.created_at)).limit(limit)
    )
    for e in ext_result.scalars().all():
        items.append({
            "id": str(e.id),
            "type": "content_scanned",
            "created_at": e.created_at.isoformat() if e.created_at else datetime.now(timezone.utc).isoformat(),
            "actor": {"user_id": None, "user_name": "Sistema · Monitoreo", "avatar_url": None},
            "payload": {
                "platform": e.platform,
                "content_type": e.content_type,
                "external_url": e.external_url,
                "reconciliation_status": e.reconciliation_status,
            },
        })

    # Ordenar por fecha desc y recortar al limit
    items.sort(key=lambda x: x["created_at"], reverse=True)
    items = items[:limit]

    return {"items": items, "next_cursor": None}


@router.get("/top-tracks")
async def top_tracks(
    limit: int = Query(default=10, ge=1, le=100),
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Return tracks ordered by usage count (publications + detections), only those actually used."""
    cid = current_user.company_id
    dt_from = _parse_date(date_from)
    dt_to = _parse_date(date_to, end_of_day=True)

    # Cuenta publish_usages + detections matched, agrupado por track
    usages_filter = [PublishedUsage.company_id == cid]
    if dt_from:
        usages_filter.append(PublishedUsage.created_at >= dt_from)
    if dt_to:
        usages_filter.append(PublishedUsage.created_at <= dt_to)

    usages_q = await db.execute(
        select(PublishedUsage.track_id, func.count().label("usage_count"))
        .where(*usages_filter)
        .group_by(PublishedUsage.track_id)
    )
    usage_counts: dict = {str(r[0]): r[1] for r in usages_q.all() if r[0]}

    det_filter = [AudioDetection.company_id == cid, AudioDetection.matched_track_id.is_not(None)]
    if dt_from:
        det_filter.append(AudioDetection.created_at >= dt_from)
    if dt_to:
        det_filter.append(AudioDetection.created_at <= dt_to)

    det_q = await db.execute(
        select(AudioDetection.matched_track_id, func.count().label("det_count"))
        .where(*det_filter)
        .group_by(AudioDetection.matched_track_id)
    )
    det_counts: dict = {str(r[0]): r[1] for r in det_q.all() if r[0]}

    # Unificar por track
    track_ids = set(usage_counts.keys()) | set(det_counts.keys())
    if not track_ids:
        return {"items": []}

    tracks_q = await db.execute(
        select(Track.id, Track.title, Track.artist)
        .where(Track.id.in_([t for t in track_ids]), Track.active == True)
    )

    items = []
    for r in tracks_q.all():
        tid = str(r.id)
        count = usage_counts.get(tid, 0) + det_counts.get(tid, 0)
        items.append({
            "track_id": tid,
            "title": r.title,
            "artist": r.artist,
            "count": count,
            "publish_count": usage_counts.get(tid, 0),
            "detection_count": det_counts.get(tid, 0),
        })

    items.sort(key=lambda x: x["count"], reverse=True)
    return {"items": items[:limit]}
