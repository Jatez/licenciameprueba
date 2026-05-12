from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime


class TrackResponse(BaseModel):
    id: UUID
    title: str
    artist: str
    isrc: str | None
    duration_seconds: int
    bpm: int | None
    genre: str | None
    rights_reference: str
    active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TrackCreateRequest(BaseModel):
    title: str
    artist: str
    isrc: str | None = None
    s3_key_master: str = "local/master.mp3"
    s3_key_preview: str | None = None
    duration_seconds: int
    bpm: int | None = None
    genre: str | None = None
    rights_reference: str


class TrackLicenseRuleResponse(BaseModel):
    id: UUID
    track_id: UUID
    allowed_platforms: list
    allowed_content_types: list
    territories: list | None
    valid_from: date
    valid_until: date | None

    model_config = {"from_attributes": True}


class TrackUpdateRequest(BaseModel):
    title: str | None = None
    artist: str | None = None
    isrc: str | None = None
    duration_seconds: int | None = None
    bpm: int | None = None
    genre: str | None = None
    rights_reference: str | None = None
    active: bool | None = None


class TrackLicenseRuleCreate(BaseModel):
    allowed_platforms: list[str]
    allowed_content_types: list[str]
    territories: list[str] | None = None
    valid_from: date
    valid_until: date | None = None
