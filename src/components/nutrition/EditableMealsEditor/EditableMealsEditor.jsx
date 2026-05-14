import { useEffect, useMemo, useState } from "react";
import "./EditableMealsEditor.css";

function clampIndex(i, max) {
  if (max < 0) return 0;
  if (i < 0) return 0;
  if (i > max) return max;
  return i;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function makeEmptyMeal() {
  return {
    mealName: "New Meal",
    time: "12:00 PM",
    items: [],
  };
}

function makeEmptyItem() {
  return {
    name: "New Item",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
}

function EditableMealsEditor({ days, onChangeDays }) {
  const safeDays = Array.isArray(days) ? days : [];

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Day ops inputs
  const [newDayName, setNewDayName] = useState("");
  const [renameDayValue, setRenameDayValue] = useState("");

  // keep selected index valid if days length changes
  useEffect(() => {
    if (safeDays.length === 0) {
      setSelectedDayIndex(0);
      return;
    }
    setSelectedDayIndex((prev) => clampIndex(prev, safeDays.length - 1));
  }, [safeDays.length]);

  const selectedDay = useMemo(() => {
    return safeDays[selectedDayIndex] || null;
  }, [safeDays, selectedDayIndex]);

  // sync rename input whenever selected day changes
  useEffect(() => {
    setRenameDayValue(selectedDay?.day || "");
  }, [selectedDayIndex, selectedDay?.day]);

  // ===== Day operations =====
  function addDay() {
    const name = newDayName.trim();
    if (!name) return;

    const exists = safeDays.some(
      (d) => (d.day || "").toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    const next = [
      ...safeDays,
      {
        day: name,
        meals: [],
      },
    ];

    onChangeDays(next);
    setSelectedDayIndex(next.length - 1);
    setNewDayName("");
  }

  function removeDay() {
    if (safeDays.length <= 1) return;

    const next = safeDays.filter((_, i) => i !== selectedDayIndex);
    onChangeDays(next);

    const nextIdx =
      selectedDayIndex >= next.length ? next.length - 1 : selectedDayIndex;
    setSelectedDayIndex(clampIndex(nextIdx, next.length - 1));
  }

  function renameDay() {
    const name = renameDayValue.trim();
    if (!name) return;

    const exists = safeDays.some(
      (d, idx) =>
        idx !== selectedDayIndex &&
        (d.day || "").toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    const next = safeDays.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, day: name } : d
    );

    onChangeDays(next);
  }

  function moveDayUp() {
    if (selectedDayIndex <= 0) return;

    const next = [...safeDays];
    const tmp = next[selectedDayIndex - 1];
    next[selectedDayIndex - 1] = next[selectedDayIndex];
    next[selectedDayIndex] = tmp;

    onChangeDays(next);
    setSelectedDayIndex(selectedDayIndex - 1);
  }

  function moveDayDown() {
    if (selectedDayIndex >= safeDays.length - 1) return;

    const next = [...safeDays];
    const tmp = next[selectedDayIndex + 1];
    next[selectedDayIndex + 1] = next[selectedDayIndex];
    next[selectedDayIndex] = tmp;

    onChangeDays(next);
    setSelectedDayIndex(selectedDayIndex + 1);
  }

  function duplicateDay() {
    if (!selectedDay) return;

    // generate unique name
    const base = selectedDay.day || "Day";
    let copyName = `${base} (Copy)`;
    let n = 2;
    while (
      safeDays.some((d) => (d.day || "").toLowerCase() === copyName.toLowerCase())
    ) {
      copyName = `${base} (Copy ${n})`;
      n += 1;
    }

    const clone = deepCopy(selectedDay);
    clone.day = copyName;

    const next = [...safeDays];
    next.splice(selectedDayIndex + 1, 0, clone);

    onChangeDays(next);
    setSelectedDayIndex(selectedDayIndex + 1);
  }

  // ===== Meals editing for selected day =====
  function setSelectedDayMeals(nextMeals) {
    const next = safeDays.map((d, idx) =>
      idx === selectedDayIndex ? { ...d, meals: nextMeals } : d
    );
    onChangeDays(next);
  }

  function addMeal() {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];
    setSelectedDayMeals([...meals, makeEmptyMeal()]);
  }

  function removeMeal(mealIndex) {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];
    setSelectedDayMeals(meals.filter((_, i) => i !== mealIndex));
  }

  function updateMealField(mealIndex, field, value) {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];
    const nextMeals = meals.map((m, i) =>
      i === mealIndex ? { ...m, [field]: value } : m
    );
    setSelectedDayMeals(nextMeals);
  }

  function addItem(mealIndex) {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];
    const nextMeals = meals.map((m, i) => {
      if (i !== mealIndex) return m;
      const items = Array.isArray(m.items) ? m.items : [];
      return { ...m, items: [...items, makeEmptyItem()] };
    });
    setSelectedDayMeals(nextMeals);
  }

  function removeItem(mealIndex, itemIndex) {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];
    const nextMeals = meals.map((m, i) => {
      if (i !== mealIndex) return m;
      const items = Array.isArray(m.items) ? m.items : [];
      return { ...m, items: items.filter((_, j) => j !== itemIndex) };
    });
    setSelectedDayMeals(nextMeals);
  }

  function updateItemField(mealIndex, itemIndex, field, value) {
    const meals = Array.isArray(selectedDay?.meals) ? selectedDay.meals : [];

    const nextMeals = meals.map((m, i) => {
      if (i !== mealIndex) return m;

      const items = Array.isArray(m.items) ? m.items : [];
      const nextItems = items.map((it, j) => {
        if (j !== itemIndex) return it;

        if (field === "name") return { ...it, name: value };

        // numeric fields
        const num = value === "" ? "" : Number(value);
        return { ...it, [field]: Number.isNaN(num) ? 0 : num };
      });

      return { ...m, items: nextItems };
    });

    setSelectedDayMeals(nextMeals);
  }

  const canRemoveDay = safeDays.length > 1;
  const canMoveUp = selectedDayIndex > 0;
  const canMoveDown = selectedDayIndex < safeDays.length - 1;

  return (
    <div className="card editCard" style={{ padding: 16 }}>
      <div style={{ fontWeight: 900, marginBottom: 10 }}>
        Days & Meals (Coach Edit)
      </div>

      {/* Day selector + controls */}
      <div className="emeRow">
        <div className="emeCol">
          <label className="editLabel">Select Day</label>
          <select
            className="editInput"
            value={selectedDayIndex}
            onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
          >
            {safeDays.map((d, idx) => (
              <option key={`${d.day}-${idx}`} value={idx}>
                {d.day}
              </option>
            ))}
          </select>
        </div>

        <div className="emeActions">
          <button
            type="button"
            className="secondaryBtn"
            onClick={moveDayUp}
            disabled={!canMoveUp}
          >
            Move Up
          </button>
          <button
            type="button"
            className="secondaryBtn"
            onClick={moveDayDown}
            disabled={!canMoveDown}
          >
            Move Down
          </button>
          <button type="button" className="secondaryBtn" onClick={duplicateDay}>
            Duplicate Day
          </button>
          <button
            type="button"
            className="secondaryBtn"
            onClick={removeDay}
            disabled={!canRemoveDay}
            title={!canRemoveDay ? "You must keep at least 1 day." : ""}
          >
            Remove Day
          </button>
        </div>
      </div>

      {/* Add day */}
      <div className="emeRow" style={{ marginTop: 12 }}>
        <div className="emeCol">
          <label className="editLabel">Add New Day</label>
          <input
            className="editInput"
            value={newDayName}
            onChange={(e) => setNewDayName(e.target.value)}
            placeholder='e.g. "Wednesday" or "Rest Day"'
          />
        </div>
        <div className="emeActions" style={{ alignItems: "end" }}>
          <button type="button" className="primaryBtn" onClick={addDay}>
            + Add Day
          </button>
        </div>
      </div>

      {/* Rename day */}
      <div className="emeRow" style={{ marginTop: 12 }}>
        <div className="emeCol">
          <label className="editLabel">Rename Selected Day</label>
          <input
            className="editInput"
            value={renameDayValue}
            onChange={(e) => setRenameDayValue(e.target.value)}
            placeholder="New day name"
          />
          <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
            Day names must be unique inside the plan.
          </div>
        </div>
        <div className="emeActions" style={{ alignItems: "end" }}>
          <button type="button" className="primaryBtn" onClick={renameDay}>
            Save Name
          </button>
        </div>
      </div>

      {/* Meals editor */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontWeight: 900 }}>
            Meals — {selectedDay?.day || "-"}
          </div>
          <button type="button" className="primaryBtn" onClick={addMeal}>
            + Add Meal
          </button>
        </div>

        {(selectedDay?.meals || []).length === 0 ? (
          <div style={{ padding: 12, color: "var(--muted)" }}>
            No meals yet for this day.
          </div>
        ) : (
          <div className="emeMeals">
            {(selectedDay.meals || []).map((meal, mealIndex) => (
              <div key={`${meal.mealName}-${mealIndex}`} className="emeMealCard">
                <div className="emeMealTop">
                  <div style={{ fontWeight: 900 }}>Meal {mealIndex + 1}</div>

                  <button
                    type="button"
                    className="secondaryBtn"
                    onClick={() => removeMeal(mealIndex)}
                  >
                    Remove Meal
                  </button>
                </div>

                <div className="emeMealGrid">
                  <div>
                    <label className="editLabel">Meal Name</label>
                    <input
                      className="editInput"
                      value={meal.mealName || ""}
                      onChange={(e) =>
                        updateMealField(mealIndex, "mealName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="editLabel">Time</label>
                    <input
                      className="editInput"
                      value={meal.time || ""}
                      onChange={(e) =>
                        updateMealField(mealIndex, "time", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="emeItemsHeader">
                  <div style={{ fontWeight: 900 }}>Items</div>
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={() => addItem(mealIndex)}
                  >
                    + Add Item
                  </button>
                </div>

                {(meal.items || []).length === 0 ? (
                  <div style={{ padding: 12, color: "var(--muted)" }}>
                    No items yet.
                  </div>
                ) : (
                  <div className="emeTableWrap">
                    <table className="emeTable">
                      <thead>
                        <tr>
                          <th style={{ width: "30%" }}>Item</th>
                          <th>Calories</th>
                          <th>Protein</th>
                          <th>Carbs</th>
                          <th>Fat</th>
                          <th style={{ width: 90 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(meal.items || []).map((item, itemIndex) => (
                          <tr key={`${item.name}-${itemIndex}`}>
                            <td>
                              <input
                                className="emeCellInput"
                                value={item.name ?? ""}
                                onChange={(e) =>
                                  updateItemField(
                                    mealIndex,
                                    itemIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="emeCellInput"
                                type="number"
                                min="0"
                                value={item.calories ?? 0}
                                onChange={(e) =>
                                  updateItemField(
                                    mealIndex,
                                    itemIndex,
                                    "calories",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="emeCellInput"
                                type="number"
                                min="0"
                                value={item.protein ?? 0}
                                onChange={(e) =>
                                  updateItemField(
                                    mealIndex,
                                    itemIndex,
                                    "protein",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="emeCellInput"
                                type="number"
                                min="0"
                                value={item.carbs ?? 0}
                                onChange={(e) =>
                                  updateItemField(
                                    mealIndex,
                                    itemIndex,
                                    "carbs",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="emeCellInput"
                                type="number"
                                min="0"
                                value={item.fat ?? 0}
                                onChange={(e) =>
                                  updateItemField(
                                    mealIndex,
                                    itemIndex,
                                    "fat",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="secondaryBtn"
                                onClick={() => removeItem(mealIndex, itemIndex)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditableMealsEditor;
