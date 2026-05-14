import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import CheckInsTable from "../../../components/coach/CheckInsTable/CheckInsTable";
import "./CoachCheckInsInbox.css";

import { fetchCheckIns } from "../../../api/checkins.api";
import { fetchClients } from "../../../api/clients.api";

const STATUS_OPTIONS = ["All", "Pending", "Reviewed"];

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

  // fallback
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function CoachCheckInsInbox() {
  const [status, setStatus] = useState("All");
  const [checkIns, setCheckIns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load check-ins + clients from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [checkInsData, clientsData] = await Promise.all([
          fetchCheckIns(""),
          fetchClients(),
        ]);

        if (!isMounted) return;

        // Normalize check-ins status for UI
        const normalizedCheckIns = (
          Array.isArray(checkInsData) ? checkInsData : []
        ).map((c) => ({
          ...c,
          status: normalizeStatus(c.status),
        }));

        setCheckIns(normalizedCheckIns);
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load check-ins");
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

  // quick lookup: clientId -> name
  const clientNameById = useMemo(() => {
    const map = {};
    for (const c of clients) {
      if (c && c.id) map[c.id] = c.name || c.id;
    }
    return map;
  }, [clients]);

  const rows = useMemo(() => {
    const filtered =
      status === "All"
        ? checkIns
        : checkIns.filter((c) => normalizeStatus(c.status) === status);

    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));

    return sorted.map((c) => ({
      id: c.id,
      clientName: clientNameById[c.clientId] || c.clientId,
      date: c.date,
      status: normalizeStatus(c.status),
    }));
  }, [status, checkIns, clientNameById]);

  const summary = useMemo(() => {
    const pending = checkIns.filter(
      (c) => normalizeStatus(c.status) === "Pending"
    ).length;
    const reviewed = checkIns.filter(
      (c) => normalizeStatus(c.status) === "Reviewed"
    ).length;
    return { pending, reviewed, total: checkIns.length };
  }, [checkIns]);

  return (
    <div>
      <PageHeader
        breadcrumb="Coach / Check-Ins"
        title="Check-Ins Inbox"
        subtitle="Review client submissions and add coaching feedback"
      />

      {/* ✅ NEW: centered container so stats row and table align */}
      <div className="checkInsPage">
        <div className="checkInsInboxTop">
          <div className="checkInsStats">
            <div className="checkInsStat">
              <div className="checkInsStatLabel">Total</div>
              <div className="checkInsStatValue">{summary.total}</div>
            </div>

            <div className="checkInsStat">
              <div className="checkInsStatLabel">Pending</div>
              <div className="checkInsStatValue">{summary.pending}</div>
            </div>

            <div className="checkInsStat">
              <div className="checkInsStatLabel">Reviewed</div>
              <div className="checkInsStatValue">{summary.reviewed}</div>
            </div>
          </div>

          <div className="checkInsFilter">
            <label className="checkInsFilterLabel">Status</label>
            <select
              className="checkInsSelect"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="section">
          <CheckInsTable
            rows={rows}
            title={status === "All" ? "All Check-Ins" : `${status} Check-Ins`}
            emptyText={loading ? "Loading..." : "No check-ins match this filter."}
          />
        </div>
      </div>
    </div>
  );
}

export default CoachCheckInsInbox;
