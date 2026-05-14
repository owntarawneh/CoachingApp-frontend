import "./CoachNotesCard.css";

function CoachNotesCard({ text }) {
  const safe = String(text || "").trim();

  return (
    <div className="card nutritionLegacyCard">
      <div className="nutritionLegacyCardTitle">Coach Notes</div>
      <div className="nutritionLegacyNotes">{safe ? safe : "-"}</div>
    </div>
  );
}

export default CoachNotesCard;
