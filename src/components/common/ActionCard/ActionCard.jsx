import { Link } from "react-router-dom";
import "./ActionCard.css";

function ActionCard({ label, description, to }) {
  return (
    <Link to={to} className="actionCard">
      <div className="actionTitle">{label}</div>
      <div className="actionDesc">{description}</div>
      <div className="actionArrow">→</div>
    </Link>
  );
}

export default ActionCard;
