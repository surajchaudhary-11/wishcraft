import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.api.v1.deps import get_db, get_current_user, get_optional_current_user
from backend.app.core.config import settings
from backend.app.core.security import hash_pin, verify_pin
from backend.app.models.user import User
from backend.app.models.creation import Creation
from backend.app.models.published_site import PublishedSite
from backend.app.models.event import SiteEvent
from backend.app.schemas.published_site import (
    PublishRequest, PublishResponse, PublicSiteViewResponse, PinVerifyRequest, SiteEventCreate
)
from backend.app.api.v1.endpoints.creations import _to_creation_response

router = APIRouter()


def _slugify(text: str) -> str:
    """Generate a clean URL slug from a name."""
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-") or "celebration"


def resolve_public_url(slug: str) -> str:
    """
    Safely construct the public celebration URL using the validated, configured frontend origin.
    Never uses arbitrary untrusted headers or localhost in production.
    """
    base = settings.effective_frontend_url
    return f"{base}/wish/{slug}"


def _generate_unique_slug(base_name: str, occasion: str, db: Session) -> str:
    """Generate a unique, collision-resistant slug like sophia-birthday-a8f31c."""
    clean_name = _slugify(base_name)
    clean_occ = _slugify(occasion)
    for _ in range(10):
        unique_suffix = secrets.token_hex(3)
        slug = f"{clean_name}-{clean_occ}-{unique_suffix}"
        existing = db.query(PublishedSite).filter(PublishedSite.slug == slug).first()
        if not existing:
            return slug
    # Fallback to random token
    return f"wish-{secrets.token_hex(6)}"


@router.post("/publish/{creation_id}", response_model=PublishResponse)
def publish_creation(
    creation_id: str,
    pub_in: PublishRequest,
    request: Request,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Publish a celebration website.
    Generates a permanent, collision-resistant public slug and returns the public URL.
    """
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
        # If guest creation and user is now authenticated, claim ownership
        if current_user:
            creation.owner_id = current_user.id

    # Validate minimal required fields
    if not creation.recipient_name or not creation.recipient_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipient name is required before publishing."
        )
    if not creation.message or not creation.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Celebration message is required before publishing."
        )

    # Determine or generate slug
    existing_pub = db.query(PublishedSite).filter(PublishedSite.creation_id == creation.id).first()
    if existing_pub and not pub_in.custom_slug:
        slug = existing_pub.slug
    elif pub_in.custom_slug:
        slug = _slugify(pub_in.custom_slug)
        # Check collision with other creations
        coll = db.query(PublishedSite).filter(
            PublishedSite.slug == slug, PublishedSite.creation_id != creation.id
        ).first()
        if coll:
            slug = f"{slug}-{secrets.token_hex(2)}"
    else:
        slug = _generate_unique_slug(creation.recipient_name, creation.occasion, db)

    # PIN hashing if enabled
    pin_hash = None
    if pub_in.privacy == "pin_protected":
        if not pub_in.pin or len(pub_in.pin.strip()) < 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A PIN code with at least 4 characters is required for PIN-protected celebrations."
            )
        pin_hash = hash_pin(pub_in.pin.strip())

    # Expiration calculation
    expires_at = None
    if pub_in.expires_in_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=pub_in.expires_in_days)

    if existing_pub:
        existing_pub.slug = slug
        existing_pub.is_published = True
        existing_pub.privacy = pub_in.privacy
        existing_pub.pin_hash = pin_hash
        existing_pub.expires_at = expires_at
        existing_pub.updated_at = datetime.now(timezone.utc)
        pub_record = existing_pub
    else:
        pub_record = PublishedSite(
            creation_id=creation.id,
            slug=slug,
            is_published=True,
            privacy=pub_in.privacy,
            pin_hash=pin_hash,
            expires_at=expires_at
        )
        db.add(pub_record)

    creation.status = "published"
    creation.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pub_record)

    public_url = resolve_public_url(pub_record.slug)

    return PublishResponse(
        id=pub_record.id,
        creation_id=creation.id,
        slug=pub_record.slug,
        public_url=public_url,
        is_published=pub_record.is_published,
        privacy=pub_record.privacy,
        has_pin=bool(pub_record.pin_hash),
        expires_at=pub_record.expires_at,
        published_at=pub_record.published_at
    )


@router.post("/unpublish/{creation_id}")
def unpublish_creation(
    creation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unpublish a celebration website so the public link becomes inactive."""
    creation = db.query(Creation).filter(Creation.id == creation_id).first()
    if not creation or (creation.owner_id and creation.owner_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    pub = db.query(PublishedSite).filter(PublishedSite.creation_id == creation.id).first()
    if pub:
        pub.is_published = False
        pub.updated_at = datetime.now(timezone.utc)

    creation.status = "draft"
    creation.updated_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Celebration unpublished successfully. Public link is now inactive."}


@router.get("/sites/{slug}", response_model=PublicSiteViewResponse)
def get_public_site(slug: str, db: Session = Depends(get_db)):
    """
    Public celebration site endpoint accessible to any visitor.
    Does NOT require creator authentication.
    """
    pub = db.query(PublishedSite).filter(PublishedSite.slug == slug.lower().strip()).first()
    if not pub or not pub.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration website not found or has been unpublished by the creator."
        )

    # Check expiration
    if pub.expires_at and pub.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="This celebration page has reached its scheduled expiration date."
        )

    # Increment view counter
    pub.visits_count += 1
    db.commit()

    creation = pub.creation
    meta_title = f"{creation.recipient_name}'s {creation.occasion.capitalize()} Celebration | WishCraft"
    meta_desc = f"A personalized celebration created with love for {creation.recipient_name}."
    meta_img = creation.photo_url or None

    # Check if PIN is required
    is_pin_required = bool(pub.pin_hash and pub.privacy == "pin_protected")

    return PublicSiteViewResponse(
        slug=pub.slug,
        is_published=pub.is_published,
        is_pin_required=is_pin_required,
        privacy=pub.privacy,
        meta_title=meta_title,
        meta_description=meta_desc,
        meta_image=meta_img,
        creation=_to_creation_response(creation) if not is_pin_required else None
    )


@router.post("/sites/{slug}/verify-pin", response_model=PublicSiteViewResponse)
def verify_site_pin(slug: str, req: PinVerifyRequest, db: Session = Depends(get_db)):
    """Verify PIN for protected celebration site and return celebration content."""
    pub = db.query(PublishedSite).filter(PublishedSite.slug == slug.lower().strip()).first()
    if not pub or not pub.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Celebration not found."
        )

    if not pub.pin_hash:
        # Not PIN protected, return directly
        return get_public_site(slug, db)

    if not verify_pin(req.pin, pub.pin_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect celebration PIN code. Please try again."
        )

    creation = pub.creation
    return PublicSiteViewResponse(
        slug=pub.slug,
        is_published=pub.is_published,
        is_pin_required=False,
        privacy=pub.privacy,
        meta_title=f"{creation.recipient_name}'s Celebration",
        meta_description=f"A personalized celebration for {creation.recipient_name}.",
        meta_image=creation.photo_url or None,
        creation=_to_creation_response(creation)
    )


@router.post("/sites/{slug}/event")
def record_site_event(slug: str, event_in: SiteEventCreate, request: Request, db: Session = Depends(get_db)):
    """Log an anonymous interaction event for creator celebration metrics."""
    pub = db.query(PublishedSite).filter(PublishedSite.slug == slug.lower().strip()).first()
    if not pub or not pub.is_published:
        return {"status": "ignored"}

    event = SiteEvent(
        published_site_id=pub.id,
        event_type=event_in.event_type[:50]
    )
    db.add(event)
    db.commit()
    return {"status": "recorded"}

