import uuid
from datetime import date, datetime
from sqlalchemy import String, Integer, ForeignKey, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKey


class UsageMetricsSnapshot(Base, UUIDPrimaryKey):
    __tablename__ = "usage_metrics_snapshots"

    usage_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("published_usages.id"), nullable=False)
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    impressions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reach: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    likes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    comments: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    shares: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    saves: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    raw_payload_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)


class RecommendationSnapshot(Base, UUIDPrimaryKey):
    __tablename__ = "recommendation_snapshots"

    company_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    recommended_for_date: Mapped[date] = mapped_column(Date, nullable=False)
    tracks_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    themes_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    rationale_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
