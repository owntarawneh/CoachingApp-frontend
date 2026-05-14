import { Link } from "react-router-dom";
import "./CheckInsTable.css";

function CheckInsTable({
  rows,
  title = "Check-Ins",
  emptyText = "No check-ins found.",
}) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ padding: 16 }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="checkInsHeader">
        {title} <span className="checkInsHeaderCount">({rows.length})</span>
      </div>

      <div className="checkInsTableWrap">
        <table className="checkInsTable">
          <thead>
            <tr>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.clientName}</td>
                <td>{r.date}</td>
                <td>
                  <span
                    className={
                      r.status === "Pending"
                        ? "badge badgePending"
                        : r.status === "Reviewed"
                        ? "badge badgeReviewed"
                        : "badge"
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link className="reviewBtn" to={`/coach/check-ins/${r.id}`}>
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CheckInsTable;
