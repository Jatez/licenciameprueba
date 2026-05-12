"""TikTok Login Kit — OAuth endpoints."""
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
from app.services import tiktok_oauth_service

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/auth/tiktok", tags=["tiktok-oauth"])


@router.get("/login")
async def tiktok_login(current_user: User = Depends(get_current_user)):
    """Return the TikTok OAuth URL that the frontend should redirect the user to."""
    if not settings.TIKTOK_CLIENT_KEY:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="TIKTOK_NOT_CONFIGURED")
    state = str(current_user.id)
    url = tiktok_oauth_service.generate_auth_url(state=state)
    return {"auth_url": url}


@router.get("/callback")
async def tiktok_callback(
    code: str = Query(...),
    state: str = Query(default=""),
    scopes: str = Query(default=""),
    error: str = Query(default=""),
    error_description: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """
    TikTok OAuth callback — exchanges code for tokens, fetches profile,
    creates SocialAccount, then redirects to frontend.
    """
    if error:
        logger.error("TikTok OAuth error: %s — %s", error, error_description)
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/social?tiktok=error")

    if not state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MISSING_STATE")

    try:
        user_id = uuid.UUID(state)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="INVALID_STATE")

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="USER_NOT_FOUND")

    # 1. Exchange code for access_token + refresh_token
    try:
        token_data = await tiktok_oauth_service.exchange_code(code)
    except Exception as exc:
        logger.error("TikTok token exchange failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="TIKTOK_TOKEN_EXCHANGE_FAILED")

    access_token = token_data.get("access_token", "")
    open_id = token_data.get("open_id", "")
    expires_in = token_data.get("expires_in", 86400)  # 24h default
    refresh_token = token_data.get("refresh_token", "")

    token_expiry = tiktok_oauth_service.compute_token_expiry(expires_in)
    encrypted_token = encrypt_token(access_token)

    # 2. Get TikTok user profile
    tt_display_name = ""
    try:
        profile = await tiktok_oauth_service.get_user_info(access_token)
        tt_display_name = profile.get("display_name", "")
        open_id = profile.get("open_id", open_id)
    except Exception as exc:
        logger.warning("Failed to get TikTok profile: %s", exc)

    # 3. Save/update TikTok account
    result = await db.execute(
        select(SocialAccount).where(
            SocialAccount.company_id == user.company_id,
            SocialAccount.platform == "tiktok",
            SocialAccount.external_account_id == open_id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.username = tt_display_name or existing.username
        existing.access_token_encrypted = encrypted_token
        existing.token_expires_at = token_expiry
        existing.status = "connected"
    else:
        db.add(SocialAccount(
            company_id=user.company_id,
            platform="tiktok",
            external_account_id=open_id,
            username=tt_display_name,
            access_token_encrypted=encrypted_token,
            token_expires_at=token_expiry,
            status="connected",
        ))

    await db.commit()

    return RedirectResponse(url=f"{settings.FRONTEND_URL}/social?tiktok=connected")


@router.get("/status")
async def tiktok_status(current_user: User = Depends(get_current_user)):
    """Check if TikTok OAuth is configured."""
    configured = bool(settings.TIKTOK_CLIENT_KEY and settings.TIKTOK_CLIENT_SECRET)
    return {"configured": configured}
