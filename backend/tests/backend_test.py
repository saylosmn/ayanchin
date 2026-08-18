"""Backend regression tests for Ayanchin Downtown - iteration 2 (admin + reviews + map)."""
import os
import uuid
from datetime import date, timedelta

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://ayanchin-dining.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "saylosmn@gmail.com"
ADMIN_PASSWORD = "Ayanchin2026!Admin"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["email"] == ADMIN_EMAIL
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Public endpoints ----------
class TestPublic:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_menu_has_5_items(self, session):
        r = session.get(f"{API}/menu")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list) and len(items) >= 5

    def test_gallery(self, session):
        r = session.get(f"{API}/gallery")
        assert r.status_code == 200 and len(r.json()) >= 6

    def test_reviews_shape(self, session):
        r = session.get(f"{API}/reviews")
        assert r.status_code == 200
        j = r.json()
        assert "rating" in j and "themes" in j and "approved" in j
        assert isinstance(j["approved"], list)


# ---------- Auth ----------
class TestAuth:
    def test_login_ok(self, admin_token):
        assert isinstance(admin_token, str) and len(admin_token) > 20

    def test_me(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_requires_token(self, session):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_admin_endpoints_require_auth(self):
        assert requests.get(f"{API}/reservations").status_code == 401
        assert requests.get(f"{API}/admin/reviews").status_code == 401


# ---------- Reservation create + admin manage ----------
class TestReservationFlow:
    def test_create_and_manage(self, session, auth_headers):
        future = (date.today() + timedelta(days=7)).isoformat()
        unique_phone = f"9900{str(uuid.uuid4().int)[:4]}"
        idem = str(uuid.uuid4())
        payload = {
            "name": "TEST_Guest",
            "phone": unique_phone,
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "date": future,
            "time": "19:00",
            "guests": 2,
            "special_request": "Window seat please",
        }
        r = session.post(f"{API}/reservations", json=payload, headers={"X-Idempotency-Key": idem})
        assert r.status_code == 201, r.text
        res = r.json()["reservation"]
        rid = res["id"]
        assert res["status"] == "pending"

        # List
        lr = session.get(f"{API}/reservations", headers=auth_headers)
        assert lr.status_code == 200
        assert any(x["id"] == rid for x in lr.json())

        # Patch → confirmed
        pr = session.patch(f"{API}/reservations/{rid}", json={"status": "confirmed"}, headers=auth_headers)
        assert pr.status_code == 200
        assert pr.json()["status"] == "confirmed"

        # Invalid status rejected
        bad = session.patch(f"{API}/reservations/{rid}", json={"status": "bogus"}, headers=auth_headers)
        assert bad.status_code == 422

        # Delete
        dr = session.delete(f"{API}/reservations/{rid}", headers=auth_headers)
        assert dr.status_code == 200 and dr.json().get("deleted") is True

        # 404 after delete
        pr2 = session.patch(f"{API}/reservations/{rid}", json={"status": "confirmed"}, headers=auth_headers)
        assert pr2.status_code == 404

    def test_past_date_rejected(self, session):
        past = (date.today() - timedelta(days=1)).isoformat()
        r = session.post(f"{API}/reservations", json={
            "name": "Past", "phone": "99887766", "email": "a@b.com",
            "date": past, "time": "19:00", "guests": 2,
        })
        assert r.status_code == 422


# ---------- Review submission + moderation ----------
class TestReviewFlow:
    def test_submit_and_moderate(self, session, auth_headers):
        payload = {"name": "TEST_Reviewer", "rating": 5, "text": "Amazing food and lovely atmosphere!"}
        r = session.post(f"{API}/reviews/submit", json=payload)
        assert r.status_code == 201, r.text
        rev = r.json()["review"]
        assert rev["status"] == "pending"
        rid = rev["id"]

        # Admin list contains it
        lr = session.get(f"{API}/admin/reviews", headers=auth_headers)
        assert lr.status_code == 200
        assert any(x["id"] == rid for x in lr.json())

        # Approve
        pr = session.patch(f"{API}/admin/reviews/{rid}", json={"status": "approved"}, headers=auth_headers)
        assert pr.status_code == 200 and pr.json()["status"] == "approved"

        # Appears in public reviews approved list
        pub = session.get(f"{API}/reviews").json()
        assert any(x["id"] == rid for x in pub["approved"])

        # Cleanup
        dr = session.delete(f"{API}/admin/reviews/{rid}", headers=auth_headers)
        assert dr.status_code == 200

    def test_review_validation(self, session):
        r = session.post(f"{API}/reviews/submit", json={"name": "X", "rating": 6, "text": "too short"})
        assert r.status_code == 422
