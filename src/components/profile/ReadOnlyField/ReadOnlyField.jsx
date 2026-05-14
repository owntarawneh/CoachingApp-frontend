import "./ReadOnlyField.css";

function ReadOnlyField({ label, value }) {
  return (
    <div className="roField">
      <div className="roLabel">{label}</div>
      <div className="roValue">{value ?? "-"}</div>
    </div>
  );
}

export default ReadOnlyField;
