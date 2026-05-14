import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import WeekSelector from "../../../../components/training/WeekSelector/WeekSelector";
import DayAccordion from "../../../../components/training/DayAccordion/DayAccordion";

import { fetchTrainingPlan } from "../../../../api/training.api";

/**
 * Helpers (plain JS, course style)
 */
function clampMin(n, min) {
  const v = Number(n);
  if (Number.isNaN(v)) return min;
  return Math.max(min, v);
}

function safeText(v) {
  return String(v ?? "").trim();
}

function buildWeek(weekNumber) {
  return {
    weekNumber,
    focus: "",
    days: [{ day: "Day 1 - Custom", exercises: [] }],
  };
}

function normalizePlan(raw) {
  const base =
    raw && typeof raw === "object"
      ? raw
      : { planName: "Starter Plan", durationWeeks: 1, currentWeek: 1, weeks: [] };

  const weeksArr = Array.isArray(base.weeks) ? base.weeks : [];
  const ensuredWeeks = weeksArr.length > 0 ? weeksArr : [buildWeek(1)];

  const renumbered = ensuredWeeks.map((w, idx) => ({
    ...w,
    weekNumber: idx + 1,
    focus: safeText(w.focus),
    days:
      Array.isArray(w.days) && w.days.length > 0
        ? w.days.map((d) => ({
            ...d,
            day: safeText(d.day) || "Day 1 - Custom",
            exercises: Array.isArray(d.exercises) ? d.exercises : [],
          }))
        : [{ day: "Day 1 - Custom", exercises: [] }],
  }));

  const durationWeeks = renumbered.length;
  const currentWeek = clampMin(
    Math.min(Number(base.currentWeek || 1), durationWeeks),
    1
  );

  return {
    ...base,
    planName: safeText(base.planName) || "Starter Plan",
    durationWeeks,
    currentWeek,
    weeks: renumbered,
  };
}

function CoachClientTrainingTab() {
  const { clientId } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedWeek, setSelectedWeek] = useState(1);

  // Load training plan from backend (API)
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchTrainingPlan(clientId);
        const normalized = normalizePlan(data);

        if (!isMounted) return;

        setPlan(normalized);
        setSelectedWeek(normalized.currentWeek || 1);
      } catch (err) {
        console.error(err);
        alert("Failed to load training plan");
        if (isMounted) setPlan(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const weekData = useMemo(() => {
    if (!plan) return null;
    return plan.weeks.find((w) => w.weekNumber === selectedWeek) || null;
  }, [plan, selectedWeek]);

  // Keep selectedWeek valid if plan changes (safety)
  useEffect(() => {
    if (!plan) return;
    setSelectedWeek((prev) => {
      const exists = plan.weeks.some((w) => w.weekNumber === prev);
      return exists ? prev : plan.currentWeek || 1;
    });
  }, [plan]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Link className="reviewBtn" to={`/coach/clients/${clientId}/training/edit`}>
          Edit Training Plan
        </Link>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 16 }}>Loading...</div>
      ) : !plan ? (
        <div className="card" style={{ padding: 16 }}>
          No training plan found for this client.
        </div>
      ) : (
        <>
          <div className="section">
            <div className="trainingPlanMeta card">
              <div className="trainingPlanName">{plan.planName}</div>
              <div className="trainingPlanSub">
                Duration: {plan.weeks.length} weeks
                {weekData?.focus ? ` • Focus: ${weekData.focus}` : ""}
              </div>
            </div>
          </div>

          <div className="section card">
            <WeekSelector
              weeks={plan.weeks}
              selectedWeekNumber={selectedWeek}
              onSelectWeek={setSelectedWeek}
            />
          </div>

          <div className="section">
            {weekData ? (
              <DayAccordion days={weekData.days} />
            ) : (
              <div className="trainingEmpty card">No data for this week.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CoachClientTrainingTab;
