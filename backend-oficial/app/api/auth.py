from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import hash_password, verify_password
from app.models.auth import User, Company
from typing import Optional
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest, LogoutRequest, UserResponse, CompanyResponse, UpdateProfileRequest, ChangePasswordRequest
from app.services import auth_service, audit_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new company + company_admin user."""
    # Check duplicate email
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="EMAIL_ALREADY_EXISTS")

    # Validate inputs
    if len(body.password) < 8:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="PASSWORD_TOO_SHORT")
    if len(body.country_code) != 2:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="INVALID_COUNTRY_CODE")

    # Create company
    company = Company(name=body.company_name, country_code=body.country_code.upper(), status="active")
    db.add(company)
    await db.flush()

    # Create user as company_admin
    user = User(
        company_id=company.id,
        email=body.email,
        role="company_admin",
        password_hash=hash_password(body.password),
        status="active",
    )
    db.add(user)
    await db.flush()

    # Generate tokens and log
    tokens = await auth_service.create_token_pair(db, user)
    await audit_service.log_action(db, user.id, company.id, "user", user.id, "register")
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate_user(db, body.email, body.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_CREDENTIALS")
    if user.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="USER_INACTIVE")

    tokens = await auth_service.create_token_pair(db, user)
    await audit_service.log_action(db, user.id, user.company_id, "user", user.id, "login")
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    tokens = await auth_service.rotate_refresh_token(db, body.refresh_token)
    if not tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_REFRESH_TOKEN")
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(body: LogoutRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.revoke_refresh_token(db, body.refresh_token)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/company", response_model=Optional[CompanyResponse])
async def my_company(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.company_id:
        return None
    result = await db.execute(select(Company).where(Company.id == current_user.company_id))
    company = result.scalar_one_or_none()
    if not company:
        return None
    return company


@router.get("/billing-profile")
async def get_billing_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return billing profile for the current company (stub — extend as needed)."""
    result = await db.execute(select(Company).where(Company.id == current_user.company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="COMPANY_NOT_FOUND")
    return {
        "company_id": str(company.id),
        "company_name": company.name,
        "country_code": company.country_code,
        "billing_email": current_user.email,
        "plan": "starter",
        "status": "active",
    }


@router.patch("/billing-profile")
async def update_billing_profile(
    body: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update billing profile fields (stub)."""
    result = await db.execute(select(Company).where(Company.id == current_user.company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="COMPANY_NOT_FOUND")
    if "company_name" in body:
        company.name = body["company_name"]
    await db.flush()
    return {"updated": True, "company_id": str(company.id)}


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's profile (email)."""
    if body.email and body.email != current_user.email:
        existing = await db.execute(select(User).where(User.email == body.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="EMAIL_ALREADY_EXISTS")
        current_user.email = body.email
        await db.flush()
    return current_user


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change current user's password."""
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_CREDENTIALS")
    if len(body.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="PASSWORD_TOO_SHORT")
    current_user.password_hash = hash_password(body.new_password)
    await db.flush()
    return {"updated": True}
