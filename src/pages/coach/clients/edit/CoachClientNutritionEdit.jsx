import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";

import EditableMealsEditor from "../../../../components/nutrition/EditableMealsEditor/EditableMealsEditor";
import "./CoachClientNutritionEdit.css";

import { fetchNutritionPlan, saveNutritionPlan } from "../../../../api/nutrition.api";

function normalizeNutritionState(raw) {
  const base = raw && typeof raw === "object" ? raw : { plans: [], currentPlanId: "" };
  return {
    plans: Array.isArray(base.plans) ? base.plans : [],
    currentPlanId: typeof base.currentPlanId === "string" ? base.currentPlanId : "",
  };
}

function CoachClientNutritionEdit() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // ❌ No mockClients anymore
  const client = null;

  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ plans: [], currentPlanId: "" });
  const [selectedPlanId, setSelectedPlanId] = useState("");

  // Load nutrition state from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchNutritionPlan(clientId);
        const normalized = normalizeNutritionState(data);

        if (!isMounted) return;

        setState(normalized);
        setSelectedPlanId(normalized.currentPlanId || normalized.plans?.[0]?.id || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load nutrition plan");
        if (isMounted) {
          setState({ plans: [], currentPlanId: "" });
          setSelectedPlanId("");
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

  const plans = state.plans || [];

  // Keep selected plan valid
  useEffect(() => {
    const nextId = state.currentPlanId || plans[0]?.id || "";
    setSelectedPlanId((prev) => {
      const exists = plans.some((p) => p.id === prev);
      return exists ? prev : nextId;
    });
  }, [state.currentPlanId, plans]);

  const planIndex = useMemo(() => {
    return plans.findIndex((p) => p.id === selectedPlanId);
  }, [plans, selectedPlanId]);

  const plan = planIndex >= 0 ? plans[planIndex] : plans[0] || null;

  function updatePlan(mutator) {
    setState((prev) => {
      const nextPlans = [...(prev.plans || [])];
      const idx = nextPlans.findIndex((p) => p.id === selectedPlanId);
      if (idx === -1) return prev;

      const current = nextPlans[idx];
      const updated = mutator(current);
      nextPlans[idx] = updated;

      return { ...prev, plans: nextPlans };
    });
  }

  function setPlanField(name, value) {
    updatePlan((current) => ({ ...current, [name]: value }));
  }

  function setGoalsField(name, value) {
    updatePlan((current) => ({
      ...current,
      dailyGoals: {
        ...(current.dailyGoals || {}),
        [name]: value === "" ? "" : Number(value),
      },
    }));
  }

  function setDays(nextDays) {
    updatePlan((current) => ({
      ...current,
      days: nextDays,
    }));
  }

  async function handleSave() {
    try {
      const nextState = {
        ...state,
        currentPlanId: selectedPlanId,
      };

      await saveNutritionPlan(clientId, nextState);
      alert("Nutrition plan saved");
      navigate(`/coach/clients/${clientId}/nutrition`);
    } catch (err) {
      console.error(err);
      alert("Failed to save nutrition plan");
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Coach / Clients / Nutrition / Edit"
        title="Edit Nutrition Plan"
        subtitle={`${client?.name || clientId}`}
      />

      {loading ? (
        <div className="card" style={{ padding: 16 }}>Loading...</div>
      ) : !plan ? (
        <div className="card" style={{ padding: 16 }}>
          No nutrition plan found for this client.
        </div>
      ) : (
        <>
          {/* Plan meta */}
          <div className="section">
            <div className="card editCard">
              <div className="editGrid">
                <div className="editField" style={{ gridColumn: "1 / -1" }}>
                  <label className="editLabel">Plan</label>
                  <select
                    className="editInput"
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="editField" style={{ gridColumn: "1 / -1" }}>
                  <label className="editLabel">Plan Name</label>
                  <input
                    className="editInput"
                    value={plan.name || ""}
                    onChange={(e) => setPlanField("name", e.target.value)}
                  />
                </div>

                <div className="editField" style={{ gridColumn: "1 / -1" }}>
                  <label className="editLabel">Description</label>
                  <textarea
                    className="editTextArea"
                    rows={4}
                    value={plan.description || ""}
                    onChange={(e) => setPlanField("description", e.target.value)}
                    placeholder="Short goal or instructions..."
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Duration (weeks)</label>
                  <input
                    className="editInput"
                    type="number"
                    min="1"
                    value={plan.durationWeeks ?? ""}
                    onChange={(e) => setPlanField("durationWeeks", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Goals */}
          <div className="section">
            <div className="card editCard">
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Daily Goals</div>

              <div className="editGrid">
                <div className="editField">
                  <label className="editLabel">Calories</label>
                  <input
                    className="editInput"
                    type="number"
                    min="0"
                    value={plan.dailyGoals?.calories ?? ""}
                    onChange={(e) => setGoalsField("calories", e.target.value)}
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Protein (g)</label>
                  <input
                    className="editInput"
                    type="number"
                    min="0"
                    value={plan.dailyGoals?.protein ?? ""}
                    onChange={(e) => setGoalsField("protein", e.target.value)}
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Carbs (g)</label>
                  <input
                    className="editInput"
                    type="number"
                    min="0"
                    value={plan.dailyGoals?.carbs ?? ""}
                    onChange={(e) => setGoalsField("carbs", e.target.value)}
                  />
                </div>

                <div className="editField">
                  <label className="editLabel">Fat (g)</label>
                  <input
                    className="editInput"
                    type="number"
                    min="0"
                    value={plan.dailyGoals?.fat ?? ""}
                    onChange={(e) => setGoalsField("fat", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coach Notes */}
          <div className="section">
            <div className="card editCard">
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Coach Notes</div>
              <textarea
                className="editTextArea"
                rows={6}
                value={plan.coachNotes || ""}
                onChange={(e) => setPlanField("coachNotes", e.target.value)}
                placeholder="Notes the client will see on their Nutrition Plan page..."
              />
            </div>
          </div>

          {/* Days + Meals Editor */}
          <div className="section">
            <EditableMealsEditor days={plan.days || []} onChangeDays={setDays} />
          </div>

          {/* Actions */}
          <div className="section">
            <div className="editActions">
              <Link className="secondaryBtn" to={`/coach/clients/${clientId}/nutrition`}>
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

export default CoachClientNutritionEdit;
