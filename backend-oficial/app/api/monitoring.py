import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User
from app.models.monitoring import ExternalContent
from app.models.social import SocialAccount
from app.schemas.monitoring import ExternalContentResponse, ResolveTrackRequest, CreateObservedUsageRequest, AudioDetectionResponse, ContentWithDetectionResponse
from app.services import monitoring_service, audit_service
from app.services import acrcloud_service
from app.services import social_download_service

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


@router.get("/contents/{content_id}", response_model=ContentWithDetectionResponse)
async def get_content_detail(
    content_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full detail for a single external content including all audio detections."""
    from app.models.monitoring import AudioDetection
    content = await db.get(ExternalContent, content_id)
    if not content or content.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CONTENT_NOT_FOUND")
    det_result = await db.execute(
        select(AudioDetection)
        .where(AudioDetection.external_content_id == content_id)
        .order_by(AudioDetection.confidence_score.desc().nulls_last())
    )
    dets = list(det_result.scalars().all())
    best = dets[0] if dets else None
    payload = content.raw_payload_json or {}
    return ContentWithDetectionResponse(
        id=content.id,
        company_id=content.company_id,
        social_account_id=content.social_account_id,
        platform=content.platform,
        content_type=content.content_type,
        external_media_id=content.external_media_id,
        external_url=content.external_url,
        posted_at=content.posted_at,
        reconciliation_status=content.reconciliation_status,
        created_at=content.created_at,
        caption=payload.get("title") or payload.get("caption"),
        duration=payload.get("duration"),
        uploader=payload.get("uploader"),
        thumbnail_url=payload.get("thumbnail_url"),
        views=content.views,
        likes=content.likes,
        comments=content.comments,
        shares=content.shares,
        detection=AudioDetectionResponse.model_validate(best, from_attributes=True) if best else None,
        detections=[AudioDetectionResponse.model_validate(d, from_attributes=True) for d in dets],
    )


@router.get("/sync-status")
async def get_sync_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return real sync status of the company's social accounts."""
    from sqlalchemy import func as sqlfunc
    result = await db.execute(
        select(SocialAccount).where(SocialAccount.company_id == current_user.company_id)
    )
    accounts = result.scalars().all()
    total = len(accounts)
    errors = sum(1 for a in accounts if a.status == "error")
    syncing = sum(1 for a in accounts if a.status == "syncing")
    # last_sync_at: use the most recent updated_at among all accounts as proxy
    last_sync_at = None
    if accounts:
        latest = max((a.updated_at for a in accounts if a.updated_at), default=None)
        last_sync_at = latest.isoformat() if latest else None
    if errors == 0:
        overall = "ok"
    elif errors < total:
        overall = "partial"
    else:
        overall = "error"
    return {
        "status": overall,
        "last_sync_at": last_sync_at,
        "accounts_syncing": syncing,
        "accounts_with_errors": errors,
        "total_accounts": total,
    }


@router.post("/sync/{social_account_id}", response_model=list[ExternalContentResponse])
async def sync_content(
    social_account_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        contents = await monitoring_service.sync_account(db, current_user.company_id, social_account_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return [ExternalContentResponse.model_validate(c, from_attributes=True) for c in contents]


@router.get("/contents", response_model=list[ContentWithDetectionResponse])
async def list_contents(
    reconciliation_status: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List external contents for the current company.

    Supports optional date filtering via `date_from` and `date_to` (YYYY-MM-DD).
    Date filter is applied on `posted_at` (the real social post date).
    If `posted_at` is NULL for a record, `created_at` is used as fallback.
    """
    from datetime import datetime, timezone
    from fastapi import HTTPException, status as http_status

    def _parse_date(s: str | None, end_of_day: bool = False) -> datetime | None:
        if not s:
            return None
        try:
            d = datetime.strptime(s, "%Y-%m-%d")
            if end_of_day:
                d = d.replace(hour=23, minute=59, second=59)
            return d.replace(tzinfo=timezone.utc)
        except ValueError:
            raise HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail=f"INVALID_DATE: '{s}' debe tener formato YYYY-MM-DD",
            )

    dt_from = _parse_date(date_from)
    dt_to = _parse_date(date_to, end_of_day=True)

    enriched = await monitoring_service.get_external_contents_enriched(
        db, current_user.company_id, reconciliation_status,
        date_from=dt_from, date_to=dt_to,
    )
    return enriched


@router.get("/contents/{content_id}/detections", response_model=list[AudioDetectionResponse])
async def list_detections(
    content_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    detections = await monitoring_service.get_detections_for_content(db, content_id)
    return [AudioDetectionResponse.model_validate(d, from_attributes=True) for d in detections]


@router.post("/contents/{content_id}/resolve", response_model=ExternalContentResponse)
async def resolve_content(
    content_id: uuid.UUID,
    body: CreateObservedUsageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    content = await db.get(ExternalContent, content_id)
    if not content or content.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CONTENT_NOT_FOUND")
    try:
        content = await monitoring_service.resolve_track(
            db, content, body.track_id, body.package_id, body.resolution_note, current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "external_content", content_id, "resolve_track",
        metadata={"track_id": str(body.track_id), "package_id": str(body.package_id)},
    )
    return ExternalContentResponse.model_validate(content, from_attributes=True)


@router.delete("/contents/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    content_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an external content record and its associated detections."""
    content = await db.get(ExternalContent, content_id)
    if not content or content.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CONTENT_NOT_FOUND")
    from app.models.monitoring import AudioDetection as AD
    det_result = await db.execute(select(AD).where(AD.external_content_id == content_id))
    for det in det_result.scalars().all():
        await db.delete(det)
    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "external_content", content_id, "delete",
        metadata={"platform": content.platform, "url": content.external_url},
    )
    await db.delete(content)
    await db.flush()


@router.post("/identify", response_model=AudioDetectionResponse)
async def identify_audio(
    audio: UploadFile = File(...),
    external_content_id: uuid.UUID | None = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload an audio file and identify it via ACRCloud fingerprinting.
    Optionally link to an existing ExternalContent record.
    """
    audio_bytes = await audio.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="EMPTY_AUDIO_FILE")
    if len(audio_bytes) > 10 * 1024 * 1024:  # 10 MB max
        raise HTTPException(status_code=400, detail="AUDIO_FILE_TOO_LARGE")

    # If linked to existing content, validate ownership
    ext_content = None
    if external_content_id:
        ext_content = await db.get(ExternalContent, external_content_id)
        if not ext_content or ext_content.company_id != current_user.company_id:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
    else:
        # Create a standalone external content record for this identification
        ext_content = ExternalContent(
            company_id=current_user.company_id,
            social_account_id=None,
            platform="upload",
            content_type="audio_sample",
            external_media_id=f"upload_{uuid.uuid4().hex[:10]}",
            external_url=None,
            reconciliation_status="unmatched",
        )
        db.add(ext_content)
        await db.flush()

    suffix = (audio.filename or "audio.wav").rsplit(".", 1)[-1]
    detections = await acrcloud_service.identify_and_match(
        db, current_user.company_id, ext_content, audio_bytes, audio_format=suffix
    )
    # Return the first (best) detection for backward compatibility
    return AudioDetectionResponse.model_validate(detections[0], from_attributes=True)


@router.post("/identify-raw")
async def identify_audio_raw(
    audio: UploadFile = File(...),
    _: User = Depends(get_current_user),
):
    """
    Quick identify: returns the raw ACRCloud response without saving to DB.
    Useful for testing the integration.
    """
    audio_bytes = await audio.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="EMPTY_AUDIO_FILE")
    if len(audio_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="AUDIO_FILE_TOO_LARGE")

    suffix = (audio.filename or "audio.wav").rsplit(".", 1)[-1]
    raw_result = await acrcloud_service.identify_audio(audio_bytes, audio_format=suffix)
    parsed = acrcloud_service.parse_acrcloud_result(raw_result)
    return {"raw": raw_result, "parsed_matches": parsed}


class IdentifyURLRequest(BaseModel):
    url: str


@router.post("/identify-url")
async def identify_from_url(
    body: IdentifyURLRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Identify music from a public social media URL (Instagram, Facebook, TikTok).
    Downloads the video, extracts audio, and sends to ACRCloud for fingerprinting.
    Caches results: if the same URL was already identified, returns the cached result.
    """
    # 0. Check cache — avoid re-downloading and re-querying ACRCloud for the same URL
    from app.models.monitoring import AudioDetection
    cached = await db.execute(
        select(ExternalContent).where(
            ExternalContent.company_id == current_user.company_id,
            ExternalContent.external_url == body.url,
        ).order_by(ExternalContent.created_at.desc()).limit(1)
    )
    cached_content = cached.scalar_one_or_none()
    if cached_content:
        det_result = await db.execute(
            select(AudioDetection)
            .where(AudioDetection.external_content_id == cached_content.id)
            .order_by(AudioDetection.confidence_score.desc())
        )
        cached_detections = det_result.scalars().all()
        if cached_detections:
            best = cached_detections[0]
            # Reconstruct acrcloud_matches from the raw_result of whichever detection stored it
            cached_raw = next((d.raw_result_json for d in cached_detections if d.raw_result_json), {})
            payload = cached_content.raw_payload_json or {}
            ig_artist = payload.get("artist")
            ig_song = payload.get("song")
            tk_track = payload.get("track")
            cached_ig_music = None
            cached_tk_music = None
            if cached_content.platform == "instagram" and (ig_artist or ig_song):
                cached_ig_music = {"artist": ig_artist, "song": ig_song}
            elif cached_content.platform == "tiktok" and (tk_track or ig_artist):
                cached_tk_music = {"artist": ig_artist, "song": tk_track}
            cached_platform_music = cached_ig_music or cached_tk_music
            p_song = (cached_platform_music or {}).get("song", "")
            p_artist = (cached_platform_music or {}).get("artist", "")
            cached_source_match = None
            if cached_platform_music and best.matched_title:
                acr_t = (best.matched_title or "").lower().strip()
                acr_a = (best.matched_artist or "").lower().strip()
                pt = (p_song or "").lower().strip()
                pa = (p_artist or "").lower().strip()
                t_match = pt in acr_t or acr_t in pt if (pt and acr_t) else False
                a_match = any(a.strip() in acr_a or acr_a in a.strip() for a in pa.split(",")) if (pa and acr_a) else False
                cached_source_match = t_match and a_match
            return {
                "url": body.url,
                "platform": cached_content.platform,
                "video_title": payload.get("title"),
                "video_uploader": payload.get("uploader"),
                "video_duration": payload.get("duration"),
                "audio_size_bytes": None,
                "instagram_music": cached_ig_music,
                "tiktok_music": cached_tk_music,
                "source_match": cached_source_match,
                "acrcloud_matches": acrcloud_service.parse_acrcloud_result(cached_raw),
                "detection": {
                    "id": str(best.id),
                    "status": best.detection_status,
                    "matched_track_id": str(best.matched_track_id) if best.matched_track_id else None,
                    "confidence": float(best.confidence_score) if best.confidence_score else None,
                    "matched_title": best.matched_title,
                    "matched_artist": best.matched_artist,
                },
                "catalog_match": best.detection_status == "matched",
                "cached": True,
            }

    # 1. Download audio from URL
    # For Instagram URLs, try to find an OAuth token from connected accounts
    ig_oauth_token = None
    if "instagram" in body.url.lower():
        ig_account = await db.execute(
            select(SocialAccount).where(
                SocialAccount.company_id == current_user.company_id,
                SocialAccount.platform == "instagram",
                SocialAccount.status == "connected",
                SocialAccount.access_token_encrypted.isnot(None),
                SocialAccount.access_token_encrypted != "",
            ).limit(1)
        )
        ig_acct = ig_account.scalar_one_or_none()
        if ig_acct:
            try:
                from app.core.security import decrypt_token
                ig_oauth_token = decrypt_token(ig_acct.access_token_encrypted)
            except Exception:
                pass

    try:
        audio_bytes, info_json_str = await social_download_service.download_audio(
            body.url, oauth_token=ig_oauth_token,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Parse video info
    try:
        video_info = json.loads(info_json_str) if info_json_str else {}
    except json.JSONDecodeError:
        video_info = {}

    # 2. Create external content record
    platform = "unknown"
    url_lower = body.url.lower()
    if "instagram" in url_lower:
        platform = "instagram"
    elif "facebook" in url_lower or "fb.watch" in url_lower:
        platform = "facebook"
    elif "tiktok" in url_lower:
        platform = "tiktok"

    # Detect content_type from video_info source and URL pattern
    source = video_info.get("source", "")
    if "carousel" in source:
        content_type = "carousel"
    elif "/reel/" in body.url.lower():
        content_type = "reel"
    elif "/photo/" in body.url.lower() and platform == "tiktok":
        content_type = "tiktok_photo"
    else:
        content_type = "video"

    ext_content = ExternalContent(
        company_id=current_user.company_id,
        social_account_id=None,
        platform=platform,
        content_type=content_type,
        external_media_id=video_info.get("id", f"url_{uuid.uuid4().hex[:10]}"),
        external_url=body.url,
        raw_payload_json={
            "title": video_info.get("title"),
            "uploader": video_info.get("uploader"),
            "duration": video_info.get("duration"),
            "artist": video_info.get("artist"),
            "song": video_info.get("song"),
            "track": video_info.get("track"),
            "source": source or None,
        },
        reconciliation_status="unmatched",
    )
    db.add(ext_content)
    await db.flush()

    # 3. Single ACRCloud call — identify + match in one step
    raw_result = await acrcloud_service.identify_audio(audio_bytes, audio_format="wav")
    parsed = acrcloud_service.parse_acrcloud_result(raw_result)

    detections = await acrcloud_service.identify_and_match(
        db, current_user.company_id, ext_content,
        preloaded_result=raw_result,
    )

    best = detections[0] if detections else None

    # Build Instagram music metadata (from sticker / carousel music)
    ig_artist = video_info.get("artist")
    ig_song = video_info.get("song")
    instagram_music = None
    if platform == "instagram" and (ig_artist or ig_song):
        instagram_music = {"artist": ig_artist, "song": ig_song}

    # Build TikTok music metadata (from yt-dlp track/artist fields)
    tiktok_music = None
    if platform == "tiktok":
        tk_track = video_info.get("track")
        tk_artist = video_info.get("artist")
        if tk_track or tk_artist:
            tiktok_music = {"artist": tk_artist, "song": tk_track}

    # Unified platform music for source_match comparison
    platform_music = instagram_music or tiktok_music
    platform_song = (instagram_music or {}).get("song") or (tiktok_music or {}).get("song")
    platform_artist = (instagram_music or {}).get("artist") or (tiktok_music or {}).get("artist")

    # Check if ACRCloud result matches the platform's music metadata
    source_match = None
    if platform_music and best and best.matched_title:
        acr_title = (best.matched_title or "").lower().strip()
        acr_artist = (best.matched_artist or "").lower().strip()
        p_t = (platform_song or "").lower().strip()
        p_a = (platform_artist or "").lower().strip()
        # Match if title is contained or artist overlaps
        title_match = p_t in acr_title or acr_title in p_t if (p_t and acr_title) else False
        artist_match = any(
            a.strip() in acr_artist or acr_artist in a.strip()
            for a in p_a.split(",")
        ) if (p_a and acr_artist) else False
        source_match = title_match and artist_match

    return {
        "url": body.url,
        "platform": platform,
        "video_title": video_info.get("title"),
        "video_uploader": video_info.get("uploader"),
        "video_duration": video_info.get("duration"),
        "audio_size_bytes": len(audio_bytes),
        "instagram_music": instagram_music,
        "tiktok_music": tiktok_music,
        "source_match": source_match,
        "acrcloud_matches": parsed,
        "detection": {
            "id": str(best.id) if best else None,
            "status": best.detection_status if best else None,
            "matched_track_id": str(best.matched_track_id) if best and best.matched_track_id else None,
            "confidence": float(best.confidence_score) if best and best.confidence_score else None,
            "matched_title": best.matched_title if best else None,
            "matched_artist": best.matched_artist if best else None,
        },
        "catalog_match": best.detection_status == "matched" if best else False,
    }


@router.get("/alerts")
async def list_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return active system alerts: expiring licenses, depleted packages, sync errors."""
    from datetime import date, timedelta
    import uuid as _uuid
    from app.models.packages import LicensePackage

    cid = current_user.company_id
    alerts = []

    # Packages expiring within 30 days
    today = date.today()
    soon = today + timedelta(days=30)
    expiring_result = await db.execute(
        select(LicensePackage).where(
            LicensePackage.company_id == cid,
            LicensePackage.status == "active",
            LicensePackage.end_date <= soon,
            LicensePackage.end_date >= today,
        )
    )
    for pkg in expiring_result.scalars().all():
        days_left = (pkg.end_date - today).days
        alerts.append({
            "id": str(_uuid.uuid4()),
            "type": "expiring_license",
            "severity": "warning" if days_left > 7 else "critical",
            "message": f"Paquete '{pkg.package_name}' vence en {days_left} días ({pkg.end_date})",
            "created_at": pkg.created_at.isoformat() if pkg.created_at else None,
        })

    # Packages with less than 10% credits available
    low_result = await db.execute(
        select(LicensePackage).where(
            LicensePackage.company_id == cid,
            LicensePackage.status == "active",
        )
    )
    for pkg in low_result.scalars().all():
        available = pkg.credits_total - pkg.credits_used - pkg.credits_blocked
        if pkg.credits_total > 0 and available / pkg.credits_total < 0.10:
            alerts.append({
                "id": str(_uuid.uuid4()),
                "type": "low_credits",
                "severity": "warning",
                "message": f"Paquete '{pkg.package_name}' tiene solo {available} créditos disponibles ({int(available/pkg.credits_total*100)}%)",
                "created_at": pkg.created_at.isoformat() if pkg.created_at else None,
            })

    return alerts
