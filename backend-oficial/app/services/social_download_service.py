"""
Service to download audio from public social media URLs.
Uses yt-dlp to download video and ffmpeg to extract audio.

Optimized for minimal resource usage:
- Downloads only first 15s of audio (ACRCloud needs ~10s)
- Uses 8000Hz mono WAV (fingerprinting works at low sample rates)
- Single yt-dlp call with --print-json to get metadata + audio in one request
"""
import asyncio
import json
import logging
import os
import re
import tempfile
import uuid
from pathlib import Path

from app.core.config import get_settings

logger = logging.getLogger(__name__)


ALLOWED_DOMAINS = [
    "instagram.com",
    "www.instagram.com",
    "facebook.com",
    "www.facebook.com",
    "fb.watch",
    "tiktok.com",
    "www.tiktok.com",
    "vm.tiktok.com",
    "vt.tiktok.com",
    "m.facebook.com",
    "m.tiktok.com",
]


def _validate_url(url: str) -> bool:
    """Validate that the URL is from a supported social media platform."""
    from urllib.parse import urlparse
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        return any(parsed.hostname == d or (parsed.hostname and parsed.hostname.endswith("." + d)) for d in ALLOWED_DOMAINS)
    except Exception:
        return False


async def download_audio(url: str, max_duration_sec: int = 15, *, oauth_token: str | None = None) -> tuple[bytes, str]:
    """
    Download audio from a public social media URL.
    
    Returns (audio_bytes, info_json_str) tuple.
    Audio: WAV mono 8000Hz, max 15s — optimized for ACRCloud fingerprinting.
    Single yt-dlp invocation for both download + metadata.
    
    For Instagram carousels (image posts with music), pass oauth_token
    to use the Instagram Graph API for audio extraction.
    
    Raises ValueError if URL is invalid or download fails.
    """
    if not _validate_url(url):
        raise ValueError("URL_NOT_SUPPORTED: Solo se aceptan links de Instagram, Facebook o TikTok")

    # TikTok "photo" (slideshow) URLs use /photo/ but yt-dlp only recognises /video/
    if "tiktok.com" in url and "/photo/" in url:
        url = url.replace("/photo/", "/video/")

    tmp_dir = tempfile.mkdtemp(prefix="dualtee_")
    base_name = uuid.uuid4().hex
    audio_path = os.path.join(tmp_dir, f"{base_name}.wav")

    try:
        # Single yt-dlp call: download + extract audio + print JSON metadata
        cmd = [
            "yt-dlp",
            "--no-playlist",
            "--max-filesize", "20M",
            "--extract-audio",
            "--audio-format", "wav",
            "--postprocessor-args", f"ffmpeg:-ac 1 -ar 8000 -t {max_duration_sec}",
            "--output", audio_path.replace(".wav", ".%(ext)s"),
            "--print-json",
            "--no-simulate",
            "--no-warnings",
        ]

        # Inject browser cookies for authenticated content (stories, private reels)
        cookies_browser = get_settings().YTDLP_COOKIES_FROM_BROWSER
        if cookies_browser:
            cmd.extend(["--cookies-from-browser", cookies_browser])

        cmd.append(url)

        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=90)

        if process.returncode != 0:
            error_msg = stderr.decode("utf-8", errors="replace").strip()
            # yt-dlp exits non-zero when ffprobe can't detect audio codec on
            # image/carousel posts — this is expected, not a real error.
            if "unable to obtain file audio codec" in error_msg.lower():
                raise ValueError("AUDIO_EXTRACTION_FAILED: El post no contiene audio descargable")
            if "Private" in error_msg or "log in" in error_msg.lower() or "login" in error_msg.lower():
                raise ValueError("CONTENT_PRIVATE: El contenido es privado o requiere login. Configura YTDLP_COOKIES_FROM_BROWSER en .env")
            # Instagram carousel/image posts with music: yt-dlp can't find video formats.
            # Try fallback via Instagram API to extract the music audio.
            if "no video formats found" in error_msg.lower() and "instagram" in url.lower():
                return await _instagram_carousel_fallback(url, tmp_dir, max_duration_sec, oauth_token=oauth_token)
            if "not found" in error_msg.lower() or "404" in error_msg:
                raise ValueError("CONTENT_NOT_FOUND: No se encontró el contenido en esa URL")
            raise ValueError(f"DOWNLOAD_FAILED: {error_msg[:200]}")

        # Find the output .wav file
        wav_files = list(Path(tmp_dir).glob("*.wav"))
        if not wav_files:
            # yt-dlp may succeed (exit 0) for Instagram carousels with only images,
            # producing no audio files. Trigger carousel fallback in that case.
            if "instagram" in url.lower():
                return await _instagram_carousel_fallback(url, tmp_dir, max_duration_sec, oauth_token=oauth_token)
            raise ValueError("AUDIO_EXTRACTION_FAILED: No se pudo extraer audio del video")

        audio_bytes = wav_files[0].read_bytes()

        if len(audio_bytes) < 1000:
            raise ValueError("AUDIO_TOO_SHORT: El audio extraído es demasiado corto")

        # Parse JSON metadata from stdout (--print-json outputs it there)
        info_json = stdout.decode("utf-8", errors="replace").strip() if stdout else "{}"

        return audio_bytes, info_json

    finally:
        import shutil
        shutil.rmtree(tmp_dir, ignore_errors=True)


# ---------------------------------------------------------------------------
# Instagram carousel fallback: extract music from carousel/image posts
# ---------------------------------------------------------------------------

def _find_audio_url(item: dict) -> str | None:
    """Extract audio/music download URL from Instagram media API response."""
    # Method 1: clips_music_attribution_info (posts with music sticker / audio)
    clips_music = item.get("clips_music_attribution_info")
    if clips_music:
        url = clips_music.get("audio_asset_url")
        if url:
            return url

    # Method 2: music_metadata → music_info → music_asset_info
    music_meta = item.get("music_metadata")
    if music_meta:
        music_info = music_meta.get("music_info", {})
        music_asset = music_info.get("music_asset_info", {})
        url = (
            music_asset.get("progressive_download_url")
            or music_asset.get("fast_start_progressive_download_url")
        )
        if url:
            return url

    # Method 3: carousel children that are actually videos
    for child in item.get("carousel_media", []):
        video_versions = child.get("video_versions")
        if video_versions:
            return video_versions[0].get("url")

    return None


async def _fetch_carousel_audio_graphql(shortcode: str) -> tuple[bytes, dict] | None:
    """
    Use Instagram's public web GraphQL API to check if a carousel post has
    music (clips_music_attribution_info) or a video child with audio.

    No authentication required — only needs a CSRF cookie obtained from
    visiting instagram.com.

    Returns (audio_bytes, info_dict) or None.
    """
    import httpx

    graphql_url = "https://www.instagram.com/graphql/query"
    doc_id = "8845758582119845"
    variables = json.dumps({"shortcode": shortcode})

    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            # Get CSRF cookie
            home = await client.get("https://www.instagram.com/")
            csrf = home.cookies.get("csrftoken", "")

            resp = await client.get(
                graphql_url,
                params={"doc_id": doc_id, "variables": variables},
                headers={"X-CSRFToken": csrf},
            )

        if resp.status_code != 200:
            logger.warning("Carousel GraphQL: status %s for %s", resp.status_code, shortcode)
            return None

        data = resp.json()
        media = (
            data.get("data", {}).get("xdt_shortcode_media")
            or data.get("data", {}).get("shortcode_media")
        )
        if not media:
            logger.warning("Carousel GraphQL: no media in response for %s", shortcode)
            return None

    except Exception as e:
        logger.warning("Carousel GraphQL: request failed for %s: %s", shortcode, e)
        return None

    caption = ""
    caption_edges = media.get("edge_media_to_caption", {}).get("edges", [])
    if caption_edges:
        caption = caption_edges[0].get("node", {}).get("text", "")
    owner = media.get("owner", {}).get("username", "")

    # Check carousel-level music attribution
    clips_music = media.get("clips_music_attribution_info")
    if clips_music and clips_music.get("audio_id"):
        logger.info("Carousel GraphQL: found music attribution for %s: %s - %s",
                     shortcode, clips_music.get("artist_name"), clips_music.get("song_name"))

        # Download audio from video_url (which contains the music)
        video_url = media.get("video_url")
        if video_url:
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    vresp = await client.get(video_url)
                if vresp.status_code == 200 and len(vresp.content) > 1000:
                    info = {
                        "id": shortcode,
                        "title": caption[:100] if caption else None,
                        "uploader": owner,
                        "source": "instagram_carousel_music",
                        "artist": clips_music.get("artist_name"),
                        "song": clips_music.get("song_name"),
                    }
                    return vresp.content, info
            except Exception as e:
                logger.warning("Carousel GraphQL: video download failed: %s", e)

    # Fallback: check sidecar children for video with audio
    sidecar = media.get("edge_sidecar_to_children", {})
    for edge in sidecar.get("edges", []):
        child = edge.get("node", {})
        if child.get("is_video") and child.get("has_audio"):
            video_url = child.get("video_url")
            if not video_url:
                continue
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    vresp = await client.get(video_url)
                if vresp.status_code == 200 and len(vresp.content) > 1000:
                    info = {
                        "id": shortcode,
                        "title": caption[:100] if caption else None,
                        "uploader": owner,
                        "source": "instagram_carousel_video",
                    }
                    return vresp.content, info
            except Exception as e:
                logger.warning("Carousel GraphQL: child video download failed: %s", e)

    logger.info("Carousel GraphQL: no audio found for %s", shortcode)
    return None


async def _fetch_carousel_audio_oauth(shortcode: str, oauth_token: str) -> tuple[bytes, dict] | None:
    """
    Use the Instagram Graph API (OAuth token) to find VIDEO children inside a
    carousel post, download them, and extract audio via ffprobe check.

    Returns (audio_bytes, info_dict) or None.
    """
    import httpx

    # Step 1: Find the carousel in the user's recent media
    ig_media_id = None
    caption = None
    username = None

    fields = "id,permalink,caption,media_type,username"
    api_url = f"https://graph.instagram.com/me/media?fields={fields}&limit=50&access_token={oauth_token}"

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(api_url)

        if resp.status_code != 200:
            logger.warning("Carousel OAuth: Graph API returned %s", resp.status_code)
            return None

        data = resp.json()
        for entry in data.get("data", []):
            permalink = entry.get("permalink", "")
            if shortcode in permalink:
                ig_media_id = entry.get("id")
                caption = entry.get("caption")
                username = entry.get("username")
                break

        if not ig_media_id:
            logger.info("Carousel OAuth: post %s not found in user's recent media", shortcode)
            return None

    except Exception as e:
        logger.warning("Carousel OAuth: Graph API request failed: %s", e)
        return None

    # Step 2: Get carousel children
    children_url = (
        f"https://graph.instagram.com/{ig_media_id}/children"
        f"?fields=id,media_type,media_url&access_token={oauth_token}"
    )
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(children_url)

        if resp.status_code != 200:
            logger.warning("Carousel OAuth: children endpoint returned %s", resp.status_code)
            return None

        children_data = resp.json().get("data", [])
    except Exception as e:
        logger.warning("Carousel OAuth: children request failed: %s", e)
        return None

    video_children = [c for c in children_data if c.get("media_type") == "VIDEO"]
    if not video_children:
        logger.info("Carousel OAuth: no VIDEO children in carousel %s", shortcode)
        return None

    # Step 3: Download each VIDEO child and check for audio
    for child in video_children:
        media_url = child.get("media_url")
        if not media_url:
            continue

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                video_resp = await client.get(media_url)
            if video_resp.status_code != 200 or len(video_resp.content) < 1000:
                continue
        except Exception as e:
            logger.warning("Carousel OAuth: video download failed: %s", e)
            continue

        # Check if video has an audio stream using ffprobe
        tmp_video = os.path.join(tempfile.gettempdir(), f"carousel_{uuid.uuid4().hex}.mp4")
        try:
            Path(tmp_video).write_bytes(video_resp.content)

            probe = await asyncio.create_subprocess_exec(
                "ffprobe", "-v", "quiet", "-select_streams", "a",
                "-show_entries", "stream=codec_type", "-of", "csv=p=0",
                tmp_video,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            probe_out, _ = await asyncio.wait_for(probe.communicate(), timeout=10)

            if b"audio" not in probe_out:
                logger.info("Carousel OAuth: VIDEO child %s has no audio stream", child.get("id"))
                continue

            # Has audio — return the raw video bytes (will be converted to WAV later)
            info = {
                "id": shortcode,
                "title": (caption[:100] if caption else None),
                "uploader": username,
                "source": "instagram_carousel_video",
            }
            return video_resp.content, info

        finally:
            try:
                os.unlink(tmp_video)
            except OSError:
                pass

    logger.info("Carousel OAuth: none of %d VIDEO children have audio for %s", len(video_children), shortcode)
    return None


def _sync_carousel_audio(shortcode: str, settings) -> tuple[bytes, dict] | None:
    """
    Synchronous fallback: authenticate with instagrapi (mobile API emulation),
    query Instagram's private v1 API for the carousel post metadata, and
    download the audio file.

    Uses a persistent session file to avoid repeated logins (which trigger
    Instagram rate-limiting / account locks).

    Returns (audio_bytes, info_dict) or None.
    """
    from instagrapi import Client
    import time

    if not settings.INSTAGRAM_USERNAME or not settings.INSTAGRAM_PASSWORD:
        return None

    # --- Session persistence paths ---
    session_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "..", ".ig_sessions"
    )
    os.makedirs(session_dir, exist_ok=True)
    session_file = os.path.join(session_dir, f"instagrapi_{settings.INSTAGRAM_USERNAME}.json")
    lockfile = session_file + ".lock"

    cl = Client()
    cl.delay_range = [1, 3]

    logged_in = False

    # Try loading saved session first
    if os.path.isfile(session_file):
        try:
            cl.load_settings(session_file)
            cl.login(settings.INSTAGRAM_USERNAME, settings.INSTAGRAM_PASSWORD)
            logged_in = True
            logger.debug("Carousel instagrapi: reused saved session for %s", settings.INSTAGRAM_USERNAME)
        except Exception:
            logger.info("Carousel instagrapi: saved session expired, will re-login")

    if not logged_in:
        # Rate-limit guard: refuse login if we already failed recently
        if os.path.isfile(lockfile):
            try:
                lock_age = time.time() - os.path.getmtime(lockfile)
                if lock_age < 600:  # 10-minute cooldown
                    logger.warning(
                        "Carousel instagrapi: login cooldown active (%.0fs remaining)",
                        600 - lock_age,
                    )
                    return None
            except OSError:
                pass

        try:
            cl.login(settings.INSTAGRAM_USERNAME, settings.INSTAGRAM_PASSWORD)
            cl.dump_settings(session_file)
            logger.info("Carousel instagrapi: logged in and saved session for %s", settings.INSTAGRAM_USERNAME)
            # Remove lockfile on successful login
            try:
                os.unlink(lockfile)
            except OSError:
                pass
        except Exception as e:
            logger.warning("Carousel instagrapi: Instagram login failed: %s", e)
            # Write lockfile to prevent hammering Instagram login
            try:
                Path(lockfile).touch()
            except OSError:
                pass
            return None

    # Convert shortcode to media PK
    try:
        media_pk = cl.media_pk_from_code(shortcode)
    except Exception as e:
        logger.warning("Carousel instagrapi: could not convert shortcode %s: %s", shortcode, e)
        return None

    # Query Instagram mobile API for full media info (includes music_metadata)
    try:
        data = cl.private_request(f"media/{media_pk}/info/")
    except Exception as e:
        logger.warning("Carousel instagrapi: API request failed for %s: %s", shortcode, e)
        return None

    items = data.get("items", [])
    if not items:
        return None

    item = items[0]
    audio_url = _find_audio_url(item)

    if not audio_url:
        logger.info("Carousel instagrapi: no audio URL in metadata for %s", shortcode)
        return None

    # Download the raw audio file
    import requests as req_lib
    try:
        audio_resp = req_lib.get(audio_url, timeout=30)
    except Exception as e:
        logger.warning("Carousel instagrapi: audio download failed: %s", e)
        return None

    if audio_resp.status_code != 200 or len(audio_resp.content) < 500:
        return None

    # Try to extract title/uploader from response
    caption_text = item.get("caption", {})
    if isinstance(caption_text, dict):
        caption_text = caption_text.get("text", "")
    owner_username = item.get("user", {}).get("username", "")

    # Extract music metadata for info
    music_meta = item.get("music_metadata")
    artist = None
    song = None
    if music_meta:
        music_info = music_meta.get("music_info", {})
        music_asset = music_info.get("music_asset_info", {})
        artist = music_asset.get("display_artist")
        song = music_asset.get("title")

    info = {
        "id": shortcode,
        "title": (caption_text[:100] if caption_text else None),
        "uploader": owner_username,
        "source": "instagram_carousel_music",
        "artist": artist,
        "song": song,
    }

    # Save updated session after successful request
    try:
        cl.dump_settings(session_file)
    except Exception:
        pass

    return audio_resp.content, info


async def _instagram_carousel_fallback(
    url: str, tmp_dir: str, max_duration_sec: int, *, oauth_token: str | None = None,
) -> tuple[bytes, str]:
    """
    Fallback for Instagram carousel/image posts that have music added but no
    video stream.

    Strategy:
    1. If an OAuth token is available → use Instagram Graph + private API (async)
    2. Else if INSTAGRAM_USERNAME/PASSWORD configured → use instaloader (sync thread)
    3. Otherwise raise with a clear error message

    Raises ValueError with a descriptive code if extraction is not possible.
    """
    shortcode_match = re.search(r"/(?:p|reel)/([A-Za-z0-9_-]+)", url)
    if not shortcode_match:
        raise ValueError(
            "CAROUSEL_NO_AUDIO: No se pudo extraer el shortcode de la URL"
        )
    shortcode = shortcode_match.group(1)

    result = None

    # Strategy 1: Web GraphQL (no auth needed for public posts)
    logger.info("Carousel fallback: trying GraphQL for %s", shortcode)
    result = await _fetch_carousel_audio_graphql(shortcode)

    # Strategy 2: OAuth token (Graph API children — needs connected account)
    if result is None and oauth_token:
        logger.info("Carousel fallback: trying OAuth token for %s", shortcode)
        result = await _fetch_carousel_audio_oauth(shortcode, oauth_token)

    # Strategy 3: instagrapi credentials (mobile API — the only way to get carousel music)
    if result is None:
        settings = get_settings()
        if settings.INSTAGRAM_USERNAME and settings.INSTAGRAM_PASSWORD:
            logger.info("Carousel fallback: trying instagrapi for %s", shortcode)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, _sync_carousel_audio, shortcode, settings,
            )

    if result is None:
        if not oauth_token:
            raise ValueError(
                "CAROUSEL_NO_AUDIO: Este post es un carrusel de imágenes con música. "
                "Para detectar la música, la cuenta de Instagram debe estar conectada "
                "vía OAuth desde la sección de cuentas sociales."
            )
        raise ValueError(
            "CAROUSEL_NO_AUDIO: No se encontró audio/música en este carrusel. "
            "Solo se puede identificar música en posts con música añadida."
        )

    raw_audio, info_dict = result

    # Save raw media and convert to WAV with ffmpeg
    # Extension depends on source: video children come as .mp4, music as .m4a
    ext = ".mp4" if info_dict.get("source") == "instagram_carousel_video" else ".m4a"
    raw_path = os.path.join(tmp_dir, f"carousel_audio{ext}")
    wav_path = os.path.join(tmp_dir, "carousel_audio.wav")
    Path(raw_path).write_bytes(raw_audio)

    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-i", raw_path,
        "-ac", "1", "-ar", "8000", "-t", str(max_duration_sec),
        "-y", wav_path,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    await asyncio.wait_for(proc.communicate(), timeout=30)

    wav_file = Path(wav_path)
    if proc.returncode != 0 or not wav_file.exists():
        raise ValueError(
            "AUDIO_EXTRACTION_FAILED: No se pudo convertir el audio del carrusel"
        )

    audio_bytes = wav_file.read_bytes()
    if len(audio_bytes) < 1000:
        raise ValueError("AUDIO_TOO_SHORT: El audio del carrusel es demasiado corto")

    return audio_bytes, json.dumps(info_dict)
