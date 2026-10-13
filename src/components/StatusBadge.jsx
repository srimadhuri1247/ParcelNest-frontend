import React from "react";

export default function StatusBadge({ status }) {
  const labels = {
    RECEIVED: "Received",
    PROCESSING: "Processing",
    READY_FOR_PICKUP: "Ready for Pickup",
    COLLECTED: "Collected",
  };

  return (
    <span className={`status-badge status-${status?.toLowerCase()}`}>
      {labels[status] || status || "Unknown"}
    </span>
  );
}
