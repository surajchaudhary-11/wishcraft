import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.session import Base


class PublishedSite(Base):
    __tablename__ = "published_sites"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creation_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("creations.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    slug: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    privacy: Mapped[str] = mapped_column(String(20), default="public", nullable=False)  # public | unlisted | pin_protected
    
    pin_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    visits_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    creation: Mapped["Creation"] = relationship("Creation", back_populates="published_site")
    events: Mapped[List["SiteEvent"]] = relationship(
        "SiteEvent", back_populates="published_site", cascade="all, delete-orphan"
    )

