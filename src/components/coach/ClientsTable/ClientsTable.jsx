import { Link } from "react-router-dom";
import "./ClientsTable.css";

function ClientsTable({ rows, title = "Clients" }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card clientsEmpty">
        No clients found.
      </div>
    );
  }

  return (
    <div className="card clientsCard">
      <div className="clientsHeader">
        <div className="clientsHeaderTitle">
          {title} <span className="clientsCount">({rows.length})</span>
        </div>
      </div>

      <div className="clientsTableWrap">
        <table className="clientsTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client ID</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="clientsName">{c.name || "-"}</td>
                <td className="clientsId">{c.id}</td>
                <td className="clientsActions">
                  <Link className="viewBtn" to={`/coach/clients/${c.id}`}>
                    View
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

export default ClientsTable;
