"""Tests for app.services.profile_scraper_service."""
import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.profile_scraper_service import (
    ScrapedPost,
    scrape_recent_posts,
    _scrape_with_ytdlp,
    _scrape_instagram,
    PROFILE_URL_TEMPLATES,
)


# ── yt-dlp scraping tests ──────────────────────────────────


def _make_ytdlp_output(entries: list[dict]) -> bytes:
    """Build JSON bytes mimicking yt-dlp --flat-playlist -J output."""
    return json.dumps({"entries": entries}).encode()


def _fake_process(stdout: bytes, returncode: int = 0, stderr: bytes = b""):
    proc = MagicMock()
    proc.communicate = AsyncMock(return_value=(stdout, stderr))
    proc.returncode = returncode
    return proc


async def _run_ytdlp(platform, username, limit, proc):
    """Helper: patch create_subprocess_exec + wait_for, then call _scrape_with_ytdlp."""
    async def fake_wait_for(coro, timeout=None):
        return await coro

    with patch("app.services.profile_scraper_service.asyncio.create_subprocess_exec", new_callable=AsyncMock, return_value=proc):
        with patch("app.services.profile_scraper_service.asyncio.wait_for", side_effect=fake_wait_for):
            return await _scrape_with_ytdlp(platform, username, limit)


class TestScrapeWithYtdlp:
    async def test_tiktok_success(self):
        entries = [
            {"id": "123", "url": "https://www.tiktok.com/@user/video/123", "title": "Video 1", "uploader": "user", "timestamp": 1700000000, "duration": 30},
            {"id": "456", "url": "https://www.tiktok.com/@user/video/456", "title": "Video 2", "uploader": "user", "timestamp": 1700000100, "duration": 45},
        ]
        results = await _run_ytdlp("tiktok", "user", 5, _fake_process(_make_ytdlp_output(entries)))

        assert len(results) == 2
        assert results[0].video_id == "123"
        assert results[0].url == "https://www.tiktok.com/@user/video/123"
        assert results[0].title == "Video 1"
        assert results[0].timestamp == 1700000000
        assert results[1].video_id == "456"

    async def test_url_fallback_tiktok(self):
        """When entry has no url field, build from template."""
        entries = [{"id": "789", "title": "NoURL"}]
        results = await _run_ytdlp("tiktok", "testuser", 5, _fake_process(_make_ytdlp_output(entries)))

        assert len(results) == 1
        assert results[0].url == "https://www.tiktok.com/@testuser/video/789"

    async def test_unsupported_platform(self):
        with pytest.raises(ValueError, match="PLATFORM_NOT_SUPPORTED"):
            await _scrape_with_ytdlp("twitter", "some_user", limit=5)

    async def test_ytdlp_broken_error(self):
        with pytest.raises(ValueError, match="SCRAPE_FAILED"):
            await _run_ytdlp("tiktok", "user", 5, _fake_process(b"", returncode=1, stderr=b"ERROR: broken extractor"))

    async def test_ytdlp_unsupported_url_error(self):
        with pytest.raises(ValueError, match="SCRAPE_FAILED"):
            await _run_ytdlp("facebook", "user", 5, _fake_process(b"", returncode=1, stderr=b"ERROR: Unsupported URL"))

    async def test_empty_response(self):
        with pytest.raises(ValueError, match="SCRAPE_EMPTY"):
            await _run_ytdlp("tiktok", "empty_user", 5, _fake_process(b"null", returncode=0))

    async def test_entries_without_url_or_id_skipped(self):
        entries = [
            {"id": "good1", "url": "https://x.com/1"},
            {"other_field": "no id or url"},
            {"id": "good2", "url": "https://x.com/2"},
        ]
        results = await _run_ytdlp("tiktok", "user", 5, _fake_process(_make_ytdlp_output(entries)))

        assert len(results) == 2
        assert results[0].video_id == "good1"
        assert results[1].video_id == "good2"

    async def test_generic_error(self):
        with pytest.raises(ValueError, match="SCRAPE_FAILED"):
            await _run_ytdlp("tiktok", "user", 5, _fake_process(b"", returncode=1, stderr=b"ERROR: Something went wrong badly"))


# ── Instagram scraping tests ────────────────────────────


class TestScrapeInstagram:
    async def test_no_credentials_raises(self):
        mock_settings = MagicMock()
        mock_settings.INSTAGRAM_USERNAME = ""
        mock_settings.INSTAGRAM_PASSWORD = ""
        with patch("app.services.profile_scraper_service.get_settings", return_value=mock_settings):
            with pytest.raises(ValueError, match="INSTAGRAM_AUTH_REQUIRED"):
                await _scrape_instagram("someuser", limit=5)

    async def test_success_with_credentials(self):
        mock_settings = MagicMock()
        mock_settings.INSTAGRAM_USERNAME = "testlogin"
        mock_settings.INSTAGRAM_PASSWORD = "testpass"

        # Build mock instaloader objects
        mock_post1 = MagicMock()
        mock_post1.shortcode = "ABC123"
        mock_post1.is_video = True
        mock_post1.caption = "My video caption"
        mock_post1.date_utc = MagicMock()
        mock_post1.date_utc.timestamp.return_value = 1700000000
        mock_post1.video_duration = 30.5

        mock_post2 = MagicMock()
        mock_post2.shortcode = "DEF456"
        mock_post2.is_video = False
        mock_post2.caption = "A picture"
        mock_post2.date_utc = MagicMock()
        mock_post2.date_utc.timestamp.return_value = 1700001000
        mock_post2.video_duration = None

        mock_profile = MagicMock()
        mock_profile.get_posts.return_value = iter([mock_post1, mock_post2])

        mock_loader = MagicMock()
        mock_loader.login = MagicMock()

        mock_instaloader_mod = MagicMock()
        mock_instaloader_mod.Instaloader.return_value = mock_loader
        mock_instaloader_mod.Profile.from_username.return_value = mock_profile

        with patch("app.services.profile_scraper_service.get_settings", return_value=mock_settings):
            with patch.dict("sys.modules", {"instaloader": mock_instaloader_mod, "instaloader.exceptions": MagicMock()}):
                # Since _scrape_instagram uses run_in_executor, mock it to run sync
                loop = asyncio.get_event_loop()
                original_run_in_executor = loop.run_in_executor

                async def fake_executor(executor, fn):
                    return fn()

                with patch.object(loop, "run_in_executor", side_effect=fake_executor):
                    results = await _scrape_instagram("iguser", limit=5)

        assert len(results) == 2
        assert results[0].video_id == "ABC123"
        assert results[0].url == "https://www.instagram.com/reel/ABC123/"
        assert results[0].title == "My video caption"
        assert results[0].timestamp == 1700000000
        assert results[0].duration == 30.5

        assert results[1].video_id == "DEF456"
        assert results[1].url == "https://www.instagram.com/p/DEF456/"
        assert results[1].duration is None


# ── Main dispatcher tests ───────────────────────────────


class TestScrapeRecentPosts:
    async def test_routes_to_instagram(self):
        with patch("app.services.profile_scraper_service._scrape_instagram", new_callable=AsyncMock) as mock_ig:
            mock_ig.return_value = [ScrapedPost("id1", "url1", "t", "u", 1, 10)]
            results = await scrape_recent_posts("instagram", "iguser", limit=3)
            mock_ig.assert_called_once_with("iguser", 3)
            assert len(results) == 1

    async def test_routes_to_ytdlp_tiktok(self):
        with patch("app.services.profile_scraper_service._scrape_with_ytdlp", new_callable=AsyncMock) as mock_yt:
            mock_yt.return_value = [ScrapedPost("id1", "url1", "t", "u", 1, 10)]
            results = await scrape_recent_posts("tiktok", "ttuser", limit=5)
            mock_yt.assert_called_once_with("tiktok", "ttuser", 5)
            assert len(results) == 1

    async def test_unsupported_platform_raises(self):
        with pytest.raises(ValueError, match="PLATFORM_NOT_SUPPORTED"):
            await scrape_recent_posts("twitter", "user", limit=5)

    async def test_unsupported_platform_snapchat(self):
        with pytest.raises(ValueError, match="PLATFORM_NOT_SUPPORTED"):
            await scrape_recent_posts("snapchat", "user", limit=5)


# ── Constants tests ─────────────────────────────────────


class TestConstants:
    def test_profile_url_templates(self):
        assert "tiktok" in PROFILE_URL_TEMPLATES
        assert "facebook" in PROFILE_URL_TEMPLATES
        assert "instagram" not in PROFILE_URL_TEMPLATES  # Instagram uses instaloader

    def test_tiktok_template_format(self):
        url = PROFILE_URL_TEMPLATES["tiktok"].format(username="badbunny")
        assert url == "https://www.tiktok.com/@badbunny"

    def test_facebook_template_format(self):
        url = PROFILE_URL_TEMPLATES["facebook"].format(username="Shakira")
        assert url == "https://www.facebook.com/Shakira/videos"


# ── ScrapedPost dataclass tests ─────────────────────────


class TestScrapedPost:
    def test_creation(self):
        post = ScrapedPost(
            video_id="v1",
            url="https://example.com/v1",
            title="Test",
            uploader="user",
            timestamp=1700000000,
            duration=30.0,
        )
        assert post.video_id == "v1"
        assert post.duration == 30.0

    def test_nullable_fields(self):
        post = ScrapedPost(video_id="v2", url="https://example.com/v2", title=None, uploader=None, timestamp=None, duration=None)
        assert post.title is None
        assert post.timestamp is None
