import { Outlet } from "react-router-dom";
import ClientSidebar from "../../components/navigation/ClientSidebar/ClientSidebar";
import "./ClientLayout.css";

function ClientLayout() {
  return (
    <div className="clientLayout">
      <ClientSidebar />

      <div className="clientMain">
        <main className="clientContent page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ClientLayout;
