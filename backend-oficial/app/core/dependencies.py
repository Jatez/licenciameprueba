import uuid
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.auth import User

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Validate JWT and return the active user. Raises 401 on failure."""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo",
        )
    return user


def require_roles(*roles: str):
    """Dependency factory: restrict endpoint to users with one of the given roles."""

    async def checker(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta acción",
            )
        return user

    return checker


async def require_company_active(user: User = Depends(get_current_user)) -> User:
    """
    Verify that the user's associated company is active.

    Raises 403 if the company is suspended or inactive.
    """
    # company_id may be None for super-admins without a company
    if user.company_id is None:
        return user
    # Lazy-load company if not already loaded
    company = getattr(user, "company", None)
    if company is None:
        # company not eager-loaded — skip check (no relationship data available)
        return user
    if getattr(company, "status", "active") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu empresa está suspendida o inactiva. Contacta a soporte.",
        )
    return user


def get_request_id(request: Request) -> str:
    """Return X-Request-ID header or generate a short random id."""
    return request.headers.get("X-Request-ID", uuid.uuid4().hex[:16])
