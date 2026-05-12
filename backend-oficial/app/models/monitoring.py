import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, DateTime, UniqueConstraint, Numeric, Integer, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKey, TimestampMixin


class ExternalContent(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "external_contents"
    __table_args__ = (
        UniqueConstraint("company_id", "platform", "external_media_id", name="uq_external_content"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    social_account_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("social_accounts.id"), nullable=True)
    platform: Mapped[str] = mapped_column(String(32), nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    external_media_id: Mapped[str] = mapped_column(String(255), nullable=False)
    external_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    raw_payload_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    reconciliation_status: Mapped[str] = mapped_column(String(32), nullable=False, default="unmatched")

    # Content engagement stats (from platform APIs)
    views: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    likes: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    comments: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    shares: Mapped[int | None] = mapped_column(BigInteger, nullable=True)


class AudioDetection(Base, UUIDPrimaryKey):
    __tablename__ = "audio_detections"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    publish_session_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("publish_sessions.id"), nullable=True)
    external_content_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("external_contents.id"), nullable=True)
    detector_provider: Mapped[str] = mapped_column(String(50), nullable=False)
    detection_status: Mapped[str] = mapped_column(String(32), nullable=False)
    matched_track_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)
    matched_title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    matched_artist: Mapped[str | None] = mapped_column(String(500), nullable=True)
    raw_result_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
