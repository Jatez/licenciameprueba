from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    pages: int


class ErrorResponse(BaseModel):
    detail: str
    code: str


CONTENT_TYPES = {"ig_post", "ig_reel", "ig_story", "fb_post", "fb_reel", "tiktok_video"}
PLATFORMS = {"instagram", "facebook", "tiktok"}
