import "./PrimaryButton.css";

function PrimaryButton({ children, type = "button", variant = "primary", onClick }) {
  const className =
    variant === "secondary" ? "btnBase btnSecondary" : "btnBase btnPrimary";

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default PrimaryButton;
