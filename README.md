# FixLocal

FixLocal is a full-stack marketplace that connects homeowners with verified local tradespeople. The platform focuses on trust, transparency, and rapid dispatch by combining a React + Vite frontend with a Spring Boot backend, unified authentication, and live status tracking.

## 🔑 Core Pillars

- **Unified Identity & Roles** – A single sign-on flow handles both customers and tradespeople. User records include roles, KYC status, live availability, and device-level booking locks to prevent double-booking.
- **Geo-aware Discovery** – Search experiences are anchored around working cities and live coordinates. Homeowners see only the tradespeople who are actively servicing their postcode radius.
- **Service Catalogs** – Tradespeople describe their offerings (scope, base price, duration) and skill tags so homeowners can understand expertise before booking.
- **Operational Safety** – Availability toggles, verification badges, and admin visibility keep the marketplace healthy.
- **Comprehensive Admin Insight** – Ops teams can audit disputes, deactivate malicious users, and spot churn patterns from a single dashboard.

## 🧩 Feature Breakdown

### 1. Authentication & Authorization
- Email-password login with persistent sessions powered by JWT cookies.
- `AuthContext` hydrates the React tree with user payloads and auto-refreshes tokens.
- Role-based feature flags (CUSTOMER vs TRADESPERSON vs ADMIN) to protect privileged routes.

### 2. Onboarding & Profile Management
| Capability | Customer | Tradesperson |
|------------|----------|--------------|
| Rich profile fields (name, bio, phone, photo) | ✅ | ✅ |
| Working city selection with curated location constants | ✅ | ✅ |
| Skill tags (up to 15 sanitized keywords) | — | ✅ |
| Availability toggle & live status transitions | — | ✅ |
| Service offerings CRUD (name, description, base price, duration) | — | ✅ |

Implementation highlights:
- `fixlocal-frontend/src/pages/Register.jsx` guides users through role selection and seed data capture.
- `fixlocal_backend/src/main/java/com/fixlocal/service/UserService.java` orchestrates profile, skills, availability, and offerings with strict role validation.
- Sanitization routines ensure tags are deduplicated, trimmed, and capped for UX cleanliness.

### 3. Marketplace Discovery
- `SearchResults.jsx` consumes `/api/users/search` (REST) to list tradespeople filtered by city, skill tags, or keyword.
- Card layouts surface ratings, completed jobs, and distance hints.
- Empty states nudge homeowners to broaden filters when inventory is sparse.

### 4. Live Status & Availability
- Tradespeople can switch between **Available**, **Offline**, and **On a Job** states from the dashboard.
- Backend automatically aligns `Status` enums with availability toggles to keep booking logic consistent.
- Homeowners only see professionals whose status allows new bookings, reducing failed contact attempts.

### 5. Service Offerings & Pricing Transparency
- Tradespeople describe discrete services (e.g., “2BHK AC repair”) with base price & estimated duration.
- Frontend surfaces offerings on profile detail pages so customers understand scope before requesting quotes.
- Admins can audit offerings for quality or remove misleading entries.

### 6. Disputes & Trust Layer
- `pages/dashboard/Disputes.jsx` provides an inbox-like experience for open disputes, showing context, timestamps, and resolution controls.
- Admin APIs allow tagging disputes with outcomes, issuing refunds, or banning repeat offenders.
- Aggregated stats help operations teams spot systemic issues (e.g., repeated complaints about a specific service category).

### 7. Admin Controls
- `adminService.js` exposes endpoints for:
  - Fetching dispute queues, flagged accounts, and verification dossiers.
  - Approving or rejecting tradesperson onboarding.
  - Triggering manual verification reruns.
- Admin dashboard surfaces cohorts (active, pending verification, suspended) with inline actions.

### 8. Location Intelligence & Live Tracking
- `src/constants/locations.js` centralizes supported cities, postal codes, and display labels for consistent dropdowns.
- Backend stores last-known latitude/longitude per user, enabling future real-time map views.
- Architecture leaves space for socket-based live location streaming (documented in `docs/LIVE-LOCATION.md`).

### 9. API Design Highlights
- REST endpoints for `/users/me`, `/users/service-offerings`, `/admin/disputes`, etc., secured via JWT.
- DTO-centric responses (`UserResponseDTO`, `ServiceOfferingDTO`) keep payloads lean and frontend-friendly.
- Error handling: domain-specific exceptions (e.g., `UnauthorizedException`, `ResourceNotFoundException`) map to precise HTTP status codes.

### 10. Frontend Architecture
- React + Vite with modular pages (`Home`, `Profile`, `Dashboard`, `SearchResults`).
- Context providers for auth state, global toasts, and city filters.
- API clients (`adminService`, `userService`) wrap Axios instances to include auth headers automatically.
- TailwindCSS utility classes deliver responsive, mobile-first layouts.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TailwindCSS, Context API, Axios |
| Backend | Java 21, Spring Boot 3, Lombok, Spring Security, JPA |
| Database | (Configurable) PostgreSQL / MySQL via Spring Data repos |
| Auth | JWT (stateless) with refresh support |
| Build & Tooling | Maven, npm, ESLint, Prettier |

## 🚀 Local Development

1. **Backend**
   ```bash
   cd fixlocal_backend
   ./mvnw spring-boot:run
   ```

2. **Frontend**
   ```bash
   cd fixlocal-frontend
   npm install
   npm run dev
   ```

3. Access the app at `http://localhost:5173` (default Vite port).

## 🗺️ Future Enhancements
- Realtime websockets for live technician tracking.
- In-app booking & payment workflows.
- AI-powered skill tagging during onboarding.
- Push notifications for urgent jobs and dispute escalations.

---

For more implementation notes, refer to the `/docs` directory:
- `docs/VERIFICATION.md` – steps for vetting tradespeople.
- `docs/LIVE-LOCATION.md` – blueprint for geolocation streaming.
- `docs/api/` – REST endpoint catalogue.

Happy fixing! 🔧