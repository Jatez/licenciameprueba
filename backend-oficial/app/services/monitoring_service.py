import json
import logging
import uuid
from datetime import datetime, date, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.monitoring import ExternalContent, AudioDetection
from app.models.social import SocialAccount
from app.models.catalog import Track
from app.models.packages import LicensePackage
from app.models.publishing import PublishedUsage
from app.core.security import decrypt_token
from app.services import acrcloud_service, social_download_service, profile_scraper_service

logger = logging.getLogger(__name__)


async def sync_account(
    db: AsyncSession,
    company_id: uuid.UUID,
    social_account_id: uuid.UUID,
    limit: int = 5,
) -> list[ExternalContent]:
    """Scrape recent posts from a social account and identify audio via ACRCloud."""
    account = await db.get(SocialAccount, social_account_id)
    if not account or account.company_id != company_id:
        raise ValueError("SOCIAL_ACCOUNT_NOT_FOUND")

    if not account.username:
        raise ValueError("MISSING_USERNAME")

    # Decrypt OAuth token if available
    oauth_token = None
    if account.access_token_encrypted:
        try:
            oauth_token = decrypt_token(account.access_token_encrypted)
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(
                "Failed to decrypt OAuth token for account %s: %s", social_account_id, e
            )

    # 1. Scrape recent posts from the profile
    scraped = await profile_scraper_service.scrape_recent_posts(
        platform=account.platform,
        username=account.username,
        limit=limit,
        oauth_token=oauth_token,
    )

    if not scraped:
        return []

    # 2. For each scraped post, download audio + identify via ACRCloud
    new_contents: list[ExternalContent] = []
    for post in scraped:
        # Skip already-scanned URLs
        cached = await db.execute(
            select(ExternalContent).where(
                ExternalContent.company_id == company_id,
                ExternalContent.external_url == post.url,
            ).limit(1)
        )
        if cached.scalar_one_or_none():
            continue

        content_type = (
            ("tiktok_photo" if "/photo/" in post.url else "tiktok_video")
            if account.platform == "tiktok"
            else f"{account.platform[:2]}_reel"
        )

        try:
            audio_bytes, info_json_str = await social_download_service.download_audio(
                post.url, oauth_token=oauth_token,
            )

            video_info = {}
            try:
                video_info = json.loads(info_json_str) if info_json_str else {}
            except json.JSONDecodeError:
                pass

            ext_content = ExternalContent(
                company_id=company_id,
                social_account_id=social_account_id,
                platform=account.platform,
                content_type=content_type,
                external_media_id=post.video_id or video_info.get("id", f"sync_{uuid.uuid4().hex[:10]}"),
                external_url=post.url,
                posted_at=datetime.fromtimestamp(post.timestamp, tz=timezone.utc) if post.timestamp else datetime.now(timezone.utc),
                likes=post.likes,
                comments=post.comments,
                raw_payload_json={
                    "title": post.title or video_info.get("title"),
                    "uploader": post.uploader or video_info.get("uploader"),
                    "duration": post.duration or video_info.get("duration"),
                    "thumbnail_url": post.thumbnail_url,
                    "likes": post.likes,
                    "comments": post.comments,
                    "source": "sync",
                },
                reconciliation_status="unmatched",
            )
            db.add(ext_content)
            await db.flush()

            raw_result = await acrcloud_service.identify_audio(audio_bytes, audio_format="wav")
            await acrcloud_service.identify_and_match(
                db, company_id, ext_content,
                preloaded_result=raw_result,
            )

            new_contents.append(ext_content)
        except ValueError as e:
            import logging
            logging.getLogger(__name__).warning(
                "Sync: download/detect failed for %s: %s", post.url, e
            )
            continue

    return new_contents


async def get_external_contents(
    db: AsyncSession,
    company_id: uuid.UUID,
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> list[ExternalContent]:
    """
    Fetch ExternalContent records for a company.

    Date filter (date_from / date_to) is applied on posted_at when present,
    falling back to created_at for records where posted_at IS NULL.
    This ensures records without a known post date are still included when
    the filter range covers their creation date.
    """
    from sqlalchemy import func as sqlfunc
    query = select(ExternalContent).where(ExternalContent.company_id == company_id)
    if status:
        query = query.where(ExternalContent.reconciliation_status == status)
    if date_from or date_to:
        # Use COALESCE(posted_at, created_at) so records without posted_at
        # fall back to their ingestion timestamp.
        effective_date = sqlfunc.coalesce(ExternalContent.posted_at, ExternalContent.created_at)
        if date_from:
            query = query.where(effective_date >= date_from)
        if date_to:
            query = query.where(effective_date <= date_to)
    query = query.order_by(ExternalContent.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_external_contents_enriched(
    db: AsyncSession,
    company_id: uuid.UUID,
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
) -> list[dict]:
    """Return external contents enriched with inline detections and metadata."""
    contents = await get_external_contents(db, company_id, status, date_from=date_from, date_to=date_to)
    content_ids = [c.id for c in contents]

    # Bulk-fetch all detections for these contents
    detections_map: dict[uuid.UUID, list[AudioDetection]] = {}
    if content_ids:
        det_result = await db.execute(
            select(AudioDetection)
            .where(AudioDetection.external_content_id.in_(content_ids))
            .order_by(AudioDetection.confidence_score.desc().nulls_last())
        )
        for det in det_result.scalars().all():
            detections_map.setdefault(det.external_content_id, []).append(det)

    enriched = []
    for c in contents:
        dets = detections_map.get(c.id, [])
        best = dets[0] if dets else None
        payload = c.raw_payload_json or {}
        enriched.append({
            "id": c.id,
            "company_id": c.company_id,
            "social_account_id": c.social_account_id,
            "platform": c.platform,
            "content_type": c.content_type,
            "external_media_id": c.external_media_id,
            "external_url": c.external_url,
            "posted_at": c.posted_at,
            "reconciliation_status": c.reconciliation_status,
            "created_at": c.created_at,
            "caption": payload.get("title") or payload.get("caption"),
            "duration": payload.get("duration"),
            "uploader": payload.get("uploader"),
            "thumbnail_url": payload.get("thumbnail_url"),
            "views": c.views,
            "likes": c.likes,
            "comments": c.comments,
            "shares": c.shares,
            "detection": {
                "id": best.id,
                "detector_provider": best.detector_provider,
                "detection_status": best.detection_status,
                "matched_track_id": best.matched_track_id,
                "confidence_score": float(best.confidence_score) if best.confidence_score is not None else None,
                "matched_title": best.matched_title,
                "matched_artist": best.matched_artist,
                "created_at": best.created_at,
            } if best else None,
            "detections": [
                {
                    "id": d.id,
                    "detector_provider": d.detector_provider,
                    "detection_status": d.detection_status,
                    "matched_track_id": d.matched_track_id,
                    "confidence_score": float(d.confidence_score) if d.confidence_score is not None else None,
                    "matched_title": d.matched_title,
                    "matched_artist": d.matched_artist,
                    "created_at": d.created_at,
                } for d in dets
            ],
        })
    return enriched


async def get_detections_for_content(db: AsyncSession, content_id: uuid.UUID) -> list[AudioDetection]:
    result = await db.execute(
        select(AudioDetection).where(AudioDetection.external_content_id == content_id)
    )
    return list(result.scalars().all())


async def resolve_track(
    db: AsyncSession,
    content: ExternalContent,
    track_id: uuid.UUID,
    package_id: uuid.UUID,
    note: str | None,
    user_id: uuid.UUID,
) -> ExternalContent:
    """Resolve a detected content: confirm track, consume 1 credit, create observed_usage."""
    # 1. Validate package belongs to same company and has available credits
    pkg = await db.get(LicensePackage, package_id)
    if not pkg or pkg.company_id != content.company_id:
        raise ValueError("PACKAGE_NOT_FOUND")
    if pkg.status != "active":
        raise ValueError("PACKAGE_NOT_ACTIVE")
    if pkg.end_date < date.today():
        raise ValueError("PACKAGE_EXPIRED")
    available = pkg.credits_total - pkg.credits_used - pkg.credits_blocked
    if available < 1:
        raise ValueError("NO_CREDITS_AVAILABLE")

    # 2. Validate track exists
    track = await db.get(Track, track_id)
    if not track:
        raise ValueError("TRACK_NOT_FOUND")

    # 3. Update content reconciliation status
    content.reconciliation_status = "matched_usage"

    # 4. Update detection if exists
    result = await db.execute(
        select(AudioDetection).where(AudioDetection.external_content_id == content.id)
    )
    detection = result.scalar_one_or_none()
    if detection:
        detection.matched_track_id = track_id
        detection.detection_status = "matched"
        detection.confidence_score = 1.0

    # 5. Consume 1 credit
    pkg.credits_used += 1

    # 6. Create observed_usage record
    usage = PublishedUsage(
        company_id=content.company_id,
        package_id=package_id,
        track_id=track_id,
        social_account_id=content.social_account_id,
        platform=content.platform,
        content_type=content.content_type,
        coverage_type="observed_usage",
        status="confirmed",
        external_media_id=content.external_media_id,
        external_url=content.external_url,
        published_at=content.posted_at,
        evidence_json={"resolution_note": note, "resolved_by": str(user_id)},
    )
    db.add(usage)
    await db.flush()
    return content


async def get_account_feed(
    db: AsyncSession,
    company_id: uuid.UUID,
    social_account_id: uuid.UUID,
    limit: int = 5,
) -> dict:
    """
    Get the last N posts and stories for a social account,
    each with its first audio detection (song info).
    """
    account = await db.get(SocialAccount, social_account_id)
    if not account or account.company_id != company_id:
        raise ValueError("SOCIAL_ACCOUNT_NOT_FOUND")

    # Fetch recent content for this account
    content_result = await db.execute(
        select(ExternalContent)
        .where(
            ExternalContent.company_id == company_id,
            ExternalContent.social_account_id == social_account_id,
        )
        .order_by(ExternalContent.posted_at.desc())
        .limit(limit * 2)  # fetch extra to split posts/stories
    )
    all_content = list(content_result.scalars().all())

    # Split into posts and stories
    story_types = {"story", "ig_story", "fb_story", "tiktok_story"}
    stories_raw = [c for c in all_content if c.content_type in story_types]
    posts_raw = [c for c in all_content if c.content_type not in story_types]

    # Apply limit per category
    stories_raw = stories_raw[:limit]
    posts_raw = posts_raw[:limit]

    # Fetch detections for all relevant content IDs
    content_ids = [c.id for c in stories_raw + posts_raw]
    detections_map: dict[uuid.UUID, list[AudioDetection]] = {}
    if content_ids:
        det_result = await db.execute(
            select(AudioDetection).where(AudioDetection.external_content_id.in_(content_ids))
        )
        for det in det_result.scalars().all():
            detections_map.setdefault(det.external_content_id, []).append(det)

    def _det_dict(det: AudioDetection) -> dict:
        return {
            "id": det.id,
            "detector_provider": det.detector_provider,
            "detection_status": det.detection_status,
            "matched_track_id": det.matched_track_id,
            "confidence_score": float(det.confidence_score) if det.confidence_score else None,
            "matched_title": det.matched_title,
            "matched_artist": det.matched_artist,
            "created_at": det.created_at,
        }

    def build_item(content: ExternalContent) -> dict:
        dets = detections_map.get(content.id, [])
        payload = content.raw_payload_json or {}
        return {
            "id": content.id,
            "platform": content.platform,
            "content_type": content.content_type,
            "external_media_id": content.external_media_id,
            "external_url": content.external_url,
            "posted_at": content.posted_at,
            "reconciliation_status": content.reconciliation_status,
            "created_at": content.created_at,
            "caption": payload.get("title"),
            "duration": payload.get("duration"),
            "uploader": payload.get("uploader"),
            "thumbnail_url": payload.get("thumbnail_url"),
            "views": content.views,
            "likes": content.likes,
            "comments": content.comments,
            "shares": content.shares,
            "detection": _det_dict(dets[0]) if dets else None,
            "detections": [_det_dict(d) for d in dets],
        }

    # Build @ handle
    handle_prefixes = {
        "instagram": "@",
        "tiktok": "@",
        "facebook": "",
    }
    prefix = handle_prefixes.get(account.platform, "@")
    handle = f"{prefix}{account.username}" if account.username else f"@{account.external_account_id}"

    return {
        "account_id": account.id,
        "platform": account.platform,
        "username": account.username,
        "handle": handle,
        "status": account.status,
        "posts": [build_item(c) for c in posts_raw],
        "stories": [build_item(c) for c in stories_raw],
    }
