import { useState } from "react";
import MealTable from "../MealTable/MealTable";
import "./MealAccordion.css";

function MealAccordion({ meals }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!meals || meals.length === 0) return null;

  return (
    <div className="mealAccWrap">
      {meals.map((meal, idx) => {
        const isOpen = idx === openIndex;
        const mealKey = meal.id || `${meal.mealName}-${idx}`;

        return (
          <div key={mealKey} className="mealAccItem">
            <button
              type="button"
              className={`mealAccHeader ${isOpen ? "open" : ""}`}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <div className="mealAccTitle">{meal.mealName}</div>
              <div className="mealAccTime">{meal.time}</div>
            </button>

            {isOpen ? (
              <div className="mealAccBody">
                <MealTable items={meal.items} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default MealAccordion;
