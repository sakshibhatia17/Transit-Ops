# 🚍 TransitOps – Smart Fleet & Transit Operations Platform

> A full-stack fleet management platform built during a hackathon to streamline vehicle operations, driver management, fleet monitoring, and operational analytics through a modern web dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000)

---

# 📖 Overview

TransitOps is a centralized fleet management solution that helps transport operators manage vehicles, drivers, trips, maintenance activities, operational analytics, and secure access control from a single dashboard.

The project was developed as a hackathon prototype with a scalable backend architecture and a modern responsive frontend.

---

# ✨ Current Features

## 🔐 Authentication

- Secure Login
- JWT Authentication
- Password Hashing (BCrypt)
- Role-Based Access Control
- Protected Routes
- Authentication-ready frontend integration

### Supported Roles

- Admin
- Fleet Manager
- Financial Analyst

---

## 📊 Dashboard

- Fleet Overview
- Driver Overview
- Vehicle Status Summary
- Operational Statistics Cards
- Analytics Dashboard Layout
- Responsive Design

---

## 🚗 Vehicle Management

- Vehicle Listing
- Fleet Summary Cards
- Vehicle Status Indicators
- Search Interface
- CRUD-ready UI
- Backend CRUD APIs

---

## 👨‍✈️ Driver Management

- Driver Listing
- Driver Status Overview
- Experience Information
- Search Interface
- CRUD-ready UI
- Backend CRUD APIs

---

## 🚚 Fleet Operations

- Fleet Operations APIs
- Business Rule Validation
- Dispatch Validation
- Status Management

---

## 🔧 Maintenance

- Maintenance Dashboard
- Maintenance Management UI
- Service Tracking Interface

---

## ⛽ Fuel & Expenses

- Fuel Management Interface
- Expense Tracking Dashboard

---

## 📈 Reports

- Reports Dashboard
- Analytics Layout
- Data Visualization Ready

---

## 🎨 User Experience

- Responsive Design
- Sidebar Navigation
- Navbar
- Theme Toggle Infrastructure
- Loading States
- Error Handling
- Consistent Design System

---

# 🧠 Business Rules Engine

TransitOps includes centralized validation logic for enforcing operational rules.

### Vehicle Rules

- Unique Registration Number
- Vehicle Status Validation
- Dispatch Eligibility
- Maintenance Restrictions

### Driver Rules

- License Validation
- Driver Assignment Validation
- Status Validation

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- BCrypt
- Zod

---

## Database

- Neon PostgreSQL

---

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → Neon

---

# 📂 Project Structure

```text
TransitOps
│
├── frontend
│   ├── api
│   ├── components
│   ├── context
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── types
│   └── utils
│
└── backend
    ├── prisma
    ├── controllers
    ├── middleware
    ├── routes
    ├── services
    ├── validators
    └── utils
```

---

# 🔐 Authentication Flow

```
Login
   │
   ▼
JWT Generated
   │
   ▼
Stored in Browser
   │
   ▼
Bearer Token
   │
   ▼
Protected APIs
```

---

# 📡 API Overview

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Dashboard

- GET `/api/dashboard/stats`

### Vehicles

- Create Vehicle
- Get Vehicles
- Update Vehicle
- Delete Vehicle

### Drivers

- Create Driver
- Get Drivers
- Update Driver
- Delete Driver

---

# 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `sakshi@test.com` | `Password@123` |

> **Note:** This hackathon prototype includes a pre-configured Admin account for demonstration purposes. The current frontend exposes the login flow only.

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/sakshibhatia17/Transit-Ops.git
```

### Backend

```bash
cd backend
npm install

npx prisma generate

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔮 Roadmap

The following features are planned as future enhancements:

- ✅ Live frontend-backend API integration
- 🚛 Complete Trip Management
- 📍 Live GPS Vehicle Tracking
- ⛽ Advanced Fuel Analytics
- 🔧 Predictive Maintenance Scheduling
- 📊 Advanced Reports & Charts
- 🔔 Real-time Notifications
- 📱 Mobile Responsive PWA
- 🤖 AI-powered Route Optimization
- 📈 Fleet Performance Forecasting

---

# 👥 Team

Developed collaboratively during a hackathon.

Contributions included:

- Frontend Development
- Backend Development
- API Design
- Database Design
- Authentication
- Business Rules Engine
- Dashboard Development
- Deployment
- Documentation

---

# 📄 License

Developed for educational and hackathon purposes.

---

⭐ If you found this project interesting, consider starring the repository.
