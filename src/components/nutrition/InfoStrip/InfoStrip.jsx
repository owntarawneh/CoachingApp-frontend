import "./InfoStrip.css";

function InfoStrip({ goals }) {
  const g = goals || {};

  const calories = g.calories ?? 0;
  const protein = g.protein ?? 0;
  const carbs = g.carbs ?? 0;
  const fat = g.fat ?? 0;

  return (
    <div className="nutritionLegacyGoalsStrip">
      <strong>Daily Calorie Goal:</strong> {calories} kcal |{" "}
      <strong>Protein:</strong> {protein}g | <strong>Carbs:</strong> {carbs}g |{" "}
      <strong>Fat:</strong> {fat}g
    </div>
  );
}

export default InfoStrip;
