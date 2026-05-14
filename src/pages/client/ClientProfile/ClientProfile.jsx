import { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ProfileCard from "../../../components/profile/ProfileCard/ProfileCard";
import ReadOnlyField from "../../../components/profile/ReadOnlyField/ReadOnlyField";
import TextInput from "../../../components/form/TextInput/TextInput";
import PrimaryButton from "../../../components/common/PrimaryButton/PrimaryButton";
import "./ClientProfile.css";

import { fetchClientById, updateClient } from "../../../api/clients.api";
import { getClientId } from "../../../auth/session"; // ✅ adjust path if needed

/**
 * Convert empty string -> null (so backend COALESCE keeps existing value)
 * Convert valid numeric string -> Number
 */
function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function buildEmptyProfile(clientId) {
  return {
    id: clientId,
    name: `Client ${clientId}`, // required in DB
    fullName: "",
    email: "",
    phone: "",
    age: null,
    heightCm: null,
    currentWeightKg: null,
    goal: "",
    trainingExperience: "",
    injuries: "",
    preferences: "",
  };
}

function ClientProfile() {
  const clientId = getClientId(); // ✅ dynamic (no hardcoded CURRENT_CLIENT_ID)

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      // ✅ safety fallback
      if (!clientId) {
        alert("Not logged in as client");
        if (isMounted) {
          setProfile(null);
          setDraft(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchClientById(clientId);

        if (!isMounted) return;

        // If backend returns an object, use it
        if (data && typeof data === "object") {
          setProfile(data);
          setDraft(data);
        } else {
          // If backend returns nothing, allow creation
          const empty = buildEmptyProfile(clientId);
          setProfile(null);
          setDraft(empty);
        }
      } catch (err) {
        console.error(err);

        if (!isMounted) return;

        // If backend says "not found", still allow creation
        const empty = buildEmptyProfile(clientId);
        setProfile(null);
        setDraft(empty);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  function startEdit() {
    if (!clientId) {
      alert("Not logged in as client");
      return;
    }
    // Allow edit even if profile doesn't exist yet
    setDraft((prev) => prev || buildEmptyProfile(clientId));
    setIsEditing(true);
  }

  function cancelEdit() {
    if (!clientId) {
      alert("Not logged in as client");
      return;
    }
    setDraft(profile || buildEmptyProfile(clientId));
    setIsEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...(prev || {}), [name]: value }));
  }

  async function saveProfile() {
    if (!clientId) {
      alert("Not logged in as client");
      return;
    }
    if (!draft) return;
    if (saving) return;

    setSaving(true);
    try {
      // Important: send null for empty numeric fields
      const payload = {
        ...draft,

        // Make sure DB required field exists
        name: String(draft.name || `Client ${clientId}`),

        // Numeric fields
        age: toNumberOrNull(draft.age),
        heightCm: toNumberOrNull(draft.heightCm),
        currentWeightKg: toNumberOrNull(draft.currentWeightKg),
      };

      const updated = await updateClient(clientId, payload);

      setProfile(updated || payload);
      setDraft(updated || payload);
      setIsEditing(false);
      alert("Profile saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  const hasProfile = !!profile;

  return (
    <div>
      <PageHeader
        breadcrumb="Client / Profile"
        title="Client Profile"
        subtitle="View and manage your personal information"
      />

      <div className="section">
        <div className="profileActions">
          {loading ? (
            <div className="card" style={{ padding: 12 }}>
              Loading...
            </div>
          ) : !isEditing ? (
            <PrimaryButton onClick={startEdit}>
              {hasProfile ? "Edit Profile" : "Create Profile"}
            </PrimaryButton>
          ) : (
            <div className="profileBtnRow">
              <PrimaryButton onClick={saveProfile}>
                {saving ? "Saving..." : "Save"}
              </PrimaryButton>
              <PrimaryButton variant="secondary" onClick={cancelEdit}>
                Cancel
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>

      {/* Always render cards using draft (so creation works) */}
      {!loading && draft ? (
        <>
          <div className="section">
            <ProfileCard title="Personal Information">
              {!isEditing ? (
                <div className="profileGrid2">
                  <ReadOnlyField
                    label="Full Name"
                    value={profile?.fullName || profile?.name || "—"}
                  />
                  <ReadOnlyField label="Email" value={profile?.email || "—"} />
                  <ReadOnlyField label="Phone" value={profile?.phone || "—"} />
                  <ReadOnlyField label="Age" value={profile?.age ?? "—"} />
                </div>
              ) : (
                <div className="profileGrid2">
                  {/* Optional: keep DB "name" available (required) */}
                  <TextInput
                    label="Display Name (Required)"
                    name="name"
                    value={draft?.name ?? ""}
                    onChange={handleChange}
                  />

                  <TextInput
                    label="Full Name"
                    name="fullName"
                    value={draft?.fullName ?? ""}
                    onChange={handleChange}
                  />

                  <TextInput
                    label="Email"
                    name="email"
                    value={draft?.email ?? ""}
                    onChange={handleChange}
                  />

                  <TextInput
                    label="Phone"
                    name="phone"
                    value={draft?.phone ?? ""}
                    onChange={handleChange}
                  />

                  <TextInput
                    label="Age"
                    name="age"
                    type="number"
                    value={draft?.age ?? ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </ProfileCard>
          </div>

          <div className="section">
            <ProfileCard title="Fitness Details">
              {!isEditing ? (
                <div className="profileGrid2">
                  <ReadOnlyField
                    label="Height (cm)"
                    value={profile?.heightCm ?? "—"}
                  />
                  <ReadOnlyField
                    label="Current Weight (kg)"
                    value={profile?.currentWeightKg ?? "—"}
                  />
                  <ReadOnlyField label="Goal" value={profile?.goal || "—"} />
                  <ReadOnlyField
                    label="Training Experience"
                    value={profile?.trainingExperience || "—"}
                  />
                  <ReadOnlyField
                    label="Injuries"
                    value={profile?.injuries || "—"}
                  />
                  <ReadOnlyField
                    label="Preferences"
                    value={profile?.preferences || "—"}
                  />
                </div>
              ) : (
                <div className="profileGrid2">
                  <TextInput
                    label="Height (cm)"
                    name="heightCm"
                    type="number"
                    value={draft?.heightCm ?? ""}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Current Weight (kg)"
                    name="currentWeightKg"
                    type="number"
                    value={draft?.currentWeightKg ?? ""}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Goal"
                    name="goal"
                    value={draft?.goal ?? ""}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Training Experience"
                    name="trainingExperience"
                    value={draft?.trainingExperience ?? ""}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Injuries"
                    name="injuries"
                    value={draft?.injuries ?? ""}
                    onChange={handleChange}
                  />
                  <TextInput
                    label="Preferences"
                    name="preferences"
                    value={draft?.preferences ?? ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </ProfileCard>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ClientProfile;
