import TextInput from "../../form/TextInput/TextInput";
import "./HistoryFilters.css";

function HistoryFilters({ filters, onChangeFilters, onReset }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChangeFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="historyFilters">
      <div className="historyFiltersGrid">
        <TextInput
          label="From Date"
          name="fromDate"
          type="date"
          value={filters.fromDate}
          onChange={handleChange}
        />

        <TextInput
          label="To Date"
          name="toDate"
          type="date"
          value={filters.toDate}
          onChange={handleChange}
        />
      </div>

      <div className="historyFiltersActions">
        <button type="button" className="resetBtn" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default HistoryFilters;
