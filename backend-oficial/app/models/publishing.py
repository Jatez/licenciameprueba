import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Text, Numeric, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKey, TimestampMixin


class PublishSession(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "publish_sessions"
    __table_args__ = (
        UniqueConstraint("company_id", "idempotency_key", name="uq_session_idempotency"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    created_by_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False)
    social_account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("social_accounts.id"), nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    input_video_key: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    rendered_video_key: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    music_start_sec: Mapped[Decimal] = mapped_column(Numeric(8, 3), default=0, nullable=False)
    music_end_sec: Mapped[Decimal] = mapped_column(Numeric(8, 3), default=30, nullable=False)
    music_volume: Mapped[Decimal] = mapped_column(Numeric(4, 2), default=Decimal("1.00"), nullable=False)
    fade_in_sec: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0, nullable=False)
    fade_out_sec: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="draft")
    reservation_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    failure_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    idempotency_key: Mapped[str | None] = mapped_column(String(255), nullable=True)


class PublishedUsage(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "published_usages"
    __table_args__ = (
        UniqueConstraint("company_id", "idempotency_key", name="uq_usage_idempotency"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    package_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("license_packages.id"), nullable=False)
    track_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=True)
    publish_session_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("publish_sessions.id"), nullable=True)
    social_account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("social_accounts.id"), nullable=False)
    platform: Mapped[str] = mapped_column(String(32), nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    coverage_type: Mapped[str] = mapped_column(String(24), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="published")
    external_media_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    external_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    evidence_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    idempotency_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
