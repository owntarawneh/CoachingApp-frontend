import "./StatCard.css";

function StatCard({ label, value, subtext }) {
  return (
    <div className="statCard">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      {subtext ? <div className="statSubtext">{subtext}</div> : null}
    </div>
  );
}

export default StatCard;