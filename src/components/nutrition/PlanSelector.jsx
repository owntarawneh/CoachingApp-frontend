function PlanSelector({ plans, selectedPlanId, onChange }) {
  return (
    <select value={selectedPlanId} onChange={(e) => onChange(e.target.value)}>
      {plans.map((plan) => (
        <option key={plan.id} value={plan.id}>
          {plan.name}
        </option>
      ))}
    </select>
  );
}

export default PlanSelector;
