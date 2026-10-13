import { useState } from "react";
import { CheckCircle, Search } from "lucide-react";
import {
  confirmCollection,
  getParcels,
} from "../services/parcelService";
import StatusBadge from "../components/StatusBadge";

export default function CollectionConfirmation() {
  const [query, setQuery] = useState("");
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const parcels = getParcels().filter((parcel) => {
    const text = query.toLowerCase();

    return [
      parcel.trackingNumber,
      parcel.recipientName,
      parcel.recipientId,
    ].some((value) => (value || "").toLowerCase().includes(text));
  });

  function handleCollect(parcel) {
    setMessage("");
    setError("");

    if (
      !window.confirm(
        `Confirm that ${parcel.recipientName} has collected ${parcel.trackingNumber}?`
      )
    ) {
      return;
    }

    try {
      confirmCollection(parcel.id);
      setMessage(`Collection confirmed for ${parcel.trackingNumber}.`);
      setVersion((value) => value + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PARCEL OPERATIONS</span>
          <h1>Collection Confirmation</h1>
          <p>Verify parcel pickup and record the collection.</p>
        </div>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <section className="content-card" key={version}>
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tracking number, name or college ID..."
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Collection</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id}>
                  <td className="table-id">{parcel.trackingNumber}</td>
                  <td>
                    <strong>{parcel.recipientName}</strong>
                    <span className="table-subtext">{parcel.recipientId}</span>
                  </td>
                  <td><StatusBadge status={parcel.status} /></td>
                  <td>
                    {parcel.status === "READY_FOR_PICKUP" ? (
                      <button
                        className="primary-button small-primary"
                        onClick={() => handleCollect(parcel)}
                      >
                        <CheckCircle size={15} /> Confirm Collection
                      </button>
                    ) : parcel.status === "COLLECTED" ? (
                      <span className="success-text">
                        Collected{" "}
                        {parcel.collectedAt
                          ? new Date(parcel.collectedAt).toLocaleString()
                          : ""}
                      </span>
                    ) : (
                      <span className="muted">Not ready for pickup</span>
                    )}
                  </td>
                </tr>
              ))}

              {parcels.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">No parcels found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}