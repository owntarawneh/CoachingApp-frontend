import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../../auth/session";
import "./CoachSidebar.css";

function CoachSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive ? "coachNavLink isActive" : "coachNavLink";

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="coachSidebar">
      <div className="coachBrand">
        <div className="coachBrandTitle">OwnCoaching</div>
        <div className="coachBrandSub">Coach Portal</div>
      </div>

      <nav className="coachNav">
        <NavLink to="/coach/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/coach/clients" className={linkClass}>
          Clients
        </NavLink>

        <NavLink to="/coach/check-ins" className={linkClass}>
          Check-Ins
        </NavLink>
      </nav>

      <div className="coachSidebarSpacer" />

      <div className="coachSidebarFooter">
        <button type="button" className="coachLogoutBtn" onClick={handleLogout}>
          Logout
        </button>

        <div className="coachCopyright">© OwnCoaching</div>
      </div>
    </aside>
  );
}

export default CoachSidebar;
