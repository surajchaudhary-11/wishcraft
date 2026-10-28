from fastapi.testclient import TestClient


def test_user_registration_and_login(client: TestClient):
    # 1. Register new user
    reg_payload = {
        "email": "newuser@example.com",
        "password": "SecretPassword123!",
        "display_name": "Marcus Aurelius"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["display_name"] == "Marcus Aurelius"

    # 2. Duplicate registration should fail
    dup_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"]

    # 3. Login with correct password
    login_res = client.post("/api/v1/auth/login", json={
        "email": "newuser@example.com",
        "password": "SecretPassword123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token

    # 4. Login with wrong password should fail
    bad_login = client.post("/api/v1/auth/login", json={
        "email": "newuser@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Fetch profile with token
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "newuser@example.com"


def test_password_change_and_reset(client: TestClient, auth_headers: dict):
    # Change password
    change_res = client.post(
        "/api/v1/auth/change-password",
        headers=auth_headers,
        json={
            "current_password": "CelebrationPass123!",
            "new_password": "BrandNewPassword456!"
        }
    )
    assert change_res.status_code == 200

    # Old password fails
    fail_res = client.post("/api/v1/auth/login", json={
        "email": "creator@example.com",
        "password": "CelebrationPass123!"
    })
    assert fail_res.status_code == 401

    # New password succeeds
    ok_res = client.post("/api/v1/auth/login", json={
        "email": "creator@example.com",
        "password": "BrandNewPassword456!"
    })
    assert ok_res.status_code == 200


def test_forgot_and_reset_password(client: TestClient, test_user):
    # Request reset token
    forgot_res = client.post("/api/v1/auth/forgot-password", json={
        "email": test_user.email
    })
    assert forgot_res.status_code == 200
    reset_token = forgot_res.json().get("reset_token")
    assert reset_token

    # Reset password with token
    reset_res = client.post("/api/v1/auth/reset-password", json={
        "token": reset_token,
        "new_password": "ResetSuccessPassword789!"
    })
    assert reset_res.status_code == 200

    # Can sign in with reset password
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_user.email,
        "password": "ResetSuccessPassword789!"
    })
    assert login_res.status_code == 200
