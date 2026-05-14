import { formatDateShort, formatNumber } from "../../../utils/formatters";
import "./HistoryTable.css";

function HistoryTable({ rows, emptyText = "No results." }) {
  const list = Array.isArray(rows) ? rows : [];

  return (
    <div className="card historyTableCard" style={{ padding: 0, overflow: "hidden" }}>
      <div className="historyTableHeader">History</div>

      <div className="historyTableWrap">
        <table className="historyTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Notes</th>
              <th>Coach Notes</th>
            </tr>
          </thead>

          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="4" className="emptyCell">
                  {emptyText}
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r.id}>
                  <td>{formatDateShort(r.date)}</td>
                  <td>{formatNumber(r.weight, " kg")}</td>
                  <td className="notesCell">{r.notes || "-"}</td>
                  <td className="notesCell">{r.coachNotes ? r.coachNotes : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;
