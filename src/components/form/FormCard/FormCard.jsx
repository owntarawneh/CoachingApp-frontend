import "./FormCard.css";

function FormCard({ title, children }) {
  return (
    <section className="formCard">
      {title ? <h3 className="formCardTitle">{title}</h3> : null}
      <div className="formCardBody">{children}</div>
    </section>
  );
}

export default FormCard;
