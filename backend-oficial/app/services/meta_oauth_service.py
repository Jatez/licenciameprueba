"""
Instagram API with Instagram Login — OAuth 2.0 service.

Flow (Instagram Login):
1. generate_auth_url()     → redirect user to Instagram authorization
2. exchange_code()         → swap authorization code for short-lived token (1 hr)
3. get_long_lived_token()  → exchange for long-lived token (~60 days)
4. get_ig_profile()        → fetch Instagram user profile (id, username)
"""
import urllib.parse
from datetime import datetime, timedelta, timezone

import httpx

from app.core.config import get_settings

settings = get_settings()

IG_GRAPH_API = "https://graph.instagram.com"

# Scopes for Instagram API with Instagram Login
# Only read-only permissions: profile, posts, and metrics.
# No publish, comments, or messaging access.
SCOPES = [
    "instagram_business_basic",
    "instagram_business_manage_insights",
]


def generate_auth_url(state: str | None = None) -> str:
    """Build the Instagram OAuth authorization URL."""
    params = {
        "client_id": settings.META_APP_ID,
        "redirect_uri": settings.META_REDIRECT_URI,
        "scope": ",".join(SCOPES),
        "response_type": "code",
        "enable_fb_login": "0",
        "force_authentication": "1",
    }
    if state:
        params["state"] = state
    return f"https://www.instagram.com/oauth/authorize?{urllib.parse.urlencode(params)}"


async def exchange_code(code: str) -> dict:
    """Exchange an authorization code for a short-lived access token (1 hour)."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            "https://api.instagram.com/oauth/access_token",
            data={
                "client_id": settings.META_APP_ID,
                "client_secret": settings.META_APP_SECRET,
                "grant_type": "authorization_code",
                "redirect_uri": settings.META_REDIRECT_URI,
                "code": code,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {access_token, user_id}


async def get_long_lived_token(short_token: str) -> dict:
    """Exchange a short-lived token for a long-lived token (~60 days)."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{IG_GRAPH_API}/access_token",
            params={
                "grant_type": "ig_exchange_token",
                "client_secret": settings.META_APP_SECRET,
                "access_token": short_token,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {access_token, token_type, expires_in}


async def get_ig_profile(access_token: str) -> dict:
    """Get the Instagram user profile for this token."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{IG_GRAPH_API}/me",
            params={
                "fields": "user_id,username,account_type,profile_picture_url",
                "access_token": access_token,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {user_id, username, account_type, ...}


def compute_token_expiry(expires_in: int) -> datetime:
    """Compute UTC expiration datetime from expires_in seconds."""
    return datetime.now(timezone.utc) + timedelta(seconds=expires_in)


async def refresh_long_lived_token(token: str) -> dict:
    """Refresh a long-lived Instagram token before it expires (valid for another ~60 days).
    
    Meta allows refreshing any long-lived token that hasn't expired yet.
    Call this every ~30 days to keep the token alive indefinitely.
    Returns: {access_token, token_type, expires_in}
    """
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{IG_GRAPH_API}/refresh_access_token",
            params={
                "grant_type": "ig_refresh_token",
                "access_token": token,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {access_token, token_type, expires_in}


# ── Facebook Login OAuth ──────────────────────────────────────────────────

FB_GRAPH_API = "https://graph.facebook.com/v21.0"

FB_SCOPES = [
    "public_profile",
    "email",
]


def fb_generate_auth_url(state: str | None = None) -> str:
    """Build the Facebook OAuth authorization URL."""
    params = {
        "client_id": settings.FB_APP_ID,
        "redirect_uri": settings.META_FB_REDIRECT_URI,
        "scope": ",".join(FB_SCOPES),
        "response_type": "code",
    }
    if state:
        params["state"] = state
    return f"https://www.facebook.com/v21.0/dialog/oauth?{urllib.parse.urlencode(params)}"


async def fb_exchange_code(code: str) -> dict:
    """Exchange a Facebook authorization code for an access token."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{FB_GRAPH_API}/oauth/access_token",
            params={
                "client_id": settings.FB_APP_ID,
                "redirect_uri": settings.META_FB_REDIRECT_URI,
                "client_secret": settings.FB_APP_SECRET,
                "code": code,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {access_token, token_type, expires_in}


async def fb_get_long_lived_token(short_token: str) -> dict:
    """Exchange a short-lived FB token for a long-lived token (~60 days)."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            f"{FB_GRAPH_API}/oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": settings.FB_APP_ID,
                "client_secret": settings.FB_APP_SECRET,
                "fb_exchange_token": short_token,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {access_token, token_type, expires_in}


async def fb_get_profile(access_token: str) -> dict:
    """Get the Facebook user profile."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{FB_GRAPH_API}/me",
            params={
                "fields": "id,name",
                "access_token": access_token,
            },
        )
        resp.raise_for_status()
        return resp.json()  # {id, name}
