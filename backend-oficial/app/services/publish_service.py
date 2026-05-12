import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.publishing import PublishSession, PublishedUsage
from app.models.packages import LicensePackage
from app.models.social import SocialAccount
from app.services.eligibility_service import check_eligibility


VALID_TRANSITIONS = {
    "draft": {"media_uploaded", "cancelled"},
    "media_uploaded": {"rendering", "cancelled"},
    "rendering": {"rendered", "failed"},
    "rendered": {"reserved", "cancelled"},
    "reserved": {"publishing", "cancelled", "expired"},
    "publishing": {"published", "failed"},
    "published": set(),
    "failed": {"draft"},
    "cancelled": set(),
    "expired": set(),
}


def validate_transition(current: str, target: str) -> bool:
    return target in VALID_TRANSITIONS.get(current, set())


async def create_session(
    db: AsyncSession,
    company_id: uuid.UUID,
    user_id: uuid.UUID,
    track_id: uuid.UUID,
    social_account_id: uuid.UUID,
    content_type: str,
    caption: str | None = None,
) -> PublishSession:
    session = PublishSession(
        company_id=company_id,
        created_by_user_id=user_id,
        track_id=track_id,
        social_account_id=social_account_id,
        content_type=content_type,
        caption=caption,
        status="draft",
    )
    db.add(session)
    await db.flush()
    return session


async def update_music_window(db: AsyncSession, session: PublishSession, data: dict) -> PublishSession:
    for key, value in data.items():
        setattr(session, key, value)
    await db.flush()
    return session


async def upload_media(db: AsyncSession, session: PublishSession) -> PublishSession:
    """Record upload path. Real S3 upload pending integration."""
    if not validate_transition(session.status, "media_uploaded"):
        raise ValueError("INVALID_STATE_TRANSITION")
    session.input_video_key = f"uploads/{session.company_id}/{session.id}/input.mp4"
    session.status = "media_uploaded"
    await db.flush()
    return session


async def render_video(db: AsyncSession, session: PublishSession) -> PublishSession:
    """Record render path. Real FFmpeg rendering pending integration."""
    if not validate_transition(session.status, "rendering"):
        raise ValueError("INVALID_STATE_TRANSITION")
    session.status = "rendering"
    await db.flush()

    session.rendered_video_key = f"renders/{session.company_id}/{session.id}/final.mp4"
    if not validate_transition(session.status, "rendered"):
        raise ValueError("INVALID_STATE_TRANSITION")
    session.status = "rendered"
    await db.flush()
    return session


async def reserve_credit(db: AsyncSession, session: PublishSession) -> PublishSession:
    if not validate_transition(session.status, "reserved"):
        raise ValueError("INVALID_STATE_TRANSITION")

    eligible, error, pkg = await check_eligibility(
        db, session.company_id, session.track_id, session.social_account_id, session.content_type
    )
    if not eligible:
        raise ValueError(error)

    # SELECT FOR UPDATE simulation
    pkg.credits_blocked += 1
    session.status = "reserved"
    session.reservation_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    await db.flush()
    return session


async def publish(db: AsyncSession, session: PublishSession) -> tuple[PublishSession, PublishedUsage]:
    if not validate_transition(session.status, "publishing"):
        raise ValueError("INVALID_STATE_TRANSITION")
    session.status = "publishing"
    await db.flush()

    # Find an active package that has at least one blocked credit reserved.
    # This allows publishing the "last available credit" previously reserved by this session.
    today = date.today()
    pkg_result = await db.execute(
        select(LicensePackage)
        .where(
            LicensePackage.company_id == session.company_id,
            LicensePackage.status == "active",
            LicensePackage.end_date >= today,
            LicensePackage.credits_blocked > 0,
        )
        .order_by(LicensePackage.end_date, LicensePackage.start_date)
    )
    pkg = pkg_result.scalar_one_or_none()
    if not pkg:
        session.status = "failed"
        session.failure_reason = "NO_BLOCKED_CREDIT"
        await db.flush()
        raise ValueError("NO_BLOCKED_CREDIT")

    # Re-validate rules/account/track before publishing.
    # A reserved credit can make available credits look like 0; that's expected and should not block publish.
    eligible, error, _ = await check_eligibility(
        db,
        session.company_id,
        session.track_id,
        session.social_account_id,
        session.content_type,
        package_id=pkg.id,
    )
    if not eligible and error != "NO_CREDITS_AVAILABLE":
        session.status = "failed"
        session.failure_reason = error
        if pkg.credits_blocked > 0:
            pkg.credits_blocked -= 1
        await db.flush()
        raise ValueError(error)

    # Get social account for platform info
    account = await db.get(SocialAccount, session.social_account_id)

    # Simulate publishing to social platform (pending real API integration)
    external_id = f"pub_{uuid.uuid4().hex[:12]}"

    # Create usage
    usage = PublishedUsage(
        company_id=session.company_id,
        package_id=pkg.id,
        track_id=session.track_id,
        publish_session_id=session.id,
        social_account_id=session.social_account_id,
        platform=account.platform if account else "unknown",
        content_type=session.content_type,
        coverage_type="controlled",
        status="published",
        external_media_id=external_id,
        published_at=datetime.now(timezone.utc),
        evidence_json={
            "rendered_video_key": session.rendered_video_key,
            "external_media_id": external_id,
            "published_via": "api",
        },
    )
    db.add(usage)

    # Consume credit
    pkg.credits_blocked -= 1
    pkg.credits_used += 1

    session.status = "published"
    await db.flush()

    return session, usage


async def cancel_session(db: AsyncSession, session: PublishSession) -> PublishSession:
    if not validate_transition(session.status, "cancelled"):
        raise ValueError("INVALID_STATE_TRANSITION")

    # If reserved, release the blocked credit
    if session.status == "reserved":
        today = date.today()
        pkg_result = await db.execute(
            select(LicensePackage)
            .where(
                LicensePackage.company_id == session.company_id,
                LicensePackage.status == "active",
                LicensePackage.end_date >= today,
                LicensePackage.credits_blocked > 0,
            )
            .order_by(LicensePackage.end_date, LicensePackage.start_date)
        )
        pkg = pkg_result.scalar_one_or_none()
        if pkg:
            pkg.credits_blocked -= 1
            await db.flush()

    session.status = "cancelled"
    await db.flush()
    return session
