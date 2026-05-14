import { useEffect, useMemo, useRef, useState } from "react";
import { searchExercisesByName } from "../../../services/exerciseDBService";
import "./EditableExerciseTable.css";

function EditableExerciseTable({ exercises, onChangeExercises }) {
  // ----------------------------
  // Existing table helpers
  // ----------------------------
  function updateRow(index, field, value) {
    const next = exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    onChangeExercises(next);
  }

  function addRow(seed) {
    const next = [
      ...exercises,
      seed || { name: "", sets: "", reps: "", notes: "" },
    ];
    onChangeExercises(next);
  }

  function removeRow(index) {
    const next = exercises.filter((_, i) => i !== index);
    onChangeExercises(next);
  }

  // ----------------------------
  // ExerciseDB Search UI State
  // ----------------------------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Used to cancel fetches when query changes quickly
  const abortRef = useRef(null);

  // Small debounce so you don’t call API on every keypress
  useEffect(() => {
    const q = query.trim();
    setSearchError("");

    // close/reset when empty
    if (!q) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    const t = setTimeout(async () => {
      try {
        // cancel previous request
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        // NOTE: your service uses fetch internally without passing signal.
        // So we do a safe pattern: if you want real abort, we can add signal support in the service.
        const data = await searchExercisesByName(q);

        // Keep it light (avoid huge dropdown)
        const top = Array.isArray(data) ? data.slice(0, 12) : [];
        setResults(top);
      } catch (e) {
        setResults([]);
        setSearchError(e?.message || "Search failed.");
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  // Convert API item → your row shape
  function apiToRow(item) {
    const name = item?.name ? String(item.name) : "";
    const target = item?.target ? String(item.target) : "";
    const equipment = item?.equipment ? String(item.equipment) : "";
    const bodyPart = item?.bodyPart ? String(item.bodyPart) : "";

    // Put useful info into notes (you can change this)
    const autoNoteParts = [];
    if (target) autoNoteParts.push(`Target: ${target}`);
    if (equipment) autoNoteParts.push(`Equipment: ${equipment}`);
    if (bodyPart) autoNoteParts.push(`Body: ${bodyPart}`);

    return {
      name,
      sets: "3",
      reps: "8-12",
      notes: autoNoteParts.join(" | "),
      // optional metadata (won’t break your UI)
      meta: { target, equipment, bodyPart, apiId: item?.id || null },
    };
  }

  function handlePickExercise(item) {
    const row = apiToRow(item);
    addRow(row);

    // reset search box after adding
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSearchError("");
  }

  // Close dropdown when clicking outside
  const wrapRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const hasRows = exercises.length > 0;

  return (
    <div className="editTableWrap" ref={wrapRef}>
      {/* ----------------------------
          ExerciseDB Search Bar
         ---------------------------- */}
      <div style={{ marginBottom: 12, position: "relative" }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
          Search ExerciseDB
        </label>

        <input
          className="editCellInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder='Type an exercise name (e.g. "bench", "squat")'
        />

        <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
          {isSearching ? "Searching..." : searchError ? searchError : " "}
        </div>

        {/* Dropdown */}
        {isOpen && (results.length > 0 || isSearching) && (
          <div
            style={{
              position: "absolute",
              zIndex: 50,
              left: 0,
              right: 0,
              top: "100%",
              marginTop: 6,
              background: "#fff",
              border: "1px solid #e6e6e6",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
            }}
          >
            {results.length === 0 && isSearching ? (
              <div style={{ padding: 10, fontSize: 14 }}>Searching…</div>
            ) : (
              results.map((item, i) => (
                <button
                  key={`${item?.id || item?.name || i}`}
                  type="button"
                  onClick={() => handlePickExercise(item)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom:
                      i === results.length - 1 ? "none" : "1px solid #f0f0f0",
                  }}
                >
                  <div style={{ fontWeight: 800, textTransform: "capitalize" }}>
                    {item?.name || "Unnamed exercise"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {(item?.bodyPart ? `Body: ${item.bodyPart}` : "")}
                    {item?.target ? ` • Target: ${item.target}` : ""}
                    {item?.equipment ? ` • Equipment: ${item.equipment}` : ""}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ----------------------------
          Existing editable table
         ---------------------------- */}
      <table className="editTable">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {!hasRows ? (
            <tr>
              <td colSpan="5" className="editEmpty">
                No exercises. Click “Add Exercise” or search above.
              </td>
            </tr>
          ) : (
            exercises.map((ex, idx) => (
              <tr key={`${ex.name}-${idx}`}>
                <td>
                  <input
                    className="editCellInput"
                    value={ex.name}
                    onChange={(e) => updateRow(idx, "name", e.target.value)}
                    placeholder="Bench Press"
                  />
                </td>
                <td>
                  <input
                    className="editCellInput"
                    value={ex.sets}
                    onChange={(e) => updateRow(idx, "sets", e.target.value)}
                    placeholder="4"
                  />
                </td>
                <td>
                  <input
                    className="editCellInput"
                    value={ex.reps}
                    onChange={(e) => updateRow(idx, "reps", e.target.value)}
                    placeholder="6-8"
                  />
                </td>
                <td>
                  <input
                    className="editCellInput"
                    value={ex.notes || ""}
                    onChange={(e) => updateRow(idx, "notes", e.target.value)}
                    placeholder="RPE 7"
                  />
                </td>
                <td className="editActionsCell">
                  <button
                    type="button"
                    className="dangerBtn"
                    onClick={() => removeRow(idx)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="editFooter">
        <button type="button" className="secondaryBtn" onClick={() => addRow()}>
          + Add Exercise
        </button>
      </div>
    </div>
  );
}

export default EditableExerciseTable;
