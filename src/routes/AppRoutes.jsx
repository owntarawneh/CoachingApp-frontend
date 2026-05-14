import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

/* ========== LANDING ========== */
import LandingPage from "../pages/landing/LandingPage";

/* ========== AUTH ========== */
import RequireRole from "../auth/RequireRole";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import { clearSession } from "../auth/session";

/* ========== CLIENT ========== */
import ClientLayout from "../layouts/ClientLayout/ClientLayout";
import ClientDashboard from "../pages/client/Dashboard/ClientDashboard";
import TrainingPlan from "../pages/client/TrainingPlan/TrainingPlan";
import NutritionPlan from "../pages/client/NutritionPlan/NutritionPlan";
import WeeklyCheckIn from "../pages/client/WeeklyCheckIn/WeeklyCheckIn";
import ProgressHistory from "../pages/client/ProgressHistory/ProgressHistory";
import ClientProfile from "../pages/client/ClientProfile/ClientProfile";

/* ========== COACH ========== */
import CoachLayout from "../layouts/CoachLayout/CoachLayout";
import CoachDashboard from "../pages/coach/Dashboard/CoachDashboard";
import CoachClients from "../pages/coach/clients/CoachClients";

import CoachClientDetails from "../pages/coach/clients/CoachClientDetails";
import CoachClientOverviewTab from "../pages/coach/clients/tabs/CoachClientOverviewTab.jsx";
import CoachClientProgressTab from "../pages/coach/clients/tabs/CoachClientProgressTab";
import CoachClientCheckInsTab from "../pages/coach/clients/tabs/CoachClientCheckInsTab";
import CoachClientTrainingTab from "../pages/coach/clients/tabs/CoachClientTrainingTab";
import CoachClientNutritionTab from "../pages/coach/clients/tabs/CoachClientNutritionTab";

import CoachCheckInsInbox from "../pages/coach/CheckIns/CoachCheckInsInbox";
import CoachCheckInDetails from "../pages/coach/CheckIns/CoachCheckInDetails";

import CoachClientTrainingEdit from "../pages/coach/clients/edit/CoachClientTrainingEdit";
import CoachClientNutritionEdit from "../pages/coach/clients/edit/CoachClientNutritionEdit";

/**
 * OPTIONAL: /logout route (no Logout.jsx file needed)
 * Clears session then redirects to /login
 */
function LogoutRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // no UI needed
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT — Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH ROUTES (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* OPTIONAL LOGOUT ROUTE */}
        <Route path="/logout" element={<LogoutRoute />} />

        {/* ================= CLIENT ROUTES (protected) ================= */}
        <Route
          path="/client/*"
          element={
            <RequireRole role="client">
              <ClientLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="training-plan" element={<TrainingPlan />} />
          <Route path="nutrition-plan" element={<NutritionPlan />} />
          <Route path="weekly-check-in" element={<WeeklyCheckIn />} />
          <Route path="progress-history" element={<ProgressHistory />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* ================= COACH ROUTES (protected) ================= */}
        <Route
          path="/coach/*"
          element={
            <RequireRole role="coach">
              <CoachLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="clients" element={<CoachClients />} />

          {/* Edit routes (outside tabs) */}
          <Route
            path="clients/:clientId/training/edit"
            element={<CoachClientTrainingEdit />}
          />
          <Route
            path="clients/:clientId/nutrition/edit"
            element={<CoachClientNutritionEdit />}
          />

          {/* Client details + tabs */}
          <Route path="clients/:clientId" element={<CoachClientDetails />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CoachClientOverviewTab />} />
            <Route path="progress" element={<CoachClientProgressTab />} />
            <Route path="check-ins" element={<CoachClientCheckInsTab />} />
            <Route path="training" element={<CoachClientTrainingTab />} />
            <Route path="nutrition" element={<CoachClientNutritionTab />} />
          </Route>

          {/* Check-ins */}
          <Route path="check-ins" element={<CoachCheckInsInbox />} />
          <Route path="check-ins/:checkInId" element={<CoachCheckInDetails />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
