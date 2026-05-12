"""
Background scheduler for periodic tasks using asyncio.
Runs inside FastAPI lifespan — no external dependencies (no Celery).

Tasks:
1. expire_packages       — daily: mark expired packages as inactive
2. refresh_oauth_tokens  — every 6h: refresh TikTok (24h) and Meta (~60d) tokens
3. auto_scan_accounts    — every 4h: scan all connected accounts for new content
"""
import asyncio
import logging
from datetime import date, datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session
from app.models.packages import LicensePackage
from app.models.social import SocialAccount
from app.core.security import decrypt_token, encrypt_token

logger = logging.getLogger(__name__)

# ── Task 1: Expire packages ─────────────────────────────────────────────

async def expire_packages() -> int:
    """Mark packages whose end_date < today as expired. Returns count expired."""
    async with async_session() as db:
        try:
            today = date.today()
            result = await db.execute(
                select(LicensePackage).where(
                    LicensePackage.status == "active",
                    LicensePackage.end_date < today,
                )
            )
            expired = list(result.scalars().all())
            for pkg in expired:
                pkg.status = "expired"
                # Release any blocked credits
                pkg.credits_blocked = 0
            await db.commit()
            if expired:
                logger.info("Expired %d packages", len(expired))
            return len(expired)
        except Exception:
            await db.rollback()
            logger.exception("Error expiring packages")
            return 0


# ── Task 2: Refresh OAuth tokens ────────────────────────────────────────

async def refresh_oauth_tokens() -> int:
    """Refresh tokens nearing expiry. Returns count refreshed."""
    from app.services import tiktok_oauth_service, meta_oauth_service

    refreshed = 0
    async with async_session() as db:
        try:
            now = datetime.now(timezone.utc)
            # Find accounts with tokens expiring within 6 hours
            result = await db.execute(
                select(SocialAccount).where(
                    SocialAccount.status == "connected",
                    SocialAccount.access_token_encrypted.isnot(None),
                )
            )
            accounts = list(result.scalars().all())

            for account in accounts:
                # Check if token is near expiry
                if account.token_expires_at and account.token_expires_at > now:
                    # Still valid for more than 6 hours — skip
                    hours_left = (account.token_expires_at - now).total_seconds() / 3600
                    if hours_left > 6:
                        continue

                try:
                    if account.platform == "tiktok" and account.refresh_token_encrypted:
                        refresh_tok = decrypt_token(account.refresh_token_encrypted)
                        data = await tiktok_oauth_service.refresh_access_token(refresh_tok)
                        new_access = data.get("access_token")
                        new_refresh = data.get("refresh_token")
                        expires_in = data.get("expires_in", 86400)
                        if new_access:
                            account.access_token_encrypted = encrypt_token(new_access)
                            if new_refresh:
                                account.refresh_token_encrypted = encrypt_token(new_refresh)
                            account.token_expires_at = tiktok_oauth_service.compute_token_expiry(expires_in)
                            refreshed += 1
                            logger.info("Refreshed TikTok token for account %s", account.id)

                    elif account.platform in ("instagram", "facebook"):
                        # Meta long-lived tokens: refresh when < 7 days remaining
                        if account.token_expires_at:
                            days_left = (account.token_expires_at - now).total_seconds() / 86400
                            if days_left > 7:
                                continue
                        current_token = decrypt_token(account.access_token_encrypted)
                        data = await meta_oauth_service.get_long_lived_token(current_token)
                        new_access = data.get("access_token")
                        expires_in = data.get("expires_in", 5184000)  # ~60 days
                        if new_access:
                            account.access_token_encrypted = encrypt_token(new_access)
                            account.token_expires_at = meta_oauth_service.compute_token_expiry(expires_in)
                            refreshed += 1
                            logger.info("Refreshed %s token for account %s", account.platform, account.id)

                except Exception:
                    logger.warning("Failed to refresh token for account %s (%s)", account.id, account.platform, exc_info=True)
                    continue

            await db.commit()
        except Exception:
            await db.rollback()
            logger.exception("Error in token refresh cycle")

    return refreshed


# ── Task 3: Auto-scan all connected accounts ────────────────────────────

async def auto_scan_all_accounts() -> int:
    """Scan all connected accounts for new content. Returns count of new posts found."""
    from app.services import monitoring_service

    total_new = 0
    async with async_session() as db:
        try:
            result = await db.execute(
                select(SocialAccount).where(SocialAccount.status == "connected")
            )
            accounts = list(result.scalars().all())
        except Exception:
            logger.exception("Error fetching accounts for auto-scan")
            return 0

    for account in accounts:
        async with async_session() as db:
            try:
                new_contents = await monitoring_service.sync_account(
                    db, account.company_id, account.id, limit=5
                )
                await db.commit()
                total_new += len(new_contents)
                if new_contents:
                    logger.info(
                        "Auto-scan: %d new posts for %s @%s",
                        len(new_contents), account.platform, account.username,
                    )
            except Exception:
                await db.rollback()
                logger.warning(
                    "Auto-scan failed for account %s (%s @%s)",
                    account.id, account.platform, account.username, exc_info=True,
                )

    if total_new:
        logger.info("Auto-scan complete: %d new posts total", total_new)
    return total_new


# ── Scheduler loop ──────────────────────────────────────────────────────

async def _run_periodic(name: str, coro_fn, interval_seconds: int, initial_delay: int = 60):
    """Run a coroutine function periodically with error resilience."""
    await asyncio.sleep(initial_delay)
    while True:
        try:
            logger.debug("Scheduler: running %s", name)
            await coro_fn()
        except Exception:
            logger.exception("Scheduler: unhandled error in %s", name)
        await asyncio.sleep(interval_seconds)


async def start_scheduler() -> list[asyncio.Task]:
    """Start all periodic background tasks. Returns list of asyncio Tasks."""
    tasks = [
        asyncio.create_task(
            _run_periodic("expire_packages", expire_packages, interval_seconds=86400, initial_delay=30),
            name="scheduler:expire_packages",
        ),
        asyncio.create_task(
            _run_periodic("refresh_oauth_tokens", refresh_oauth_tokens, interval_seconds=21600, initial_delay=60),
            name="scheduler:refresh_oauth_tokens",
        ),
        asyncio.create_task(
            _run_periodic("auto_scan_accounts", auto_scan_all_accounts, interval_seconds=14400, initial_delay=120),
            name="scheduler:auto_scan_accounts",
        ),
    ]
    logger.info(
        "Background scheduler started: expire_packages(24h), refresh_tokens(6h), auto_scan(4h)"
    )
    return tasks


async def stop_scheduler(tasks: list[asyncio.Task]):
    """Cancel all background tasks gracefully."""
    for task in tasks:
        task.cancel()
    await asyncio.gather(*tasks, return_exceptions=True)
    logger.info("Background scheduler stopped")
