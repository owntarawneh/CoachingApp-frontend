# OwnCoaching — Frontend

> A full-featured online personal coaching platform built with **React + Vite**. Connects clients with their coach through personalized training plans, nutrition guidance, weekly check-ins, and real-time progress tracking.

![Landing Page](Photos%20of%20app/Landing%20page.png)

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
  - [Landing Page](#landing-page)
  - [Client Portal](#client-portal)
  - [Coach Portal](#coach-portal)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Routing Structure](#routing-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

OwnCoaching is a role-based fitness coaching web application with two user types: **Client** and **Coach**. Clients get a personal portal to view their plans, submit weekly check-ins, and track progress. Coaches get a dedicated dashboard to manage all clients, build custom training and nutrition plans, and review weekly submissions with feedback.

---

## Screenshots

### Landing Page

A clean, modern public-facing marketing site that introduces the platform and drives signups.

![Hero Section](Photos%20of%20app/Landing%20page.png)
*Hero section — platform value proposition with live stats*

![Features Section](Photos%20of%20app/Landing%20page%202.png)
*Features section — complete coaching toolkit overview*

![How It Works](Photos%20of%20app/Landing%20page%203.png)
*How it works — 4-step onboarding process*

![For Coaches](Photos%20of%20app/Landing%20page%204.png)
*For Coaches section — client management overview*

![CTA & Footer](Photos%20of%20app/Landing%20page%205.png)
*Call-to-action banner and footer*

---

### Client Portal

A personal dashboard for clients to manage their fitness journey end-to-end.

#### Dashboard

![Client Dashboard](Photos%20of%20app/clinet%20dash.png)
*Client dashboard — training week progress, check-in count, coach notes, and quick actions*

#### Training Plan

![Training Plan](Photos%20of%20app/training%20client.png)
*Training plan — weekly workouts with expandable day accordions, exercises, sets, and reps*

#### Nutrition Plan

![Nutrition Plan](Photos%20of%20app/nutri%20client.png)
*Nutrition plan — daily meal table, macro breakdown chart, calorie targets, and coach notes*

#### Weekly Check-In

![Weekly Check-In](Photos%20of%20app/weekly%20checkin%20client.png)
*Weekly check-in form — weight (kg/lbs), full body measurements (cm/inches), progress photos (front/side/back), and compliance notes*

#### Progress History

![Progress History](Photos%20of%20app/progress%20history%20client.png)
*Progress history — filterable check-in timeline with date range, weight averages, and coach notes*

---

### Coach Portal

A dedicated management hub for coaches to oversee all clients and plans.

#### Coach Dashboard

![Coach Dashboard](Photos%20of%20app/coach%20dash.png)
*Coach dashboard — prioritized view of all pending client check-ins*

#### Client Details Hub

![Client Details - Overview](Photos%20of%20app/coach%20client%20details.png)
*Client hub (Overview tab) — client summary, check-in stats, and quick actions*

#### Client Progress Tab

![Client Progress](Photos%20of%20app/coach%20client%20progress%20history.png)
*Client hub (Progress tab) — filterable progress history view for a specific client*

#### Client Check-In Review

![Check-In Details](Photos%20of%20app/coach%20client%20checkin.png)
*Check-in details — full submission review including weight, body measurements, progress photos, compliance notes, and coach feedback editor*

#### Client Training Plan Tab

![Coach Client Training](Photos%20of%20app/Coach%20client%20training.png)
*Client hub (Training Plan tab) — read-only training plan view with Edit button*

#### Edit Training Plan

![Edit Training Plan](Photos%20of%20app/Coach%20Edit%20Training%20Plan.png)
*Training plan editor — add/remove weeks and days, set week focus, manage exercises per day*

#### Client Nutrition Plan Tab

![Coach Client Nutrition](Photos%20of%20app/Coach%20nutri%20client.png)
*Client hub (Nutrition Plan tab) — nutrition plan view with daily macro breakdown and Edit button*

#### Edit Nutrition Plan

![Edit Nutrition Plan](Photos%20of%20app/Coach%20Edit%20nutri%20Plan.png)
*Nutrition plan editor — plan name, description, duration, daily calorie/macro goals, meals, and coach notes*

---

## Features

### Client
- Personal dashboard with training progress, check-in count, and coach updates
- View weekly training plan — exercises, sets, reps per day
- View daily nutrition plan — meals, calories, macros with visual breakdown
- Submit weekly check-ins — weight, 10 body measurements, 3 progress photos, compliance notes
- Full progress history with date filters and coach feedback
- Personal profile view

### Coach
- Dashboard showing all pending client check-ins sorted by date
- Full client roster management
- Per-client hub with 5 tabs: Overview, Progress, Check-Ins, Training Plan, Nutrition Plan
- Create and edit training plans — weeks → days → exercises (sets, reps, notes)
- Create and edit nutrition plans — plan → days → meals (calories, protein, carbs, fat)
- Review client check-ins with full measurement and photo details
- Write coaching notes visible to clients in their Progress History
- Mark check-ins as reviewed

### Public
- Marketing landing page with features, how-it-works, and for-coaches sections
- Client signup and login
- Role-based redirect after login

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI library |
| React Router DOM | 7.12.0 | Client-side routing |
| Vite | 7.2.4 | Build tool & dev server |
| @vitejs/plugin-react-swc | 4.2.2 | Fast JSX transform (SWC) |
| ESLint | 9.39.1 | Code linting |
| Pure CSS | — | Component-scoped styles + design tokens |
| RapidAPI ExerciseDB | — | Exercise search in training plan editor |

---

## Project Structure

```
src/
├── api/                        # Backend API service layer
│   ├── auth.api.js             # Login / signup
│   ├── checkins.api.js         # Check-in CRUD
│   ├── clients.api.js          # Client data
│   ├── http.js                 # Base fetch utilities
│   ├── nutrition.api.js        # Nutrition plan endpoints
│   └── training.api.js         # Training plan endpoints
│
├── auth/
│   ├── RequireRole.jsx         # Route protection by role
│   └── session.js              # localStorage session helpers
│
├── components/                 # 36 reusable UI components
│   ├── checkin/                # Measurement inputs, photo upload, unit toggle
│   ├── coach/                  # Check-ins table, clients table, notes box
│   ├── common/                 # StatCard, PageHeader, Tabs, ActionCard, etc.
│   ├── form/                   # FormCard, TextInput, SelectInput
│   ├── history/                # History table + date filters
│   ├── navigation/             # ClientSidebar, CoachSidebar, Topbar
│   ├── nutrition/              # Meal cards, macro chart, plan/day selectors
│   ├── profile/                # ProfileCard, ReadOnlyField
│   └── training/               # Exercise tables, day accordion, week selector
│
├── layouts/
│   ├── ClientLayout/           # Client app shell
│   └── CoachLayout/            # Coach app shell
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
│   ├── globals.css             # Global resets
│   └── theme.css               # Theme overrides
│
├── utils/
│   └── formatters.js           # Number and date formatting helpers
│
├── App.jsx
└── main.jsx
```

---

## Authentication Flow

Sessions are stored in `localStorage` under `owncoaching_session_v1`:

```js
{
  userId: string,
  role: "client" | "coach",
  clientId?: string,   // clients only
  email?: string
}
```

| Step | Details |
|---|---|
| **Signup** | `POST /auth/signup` — creates a client account, stores session, redirects to `/client/dashboard` |
| **Login** | `POST /auth/login` — returns role, redirects to `/client/dashboard` or `/coach/dashboard` |
| **Route Guard** | `RequireRole.jsx` wraps all protected routes — redirects unauthenticated or wrong-role users |
| **Logout** | `/logout` route clears session and redirects to `/login` |

---

## Routing Structure

```
/                                    → Landing Page (public)
/login                               → Login
/signup                              → Signup
/logout                              → Clear session → /login

/client/*                            → Protected (role: client)
  /client/dashboard
  /client/training-plan
  /client/nutrition-plan
  /client/weekly-check-in
  /client/progress-history
  /client/profile

/coach/*                             → Protected (role: coach)
  /coach/dashboard
  /coach/clients
  /coach/clients/:clientId           → Tabbed hub
    /overview
    /progress
    /check-ins
    /training
    /nutrition
  /coach/clients/:clientId/training/edit
  /coach/clients/:clientId/nutrition/edit
  /coach/check-ins
  /coach/check-ins/:checkInId

*                                    → Redirect to /login
```

---

## Environment Variables

Create a `.env` file in the project root (see `.env.sample`):

```env
VITE_API_BASE=http://localhost:5000/api
VITE_EXERCISEDB_HOST=exercisedb.p.rapidapi.com
VITE_RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
```

| Variable | Description |
|---|---|
| `VITE_API_BASE` | Base URL of the backend REST API |
| `VITE_EXERCISEDB_HOST` | RapidAPI host for ExerciseDB |
| `VITE_RAPIDAPI_KEY` | RapidAPI key for exercise search feature |

---

## Getting Started

**Prerequisites:** Node.js 16+, npm, and a running backend at the URL set in `VITE_API_BASE`.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.sample .env
# Edit .env with your backend URL and RapidAPI key

# 3. Start development server
npm run dev
```

App runs at **http://localhost:5173**

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

> © 2025 OwnCoaching. All rights reserved.
