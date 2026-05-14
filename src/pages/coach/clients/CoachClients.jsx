import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ClientsTable from "../../../components/coach/ClientsTable/ClientsTable";

import { fetchClients } from "../../../api/clients.api";

function CoachClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchClients();
        if (!isMounted) return;

        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load clients");
        if (isMounted) setClients([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    // safe sort (won't crash if name is missing)
    return [...clients].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""))
    );
  }, [clients]);

  return (
    <div>
      <PageHeader
        breadcrumb="Coach / Clients"
        title="Clients"
        subtitle="View and manage your client list"
      />

      <div className="section">
        <ClientsTable rows={rows} />
        {loading ? (
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            Loading...
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CoachClients;
