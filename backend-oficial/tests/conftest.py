import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.models.base import Base
from app.models.auth import Company, User, RefreshToken
from app.models.packages import PackageTemplate, LicensePackage, PackageTrackEntitlement
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount
from app.models.publishing import PublishSession, PublishedUsage
from app.models.monitoring import ExternalContent, AudioDetection
from app.models.audit import AuditLog
from app.models.analytics import UsageMetricsSnapshot, RecommendationSnapshot
from app.core.security import hash_password


# --------------- async engine (PostgreSQL test DB) ---------------

TEST_DB_URL = "postgresql+asyncpg://dualtee:dualtee_local_2026@localhost:5432/dualtee_test"


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    """Create all tables before each test, drop after."""
    _engine = create_async_engine(TEST_DB_URL, echo=False)
    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield _engine
    async with _engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await _engine.dispose()


@pytest_asyncio.fixture
async def db(setup_db):
    """Provide a clean async session per test."""
    _session = async_sessionmaker(setup_db, class_=AsyncSession, expire_on_commit=False)
    async with _session() as session:
        yield session


# --------------- HTTP client with DB override ---------------

@pytest_asyncio.fixture
async def client(setup_db):
    """AsyncClient with app DB overridden to test PostgreSQL DB."""
    from app.main import app
    from app.core.database import get_db

    _session_factory = async_sessionmaker(setup_db, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db():
        async with _session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient, user_admin: User, db: AsyncSession):
    """Log in as user_admin and return Bearer auth headers."""
    # Commit the user_admin so it's visible to the client's session
    await db.commit()
    response = await client.post("/api/v2/auth/login", json={
        "email": "admin@acme.com",
        "password": "Admin123!",
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# --------------- reusable factory fixtures ---------------

@pytest_asyncio.fixture
async def company(db: AsyncSession) -> Company:
    c = Company(name="ACME Records", country_code="CO", status="active")
    db.add(c)
    await db.flush()
    return c


@pytest_asyncio.fixture
async def company_inactive(db: AsyncSession) -> Company:
    c = Company(name="Dead Records", country_code="CO", status="inactive")
    db.add(c)
    await db.flush()
    return c


@pytest_asyncio.fixture
async def user_admin(db: AsyncSession, company: Company) -> User:
    u = User(
        company_id=company.id,
        email="admin@acme.com",
        role="admin",
        password_hash=hash_password("Admin123!"),
        status="active",
    )
    db.add(u)
    await db.flush()
    return u


@pytest_asyncio.fixture
async def user_creator(db: AsyncSession, company: Company) -> User:
    u = User(
        company_id=company.id,
        email="creator@acme.com",
        role="content_creator",
        password_hash=hash_password("Creator123!"),
        status="active",
    )
    db.add(u)
    await db.flush()
    return u


@pytest_asyncio.fixture
async def user_inactive(db: AsyncSession, company: Company) -> User:
    u = User(
        company_id=company.id,
        email="inactive@acme.com",
        role="admin",
        password_hash=hash_password("Pass123!"),
        status="suspended",
    )
    db.add(u)
    await db.flush()
    return u


@pytest_asyncio.fixture
async def template_pro(db: AsyncSession) -> PackageTemplate:
    t = PackageTemplate(
        code="pro_50",
        name="Pro",
        credits_total=50,
        duration_days=30,
        catalog_scope="full_catalog",
        is_active=True,
    )
    db.add(t)
    await db.flush()
    return t


@pytest_asyncio.fixture
async def template_curated(db: AsyncSession) -> PackageTemplate:
    t = PackageTemplate(
        code="curated_10",
        name="Curated",
        credits_total=10,
        duration_days=30,
        catalog_scope="curated",
        active_track_limit=3,
        is_active=True,
    )
    db.add(t)
    await db.flush()
    return t


@pytest_asyncio.fixture
async def package_active(db: AsyncSession, company: Company, template_pro: PackageTemplate) -> LicensePackage:
    p = LicensePackage(
        company_id=company.id,
        template_id=template_pro.id,
        package_name="Pro",
        credits_total=50,
        credits_used=3,
        credits_blocked=0,
        start_date=date.today() - timedelta(days=5),
        end_date=date.today() + timedelta(days=25),
        status="active",
    )
    db.add(p)
    await db.flush()
    return p


@pytest_asyncio.fixture
async def track(db: AsyncSession) -> Track:
    t = Track(
        title="Test Song",
        artist="Test Artist",
        isrc="USRC17607839",
        s3_key_master="tracks/test/master.wav",
        duration_seconds=180,
        bpm=120,
        genre="pop",
        rights_reference="REF-001",
        active=True,
    )
    db.add(t)
    await db.flush()
    return t


@pytest_asyncio.fixture
async def track_inactive(db: AsyncSession) -> Track:
    t = Track(
        title="Archived Song",
        artist="Old Artist",
        s3_key_master="tracks/old/master.wav",
        duration_seconds=200,
        rights_reference="REF-OLD",
        active=False,
    )
    db.add(t)
    await db.flush()
    return t


@pytest_asyncio.fixture
async def license_rule(db: AsyncSession, track: Track) -> TrackLicenseRule:
    r = TrackLicenseRule(
        track_id=track.id,
        allowed_platforms=["instagram", "tiktok"],
        allowed_content_types=["ig_reel", "ig_story", "tiktok_video"],
        territories=["CO", "MX", "US"],
        valid_from=date.today() - timedelta(days=30),
        valid_until=date.today() + timedelta(days=365),
    )
    db.add(r)
    await db.flush()
    return r


@pytest_asyncio.fixture
async def social_account_ig(db: AsyncSession, company: Company) -> SocialAccount:
    s = SocialAccount(
        company_id=company.id,
        platform="instagram",
        external_account_id="ig_12345",
        username="acme_ig",
        status="connected",
    )
    db.add(s)
    await db.flush()
    return s


@pytest_asyncio.fixture
async def social_account_no_username(db: AsyncSession, company: Company) -> SocialAccount:
    s = SocialAccount(
        company_id=company.id,
        platform="instagram",
        external_account_id="ig_nousername",
        username=None,
        status="connected",
    )
    db.add(s)
    await db.flush()
    return s


@pytest_asyncio.fixture
async def social_account_disconnected(db: AsyncSession, company: Company) -> SocialAccount:
    s = SocialAccount(
        company_id=company.id,
        platform="tiktok",
        external_account_id="tt_99999",
        username="acme_tt",
        status="expired",
    )
    db.add(s)
    await db.flush()
    return s
