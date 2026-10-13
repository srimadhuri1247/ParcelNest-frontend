import { Download, Package, CheckCircle, Clock } from "lucide-react";
import { getParcels } from "../services/parcelService";

export default function Reports() {
  const parcels = getParcels();

  const received = parcels.filter((p) => p.status === "RECEIVED").length;
  const processing = parcels.filter((p) => p.status === "PROCESSING").length;
  const ready = parcels.filter((p) => p.status === "READY_FOR_PICKUP").length;
  const collected = parcels.filter((p) => p.status === "COLLECTED").length;

  function exportCSV() {
    const columns = [
      "Tracking Number",
      "Recipient",
      "Recipient ID",
      "Courier",
      "Status",
      "Received At",
      "Collected At",
    ];

    const rows = parcels.map((p) => [
      p.trackingNumber,
      p.recipientName,
      p.recipientId,
      p.courierName,
      p.status,
      p.receivedAt,
      p.collectedAt || "",
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      columns,
      ...rows,
    ].map((row) => row.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "campus-parcel-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const stats = [
    { label: "Total Parcels", value: parcels.length, icon: Package },
    { label: "Received", value: received, icon: Clock },
    { label: "Ready for Pickup", value: ready, icon: Package },
    { label: "Collected", value: collected, icon: CheckCircle },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ANALYTICS</span>
          <h1>Reports & Analytics</h1>
          <p>View parcel statistics and export the current report.</p>
        </div>
        <button className="primary-button" onClick={exportCSV}>
          <Download size={17} /> Export CSV
        </button>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon blue"><Icon size={22} /></div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Parcel Status Distribution</h2>
            <p>Number of parcels in each current status.</p>
          </div>
        </div>

        {[
          { label: "Received", value: received, color: "bar-blue" },
          { label: "Processing", value: processing, color: "bar-orange" },
          { label: "Ready for Pickup", value: ready, color: "bar-purple" },
          { label: "Collected", value: collected, color: "bar-green" },
        ].map((item) => {
          const percentage = parcels.length
            ? (item.value / parcels.length) * 100
            : 0;

          return (
            <div className="report-bar-row" key={item.label}>
              <div className="report-bar-label">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="report-bar-track">
                <div
                  className={`report-bar-fill ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <p className="muted report-note">
          Reports are calculated from the demo data stored in this browser.
        </p>
      </section>
    </div>
  );
}