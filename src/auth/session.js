const KEY = "owncoaching_session_v1";

/**
 * Stored shape:
 * {
 *   userId: string|number,
 *   role: "coach"|"client",
 *   clientId?: string|null,   // for client only
 *   email?: string
 * }
 */

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session || {}));
}

export function getSession() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function getRole() {
  const s = getSession();
  return String(s?.role || "").toLowerCase();
}

export function getUserId() {
  const s = getSession();
  return s?.userId != null ? String(s.userId) : "";
}

/**
 * IMPORTANT:
 * clientId is NOT the same as userId.
 * clientId refers to clients.id (TEXT like "c1").
 */
export function getClientId() {
  const s = getSession();
  return s?.clientId ? String(s.clientId) : "";
}

export function isLoggedIn() {
  return !!getRole() && !!getUserId();
}

export function isClientLoggedIn() {
  return getRole() === "client" && !!getUserId() && !!getClientId();
}

export function isCoachLoggedIn() {
  return getRole() === "coach" && !!getUserId();
}
