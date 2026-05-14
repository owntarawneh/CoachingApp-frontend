import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import FormCard from "../../../components/form/FormCard/FormCard";
import HistoryFilters from "../../../components/history/HistoryFilters/HistoryFilters";
import HistoryTable from "../../../components/history/HistoryTable/HistoryTable";
import { formatNumber } from "../../../utils/formatters";
import "./ProgressHistory.css";

import { fetchCheckIns } from "../../../api/checkins.api";
import { getClientId } from "../../../auth/session";

const DEFAULT_FILTERS = { fromDate: "", toDate: "" };

function ProgressHistory() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  const CURRENT_CLIENT_ID = getClientId();

  useEffect(() => {
    let isMounted = true;

    if (!CURRENT_CLIENT_ID) {
      alert("Not logged in as client!");
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    async function load() {
      try {
        setLoading(true);
        const list = await fetchCheckIns(
          `?clientId=${encodeURIComponent(CURRENT_CLIENT_ID)}`
        );

        if (!isMounted) return;
        setCheckIns(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load progress history");
        if (isMounted) setCheckIns([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [CURRENT_CLIENT_ID]);

  const filtered = useMemo(() => {
    return checkIns.filter((c) => {
      if (filters.fromDate && c.date < filters.fromDate) return false;
      if (filters.toDate && c.date > filters.toDate) return false;
      return true;
    });
  }, [filters, checkIns]);

  const summary = useMemo(() => {
    const count = filtered.length;
    if (count === 0) return { count: 0, avgWeight: null };

    const totalWeight = filtered.reduce((sum, c) => sum + Number(c.weight || 0), 0);
    const avgWeight = totalWeight / count;

    return { count, avgWeight: Math.round(avgWeight * 10) / 10 };
  }, [filtered]);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Client / Progress History"
        title="Progress History"
        subtitle="Track your weekly check-ins over time"
      />

      <div className="section">
        <div className="progressLayout">
          {/* LEFT */}
          <div className="progressLeft">
            <FormCard title="Filters">
              <HistoryFilters
                filters={filters}
                onChangeFilters={setFilters}
                onReset={resetFilters}
              />
            </FormCard>

            <FormCard title="Summary (Filtered)">
              <div className="summaryRow">
                <div className="summaryItem">
                  <div className="summaryLabel">Check-ins</div>
                  <div className="summaryValue">{loading ? "—" : summary.count}</div>
                </div>

                <div className="summaryItem">
                  <div className="summaryLabel">Avg Weight</div>
                  <div className="summaryValue">
                    {loading ? "—" : formatNumber(summary.avgWeight, " kg")}
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* RIGHT */}
          <div className="progressRight">
            <HistoryTable
              rows={filtered}
              emptyText={loading ? "Loading..." : "No check-ins match the current filters."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHistory;
