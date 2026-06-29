# HireStack 🚀

HireStack is a modern, high-performance job board and recruitment platform built with a decoupled architecture. It features a robust PHP Symfony API backend and a responsive, feature-rich React/TypeScript frontend.

---

## 🏗️ Project Architecture

The repository is structured into two main components:

- [**backend/**](./backend): Symfony 7.4 PHP REST API that handles business logic, databases, migrations, and user authentication.
- [**frontend/**](./frontend): React, TypeScript, and Vite single-page application (SPA) styled with TailwindCSS and Radix UI (shadcn).

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your system:

- **PHP** >= 8.2
- **Composer** (PHP Package Manager)
- **Node.js** (v18+) or **Bun**
- **Docker** and **Docker Compose**

---

## 🚀 Step-by-Step Setup Guide

Follow these steps to set up and run both the backend and frontend services locally.

### Step 1: Clone the Repository & Environment Setup

1. Check the backend environment configuration in [backend/.env](./backend/.env).
2. The default configurations are set to connect to the MySQL instance started in the next step.

---

### Step 2: Database Setup (Docker)

The backend uses a MySQL 8.0 database configured via Docker Compose.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the database service in detached mode:
   ```bash
   docker compose up -d
   ```

---

### Step 3: Backend API Setup

1. While in the `backend/` directory, install PHP dependencies:
   ```bash
   composer install
   ```
2. Run the database migrations to set up tables:
   ```bash
   php bin/console doctrine:migrations:migrate --no-interaction
   ```
3. Seed the database with sample users (admin, seekers, recruiters) and companies:
   ```bash
   php bin/console app:seed-users
   ```
4. Start the Symfony built-in development server:
   ```bash
   composer start
   ```
   *The backend REST API will now be running at **`http://127.0.0.1:8000`**.*
   *Verify it works by visiting the health check: `http://127.0.0.1:8000/api/health`*

---

### Step 4: Frontend Application Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies using `npm` or `bun`:
   ```bash
   npm install
   # or
   bun install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   *The frontend application will now be running at **`http://localhost:5173`**.*

---

## 🔑 Seeding / Demo Accounts

The database seeding command (`php bin/console app:seed-users`) generates standard accounts that you can use to log in and test different user journeys:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@hirestack.local` | `AdminPassword123!` |
| **Job Seeker (Senior)** | `seeker1@hirestack.local` | `SeekerPassword123!` |
| **Job Seeker (Junior)** | `seeker2@hirestack.local` | `SeekerPassword123!` |
| **Recruiter (Tech Corp)** | `recruiter1@hirestack.local` | `RecruiterPassword123!` |
| **Recruiter (Web Agency)**| `recruiter2@hirestack.local` | `RecruiterPassword123!` |

---

## 🧪 Testing

### Backend tests
To run Symfony backend tests:
```bash
cd backend
php bin/phpunit
```

### Frontend tests
To run Vitest unit and component tests:
```bash
cd frontend
npm run test
```
