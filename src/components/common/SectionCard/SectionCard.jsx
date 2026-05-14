import "./SectionCard.css";

function SectionCard({ title, rightText, onRightClick, children }) {
  return (
    <section className="sectionCard">
      <div className="sectionHeader">
        <h3 className="sectionTitle">{title}</h3>

        {rightText ? (
          <button type="button" className="sectionLink" onClick={onRightClick}>
            {rightText}
          </button>
        ) : null}
      </div>

      <div className="sectionBody">{children}</div>
    </section>
  );
}

export default SectionCard;
