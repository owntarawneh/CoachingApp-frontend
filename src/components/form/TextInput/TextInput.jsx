import "./TextInput.css";

function TextInput({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div className="formField">
      <label className="formLabel" htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        className="formInput"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default TextInput;
