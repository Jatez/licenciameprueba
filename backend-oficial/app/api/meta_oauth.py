"""Instagram API with Instagram Login — OAuth endpoints."""
import uuid
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import encrypt_token
from app.models.auth import User
from app.models.social import SocialAccount
from app.services import meta_oauth_service

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/auth/meta", tags=["meta-oauth"])


@router.get("/login")
async def meta_login(current_user: User = Depends(get_current_user)):
    """
    Return the Instagram OAuth URL that the frontend should redirect the user to.
    The state parameter encodes the user_id so we can link the callback.
    """
    if not settings.META_APP_ID:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="META_APP_NOT_CONFIGURED")
    state = str(current_user.id)
    url = meta_oauth_service.generate_auth_url(state=state)
    return {"auth_url": url}


@router.get("/callback")
async def meta_callback(
    code: str = Query(...),
    state: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """
    OAuth callback — Instagram redirects here after user authorizes.
    Exchanges code for tokens, fetches IG profile,
    creates SocialAccount record, then redirects to frontend.
    """
    if not state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MISSING_STATE")

    try:
        user_id = uuid.UUID(state)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_STATE")

    # Verify user exists
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="USER_NOT_FOUND")

    # 1. Exchange code for short-lived token (1 hour)
    try:
        token_data = await meta_oauth_service.exchange_code(code)
    except Exception as exc:
        logger.error("Instagram token exchange failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="META_TOKEN_EXCHANGE_FAILED")

    short_token = token_data["access_token"]
    ig_user_id = str(token_data.get("user_id", ""))

    # 2. Exchange for long-lived token (~60 days)
    try:
        ll_data = await meta_oauth_service.get_long_lived_token(short_token)
        access_token = ll_data["access_token"]
        expires_in = ll_data.get("expires_in", 5184000)  # default 60 days
    except Exception as exc:
        logger.warning("Long-lived token exchange failed, using short-lived: %s", exc)
        access_token = short_token
        expires_in = 3600

    token_expiry = meta_oauth_service.compute_token_expiry(expires_in)
    encrypted_token = encrypt_token(access_token)

    # 3. Get the Instagram user profile
    try:
        ig_profile = await meta_oauth_service.get_ig_profile(access_token)
        ig_username = ig_profile.get("username", "")
        ig_user_id = str(ig_profile.get("user_id", ig_user_id))
    except Exception as exc:
        logger.warning("Failed to get IG profile, using user_id from token: %s", exc)
        ig_username = ""

    # 4. Save/update the Instagram account
    await _upsert_social_account(
        db,
        company_id=user.company_id,
        platform="instagram",
        external_id=ig_user_id,
        username=ig_username,
        token=encrypted_token,
        token_expires=token_expiry,
    )

    await db.commit()

    # Redirect back to frontend social accounts page
    return RedirectResponse(url=f"{settings.FRONTEND_URL}/social?meta=connected")


@router.get("/status")
async def meta_status(current_user: User = Depends(get_current_user)):
    """Check if Meta OAuth is configured."""
    configured = bool(settings.META_APP_ID and settings.META_APP_SECRET)
    return {"configured": configured}


# ── Facebook Login OAuth ──────────────────────────────────────────────────


@router.get("/fb-login")
async def fb_login(current_user: User = Depends(get_current_user)):
    """Return the Facebook OAuth URL."""
    if not settings.META_APP_ID:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="META_APP_NOT_CONFIGURED")
    state = str(current_user.id)
    url = meta_oauth_service.fb_generate_auth_url(state=state)
    return {"auth_url": url}


@router.get("/fb-callback")
async def fb_callback(
    code: str = Query(...),
    state: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """Facebook OAuth callback — exchanges code, fetches profile, saves account."""
    if not state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MISSING_STATE")

    try:
        user_id = uuid.UUID(state)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_STATE")

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="USER_NOT_FOUND")

    # 1. Exchange code for token
    try:
        token_data = await meta_oauth_service.fb_exchange_code(code)
    except Exception as exc:
        logger.error("Facebook token exchange failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="FB_TOKEN_EXCHANGE_FAILED")

    short_token = token_data["access_token"]
    expires_in = token_data.get("expires_in", 5184000)

    # 2. Exchange for long-lived token
    try:
        ll_data = await meta_oauth_service.fb_get_long_lived_token(short_token)
        access_token = ll_data["access_token"]
        expires_in = ll_data.get("expires_in", 5184000)
    except Exception as exc:
        logger.warning("FB long-lived token failed, using short-lived: %s", exc)
        access_token = short_token

    token_expiry = meta_oauth_service.compute_token_expiry(expires_in)
    encrypted_token = encrypt_token(access_token)

    # 3. Get Facebook profile
    fb_user_id = ""
    fb_name = ""
    try:
        fb_profile = await meta_oauth_service.fb_get_profile(access_token)
        fb_user_id = str(fb_profile.get("id", ""))
        fb_name = fb_profile.get("name", "")
    except Exception as exc:
        logger.warning("Failed to get FB profile: %s", exc)

    # 4. Save/update Facebook account
    await _upsert_social_account(
        db,
        company_id=user.company_id,
        platform="facebook",
        external_id=fb_user_id,
        username=fb_name,
        token=encrypted_token,
        token_expires=token_expiry,
    )

    await db.commit()

    return RedirectResponse(url=f"{settings.FRONTEND_URL}/social?meta=fb-connected")


async def _upsert_social_account(
    db: AsyncSession,
    company_id: uuid.UUID,
    platform: str,
    external_id: str,
    username: str,
    token: str,
    token_expires,
):
    """Insert or update a social account with token info."""
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.company_id == company_id,
            SocialAccount.platform == platform,
            SocialAccount.external_account_id == external_id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.username = username or existing.username
        existing.access_token_encrypted = token
        existing.token_expires_at = token_expires
        existing.status = "connected"
    else:
        db.add(SocialAccount(
            company_id=company_id,
            platform=platform,
            external_account_id=external_id,
            username=username,
            access_token_encrypted=token,
            token_expires_at=token_expires,
            status="connected",
        ))
