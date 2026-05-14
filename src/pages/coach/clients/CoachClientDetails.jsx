import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Tabs from "../../../components/common/Tabs/Tabs";
import "./CoachClientDetails.css";

import { fetchClientById } from "../../../api/clients.api";

function CoachClientDetails() {
  const { clientId } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchClientById(clientId);
        if (isMounted) setClient(data || null);
      } catch (err) {
        console.warn("Client not found, falling back to ID only");
        if (isMounted) setClient(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const tabs = [
    { label: "Overview", to: "overview" },
    { label: "Progress", to: "progress" },
    { label: "Check-Ins", to: "check-ins" },
    { label: "Training Plan", to: "training" },
    { label: "Nutrition Plan", to: "nutrition" },
  ];

  return (
    <div className="coachClientDetailsPage">
      <PageHeader
        breadcrumb="Coach / Clients / Details"
        title="Client Details"
        subtitle={
          loading
            ? "Loading client..."
            : client
            ? `${client.name} (ID: ${client.id})`
            : `Client ID: ${clientId}`
        }
      />

      <Tabs items={tabs} />

      {/* Child tab content renders here */}
      <div className="coachClientDetailsBody">
        <Outlet />
      </div>
    </div>
  );
}

export default CoachClientDetails;
