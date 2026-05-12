"""Integration tests for API endpoints using httpx AsyncClient."""
import uuid
from datetime import date, timedelta

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.main import app
from app.core.database import get_db
from app.core.security import hash_password, create_access_token
from app.models.auth import Company, User
from app.models.packages import PackageTemplate, LicensePackage
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount
from tests.conftest import TEST_DB_URL


@pytest_asyncio.fixture
async def api_session(setup_db):
    """Create a separate sessionmaker bound to the test engine for API dependency override."""
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


# ── seed helper ──────────────────────────────────────────

@pytest_asyncio.fixture
async def seeded(api_session):
    """Creates a minimal data set and returns IDs."""
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

        tmpl = PackageTemplate(code="t1", name="T1", credits_total=20, duration_days=30, is_active=True)
        db.add(tmpl)
        await db.flush()

        pkg = LicensePackage(
            company_id=company.id, template_id=tmpl.id, package_name="T1",
            credits_total=20, credits_used=0, credits_blocked=0,
            start_date=date.today() - timedelta(days=1), end_date=date.today() + timedelta(days=29),
            status="active",
        )
        db.add(pkg)
        await db.flush()

        track = Track(
            title="Song", artist="Artist", s3_key_master="k.wav",
            duration_seconds=180, rights_reference="R1", active=True,
        )
        db.add(track)
        await db.flush()

        rule = TrackLicenseRule(
            track_id=track.id, allowed_platforms=["instagram"],
            allowed_content_types=["ig_reel"], valid_from=date.today() - timedelta(days=10),
        )
        db.add(rule)
        await db.flush()

        sa = SocialAccount(
            company_id=company.id, platform="instagram", external_account_id="ext1",
            username="test_ig", access_token_encrypted="enc", status="connected",
        )
        db.add(sa)
        await db.flush()
        await db.commit()

        return {
            "company": company,
            "user": user,
            "template": tmpl,
            "package": pkg,
            "track": track,
            "social_account": sa,
        }


# ── Health ───────────────────────────────────────────────

class TestHealth:
    async def test_health(self, client: AsyncClient):
        r = await client.get("/api/v2/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


# ── Auth ─────────────────────────────────────────────────

class TestAuthEndpoints:
    async def test_login_success(self, client: AsyncClient, seeded):
        r = await client.post("/api/v2/auth/login", json={"email": "test@co.com", "password": "Test123!"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert "refresh_token" in data

    async def test_login_wrong_password(self, client: AsyncClient, seeded):
        r = await client.post("/api/v2/auth/login", json={"email": "test@co.com", "password": "wrong"})
        assert r.status_code == 401

    async def test_me_unauthenticated(self, client: AsyncClient):
        r = await client.get("/api/v2/auth/me")
        assert r.status_code == 403

    async def test_me_authenticated(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/auth/me", headers=headers)
        assert r.status_code == 200
        assert r.json()["email"] == "test@co.com"


# ── Tracks ───────────────────────────────────────────────

class TestTracksEndpoints:
    async def test_list_tracks(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/tracks/", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1


# ── Packages ─────────────────────────────────────────────

class TestPackagesEndpoints:
    async def test_list_templates(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/packages/templates", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_list_packages(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/packages/", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1


# ── Social Accounts ──────────────────────────────────────

class TestSocialEndpoints:
    async def test_list_social_accounts(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/social-accounts/", headers=headers)
        assert r.status_code == 200
        assert len(r.json()) >= 1


# ── Metrics ──────────────────────────────────────────────

class TestMetricsEndpoints:
    async def test_overview(self, client: AsyncClient, seeded):
        user = seeded["user"]
        headers = auth_header(str(user.id), user.role, str(user.company_id))
        r = await client.get("/api/v2/metrics/overview", headers=headers)
        assert r.status_code == 200
        data = r.json()
        assert "credits_total" in data
        assert "external_by_status" in data
