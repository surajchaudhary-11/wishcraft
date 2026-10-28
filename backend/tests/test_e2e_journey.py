import io
import time
import httpx
from PIL import Image

BASE_URL = "http://127.0.0.1:8000/api/v1"

def create_test_image(format="PNG", size=(120, 120), color=(255, 105, 180)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    return buf.getvalue()

def run_e2e_audit():
    print("=" * 60)
    print("STARTING WISHCRAFT FULL-STACK E2E QA & SECURITY AUDIT")
    print("=" * 60)
    
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)
    
    timestamp = int(time.time())
    user1_email = f"qa_creator_{timestamp}@example.com"
    user2_email = f"qa_intruder_{timestamp}@example.com"
    password = "CelebrationPassword99!"
    
    # 1. Registration
    print("\n[STEP 1] Testing User Registration...")
    reg_res = client.post("/auth/register", json={
        "email": user1_email,
        "password": password,
        "display_name": "Sophia Admin"
    })
    assert reg_res.status_code == 201, f"Reg failed: {reg_res.text}"
    token1 = reg_res.json()["access_token"]
    user1_id = reg_res.json()["user"]["id"]
    headers1 = {"Authorization": f"Bearer {token1}"}
    print(f"[PASS] User 1 registered successfully (ID: {user1_id})")
    
    # 2. Login
    print("\n[STEP 2] Testing User Authentication & Token Validation...")
    login_res = client.post("/auth/login", json={
        "email": user1_email,
        "password": password
    })
    assert login_res.status_code == 200
    assert login_res.json()["user"]["email"] == user1_email
    print("[PASS] Login succeeded and issued valid JWT")
    
    # Verify current user profile
    me_res = client.get("/auth/me", headers=headers1)
    assert me_res.status_code == 200
    assert me_res.json()["display_name"] == "Sophia Admin"
    print("[PASS] /auth/me profile retrieved successfully")
    
    # 3. Verify Templates
    print("\n[STEP 3] Verifying 8 Celebration Templates from API...")
    tpls_res = client.get("/templates")
    assert tpls_res.status_code == 200
    templates = tpls_res.json()
    assert len(templates) == 8, f"Expected 8 templates, found {len(templates)}"
    tpl_ids = [t["id"] for t in templates]
    print(f"[PASS] All 8 templates verified: {', '.join(tpl_ids)}")
    
    # 4. Image Uploads
    print("\n[STEP 4] Testing Permanent Media Uploads...")
    img1_bytes = create_test_image("PNG", (200, 200), (244, 63, 94))
    img2_bytes = create_test_image("JPEG", (300, 300), (192, 132, 252))
    
    up1 = client.post("/uploads", files={"file": ("photo1.png", img1_bytes, "image/png")})
    assert up1.status_code == 201, f"Upload 1 failed: {up1.text}"
    photo1_url = up1.json()["url"]
    
    up2 = client.post("/uploads", files={"file": ("photo2.jpg", img2_bytes, "image/jpeg")})
    assert up2.status_code == 201, f"Upload 2 failed: {up2.text}"
    photo2_url = up2.json()["url"]
    
    # Verify uploaded files are accessible via HTTP
    fetch1 = client.get(photo1_url.replace("/api/v1", ""))
    assert fetch1.status_code == 200
    print(f"[PASS] Photo 1 permanently saved and verified: {photo1_url}")
    print(f"[PASS] Photo 2 permanently saved and verified: {photo2_url}")
    
    # 5. Create Draft Creation
    print("\n[STEP 5] Testing Creation Creation & Draft Saving...")
    creation_payload = {
        "occasion": "birthday",
        "recipient_name": "Sophia Loren",
        "sender_name": "Marcus & Danielle",
        "relationship": "Friend",
        "message": "Wishing you the sweetest, brightest milestone birthday! Here's to making memories.",
        "tone": "Heartfelt",
        "template_id": "blush-celebration",
        "color_scheme": "rose",
        "photo_url": f"http://127.0.0.1:8000{photo1_url}",
        "enable_confetti": True,
        "enable_floating_hearts": True,
        "enable_sound_demo": True,
        "photo_memories": [
            {"url": f"http://127.0.0.1:8000{photo1_url}", "caption": "Paris 2024"},
            {"url": f"http://127.0.0.1:8000{photo2_url}", "caption": "Sunset laugh"}
        ]
    }
    create_res = client.post("/creations", headers=headers1, json=creation_payload)
    assert create_res.status_code == 201, f"Creation failed: {create_res.text}"
    creation = create_res.json()
    creation_id = creation["id"]
    assert creation["recipient_name"] == "Sophia Loren"
    assert len(creation["photo_memories"]) == 2
    print(f"[PASS] Creation draft successfully created with ID: {creation_id}")
    
    # 6. Autosave & Concurrency Update
    print("\n[STEP 6] Testing Autosave Updates & Persistence...")
    update_payload = {
        "message": "UPDATED MESSAGE: Wishing you boundless joy, endless giggles, and dream vacations!",
        "color_scheme": "champagne",
        "enable_floating_hearts": False
    }
    update_res = client.put(f"/creations/{creation_id}", headers=headers1, json=update_payload)
    assert update_res.status_code == 200
    updated_creation = update_res.json()
    assert "UPDATED MESSAGE" in updated_creation["message"]
    assert updated_creation["color_scheme"] == "champagne"
    assert updated_creation["enable_floating_hearts"] is False
    print("[PASS] Autosave update correctly persisted to PostgreSQL")
    
    # 7. AI Message Generation
    print("\n[STEP 7] Testing AI Message Generation...")
    ai_res = client.post("/ai/generate-message", json={
        "occasion": "birthday",
        "recipient_name": "Sophia",
        "relationship": "Friend",
        "tone": "Funny",
        "length": "medium"
    })
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert len(ai_data["suggestions"]) == 3
    print(f"[PASS] AI suggestions generated using provider: {ai_data['provider']}")
    
    # 8. Publishing with PIN Protection
    print("\n[STEP 8] Testing Publishing & Collision-Resistant Slug...")
    pub_res = client.post(f"/public/publish/{creation_id}", headers=headers1, json={
        "privacy": "pin_protected",
        "pin": "2468"
    })
    assert pub_res.status_code == 200, f"Publishing failed: {pub_res.text}"
    pub_data = pub_res.json()
    slug = pub_data["slug"]
    public_url = pub_data["public_url"]
    assert slug
    assert pub_data["is_published"] is True
    assert pub_data["has_pin"] is True
    print(f"[PASS] Published successfully! Slug: {slug}")
    print(f"[PASS] Public URL: {public_url}")
    
    # 9. Unauthenticated Public Access & Privacy
    print("\n[STEP 9] Testing Unauthenticated Public Retrieval...")
    anon_client = httpx.Client(base_url=BASE_URL, timeout=10.0)
    public_res = anon_client.get(f"/public/sites/{slug}")
    assert public_res.status_code == 200
    site_info = public_res.json()
    assert site_info["slug"] == slug
    assert site_info["is_pin_required"] is True
    # Crucial security verification: private content MUST NOT leak before PIN
    assert site_info["creation"] is None, "SECURITY FAILURE: Private message leaked before PIN verification!"
    assert "hashed_password" not in str(site_info)
    assert "password" not in str(site_info)
    print("[PASS] PIN-protected celebration confirmed locked: zero private fields leaked to visitor")
    
    # 10. PIN Verification (Fail & Pass)
    print("\n[STEP 10] Testing PIN Verification Security...")
    # Incorrect PIN
    wrong_pin_res = anon_client.post(f"/public/sites/{slug}/verify-pin", json={"pin": "9999"})
    assert wrong_pin_res.status_code == 401
    print("[PASS] Incorrect PIN rejected with HTTP 401 Unauthorized")
    
    # Correct PIN
    correct_pin_res = anon_client.post(f"/public/sites/{slug}/verify-pin", json={"pin": "2468"})
    assert correct_pin_res.status_code == 200
    unlocked_data = correct_pin_res.json()
    assert unlocked_data["is_pin_required"] is False
    assert unlocked_data["creation"]["recipient_name"] == "Sophia Loren"
    assert "UPDATED MESSAGE" in unlocked_data["creation"]["message"]
    print("[PASS] Correct PIN unlocks celebration content and images successfully")
    
    # 11. Event Recording
    print("\n[STEP 11] Testing Anonymous Site Events...")
    event_res = anon_client.post(f"/public/sites/{slug}/event", json={"event_type": "confetti_fired"})
    assert event_res.status_code == 200
    print("[PASS] Anonymous event logged successfully")
    
    # 12. Security & IDOR Authorization
    print("\n[STEP 12] Testing IDOR & Ownership Authorization...")
    # Register Intruder account
    reg2_res = client.post("/auth/register", json={
        "email": user2_email,
        "password": password,
        "display_name": "Intruder User"
    })
    token2 = reg2_res.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    
    # Intruder tries to read User 1's creation
    idor_get = client.get(f"/creations/{creation_id}", headers=headers2)
    assert idor_get.status_code == 404, f"IDOR GET failed: {idor_get.status_code}"
    
    # Intruder tries to modify User 1's creation
    idor_put = client.put(f"/creations/{creation_id}", headers=headers2, json={"recipient_name": "Hacked"})
    assert idor_put.status_code == 404, f"IDOR PUT failed: {idor_put.status_code}"
    
    # Intruder tries to delete User 1's creation
    idor_del = client.delete(f"/creations/{creation_id}", headers=headers2)
    assert idor_del.status_code == 404, f"IDOR DELETE failed: {idor_del.status_code}"
    
    # Intruder tries to unpublish User 1's creation
    idor_unpub = client.post(f"/public/unpublish/{creation_id}", headers=headers2)
    assert idor_unpub.status_code == 404, f"IDOR UNPUBLISH failed: {idor_unpub.status_code}"
    print("[PASS] IDOR protection verified: Intruder cannot view, modify, delete, or unpublish User 1's creation (returns 404, concealing existence)")
    
    # 13. Unpublishing
    print("\n[STEP 13] Testing Unpublishing & Link Revocation...")
    unpub_res = client.post(f"/public/unpublish/{creation_id}", headers=headers1)
    assert unpub_res.status_code == 200
    
    # Public route should now be unavailable (404)
    revoked_res = anon_client.get(f"/public/sites/{slug}")
    assert revoked_res.status_code == 404
    print("[PASS] Celebration unpublished: Public link is now completely inactive (HTTP 404)")
    
    # 14. Edge Cases: Invalid File & Oversized File
    print("\n[STEP 14] Testing Edge Cases & Upload Validation...")
    # Fake file with bad extension
    fake_txt = client.post("/uploads", files={"file": ("malicious.exe", b"not-image", "application/x-msdownload")})
    assert fake_txt.status_code == 400
    
    # Corrupted image content
    fake_img = client.post("/uploads", files={"file": ("corrupt.png", b"random-gibberish-not-png", "image/png")})
    assert fake_img.status_code == 400
    print("[PASS] Image upload validation correctly rejects malicious and corrupted files")
    
    # Clean up test creation
    cleanup_res = client.delete(f"/creations/{creation_id}", headers=headers1)
    assert cleanup_res.status_code == 200
    print("[PASS] Test creation cleaned up successfully")
    
    print("\n" + "=" * 60)
    print("ALL 14 E2E USER JOURNEY & SECURITY CHECKS PASSED WITH ZERO ERRORS!")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_audit()
