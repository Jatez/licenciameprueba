"""Tests for app.services.acrcloud_service — signature, parsing, identify_and_match."""
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import acrcloud_service
from app.models.catalog import Track
from app.models.monitoring import ExternalContent, AudioDetection


# ── _build_signature ─────────────────────────────────────

class TestBuildSignature:
    def test_returns_base64_string(self):
        sig = acrcloud_service._build_signature("POST", "/v1/identify", "key", "secret", "audio", "1", "123456")
        assert isinstance(sig, str)
        assert len(sig) > 0

    def test_different_timestamps_produce_different_sigs(self):
        s1 = acrcloud_service._build_signature("POST", "/v1/identify", "key", "secret", "audio", "1", "111111")
        s2 = acrcloud_service._build_signature("POST", "/v1/identify", "key", "secret", "audio", "1", "222222")
        assert s1 != s2

    def test_different_keys_produce_different_sigs(self):
        s1 = acrcloud_service._build_signature("POST", "/v1/identify", "key_a", "secret", "audio", "1", "123456")
        s2 = acrcloud_service._build_signature("POST", "/v1/identify", "key_b", "secret", "audio", "1", "123456")
        assert s1 != s2


# ── parse_acrcloud_result ────────────────────────────────

class TestParseACRCloudResult:
    def test_empty_result_no_match(self):
        result = {"status": {"code": 1001, "msg": "No result"}}
        matches = acrcloud_service.parse_acrcloud_result(result)
        assert matches == []

    def test_invalid_status_code(self):
        result = {"status": {"code": 3003, "msg": "Limit exceeded"}}
        assert acrcloud_service.parse_acrcloud_result(result) == []

    def test_missing_status(self):
        assert acrcloud_service.parse_acrcloud_result({}) == []

    def test_single_match(self):
        result = {
            "status": {"code": 0, "msg": "Success"},
            "metadata": {
                "music": [
                    {
                        "title": "Blinding Lights",
                        "artists": [{"name": "The Weeknd"}],
                        "album": {"name": "After Hours"},
                        "label": "Republic",
                        "release_date": "2020-03-20",
                        "score": 95,
                        "duration_ms": 200000,
                        "acrid": "abc123",
                        "external_ids": {"isrc": "USUG12000497"},
                        "external_metadata": {"spotify": {"track": {"id": "sp123"}}},
                    }
                ]
            },
        }
        matches = acrcloud_service.parse_acrcloud_result(result)
        assert len(matches) == 1
        m = matches[0]
        assert m["title"] == "Blinding Lights"
        assert m["artist"] == "The Weeknd"
        assert m["isrc"] == "USUG12000497"
        assert m["spotify_id"] == "sp123"
        assert m["score"] == 95
        assert m["album"] == "After Hours"
        assert m["label"] == "Republic"

    def test_multiple_matches(self):
        result = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {"title": "Song A", "artists": [{"name": "Art1"}], "score": 90, "external_ids": {}, "external_metadata": {}},
                    {"title": "Song B", "artists": [{"name": "Art2"}], "score": 80, "external_ids": {}, "external_metadata": {}},
                ]
            },
        }
        matches = acrcloud_service.parse_acrcloud_result(result)
        assert len(matches) == 2
        assert matches[0]["title"] == "Song A"
        assert matches[1]["title"] == "Song B"

    def test_multiple_artists(self):
        result = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {"title": "Collab", "artists": [{"name": "A"}, {"name": "B"}], "score": 85, "external_ids": {}, "external_metadata": {}},
                ]
            },
        }
        matches = acrcloud_service.parse_acrcloud_result(result)
        assert matches[0]["artist"] == "A, B"

    def test_missing_optional_fields(self):
        result = {
            "status": {"code": 0},
            "metadata": {"music": [{"title": "Minimal", "score": 50}]},
        }
        matches = acrcloud_service.parse_acrcloud_result(result)
        assert len(matches) == 1
        assert matches[0]["artist"] == ""
        assert matches[0]["isrc"] == ""
        assert matches[0]["spotify_id"] == ""


# ── identify_audio ───────────────────────────────────────

class TestIdentifyAudio:
    @pytest.mark.asyncio
    async def test_raises_without_credentials(self):
        with patch("app.services.acrcloud_service.get_settings") as mock_settings:
            mock_settings.return_value.ACRCLOUD_HOST = ""
            mock_settings.return_value.ACRCLOUD_ACCESS_KEY = ""
            with pytest.raises(ValueError, match="credentials not configured"):
                await acrcloud_service.identify_audio(b"fake_audio")

    @pytest.mark.asyncio
    async def test_calls_acrcloud_api(self):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"status": {"code": 0}, "metadata": {"music": []}}
        mock_resp.raise_for_status = MagicMock()

        with patch("app.services.acrcloud_service.get_settings") as mock_settings:
            mock_settings.return_value.ACRCLOUD_HOST = "test.acrcloud.com"
            mock_settings.return_value.ACRCLOUD_ACCESS_KEY = "test_key"
            mock_settings.return_value.ACRCLOUD_ACCESS_SECRET = "test_secret"

            with patch("httpx.AsyncClient.post", new_callable=AsyncMock, return_value=mock_resp):
                result = await acrcloud_service.identify_audio(b"audio_data", "wav")
                assert result["status"]["code"] == 0


# ── identify_from_file ───────────────────────────────────

class TestIdentifyFromFile:
    @pytest.mark.asyncio
    async def test_raises_file_not_found(self):
        with pytest.raises(FileNotFoundError):
            await acrcloud_service.identify_from_file("/nonexistent/file.wav")


# ── identify_and_match ───────────────────────────────────

class TestIdentifyAndMatch:
    @pytest.mark.asyncio
    async def test_no_match_creates_no_match_detection(self, db: AsyncSession, company, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_001",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        raw = {"status": {"code": 1001, "msg": "No result"}}
        detections = await acrcloud_service.identify_and_match(
            db, company.id, ext, preloaded_result=raw
        )
        assert len(detections) == 1
        assert detections[0].detection_status == "no_match"
        assert ext.reconciliation_status == "unmatched"

    @pytest.mark.asyncio
    async def test_match_by_isrc_creates_matched(self, db: AsyncSession, company, track, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_002",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        raw = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {
                        "title": track.title,
                        "artists": [{"name": track.artist}],
                        "score": 95,
                        "external_ids": {"isrc": track.isrc},
                        "external_metadata": {},
                    }
                ]
            },
        }
        detections = await acrcloud_service.identify_and_match(
            db, company.id, ext, preloaded_result=raw
        )
        assert len(detections) == 1
        assert detections[0].detection_status == "matched"
        assert detections[0].matched_track_id == track.id
        assert ext.reconciliation_status == "matched_usage"

    @pytest.mark.asyncio
    async def test_match_by_title_when_no_isrc(self, db: AsyncSession, company, track, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_003",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        raw = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {
                        "title": track.title,
                        "artists": [{"name": "Unknown"}],
                        "score": 85,
                        "external_ids": {},
                        "external_metadata": {},
                    }
                ]
            },
        }
        detections = await acrcloud_service.identify_and_match(
            db, company.id, ext, preloaded_result=raw
        )
        assert len(detections) == 1
        assert detections[0].matched_track_id == track.id

    @pytest.mark.asyncio
    async def test_uncertain_when_low_confidence(self, db: AsyncSession, company, track, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_004",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        raw = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {
                        "title": track.title,
                        "artists": [{"name": track.artist}],
                        "score": 60,
                        "external_ids": {"isrc": track.isrc},
                        "external_metadata": {},
                    }
                ]
            },
        }
        detections = await acrcloud_service.identify_and_match(
            db, company.id, ext, preloaded_result=raw
        )
        assert detections[0].detection_status == "uncertain"
        assert ext.reconciliation_status == "manual_review"

    @pytest.mark.asyncio
    async def test_raises_without_audio_or_preloaded(self, db, company, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_005",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        with pytest.raises(ValueError, match="audio_bytes or preloaded_result"):
            await acrcloud_service.identify_and_match(db, company.id, ext)

    @pytest.mark.asyncio
    async def test_multiple_matches_multiple_detections(self, db, company, track, social_account_ig):
        ext = ExternalContent(
            company_id=company.id,
            social_account_id=social_account_ig.id,
            platform="instagram",
            content_type="ig_reel",
            external_media_id="ext_006",
            reconciliation_status="unmatched",
        )
        db.add(ext)
        await db.flush()

        raw = {
            "status": {"code": 0},
            "metadata": {
                "music": [
                    {"title": track.title, "artists": [{"name": track.artist}], "score": 92, "external_ids": {"isrc": track.isrc}, "external_metadata": {}},
                    {"title": "Unknown Song", "artists": [{"name": "Nobody"}], "score": 55, "external_ids": {}, "external_metadata": {}},
                ]
            },
        }
        detections = await acrcloud_service.identify_and_match(
            db, company.id, ext, preloaded_result=raw
        )
        assert len(detections) == 2
        assert detections[0].detection_status == "matched"
        assert detections[1].detection_status == "uncertain"
