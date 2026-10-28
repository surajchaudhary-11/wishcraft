from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from backend.app.db.session import Base


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    style: Mapped[str] = mapped_column(String(50), nullable=False)
    occasion: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    long_description: Mapped[str] = mapped_column(Text, nullable=False)
    accent_color: Mapped[str] = mapped_column(String(20), nullable=False)
    badge_text: Mapped[str] = mapped_column(String(50), nullable=False)
    thumbnail: Mapped[str] = mapped_column(String(512), nullable=False)
    features: Mapped[Any] = mapped_column(JSON, default=list, nullable=False)
    color_variations: Mapped[Any] = mapped_column(JSON, default=list, nullable=False)
    default_wish: Mapped[Any] = mapped_column(JSON, default=dict, nullable=False)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

