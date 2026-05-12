import uuid
from datetime import date, datetime, timezone
from sqlalchemy import String, Integer, Boolean, ForeignKey, Date, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKey, TimestampMixin


class Track(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "tracks"

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    artist: Mapped[str] = mapped_column(String(500), nullable=False)
    isrc: Mapped[str | None] = mapped_column(String(20), nullable=True)
    s3_key_master: Mapped[str] = mapped_column(String(1000), nullable=False)
    s3_key_preview: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    bpm: Mapped[int | None] = mapped_column(Integer, nullable=True)
    genre: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rights_reference: Mapped[str] = mapped_column(String(255), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class TrackLicenseRule(Base, UUIDPrimaryKey):
    __tablename__ = "track_license_rules"

    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False)
    allowed_platforms: Mapped[dict] = mapped_column(JSONB, nullable=False)
    allowed_content_types: Mapped[dict] = mapped_column(JSONB, nullable=False)
    territories: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    terms_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class TrackFavorite(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "track_favorites"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    track_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False)
