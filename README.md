# OwnCoaching — Frontend

The frontend of **OwnCoaching**, a full-featured online personal coaching platform built with **React + Vite**. It supports two distinct user roles — **Client** and **Coach** — each with their own dashboard, features, and protected routes.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Screens](#pages--screens)
- [Authentication Flow](#authentication-flow)
- [Routing Structure](#routing-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

OwnCoaching connects clients with their personal coach through a shared platform. Clients can view their training and nutrition plans, submit weekly check-ins with weight, measurements, and progress photos, and track their results over time. Coaches get a dedicated dashboard to manage clients, edit plans, and review check-ins with feedback notes.

---

## Features

### Client
- View personalized weekly training plans (exercises, sets, reps)
- View daily nutrition plans (meals, calories, macros)
- Submit weekly check-ins (weight, body measurements, progress photos)
- Track full progress history with date and status filters
- View and manage personal profile

### Coach
- Dashboard showing all pending client check-ins
- Full client roster with individual client hubs
- Create and edit training plans per client (weeks → days → exercises)
- Create and edit nutrition plans per client (plans → days → meals)
- Review client check-ins, add coaching notes, and mark as reviewed
- View client progress history and measurement trends

### Public
- Marketing landing page with feature overview
- Client signup and login
- Role-based redirect on login (client or coach dashboard)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI library |
| React Router DOM | 7.12.0 | Client-side routing |
| Vite | 7.2.4 | Build tool & dev server |
| @vitejs/plugin-react-swc | 4.2.2 | Fast JSX transform |
| ESLint | 9.39.1 | Code linting |
| Pure CSS | — | Styling (design tokens + component CSS) |
| RapidAPI ExerciseDB | — | Exercise search for coach plan editor |

---

## Project Structure

```
src/
├── api/                        # Backend API service layer
│   ├── auth.api.js             # Login / signup
│   ├── checkins.api.js         # Check-in CRUD
│   ├── clients.api.js          # Client data
│   ├── http.js                 # Base fetch utilities (GET, POST, PUT)
│   ├── nutrition.api.js        # Nutrition plan endpoints
│   └── training.api.js         # Training plan endpoints
│
├── auth/                       # Auth & session management
│   ├── RequireRole.jsx         # Protects routes by role
│   └── session.js              # localStorage session helpers
│
├── components/                 # 36 reusable UI components
│   ├── checkin/                # Check-in form inputs
│   ├── coach/                  # Coach-specific UI (tables, notes)
│   ├── common/                 # Shared (StatCard, PageHeader, Tabs, etc.)
│   ├── form/                   # Controlled form inputs
│   ├── history/                # Progress history table + filters
│   ├── navigation/             # Sidebars, Topbar
│   ├── nutrition/              # Meal cards, macro breakdown, plan selectors
│   ├── profile/                # Profile display components
│   └── training/               # Exercise tables, day accordion, week selector
│
├── layouts/
│   ├── ClientLayout/           # Client app shell (sidebar + topbar)
│   └── CoachLayout/            # Coach app shell (sidebar + topbar)
│
├── pages/
│   ├── auth/                   # Login, Signup
│   ├── client/                 # Dashboard, Training, Nutrition, CheckIn, Progress, Profile
│   ├── coach/                  # Dashboard, Clients, CheckIns, Plan Editors
│   └── landing/                # Public marketing page
│
├── routes/
│   └── AppRoutes.jsx           # Full route tree with role protection
│
├── services/
│   └── exerciseDBService.js    # RapidAPI ExerciseDB integration
│
├── styles/
│   ├── tokens.css              # Design tokens (colors, spacing, shadows)
│   ├── globals.css             # Global CSS resets
│   └── theme.css               # Theme overrides
│
├── utils/
│   └── formatters.js           # Number and date formatting helpers
│
├── App.jsx
└── main.jsx
```

---

## Pages & Screens

### Public
| Page | Path | Description |
|---|---|---|
| Landing Page | `/` | Marketing page: hero, features, how it works, coach section, CTA |
| Login | `/login` | Email + password login, redirects by role |
| Signup | `/signup` | Creates a client account by default |

### Client
| Page | Path | Description |
|---|---|---|
| Dashboard | `/client/dashboard` | Overview: training week, check-in count, recent coach notes, quick actions |
| Training Plan | `/client/training-plan` | Weekly workouts with day accordions and exercise details |
| Nutrition Plan | `/client/nutrition-plan` | Daily meals with calorie/macro targets and coach notes |
| Weekly Check-In | `/client/weekly-check-in` | Submit weight (kg/lbs), body measurements, progress photos |
| Progress History | `/client/progress-history` | Full check-in timeline with date and status filters |
| Profile | `/client/profile` | View personal profile info |

### Coach
| Page | Path | Description |
|---|---|---|
| Dashboard | `/coach/dashboard` | Pending check-ins table sorted by newest |
| Clients | `/coach/clients` | Full client roster |
| Client Hub | `/coach/clients/:clientId` | Tabbed hub: Overview, Progress, Check-Ins, Training, Nutrition |
| Training Editor | `/coach/clients/:clientId/training/edit` | Add/edit weeks, days, exercises per client |
| Nutrition Editor | `/coach/clients/:clientId/nutrition/edit` | Add/edit plans, days, meals per client |
| Check-Ins Inbox | `/coach/check-ins` | Paginated list with All / Pending / Reviewed filter |
| Check-In Review | `/coach/check-ins/:checkInId` | View measurements, photos, add notes, mark reviewed |

---

## Authentication Flow

Session is stored in `localStorage` under the key `owncoaching_session_v1` with the shape:

```js
{
  userId: string,
  role: "client" | "coach",
  clientId?: string,   // clients only
  email?: string
}
```

**Signup** — `POST /auth/signup`
- Creates a client account (role defaults to `"client"`)
- Stores session and redirects to `/client/dashboard`

**Login** — `POST /auth/login`
- Returns role from backend
- Redirects to `/client/dashboard` or `/coach/dashboard` based on role

**Route Protection** — `RequireRole.jsx`
- Wraps all `/client/*` and `/coach/*` routes
- Redirects unauthenticated users to `/login`
- Redirects wrong-role users to their own dashboard
- Clients must also have a valid `clientId` or session is cleared

**Logout** — `/logout` route
- Clears session from localStorage
- Redirects to `/login`

---

## Routing Structure

```
/                          → Landing Page (public)
/login                     → Login (public)
/signup                    → Signup (public)
/logout                    → Clears session → /login

/client/*                  → Protected (role: client)
  /client/dashboard
  /client/training-plan
  /client/nutrition-plan
  /client/weekly-check-in
  /client/progress-history
  /client/profile

/coach/*                   → Protected (role: coach)
  /coach/dashboard
  /coach/clients
  /coach/clients/:clientId
    /overview
    /progress
    /check-ins
    /training
    /nutrition
  /coach/clients/:clientId/training/edit
  /coach/clients/:clientId/nutrition/edit
  /coach/check-ins
  /coach/check-ins/:checkInId

*                          → Redirect to /login
```

---

## Environment Variables

Create a `.env` file in the project root based on `.env.sample`:

```
VITE_API_BASE=http://localhost:5000/api
VITE_EXERCISEDB_HOST=exercisedb.p.rapidapi.com
VITE_RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
```

| Variable | Description |
|---|---|
| `VITE_API_BASE` | Base URL for the backend REST API |
| `VITE_EXERCISEDB_HOST` | RapidAPI host for ExerciseDB |
| `VITE_RAPIDAPI_KEY` | Your RapidAPI key (used in coach training plan editor) |

---

## Getting Started

**Prerequisites:** Node.js 16+, npm, and a running backend at the URL set in `VITE_API_BASE`.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.sample .env
# Edit .env with your API base URL and RapidAPI key

# 3. Start the development server
npm run dev
```

App runs at: **http://localhost:5173**

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```
