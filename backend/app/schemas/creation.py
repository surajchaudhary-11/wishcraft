from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict


class PhotoMemoryItem(BaseModel):
    id: Optional[str] = None
    asset_id: Optional[str] = None
    url: str
    caption: Optional[str] = None
    display_order: int = 0


class CreationBase(BaseModel):
    occasion: str = "birthday"
    recipient_name: str = Field(default="", max_length=100)
    sender_name: str = Field(default="", max_length=100)
    relationship: str = Field(default="Friend", max_length=50)
    message: str = Field(default="")
    tone: str = Field(default="Heartfelt", max_length=50)
    template_id: str = Field(default="blush-celebration", max_length=64)
    color_scheme: str = Field(default="default", max_length=50)
    photo_url: str = Field(default="")
    enable_confetti: bool = True
    enable_floating_hearts: bool = True
    enable_sound_demo: bool = True
    is_favorite: bool = False
    customization: Dict[str, Any] = Field(default_factory=dict)
    photo_memories: List[PhotoMemoryItem] = Field(default_factory=list)


class CreationCreate(CreationBase):
    pass


class CreationUpdate(BaseModel):
    occasion: Optional[str] = None
    recipient_name: Optional[str] = None
    sender_name: Optional[str] = None
    relationship: Optional[str] = None
    message: Optional[str] = None
    tone: Optional[str] = None
    template_id: Optional[str] = None
    color_scheme: Optional[str] = None
    photo_url: Optional[str] = None
    enable_confetti: Optional[bool] = None
    enable_floating_hearts: Optional[bool] = None
    enable_sound_demo: Optional[bool] = None
    is_favorite: Optional[bool] = None
    status: Optional[str] = None
    customization: Optional[Dict[str, Any]] = None
    photo_memories: Optional[List[PhotoMemoryItem]] = None


class PublishedSiteBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    is_published: bool
    privacy: str
    has_pin: bool
    published_at: datetime
    visits_count: int = 0


class CreationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: Optional[str] = None
    guest_token: Optional[str] = None
    occasion: str
    recipient_name: str
    sender_name: str
    relationship: str
    message: str
    tone: str
    template_id: str
    color_scheme: str
    photo_url: str
    enable_confetti: bool
    enable_floating_hearts: bool
    enable_sound_demo: bool
    is_favorite: bool
    status: str
    customization: Dict[str, Any]
    photo_memories: List[PhotoMemoryItem]
    published_site: Optional[PublishedSiteBrief] = None
    created_at: datetime
    updated_at: datetime
