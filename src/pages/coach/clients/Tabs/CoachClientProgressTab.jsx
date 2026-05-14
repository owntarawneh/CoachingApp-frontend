import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import FormCard from "../../../../components/form/FormCard/FormCard";
import HistoryFilters from "../../../../components/history/HistoryFilters/HistoryFilters";
import HistoryTable from "../../../../components/history/HistoryTable/HistoryTable";

import { fetchCheckIns } from "../../../../api/checkins.api";
import { formatNumber } from "../../../../utils/formatters";

import "./CoachClientProgressTab.css";

// Reuse the SAME layout CSS as client Progress History
import "../../../client/ProgressHistory/ProgressHistory.css";

const DEFAULT_FILTERS = {
  fromDate: "",
  toDate: "",
};

function CoachClientProgressTab() {
  const { clientId } = useParams();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const list = await fetchCheckIns(
          `?clientId=${encodeURIComponent(clientId)}`
        );

        if (!isMounted) return;

        setCheckIns(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load client progress");
        if (isMounted) setCheckIns([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const clientRows = useMemo(() => {
    return [...checkIns].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [checkIns]);

  const filtered = useMemo(() => {
    return clientRows.filter((c) => {
      if (filters.fromDate && c.date < filters.fromDate) return false;
      if (filters.toDate && c.date > filters.toDate) return false;
      return true;
    });
  }, [clientRows, filters]);

  const summary = useMemo(() => {
    const count = filtered.length;
    if (count === 0) return { count: 0, avgWeight: null };

    const totalWeight = filtered.reduce(
      (sum, c) => sum + Number(c.weight || 0),
      0
    );
    const avgWeight = totalWeight / count;

    return { count, avgWeight: Math.round(avgWeight * 10) / 10 };
  }, [filtered]);

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="coachProgressTab">
      <div className="progressLayout">
        <div className="progressLeft">
          <div className="section">
            <FormCard title="Filters">
              <HistoryFilters
                filters={filters}
                onChangeFilters={setFilters}
                onReset={resetFilters}
              />
            </FormCard>
          </div>

          <div className="section">
            <FormCard title="Summary (Filtered)">
              <div className="summaryRow">
                <div className="summaryItem">
                  <div className="summaryLabel">Check-ins</div>
                  <div className="summaryValue">
                    {loading ? "-" : summary.count}
                  </div>
                </div>

                <div className="summaryItem">
                  <div className="summaryLabel">Avg Weight</div>
                  <div className="summaryValue">
                    {loading ? "-" : formatNumber(summary.avgWeight, " kg")}
                  </div>
                </div>
              </div>
            </FormCard>
          </div>
        </div>

        <div className="progressRight">
          <div className="section">
            <HistoryTable
              rows={filtered}
              emptyText={loading ? "Loading..." : "No check-ins found."}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachClientProgressTab;
