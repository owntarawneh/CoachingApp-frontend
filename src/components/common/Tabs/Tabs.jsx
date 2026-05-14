import { NavLink } from "react-router-dom";
import "./Tabs.css";

function Tabs({ items }) {
  return (
    <div className="tabsRow" role="tablist" aria-label="Client details tabs">
      {items.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => (isActive ? "tabBtn tabActive" : "tabBtn")}
          role="tab"
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}

export default Tabs;
