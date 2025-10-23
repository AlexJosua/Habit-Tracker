# 🟢 Habit Tracker - Fullstack Project

A web application to **create habits, track daily progress, and maintain streaks**.

Frontend menggunakan **Next.js + Tailwind CSS**, backend menggunakan **Node.js + Express**, dan database menggunakan **PostgreSQL**.

---

## 🏗️ Project Structure

```
Habit-Tracker/
├─ habit-tracker-frontend/   # Frontend (Next.js)
├─ habit-tracker-backend/    # Backend (Express)
├─ create_tables.sql         # SQL file untuk membuat tables
└─ README.md                 # File ini
```

---

## ⚡ Features

- **Authentication** (JWT)
- **Habit Management**: Create, Read, Update, Delete
- **Daily Check-In**: Track streaks
- **Bonus**:
  - Calendar View for completed days
  - Progress Charts over time

---

## 🔧 Environment Variables

Buat file `.env` di **backend** (`habit-tracker-backend/.env`) seperti ini:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=db_name
DB_PORT=5432
PORT=5000
JWT_SECRET=secret123
```

> Jangan commit `.env` ke repository (sudah di `.gitignore`).

---

## 🗄️ Database Setup

Gunakan **pgAdmin** atau psql:

1.  Buat database `habit_tracker`.
2.  Eksekusi file **`create_tables.sql`**: (ada di folder habit-tracker-backend>queries>create_tables.sql)

        CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL

    );

CREATE TABLE IF NOT EXISTS habits(
id serial PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
description TEXT,
start_date DATE NOT NULL DEFAULT CURRENT_DATE,
current_streak INTEGER DEFAULT 0,
longest_streak INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habits_checkins(
id SERIAL PRIMARY KEY,
habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
checkin_date DATE NOT NULL DEFAULT CURRENT_DATE
);

````

> Pastikan semua table berhasil dibuat sebelum menjalankan backend.

---

## 🚀 Running the Project

### 1. Backend

```bash
cd habit-tracker-backend
npm install
npm run dev
````

Server akan berjalan di: `http://localhost:5000`

### 2. Frontend

```bash
cd habit-tracker-frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

---

## 🧩 API Endpoints

### Auth

| Method | Endpoint           | Body                      | Response     |
| ------ | ------------------ | ------------------------- | ------------ |
| POST   | /api/auth/register | { name, email, password } | User created |
| POST   | /api/auth/login    | { email, password }       | { token }    |

### Habits

| Method | Endpoint        | Body                              | Response      |
| ------ | --------------- | --------------------------------- | ------------- |
| GET    | /api/habits     | -                                 | List habits   |
| POST   | /api/habits     | { name, description, start_date } | Habit created |
| PUT    | /api/habits/:id | { name, description }             | Habit updated |
| DELETE | /api/habits/:id | -                                 | Habit deleted |

### Check-In

| Method | Endpoint                | Response                              |
| ------ | ----------------------- | ------------------------------------- |
| POST   | /api/habits/:id/checkin | { message: "...", current_streak: X } |

---

## 📝 Notes

- Gunakan **JWT token** di header `Authorization: Bearer <token>` untuk request API yang membutuhkan auth.
- FE dan BE merupakan **dua folder terpisah** dalam satu repo.
- Pastikan database sudah running di PostgreSQL sebelum menjalankan backend.
- File `create_tables.sql` bisa dieksekusi langsung di pgAdmin atau terminal PostgreSQL.
- Untuk frontend:
  - **Calendar View:** menampilkan hari yang sudah check-in
  - **Chart:** menampilkan progress streak

---
