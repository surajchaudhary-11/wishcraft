import io
import time
from PIL import Image
from fastapi.testclient import TestClient

def create_test_image(format="PNG", size=(120, 120), color=(255, 105, 180)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    return buf.getvalue()

def test_full_user_journey_and_security(client: TestClient):
    timestamp = int(time.time())
    user1_email = f"creator_{timestamp}@example.com"
    user2_email = f"intruder_{timestamp}@example.com"
    password = "CelebrationPassword99!"

    # 1. Register User 1
    reg_res = client.post("/api/v1/auth/register", json={
        "email": user1_email,
        "password": password,
        "display_name": "Sophia Admin"
    })
    assert reg_res.status_code == 201
    token1 = reg_res.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # 2. Upload permanent photos
    img1_bytes = create_test_image("PNG", (200, 200), (244, 63, 94))
    img2_bytes = create_test_image("JPEG", (300, 300), (192, 132, 252))
    
    up1 = client.post("/api/v1/uploads", files={"file": ("photo1.png", img1_bytes, "image/png")})
    assert up1.status_code == 201
    photo1_url = up1.json()["url"]

    up2 = client.post("/api/v1/uploads", files={"file": ("photo2.jpg", img2_bytes, "image/jpeg")})
    assert up2.status_code == 201
    photo2_url = up2.json()["url"]

    # 3. Create Draft Celebration
    payload = {
        "occasion": "birthday",
        "recipient_name": "Sophia Loren",
        "sender_name": "Marcus & Danielle",
        "relationship": "Friend",
        "message": "Wishing you the sweetest, brightest milestone birthday!",
        "tone": "Heartfelt",
        "template_id": "blush-celebration",
        "color_scheme": "rose",
        "photo_url": photo1_url,
        "enable_confetti": True,
        "enable_floating_hearts": True,
        "enable_sound_demo": True,
        "photo_memories": [
            {"url": photo1_url, "caption": "Paris 2024"},
            {"url": photo2_url, "caption": "Sunset laugh"}
        ]
    }
    create_res = client.post("/api/v1/creations", headers=headers1, json=payload)
    assert create_res.status_code == 201
    creation_id = create_res.json()["id"]

    # 4. Autosave Update
    update_res = client.put(f"/api/v1/creations/{creation_id}", headers=headers1, json={
        "message": "UPDATED MESSAGE: Endless laughter and sweet adventures!",
        "color_scheme": "champagne"
    })
    assert update_res.status_code == 200
    assert "UPDATED MESSAGE" in update_res.json()["message"]

    # 5. Publish with PIN Protection
    pub_res = client.post(f"/api/v1/public/publish/{creation_id}", headers=headers1, json={
        "privacy": "pin_protected",
        "pin": "2468"
    })
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # 6. Unauthenticated visitor access: PIN protection verification
    anon_site = client.get(f"/api/v1/public/sites/{slug}")
    assert anon_site.status_code == 200
    assert anon_site.json()["is_pin_required"] is True
    assert anon_site.json()["creation"] is None  # Never leak content before PIN!

    # 7. PIN Verification
    wrong_pin = client.post(f"/api/v1/public/sites/{slug}/verify-pin", json={"pin": "0000"})
    assert wrong_pin.status_code == 401

    correct_pin = client.post(f"/api/v1/public/sites/{slug}/verify-pin", json={"pin": "2468"})
    assert correct_pin.status_code == 200
    assert correct_pin.json()["creation"]["recipient_name"] == "Sophia Loren"

    # 8. IDOR Prevention: User 2 cannot access or modify User 1's creation
    reg2_res = client.post("/api/v1/auth/register", json={
        "email": user2_email,
        "password": password,
        "display_name": "Intruder User"
    })
    token2 = reg2_res.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    assert client.get(f"/api/v1/creations/{creation_id}", headers=headers2).status_code == 404
    assert client.put(f"/api/v1/creations/{creation_id}", headers=headers2, json={"recipient_name": "Hacked"}).status_code == 404
    assert client.delete(f"/api/v1/creations/{creation_id}", headers=headers2).status_code == 404
    assert client.post(f"/api/v1/public/unpublish/{creation_id}", headers=headers2).status_code == 404

    # 9. Unpublish Celebration
    unpub_res = client.post(f"/api/v1/public/unpublish/{creation_id}", headers=headers1)
    assert unpub_res.status_code == 200
    assert client.get(f"/api/v1/public/sites/{slug}").status_code == 404

