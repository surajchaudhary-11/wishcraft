import io
from PIL import Image
from fastapi.testclient import TestClient


def test_image_upload_and_validation(client: TestClient):
    # 1. Create a genuine tiny 100x100 PNG image in-memory
    img_byte_arr = io.BytesIO()
    img = Image.new("RGB", (100, 100), color=(255, 100, 150))
    img.save(img_byte_arr, format="PNG")
    img_bytes = img_byte_arr.getvalue()

    # Upload valid image
    files = {"file": ("celebration.png", img_bytes, "image/png")}
    res = client.post("/api/v1/uploads", files=files)
    assert res.status_code == 201
    data = res.json()
    assert "url" in data
    assert "asset_id" in data
    assert data["url"].startswith("/api/v1/uploads/")

    # 2. Upload invalid MIME / corrupted bytes
    bad_files = {"file": ("fake.png", b"not-an-image-text", "image/png")}
    bad_res = client.post("/api/v1/uploads", files=bad_files)
    assert bad_res.status_code == 400


def test_ai_message_generator(client: TestClient):
    req_payload = {
        "occasion": "birthday",
        "recipient_name": "Maya Lin",
        "relationship": "Friend",
        "tone": "Heartfelt",
        "length": "medium"
    }
    res = client.post("/api/v1/ai/generate-message", json=req_payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["suggestions"]) == 3
    assert data["recipient_name"] == "Maya Lin"
    assert data["tone"] == "Heartfelt"
    # Verify that the generated message actually mentions Maya
    assert any("Maya" in s for s in data["suggestions"])

