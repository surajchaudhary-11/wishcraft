from typing import List, Optional
from pydantic import BaseModel, Field


class AIMessageRequest(BaseModel):
    occasion: str = Field(default="birthday", max_length=50)
    recipient_name: str = Field(..., min_length=1, max_length=100)
    relationship: str = Field(default="Friend", max_length=50)
    tone: str = Field(default="Heartfelt", max_length=50)
    length: str = Field(default="medium", pattern="^(short|medium|long)$")
    extra_context: Optional[str] = Field(None, max_length=500)


class AIMessageResponse(BaseModel):
    suggestions: List[str]
    provider: str
    recipient_name: str
    tone: str

