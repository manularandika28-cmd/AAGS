# AAGS — Administrative & Academic Governance System

A full-stack development baseline for the University of Colombo Faculty of Technology mini project (Group 10).

## Stack
- Frontend: React + Tailwind CSS + React Router
- Backend: Node.js + Express.js + JWT
- Database: PostgreSQL
- Optional: SMTP/Nodemailer can be connected for production email delivery
- Biometric integration point: ESP32 + R307S fingerprint attendance session endpoint

## Modules implemented (Currently UI only)
1. Universal login + JWT/RBAC
2. Student dashboard + attendance overview
3. Lecturer attendance manager + biometric-session start flow
4. Digital medical submission/review queue
5. Meeting request/scheduling and approval queue
6. Academic/faculty records
7. Admin users & roles
8. System configuration

The five roles in the project documents are preserved: Student, Lecturer, HOD, Dean, System Administrator.

## Demo credentials (application demo mode)
- Student: `kavindu@uoc.lk` / `password123`
- Lecturer: `chaminda@uoc.lk` / `password123`
- HOD: `samantha.hod@uoc.lk` / `password123`
- Dean: `dean@uoc.lk` / `password123`
- System Administrator: `admin@uoc.lk` / `password123`

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
