from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from backend.app.schemas.creation import CreationResponse


class PublishRequest(BaseModel):
    custom_slug: Optional[str] = Field(None, max_length=100)
    privacy: str = Field(default="public", pattern="^(public|unlisted|pin_protected)$")
    pin: Optional[str] = Field(None, min_length=4, max_length=20)
    expires_in_days: Optional[int] = Field(None, ge=1, le=365)


class PublishResponse(BaseModel):
    id: str
    creation_id: str
    slug: str
    public_url: str
    is_published: bool
    privacy: str
    has_pin: bool
    expires_at: Optional[datetime] = None
    published_at: datetime


class PublicSiteViewResponse(BaseModel):
    slug: str
    is_published: bool
    is_pin_required: bool
    privacy: str
    meta_title: str
    meta_description: str
    meta_image: Optional[str] = None
    creation: Optional[CreationResponse] = None


class PinVerifyRequest(BaseModel):
    pin: str = Field(..., min_length=1)


class SiteEventCreate(BaseModel):
    event_type: str = Field(..., max_length=50)

