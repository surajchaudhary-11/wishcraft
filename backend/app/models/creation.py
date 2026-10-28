import uuid
from datetime import datetime, timezone
from typing import List, Optional, Any
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.session import Base


class Creation(Base):
    __tablename__ = "creations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    
    occasion: Mapped[str] = mapped_column(String(50), default="birthday", nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    sender_name: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(50), default="Friend", nullable=False)
    message: Mapped[str] = mapped_column(Text, default="", nullable=False)
    tone: Mapped[str] = mapped_column(String(50), default="Heartfelt", nullable=False)
    
    template_id: Mapped[str] = mapped_column(String(64), default="blush-celebration", nullable=False, index=True)
    color_scheme: Mapped[str] = mapped_column(String(50), default="default", nullable=False)
    photo_url: Mapped[str] = mapped_column(String(1024), default="", nullable=False)
    
    enable_confetti: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enable_floating_hearts: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    enable_sound_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)  # draft | published | archived
    customization: Mapped[Any] = mapped_column(JSON, default=dict, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    owner: Mapped[Optional["User"]] = relationship("User", back_populates="creations")
    photos: Mapped[List["CreationPhoto"]] = relationship(
        "CreationPhoto", 
        back_populates="creation", 
        cascade="all, delete-orphan", 
        order_by="CreationPhoto.display_order"
    )
    published_site: Mapped[Optional["PublishedSite"]] = relationship(
        "PublishedSite", 
        back_populates="creation", 
        uselist=False, 
        cascade="all, delete-orphan"
    )


class CreationPhoto(Base):
    __tablename__ = "creation_photos"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creation_id: Mapped[str] = mapped_column(String(36), ForeignKey("creations.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_id: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(1024), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    creation: Mapped["Creation"] = relationship("Creation", back_populates="photos")

