import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import CheckInsTable from "../../../../components/coach/CheckInsTable/CheckInsTable";
import { fetchCheckIns } from "../../../../api/checkins.api";
import { fetchClientById } from "../../../../api/clients.api";

/**
 * Map backend statuses to UI statuses
 * Backend: submitted / reviewed
 * UI: Pending / Reviewed
 */
function normalizeStatus(status) {
  const s = String(status || "").trim().toLowerCase();

  if (s === "pending") return "Pending";
  if (s === "submitted") return "Pending";
  if (s === "reviewed") return "Reviewed";

  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function CoachClientCheckInsTab() {
  const { clientId } = useParams();

  const [checkIns, setCheckIns] = useState([]);
  const [clientName, setClientName] = useState(clientId);
  const [loading, setLoading] = useState(true);

  // Load client name + client check-ins
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [client, list] = await Promise.all([
          fetchClientById(clientId).catch(() => null),
          fetchCheckIns(`?clientId=${encodeURIComponent(clientId)}`),
        ]);

        if (!isMounted) return;

        setClientName(client?.name || clientId);

        const normalized = (Array.isArray(list) ? list : []).map((c) => ({
          ...c,
          status: normalizeStatus(c.status),
        }));

        setCheckIns(normalized);
      } catch (err) {
        console.error(err);
        alert("Failed to load client check-ins");
        if (isMounted) {
          setCheckIns([]);
          setClientName(clientId);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const rows = useMemo(() => {
    // API already filtered by clientId, but keep it safe
    const sorted = [...checkIns].sort((a, b) => (a.date < b.date ? 1 : -1));

    return sorted.map((c) => ({
      id: c.id,
      clientName,
      date: c.date,
      status: normalizeStatus(c.status),
    }));
  }, [checkIns, clientName]);

  return (
    <div className="section">
      <CheckInsTable
        rows={rows}
        title="Client Check-Ins"
        emptyText={loading ? "Loading..." : "No check-ins found for this client."}
      />
    </div>
  );
}

export default CoachClientCheckInsTab;
