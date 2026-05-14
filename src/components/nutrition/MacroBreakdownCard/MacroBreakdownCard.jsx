import "./MacroBreakdownCard.css";

function clampPercent(n) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

function MacroRow({ label, percent }) {
  const p = clampPercent(percent);

  return (
    <div className="macroRow">
      <div className="macroRowTop">
        <div className="macroRowLabel">{label}</div>
        <div className="macroRowValue">{p}%</div>
      </div>
      <div className="macroBarTrack">
        <div className="macroBarFill" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

function MacroBreakdownCard({ caloriesGoal = 0, macroPercents, totals }) {
  const safePercents = macroPercents || { protein: 0, carbs: 0, fat: 0 };
  const safeTotals = totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="card macroCard">
      <div className="macroCardTitle">Today's Macro Breakdown</div>

      <div className="macroRingWrap">
        <div className="macroRing">
          <div className="macroRingValue">{Number(caloriesGoal || 0)}</div>
          <div className="macroRingUnit">kcal</div>
        </div>
      </div>

      <div className="macroRows">
        <MacroRow label="Protein" percent={safePercents.protein} />
        <MacroRow label="Carbs" percent={safePercents.carbs} />
        <MacroRow label="Fat" percent={safePercents.fat} />
      </div>

      <div className="macroCardFooter">
        <div className="macroFooterLine">
          <strong>Total Calories:</strong> {Number(caloriesGoal || 0)} kcal
        </div>

        <button type="button" className="macroHistoryBtn">
          View Nutrition History
        </button>

        <div className="macroTotalsMini">
          Planned totals today: {safeTotals.calories} kcal • P {safeTotals.protein}g • C{" "}
          {safeTotals.carbs}g • F {safeTotals.fat}g
        </div>
      </div>
    </div>
  );
}

export default MacroBreakdownCard;
