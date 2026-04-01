# API Testing Guide – FixLocal Platform

This reference consolidates every public API exposed by the FixLocal backend (`/api/v1/**`). It is intended for QA engineers and backend integrators who need request/response formats, authentication rules, and sample cURL invocations.

> **Base URL (local dev)**: `http://localhost:8080`

- All JSON bodies are UTF-8 encoded.
- Unless noted, authenticated routes require an `Authorization: Bearer <JWT>` header obtained from `/api/v1/auth/login` or `/api/v1/auth/register`.
- Error payloads follow Spring’s default `ProblemDetail` style with `status`, `error`, and `message` fields.

---

## Endpoint Inventory Snapshot

Total unique REST endpoints discovered across `com.fixlocal.controller`: **47**

| Controller | Base Path | # Endpoints |
|------------|-----------|-------------|
| `AuthController` | `/api/v1/auth` | 2 |
| `UserController` | `/api/v1/users` | 7 |
| `TradespersonController` | `/api/v1/tradespersons` | 2 |
| `BookingController` | `/api/v1/bookings` | 21 |
| `DashboardController` | `/api/v1/dashboard` | 2 |
| `DisputeController` | `/api/v1/disputes` | 7 |
| `NotificationController` | `/api/v1/notifications` | 3 |
| `ReviewController` | `/api/v1/reviews` | 2 |
| `TestimonialController` | `/api/v1/testimonials` | 2 |
| `ChatController` | `/api/v1/chat` | 3 |
| `AdminController` | `/api/v1/admin` | 7 |
| `TestController` | `/api/v1/test` | 2 (health + secure ping) |

> The tables below list every endpoint grouped by function. Use this summary to cross-check automation scripts or Postman collections.

### Postman Automation Suite

A ready-to-run Postman collection that covers all **58** API surfaces (including auth, lifecycle, dashboards, disputes, chat, reviews, admin, and misc pings) lives at:

```
docs/api/fixlocal-api.postman_collection.json
```

How to use it:
1. Import the collection into Postman (or run via Newman) using the file above.
2. Update the collection variables (`{{baseUrl}}`, `{{authToken}}`, `{{adminToken}}`, IDs such as `{{bookingId}}`) to match your environment or seed data.
3. Run the folders in order (Auth → Users & Tradespersons → Bookings → …) to exercise every controller.
4. For CI automation, run `npm install -g newman` and execute `newman run docs/api/fixlocal-api.postman_collection.json --env-file <env.json>`.

## 1. Authentication & Identity

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register a user or tradesperson. Role-specific fields validated server side. | No |
| `POST` | `/api/v1/auth/login` | Exchange email/password for JWT + hydrated user payload. | No |

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Asha",
        "email": "asha@example.com",
        "password": "secret123",
        "phone": "+919999999999",
        "role": "TRADESPERSON",
        "occupation": "electrician",
        "workingCity": "Bengaluru",
        "experience": 5
      }'
```
**Response 201**
```json
{
  "token": "<JWT>",
  "type": "Bearer",
  "user": {
    "id": "65f...",
    "name": "Asha",
    "role": "TRADESPERSON",
    "status": "AVAILABLE",
    "skillTags": [],
    "serviceOfferings": []
  }
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"secret123"}'
```
**Response 200** identical shape as register.

---

## 2. Users & Tradespersons

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/users/me` | Fetch current profile (role, KYC, skill tags, offerings). |
| `PUT` | `/api/v1/users/me` | Update profile details (name, phone, bio, workingCity, experience, etc.). |
| `PATCH` | `/api/v1/users/me/availability?available=true` | Toggle availability + status for tradesperson. |
| `PUT` | `/api/v1/users/me/skill-tags` | Replace skill tag list (max 15, trimmed). |
| `POST` | `/api/v1/users/me/services` | Create service offering (name, description, basePrice, durationMinutes). |
| `PUT` | `/api/v1/users/me/services/{serviceId}` | Update offering. |
| `DELETE` | `/api/v1/users/me/services/{serviceId}` | Remove offering. |

### Sample: Update Skill Tags
```bash
curl -X PUT http://localhost:8080/api/v1/users/me/skill-tags \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"tags":["ac repair","wiring","safety audit"]}'
```

### Tradesperson Discovery (Public)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/tradespersons/search` | Query params: `city`, `occupation`, `page`, `size`. Returns paginated cards. |
| `GET` | `/api/v1/tradespersons/{id}` | Detailed profile for public view. |

---

## 3. Booking, Offer & Payment Flow (21 endpoints)

Primary DTOs: `BookingRequest`, `PriceOfferRequest`, `Booking`, `BookingStatsDTO`.

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/api/v1/bookings` | Create booking (user only) with service address, description, city, lat/lng, `tradespersonId`, initial offer amount. |
| `POST` | `/api/v1/bookings/{id}/offers` | Submit counter-offer (both parties). Body: `{ "amount": number, "message": "..." }`. |
| `POST` | `/api/v1/bookings/{id}/offers/{offerId}/accept` | Accept the other party’s offer. |
| `POST` | `/api/v1/bookings/{id}/accept` | Tradesperson accepts pending booking. |
| `POST` | `/api/v1/bookings/{id}/reject` | Tradesperson rejects. |
| `POST` | `/api/v1/bookings/{id}/start-trip` | Tradesperson marks “EN_ROUTE”. |
| `POST` | `/api/v1/bookings/{id}/arrived` | Tradesperson marks “ARRIVED”. |
| `POST` | `/api/v1/bookings/{id}/complete` | Tradesperson marks “COMPLETED”. |
| `POST` | `/api/v1/bookings/{id}/cancel` | Either party cancels (body `reason`). |
| `GET` | `/api/v1/bookings/{id}` | Fetch single booking if you are user or tradesperson. |
| `GET` | `/api/v1/bookings/me` | User bookings. Query: `status`, `page`, `size`. |
| `GET` | `/api/v1/bookings/tradesperson` | Tradesperson bookings. |
| `GET` | `/api/v1/bookings/stats` | Aggregated counts (pending, active, completed, etc.). |

#### Live Location APIs (2)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/bookings/{id}/location` | Tradesperson posts `{ "latitude": number, "longitude": number }`. Stored with TTL, broadcast via STOMP. |
| `GET` | `/api/v1/bookings/{id}/location` | Returns last coordinates + `stale` flag for authorized users. |

#### Escrow Placeholders (4)
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/bookings/{id}/payments/initiate` | Creates escrow intent (kept abstract). |
| `POST` | `/api/v1/bookings/{id}/payments/authorize` | Marks funds authorisation. |
| `POST` | `/api/v1/bookings/{id}/payments/capture` | Captures funds. |
| `POST` | `/api/v1/bookings/{id}/payments/refund` | Issues refund. |

---

## 4. Dashboard & Analytics

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/dashboard/user` | Summary cards for homeowners (bookings, outstanding disputes, testimonials). |
| `GET` | `/api/v1/dashboard/tradesperson` | Active bookings, income stats, verification status. |

---

## 5. Disputes & Support (7)

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | `POST` | `/api/v1/disputes` | Create dispute for booking. |
| 2 | `GET` | `/api/v1/disputes` | Admin-only full list. |
| 3 | `GET` | `/api/v1/disputes/{id}` | Single dispute detail with ACL. |
| 4 | `GET` | `/api/v1/disputes/booking/{bookingId}` | All disputes for a booking. |
| 5 | `GET` | `/api/v1/disputes/mine` | Reporter’s disputes. |
| 6 | `PUT` | `/api/v1/disputes/{id}` | Admin resolution update. |
| 7 | `POST` | `/api/v1/disputes/{id}/messages` | Append message/thread note. |

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/disputes` | Body: `bookingId`, `reason`, `details`, optional attachments. |
| `GET` | `/api/v1/disputes` | Admin-only list (optionally filter by status). |
| `GET` | `/api/v1/disputes/{id}` | Details with conversation trail. |
| `GET` | `/api/v1/disputes/booking/{bookingId}` | All disputes linked to booking. |
| `GET` | `/api/v1/disputes/my` | Current user’s disputes. |
| `PATCH` | `/api/v1/disputes/{id}` | Admin resolution updates (status, refund flag, notes). |
| `POST` | `/api/v1/disputes/{id}/messages` | Append message to dispute thread. |

Sample create:
```bash
curl -X POST http://localhost:8080/api/v1/disputes \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
        "bookingId": "663...",
        "reason": "Workmanship issue",
        "details": "Paint peeled within 24h"
      }'
```

---

## 6. Notifications (3)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/notifications` | Paginated list for logged-in user (`page`, `size`). |
| `POST` | `/api/v1/notifications/{id}/read` | Mark a notification as read. |
| `POST` | `/api/v1/notifications/read-all` | Mark all as read. |

- WebSocket feed: subscribe to `/topic/notifications/{userId}` after connecting to `/ws` with JWT header `Authorization: Bearer <token>`.

---

## 7. Chat & Collaboration (3)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/chat/{bookingId}` | Fetch conversation metadata (participants, createdAt). |
| `GET` | `/api/v1/chat/{bookingId}/messages?page=x&size=y` | Paginated chat history. |
| `POST` | `/api/v1/chat/{bookingId}/messages` | Body: `{ "content": "...", "attachmentUrl": "..." }`. |

WebSocket destination for live chat (mirrors REST persistence): `/topic/bookings/{bookingId}/chat`.

---

## 8. Reviews & Testimonials (4)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/reviews` | After completion, user posts rating + comment + bookingId. |
| `GET` | `/api/v1/reviews/tradesperson/{id}` | Summaries + averages for profile cards. |
| `GET` | `/api/v1/testimonials` | Public testimonials for marketing hero. |
| `POST` | `/api/v1/testimonials` | Authenticated submission for homepage (used in `Home.jsx`). |

---

## 9. Admin Suite (7)

> Requires `Role.ADMIN`. Spring Security method security enforces this server-side.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/admin/users?page=x&size=y` | Paginated users (any role). Optional `role` filter. |
| `GET` | `/api/v1/admin/tradespersons?page=x&size=y` | Paginated verified/unverified tradespeople. |
| `POST` | `/api/v1/admin/users/{id}/block` | Block user. |
| `POST` | `/api/v1/admin/users/{id}/unblock` | Unblock user. |
| `POST` | `/api/v1/admin/tradespersons/{id}/verify` | Approve KYC. |
| `GET` | `/api/v1/admin/bookings?page=x&size=y` | All bookings. |
| `GET` | `/api/v1/admin/stats` | Aggregated metrics (counts, average rating via aggregation pipeline). |

---

## 10. Miscellaneous / Utilities (2)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/test/ping` | Health probe (public). |
| `GET` | `/api/v1/test/secure` | Requires auth; useful for verifying JWT validity. |

---

## Testing Checklist

| Area | What to verify |
|------|----------------|
| Auth | Register/login flows return JWT + DTO; invalid credentials yield 401. |
| User profile | `/users/me` reflects last update; service offering CRUD respects role. |
| Search | `/tradespersons/search?city=Bengaluru` returns verified + available pros only. |
| Booking flow | Pending → counter-offer → accept transitions update `status` and notifications. |
| Live tracking | `POST /location` triggers STOMP payload and `GET /location` exposes `stale` field per `docs/LIVE-LOCATION.md`. |
| Disputes | User/tradesperson creation works; admin patch updates status & appears in dashboards. |
| Notifications | Unread counts drop after `/notifications/read-all`. |
| Admin actions | Blocked users cannot log in; verify tradesperson toggles `verified=true`. |

Happy testing! 🧪