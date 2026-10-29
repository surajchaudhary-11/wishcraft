import pytest
from fastapi.testclient import TestClient


def test_owner_deletion_unpublishes_public_url(client: TestClient, auth_headers: dict):
    # 1. Owner creates celebration
    c_res = client.post("/api/v1/creations", headers=auth_headers, json={
        "occasion": "birthday",
        "recipient_name": "Deletion Target",
        "sender_name": "Test Suite",
        "message": "Testing that deletion unpublishes the public celebration site immediately.",
        "template_id": "blush-celebration"
    })
    assert c_res.status_code == 201
    creation_id = c_res.json()["id"]

    # 2. Owner publishes celebration
    pub_res = client.post(f"/api/v1/public/publish/{creation_id}", headers=auth_headers, json={
        "privacy": "public"
    })
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # 3. Record an event and verify public site is accessible (200 OK)
    client.post(f"/api/v1/public/sites/{slug}/event", json={"event_type": "page_view"})
    site_res = client.get(f"/api/v1/public/sites/{slug}")
    assert site_res.status_code == 200
    assert "no-store" in site_res.headers.get("Cache-Control", "")
    assert site_res.json()["slug"] == slug

    # 4. Owner deletes the creation (authenticated-owner deletion)
    del_res = client.delete(f"/api/v1/creations/{creation_id}", headers=auth_headers)
    assert del_res.status_code == 200
    assert "deleted" in del_res.json()["message"].lower()

    # 5. Public URL MUST immediately return 404 with Cache-Control headers
    site_after = client.get(f"/api/v1/public/sites/{slug}")
    assert site_after.status_code == 404
    assert "no-store" in site_after.headers.get("Cache-Control", "")

    # 6. Verify creation is gone from user's dashboard and private API
    get_res = client.get(f"/api/v1/creations/{creation_id}", headers=auth_headers)
    assert get_res.status_code == 404

    list_res = client.get("/api/v1/creations", headers=auth_headers)
    assert list_res.status_code == 200
    ids = [item["id"] for item in list_res.json()]
    assert creation_id not in ids


def test_unauthorized_user_cannot_delete_creation(client: TestClient, auth_headers: dict):
    # 1. Owner creates and publishes a celebration
    c_res = client.post("/api/v1/creations", headers=auth_headers, json={
        "occasion": "anniversary",
        "recipient_name": "Protected Celebration",
        "sender_name": "Owner",
        "message": "This creation must be protected from IDOR deletion.",
        "template_id": "midnight-surprise"
    })
    assert c_res.status_code == 201
    creation_id = c_res.json()["id"]

    pub_res = client.post(f"/api/v1/public/publish/{creation_id}", headers=auth_headers, json={
        "privacy": "public"
    })
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # 2. Register an attacker (intruder)
    attacker_reg = client.post("/api/v1/auth/register", json={
        "email": "cross_user_attacker@example.com",
        "password": "AttackerPass123!",
        "display_name": "Malicious User"
    })
    assert attacker_reg.status_code == 201
    attacker_login = client.post("/api/v1/auth/login", json={
        "email": "cross_user_attacker@example.com",
        "password": "AttackerPass123!"
    })
    attacker_token = attacker_login.json()["access_token"]
    attacker_headers = {"Authorization": f"Bearer {attacker_token}"}

    # 3. Attacker attempts to delete owner's creation (cross-user access blocked)
    intruder_del = client.delete(f"/api/v1/creations/{creation_id}", headers=attacker_headers)
    assert intruder_del.status_code == 404

    # 4. Verify owner's creation remains published and intact
    site_res = client.get(f"/api/v1/public/sites/{slug}")
    assert site_res.status_code == 200

    # 5. Anonymous visitor attempts to delete owner's creation
    anon_del = client.delete(f"/api/v1/creations/{creation_id}")
    assert anon_del.status_code == 404

    site_res_after = client.get(f"/api/v1/public/sites/{slug}")
    assert site_res_after.status_code == 200


def test_guest_token_authorization_and_unauthorized_deletion_prevention(client: TestClient):
    # 1. Unauthenticated guest creates a celebration
    c_res = client.post("/api/v1/creations", json={
        "occasion": "birthday",
        "recipient_name": "Guest Security Target",
        "sender_name": "Guest Creator",
        "message": "Testing guest token security.",
        "template_id": "cute-playful"
    })
    assert c_res.status_code == 201
    c_data = c_res.json()
    creation_id = c_data["id"]
    guest_token = c_data.get("guest_token")
    assert guest_token is not None
    assert guest_token.startswith("gst_")

    # 2. Guest publishes celebration with valid guest token
    pub_res = client.post(
        f"/api/v1/public/publish/{creation_id}",
        headers={"X-Guest-Token": guest_token},
        json={"privacy": "public"}
    )
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # Verify public site is active
    site_res = client.get(f"/api/v1/public/sites/{slug}")
    assert site_res.status_code == 200

    # 3. ATTACK: Attacker knows UUID but has NO guest token -> deletion must be BLOCKED
    unauth_del = client.delete(f"/api/v1/creations/{creation_id}")
    assert unauth_del.status_code == 404

    # 4. ATTACK: Attacker uses bogus/invalid guest token -> deletion must be BLOCKED
    bad_token_del = client.delete(
        f"/api/v1/creations/{creation_id}",
        headers={"X-Guest-Token": "gst_invalid_forged_token_1234567890"}
    )
    assert bad_token_del.status_code == 404

    # 5. ATTACK: Attacker tries to unpublish without token -> unpublish must be BLOCKED
    unauth_unpub = client.post(f"/api/v1/public/unpublish/{creation_id}")
    assert unauth_unpub.status_code == 404

    # 6. ATTACK: Authenticated user tries to claim guest creation WITHOUT guest token -> BLOCKED
    reg_res = client.post("/api/v1/auth/register", json={
        "email": "unauthorized_claimer@example.com",
        "password": "ClaimerPass123!",
        "display_name": "Claimer"
    })
    assert reg_res.status_code == 201
    claim_login = client.post("/api/v1/auth/login", json={
        "email": "unauthorized_claimer@example.com",
        "password": "ClaimerPass123!"
    })
    claim_headers = {"Authorization": f"Bearer {claim_login.json()['access_token']}"}

    claim_attempt = client.put(
        f"/api/v1/creations/{creation_id}",
        headers=claim_headers,
        json={"recipient_name": "Hijacked Name"}
    )
    assert claim_attempt.status_code == 404

    # Verify site still active after all attack attempts
    assert client.get(f"/api/v1/public/sites/{slug}").status_code == 200

    # 7. LEGITIMATE GUEST DELETION: Guest uses authentic guest token -> DELETION SUCCEEDS
    valid_del = client.delete(
        f"/api/v1/creations/{creation_id}",
        headers={"X-Guest-Token": guest_token}
    )
    assert valid_del.status_code == 200

    # 8. Verify public site is now dead (HTTP 404)
    assert client.get(f"/api/v1/public/sites/{slug}").status_code == 404


def test_guest_valid_claim_with_guest_token(client: TestClient):
    # 1. Guest creates creation
    c_res = client.post("/api/v1/creations", json={
        "occasion": "birthday",
        "recipient_name": "Claiming Target",
        "sender_name": "Anonymous",
        "message": "Testing ownership claim with guest token.",
        "template_id": "minimal-elegance"
    })
    creation_id = c_res.json()["id"]
    guest_token = c_res.json()["guest_token"]

    # 2. User registers and logs in
    client.post("/api/v1/auth/register", json={
        "email": "legit_claimer@example.com",
        "password": "LegitPass123!",
        "display_name": "Legit Owner"
    })
    login_res = client.post("/api/v1/auth/login", json={
        "email": "legit_claimer@example.com",
        "password": "LegitPass123!"
    })
    auth_headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

    # 3. User claims creation by supplying valid X-Guest-Token along with Bearer token
    claim_res = client.put(
        f"/api/v1/creations/{creation_id}",
        headers={**auth_headers, "X-Guest-Token": guest_token},
        json={"recipient_name": "Claimed Sophia"}
    )
    assert claim_res.status_code == 200
    assert claim_res.json()["owner_id"] is not None

    # 4. User publishes as authenticated owner
    pub_res = client.post(
        f"/api/v1/public/publish/{creation_id}",
        headers=auth_headers,
        json={"privacy": "public"}
    )
    assert pub_res.status_code == 200
    slug = pub_res.json()["slug"]

    # 5. User deletes creation as authenticated owner (no guest token needed anymore)
    del_res = client.delete(f"/api/v1/creations/{creation_id}", headers=auth_headers)
    assert del_res.status_code == 200

    # 6. Public site is immediately inactive
    assert client.get(f"/api/v1/public/sites/{slug}").status_code == 404


def test_delete_nonexistent_creation_returns_404(client: TestClient, auth_headers: dict):
    del_res = client.delete("/api/v1/creations/00000000-0000-0000-0000-000000000000", headers=auth_headers)
    assert del_res.status_code == 404
