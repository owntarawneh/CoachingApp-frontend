import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import CheckInsTable from "../../../components/coach/CheckInsTable/CheckInsTable";
import "./CoachDashboard.css";
import { fetchCheckIns } from "../../../api/checkins.api";
import { fetchClients } from "../../../api/clients.api";

function normalizeStatus(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "submitted") return "Pending";
  if (s === "reviewed") return "Reviewed";
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function CoachDashboard() {
  const [checkIns, setCheckIns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [checkInsData, clientsData] = await Promise.all([
          fetchCheckIns(""),
          fetchClients(),
        ]);

        if (!isMounted) return;

        const normalizedCheckIns = (Array.isArray(checkInsData) ? checkInsData : []).map(
          (c) => ({ ...c, status: normalizeStatus(c.status) })
        );

        setCheckIns(normalizedCheckIns);
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load coach dashboard");
        if (isMounted) {
          setCheckIns([]);
          setClients([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const clientNameById = useMemo(() => {
    const map = {};
    for (const c of clients) {
      if (c && c.id) map[c.id] = c.name || c.id;
    }
    return map;
  }, [clients]);

  const pendingRows = useMemo(() => {
    const pending = checkIns.filter((c) => normalizeStatus(c.status) === "Pending");

    // newest first
    const sorted = [...pending].sort((a, b) => (a.date < b.date ? 1 : -1));

    return sorted.map((c) => ({
      id: c.id,
      clientName: clientNameById[c.clientId] || c.clientId,
      date: c.date,
      status: normalizeStatus(c.status),
    }));
  }, [checkIns, clientNameById]);

  return (
    <div>
      <PageHeader
        breadcrumb="Coach / Dashboard"
        title="Coach Dashboard"
        subtitle="Priorities for today"
      />

      <div className="section">
        <CheckInsTable
          rows={pendingRows}
          title="Pending Check-Ins"
          emptyText={loading ? "Loading..." : "No pending check-ins."}
        />
      </div>
    </div>
  );
}

export default CoachDashboard;
