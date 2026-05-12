from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class CreateSessionRequest(BaseModel):
    track_id: UUID
    social_account_id: UUID
    content_type: str
    caption: str | None = None


class MusicWindowUpdate(BaseModel):
    music_start_sec: Decimal
    music_end_sec: Decimal
    music_volume: Decimal = Decimal("1.00")
    fade_in_sec: Decimal = Decimal("0")
    fade_out_sec: Decimal = Decimal("0")


class PublishSessionResponse(BaseModel):
    id: UUID
    company_id: UUID
    track_id: UUID
    social_account_id: UUID
    content_type: str
    caption: str | None
    input_video_key: str | None
    rendered_video_key: str | None
    music_start_sec: float
    music_end_sec: float
    music_volume: float
    fade_in_sec: float
    fade_out_sec: float
    status: str
    failure_reason: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublishedUsageResponse(BaseModel):
    id: UUID
    company_id: UUID
    package_id: UUID
    track_id: UUID | None
    platform: str
    content_type: str
    coverage_type: str
    status: str
    external_media_id: str | None
    external_url: str | None
    published_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
