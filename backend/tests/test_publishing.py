from fastapi.testclient import TestClient


def test_publishing_and_public_access(client: TestClient, auth_headers: dict):
    # 1. Create creation
    payload = {
        "occasion": "birthday",
        "recipient_name": "Elena Fisher",
        "sender_name": "Nathan Drake",
        "relationship": "Partner",
        "message": "Happy Birthday to my partner in crime and adventures!",
        "tone": "Romantic",
        "template_id": "midnight-surprise",
        "color_scheme": "plum",
        "photo_url": "https://example.com/elena.jpg"
    }
    create_res = client.post("/api/v1/creations", headers=auth_headers, json=payload)
    creation_id = create_res.json()["id"]

    # 2. Publish creation
    pub_res = client.post(
        f"/api/v1/public/publish/{creation_id}",
        headers=auth_headers,
        json={"privacy": "public"}
    )
    assert pub_res.status_code == 200
    pub_data = pub_res.json()
    slug = pub_data["slug"]
    assert slug
    assert "wish" in pub_data["public_url"]
    assert pub_data["is_published"] is True

    # 3. Public visitor can access published site WITHOUT authentication
    public_res = client.get(f"/api/v1/public/sites/{slug}")
    assert public_res.status_code == 200
    site_data = public_res.json()
    assert site_data["slug"] == slug
    assert site_data["is_published"] is True
    assert site_data["is_pin_required"] is False
    assert site_data["creation"]["recipient_name"] == "Elena Fisher"
    assert site_data["creation"]["message"] == "Happy Birthday to my partner in crime and adventures!"

    # Sensitive fields should NOT be exposed
    assert "hashed_password" not in site_data
    assert "email" not in str(site_data)

    # 4. Record event
    event_res = client.post(
        f"/api/v1/public/sites/{slug}/event",
        json={"event_type": "candles_blown"}
    )
    assert event_res.status_code == 200

    # 5. Unpublish creation
    unpub_res = client.post(f"/api/v1/public/unpublish/{creation_id}", headers=auth_headers)
    assert unpub_res.status_code == 200

    # 6. Public access now returns 404
    public_after = client.get(f"/api/v1/public/sites/{slug}")
    assert public_after.status_code == 404


def test_pin_protected_publishing(client: TestClient, auth_headers: dict):
    # 1. Create creation
    payload = {
        "occasion": "birthday",
        "recipient_name": "Secret Celebrant",
        "sender_name": "VIP",
        "relationship": "Friend",
        "message": "Top secret birthday celebration notes!",
        "template_id": "minimal-elegance"
    }
    c_res = client.post("/api/v1/creations", headers=auth_headers, json=payload)
    c_id = c_res.json()["id"]

    # 2. Publish with PIN 4829
    pub_res = client.post(
        f"/api/v1/public/publish/{c_id}",
        headers=auth_headers,
        json={"privacy": "pin_protected", "pin": "4829"}
    )
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # 3. Public get requires PIN
    locked_res = client.get(f"/api/v1/public/sites/{slug}")
    assert locked_res.status_code == 200
    assert locked_res.json()["is_pin_required"] is True
    assert locked_res.json()["creation"] is None  # Private message is protected!

    # 4. Wrong PIN fails
    wrong_pin = client.post(f"/api/v1/public/sites/{slug}/verify-pin", json={"pin": "0000"})
    assert wrong_pin.status_code == 401

    # 5. Correct PIN succeeds and returns creation
    correct_pin = client.post(f"/api/v1/public/sites/{slug}/verify-pin", json={"pin": "4829"})
    assert correct_pin.status_code == 200
    assert correct_pin.json()["is_pin_required"] is False
    assert correct_pin.json()["creation"]["recipient_name"] == "Secret Celebrant"

