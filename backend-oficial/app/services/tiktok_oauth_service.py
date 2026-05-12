"""
TikTok Login Kit — OAuth 2.0 service.

Flow:
1. generate_auth_url()   → redirect user to TikTok authorization
2. exchange_code()       → swap authorization code for access_token + refresh_token
3. refresh_token()       → refresh access_token (24h) using refresh_token (365 days)
4. get_user_info()       → fetch TikTok user profile (open_id, display_name, avatar)
5. list_videos()         → fetch user's public videos via /v2/video/list/
"""
import urllib.parse
from datetime import datetime, timedelta, timezone

import httpx

from app.core.config import get_settings

settings = get_settings()

TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/"
TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/"
TIKTOK_VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/"

SCOPES = [
    "user.info.basic",
    "video.list",
]


def generate_auth_url(state: str | None = None) -> str:
    """Build the TikTok OAuth authorization URL."""
    params = {
        "client_key": settings.TIKTOK_CLIENT_KEY,
        "redirect_uri": settings.TIKTOK_REDIRECT_URI,
        "scope": ",".join(SCOPES),
        "response_type": "code",
    }
    if state:
        params["state"] = state
    return f"{TIKTOK_AUTH_URL}?{urllib.parse.urlencode(params)}"


async def exchange_code(code: str) -> dict:
    """Exchange an authorization code for access_token + refresh_token."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            TIKTOK_TOKEN_URL,
            data={
                "client_key": settings.TIKTOK_CLIENT_KEY,
                "client_secret": settings.TIKTOK_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.TIKTOK_REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        resp.raise_for_status()
        return resp.json()
    # Returns: {access_token, expires_in(86400), open_id, refresh_token, refresh_expires_in(31536000), scope, token_type}


async def refresh_access_token(refresh_token_value: str) -> dict:
    """Refresh an expired access_token using the refresh_token."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            TIKTOK_TOKEN_URL,
            data={
                "client_key": settings.TIKTOK_CLIENT_KEY,
                "client_secret": settings.TIKTOK_CLIENT_SECRET,
                "grant_type": "refresh_token",
                "refresh_token": refresh_token_value,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        resp.raise_for_status()
        return resp.json()


async def get_user_info(access_token: str) -> dict:
    """Get the TikTok user profile."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            TIKTOK_USER_INFO_URL,
            params={"fields": "open_id,display_name,avatar_url"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("data", {}).get("user", {})


async def list_videos(access_token: str, max_count: int = 20, cursor: int | None = None) -> dict:
    """List the user's public TikTok videos."""
    body: dict = {"max_count": max_count}
    if cursor is not None:
        body["cursor"] = cursor
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{TIKTOK_VIDEO_LIST_URL}?fields=id,title,create_time,cover_image_url,share_url,duration,video_description,view_count,like_count,comment_count,share_count",
            json=body,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
        return resp.json()
    # Returns: {data: {videos: [...], cursor, has_more}, error: {code, message}}


def compute_token_expiry(expires_in: int) -> datetime:
    """Compute the token expiry datetime from expires_in seconds."""
    return datetime.now(timezone.utc) + timedelta(seconds=expires_in)
