import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import StatCard from "../../../components/common/StatCard/StatCard";
import ActionCard from "../../../components/common/ActionCard/ActionCard";
import SectionCard from "../../../components/common/SectionCard/SectionCard";
import "./ClientDashboard.css";

import { fetchClientById } from "../../../api/clients.api";
import { fetchTrainingPlan } from "../../../api/training.api";
import { fetchCheckIns } from "../../../api/checkins.api";
import { getClientId } from "../../../auth/session";

function safeText(v) {
  return String(v ?? "").trim();
}

function ClientDashboard() {
  const navigate = useNavigate();
  const CLIENT_ID = getClientId();

  const [client, setClient] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!CLIENT_ID) {
      alert("Not logged in as client");
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const [clientData, trainingData, checkInsData] = await Promise.all([
          fetchClientById(CLIENT_ID).catch(() => null),
          fetchTrainingPlan(CLIENT_ID).catch(() => null),
          fetchCheckIns(`?clientId=${encodeURIComponent(CLIENT_ID)}`).catch(() => []),
        ]);

        if (!isMounted) return;

        setClient(clientData || null);
        setTrainingPlan(trainingData || null);
        setCheckIns(Array.isArray(checkInsData) ? checkInsData : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard");
        if (isMounted) {
          setClient(null);
          setTrainingPlan(null);
          setCheckIns([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [CLIENT_ID]);

  const quickActions = useMemo(
    () => [
      {
        id: "qa_training",
        label: "View Training Plan",
        description: "See your current weekly training schedule",
        to: "/client/training-plan",
      },
      {
        id: "qa_nutrition",
        label: "View Nutrition Plan",
        description: "Review your daily calories and macros",
        to: "/client/nutrition-plan",
      },
      {
        id: "qa_checkin",
        label: "Submit Weekly Check-In",
        description: "Send your weekly measurements and notes to your coach",
        to: "/client/weekly-check-in",
      },
      {
        id: "qa_progress",
        label: "Progress History",
        description: "Track your check-ins over time",
        to: "/client/progress-history",
      },
    ],
    []
  );

  const recentCheckIn = useMemo(() => {
    if (!checkIns.length) return null;
    return [...checkIns].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  }, [checkIns]);

  const overview = useMemo(() => {
    const fullName = safeText(client?.name) || `Client ${CLIENT_ID}`;
    const goal = safeText(client?.goal) || "—";
    const totalCheckIns = checkIns.length;

    const durationWeeks =
      trainingPlan?.weeks?.length ??
      trainingPlan?.durationWeeks ??
      null;

    const currentWeek = trainingPlan?.currentWeek ?? null;

    const latestWeight =
      recentCheckIn?.weight != null ? Number(recentCheckIn.weight) : null;

    return [
      {
        id: "ov_name",
        label: "Client",
        value: fullName,
        subtext: `Goal: ${goal}`,
      },
      {
        id: "ov_training",
        label: "Training",
        value:
          durationWeeks && currentWeek
            ? `Week ${currentWeek} / ${durationWeeks}`
            : "Not set",
        subtext: "Current plan progress",
      },
      {
        id: "ov_checkins",
        label: "Check-Ins",
        value: String(totalCheckIns),
        subtext:
          latestWeight != null
            ? `Latest weight: ${latestWeight} kg`
            : "No check-ins yet",
      },
    ];
  }, [client, trainingPlan, checkIns, recentCheckIn, CLIENT_ID]);

  const recentSection = useMemo(() => {
    if (!recentCheckIn) {
      return {
        date: "No submissions yet",
        stats: [
          { label: "Weight", value: "-" },
          { label: "Waist", value: "-" },
        ],
        coachUpdate: "No coach notes yet.",
      };
    }

    return {
      date: safeText(recentCheckIn.date) || "—",
      stats: [
        {
          label: "Weight",
          value: recentCheckIn.weight != null ? `${recentCheckIn.weight} kg` : "-",
        },
        {
          label: "Waist",
          value: recentCheckIn.waist ?? recentCheckIn.body?.waist ?? "-",
        },
        {
          label: "Status",
          value: safeText(recentCheckIn.status) || "submitted",
        },
      ],
      coachUpdate:
        safeText(recentCheckIn.coachNotes) ||
        safeText(recentCheckIn.coach_notes) ||
        "No coach notes yet.",
    };
  }, [recentCheckIn]);

  return (
    <div>
      <PageHeader
        breadcrumb="Client / Dashboard"
        title="Dashboard"
        subtitle="Overview of your fitness journey"
      />

      <div className="section dashboardSection">
        <div className="dashboardGrid3">
          {overview.map((item) => (
            <div key={item.id} className="card statAccent">
              <StatCard label={item.label} value={item.value} subtext={item.subtext} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="card dashboardNotice" style={{ padding: 12, marginTop: 12 }}>
            Loading...
          </div>
        )}
      </div>

      <div className="section dashboardSection">
        <h3 className="sectionTitle">Quick Actions</h3>
        <div className="dashboardGrid2">
          {quickActions.map((action) => (
            <div key={action.id} className="card cardHover">
              <ActionCard {...action} />
            </div>
          ))}
        </div>
      </div>

      <div className="section dashboardSection">
        <SectionCard
          title="Recent Check-In & Coach Update"
          rightText="View Progress History"
          onRightClick={() => navigate("/client/progress-history")}
        >
          <div className="recentRow">
            <div>
              <div className="recentDate">{recentSection.date}</div>
              <ul className="recentStats">
                {recentSection.stats.map((stat) => (
                  <li key={stat.label}>
                    <strong>{stat.label}:</strong> {stat.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="recentLabel">Coach Notes</div>
              <p className="recentText">{recentSection.coachUpdate}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ClientDashboard;
