import "./ProfileCard.css";

function ProfileCard({ title, children }) {
  return (
    <section className="profileCard">
      <div className="profileCardHeader">
        <h3 className="profileCardTitle">{title}</h3>
      </div>
      <div className="profileCardBody">{children}</div>
    </section>
  );
}

export default ProfileCard;
