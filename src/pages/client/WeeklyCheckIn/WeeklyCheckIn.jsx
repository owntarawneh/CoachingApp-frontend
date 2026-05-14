import { useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";

import FormCard from "../../../components/form/FormCard/FormCard";
import TextInput from "../../../components/form/TextInput/TextInput";
import UnitToggle from "../../../components/checkin/UnitToggle/UnitToggle";
import MeasurementsGrid from "../../../components/checkin/MeasurementsGrid/MeasurementsGrid";
import PhotoUploadBox from "../../../components/checkin/PhotoUploadBox/PhotoUploadBox";

import { createCheckIn } from "../../../api/checkins.api";
import { getClientId } from "../../../auth/session";

import "./WeeklyCheckIn.css";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

// Convert File -> { name, dataUrl } so it can be sent as JSON safely
function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);

    // If it's already stored (object with dataUrl), keep it
    if (typeof file === "object" && file.dataUrl && file.name) {
      return resolve(file);
    }

    // If it's a real File
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
      reader.onerror = () => resolve({ name: file.name, dataUrl: "" });
      reader.readAsDataURL(file);
      return;
    }

    resolve(null);
  });
}

async function normalizePhotosForStorage(photos) {
  const front = await fileToDataUrl(photos?.front || null);
  const side = await fileToDataUrl(photos?.side || null);
  const back = await fileToDataUrl(photos?.back || null);
  return { front, side, back };
}

function WeeklyCheckIn() {
  const CURRENT_CLIENT_ID = getClientId();

  // safety fallback
  if (!CURRENT_CLIENT_ID) {
    alert("Not logged in as client");
    return null;
  }

  const [weightUnit, setWeightUnit] = useState("kg");
  const [measureUnit, setMeasureUnit] = useState("cm");

  const [weight, setWeight] = useState("");

  // body keys must match CoachCheckInDetails
  const [body, setBody] = useState({
    leftArm: "",
    rightArm: "",
    chest: "",
    waist: "",
    hips: "",
    leftThigh: "",
    rightThigh: "",
    leftCalf: "",
    rightCalf: "",
  });

  const [photos, setPhotos] = useState({ front: null, side: null, back: null });
  const [complianceNotes, setComplianceNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!String(weight || "").trim()) {
      alert("Please enter your weight.");
      return;
    }

    setSubmitting(true);

    try {
      const photosStored = await normalizePhotosForStorage(photos);

      const newCheckIn = {
        id: `ci_${Date.now()}`,
        clientId: CURRENT_CLIENT_ID,
        date: isoToday(),

        // list/table summary fields (course simple)
        weight: Number(weight),
        waist: body?.waist ? Number(body.waist) : null,
        sleepHours: null,
        energy: "Average",
        adherence: null,

        notes: complianceNotes || "",

        coachNotes: "",
        status: "submitted",

        weightUnit,
        measureUnit,
        body: body || {},
        photos: photosStored,
      };

      await createCheckIn(newCheckIn);

      alert("Weekly check-in submitted.");

      // reset
      setWeight("");
      setBody({
        leftArm: "",
        rightArm: "",
        chest: "",
        waist: "",
        hips: "",
        leftThigh: "",
        rightThigh: "",
        leftCalf: "",
        rightCalf: "",
      });
      setPhotos({ front: null, side: null, back: null });
      setComplianceNotes("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit check-in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard / Weekly Check-In"
        title="Weekly Check-In"
        subtitle="Submit your weekly progress update"
      />

      <form onSubmit={handleSubmit}>
        <div className="weeklyLayout">
          {/* LEFT COLUMN */}
          <div className="weeklyLeft">
            <div className="weeklySectionTitle">1. Current Measurements</div>
            <FormCard>
              <div className="weightRow">
                <div className="weightInput">
                  <TextInput
                    label="Weight"
                    name="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className="weightToggle">
                  <UnitToggle
                    value={weightUnit}
                    options={[
                      { value: "lbs", label: "lbs" },
                      { value: "kg", label: "kg" },
                    ]}
                    onChange={setWeightUnit}
                  />
                </div>
              </div>
            </FormCard>

            <div className="weeklySectionTitle">2. Body Measurements</div>
            <FormCard>
              <MeasurementsGrid
                unit={measureUnit}
                onUnitChange={setMeasureUnit}
                values={body}
                onValueChange={setBody}
              />
            </FormCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="weeklyRight">
            <div className="weeklySectionTitle">3. Progress Photos</div>
            <FormCard>
              <div className="photosGrid">
                <PhotoUploadBox
                  label="Front"
                  value={photos.front}
                  onChange={(file) => setPhotos((p) => ({ ...p, front: file }))}
                />
                <PhotoUploadBox
                  label="Side"
                  value={photos.side}
                  onChange={(file) => setPhotos((p) => ({ ...p, side: file }))}
                />
                <PhotoUploadBox
                  label="Back"
                  value={photos.back}
                  onChange={(file) => setPhotos((p) => ({ ...p, back: file }))}
                />
              </div>
            </FormCard>

            <div className="weeklySectionTitle">4. Compliance</div>
            <FormCard>
              <div className="compliancePrompt">
                How compliant were you with your diet & training plan?
              </div>

              <textarea
                className="weeklyTextArea"
                value={complianceNotes}
                onChange={(e) => setComplianceNotes(e.target.value)}
                placeholder="Any other comments or information you'd like to share..."
                rows={6}
              />
            </FormCard>

            <div className="submitRow">
              <button className="weeklySubmitBtn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Check-In"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default WeeklyCheckIn;
