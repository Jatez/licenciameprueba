from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Literal


class SocialAccountResponse(BaseModel):
    id: UUID
    company_id: UUID
    platform: str
    external_account_id: str
    username: str | None
    status: str
    token_expires_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConnectAccountRequest(BaseModel):
    """Connect a social account by providing platform and username."""
    platform: str  # instagram, facebook, tiktok
    external_account_id: str
    username: str


class ScanUrlItem(BaseModel):
    url: str
    content_type: Literal["post", "reel", "story"] = "post"


class ScanUrlsRequest(BaseModel):
    """Scan real URLs for a social account — downloads audio and identifies via ACRCloud."""
    urls: list[ScanUrlItem]
