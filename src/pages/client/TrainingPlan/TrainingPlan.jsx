import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import WeekSelector from "../../../components/training/WeekSelector/WeekSelector";
import DayAccordion from "../../../components/training/DayAccordion/DayAccordion";
import { fetchTrainingPlan } from "../../../api/training.api";
import { getClientId } from "../../../auth/session"; // adjust path if needed
import "./TrainingPlan.css";

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

/**
 * Normalize plan to protect UI from empty/invalid DB data
 */
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

function TrainingPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const CURRENT_CLIENT_ID = getClientId();

      if (!CURRENT_CLIENT_ID) {
        alert("Not logged in as client");
        if (isMounted) {
          setPlan(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchTrainingPlan(CURRENT_CLIENT_ID);
        const normalized = normalizePlan(data);

        if (isMounted) {
          setPlan(normalized);
          setSelectedWeek(normalized.currentWeek || 1);
        }
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
  }, []);

  const weekData = useMemo(() => {
    if (!plan) return null;
    return plan.weeks.find((w) => w.weekNumber === selectedWeek) || null;
  }, [plan, selectedWeek]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : !plan ? (
        <div>No plan found</div>
      ) : (
        <>
          <PageHeader
            breadcrumb="Client / My Training Plan"
            title="My Training Plan"
            subtitle="Your personalized workout routine"
          />

          {/* Plan meta */}
          <div className="section">
            <div className="trainingPlanMeta card">
              <div className="trainingPlanName">{plan.planName}</div>
              <div className="trainingPlanSub">
                Duration: {plan.weeks.length} weeks
                {weekData?.focus ? ` • Focus: ${weekData.focus}` : ""}
              </div>
            </div>
          </div>

          {/* Week selector */}
          <div className="section">
            <WeekSelector
              weeks={plan.weeks}
              selectedWeekNumber={selectedWeek}
              onSelectWeek={(w) => setSelectedWeek(w)}
            />
          </div>

          {/* Days */}
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

export default TrainingPlan;
