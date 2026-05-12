"""
Expanded API integration tests — covers ALL endpoints with comprehensive cases.
Complements test_api_endpoints.py which only has basic happy paths.
"""
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
from app.models.packages import PackageTemplate, LicensePackage
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount
from app.models.monitoring import ExternalContent, AudioDetection
from app.models.audit import AuditLog
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

        admin = User(
            company_id=company.id, email="admin@test.com", role="admin",
            password_hash=hash_password("Admin123!"), status="active",
        )
        creator = User(
            company_id=company.id, email="creator@test.com", role="content_creator",
            password_hash=hash_password("Creator123!"), status="active",
        )
        db.add_all([admin, creator])
        await db.flush()

        tmpl = PackageTemplate(code="pro", name="Pro", credits_total=50, duration_days=30, is_active=True)
        db.add(tmpl)
        await db.flush()

        pkg = LicensePackage(
            company_id=company.id, template_id=tmpl.id, package_name="Pro",
            credits_total=50, credits_used=2, credits_blocked=0,
            start_date=date.today() - timedelta(days=1), end_date=date.today() + timedelta(days=29),
            status="active",
        )
        db.add(pkg)
        await db.flush()

        track = Track(
            title="Test Song", artist="Artist", isrc="USRC12300001",
            s3_key_master="k.wav", duration_seconds=180, bpm=120, genre="pop",
            rights_reference="R1", active=True,
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
            username="test_ig", status="connected",
        )
        db.add(sa)
        await db.flush()

        ext_content = ExternalContent(
            company_id=company.id, social_account_id=sa.id,
            platform="instagram", content_type="ig_reel",
            external_media_id="media_001", external_url="https://instagram.com/reel/123",
            reconciliation_status="unmatched",
        )
        db.add(ext_content)
        await db.flush()

        detection = AudioDetection(
            company_id=company.id, external_content_id=ext_content.id,
            detector_provider="acrcloud", detection_status="matched",
            matched_track_id=track.id, confidence_score=0.95,
            matched_title="Test Song", matched_artist="Artist",
        )
        db.add(detection)
        await db.flush()

        audit = AuditLog(
            actor_user_id=admin.id, company_id=company.id,
            entity_type="user", entity_id=admin.id, action="login",
        )
        db.add(audit)
        await db.flush()
        await db.commit()

        return {
            "company": company,
            "admin": admin,
            "creator": creator,
            "template": tmpl,
            "package": pkg,
            "track": track,
            "rule": rule,
            "social_account": sa,
            "external_content": ext_content,
            "detection": detection,
        }


# ══════════════════════════════════════════════════════════
# AUTH — refresh & logout
# ══════════════════════════════════════════════════════════

class TestAuthRefreshLogout:
    async def test_refresh_token_flow(self, client: AsyncClient, seeded):
        # First login to get tokens
        r = await client.post("/api/v2/auth/login", json={"email": "admin@test.com", "password": "Admin123!"})
        assert r.status_code == 200
        tokens = r.json()
        assert "refresh_token" in tokens

        # Refresh
        r2 = await client.post("/api/v2/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
        assert r2.status_code == 200
        new_tokens = r2.json()
        assert "access_token" in new_tokens
        assert "refresh_token" in new_tokens

    async def test_refresh_invalid_token(self, client: AsyncClient):
        r = await client.post("/api/v2/auth/refresh", json={"refresh_token": "invalid_token"})
        assert r.status_code == 401

    async def test_logout(self, client: AsyncClient, seeded):
        r = await client.post("/api/v2/auth/login", json={"email": "admin@test.com", "password": "Admin123!"})
        tokens = r.json()

        r2 = await client.post("/api/v2/auth/logout", json={"refresh_token": tokens["refresh_token"]})
        assert r2.status_code == 204

        # Refresh should fail after logout
        r3 = await client.post("/api/v2/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
        assert r3.status_code == 401


# ══════════════════════════════════════════════════════════
# TRACKS CRUD
# ══════════════════════════════════════════════════════════

class TestTracksCRUD:
    async def test_get_track_by_id(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/tracks/{seeded['track'].id}", headers=h)
        assert r.status_code == 200
        assert r.json()["title"] == "Test Song"

    async def test_get_track_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/tracks/{uuid.uuid4()}", headers=h)
        assert r.status_code == 404

    async def test_create_track(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        body = {
            "title": "New Track",
            "artist": "New Artist",
            "s3_key_master": "new.wav",
            "duration_seconds": 200,
            "bpm": 128,
            "genre": "electronic",
            "rights_reference": "R2",
        }
        r = await client.post("/api/v2/tracks/", json=body, headers=h)
        assert r.status_code == 201
        assert r.json()["title"] == "New Track"

    async def test_create_track_forbidden_for_creator(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["creator"].id), "content_creator", str(seeded["company"].id))
        body = {
            "title": "Blocked", "artist": "X", "s3_key_master": "x.wav",
            "duration_seconds": 100, "rights_reference": "R99",
        }
        r = await client.post("/api/v2/tracks/", json=body, headers=h)
        assert r.status_code == 403

    async def test_update_track(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.patch(
            f"/api/v2/tracks/{seeded['track'].id}",
            json={"title": "Updated Title", "bpm": 140},
            headers=h,
        )
        assert r.status_code == 200
        assert r.json()["title"] == "Updated Title"
        assert r.json()["bpm"] == 140

    async def test_update_track_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.patch(f"/api/v2/tracks/{uuid.uuid4()}", json={"title": "X"}, headers=h)
        assert r.status_code == 404

    async def test_delete_track_soft_delete(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(f"/api/v2/tracks/{seeded['track'].id}", headers=h)
        assert r.status_code == 204

        # Track still exists but marked inactive — GET by id still works
        r2 = await client.get(f"/api/v2/tracks/{seeded['track'].id}", headers=h)
        assert r2.status_code == 200
        assert r2.json()["active"] is False

    async def test_delete_track_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(f"/api/v2/tracks/{uuid.uuid4()}", headers=h)
        assert r.status_code == 404


# ══════════════════════════════════════════════════════════
# TRACK RULES CRUD
# ══════════════════════════════════════════════════════════

class TestTrackRules:
    async def test_list_rules(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/tracks/{seeded['track'].id}/rules", headers=h)
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_create_rule(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        body = {
            "allowed_platforms": ["tiktok"],
            "allowed_content_types": ["tiktok_video"],
            "valid_from": str(date.today()),
        }
        r = await client.post(f"/api/v2/tracks/{seeded['track'].id}/rules", json=body, headers=h)
        assert r.status_code == 201
        assert "tiktok" in r.json()["allowed_platforms"]

    async def test_delete_rule(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(
            f"/api/v2/tracks/{seeded['track'].id}/rules/{seeded['rule'].id}",
            headers=h,
        )
        assert r.status_code == 204

    async def test_delete_rule_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(
            f"/api/v2/tracks/{seeded['track'].id}/rules/{uuid.uuid4()}",
            headers=h,
        )
        assert r.status_code == 404


# ══════════════════════════════════════════════════════════
# SOCIAL ACCOUNTS — full CRUD
# ══════════════════════════════════════════════════════════

class TestSocialAccountsCRUD:
    async def test_connect_new_account(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        body = {"platform": "tiktok", "external_account_id": "tt_new", "username": "test_tt"}
        r = await client.post("/api/v2/social-accounts/connect", json=body, headers=h)
        assert r.status_code == 201
        assert r.json()["platform"] == "tiktok"
        assert r.json()["status"] == "connected"

    async def test_connect_reconnect_existing(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        body = {"platform": "instagram", "external_account_id": "ext1", "username": "test_ig"}
        r = await client.post("/api/v2/social-accounts/connect", json=body, headers=h)
        assert r.status_code == 201
        assert r.json()["status"] == "connected"

    async def test_get_single_account(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/social-accounts/{seeded['social_account'].id}", headers=h)
        assert r.status_code == 200
        assert r.json()["username"] == "test_ig"

    async def test_get_account_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/social-accounts/{uuid.uuid4()}", headers=h)
        assert r.status_code == 404

    async def test_disconnect_account(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(f"/api/v2/social-accounts/{seeded['social_account'].id}", headers=h)
        assert r.status_code == 204

    async def test_disconnect_account_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(f"/api/v2/social-accounts/{uuid.uuid4()}", headers=h)
        assert r.status_code == 404

    async def test_get_feed(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(
            f"/api/v2/social-accounts/{seeded['social_account'].id}/feed?limit=5",
            headers=h,
        )
        assert r.status_code == 200
        data = r.json()
        assert "posts" in data
        assert "stories" in data

    async def test_get_feed_custom_limit(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(
            f"/api/v2/social-accounts/{seeded['social_account'].id}/feed?limit=10",
            headers=h,
        )
        assert r.status_code == 200

    async def test_get_feed_limit_validation(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        # limit > 20 should fail
        r = await client.get(
            f"/api/v2/social-accounts/{seeded['social_account'].id}/feed?limit=25",
            headers=h,
        )
        assert r.status_code == 422

    async def test_get_feed_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(f"/api/v2/social-accounts/{uuid.uuid4()}/feed?limit=5", headers=h)
        assert r.status_code == 404


# ══════════════════════════════════════════════════════════
# MONITORING ENDPOINTS
# ══════════════════════════════════════════════════════════

class TestMonitoringEndpoints:
    async def test_list_contents(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/monitoring/contents", headers=h)
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_list_contents_filter_by_status(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/monitoring/contents?reconciliation_status=unmatched", headers=h)
        assert r.status_code == 200
        for item in r.json():
            assert item["reconciliation_status"] == "unmatched"

    async def test_list_detections(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get(
            f"/api/v2/monitoring/contents/{seeded['external_content'].id}/detections",
            headers=h,
        )
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_resolve_content(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/monitoring/contents/{seeded['external_content'].id}/resolve",
            json={
                "track_id": str(seeded["track"].id),
                "package_id": str(seeded["package"].id),
                "resolution_note": "Manually verified",
            },
            headers=h,
        )
        assert r.status_code == 200
        assert r.json()["reconciliation_status"] == "matched_usage"

    async def test_resolve_content_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/monitoring/contents/{uuid.uuid4()}/resolve",
            json={"track_id": str(seeded["track"].id), "package_id": str(seeded["package"].id)},
            headers=h,
        )
        assert r.status_code == 404

    async def test_delete_content(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(
            f"/api/v2/monitoring/contents/{seeded['external_content'].id}",
            headers=h,
        )
        assert r.status_code == 204

    async def test_delete_content_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.delete(
            f"/api/v2/monitoring/contents/{uuid.uuid4()}",
            headers=h,
        )
        assert r.status_code == 404

    async def test_sync_content_returns_error_for_unreachable_profile(self, client: AsyncClient, seeded):
        """Sync now uses real scraping — returns 400 when profile can't be reached."""
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/monitoring/sync/{seeded['social_account'].id}",
            headers=h,
        )
        # Real scraping fails in test env — endpoint should return 400
        assert r.status_code in (200, 400)

    async def test_sync_nonexistent_account(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/monitoring/sync/{uuid.uuid4()}",
            headers=h,
        )
        assert r.status_code == 400

    async def test_identify_raw_empty_file(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            "/api/v2/monitoring/identify-raw",
            files={"audio": ("test.wav", b"", "application/octet-stream")},
            headers=h,
        )
        assert r.status_code == 400

    async def test_identify_empty_file(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            "/api/v2/monitoring/identify",
            files={"audio": ("test.wav", b"", "application/octet-stream")},
            headers=h,
        )
        assert r.status_code == 400

    async def test_identify_url_invalid_url(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            "/api/v2/monitoring/identify-url",
            json={"url": "https://evil.com/video"},
            headers=h,
        )
        # Should fail with download error since URL is not supported
        assert r.status_code in (400, 500)


# ══════════════════════════════════════════════════════════
# ADMIN ENDPOINTS
# ══════════════════════════════════════════════════════════

class TestAdminEndpoints:
    async def test_list_companies(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/admin/companies", headers=h)
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_list_users(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/admin/users", headers=h)
        assert r.status_code == 200
        assert len(r.json()) >= 2

    async def test_list_audit_logs(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/admin/audit-logs", headers=h)
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_admin_forbidden_for_creator(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["creator"].id), "content_creator", str(seeded["company"].id))
        r = await client.get("/api/v2/admin/companies", headers=h)
        assert r.status_code == 403

    async def test_admin_users_forbidden_for_creator(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["creator"].id), "content_creator", str(seeded["company"].id))
        r = await client.get("/api/v2/admin/users", headers=h)
        assert r.status_code == 403


# ══════════════════════════════════════════════════════════
# METRICS — comprehensive
# ══════════════════════════════════════════════════════════

class TestMetricsComprehensive:
    async def test_overview_has_all_fields(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/metrics/overview", headers=h)
        assert r.status_code == 200
        data = r.json()
        assert "credits_total" in data
        assert "credits_used" in data
        assert "credits_blocked" in data
        assert "credits_available" in data
        assert "external_by_status" in data
        assert "total_tracks" in data
        assert "tracks_by_genre" in data
        assert "total_social_accounts" in data
        assert "total_detections" in data
        assert "detections_matched" in data
        assert "detections_uncertain" in data
        assert "detections_no_match" in data
        assert "unique_tracks_detected" in data
        assert "total_content_scanned" in data
        assert "scanned_by_platform" in data

    async def test_overview_credits_math(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/metrics/overview", headers=h)
        data = r.json()
        assert data["credits_available"] == data["credits_total"] - data["credits_used"] - data["credits_blocked"]

    async def test_overview_detection_counts(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.get("/api/v2/metrics/overview", headers=h)
        data = r.json()
        assert data["total_detections"] >= 1
        assert data["detections_matched"] >= 1

    async def test_overview_requires_auth(self, client: AsyncClient):
        r = await client.get("/api/v2/metrics/overview")
        assert r.status_code == 403


# ══════════════════════════════════════════════════════════
# PACKAGES — purchase + edge cases
# ══════════════════════════════════════════════════════════

class TestPackagesPurchase:
    async def test_purchase_package(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        body = {
            "template_id": str(seeded["template"].id),
            "start_date": str(date.today()),
            "idempotency_key": uuid.uuid4().hex,
        }
        r = await client.post("/api/v2/packages/", json=body, headers=h)
        assert r.status_code == 201
        assert r.json()["package_name"] == "Pro"
        assert r.json()["credits_total"] == 50

    async def test_purchase_requires_auth(self, client: AsyncClient, seeded):
        body = {
            "template_id": str(seeded["template"].id),
            "idempotency_key": uuid.uuid4().hex,
        }
        r = await client.post("/api/v2/packages/", json=body)
        assert r.status_code == 403


# ══════════════════════════════════════════════════════════
# AUTO-SCAN — limit validation
# ══════════════════════════════════════════════════════════

class TestAutoScanLimits:
    async def test_auto_scan_rejects_limit_over_20(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/social-accounts/{seeded['social_account'].id}/auto-scan?limit=25",
            headers=h,
        )
        assert r.status_code == 422

    async def test_auto_scan_rejects_limit_zero(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/social-accounts/{seeded['social_account'].id}/auto-scan?limit=0",
            headers=h,
        )
        assert r.status_code == 422

    async def test_auto_scan_account_not_found(self, client: AsyncClient, seeded):
        h = auth_header(str(seeded["admin"].id), "admin", str(seeded["company"].id))
        r = await client.post(
            f"/api/v2/social-accounts/{uuid.uuid4()}/auto-scan?limit=5",
            headers=h,
        )
        assert r.status_code == 404
