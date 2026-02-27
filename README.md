# Modern Role-Based Enterprise CRM

A comprehensive, production-ready Customer Relationship Management system built with a React frontend, Node.js + Express backend, Prisma ORM, and MySQL database.

## 🚀 Key Features
- **6 Advanced Dashboards**: Specialized workspaces for Super Admin, Admin, Manager, Team Leader, Counselor, and Support.
- **Real-Time Data Pipelines**: Natively integrated telemetry from the `crm_db` SQL database using Prisma to supply hundreds of components with live statistics.
- **Intelligent Routing & Stages**: Interactive funnel pipelines, automated stage updating, and live SQL reassignment tools.
- **Enterprise UI Aesthetics**: Designed with responsive, beautiful components styled with Tailwind CSS and Framer Motion.
- **Full Scope Security Protocol**: Secured completely via `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `TEAM_LEADER`, `COUNSELOR`, and `SUPPORT` permission roles guarded via strict JWT middleware implementations.

---

## 💻 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Zustand, TanStack Query, React Router v6.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: MySQL.

---

## 🛠️ Installation & Setup (Client Instructions)

### Prerequisites
- Node.js (v18+)
- MySQL Server (Running)

### 1. Database Setup
Ensure you have a MySQL server running and create a blank database:
```sql
CREATE DATABASE crm_db;
```

### 2. Backend Initialization
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
```

Verify your `.env` file credentials inside `backend/.env`. Example:
```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/crm_db"
JWT_SECRET="your_secure_jwt_secret"
FRONTEND_URL="http://localhost:3000"
```

Push the database schema directly to your MySQL server:
```bash
npx prisma generate
npx prisma db push
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Initialization
Open a separate terminal in the `frontend` folder:
```bash
cd frontend
npm install
```

Start the frontend server:
```bash
npm run dev
```

The system will now be live on `http://localhost:3000`.

---

## 📦 Deployment (Production Build)
To compile the frontend for production delivery:
```bash
cd frontend
npm run build
```
This will deposit your optimized files into the `frontend/dist` directory, which can be served flawlessly via Nginx, Apache, or Vercel.

---

## ✨ Final Notes
The logic within the application dynamically synchronizes updates instantly. All UI panels accurately update records directly in your SQL tables using Prisma queries to optimize heavy aggregations seamlessly.
