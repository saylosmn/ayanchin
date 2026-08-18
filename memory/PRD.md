# Ayanchin Downtown Restaurant — PRD

## Original Problem Statement
Premium, production-ready restaurant website for Ayanchin Downtown Restaurant, Olympic Street 12-1, DB Office Building, Sukhbaatar District, Ulaanbaatar, Mongolia. High-end modern Mongolian dining + international fine-dining feel. Full requirements: cinematic hero, sticky glass navbar, about, signature dishes, interactive filterable menu, experience cards, masonry gallery + lightbox, reviews (4.2/5, 133), reservation system, map, CTA, footer, SEO (schema.org, sitemap, robots), performance, security, admin architecture, data accuracy (no invented prices/reviews/history).

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + sonner, single-page public site at `/`, admin panel at `/admin` (React Router). Design: dark #0A0908 theme, Cormorant Garamond + Manrope, gold #D4AF37 accents.
- Backend: FastAPI on 0.0.0.0:8001, all routes under /api, MongoDB via MONGO_URL (motor). Collections: menu_items, gallery_images, reservations, reviews, users, login_attempts.
- Auth: JWT (Bearer, 12h), bcrypt hashing, admin seeded from env (ADMIN_EMAIL/ADMIN_PASSWORD), 5-attempt/15-min login lockout.
- Security: server-side validation + tag sanitization, in-memory rate limits (reservations 5/10min, reviews 3/10min per IP), idempotency keys, duplicate-reservation 409, security headers, CSP meta, no secrets in frontend.

## User Personas
- Guests (dates, business dinners, tourists, families): browse menu/gallery, reserve, review, get directions.
- Restaurant staff/admin (saylosmn@gmail.com): manage reservation requests, moderate reviews.

## Core Requirements (static)
All sections from problem statement; only provided restaurant data; price placeholders ("Price on request").

## Implemented
- 2026-08 (iter 1): Full public site — hero, navbar (scroll glass), about, signature dishes + detail modal, menu (filter/search, DB-seeded 5 confirmed dishes), experience bento, gallery (12 images, filters, lightbox w/ keyboard nav), reviews summary, reservation form (validation, idempotency, duplicate prevention), location + map, CTA, footer, mobile sticky CTA, SEO (schema.org, OG, sitemap, robots, CSP), security headers.
- 2026-08 (iter 2): MAP FIX — embed + directions now use exact coords 47.91504,106.91994; geo meta updated. ADMIN PANEL at /admin — JWT login (saylosmn@gmail.com), dashboard stats, reservation management (confirm/complete/cancel/delete + filters), review moderation (approve/reject/delete + filters). Public "Leave a Review" modal → pending → approved reviews render on homepage. Footer "Staff Login" link. Verified by testing agent: 12/12 backend, 100% frontend.

## Backlog (prioritized)
- P0: none outstanding.
- P1: Menu management in admin (add/edit dishes, prices, availability, images); gallery image management in admin.
- P2: Refresh tokens; persistent rate limiting (Redis); email notifications on reservation (needs provider key); opening-hours/restaurant-info editor; pagination for admin lists.

## Next Tasks
1. Ask user about menu CRUD + gallery management scope for admin.
2. Consider reservation email notifications (requires SendGrid/Resend key).
