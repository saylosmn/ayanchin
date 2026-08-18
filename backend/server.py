import logging
import os
import re
import time
import uuid
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Ayanchin Downtown API", docs_url=None, redoc_url=None, openapi_url=None)
api_router = APIRouter(prefix="/api")

TAG_RE = re.compile(r"<[^>]*>")
PHONE_RE = re.compile(r"^[0-9+\-\s()]{6,20}$")
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(auth[7:], JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one(
        {"id": payload["sub"], "role": "admin"}, {"_id": 0, "password_hash": 0}
    )
    if not user:
        raise HTTPException(status_code=401, detail="Account not found")
    return user

MENU_SEED = [
    {
        "id": "mong-gyu-steak-risotto",
        "name": "Mong Gyu Steak with Risotto",
        "description": "Premium steak paired with creamy risotto.",
        "category": "Steak & Grill",
        "price": None,
        "currency": "MNT",
        "tags": ["Signature"],
        "available": True,
        "signature": True,
        "image": "https://images.pexels.com/photos/34599571/pexels-photo-34599571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "alt": "Mong Gyu steak served with creamy risotto",
    },
    {
        "id": "bone-marrow",
        "name": "Bone Marrow",
        "description": "A rich Mongolian-inspired specialty.",
        "category": "Mongolian",
        "price": None,
        "currency": "MNT",
        "tags": ["House Specialty"],
        "available": True,
        "signature": True,
        "image": "https://images.pexels.com/photos/9408165/pexels-photo-9408165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "alt": "Roasted bone marrow served with crisp toasts",
    },
    {
        "id": "khuushuur",
        "name": "Khuushuur",
        "description": "Traditional Mongolian fried pastry with flavorful meat filling.",
        "category": "Mongolian",
        "price": None,
        "currency": "MNT",
        "tags": ["Traditional"],
        "available": True,
        "signature": True,
        "image": "https://images.unsplash.com/photo-1638502338747-f7f368214cce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxmcmllZCUyMGR1bXBsaW5ncyUyMGFzaWFuJTIwY3Vpc2luZSUyMGdvdXJtZXR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85",
        "alt": "Golden fried khuushuur pastries on a dark plate",
    },
    {
        "id": "kneecap-soup",
        "name": "Kneecap Soup",
        "description": "A traditional, hearty Mongolian dish praised by our guests.",
        "category": "Soups",
        "price": None,
        "currency": "MNT",
        "tags": ["Traditional", "Hearty"],
        "available": True,
        "signature": True,
        "image": "https://images.unsplash.com/photo-1664741662725-bd131742b7b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxoZWFydHklMjBtZWF0JTIwc291cCUyMGJvd2wlMjBydXN0aWN8ZW58MHx8fHwxNzg3MDU2ODAxfDA&ixlib=rb-4.1.0&q=85",
        "alt": "Hearty traditional Mongolian soup served in a bowl",
    },
    {
        "id": "caesar-salad",
        "name": "Caesar Salad",
        "description": "A lighter international option.",
        "category": "Salads",
        "price": None,
        "currency": "MNT",
        "tags": ["Lighter Option"],
        "available": True,
        "signature": True,
        "image": "https://images.unsplash.com/photo-1751638582376-3071e1fddb4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHw0fHxjYWVzYXIlMjBzYWxhZCUyMGdvdXJtZXQlMjBwbGF0aW5nfGVufDB8fHx8MTc4NzA1Njc5MXww&ixlib=rb-4.1.0&q=85",
        "alt": "Caesar salad served in a white bowl",
    },
]

GALLERY_SEED = [
    {"id": "gallery-grilled-cuts", "category": "Food", "alt": "Grilled premium cuts plated with herbs", "url": "https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxzdGVhayUyMGZpbmUlMjBkaW5pbmclMjBwbGF0ZWR8ZW58MHx8fHwxNzgzNjU3MjE0fDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-khuushuur-plate", "category": "Food", "alt": "Hand-folded golden khuushuur on a dark plate", "url": "https://images.unsplash.com/photo-1638502521795-89107ac5e246?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxmcmllZCUyMGR1bXBsaW5ncyUyMGFzaWFuJTIwY3Vpc2luZSUyMGdvdXJtZXR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-from-the-grill", "category": "Food", "alt": "Grilled meat and vegetables served on flatbread", "url": "https://images.unsplash.com/photo-1777994505601-fe18ab41f8f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMHNrZXdlcnMlMjBiYXJiZWN1ZSUyMGRhcmt8ZW58MHx8fHwxNzg3MDU2ODAyfDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-dining-room", "category": "Interior", "alt": "Dimly lit dining room with warm ambient light", "url": "https://images.unsplash.com/photo-1709548145082-04d0cde481d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwZGFyayUyMGFtYmllbnR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-downtown-space", "category": "Interior", "alt": "Contemporary downtown dining space", "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXJrJTIwbHV4dXJ5JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc4NzA1NjcwN3ww&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-evening-tables", "category": "Interior", "alt": "Cozy tables set with elegant wine glasses", "url": "https://images.pexels.com/photos/880424/pexels-photo-880424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {"id": "gallery-signature-pours", "category": "Drinks", "alt": "Craft cocktail with orange and cinnamon on the bar", "url": "https://images.unsplash.com/photo-1778104959469-0861d423de46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGNvY2t0YWlscyUyMGJhciUyMGRhcmslMjBtb29keXxlbnwwfHx8fDE3ODcwNTY4MDF8MA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-bar-selection", "category": "Drinks", "alt": "Red cocktails garnished with thyme", "url": "https://images.pexels.com/photos/8084688/pexels-photo-8084688.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {"id": "gallery-warm-corners", "category": "Atmosphere", "alt": "Intimate seating corner with warm light", "url": "https://images.unsplash.com/photo-1701722952679-beffce26d77a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHw0fHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwZGFyayUyMGFtYmllbnR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-in-the-kitchen", "category": "Atmosphere", "alt": "Chef at work in the Ayanchin kitchen", "url": "https://images.unsplash.com/photo-1769955817432-641929f613f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxjaGVmJTIwcGxhdGluZyUyMGRpc2glMjBraXRjaGVuJTIwZmluZSUyMGRpbmluZ3xlbnwwfHx8fDE3ODcwNTY4MDF8MA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-celebrations", "category": "Events", "alt": "Wine glasses set for a private celebration", "url": "https://images.unsplash.com/photo-1469234496837-d0101f54be3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwZGFyayUyMGFtYmllbnR8ZW58MHx8fHwxNzg3MDU2NzkxfDA&ixlib=rb-4.1.0&q=85"},
    {"id": "gallery-gatherings", "category": "Events", "alt": "Colorful cocktails served for a gathering", "url": "https://images.unsplash.com/photo-1767745455688-49391131f751?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHw0fHxjcmFmdCUyMGNvY2t0YWlscyUyMGJhciUyMGRhcmslMjBtb29keXxlbnwwfHx8fDE3ODcwNTY4MDF8MA&ixlib=rb-4.1.0&q=85"},
]

REVIEW_THEMES = [
    {"id": "theme-authentic", "title": "Authentic Mongolian food", "note": "Guests highlight genuine local flavors prepared with care."},
    {"id": "theme-steak", "title": "Excellent steak & bone marrow", "note": "The Mong Gyu steak and bone marrow are frequent guest favorites."},
    {"id": "theme-khuushuur", "title": "Delicious khuushuur", "note": "A much-loved traditional favorite, praised for its flavor."},
    {"id": "theme-atmosphere", "title": "Warm atmosphere", "note": "An elegant, comfortable setting for dates and business dinners."},
    {"id": "theme-service", "title": "Attentive service", "note": "Professional, welcoming service throughout the evening."},
    {"id": "theme-international", "title": "International-quality dining", "note": "A downtown experience meeting international restaurant standards."},
]

RATE_BUCKETS = defaultdict(list)


def rate_limit(key: str, limit: int, window: int):
    now = time.time()
    bucket = [t for t in RATE_BUCKETS[key] if now - t < window]
    if len(bucket) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    bucket.append(now)
    RATE_BUCKETS[key] = bucket


class ReservationCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=24)
    email: EmailStr
    date: str
    time: str
    guests: int = Field(ge=1, le=20)
    special_request: Optional[str] = Field(default=None, max_length=600)

    @field_validator("name", "phone", "special_request", mode="after")
    @classmethod
    def strip_tags(cls, v):
        if v is None:
            return v
        return TAG_RE.sub("", v).strip()

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v):
        if not PHONE_RE.fullmatch(v):
            raise ValueError("Please provide a valid phone number.")
        return v

    @field_validator("date")
    @classmethod
    def valid_date(cls, v):
        try:
            d = date.fromisoformat(v)
        except ValueError:
            raise ValueError("Please provide a valid date.")
        if d < date.today():
            raise ValueError("Reservation date cannot be in the past.")
        return v

    @field_validator("time")
    @classmethod
    def valid_time(cls, v):
        if not TIME_RE.fullmatch(v):
            raise ValueError("Please provide a valid time.")
        return v


class LoginRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class ReservationStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_status(cls, v):
        if v not in {"pending", "confirmed", "cancelled", "completed"}:
            raise ValueError("Invalid status")
        return v


class ReviewSubmit(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=60)
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=10, max_length=600)

    @field_validator("name", "text", mode="after")
    @classmethod
    def strip_review_tags(cls, v):
        return TAG_RE.sub("", v).strip()


class ReviewStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_review_status(cls, v):
        if v not in {"approved", "rejected", "pending"}:
            raise ValueError("Invalid status")
        return v


@api_router.get("/")
async def root():
    return {"status": "ok", "service": "Ayanchin Downtown API"}


@api_router.get("/menu")
async def get_menu():
    return await db.menu_items.find({}, {"_id": 0}).to_list(200)


@api_router.get("/gallery")
async def get_gallery():
    return await db.gallery_images.find({}, {"_id": 0}).to_list(200)


@api_router.get("/reviews")
async def get_reviews():
    approved = await db.reviews.find({"status": "approved"}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {
        "rating": 4.2,
        "count": 133,
        "themes": REVIEW_THEMES,
        "approved": approved,
        "note": "Individual reviews are loaded from the restaurant's verified review source.",
    }


@api_router.post("/reviews/submit", status_code=201)
async def submit_review(payload: ReviewSubmit, request: Request):
    ip = request.client.host if request.client else "unknown"
    rate_limit(f"review:{ip}", limit=3, window=600)
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "rating": payload.rating,
        "text": payload.text,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(dict(doc))
    logger.info("Review submitted id=%s", doc["id"])
    return {"message": "Thank you! Your review is pending moderation.", "review": doc}


@api_router.post("/reservations", status_code=201)
async def create_reservation(payload: ReservationCreate, request: Request):
    ip = request.client.host if request.client else "unknown"
    rate_limit(f"res:{ip}", limit=5, window=600)

    idem_key = request.headers.get("x-idempotency-key")
    if idem_key:
        existing = await db.reservations.find_one({"idempotency_key": idem_key}, {"_id": 0})
        if existing:
            return {"message": "Reservation already received.", "reservation": existing}

    duplicate = await db.reservations.find_one(
        {"phone": payload.phone, "date": payload.date, "time": payload.time, "status": "pending"},
        {"_id": 0},
    )
    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="A reservation for this phone number already exists at that date and time.",
        )

    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "phone": payload.phone,
        "email": str(payload.email),
        "date": payload.date,
        "time": payload.time,
        "guests": payload.guests,
        "special_request": payload.special_request,
        "status": "pending",
        "idempotency_key": idem_key,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reservations.insert_one(dict(doc))
    logger.info("Reservation created id=%s date=%s time=%s", doc["id"], doc["date"], doc["time"])
    return {
        "message": "Reservation request received. Our team will confirm shortly by phone.",
        "reservation": doc,
    }


@api_router.post("/auth/login")
async def login(payload: LoginRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{payload.email.lower()}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": payload.email.lower(), "role": "admin"})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {
                "$inc": {"count": 1},
                "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()},
            },
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], user["email"])
    logger.info("Admin login email=%s", user["email"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", "Admin"),
            "role": "admin",
        },
    }


@api_router.get("/auth/me")
async def auth_me(admin=Depends(get_current_admin)):
    return admin


@api_router.get("/reservations")
async def list_reservations(admin=Depends(get_current_admin)):
    return await db.reservations.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.patch("/reservations/{reservation_id}")
async def update_reservation(reservation_id: str, payload: ReservationStatusUpdate, admin=Depends(get_current_admin)):
    result = await db.reservations.update_one({"id": reservation_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return await db.reservations.find_one({"id": reservation_id}, {"_id": 0})


@api_router.delete("/reservations/{reservation_id}")
async def delete_reservation(reservation_id: str, admin=Depends(get_current_admin)):
    result = await db.reservations.delete_one({"id": reservation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return {"deleted": True}


@api_router.get("/admin/reviews")
async def admin_list_reviews(admin=Depends(get_current_admin)):
    return await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.patch("/admin/reviews/{review_id}")
async def admin_update_review(review_id: str, payload: ReviewStatusUpdate, admin=Depends(get_current_admin)):
    result = await db.reviews.update_one({"id": review_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return await db.reviews.find_one({"id": review_id}, {"_id": 0})


@api_router.delete("/admin/reviews/{review_id}")
async def admin_delete_review(review_id: str, admin=Depends(get_current_admin)):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"deleted": True}


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.on_event("startup")
async def seed_data():
    if await db.menu_items.count_documents({}) == 0:
        await db.menu_items.insert_many([dict(item) for item in MENU_SEED])
        logger.info("Seeded %d menu items", len(MENU_SEED))
    if await db.gallery_images.count_documents({}) == 0:
        await db.gallery_images.insert_many([dict(item) for item in GALLERY_SEED])
        logger.info("Seeded %d gallery images", len(GALLERY_SEED))
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    if ADMIN_EMAIL and ADMIN_PASSWORD:
        existing = await db.users.find_one({"email": ADMIN_EMAIL})
        if existing is None:
            await db.users.insert_one(
                {
                    "id": str(uuid.uuid4()),
                    "email": ADMIN_EMAIL,
                    "password_hash": hash_password(ADMIN_PASSWORD),
                    "name": "Restaurant Admin",
                    "role": "admin",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            logger.info("Seeded admin account %s", ADMIN_EMAIL)
        elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.users.update_one(
                {"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}}
            )
            logger.info("Updated admin password for %s", ADMIN_EMAIL)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
