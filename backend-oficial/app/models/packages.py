import uuid
from datetime import date, datetime, timezone
from sqlalchemy import String, Integer, Boolean, ForeignKey, Date, DateTime, UniqueConstraint, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKey, TimestampMixin


class PackageTemplate(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "package_templates"

    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    credits_total: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_days: Mapped[int] = mapped_column(Integer, nullable=False)
    catalog_scope: Mapped[str] = mapped_column(String(32), nullable=False, default="full_catalog")
    active_track_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    price_cop: Mapped[int] = mapped_column(Integer, nullable=False, default=0)


class LicensePackage(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "license_packages"
    __table_args__ = (
        UniqueConstraint("company_id", "idempotency_key", name="uq_package_purchase_idempotency"),
        CheckConstraint("credits_used >= 0", name="ck_credits_used_positive"),
        CheckConstraint("credits_blocked >= 0", name="ck_credits_blocked_positive"),
        CheckConstraint("credits_used + credits_blocked <= credits_total", name="ck_credits_within_total"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    template_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("package_templates.id"), nullable=False)
    package_name: Mapped[str] = mapped_column(String(255), nullable=False)
    credits_total: Mapped[int] = mapped_column(Integer, nullable=False)
    credits_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    credits_blocked: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="active")
    idempotency_key: Mapped[str | None] = mapped_column(String(255), nullable=True)


class PackageTrackEntitlement(Base, UUIDPrimaryKey):
    __tablename__ = "package_track_entitlements"
    __table_args__ = (
        UniqueConstraint("package_id", "track_id", name="uq_package_track"),
    )

    package_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("license_packages.id"), nullable=False)
    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False)
    activated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    activated_by_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
