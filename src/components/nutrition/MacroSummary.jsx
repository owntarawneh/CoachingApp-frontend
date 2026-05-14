function MacroSummary({ goals }) {
  return (
    <div className="macro-summary">
      <h4>Daily Goals</h4>
      <p>Calories: {goals.calories}</p>
      <p>Protein: {goals.protein}g</p>
      <p>Carbs: {goals.carbs}g</p>
      <p>Fat: {goals.fat}g</p>
    </div>
  );
}

export default MacroSummary;
