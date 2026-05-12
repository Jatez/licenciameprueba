import json
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import decrypt_token
from app.models.auth import User
from app.models.social import SocialAccount
from app.models.monitoring import ExternalContent
from app.schemas.social import SocialAccountResponse, ConnectAccountRequest, ScanUrlsRequest
from app.schemas.monitoring import AccountFeedResponse, ContentWithDetectionResponse, AudioDetectionResponse
from app.services import monitoring_service, acrcloud_service, social_download_service, profile_scraper_service, audit_service

router = APIRouter(prefix="/social-accounts", tags=["social"])


@router.get("/", response_model=list[SocialAccountResponse])
async def list_accounts(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(SocialAccount).where(SocialAccount.company_id == current_user.company_id).order_by(SocialAccount.created_at)
    )
    accounts = result.scalars().all()
    return [SocialAccountResponse.model_validate(a, from_attributes=True) for a in accounts]


@router.post("/connect", response_model=SocialAccountResponse, status_code=status.HTTP_201_CREATED)
async def connect_account(body: ConnectAccountRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Connect a social account by providing platform and username."""
    # Check if already connected
    existing = await db.execute(
        select(SocialAccount).where(
            SocialAccount.company_id == current_user.company_id,
            SocialAccount.platform == body.platform,
            SocialAccount.external_account_id == body.external_account_id,
        )
    )
    found = existing.scalar_one_or_none()
    if found:
        found.status = "connected"
        found.username = body.username or found.username
        await db.flush()
        return SocialAccountResponse.model_validate(found, from_attributes=True)

    account = SocialAccount(
        company_id=current_user.company_id,
        platform=body.platform,
        external_account_id=body.external_account_id,
        username=body.username,
        status="connected",
    )
    db.add(account)
    await db.flush()
    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "social_account", account.id, "connect",
        metadata={"platform": body.platform, "username": body.username},
    )
    return SocialAccountResponse.model_validate(account, from_attributes=True)


@router.get("/{account_id}", response_model=SocialAccountResponse)
async def get_account(account_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = await db.get(SocialAccount, account_id)
    if not account or account.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ACCOUNT_NOT_FOUND")
    return SocialAccountResponse.model_validate(account, from_attributes=True)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect(account_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = await db.get(SocialAccount, account_id)
    if not account or account.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ACCOUNT_NOT_FOUND")
    account.status = "disconnected"
    account.access_token_encrypted = ""
    account.refresh_token_encrypted = None
    await db.flush()
    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "social_account", account_id, "disconnect",
        metadata={"platform": account.platform, "username": account.username},
    )


@router.delete("/{account_id}/permanent", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(account_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Permanently delete a social account. Preserves related ExternalContent history."""
    account = await db.get(SocialAccount, account_id)
    if not account or account.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ACCOUNT_NOT_FOUND")
    # Unlink related content (preserve detection history)
    from sqlalchemy import update
    await db.execute(
        update(ExternalContent)
        .where(ExternalContent.social_account_id == account_id)
        .values(social_account_id=None)
    )
    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "social_account", account_id, "permanent_delete",
        metadata={"platform": account.platform, "username": account.username},
    )
    await db.delete(account)
    await db.flush()


@router.get("/{account_id}/feed", response_model=AccountFeedResponse)
async def get_account_feed(
    account_id: uuid.UUID,
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the last N posts and stories for a social account,
    each with its detected song information.
    """
    try:
        feed = await monitoring_service.get_account_feed(
            db, current_user.company_id, account_id, limit=limit
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return feed


@router.post("/{account_id}/scan", response_model=list[ContentWithDetectionResponse])
async def scan_urls(
    account_id: uuid.UUID,
    body: ScanUrlsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Scan real URLs for a social account.
    For each URL: downloads the video audio → sends to ACRCloud → creates ExternalContent + AudioDetection.
    This is the REAL detection pipeline, same as /monitoring/identify-url but linked to a social account.
    """
    account = await db.get(SocialAccount, account_id)
    if not account or account.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ACCOUNT_NOT_FOUND")

    if len(body.urls) > 10:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MAX_10_URLS_PER_SCAN")

    results = []
    for item in body.urls:
        # Check cache: skip if already scanned
        cached = await db.execute(
            select(ExternalContent).where(
                ExternalContent.company_id == current_user.company_id,
                ExternalContent.external_url == item.url,
            ).limit(1)
        )
        if cached.scalar_one_or_none():
            continue

        # Map content_type
        type_map = {
            "post": f"{account.platform[:2]}_reel" if account.platform != "tiktok" else "tiktok_video",
            "reel": f"{account.platform[:2]}_reel" if account.platform != "tiktok" else "tiktok_video",
            "story": "story",
        }
        content_type = type_map.get(item.content_type, "video")

        # Decrypt OAuth token if available (for Instagram carousel fallback)
        scan_oauth_token = None
        if account.platform == "instagram" and account.access_token_encrypted:
            try:
                scan_oauth_token = decrypt_token(account.access_token_encrypted)
            except Exception:
                pass

        try:
            # 1. Download audio from URL
            audio_bytes, info_json_str = await social_download_service.download_audio(
                item.url, oauth_token=scan_oauth_token,
            )

            video_info = {}
            try:
                video_info = json.loads(info_json_str) if info_json_str else {}
            except json.JSONDecodeError:
                pass

            # Override content_type based on actual source from download
            source = video_info.get("source", "")
            if "carousel" in source:
                actual_content_type = "carousel"
            else:
                actual_content_type = content_type

            # 2. Create ExternalContent record
            ext_content = ExternalContent(
                company_id=current_user.company_id,
                social_account_id=account_id,
                platform=account.platform,
                content_type=actual_content_type,
                external_media_id=video_info.get("id", f"scan_{uuid.uuid4().hex[:10]}"),
                external_url=item.url,
                posted_at=datetime.now(timezone.utc),
                raw_payload_json={
                    "title": video_info.get("title"),
                    "uploader": video_info.get("uploader"),
                    "duration": video_info.get("duration"),
                },
                reconciliation_status="unmatched",
            )
            db.add(ext_content)
            await db.flush()

            # 3. Identify via ACRCloud
            raw_result = await acrcloud_service.identify_audio(audio_bytes, audio_format="wav")
            detections = await acrcloud_service.identify_and_match(
                db, current_user.company_id, ext_content,
                preloaded_result=raw_result,
            )

            # Build response item
            det_responses = [AudioDetectionResponse.model_validate(d, from_attributes=True) for d in detections]
            payload = ext_content.raw_payload_json or {}
            results.append(ContentWithDetectionResponse(
                id=ext_content.id,
                platform=ext_content.platform,
                content_type=ext_content.content_type,
                external_media_id=ext_content.external_media_id,
                external_url=ext_content.external_url,
                posted_at=ext_content.posted_at,
                reconciliation_status=ext_content.reconciliation_status,
                created_at=ext_content.created_at,
                caption=payload.get("title"),
                duration=payload.get("duration"),
                uploader=payload.get("uploader"),
                detection=det_responses[0] if det_responses else None,
                detections=det_responses,
            ))

        except ValueError:
            # Skip URLs that fail to download (private, 404, etc.)
            continue

    return results


@router.post("/{account_id}/auto-scan", response_model=list[ContentWithDetectionResponse])
async def auto_scan(
    account_id: uuid.UUID,
    limit: int = Query(default=5, ge=1, le=20),
    date_from: str | None = Query(default=None, description="Filter posts from this date (YYYY-MM-DD)"),
    date_to: str | None = Query(default=None, description="Filter posts until this date (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Automatically scrape the most recent posts from a social account's profile
    using yt-dlp, then identify each one via ACRCloud.
    Optionally filter by date range.
    """
    account = await db.get(SocialAccount, account_id)
    if not account or account.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ACCOUNT_NOT_FOUND")

    if not account.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MISSING_USERNAME: La cuenta no tiene username configurado",
        )

    # Decrypt OAuth token if available
    oauth_token = None
    if account.access_token_encrypted:
        try:
            oauth_token = decrypt_token(account.access_token_encrypted)
        except Exception:
            pass  # fallback to credential-based scraping

    # 1. Scrape recent posts from the profile
    try:
        scraped = await profile_scraper_service.scrape_recent_posts(
            platform=account.platform,
            username=account.username,
            limit=limit,
            oauth_token=oauth_token,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not scraped:
        return []

    # Filter by date range if provided
    if date_from or date_to:
        from_ts = datetime.strptime(date_from, "%Y-%m-%d").replace(tzinfo=timezone.utc).timestamp() if date_from else None
        to_ts = (datetime.strptime(date_to, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc).timestamp()) if date_to else None
        filtered = []
        for post in scraped:
            if post.timestamp:
                if from_ts and post.timestamp < from_ts:
                    continue
                if to_ts and post.timestamp > to_ts:
                    continue
            filtered.append(post)
        scraped = filtered

    if not scraped:
        return []

    # 2. For each scraped post, save to DB + try audio download + ACRCloud
    results = []
    for post in scraped:
        # Determine stable media_id from scraped data (never random for cache lookups)
        media_id = post.video_id or f"auto_{post.url.__hash__() & 0xFFFFFFFFFF:010x}"

        # Skip already-scanned posts (by URL or media ID)
        cached = await db.execute(
            select(ExternalContent).where(
                ExternalContent.company_id == current_user.company_id,
                (ExternalContent.external_url == post.url) | (
                    (ExternalContent.platform == account.platform) &
                    (ExternalContent.external_media_id == media_id)
                ),
            ).limit(1)
        )
        if cached.scalar_one_or_none():
            continue

        content_type = (
            "tiktok_video" if account.platform == "tiktok"
            else f"{account.platform[:2]}_reel"
        )

        # Always create the ExternalContent record
        ext_content = ExternalContent(
            company_id=current_user.company_id,
            social_account_id=account_id,
            platform=account.platform,
            content_type=content_type,
            external_media_id=media_id,
            external_url=post.url,
            posted_at=datetime.fromtimestamp(post.timestamp, tz=timezone.utc) if post.timestamp else datetime.now(timezone.utc),
            raw_payload_json={
                "title": post.title,
                "uploader": post.uploader,
                "duration": post.duration,
                "source": "auto_scan",
            },
            reconciliation_status="unmatched",
            views=post.views,
            likes=post.likes,
            comments=post.comments,
            shares=post.shares,
        )
        db.add(ext_content)
        await db.flush()

        # Try audio download + ACRCloud identification
        det_responses: list = []
        try:
            audio_bytes, info_json_str = await social_download_service.download_audio(
                post.url, oauth_token=oauth_token if account.platform == "instagram" else None,
            )

            video_info = {}
            try:
                video_info = json.loads(info_json_str) if info_json_str else {}
            except json.JSONDecodeError:
                pass

            # Update with richer metadata from download
            payload = ext_content.raw_payload_json or {}
            payload.update({k: v for k, v in {
                "title": video_info.get("title"),
                "uploader": video_info.get("uploader"),
                "duration": video_info.get("duration"),
            }.items() if v})
            ext_content.raw_payload_json = payload

            raw_result = await acrcloud_service.identify_audio(audio_bytes, audio_format="wav")
            detections = await acrcloud_service.identify_and_match(
                db, current_user.company_id, ext_content,
                preloaded_result=raw_result,
            )
            det_responses = [AudioDetectionResponse.model_validate(d, from_attributes=True) for d in detections]

        except Exception as exc:
            logger.warning("Auto-scan: audio download/detect failed for %s: %s", post.url, exc)

        payload = ext_content.raw_payload_json or {}
        results.append(ContentWithDetectionResponse(
            id=ext_content.id,
            platform=ext_content.platform,
            content_type=ext_content.content_type,
            external_media_id=ext_content.external_media_id,
            external_url=ext_content.external_url,
            posted_at=ext_content.posted_at,
            reconciliation_status=ext_content.reconciliation_status,
            created_at=ext_content.created_at,
            caption=payload.get("title"),
            duration=payload.get("duration"),
            uploader=payload.get("uploader"),
            views=ext_content.views,
            likes=ext_content.likes,
            comments=ext_content.comments,
            shares=ext_content.shares,
            detection=det_responses[0] if det_responses else None,
            detections=det_responses,
        ))

    return results


@router.post("/refresh-tokens", tags=["social"])
async def refresh_instagram_tokens(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Refresh all Instagram long-lived tokens expiring within 30 days.
    
    Safe to call anytime — only refreshes tokens that need it.
    Tokens are renewed for another ~60 days each time.
    """
    from app.core.security import encrypt_token
    from app.services.meta_oauth_service import refresh_long_lived_token, compute_token_expiry
    from datetime import timedelta

    threshold = datetime.now(timezone.utc) + timedelta(days=30)

    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.company_id == current_user.company_id,
            SocialAccount.platform == "instagram",
            SocialAccount.access_token_encrypted.isnot(None),
            SocialAccount.status == "connected",
        )
    )
    accounts = result.scalars().all()

    refreshed = []
    failed = []

    for acct in accounts:
        # Skip if token still has more than 30 days
        if acct.token_expires_at and acct.token_expires_at > threshold:
            continue
        try:
            token = decrypt_token(acct.access_token_encrypted)
            data = await refresh_long_lived_token(token)
            new_token = data["access_token"]
            expires_in = data.get("expires_in", 5183944)  # ~60 days default
            acct.access_token_encrypted = encrypt_token(new_token)
            acct.token_expires_at = compute_token_expiry(expires_in)
            acct.updated_at = datetime.now(timezone.utc)
            refreshed.append({"username": acct.username, "expires_at": acct.token_expires_at.isoformat()})
        except Exception as e:
            logger.error(f"Token refresh failed for @{acct.username}: {e}")
            failed.append({"username": acct.username, "error": str(e)})

    await db.commit()
    return {"refreshed": refreshed, "failed": failed, "skipped": len(accounts) - len(refreshed) - len(failed)}
