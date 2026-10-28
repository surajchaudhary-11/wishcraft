from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.app.api.v1.deps import get_db
from backend.app.models.template import Template
from backend.app.schemas.template import TemplateResponse

router = APIRouter()

SEED_TEMPLATES = [
    {
        "id": "blush-celebration",
        "name": "Blush Celebration",
        "style": "Elegant",
        "occasion": "birthday",
        "description": "Soft petal pinks, editorial serif typography, delicate floral flourishes and golden confetti.",
        "long_description": "A dreamy, high-fashion celebration template featuring romantic blush palettes, silky soft shadows, celebratory floral motifs, and a graceful interactive birthday card reveal.",
        "accent_color": "#E11D48",
        "badge_text": "Most Popular",
        "thumbnail": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=80",
        "features": ["Floating petal animations", "Interactive card envelope", "Confetti cannon trigger", "Serif editorial styling"],
        "color_variations": [
            {"id": "rose", "name": "Rose Quartz", "hex": "#E11D48", "bgClass": "bg-rose-500"},
            {"id": "lavender", "name": "Soft Lilac", "hex": "#A855F7", "bgClass": "bg-purple-500"},
            {"id": "champagne", "name": "Warm Cream", "hex": "#D97706", "bgClass": "bg-amber-600"}
        ],
        "default_wish": {
            "recipientName": "Sophia Loren",
            "senderName": "Marcus & Friends",
            "message": "Happy Birthday, gorgeous! May this year bring you as much joy, endless laughter, and boundless beauty as you bring into our lives every single day.",
            "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "midnight-surprise",
        "name": "Midnight Surprise",
        "style": "Romantic",
        "occasion": "birthday",
        "description": "Deep plum and obsidian backdrop with glowing violet stars, neon highlights, and dramatic card reveal.",
        "long_description": "An atmospheric night-sky luxury theme with twinkling stars, purple neon glows, and a dramatic 'tap to ignite the sky' celebration reveal.",
        "accent_color": "#C084FC",
        "badge_text": "Vibrant Glow",
        "thumbnail": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
        "features": ["Dark mode luxury glow", "Interactive starry reveal", "Neon typography shimmer", "Music rhythm visualizer demo"],
        "color_variations": [
            {"id": "plum", "name": "Midnight Plum", "hex": "#854C7B", "bgClass": "bg-plum-600"},
            {"id": "electric-violet", "name": "Electric Violet", "hex": "#9333EA", "bgClass": "bg-purple-600"},
            {"id": "emerald-night", "name": "Neon Emerald", "hex": "#10B981", "bgClass": "bg-emerald-600"}
        ],
        "default_wish": {
            "recipientName": "Alex Mercer",
            "senderName": "Elena & The Crew",
            "message": "To the person who shines brighter than city lights at 2 AM. Wishing you an electrifying year ahead full of groundbreaking wins and wild adventures!",
            "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "cute-playful",
        "name": "Cute & Playful",
        "style": "Playful",
        "occasion": "birthday",
        "description": "Bouncy candy pastels, playful bubble stickers, and an interactive birthday cake where you can blow out candles!",
        "long_description": "Pure fun and smiles! Featuring cheerful candy tones, whimsical doodle badges, confetti poppers, and a magical interactive birthday cake where the recipient can click to blow out candles.",
        "accent_color": "#F43F5E",
        "badge_text": "Interactive Cake",
        "thumbnail": "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=700&q=80",
        "features": ["Blowable interactive candles", "Bouncing celebration stickers", "Chunky bubble buttons", "Party horn sound demo"],
        "color_variations": [
            {"id": "bubblegum", "name": "Bubblegum", "hex": "#F43F5E", "bgClass": "bg-rose-500"},
            {"id": "sunshine", "name": "Sunshine Coral", "hex": "#FB923C", "bgClass": "bg-orange-400"},
            {"id": "minty", "name": "Mint Confetti", "hex": "#14B8A6", "bgClass": "bg-teal-500"}
        ],
        "default_wish": {
            "recipientName": "Mia Chen",
            "senderName": "Your Favorite Sister Lily",
            "message": "Happy Birthday to my favorite human bean! 🎂 Blow out the candles and make a mega wish — you deserve all the cake, joy, and puppy hugs in the world!",
            "photoUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "memory-lane",
        "name": "Memory Lane",
        "style": "Photo Gallery",
        "occasion": "birthday",
        "description": "An editorial scrapbook with polaroid film cards, vintage washi tape, and an interactive photo memory carousel.",
        "long_description": "Created for best friends and couples who have hundreds of special moments. Features vintage scrapbook aesthetics, taped polaroid memories, and a warm nostalgic layout.",
        "accent_color": "#D97706",
        "badge_text": "Multi-Photo",
        "thumbnail": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=80",
        "features": ["Polaroid photo frames", "Interactive memory gallery", "Scrapbook handwritten notes", "Memory timeline moments"],
        "color_variations": [
            {"id": "parchment", "name": "Warm Sepia", "hex": "#D97706", "bgClass": "bg-amber-600"},
            {"id": "sage", "name": "Vintage Sage", "hex": "#059669", "bgClass": "bg-emerald-600"},
            {"id": "terracotta", "name": "Terracotta", "hex": "#EA580C", "bgClass": "bg-orange-600"}
        ],
        "default_wish": {
            "recipientName": "Chloe Bennett",
            "senderName": "Danielle & Noah",
            "message": "Looking through these memories reminds us of just how lucky we are to do life with you. From late-night road trips to quiet coffee mornings, here is to a million more memories together.",
            "photoUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "minimal-elegance",
        "name": "Minimal Elegance",
        "style": "Minimal",
        "occasion": "birthday",
        "description": "Pure architectural white, generous negative space, refined luxury typography, and subtle metallic borders.",
        "long_description": "For those who adore timeless Scandinavian and luxury fashion aesthetics. No loud clutter — just immaculate proportions, bespoke typography, and a refined celebration touch.",
        "accent_color": "#1E293B",
        "badge_text": "Timeless Clean",
        "thumbnail": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80",
        "features": ["Minimalist luxury borders", "Restrained gold foil accents", "Clean typography hierarchy", "Expandable secret message"],
        "color_variations": [
            {"id": "charcoal", "name": "Onyx & Crisp White", "hex": "#0F172A", "bgClass": "bg-slate-900"},
            {"id": "taupe", "name": "Warm Linen", "hex": "#78716C", "bgClass": "bg-stone-500"},
            {"id": "slate", "name": "Midnight Navy", "hex": "#1E3A8A", "bgClass": "bg-blue-900"}
        ],
        "default_wish": {
            "recipientName": "Julian Vance",
            "senderName": "With admiration, Claire",
            "message": "Celebrating another year of your wisdom, generosity, and effortless grace. May this milestone chapter bring you quiet fulfillment and extraordinary breakthroughs.",
            "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "love-letter",
        "name": "Love Letter",
        "style": "Romantic",
        "occasion": "romance",
        "description": "Intimate wax-sealed envelope that opens on click, floating heart particles, and handwritten script.",
        "long_description": "An ultra-romantic surprise website modeled after a sealed love letter. Click the wax seal to watch the parchment letter smoothly unfold with your heartfelt message and floating hearts.",
        "accent_color": "#E11D48",
        "badge_text": "Wax Seal Reveal",
        "thumbnail": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80",
        "features": ["Interactive wax seal opening", "Floating heart burst effect", "Handwritten letter font", "Romantic audio demo player"],
        "color_variations": [
            {"id": "crimson", "name": "Velvet Rose", "hex": "#BE123C", "bgClass": "bg-rose-700"},
            {"id": "berry", "name": "Wild Berry", "hex": "#831843", "bgClass": "bg-pink-900"},
            {"id": "coral", "name": "Sunset Peach", "hex": "#F43F5E", "bgClass": "bg-rose-500"}
        ],
        "default_wish": {
            "recipientName": "Amara",
            "senderName": "Forever yours, Lucas",
            "message": "Every day with you feels like a gift I never knew I was waiting for. You bring warmth to every morning and magic to every evening. Happy Birthday, my love.",
            "photoUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "retro-party",
        "name": "Retro Party",
        "style": "Retro",
        "occasion": "birthday",
        "description": "Vibrant pop-art patterns, bold neo-brutalist borders, checkered badges, and retro disco sparkle vibes.",
        "long_description": "High-energy retro aesthetic inspired by 90s party flyers and modern neo-brutalism. Features vibrant gradient borders, bouncy stickers, and celebratory party confetti.",
        "accent_color": "#7C3AED",
        "badge_text": "Party Pop",
        "thumbnail": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80",
        "features": ["Neo-brutalist drop shadows", "Retro party badge stickers", "Dynamic disco sparkles", "Instant party mode button"],
        "color_variations": [
            {"id": "electric-violet", "name": "Retro Violet", "hex": "#7C3AED", "bgClass": "bg-violet-600"},
            {"id": "acid-yellow", "name": "Hyper Pop Yellow", "hex": "#EAB308", "bgClass": "bg-yellow-500"},
            {"id": "cyan-punch", "name": "Cyan Blast", "hex": "#06B6D4", "bgClass": "bg-cyan-500"}
        ],
        "default_wish": {
            "recipientName": "Sammy Taylor",
            "senderName": "The High School Gang",
            "message": "ANOTHER YEAR OLDER, NEVER GROWING UP! Grab the disco ball, turn the tunes to maximum, and let us celebrate the coolest human in the room today!",
            "photoUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        "id": "golden-moments",
        "name": "Golden Moments",
        "style": "Elegant",
        "occasion": "birthday",
        "description": "Black velvet luxury with liquid champagne gold borders, shimmer sparkles, and prestige milestone typography.",
        "long_description": "An opulent celebratory design made for milestone birthdays (21st, 30th, 50th) and landmark achievements. Features champagne bubble animations, gold foil embossing, and celebratory toasts.",
        "accent_color": "#F59E0B",
        "badge_text": "Milestone VIP",
        "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80",
        "features": ["Liquid gold shimmer effect", "Milestone badge counter", "Interactive champagne toast", "Prestige dark & gold luxury"],
        "color_variations": [
            {"id": "royal-gold", "name": "Champagne Gold", "hex": "#F59E0B", "bgClass": "bg-amber-500"},
            {"id": "bronze", "name": "Antique Bronze", "hex": "#B45309", "bgClass": "bg-amber-700"},
            {"id": "platinum", "name": "Icy Platinum", "hex": "#64748B", "bgClass": "bg-slate-500"}
        ],
        "default_wish": {
            "recipientName": "David Sterling",
            "senderName": "The Sterling Family & Colleagues",
            "message": "Wishing you a magnificent milestone celebration! May this landmark year stand as a testament to your legacy, kindness, and unyielding inspiration to us all.",
            "photoUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
        }
    }
]


def ensure_templates_seeded(db: Session):
    """Seed database with all 8 celebration templates if empty."""
    count = db.query(Template).count()
    if count == 0:
        for tpl in SEED_TEMPLATES:
            t = Template(
                id=tpl["id"],
                name=tpl["name"],
                style=tpl["style"],
                occasion=tpl["occasion"],
                description=tpl["description"],
                long_description=tpl["long_description"],
                accent_color=tpl["accent_color"],
                badge_text=tpl["badge_text"],
                thumbnail=tpl["thumbnail"],
                features=tpl["features"],
                color_variations=tpl["color_variations"],
                default_wish=tpl["default_wish"],
                is_active=True,
                is_premium=False
            )
            db.add(t)
        db.commit()


@router.get("", response_model=List[TemplateResponse])
def get_templates(
    occasion: Optional[str] = None,
    style: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List celebration templates with optional occasion and style filtering."""
    ensure_templates_seeded(db)
    query = db.query(Template).filter(Template.is_active == True)
    if occasion and occasion.lower() != "all":
        query = query.filter(Template.occasion == occasion.lower())
    if style and style.lower() != "all styles":
        query = query.filter(Template.style.ilike(style))
    return query.all()


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(template_id: str, db: Session = Depends(get_db)):
    """Fetch details and capabilities for a specific template."""
    ensure_templates_seeded(db)
    tpl = db.query(Template).filter(Template.id == template_id, Template.is_active == True).first()
    if not tpl:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with id '{template_id}' was not found."
        )
    return tpl

