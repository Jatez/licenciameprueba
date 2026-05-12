"""Tests for POST /social-accounts/{id}/auto-scan endpoint."""
import uuid
from datetime import date, timedelta
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.main import app
from app.core.database import get_db
from app.core.security import hash_password, create_access_token
from app.models.auth import Company, User
from app.models.catalog import Track
from app.models.monitoring import ExternalContent
from app.models.social import SocialAccount
from app.services.profile_scraper_service import ScrapedPost
from tests.conftest import TEST_DB_URL


@pytest_asyncio.fixture
async def api_session(setup_db):
    _session = async_sessionmaker(setup_db, class_=AsyncSession, expire_on_commit=False)
    return _session


@pytest_asyncio.fixture
async def client(api_session):
    async def override_get_db():
        async with api_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


def auth_header(user_id: str, role: str = "admin", company_id: str | None = None) -> dict:
    token = create_access_token(user_id, role, company_id)
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def seeded(api_session):
    async with api_session() as db:
        company = Company(name="TestCo", country_code="CO", status="active")
        db.add(company)
        await db.flush()

        user = User(
            company_id=company.id, email="test@co.com", role="admin",
            password_hash=hash_password("Test123!"), status="active",
        )
        db.add(user)
        await db.flush()

        track = Track(
            title="Song", artist="Artist", s3_key_master="k.wav",
            duration_seconds=180, rights_reference="R1", active=True,
        )
        db.add(track)
        await db.flush()

        sa_tiktok = SocialAccount(
            company_id=company.id, platform="tiktok", external_account_id="tt1",
            username="testuser", access_token_encrypted="enc", status="connected",
        )
        db.add(sa_tiktok)
        await db.flush()

        sa_no_username = SocialAccount(
            company_id=company.id, platform="tiktok", external_account_id="tt2",
            username="", access_token_encrypted="enc", status="connected",
        )
        db.add(sa_no_username)
        await db.flush()

        await db.commit()

        return {
            "company": company,
            "user": user,
            "track": track,
            "sa_tiktok": sa_tiktok,
            "sa_no_username": sa_no_username,
        }


FAKE_SCRAPED = [
    ScrapedPost("v1", "https://www.tiktok.com/@testuser/video/v1", "Video 1", "testuser", 1700000000, 30),
    ScrapedPost("v2", "https://www.tiktok.com/@testuser/video/v2", "Video 2", "testuser", 1700001000, 45),
]


class TestAutoScan:
    async def test_success(self, client: AsyncClient, seeded: dict):
        user = seeded["user"]
        sa = seeded["sa_tiktok"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))

        mock_scrape = AsyncMock(return_value=FAKE_SCRAPED)
        mock_download = AsyncMock(return_value=(b"fake_audio_bytes", '{"id":"v1","title":"T"}'))
        mock_identify = AsyncMock(return_value={"status": {"code": 0}})
        mock_match = AsyncMock(return_value=[])

        with patch("app.api.social.profile_scraper_service.scrape_recent_posts", mock_scrape):
            with patch("app.api.social.social_download_service.download_audio", mock_download):
                with patch("app.api.social.acrcloud_service.identify_audio", mock_identify):
                    with patch("app.api.social.acrcloud_service.identify_and_match", mock_match):
                        r = await client.post(
                            f"/api/v2/social-accounts/{sa.id}/auto-scan?limit=2",
                            headers=headers,
                        )

        assert r.status_code == 200
        data = r.json()
        assert len(data) == 2
        assert data[0]["external_url"] == "https://www.tiktok.com/@testuser/video/v1"
        assert data[1]["external_url"] == "https://www.tiktok.com/@testuser/video/v2"

    async def test_not_found_account(self, client: AsyncClient, seeded: dict):
        user = seeded["user"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))
        r = await client.post(
            f"/api/v2/social-accounts/{uuid.uuid4()}/auto-scan",
            headers=headers,
        )
        assert r.status_code == 404
        assert r.json()["detail"] == "ACCOUNT_NOT_FOUND"

    async def test_missing_username(self, client: AsyncClient, seeded: dict):
        user = seeded["user"]
        sa = seeded["sa_no_username"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))
        r = await client.post(
            f"/api/v2/social-accounts/{sa.id}/auto-scan",
            headers=headers,
        )
        assert r.status_code == 400
        assert "MISSING_USERNAME" in r.json()["detail"]

    async def test_scrape_error(self, client: AsyncClient, seeded: dict):
        user = seeded["user"]
        sa = seeded["sa_tiktok"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))

        mock_scrape = AsyncMock(side_effect=ValueError("SCRAPE_FAILED: test error"))

        with patch("app.api.social.profile_scraper_service.scrape_recent_posts", mock_scrape):
            r = await client.post(
                f"/api/v2/social-accounts/{sa.id}/auto-scan?limit=3",
                headers=headers,
            )

        assert r.status_code == 400
        assert "SCRAPE_FAILED" in r.json()["detail"]

    async def test_empty_scrape(self, client: AsyncClient, seeded: dict):
        user = seeded["user"]
        sa = seeded["sa_tiktok"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))

        mock_scrape = AsyncMock(return_value=[])

        with patch("app.api.social.profile_scraper_service.scrape_recent_posts", mock_scrape):
            r = await client.post(
                f"/api/v2/social-accounts/{sa.id}/auto-scan?limit=5",
                headers=headers,
            )

        assert r.status_code == 200
        assert r.json() == []

    async def test_skips_already_scanned_urls(self, client: AsyncClient, seeded: dict, api_session):
        user = seeded["user"]
        sa = seeded["sa_tiktok"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))

        # Pre-create an ExternalContent with v1's URL
        async with api_session() as db:
            existing = ExternalContent(
                company_id=user.company_id,
                social_account_id=sa.id,
                platform="tiktok",
                content_type="tiktok_video",
                external_media_id="v1",
                external_url="https://www.tiktok.com/@testuser/video/v1",
                reconciliation_status="unmatched",
            )
            db.add(existing)
            await db.commit()

        mock_scrape = AsyncMock(return_value=FAKE_SCRAPED)
        mock_download = AsyncMock(return_value=(b"audio", '{"id":"v2"}'))
        mock_identify = AsyncMock(return_value={"status": {"code": 0}})
        mock_match = AsyncMock(return_value=[])

        with patch("app.api.social.profile_scraper_service.scrape_recent_posts", mock_scrape):
            with patch("app.api.social.social_download_service.download_audio", mock_download):
                with patch("app.api.social.acrcloud_service.identify_audio", mock_identify):
                    with patch("app.api.social.acrcloud_service.identify_and_match", mock_match):
                        r = await client.post(
                            f"/api/v2/social-accounts/{sa.id}/auto-scan?limit=5",
                            headers=headers,
                        )

        assert r.status_code == 200
        data = r.json()
        # Only v2 should be scanned (v1 already exists)
        assert len(data) == 1
        assert data[0]["external_url"] == "https://www.tiktok.com/@testuser/video/v2"

    async def test_download_error_skips(self, client: AsyncClient, seeded: dict):
        """When download_audio fails, that post is skipped but others continue."""
        user = seeded["user"]
        sa = seeded["sa_tiktok"]
        headers = auth_header(str(user.id), "admin", str(user.company_id))

        call_count = 0

        async def download_side_effect(url):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise ValueError("Download failed")
            return (b"audio", '{"id":"v2"}')

        mock_scrape = AsyncMock(return_value=FAKE_SCRAPED)
        mock_identify = AsyncMock(return_value={"status": {"code": 0}})
        mock_match = AsyncMock(return_value=[])

        with patch("app.api.social.profile_scraper_service.scrape_recent_posts", mock_scrape):
            with patch("app.api.social.social_download_service.download_audio", side_effect=download_side_effect):
                with patch("app.api.social.acrcloud_service.identify_audio", mock_identify):
                    with patch("app.api.social.acrcloud_service.identify_and_match", mock_match):
                        r = await client.post(
                            f"/api/v2/social-accounts/{sa.id}/auto-scan?limit=5",
                            headers=headers,
                        )

        assert r.status_code == 200
        data = r.json()
        # Both posts saved: first without detection, second with detection attempt
        assert len(data) == 2
        # First post (download failed) still appears but without detection
        assert data[0]["external_url"] == "https://www.tiktok.com/@testuser/video/v1"
        assert data[0]["detection"] is None
        # Second post succeeds
        assert data[1]["external_url"] == "https://www.tiktok.com/@testuser/video/v2"

    async def test_unauthenticated(self, client: AsyncClient, seeded: dict):
        sa = seeded["sa_tiktok"]
        r = await client.post(f"/api/v2/social-accounts/{sa.id}/auto-scan")
        assert r.status_code in (401, 403)
