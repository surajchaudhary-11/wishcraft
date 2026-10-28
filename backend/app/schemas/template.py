from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class ColorVariation(BaseModel):
    id: str
    name: str
    hex: str
    bgClass: str


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    style: str
    occasion: str
    description: str
    long_description: str
    accent_color: str
    badge_text: str
    thumbnail: str
    features: List[str]
    color_variations: List[ColorVariation]
    default_wish: Dict[str, Any]
    is_active: bool
    is_premium: bool
