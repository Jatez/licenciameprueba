from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime


TEMPLATE_DESCRIPTIONS: dict[str, str] = {
    "starter": "Paquete básico con catálogo curado para empezar a licenciar tu música.",
    "pro": "Acceso al catálogo completo con créditos suficientes para creadores activos.",
    "enterprise": "Máxima capacidad y cobertura trimestral para sellos y empresas.",
}


class PackageTemplateResponse(BaseModel):
    id: UUID
    code: str
    name: str
    credits_total: int
    duration_days: int
    catalog_scope: str
    active_track_limit: int | None
    description: str = ""
    price_cop: int = 0
    price_per_credit_cop: int = 0

    model_config = {"from_attributes": True}


class PurchaseRequest(BaseModel):
    template_id: UUID
    start_date: date | None = None
    idempotency_key: str | None = None


class PackageResponse(BaseModel):
    id: UUID
    company_id: UUID
    company_name: str = ""
    template_id: UUID
    template_code: str = ""
    package_name: str
    credits_total: int
    credits_used: int
    credits_blocked: int
    credits_available: int
    catalog_scope: str | None = None
    active_track_limit: int | None = None
    duration_days: int = 0
    start_date: date
    end_date: date
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivateTrackRequest(BaseModel):
    track_id: UUID
