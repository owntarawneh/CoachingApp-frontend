# OwnCoaching Frontend (React)

This is the **frontend** of **OwnCoaching**, a fitness coaching web application built with **React + Vite**.

## Description

OwnCoaching is a role-based fitness coaching platform with **two user types**:

- **Clients**
- **Coach (Admin)**

The frontend communicates with a Node.js + PostgreSQL backend and renders different dashboards depending on the logged-in user role.

## User Roles & Behavior

### Client
- Log in / Sign up with email and password
- View personal dashboard
- View training plan
- View nutrition plan
- Submit weekly check-ins
- Track progress history
- Edit personal profile

### coach
- Log in with predefined admin account
- View coach dashboard
- View all clients
- Review client check-ins
- Add coach notes
- Edit client training and nutrition plans

## Authentication Flow

- Users log in using email + password
- Role is determined by the backend
- Session is stored in `localStorage`
- Routes are protected using role-based guards

## Technologies

- React 18
- Vite
- React Router
- Fetch API
- LocalStorage

## Environment Variables

Create a `.env` file based on `.env.sample`:

```
VITE_API_BASE=http://localhost:5000/api
VITE_EXERCISEDB_HOST=exercisedb.p.rapidapi.com
VITE_RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
```

## Getting Started

```
cd owncoaching-frontend
npm install
npm run dev
```

App runs on: http://localhost:5173
