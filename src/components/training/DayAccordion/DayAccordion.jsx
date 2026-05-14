import { useState } from "react";
import ExerciseTable from "../ExerciseTable/ExerciseTable";
import "./DayAccordion.css";

function DayAccordion({ days }) {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleDay(index) {
    setOpenIndex(index === openIndex ? -1 : index);
  }

  return (
    <div className="dayAccordion">
      {days.map((d, index) => (
        <div key={d.day} className="dayItem">
          <button
            type="button"
            className="dayHeader"
            onClick={() => toggleDay(index)}
          >
            <span>{d.day}</span>
            <span className="dayArrow">{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index ? (
            <div className="dayBody">
              <ExerciseTable exercises={d.exercises} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default DayAccordion;
