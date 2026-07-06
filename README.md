# Student Management System

A full-stack MERN application for managing students, teachers, classes, subjects, attendance, assignments and marks.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite 8, Tailwind CSS, Axios   |
| Backend   | Node.js, Express, MongoDB, Mongoose     |
| Auth      | JWT, bcryptjs, Role-based authorization |
| Security  | Helmet, CORS, Rate limiting, HPP        |

## Roles

- **Admin** — Manage students, teachers, classes, subjects
- **Teacher** — Mark attendance, create assignments, upload marks
- **Student** — View profile, attendance, assignments, marks

## Setup

### Backend
```bash
cd backend
cp .env.example .env      # fill in your MongoDB URI and JWT secret
npm install
npm run dev               # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

## Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/student_management
JWT_SECRET=<your-random-secret>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```
