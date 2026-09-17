# Salon Appointment Booking System

A full-stack appointment booking system for salon staff to manage services and appointments.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS** on the frontend and **Django REST Framework** on the backend, using **SQLite** as the database.

---

## Project Structure

```
saloon-booking/
├── backend/          ← Django REST Framework API
│   ├── config/       ← Django settings and URL config
│   └── appointments/ ← App: models, serializers, views, URLs
├── frontend/         ← Next.js 14 App Router frontend
│   ├── app/          ← Pages (appointments, services)
│   ├── components/   ← Reusable UI components
│   ├── lib/          ← API utility (fetch wrapper)
│   └── types/        ← TypeScript interfaces
└── venv/             ← Python virtual environment (not committed)
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

## Backend Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 2. Install dependencies
pip install django djangorestframework django-cors-headers

# 3. Navigate to backend and run migrations
cd backend
python manage.py migrate

# 4. Start the Django server
python manage.py runserver
```

The backend will run at: `http://127.0.0.1:8000`

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will run at: `http://localhost:3000`

> The frontend reads the API URL from `.env.local`.
>
> Contents of `frontend/.env.local`:
> ```
> NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
> ```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| POST | `/api/services` | Create a service |
| PUT | `/api/services/:id` | Update a service |
| DELETE | `/api/services/:id` | Delete a service |
| GET | `/api/appointments` | List all appointments |
| POST | `/api/appointments` | Create an appointment |
| PATCH | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Delete an appointment |

---

## Sample Services

Add these via the Services page in the UI:

| Service | Price | Duration |
|---------|-------|----------|
| Haircut | NPR 500 | 30 min |
| Hair Coloring | NPR 2,500 | 120 min |
| Facial | NPR 1,500 | 60 min |

---

## Features

- View, add, edit, and delete salon services
- Book appointments with customer details and service selection
- View all appointments in a table
- Filter appointments by status (Pending, Confirmed, Completed, Cancelled)
- Update appointment status via dropdown
- Delete appointments
- Conflict detection — prevents double-booking the same service at the same date and time
- Client-side and server-side form validation
- Error and loading states handled throughout

---

## Architecture Decisions

- **No authentication** — internal staff tool, auth was out of scope
- **SQLite** — sufficient for local use; easily swappable for PostgreSQL
- **Function-based views** in Django — simple and easy to read
- **`fetch` API** — no extra libraries for REST calls
- **Conflict check in the serializer** — backend is the source of truth; frontend displays the error

---

## Running Both Servers

Open two terminals:

**Terminal 1 — Backend**
```bash
venv\Scripts\activate
cd backend
python manage.py runserver
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.