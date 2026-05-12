"""
Service to scrape recent posts from public social media profiles.

Supported platforms:
- TikTok: Full support via yt-dlp
- Instagram: via instaloader (requires INSTAGRAM_USERNAME/PASSWORD in .env)
- Facebook: via yt-dlp (limited, may require cookies)

Returns a list of video metadata (URL, ID, title, uploader, timestamp)
without downloading the actual content.
"""
import asyncio
import json
import logging
from dataclasses import dataclass

from app.core.config import get_settings

logger = logging.getLogger(__name__)


PROFILE_URL_TEMPLATES = {
    "tiktok": "https://www.tiktok.com/@{username}",
    "facebook": "https://www.facebook.com/{username}/videos",
}


@dataclass
class ScrapedPost:
    video_id: str
    url: str
    title: str | None
    uploader: str | None
    timestamp: int | None  # unix ts
    duration: float | None
    views: int | None = None
    likes: int | None = None
    comments: int | None = None
    shares: int | None = None
    thumbnail_url: str | None = None


async def _scrape_instagram(username: str, limit: int) -> list[ScrapedPost]:
    """
    Scrape Instagram profile using instaloader.
    Requires INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD in .env.
    Runs in a thread pool since instaloader is synchronous.
    """
    settings = get_settings()
    if not settings.INSTAGRAM_USERNAME or not settings.INSTAGRAM_PASSWORD:
        raise ValueError(
            "INSTAGRAM_AUTH_REQUIRED: Para escanear perfiles de Instagram, "
            "configura INSTAGRAM_USERNAME e INSTAGRAM_PASSWORD en tu archivo .env. "
            "También puedes pegar links individuales usando 'Escanear URLs específicas'."
        )

    import instaloader
    from instaloader.exceptions import (
        ProfileNotExistsException,
        ConnectionException,
        LoginRequiredException,
    )

    def _sync_scrape() -> list[ScrapedPost]:
        L = instaloader.Instaloader(
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False,
            compress_json=False,
        )

        try:
            L.login(settings.INSTAGRAM_USERNAME, settings.INSTAGRAM_PASSWORD)
        except Exception as e:
            raise ValueError(
                f"INSTAGRAM_LOGIN_FAILED: No se pudo iniciar sesión en Instagram: {str(e)[:150]}"
            )

        try:
            profile = instaloader.Profile.from_username(L.context, username)
        except ProfileNotExistsException:
            raise ValueError(f"PROFILE_NOT_FOUND: El perfil @{username} no existe en Instagram")
        except (ConnectionException, LoginRequiredException) as e:
            raise ValueError(f"INSTAGRAM_CONNECTION_ERROR: {str(e)[:150]}")

        results: list[ScrapedPost] = []
        for i, post in enumerate(profile.get_posts()):
            if i >= limit:
                break

            shortcode = post.shortcode
            url = f"https://www.instagram.com/reel/{shortcode}/" if post.is_video else f"https://www.instagram.com/p/{shortcode}/"
            ts = int(post.date_utc.timestamp()) if post.date_utc else None

            results.append(ScrapedPost(
                video_id=shortcode,
                url=url,
                title=(post.caption or "")[:100] if post.caption else None,
                uploader=username,
                timestamp=ts,
                duration=post.video_duration if post.is_video else None,
            ))

        return results

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_scrape)


async def _scrape_with_ytdlp(platform: str, username: str, limit: int) -> list[ScrapedPost]:
    """Scrape TikTok or Facebook profiles using yt-dlp."""
    template = PROFILE_URL_TEMPLATES.get(platform)
    if not template:
        raise ValueError(f"PLATFORM_NOT_SUPPORTED: No se puede escanear perfiles de '{platform}'")

    profile_url = template.format(username=username)

    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "-J",
        "--playlist-items", f"1:{limit}",
        "--no-warnings",
    ]

    settings = get_settings()
    if settings.YTDLP_COOKIES_FROM_BROWSER:
        cmd.extend(["--cookies-from-browser", settings.YTDLP_COOKIES_FROM_BROWSER])

    cmd.append(profile_url)

    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=60)

    if process.returncode != 0:
        err = stderr.decode("utf-8", errors="replace").strip()
        if "broken" in err.lower():
            raise ValueError(
                f"SCRAPE_FAILED: yt-dlp no puede acceder a perfiles de {platform}. "
                f"Usa 'Escanear URLs específicas' para pegar links manualmente."
            )
        if "unsupported url" in err.lower() or "not found" in err.lower():
            raise ValueError(
                f"SCRAPE_FAILED: yt-dlp no soporta la URL del perfil de {platform}. "
                f"Usa 'Escanear URLs específicas' para pegar links manualmente."
            )
        raise ValueError(f"SCRAPE_FAILED: {err[:200]}")

    raw = stdout.decode("utf-8", errors="replace").strip()
    if not raw or raw == "null":
        raise ValueError("SCRAPE_EMPTY: No se encontraron publicaciones en el perfil")

    data = json.loads(raw)
    entries = data.get("entries", [])

    results: list[ScrapedPost] = []
    for entry in entries:
        vid = entry.get("id", "")
        url = entry.get("url") or entry.get("webpage_url") or ""
        if not url and platform == "tiktok" and vid:
            url = f"https://www.tiktok.com/@{username}/video/{vid}"

        if not url:
            continue

        results.append(ScrapedPost(
            video_id=vid,
            url=url,
            title=entry.get("title"),
            uploader=entry.get("uploader") or entry.get("channel") or username,
            timestamp=entry.get("timestamp"),
            duration=entry.get("duration"),
        ))

    return results


async def _scrape_instagram_graph_api(username: str, limit: int, oauth_token: str) -> list[ScrapedPost]:
    """
    Scrape Instagram posts using the Instagram Graph API with an OAuth token.
    Uses the instagram_business_basic permission.
    Only returns VIDEO and CAROUSEL items (skips IMAGE-only posts since they have no audio).
    """
    import httpx

    # Request more than limit to account for IMAGE posts we'll skip
    fetch_limit = min(limit * 3, 50)
    fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count"
    url = f"https://graph.instagram.com/me/media?fields={fields}&limit={fetch_limit}&access_token={oauth_token}"

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)

    if resp.status_code == 190 or resp.status_code == 401:
        raise ValueError(
            "INSTAGRAM_TOKEN_EXPIRED: El token de Instagram ha expirado. "
            "Reconecta tu cuenta desde la sección de cuentas sociales."
        )
    if resp.status_code != 200:
        error_msg = resp.text[:200]
        logger.error("Instagram Graph API error %s: %s", resp.status_code, error_msg)
        raise ValueError(f"INSTAGRAM_API_ERROR: Error al consultar Instagram ({resp.status_code})")

    data = resp.json()
    entries = data.get("data", [])

    results: list[ScrapedPost] = []
    for entry in entries:
        if len(results) >= limit:
            break

        media_type = entry.get("media_type", "")
        permalink = entry.get("permalink", "")
        if not permalink:
            continue

        # Skip IMAGE posts — they have no audio to detect
        if media_type == "IMAGE":
            continue

        # For VIDEO posts, convert /p/ permalink to /reel/ for yt-dlp compatibility
        # Instagram /reel/ URLs work better with yt-dlp than /p/ URLs
        # CAROUSEL_ALBUM posts keep their /p/ URL (they're not reels)
        download_url = permalink
        if media_type == "VIDEO" and "/p/" in permalink:
            shortcode = permalink.rstrip("/").split("/")[-1]
            download_url = f"https://www.instagram.com/reel/{shortcode}/"

        ts = None
        if entry.get("timestamp"):
            from datetime import datetime as dt, timezone as tz_mod
            try:
                raw_ts = entry["timestamp"]
                # Instagram Graph API returns ISO 8601 like "2025-01-15T10:30:00+0000"
                # Python 3.10 fromisoformat doesn't support "+0000", needs "+00:00"
                # Also handle "Z" suffix
                raw_ts = raw_ts.replace("Z", "+00:00")
                # Convert +0000 → +00:00 (insert colon in timezone offset)
                if len(raw_ts) >= 5 and raw_ts[-5] in ('+', '-') and ':' not in raw_ts[-5:]:
                    raw_ts = raw_ts[:-2] + ':' + raw_ts[-2:]
                ts = int(dt.fromisoformat(raw_ts).timestamp())
            except (ValueError, TypeError):
                pass

        results.append(ScrapedPost(
            video_id=entry.get("id", ""),
            url=download_url,
            title=entry.get("caption") or None,
            uploader=username,
            timestamp=ts,
            duration=None,
            likes=entry.get("like_count"),
            comments=entry.get("comments_count"),
            thumbnail_url=entry.get("thumbnail_url") or entry.get("media_url") or None,
        ))

    return results


async def _scrape_facebook_graph_api(username: str, limit: int, oauth_token: str) -> list[ScrapedPost]:
    """
    Scrape Facebook videos using the Facebook Graph API with an OAuth token.
    Uses the user_videos permission. Returns uploaded videos.
    """
    import httpx

    fields = "id,description,created_time,permalink_url,length,title,views"
    url = f"https://graph.facebook.com/v21.0/me/videos?type=uploaded&fields={fields}&limit={limit}&access_token={oauth_token}"

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)

    if resp.status_code in (190, 401):
        raise ValueError(
            "FACEBOOK_TOKEN_EXPIRED: El token de Facebook ha expirado. "
            "Reconecta tu cuenta desde la sección de cuentas sociales."
        )
    if resp.status_code != 200:
        error_msg = resp.text[:200]
        logger.error("Facebook Graph API error %s: %s", resp.status_code, error_msg)
        raise ValueError(f"FACEBOOK_API_ERROR: Error al consultar Facebook ({resp.status_code})")

    data = resp.json()
    entries = data.get("data", [])

    results: list[ScrapedPost] = []
    for entry in entries:
        if len(results) >= limit:
            break

        permalink = entry.get("permalink_url", "")
        if not permalink:
            video_id = entry.get("id", "")
            if video_id:
                permalink = f"https://www.facebook.com/{username}/videos/{video_id}"
            else:
                continue

        ts = None
        if entry.get("created_time"):
            from datetime import datetime as dt
            try:
                raw_ts = entry["created_time"]
                raw_ts = raw_ts.replace("Z", "+00:00")
                if len(raw_ts) >= 5 and raw_ts[-5] in ('+', '-') and ':' not in raw_ts[-5:]:
                    raw_ts = raw_ts[:-2] + ':' + raw_ts[-2:]
                ts = int(dt.fromisoformat(raw_ts).timestamp())
            except (ValueError, TypeError):
                pass

        caption = entry.get("description") or entry.get("title") or None

        results.append(ScrapedPost(
            video_id=entry.get("id", ""),
            url=permalink,
            title=caption,
            uploader=username,
            timestamp=ts,
            duration=entry.get("length"),
            views=entry.get("views"),
        ))

    return results


async def _scrape_tiktok_api(username: str, limit: int, oauth_token: str) -> list[ScrapedPost]:
    """Fetch recent TikTok videos using the official TikTok API (Login Kit)."""
    from app.services import tiktok_oauth_service

    data = await tiktok_oauth_service.list_videos(oauth_token, max_count=min(limit, 20))
    videos = data.get("data", {}).get("videos", [])
    results: list[ScrapedPost] = []
    for v in videos[:limit]:
        ts = v.get("create_time")  # unix timestamp (int)
        caption = v.get("video_description") or v.get("title") or None
        results.append(ScrapedPost(
            video_id=str(v.get("id", "")),
            url=v.get("share_url", ""),
            title=caption,
            uploader=username,
            timestamp=int(ts) if ts else None,
            duration=v.get("duration"),
            views=v.get("view_count"),
            likes=v.get("like_count"),
            comments=v.get("comment_count"),
            shares=v.get("share_count"),
        ))
    return results


async def scrape_recent_posts(
    platform: str,
    username: str,
    limit: int = 5,
    oauth_token: str | None = None,
) -> list[ScrapedPost]:
    """
    Scrape the most recent posts from a public social media profile.

    - Instagram (with OAuth token): uses Instagram Graph API
    - Instagram (without token): uses instaloader (requires credentials in .env)
    - Facebook (with OAuth token): uses Facebook Graph API
    - Facebook (without token): uses yt-dlp
    - TikTok (with OAuth token): uses TikTok API
    - TikTok (without token): uses yt-dlp

    Raises ValueError if the platform is unsupported or scraping fails.
    """
    if platform == "instagram":
        if oauth_token:
            return await _scrape_instagram_graph_api(username, limit, oauth_token)
        return await _scrape_instagram(username, limit)
    elif platform == "facebook":
        if oauth_token:
            return await _scrape_facebook_graph_api(username, limit, oauth_token)
        return await _scrape_with_ytdlp(platform, username, limit)
    elif platform == "tiktok":
        if oauth_token:
            return await _scrape_tiktok_api(username, limit, oauth_token)
        return await _scrape_with_ytdlp(platform, username, limit)
    elif platform in PROFILE_URL_TEMPLATES:
        return await _scrape_with_ytdlp(platform, username, limit)
    else:
        raise ValueError(f"PLATFORM_NOT_SUPPORTED: No se puede escanear perfiles de '{platform}')")
