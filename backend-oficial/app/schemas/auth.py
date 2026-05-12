from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    country_code: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: UUID
    company_id: UUID | None
    email: str
    role: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CompanyResponse(BaseModel):
    id: UUID
    name: str
    country_code: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CompanyUpdate(BaseModel):
    status: str | None = None
    name: str | None = None


class UpdateProfileRequest(BaseModel):
    email: EmailStr | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
