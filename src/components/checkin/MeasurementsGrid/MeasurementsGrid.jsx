import TextInput from "../../form/TextInput/TextInput";
import UnitToggle from "../UnitToggle/UnitToggle";
import "./MeasurementsGrid.css";

function MeasurementsGrid({ unit, onUnitChange, values, onValueChange }) {
  function setField(name, value) {
    onValueChange((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="bodyCard">
      <div className="bodyTop">
        <UnitToggle
          value={unit}
          options={[
            { value: "in", label: "inches" },
            { value: "cm", label: "cm" },
          ]}
          onChange={onUnitChange}
        />
      </div>

      <div className="bodyGrid">
        <div className="bodyCol">
          <TextInput
            label="LEFT ARM"
            name="leftArm"
            value={values.leftArm}
            onChange={(e) => setField("leftArm", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="WAIST"
            name="waist"
            value={values.waist}
            onChange={(e) => setField("waist", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="LEFT THIGH"
            name="leftThigh"
            value={values.leftThigh}
            onChange={(e) => setField("leftThigh", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="LEFT CALF"
            name="leftCalf"
            value={values.leftCalf}
            onChange={(e) => setField("leftCalf", e.target.value)}
            placeholder=""
          />
        </div>

        <div className="bodySilhouette" aria-hidden="true" />

        <div className="bodyCol">
          <TextInput
            label="CHEST"
            name="chest"
            value={values.chest}
            onChange={(e) => setField("chest", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="RIGHT ARM"
            name="rightArm"
            value={values.rightArm}
            onChange={(e) => setField("rightArm", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="HIPS"
            name="hips"
            value={values.hips}
            onChange={(e) => setField("hips", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="RIGHT THIGH"
            name="rightThigh"
            value={values.rightThigh}
            onChange={(e) => setField("rightThigh", e.target.value)}
            placeholder=""
          />
          <TextInput
            label="RIGHT CALF"
            name="rightCalf"
            value={values.rightCalf}
            onChange={(e) => setField("rightCalf", e.target.value)}
            placeholder=""
          />
        </div>
      </div>

      <div className="bodyFoot">Measurement unit: {unit === "in" ? "inches" : "cm"}</div>
    </div>
  );
}

export default MeasurementsGrid;
