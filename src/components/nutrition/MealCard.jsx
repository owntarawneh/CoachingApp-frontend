function MealCard({ meal }) {
  return (
    <div className="meal-card">
      <h4>{meal.mealName} — {meal.time}</h4>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody>
          {meal.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.calories}</td>
              <td>{item.protein}g</td>
              <td>{item.carbs}g</td>
              <td>{item.fat}g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MealCard;
