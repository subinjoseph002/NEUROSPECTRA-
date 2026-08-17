# NEUROSPECTRA — Pediatric Autism Screening & Therapy Management Platform

![NEUROSPECTRA Logo](assets/logo.svg)

**NEUROSPECTRA** is a specialized full-stack healthcare web application designed for early pediatric autism risk screening, structured clinical assessments, individualized therapy milestone formulation, multi-domain progress tracking, and secure parent-therapist communication.

---

## 1. Technology Stack & Architecture

```
React (Vite + Tailwind CSS + Hook Form + Zod)
                  ↓ (Axios REST API + JWT Bearer)
Django REST Framework (Python 3.10+ / Serializer Validation)
                  ↓ (Django ORM / psycopg2)
PostgreSQL Database (schema.sql)
```

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, React Hook Form, Zod, Axios, Lucide Icons | Real-time Zod form validation, live password strength meter, 10-digit Indian phone validation, exact Figma clinical layout. |
| **Backend** | Python, Django, Django REST Framework, Simple JWT | Non-bypassable serializer validation, salted cryptographic password hashing, role authorization guards, REST API endpoints. |
| **Database** | PostgreSQL | 10 relational tables, foreign key constraints, indexes, ENUM types, and seed data in [`schema.sql`](schema.sql). |
| **Security** | JWT Tokens + RBAC | Role-based route guards across 5 personas with data isolation. |

---

## 2. Role-Based Access Control (RBAC) & Test Accounts

| Role | Demo User | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Eleanor Vance | `admin@neurospectra.org` | `admin123` | User/therapist provisioning, role authorization, audit log, child registry. |
| **Therapist** | Dr. Aisha Khan, Ph.D. | `therapist@neurospectra.org` | `therapist123` | Standardized M-CHAT-R/F screening engine, IEP formulary, session logs. |
| **Receptionist** | Sarah Jenkins | `receptionist@neurospectra.org` | `receptionist123` | Patient intake registration, appointment scheduling, reminder dispatching. |
| **Parent / Caregiver** | Priya Sharma | `parent@neurospectra.org` | `parent123` | Milestone tracking, upcoming visits, progress visualization, reports export. |
| **Teacher** | Marcus Brody | `teacher@neurospectra.org` | `teacher123` | Classroom behavioral alignment, student IEP tracking. |

---

## 3. Form Validation System (Dual-Layer)

### A. Frontend (React Hook Form + Zod)
- **Login Schema**: Required email with RFC regex (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`), max 100 chars, lowercase normalization, password required with 8+ non-whitespace characters.
- **Registration Schema**:
  - Full Name: 3–100 characters, letters/hyphens/apostrophes only (`/^[a-zA-Z\s'-]+$/`).
  - Mobile: Indian 10-digit format (`/^[6-9]\d{9}$/`).
  - Password: 8+ chars with uppercase, lowercase, number, and special character + live 3-segment strength meter.
  - Confirm Password: Match verification.
  - Terms: Required checkbox consent.

### B. Backend (Django REST Framework Serializers)
- Independent server-side validation rejecting bypass attempts.
- Email uniqueness validation in PostgreSQL.
- **Role Authorization Guard**: Rejects public registrations attempting to create privileged roles (`Administrator`, `Therapist`, `Receptionist`).
- Generic credential failure messages to prevent user enumeration attacks.

---

## 4. How to Run

### A. Run Django Backend:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### B. Run React Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### C. Run Native Web Server (Instant Execution):
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open `http://localhost:3000` in your browser.

### D. PostgreSQL Database Setup:
```bash
psql -U postgres -d postgres -f schema.sql
```
