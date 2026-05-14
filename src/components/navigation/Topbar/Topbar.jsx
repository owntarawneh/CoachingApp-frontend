import { useLocation } from "react-router-dom";
import "./Topbar.css";

const TITLE_MAP = {
  "/client/dashboard": "Dashboard",
  "/client/training-plan": "Training Plan",
  "/client/nutrition-plan": "Nutrition Plan",
  "/client/weekly-check-in": "Weekly Check-In",
  "/client/progress-history": "Progress History",
  "/client/profile": "Profile",
};

function Topbar() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] || "Client";

  return (
    <header className="topbar">
      <div className="topbarLeft">
        <div className="topbarTitle">{title}</div>
        <div className="topbarSub">OwnCoaching Client Portal</div>
      </div>

      <div className="topbarRight">
        <div className="topbarAvatar">C</div>
      </div>
    </header>
  );
}

export default Topbar;
