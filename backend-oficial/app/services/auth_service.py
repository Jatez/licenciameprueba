import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, hash_token
from app.models.auth import User, RefreshToken


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        return None

    # Check lockout
    if user.locked_until and user.locked_until > datetime.now(timezone.utc):
        return None

    if not verify_password(password, user.password_hash):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 20:
            user.locked_until = datetime.now(timezone.utc) + timedelta(hours=24)
        elif user.failed_login_attempts >= 10:
            user.locked_until = datetime.now(timezone.utc) + timedelta(hours=1)
        elif user.failed_login_attempts >= 5:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        await db.flush()
        return None

    # Reset on success
    user.failed_login_attempts = 0
    user.locked_until = None
    await db.flush()
    return user


async def create_token_pair(db: AsyncSession, user: User) -> dict:
    access = create_access_token(str(user.id), user.role, str(user.company_id) if user.company_id else None)
    raw_refresh, token_hash = create_refresh_token()
    family_id = uuid.uuid4()

    rt = RefreshToken(
        user_id=user.id,
        token_hash=token_hash,
        family_id=family_id,
        is_revoked=False,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        created_at=datetime.now(timezone.utc),
    )
    db.add(rt)
    await db.flush()

    return {"access_token": access, "refresh_token": raw_refresh, "token_type": "bearer"}


async def rotate_refresh_token(db: AsyncSession, raw_token: str) -> dict | None:
    token_h = hash_token(raw_token)
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_h))
    old_rt = result.scalar_one_or_none()

    if not old_rt:
        return None

    # Detect reuse: if already replaced, revoke entire family
    if old_rt.is_revoked or old_rt.replaced_by_id is not None:
        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.family_id == old_rt.family_id)
            .values(is_revoked=True)
        )
        await db.flush()
        return None

    if old_rt.expires_at < datetime.now(timezone.utc):
        old_rt.is_revoked = True
        await db.flush()
        return None

    # Get user
    user_result = await db.execute(select(User).where(User.id == old_rt.user_id))
    user = user_result.scalar_one_or_none()
    if not user or user.status != "active":
        return None

    # Create new token
    access = create_access_token(str(user.id), user.role, str(user.company_id) if user.company_id else None)
    new_raw, new_hash = create_refresh_token()

    new_rt = RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        family_id=old_rt.family_id,
        is_revoked=False,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_rt)
    await db.flush()

    old_rt.replaced_by_id = new_rt.id
    await db.flush()

    return {"access_token": access, "refresh_token": new_raw, "token_type": "bearer"}


async def revoke_refresh_token(db: AsyncSession, raw_token: str) -> bool:
    token_h = hash_token(raw_token)
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_h))
    rt = result.scalar_one_or_none()
    if rt:
        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.family_id == rt.family_id)
            .values(is_revoked=True)
        )
        await db.flush()
        return True
    return False
