import "./ExerciseTable.css";

function ExerciseTable({ exercises }) {
  return (
    <div className="exerciseTableWrap">
      <table className="exerciseTable">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {exercises.map((ex) => (
            <tr key={ex.name}>
              <td>{ex.name}</td>
              <td>{ex.sets}</td>
              <td>{ex.reps}</td>
              <td>{ex.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExerciseTable;
