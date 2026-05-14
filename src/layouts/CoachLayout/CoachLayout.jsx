import { Outlet } from "react-router-dom";
import CoachSidebar from "../../components/navigation/CoachSidebar/CoachSidebar";
import "./CoachLayout.css";

function CoachLayout() {
  return (
    <div className="coachShell">
      <CoachSidebar />

      <main className="coachMain">
        <div className="coachContent">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default CoachLayout;
