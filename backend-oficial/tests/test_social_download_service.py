"""Tests for app.services.social_download_service — URL validation and download."""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from app.services.social_download_service import _validate_url, download_audio


# ── _validate_url ────────────────────────────────────────

class TestValidateUrl:
    def test_valid_instagram(self):
        assert _validate_url("https://www.instagram.com/reel/ABC123/") is True

    def test_valid_tiktok(self):
        assert _validate_url("https://www.tiktok.com/@user/video/123") is True

    def test_valid_tiktok_vm(self):
        assert _validate_url("https://vm.tiktok.com/ZM6abc/") is True

    def test_valid_facebook(self):
        assert _validate_url("https://www.facebook.com/user/videos/123/") is True

    def test_valid_fb_watch(self):
        assert _validate_url("https://fb.watch/xyz/") is True

    def test_valid_mobile_tiktok(self):
        assert _validate_url("https://m.tiktok.com/@user/video/123") is True

    def test_valid_mobile_facebook(self):
        assert _validate_url("https://m.facebook.com/story/123") is True

    def test_rejects_non_social(self):
        assert _validate_url("https://www.google.com/search?q=test") is False

    def test_rejects_ftp(self):
        assert _validate_url("ftp://instagram.com/reel/123") is False

    def test_rejects_empty(self):
        assert _validate_url("") is False

    def test_rejects_plain_text(self):
        assert _validate_url("not a url") is False

    def test_rejects_javascript_scheme(self):
        assert _validate_url("javascript:alert(1)") is False

    def test_rejects_file_scheme(self):
        assert _validate_url("file:///etc/passwd") is False

    def test_rejects_data_scheme(self):
        assert _validate_url("data:text/html,<h1>test</h1>") is False


# ── download_audio ───────────────────────────────────────

class TestDownloadAudio:
    @pytest.mark.asyncio
    async def test_rejects_invalid_url(self):
        with pytest.raises(ValueError, match="URL_NOT_SUPPORTED"):
            await download_audio("https://www.google.com/search")

    @pytest.mark.asyncio
    async def test_rejects_non_social_domain(self):
        with pytest.raises(ValueError, match="URL_NOT_SUPPORTED"):
            await download_audio("https://evil.com/video")

    @pytest.mark.asyncio
    async def test_successful_download(self, tmp_path):
        fake_wav = b"\x00" * 5000  # Fake audio bytes > 1000
        wav_file = tmp_path / "abcdef.wav"
        wav_file.write_bytes(fake_wav)

        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b'{"id": "test_123", "title": "Test"}', b""))
        mock_process.returncode = 0

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with patch("pathlib.Path.glob", return_value=[wav_file]):
                    audio_bytes, info_json = await download_audio("https://www.instagram.com/reel/ABC/")
                    assert len(audio_bytes) == 5000
                    assert "test_123" in info_json

    @pytest.mark.asyncio
    async def test_download_failure_raises(self, tmp_path):
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"", b"ERROR: Some error"))
        mock_process.returncode = 1

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with pytest.raises(ValueError, match="DOWNLOAD_FAILED"):
                    await download_audio("https://www.instagram.com/reel/ABC/")

    @pytest.mark.asyncio
    async def test_private_content_raises(self, tmp_path):
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"", b"Private video, login required"))
        mock_process.returncode = 1

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with pytest.raises(ValueError, match="CONTENT_PRIVATE"):
                    await download_audio("https://www.instagram.com/reel/ABC/")

    @pytest.mark.asyncio
    async def test_not_found_raises(self, tmp_path):
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"", b"404 not found"))
        mock_process.returncode = 1

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with pytest.raises(ValueError, match="CONTENT_NOT_FOUND"):
                    await download_audio("https://www.instagram.com/reel/ABC/")

    @pytest.mark.asyncio
    async def test_audio_too_short_raises(self, tmp_path):
        wav_file = tmp_path / "short.wav"
        wav_file.write_bytes(b"\x00" * 100)  # < 1000 bytes

        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"{}", b""))
        mock_process.returncode = 0

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with patch("pathlib.Path.glob", return_value=[wav_file]):
                    with pytest.raises(ValueError, match="AUDIO_TOO_SHORT"):
                        await download_audio("https://www.instagram.com/reel/ABC/")

    @pytest.mark.asyncio
    async def test_no_wav_output_raises(self, tmp_path):
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"{}", b""))
        mock_process.returncode = 0

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with patch("pathlib.Path.glob", return_value=[]):
                    with pytest.raises(ValueError, match="AUDIO_EXTRACTION_FAILED"):
                        await download_audio("https://www.tiktok.com/@user/video/123")

    @pytest.mark.asyncio
    async def test_instagram_no_wav_triggers_carousel_fallback(self, tmp_path):
        """When yt-dlp succeeds but produces no WAV for Instagram, carousel fallback is called."""
        mock_process = AsyncMock()
        mock_process.communicate = AsyncMock(return_value=(b"{}", b""))
        mock_process.returncode = 0

        with patch("asyncio.create_subprocess_exec", return_value=mock_process):
            with patch("tempfile.mkdtemp", return_value=str(tmp_path)):
                with patch("pathlib.Path.glob", return_value=[]):
                    with patch(
                        "app.services.social_download_service._instagram_carousel_fallback",
                        new_callable=AsyncMock,
                        side_effect=ValueError("CAROUSEL_NO_AUDIO: test"),
                    ) as mock_fallback:
                        with pytest.raises(ValueError, match="CAROUSEL_NO_AUDIO"):
                            await download_audio("https://www.instagram.com/p/ABC/")
                        mock_fallback.assert_called_once()
