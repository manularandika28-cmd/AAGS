# AAGS — Administrative & Academic Governance System

A full-stack development baseline for the University of Colombo Faculty of Technology mini project (Group 10).

## Stack
- Frontend: React + Tailwind CSS + React Router + Recharts
- Backend: Node.js + Express.js + JWT + Helmet
- Database: MySQL 8 / SQL relational schema
- Optional: SMTP/Nodemailer can be connected for production email delivery
- Biometric integration point: ESP32 + R307S fingerprint attendance session endpoint

## Design basis
The UI follows the uploaded Stitch wireframes and `DESIGN.md`: UoC navy sidebar, restrained maroon accent, Inter typography, 260px desktop sidebar, 12-column/24px desktop rhythm, rounded cards, subtle borders, pill status badges and responsive mobile layouts.

## Modules implemented
1. Universal login + JWT/RBAC
2. Student dashboard + attendance overview
3. Lecturer attendance manager + biometric-session start flow
4. Digital medical submission/review queue
5. Meeting request/scheduling and approval queue
6. Academic/faculty records
7. Admin users & roles
8. System configuration
9. Audit log view
10. Notification-ready API endpoint

The five roles in the project documents are preserved: Student, Lecturer, HOD, Dean, System Administrator.

## Run locally
### Option A — demo mode without MySQL
1. `cd server && copy .env.example .env` (Windows) or `cp .env.example .env`
2. Keep `DEMO_MODE=true`.
3. `npm install`
4. `npm run dev`
5. In another terminal: `cd interface && npm install && npm run dev`
6. Open `http://localhost:5173`.

The frontend also has a local fallback if the API is unavailable.

### Option B — MySQL
1. Install Docker Desktop.
2. From the project root: `docker compose up -d`.
3. Set `DEMO_MODE=false` if you want DB-backed login.
4. The SQL schema and seed are loaded automatically.
5. The seeded SQL account password is `password`. Change it before any real deployment.

For production, replace demo credentials, set a strong `JWT_SECRET`, enable HTTPS/TLS, connect SMTP, configure secure file storage, add rate limiting, and encrypt sensitive medical files at rest.

## Demo credentials (application demo mode)
- Student: `student@uoc.lk` / `Student@123`
- Lecturer: `lecturer@uoc.lk` / `Lecturer@123`
- HOD: `hod@uoc.lk` / `Hod@123`
- Dean: `dean@uoc.lk` / `Dean@123`
- System Administrator: `admin@uoc.lk` / `Admin@123`

## API highlights
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/attendance`
- `POST /api/attendance/session`
- `GET /api/medical`
- `POST /api/medical`
- `PATCH /api/medical/:id`
- `GET /api/meetings`
- `POST /api/meetings`
- `PATCH /api/meetings/:id`
- `GET /api/users`
- `GET /api/audit`
- `GET /api/settings`
- `GET /api/notifications`

## ESP32 / R307S integration
The attendance UI deliberately treats the fingerprint device as an external event source. The ESP32 firmware can authenticate a fingerprint locally and POST an event to a secured attendance-session endpoint. Do not expose the raw biometric template to the browser; keep biometric identifiers on the device/server boundary and log only the minimum required attendance event data.

## Important source alignment / intentional corrections
- The SRS says the meeting flow must perform server-side availability checks before confirmation; the UI therefore presents availability as a preview, while the backend endpoint is the place to enforce the real conflict check.
- The SRS requires PDF/JPEG/PNG medical files up to 5 MB; the upload UI reflects that constraint. The sample backend currently returns a demo response; wire `multer` + encrypted object/file storage before production.
- The proposal specifies JWT, HTTPS/TLS and RBAC. JWT and RBAC middleware are implemented; HTTPS should be terminated by the production server/reverse proxy.
- Attendance threshold defaults to 75% as required by the SRS and proposal.
