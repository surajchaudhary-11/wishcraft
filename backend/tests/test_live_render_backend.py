import json
import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
BASE = "https://wishcraft-backend-80fk.onrender.com/api/v1"

def req(path, method="GET", data=None, headers=None):
    url = f"{BASE}{path}"
    h = {"User-Agent": "Mozilla/5.0"}
    if headers:
        h.update(headers)
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        h["Content-Type"] = "application/json"
    r = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=15, context=ctx) as res:
            res_body = res.read().decode("utf-8")
            return res.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
        except:
            err_json = {"raw": err_body}
        return e.code, err_json
    except Exception as e:
        return 0, {"error": str(e)}

print("1. Testing Health...")
h_status, h_data = req("/../health")
print(f"Health: {h_status} -> {h_data}")

print("\n2. Testing Templates...")
t_status, t_data = req("/templates")
print(f"Templates: {t_status} -> count: {len(t_data) if isinstance(t_data, list) else t_data}")

print("\n3. Testing Auth (Registration)...")
ts = int(time.time())
test_email = f"live_qa_{ts}@example.com"
r_status, r_data = req("/auth/register", method="POST", data={
    "email": test_email,
    "password": "LiveAuditPassword123!",
    "display_name": "Live Audit User"
})
print(f"Register: {r_status} -> {r_data.get('user', {}).get('email')}")

if r_status == 201:
    token = r_data["access_token"]
    auth_h = {"Authorization": f"Bearer {token}"}
    
    print("\n4. Testing /auth/me...")
    me_status, me_data = req("/auth/me", headers=auth_h)
    print(f"Me: {me_status} -> {me_data.get('display_name')}")

    print("\n5. Testing Creation...")
    c_status, c_data = req("/creations", method="POST", headers=auth_h, data={
        "occasion": "birthday",
        "recipient_name": "Audit Celebrant",
        "sender_name": "Live QA",
        "relationship": "Friend",
        "message": "Testing live Render backend database persistence!",
        "template_id": "blush-celebration",
        "color_scheme": "rose",
        "photo_url": "https://images.unsplash.com/photo-1513151233558-d860c5398176"
    })
    print(f"Create: {c_status} -> ID: {c_data.get('id')}")
    creation_id = c_data.get("id")

    if c_status == 201 and creation_id:
        print("\n6. Testing Publishing...")
        p_status, p_data = req(f"/public/publish/{creation_id}", method="POST", headers=auth_h, data={
            "privacy": "public"
        })
        print(f"Publish: {p_status} -> Slug: {p_data.get('slug')}, URL: {p_data.get('public_url')}")
        slug = p_data.get("slug")

        if p_status == 200 and slug:
            print("\n7. Testing Public Site Access (Unauthenticated)...")
            s_status, s_data = req(f"/public/sites/{slug}")
            print(f"Public Site: {s_status} -> Recipient: {s_data.get('creation', {}).get('recipient_name')}")

            print("\n8. Testing Unpublish...")
            unp_status, unp_data = req(f"/public/unpublish/{creation_id}", method="POST", headers=auth_h)
            print(f"Unpublish: {unp_status} -> {unp_data}")

            print("\n9. Verify Public Site is now 404...")
            s404_status, s404_data = req(f"/public/sites/{slug}")
            print(f"Public Site after unpublish: {s404_status} (Expected 404)")

        print("\n10. Clean up test creation...")
        del_status, del_data = req(f"/creations/{creation_id}", method="DELETE", headers=auth_h)
        print(f"Delete creation: {del_status} -> {del_data}")

print("\n11. Testing AI generator...")
ai_status, ai_data = req("/ai/generate-message", method="POST", data={
    "occasion": "birthday",
    "recipient_name": "Sophia",
    "relationship": "Friend",
    "tone": "Heartfelt"
})
print(f"AI Message: {ai_status} -> Suggestions: {len(ai_data.get('suggestions', []))} via {ai_data.get('provider')}")
