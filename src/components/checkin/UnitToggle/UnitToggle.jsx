import "./UnitToggle.css";

function UnitToggle({ value, options, onChange }) {
  return (
    <div className="unitToggle" role="group" aria-label="unit toggle">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`unitToggleBtn ${isActive ? "isActive" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default UnitToggle;
