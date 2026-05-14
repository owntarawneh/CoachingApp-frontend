import "./MealTable.css";

function sum(items, key) {
  return items.reduce((t, it) => t + Number(it[key] || 0), 0);
}

function MealTable({ items }) {
  const safeItems = items || [];

  const totalCalories = sum(safeItems, "calories");
  const totalProtein = sum(safeItems, "protein");
  const totalCarbs = sum(safeItems, "carbs");
  const totalFat = sum(safeItems, "fat");

  return (
    <div className="mealTableWrap">
      <table className="mealTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cals</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {safeItems.map((it, idx) => {
            const rowKey = it.id || `${it.name}-${idx}`;
            const total = Number(it.calories || 0);

            return (
              <tr key={rowKey}>
                <td className="mealItemName">{it.name}</td>
                <td>{it.calories}</td>
                <td>{it.protein}g</td>
                <td>{it.carbs}g</td>
                <td>{it.fat}g</td>
                <td>{total}</td>
              </tr>
            );
          })}

          <tr className="mealTotalsRow">
            <td>Meal Total</td>
            <td>{totalCalories}</td>
            <td>{totalProtein}g</td>
            <td>{totalCarbs}g</td>
            <td>{totalFat}g</td>
            <td>{totalCalories}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MealTable;
