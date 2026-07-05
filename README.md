# 🧑‍💼 Job Board API

A role-based Job Board system built with Django REST Framework + React.
It supports authentication, job posting, applications, and employer dashboard features.

---

## 🚀 Features

- JWT Authentication (Login / Register)
- Role-based system (Employer / Applicant)
- Company management (Employer only)
- Job posting system
- Job application system (with CV upload)
- Employer dashboard (manage applications)
- Application status workflow (pending / accepted / rejected)
- Search, filtering, and pagination
- Swagger API documentation
- React Frontend with Yellow-Black theme

---

## 🛠 Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- SQLite (ready for PostgreSQL)
- JWT (SimpleJWT)
- Django Filters
- Swagger (drf-spectacular)
- CORS Headers
- Pillow (file uploads)

### Frontend
- React
- Vite
- Axios

---

## 📂 Project Structure

- `config/` → Django settings & URLs
- `users/` → custom user & roles, authentication
- `jobs/` → company, job, application logic
- `frontend/` → React frontend

---

## 🔐 Authentication

JWT token-based authentication:

- `/api/token/` → get access & refresh token
- `/api/token/refresh/` → refresh token
- `/api/register/` → register new user

---

## 📌 Main Endpoints

### Auth
- POST `/api/token/`
- POST `/api/register/`

### Companies
- GET/POST `/api/companies/`

### Jobs
- GET/POST `/api/jobs/`

### Applications
- POST `/api/applications/`
- GET `/api/employer-applications/`

---

## 📷 API Docs

Swagger UI available at: `http://127.0.0.1:8000/api/docs/`

---

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Create superuser:**
```bash
python manage.py createsuperuser
```

4. **Run server:**
```bash
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run dev server:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🎨 Frontend Theme

Yellow-Black theme with:
- Black background (#000000)
- Yellow accent (#ffd700)
- Dark cards (#1a1a1a)
- Modern UI components
