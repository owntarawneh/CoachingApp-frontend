import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CoachClientOverviewTab.css";

import { fetchClientById } from "../../../../api/clients.api";
import { fetchCheckIns } from "../../../../api/checkins.api";

function normalizeStatus(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "submitted") return "Pending";
  if (s === "reviewed") return "Reviewed";
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function CoachClientOverviewTab() {
  const { clientId } = useParams();

  const [client, setClient] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load client + check-ins from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);

        const [clientData, checkInsData] = await Promise.all([
          fetchClientById(clientId).catch(() => null),
          fetchCheckIns(`?clientId=${encodeURIComponent(clientId)}`).catch(() => []),
        ]);

        if (!isMounted) return;

        setClient(clientData || null);

        const normalized = (Array.isArray(checkInsData) ? checkInsData : []).map((c) => ({
          ...c,
          status: normalizeStatus(c.status),
        }));

        setCheckIns(normalized);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setClient(null);
          setCheckIns([]);
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

  const stats = useMemo(() => {
    const mine = checkIns;

    const pending = mine.filter((c) => normalizeStatus(c.status) === "Pending").length;
    const reviewed = mine.filter((c) => normalizeStatus(c.status) === "Reviewed").length;

    const sorted = [...mine].sort((a, b) => (a.date < b.date ? 1 : -1));
    const lastDate = sorted[0]?.date || "-";

    return {
      total: mine.length,
      pending,
      reviewed,
      lastDate,
    };
  }, [checkIns]);

  if (loading) {
    return (
      <div className="card" style={{ padding: 16 }}>
        Loading...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="card" style={{ padding: 16 }}>
        Client not found: <strong>{clientId}</strong>
      </div>
    );
  }

  return (
    <div className="overviewWrap">
      <div className="card overviewCard">
        <div className="overviewTitle">Client Summary</div>

        <div className="overviewGrid">
          <div className="overviewItem">
            <div className="overviewLabel">Client Name</div>
            <div className="overviewValue">{client.name || clientId}</div>
          </div>

          <div className="overviewItem">
            <div className="overviewLabel">Client ID</div>
            <div className="overviewValue">{client.id || clientId}</div>
          </div>

          <div className="overviewItem">
            <div className="overviewLabel">Last Check-In</div>
            <div className="overviewValue">{stats.lastDate}</div>
          </div>
        </div>
      </div>

      <div className="overviewRow">
        <div className="card overviewCard">
          <div className="overviewTitle">Check-Ins</div>

          <div className="miniStats">
            <div className="miniStat">
              <div className="miniLabel">Total</div>
              <div className="miniValue">{stats.total}</div>
            </div>

            <div className="miniStat">
              <div className="miniLabel">Pending</div>
              <div className="miniValue">{stats.pending}</div>
            </div>

            <div className="miniStat">
              <div className="miniLabel">Reviewed</div>
              <div className="miniValue">{stats.reviewed}</div>
            </div>
          </div>

          <div className="overviewActions">
            <Link className="reviewBtn" to={`/coach/clients/${clientId}/check-ins`}>
              View Check-Ins
            </Link>
          </div>
        </div>

        <div className="card overviewCard">
          <div className="overviewTitle">Quick Actions</div>

          <div className="quickLinks">
            <Link className="quickLink" to={`/coach/clients/${clientId}/training/edit`}>
              Edit Training Plan →
            </Link>

            <Link className="quickLink" to={`/coach/clients/${clientId}/nutrition/edit`}>
              Edit Nutrition Plan →
            </Link>

            <Link className="quickLink" to={`/coach/check-ins`}>
              Open Check-Ins Inbox →
            </Link>
          </div>

          <div className="overviewHint">Tip: Review pending check-ins first, then adjust plans.</div>
        </div>
      </div>
    </div>
  );
}

export default CoachClientOverviewTab;
