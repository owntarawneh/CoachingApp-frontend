import { Navigate } from "react-router-dom";
import { getRole, getClientId, isLoggedIn, clearSession } from "./session";

/**
 * Protect routes by role.
 */
function RequireRole({ role, children }) {
  const currentRole = String(getRole() || "").toLowerCase();

  // Not logged in
  if (!isLoggedIn() || !currentRole) {
    return <Navigate to="/login" replace />;
  }

  // Extra safety: client must have clientId
  if (currentRole === "client" && !getClientId()) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (currentRole !== role) {
    if (currentRole === "coach") return <Navigate to="/coach/dashboard" replace />;
    if (currentRole === "client") return <Navigate to="/client/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireRole;
