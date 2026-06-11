# 🧑‍💼 Job Board API

A role-based Job Board backend system built with Django REST Framework.
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

---

## 🛠 Tech Stack

- Python
- Django
- Django REST Framework
- PostgreSQL (ready for production)
- JWT (SimpleJWT)
- Django Filters
- Swagger (drf-spectacular)

---

## 📂 Project Structure

- users → custom user & roles
- jobs → company, job, application logic
- API-first architecture

---

## 🔐 Authentication

JWT token-based authentication:

- `/api/token/` → get access & refresh token
- `/api/token/refresh/` → refresh token

---

## 📌 Main Endpoints

### Auth
- POST `/api/token/`

### Companies
- GET/POST `/api/companies/`

### Jobs
- GET/POST `/api/jobs/`

### Applications
- POST `/api/applications/`
- GET `/api/employer-applications/`

---

## 📷 API Docs

Swagger UI available at:
