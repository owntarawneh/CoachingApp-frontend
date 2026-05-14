// src/pages/coach/Clients/edit/CoachClientTrainingEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import WeekSelector from "../../../../components/training/WeekSelector/WeekSelector";
import EditableExerciseTable from "../../../../components/training/EditableExerciseTable/EditableExerciseTable";
import "./CoachClientTrainingEdit.css";

// ✅ REAL API
import {
  fetchTrainingPlan,
  saveTrainingPlan,
} from "../../../../api/training.api";

/**
 * Course-level helpers (plain JS, no libs)
 */
function buildWeek(weekNumber) {
  return {
    weekNumber,
    focus: "",
    days: [{ day: "Day 1 - Custom", exercises: [] }],
  };
}

function clampMin(n, min) {
  const v = Number(n);
  if (Number.isNaN(v)) return min;
  return Math.max(min, v);
}

function safeText(v) {
  return String(v ?? "").trim();
}

/**
 * Ensure the plan always matches what the UI expects:
 * - weeks array exists and has at least 1 week
 * - week numbers are sequential
 * - currentWeek is within range
 */
function normalizePlan(raw) {
  const base =
    raw && typeof raw === "object"
      ? raw
      : { planName: "Starter Plan", durationWeeks: 1, currentWeek: 1, weeks: [] };

  const weeksArr = Array.isArray(base.weeks) ? base.weeks : [];

  // If empty, create Week 1
  const ensuredWeeks = weeksArr.length > 0 ? weeksArr : [buildWeek(1)];

  // Renumber sequentially (1..n) to keep selectors stable
  const renumbered = ensuredWeeks.map((w, idx) => ({
    ...w,
    weekNumber: idx + 1,
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

function CoachClientTrainingEdit() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // ❌ No mockClients anymore
  const client = null;

  /* ======================
     STATE (API-DRIVEN)
  ====================== */
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [newDayName, setNewDayName] = useState("");

  /* ======================
     LOAD PLAN FROM BACKEND
  ====================== */
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchTrainingPlan(clientId);
        const normalized = normalizePlan(data);

        if (isMounted) {
          setPlan(normalized);
          setSelectedWeek(normalized.currentWeek || 1);
          setSelectedDayIndex(0);
          setNewDayName("");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setPlan(null);
          alert("Failed to load training plan");
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

  /* ======================
     DERIVED DATA (hooks must always run)
  ====================== */
  const weekData = useMemo(() => {
    if (!plan) return null;
    return plan.weeks.find((w) => w.weekNumber === selectedWeek) || null;
  }, [plan, selectedWeek]);

  const days = weekData?.days || [];
  const dayData = days[selectedDayIndex] || null;

  /* ======================
     WEEK REMOVE SIDE-EFFECT (hooks must always run)
  ====================== */
  useEffect(() => {
    if (plan && plan.__nextSelectedWeek) {
      const nextW = plan.__nextSelectedWeek;

      setPlan((prev) => {
        const { __nextSelectedWeek, ...clean } = prev;
        return clean;
      });

      setSelectedWeek(nextW);
      setSelectedDayIndex(0);
      setNewDayName("");
    }
  }, [plan]);

  /* ======================
     UPDATE HELPERS
  ====================== */
  function setPlanField(name, value) {
    setPlan((prev) => ({ ...prev, [name]: value }));
  }

  function updateWeekFocus(value) {
    setPlan((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) =>
        w.weekNumber === selectedWeek ? { ...w, focus: value } : w
      ),
    }));
  }

  function updateDayExercises(nextExercises) {
    setPlan((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => {
        if (w.weekNumber !== selectedWeek) return w;

        const nextDays = (w.days || []).map((d, idx) =>
          idx === selectedDayIndex ? { ...d, exercises: nextExercises } : d
        );

        return { ...w, days: nextDays };
      }),
    }));
  }

  function addWeek() {
    if (!plan) return;

    const nextNumber = plan.weeks.length + 1;

    setPlan((prev) => {
      const nextWeeks = [...prev.weeks, buildWeek(nextNumber)];
      return {
        ...prev,
        durationWeeks: nextWeeks.length,
        weeks: nextWeeks,
      };
    });

    setSelectedWeek(nextNumber);
    setSelectedDayIndex(0);
    setNewDayName("");
  }

  function removeCurrentWeek() {
    if (!plan) return;
    if (plan.weeks.length <= 1) return;

    setPlan((prev) => {
      const remaining = prev.weeks.filter((w) => w.weekNumber !== selectedWeek);

      const renumbered = remaining.map((w, idx) => ({
        ...w,
        weekNumber: idx + 1,
      }));

      const nextSelectedWeek = clampMin(
        Math.min(selectedWeek, renumbered.length),
        1
      );

      const nextCurrentWeek = clampMin(
        Math.min(prev.currentWeek || 1, renumbered.length),
        1
      );

      return {
        ...prev,
        durationWeeks: renumbered.length,
        currentWeek: nextCurrentWeek,
        weeks: renumbered,
        __nextSelectedWeek: nextSelectedWeek,
      };
    });
  }

  function addDay() {
    if (!plan || !weekData) return;

    const name = safeText(newDayName);
    if (!name) return;

    setPlan((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => {
        if (w.weekNumber !== selectedWeek) return w;

        const exists = (w.days || []).some(
          (d) => safeText(d.day).toLowerCase() === name.toLowerCase()
        );
        if (exists) return w;

        const nextDays = [...(w.days || []), { day: name, exercises: [] }];
        return { ...w, days: nextDays };
      }),
    }));

    setSelectedDayIndex(days.length);
    setNewDayName("");
  }

  function removeCurrentDay() {
    if (!plan || !weekData) return;
    if (days.length <= 1) return;

    setPlan((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => {
        if (w.weekNumber !== selectedWeek) return w;

        const nextDays = (w.days || []).filter(
          (_, idx) => idx !== selectedDayIndex
        );

        return { ...w, days: nextDays };
      }),
    }));

    setSelectedDayIndex((prevIdx) => Math.max(0, prevIdx - 1));
    setNewDayName("");
  }

  /* ======================
     SAVE (API)
  ====================== */
  async function handleSave() {
    if (!plan) return;

    try {
      // Never persist internal UI helper fields
      const { __nextSelectedWeek, ...cleanPlan } = plan;

      await saveTrainingPlan(clientId, cleanPlan);
      alert("Training plan saved");
      navigate(`/coach/clients/${clientId}/training`);
    } catch (err) {
      alert("Failed to save training plan");
      console.error(err);
    }
  }

  const canRemoveWeek = !!plan && plan.weeks.length > 1;
  const canRemoveDay = !!plan && days.length > 1;

  /* ======================
     RENDER (conditional UI inside JSX)
  ====================== */
  return (
    <div>
      <PageHeader
        breadcrumb="Coach / Clients / Training / Edit"
        title="Edit Training Plan"
        subtitle={`${client?.name || clientId}`}
      />

      {loading ? (
        <div className="section">
          <div className="card" style={{ padding: 16 }}>
            Loading...
          </div>
        </div>
      ) : !plan ? (
        <div className="section">
          <div className="card" style={{ padding: 16 }}>
            No plan found.
          </div>
          <div className="section">
            <Link className="secondaryBtn" to={`/coach/clients/${clientId}/training`}>
              Back
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="section">
            <div className="card editCard">
              <div className="editGrid">
                <div className="editField">
                  <label className="editLabel">Plan Name</label>
                  <input
                    className="editInput"
                    value={plan.planName}
                    onChange={(e) => setPlanField("planName", e.target.value)}
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Duration (weeks)</label>
                  <input
                    className="editInput"
                    value={plan.weeks.length}
                    disabled
                    readOnly
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Current Week</label>
                  <select
                    className="editInput"
                    value={plan.currentWeek || 1}
                    onChange={(e) => {
                      const v = clampMin(e.target.value, 1);
                      setPlanField("currentWeek", v);
                      setSelectedWeek(v);
                      setSelectedDayIndex(0);
                      setNewDayName("");
                    }}
                  >
                    {plan.weeks.map((w) => (
                      <option key={w.weekNumber} value={w.weekNumber}>
                        Week {w.weekNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <button type="button" className="secondaryBtn" onClick={addWeek}>
                  + Add Week
                </button>

                <button
                  type="button"
                  className="secondaryBtn"
                  onClick={removeCurrentWeek}
                  disabled={!canRemoveWeek}
                  title={!canRemoveWeek ? "You must keep at least 1 week." : ""}
                >
                  Remove Week
                </button>
              </div>
            </div>
          </div>

          <div className="section card">
            <WeekSelector
              weeks={plan.weeks}
              selectedWeekNumber={selectedWeek}
              onSelectWeek={(w) => {
                setSelectedWeek(w);
                setSelectedDayIndex(0);
                setNewDayName("");
              }}
            />
          </div>

          <div className="section">
            <div className="card editCard">
              <div className="editField" style={{ marginBottom: 12 }}>
                <label className="editLabel">Week Focus</label>
                <input
                  className="editInput"
                  value={weekData?.focus || ""}
                  onChange={(e) => updateWeekFocus(e.target.value)}
                  placeholder="e.g. Base volume + technique"
                />
              </div>

              <div className="editField" style={{ marginBottom: 12 }}>
                <label className="editLabel">Select Day</label>
                <select
                  className="editInput"
                  value={selectedDayIndex}
                  onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                  disabled={days.length === 0}
                >
                  {days.map((d, idx) => (
                    <option key={`${d.day}-${idx}`} value={idx}>
                      {d.day}
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="secondaryBtn"
                    onClick={removeCurrentDay}
                    disabled={!canRemoveDay}
                  >
                    Remove Day
                  </button>
                </div>
              </div>

              <div className="editField">
                <label className="editLabel">Add New Day</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input
                    className="editInput"
                    value={newDayName}
                    onChange={(e) => setNewDayName(e.target.value)}
                    placeholder='e.g. "Day 4 - Cardio"'
                  />
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={addDay}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    + Add Day
                  </button>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  Tip: Day name must be unique in the selected week.
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="card editCard">
              <div style={{ fontWeight: 900, marginBottom: 10 }}>
                Exercises — {dayData?.day || "No day"}
              </div>

              {dayData ? (
                <EditableExerciseTable
                  exercises={dayData.exercises || []}
                  onChangeExercises={updateDayExercises}
                />
              ) : (
                <div style={{ padding: 12, color: "var(--muted)" }}>
                  No day data found.
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <div className="editActions">
              <Link className="secondaryBtn" to={`/coach/clients/${clientId}/training`}>
                Cancel
              </Link>

              <button className="primaryBtn" type="button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CoachClientTrainingEdit;
