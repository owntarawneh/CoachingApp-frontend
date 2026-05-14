import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import CoachNotesBox from "../../../components/coach/CoachNotesBox/CoachNotesBox";
import "./CoachCheckInDetails.css";

import { fetchCheckInById, reviewCheckIn } from "../../../api/checkins.api";
import { fetchClientById } from "../../../api/clients.api";

function formatUnitLabel(u) {
  if (u === "in") return "in";
  if (u === "cm") return "cm";
  if (u === "lbs") return "lbs";
  return "kg";
}

function normalizeStatus(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "submitted") return "Pending";
  if (s === "reviewed") return "Reviewed";
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function PhotoPreview({ label, photo }) {
  if (!photo) {
    return (
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
        <div style={{ color: "var(--muted)" }}>No photo</div>
      </div>
    );
  }

  const name = photo?.name || "photo";
  const src = photo?.dataUrl || "";

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        />
      ) : (
        <div style={{ color: "var(--muted)" }}>{name}</div>
      )}
    </div>
  );
}

function CoachCheckInDetails() {
  const { checkInId } = useParams();

  const [checkIn, setCheckIn] = useState(null);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);

  const [draftNotes, setDraftNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Load check-in from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchCheckInById(checkInId);
        if (!isMounted) return;

        const normalized = {
          ...data,
          status: normalizeStatus(data.status),
        };

        setCheckIn(normalized);
        setDraftNotes(normalized.coachNotes || "");

        // fetch client name (optional)
        const clientId = normalized.clientId;
        if (clientId) {
          const c = await fetchClientById(clientId).catch(() => null);
          if (isMounted) setClientName(c?.name || clientId);
        } else {
          setClientName("");
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setCheckIn(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [checkInId]);

  const weightUnit = useMemo(
    () => formatUnitLabel(checkIn?.weightUnit),
    [checkIn]
  );
  const measureUnit = useMemo(
    () => formatUnitLabel(checkIn?.measureUnit),
    [checkIn]
  );

  const body = checkIn?.body || {};
  const photos = checkIn?.photos || {};

  async function saveNotes() {
    if (!checkIn) return;
    if (saving) return;

    setSaving(true);
    try {
      const nextStatus = checkIn.status === "Reviewed" ? "reviewed" : "submitted";

      await reviewCheckIn(checkIn.id, {
        status: nextStatus,
        coachNotes: draftNotes,
      });

      setCheckIn((prev) => (prev ? { ...prev, coachNotes: draftNotes } : prev));
      alert("Notes saved");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  async function markReviewed() {
    if (!checkIn) return;
    if (saving) return;

    setSaving(true);
    try {
      await reviewCheckIn(checkIn.id, {
        status: "reviewed",
        coachNotes: draftNotes,
      });

      setCheckIn((prev) =>
        prev ? { ...prev, status: "Reviewed", coachNotes: draftNotes } : prev
      );
      alert("Marked as reviewed");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to mark reviewed");
    } finally {
      setSaving(false);
    }
  }

  // ✅ Wrap EVERYTHING in the same centered container
  return (
    <div className="checkInDetailsPage">
      {loading ? (
        <>
          <PageHeader
            breadcrumb="Coach / Check-Ins / Details"
            title="Check-In Details"
            subtitle="Loading..."
          />
          <div className="card" style={{ padding: 16 }}>
            Loading check-in...
          </div>
        </>
      ) : !checkIn ? (
        <>
          <PageHeader
            breadcrumb="Coach / Check-Ins / Details"
            title="Check-In Details"
            subtitle={`Not found: ${checkInId}`}
          />
          <div className="card" style={{ padding: 16 }}>
            This check-in does not exist.{" "}
            <Link to="/coach/check-ins">Back to inbox</Link>
          </div>
        </>
      ) : (
        <>
          <PageHeader
            breadcrumb="Coach / Check-Ins / Details"
            title="Check-In Details"
            subtitle={`${clientName || checkIn.clientId} • ${checkIn.date}`}
          />

          <div className="checkInDetailsGrid">
            <div className="checkInLeft">
              <div className="card detailsCard">
                <div className="detailsTitle">Client Submission</div>

                <div className="detailsRow">
                  <div className="detailsLabel">Client</div>
                  <div className="detailsValue">
                    {clientName || checkIn.clientId}
                  </div>
                </div>

                <div className="detailsRow">
                  <div className="detailsLabel">Date</div>
                  <div className="detailsValue">{checkIn.date}</div>
                </div>

                <div className="detailsRow">
                  <div className="detailsLabel">Weight</div>
                  <div className="detailsValue">
                    {checkIn.weight ?? "-"} {weightUnit}
                  </div>
                </div>

                <div style={{ marginTop: 14, fontWeight: 900 }}>
                  Body Measurements ({measureUnit})
                </div>

                <div className="measurementsGrid">
                  <div className="detailsRow">
                    <div className="detailsLabel">Left Arm</div>
                    <div className="detailsValue">{body.leftArm || "-"}</div>
                  </div>
                  <div className="detailsRow">
                    <div className="detailsLabel">Right Arm</div>
                    <div className="detailsValue">{body.rightArm || "-"}</div>
                  </div>

                  <div className="detailsRow">
                    <div className="detailsLabel">Chest</div>
                    <div className="detailsValue">{body.chest || "-"}</div>
                  </div>
                  <div className="detailsRow">
                    <div className="detailsLabel">Waist</div>
                    <div className="detailsValue">{body.waist || "-"}</div>
                  </div>

                  <div className="detailsRow">
                    <div className="detailsLabel">Hips</div>
                    <div className="detailsValue">{body.hips || "-"}</div>
                  </div>
                  <div className="detailsRow">
                    <div className="detailsLabel">Left Thigh</div>
                    <div className="detailsValue">{body.leftThigh || "-"}</div>
                  </div>

                  <div className="detailsRow">
                    <div className="detailsLabel">Right Thigh</div>
                    <div className="detailsValue">{body.rightThigh || "-"}</div>
                  </div>
                  <div className="detailsRow">
                    <div className="detailsLabel">Left Calf</div>
                    <div className="detailsValue">{body.leftCalf || "-"}</div>
                  </div>

                  <div className="detailsRow">
                    <div className="detailsLabel">Right Calf</div>
                    <div className="detailsValue">{body.rightCalf || "-"}</div>
                  </div>
                </div>

                <div style={{ marginTop: 16, fontWeight: 900 }}>
                  Progress Photos
                </div>

                <div className="photosGridDetails">
                  <PhotoPreview label="Front" photo={photos.front} />
                  <PhotoPreview label="Side" photo={photos.side} />
                  <PhotoPreview label="Back" photo={photos.back} />
                </div>

                <div className="detailsNotes">
                  <div className="detailsLabel">Compliance Notes</div>
                  <div className="detailsNotesBox">{checkIn.notes || "-"}</div>
                </div>
              </div>

              <div className="backRow">
                <Link className="backLink" to="/coach/check-ins">
                  ← Back to inbox
                </Link>
              </div>
            </div>

            <div className="checkInRight">
              <CoachNotesBox
                value={draftNotes}
                onChange={setDraftNotes}
                onSave={saveNotes}
                onMarkReviewed={markReviewed}
                status={checkIn.status}
                disabled={saving}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CoachCheckInDetails;
