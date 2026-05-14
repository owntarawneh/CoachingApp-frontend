import "./WeekSelector.css";

function WeekSelector({ weeks, selectedWeekNumber, onSelectWeek }) {
  return (
    <div className="weekSelector">
      {weeks.map((w) => (
        <button
          key={w.weekNumber}
          type="button"
          className={
            w.weekNumber === selectedWeekNumber
              ? "weekBtn weekBtnActive"
              : "weekBtn"
          }
          onClick={() => onSelectWeek(w.weekNumber)}
        >
          Week {w.weekNumber}
        </button>
      ))}
    </div>
  );
}

export default WeekSelector;
