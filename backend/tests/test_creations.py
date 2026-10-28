from fastapi.testclient import TestClient


def test_creation_crud_and_ownership(
    client: TestClient,
    auth_headers: dict,
    other_auth_headers: dict
):
    # 1. Create a draft celebration
    payload = {
        "occasion": "birthday",
        "recipient_name": "Sophia Loren",
        "sender_name": "Marcus",
        "relationship": "Friend",
        "message": "Wishing you the happiest birthday filled with joy and sweet memories!",
        "tone": "Heartfelt",
        "template_id": "blush-celebration",
        "color_scheme": "rose",
        "photo_url": "https://example.com/photo.jpg",
        "enable_confetti": True,
        "enable_floating_hearts": True,
        "enable_sound_demo": True,
        "photo_memories": [
            {"url": "https://example.com/mem1.jpg", "caption": "Sunset laugh"},
            {"url": "https://example.com/mem2.jpg", "caption": "Road trip"}
        ]
    }
    create_res = client.post("/api/v1/creations", headers=auth_headers, json=payload)
    assert create_res.status_code == 201
    creation = create_res.json()
    creation_id = creation["id"]
    assert creation["recipient_name"] == "Sophia Loren"
    assert len(creation["photo_memories"]) == 2

    # 2. List creations for owner
    list_res = client.get("/api/v1/creations", headers=auth_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 3. Access control: other user CANNOT read creator's private draft
    other_get = client.get(f"/api/v1/creations/{creation_id}", headers=other_auth_headers)
    assert other_get.status_code == 404

    # 4. Access control: other user CANNOT update creator's draft
    other_put = client.put(
        f"/api/v1/creations/{creation_id}",
        headers=other_auth_headers,
        json={"recipient_name": "Hacked Name"}
    )
    assert other_put.status_code == 404

    # 5. Owner can update draft
    update_res = client.put(
        f"/api/v1/creations/{creation_id}",
        headers=auth_headers,
        json={"recipient_name": "Sophia Vance", "tone": "Romantic"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["recipient_name"] == "Sophia Vance"
    assert update_res.json()["tone"] == "Romantic"

    # 6. Duplicate creation
    dup_res = client.post(f"/api/v1/creations/{creation_id}/duplicate", headers=auth_headers)
    assert dup_res.status_code == 200
    assert "Copy" in dup_res.json()["recipient_name"]

    # 7. Owner deletes creation
    del_res = client.delete(f"/api/v1/creations/{creation_id}", headers=auth_headers)
    assert del_res.status_code == 200

    # 8. Get deleted creation returns 404
    get_del = client.get(f"/api/v1/creations/{creation_id}", headers=auth_headers)
    assert get_del.status_code == 404

