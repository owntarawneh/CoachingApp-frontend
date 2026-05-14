import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PlanSelector from "../../../../components/nutrition/PlanSelector";
import DaySelector from "../../../../components/nutrition/DaySelector";
import InfoStrip from "../../../../components/nutrition/InfoStrip/InfoStrip";
import CoachNotesCard from "../../../../components/nutrition/CoachNotesCard/CoachNotesCard";
import MacroBreakdownCard from "../../../../components/nutrition/MacroBreakdownCard/MacroBreakdownCard";
import MealAccordion from "../../../../components/nutrition/MealAccordion/MealAccordion";

import { fetchNutritionPlan } from "../../../../api/nutrition.api";

import "../../../client/NutritionPlan/NutritionPlan.css";
import "../../../../components/nutrition/Nutrition.css";

function normalizeNutritionState(raw) {
  const base = raw && typeof raw === "object" ? raw : { plans: [], currentPlanId: "" };
  return {
    plans: Array.isArray(base.plans) ? base.plans : [],
    currentPlanId: typeof base.currentPlanId === "string" ? base.currentPlanId : "",
  };
}

function CoachClientNutritionTab() {
  const { clientId } = useParams();

  const [state, setState] = useState({ plans: [], currentPlanId: "" });
  const [loading, setLoading] = useState(true);

  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchNutritionPlan(clientId);
        const normalized = normalizeNutritionState(data);

        if (!isMounted) return;

        setState(normalized);

        const nextPlanId = normalized.currentPlanId || normalized.plans[0]?.id || "";
        setSelectedPlanId(nextPlanId);

        const nextPlan =
          normalized.plans.find((p) => p.id === nextPlanId) || normalized.plans[0] || null;
        setSelectedDay(nextPlan?.days?.[0]?.day || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load nutrition plan");
        if (isMounted) setState({ plans: [], currentPlanId: "" });
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

  useEffect(() => {
    const nextId = state.currentPlanId || plans[0]?.id || "";
    setSelectedPlanId((prev) => {
      const exists = plans.some((p) => p.id === prev);
      return exists ? prev : nextId;
    });
  }, [state.currentPlanId, plans]);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0] || null;
  }, [plans, selectedPlanId]);

  useEffect(() => {
    const firstDay = selectedPlan?.days?.[0]?.day || "";
    setSelectedDay((prev) => {
      const exists = selectedPlan?.days?.some((d) => d.day === prev);
      return exists ? prev : firstDay;
    });
  }, [selectedPlan]);

  const dayData = useMemo(() => {
    if (!selectedPlan) return null;
    return selectedPlan.days.find((d) => d.day === selectedDay) || null;
  }, [selectedPlan, selectedDay]);

  const totals = useMemo(() => {
    if (!dayData) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    let calories = 0, protein = 0, carbs = 0, fat = 0;
    (dayData.meals || []).forEach((meal) => {
      (meal.items || []).forEach((item) => {
        calories += Number(item.calories || 0);
        protein += Number(item.protein || 0);
        carbs += Number(item.carbs || 0);
        fat += Number(item.fat || 0);
      });
    });

    return { calories, protein, carbs, fat };
  }, [dayData]);

  const macroPercents = useMemo(() => {
    const p = Number(selectedPlan?.dailyGoals?.protein || 0);
    const c = Number(selectedPlan?.dailyGoals?.carbs || 0);
    const f = Number(selectedPlan?.dailyGoals?.fat || 0);
    const total = p + c + f;
    if (!total) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round((p / total) * 100),
      carbs: Math.round((c / total) * 100),
      fat: Math.round((f / total) * 100),
    };
  }, [selectedPlan]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Link className="reviewBtn" to={`/coach/clients/${clientId}/nutrition/edit`}>
          Edit Nutrition Plan
        </Link>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 16 }}>Loading...</div>
      ) : plans.length === 0 ? (
        <div className="card" style={{ padding: 16 }}>
          No nutrition plans found for this client.
        </div>
      ) : (
        <div className="nutritionGrid">
          <div className="nutritionLeft">
            <div className="card nutritionTopCard">
              <div className="nutritionControlsRow">
                <div className="nutritionControl">
                  <div className="nutritionControlLabel">Current Plan</div>
                  <PlanSelector
                    plans={plans}
                    selectedPlanId={selectedPlanId}
                    onChange={setSelectedPlanId}
                  />
                </div>

                <div className="nutritionControl">
                  <div className="nutritionControlLabel">Select Day</div>
                  <DaySelector
                    days={selectedPlan?.days || []}
                    selectedDay={selectedDay}
                    onChange={setSelectedDay}
                  />
                </div>
              </div>

              <div className="nutritionInfoStrip">
                <InfoStrip goals={selectedPlan?.dailyGoals} />
              </div>
            </div>

            <div className="nutritionSection">
              <CoachNotesCard text={selectedPlan?.coachNotes || ""} />
            </div>

            <div className="card nutritionMealsCard">
              <div className="nutritionMealsHeader">Meals</div>
              <div className="nutritionMealsBody">
                {dayData ? (
                  <MealAccordion meals={dayData.meals} />
                ) : (
                  <div className="nutritionEmpty">No meals found for this day.</div>
                )}
              </div>
            </div>
          </div>

          <div className="nutritionRight">
            <MacroBreakdownCard
              caloriesGoal={Number(selectedPlan?.dailyGoals?.calories || 0)}
              macroPercents={macroPercents}
              totals={totals}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachClientNutritionTab;
