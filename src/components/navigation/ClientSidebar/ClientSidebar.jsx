import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../../auth/session";
import "./ClientSidebar.css";

function ClientSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  const linkClass = ({ isActive }) => (isActive ? "navItem active" : "navItem");

  return (
    <aside className="sidebar">
      <div className="sidebarBrand">
        <div className="sidebarLogo">OwnCoaching</div>
        <div className="sidebarSub">Client Portal</div>
      </div>

      <nav className="sidebarNav">
        <NavLink to="/client/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/client/training-plan" className={linkClass}>
          Training Plan
        </NavLink>

        <NavLink to="/client/nutrition-plan" className={linkClass}>
          Nutrition Plan
        </NavLink>

        <NavLink to="/client/weekly-check-in" className={linkClass}>
          Weekly Check-In
        </NavLink>

        <NavLink to="/client/progress-history" className={linkClass}>
          Progress History
        </NavLink>

        <NavLink to="/client/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      <div className="sidebarSpacer" />

      <div className="sidebarFooter">
        <button type="button" className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default ClientSidebar;
