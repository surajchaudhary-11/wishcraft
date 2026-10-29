from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api.v1.deps import get_db, get_current_user, get_optional_current_user
from backend.app.models.user import User
import os
import logging
from backend.app.models.creation import Creation, CreationPhoto
from backend.app.models.published_site import PublishedSite
from backend.app.models.event import SiteEvent
from backend.app.core.config import settings

logger = logging.getLogger(__name__)
from backend.app.schemas.creation import (
    CreationCreate, CreationUpdate, CreationResponse, PhotoMemoryItem, PublishedSiteBrief
)

router = APIRouter()


def _to_creation_response(creation: Creation) -> CreationResponse:
    """Helper to convert SQLAlchemy model to Pydantic response."""
    photos = [
        PhotoMemoryItem(
            id=p.id,
            asset_id=p.asset_id,
            url=p.url,
            caption=p.caption,
            display_order=p.display_order
        )
        for p in creation.photos
    ]

    pub_brief = None
    if creation.published_site:
        pub_brief = PublishedSiteBrief(
            id=creation.published_site.id,
            slug=creation.published_site.slug,
            is_published=creation.published_site.is_published,
            privacy=creation.published_site.privacy,
            has_pin=bool(creation.published_site.pin_hash),
            published_at=creation.published_site.published_at,
            visits_count=creation.published_site.visits_count
        )

    return CreationResponse(
        id=creation.id,
        owner_id=creation.owner_id,
        occasion=creation.occasion,
        recipient_name=creation.recipient_name,
        sender_name=creation.sender_name,
        relationship=creation.relationship_type,
        message=creation.message,
        tone=creation.tone,
        template_id=creation.template_id,
        color_scheme=creation.color_scheme,
        photo_url=creation.photo_url,
        enable_confetti=creation.enable_confetti,
        enable_floating_hearts=creation.enable_floating_hearts,
        enable_sound_demo=creation.enable_sound_demo,
        is_favorite=creation.is_favorite,
        status=creation.status,
        customization=creation.customization or {},
        photo_memories=photos,
        published_site=pub_brief,
        created_at=creation.created_at,
        updated_at=creation.updated_at
    )


@router.post("", response_model=CreationResponse, status_code=status.HTTP_201_CREATED)
def create_creation(
    creation_in: CreationCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Create a new celebration draft."""
    owner_id = current_user.id if current_user else None
    
    creation = Creation(
        owner_id=owner_id,
        occasion=creation_in.occasion,
        recipient_name=creation_in.recipient_name,
        sender_name=creation_in.sender_name,
        relationship_type=creation_in.relationship,
        message=creation_in.message,
        tone=creation_in.tone,
        template_id=creation_in.template_id,
        color_scheme=creation_in.color_scheme,
        photo_url=creation_in.photo_url,
        enable_confetti=creation_in.enable_confetti,
        enable_floating_hearts=creation_in.enable_floating_hearts,
        enable_sound_demo=creation_in.enable_sound_demo,
        is_favorite=creation_in.is_favorite,
        status="draft",
        customization=creation_in.customization or {}
    )
    db.add(creation)
    db.flush()

    # Add photo memories
    for idx, mem in enumerate(creation_in.photo_memories):
        photo = CreationPhoto(
            creation_id=creation.id,
            asset_id=mem.asset_id or f"mem-{idx}",
            url=mem.url,
            caption=mem.caption,
            display_order=mem.display_order if mem.display_order is not None else idx
        )
        db.add(photo)

    db.commit()
    db.refresh(creation)
    return _to_creation_response(creation)


@router.get("", response_model=List[CreationResponse])
def list_creations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all celebrations owned by the authenticated user."""
    creations = (
        db.query(Creation)
        .filter(Creation.owner_id == current_user.id)
        .order_by(Creation.updated_at.desc())
        .all()
    )
    return [_to_creation_response(c) for c in creations]


@router.get("/{creation_id}", response_model=CreationResponse)
def get_creation(
    creation_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Get single celebration draft after validating ownership."""
    creation = db.query(Creation).filter(Creation.id == creation_id).first()
    if not creation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    # Ownership enforcement: if creation has an owner, requester must match owner
    if creation.owner_id:
        if not current_user or current_user.id != creation.owner_id:
            # Conceal existence from unauthorized users
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Celebration not found."
            )

    return _to_creation_response(creation)


@router.put("/{creation_id}", response_model=CreationResponse)
def update_creation(
    creation_id: str,
    creation_in: CreationUpdate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Update celebration details and sync photo memories."""
    creation = db.query(Creation).filter(Creation.id == creation_id).first()
    if not creation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    # Ownership check
    if creation.owner_id:
        if not current_user or current_user.id != creation.owner_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Celebration not found."
            )
    else:
        # If guest creation and user is now signed in, claim ownership
        if current_user:
            creation.owner_id = current_user.id

    # Update fields if provided
    update_data = creation_in.model_dump(exclude_unset=True)
    if "photo_memories" in update_data:
        memories = update_data.pop("photo_memories")
        # Replace photos
        db.query(CreationPhoto).filter(CreationPhoto.creation_id == creation.id).delete()
        for idx, mem in enumerate(memories):
            photo = CreationPhoto(
                creation_id=creation.id,
                asset_id=mem.get("asset_id") or f"mem-{idx}",
                url=mem["url"],
                caption=mem.get("caption"),
                display_order=mem.get("display_order", idx)
            )
            db.add(photo)

    for field, val in update_data.items():
        if field == "relationship":
            setattr(creation, "relationship_type", val)
        elif hasattr(creation, field):
            setattr(creation, field, val)

    creation.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(creation)
    return _to_creation_response(creation)


@router.delete("/{creation_id}", status_code=status.HTTP_200_OK)
def delete_creation(
    creation_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete celebration draft and all related media and published links.
    Immediately unpublishes and removes any public URLs so they return 404.
    """
    creation = db.query(Creation).filter(Creation.id == creation_id).first()
    if not creation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    # Ownership enforcement: if creation has an owner, requester must match owner
    if creation.owner_id:
        if not current_user or current_user.id != creation.owner_id:
            # Conceal existence from unauthorized users
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Celebration not found."
            )

    # Explicitly clean up site events and mark published site inactive
    if creation.published_site:
        creation.published_site.is_published = False
        db.query(SiteEvent).filter(SiteEvent.published_site_id == creation.published_site.id).delete(synchronize_session=False)

    # Clean up local uploads if applicable
    for photo in creation.photos:
        if photo.url and photo.url.startswith("/api/v1/uploads/"):
            filename = photo.url.replace("/api/v1/uploads/", "")
            local_path = os.path.join(settings.UPLOAD_DIR, filename)
            if os.path.exists(local_path):
                try:
                    os.remove(local_path)
                except Exception as e:
                    logger.warning(f"Failed to remove uploaded photo file {local_path}: {e}")

    db.delete(creation)
    db.commit()
    return {"message": "Celebration deleted successfully. All public links have been unpublished."}


@router.post("/{creation_id}/duplicate", response_model=CreationResponse)
def duplicate_creation(
    creation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create an exact copy of an existing celebration."""
    source = db.query(Creation).filter(Creation.id == creation_id).first()
    if not source or (source.owner_id and source.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    copy = Creation(
        owner_id=current_user.id,
        occasion=source.occasion,
        recipient_name=f"{source.recipient_name} (Copy)",
        sender_name=source.sender_name,
        relationship_type=source.relationship_type,
        message=source.message,
        tone=source.tone,
        template_id=source.template_id,
        color_scheme=source.color_scheme,
        photo_url=source.photo_url,
        enable_confetti=source.enable_confetti,
        enable_floating_hearts=source.enable_floating_hearts,
        enable_sound_demo=source.enable_sound_demo,
        is_favorite=source.is_favorite,
        status="draft",
        customization=source.customization or {}
    )
    db.add(copy)
    db.flush()

    for p in source.photos:
        new_p = CreationPhoto(
            creation_id=copy.id,
            asset_id=p.asset_id,
            url=p.url,
            caption=p.caption,
            display_order=p.display_order
        )
        db.add(new_p)

    db.commit()
    db.refresh(copy)
    return _to_creation_response(copy)

