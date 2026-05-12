from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ExternalContentResponse(BaseModel):
    id: UUID
    company_id: UUID
    social_account_id: UUID | None
    platform: str
    content_type: str
    external_media_id: str
    external_url: str | None
    posted_at: datetime | None
    reconciliation_status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ResolveTrackRequest(BaseModel):
    track_id: UUID
    resolution_note: str | None = None


class CreateObservedUsageRequest(BaseModel):
    package_id: UUID
    track_id: UUID
    resolution_note: str | None = None


class AudioDetectionResponse(BaseModel):
    id: UUID
    detector_provider: str
    detection_status: str
    matched_track_id: UUID | None
    confidence_score: float | None
    matched_title: str | None
    matched_artist: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ContentWithDetectionResponse(BaseModel):
    """A post/story with its detected songs."""
    id: UUID
    company_id: UUID | None = None
    social_account_id: UUID | None = None
    platform: str
    content_type: str
    external_media_id: str
    external_url: str | None
    posted_at: datetime | None
    reconciliation_status: str
    created_at: datetime
    caption: str | None = None
    duration: float | None = None
    uploader: str | None = None
    thumbnail_url: str | None = None
    views: int | None = None
    likes: int | None = None
    comments: int | None = None
    shares: int | None = None
    detection: AudioDetectionResponse | None = None
    detections: list[AudioDetectionResponse] = []

    model_config = {"from_attributes": True}


class AccountFeedResponse(BaseModel):
    """Feed of a social account: account info + recent posts/stories with detections."""
    account_id: UUID
    platform: str
    username: str | None
    handle: str
    status: str
    posts: list[ContentWithDetectionResponse]
    stories: list[ContentWithDetectionResponse]


class MetricsOverviewResponse(BaseModel):
    credits_total: int
    credits_used: int
    credits_blocked: int
    credits_available: int
    external_by_status: dict[str, int]
    total_tracks: int = 0
    tracks_by_genre: dict[str, int] = {}
    total_social_accounts: int = 0
    total_detections: int = 0
    detections_matched: int = 0
    detections_uncertain: int = 0
    detections_no_match: int = 0
    unique_tracks_detected: int = 0
    total_content_scanned: int = 0
    scanned_by_platform: dict[str, int] = {}
    # Publicaciones (suma de stats sociales de external_contents en el rango)
    publications_views: int = 0
    publications_likes: int = 0
    publications_comments: int = 0
    publications_shares: int = 0
    publications_interactions: int = 0  # likes+comments+shares
    publications_by_platform: dict[str, dict[str, int]] = {}
    period_start: str | None = None
    period_end: str | None = None


class UsageMetricsResponse(BaseModel):
    usage_id: UUID
    snapshots: list[dict]
