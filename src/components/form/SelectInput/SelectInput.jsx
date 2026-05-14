import "./SelectInput.css";

function SelectInput({ label, name, value, onChange, options }) {
  return (
    <div className="formField">
      <label className="formLabel">{label}</label>
      <select
        className="formInput"
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
