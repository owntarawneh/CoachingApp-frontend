function DaySelector({ days, selectedDay, onChange }) {
  return (
    <select value={selectedDay} onChange={(e) => onChange(e.target.value)}>
      {days.map((day) => (
        <option key={day.day} value={day.day}>
          {day.day}
        </option>
      ))}
    </select>
  );
}

export default DaySelector;
