import { useState } from "react";
import { Search, RefreshCw, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getParcels,
  updateParcelStatus,
} from "../services/parcelService";
import StatusBadge from "../components/StatusBadge";

export default function ManageParcels() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");

  const parcels = getParcels().filter((parcel) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      parcel.trackingNumber,
      parcel.recipientName,
      parcel.recipientId,
      parcel.courierName,
    ].some((value) => (value || "").toLowerCase().includes(query));

    return matchesSearch &&
      (status === "ALL" || parcel.status === status);
  });

  function handleStatusChange(id, newStatus) {
    setMessage("");

    try {
      updateParcelStatus(id, newStatus);
      setMessage("Parcel status updated successfully.");
      setVersion((value) => value + 1);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PARCEL OPERATIONS</span>
          <h1>Manage Parcels</h1>
          <p>Search parcel records and update their status.</p>
        </div>
        <Link to="/manager/register" className="primary-button">
          + Register Parcel
        </Link>
      </div>

      {message && <div className="info-message">{message}</div>}

      <section className="content-card" key={version}>
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Search tracking number, name, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="COLLECTED">Collected</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Recipient</th>
                <th>Courier</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => {
                const nextStatus = {
                  RECEIVED: "PROCESSING",
                  PROCESSING: "READY_FOR_PICKUP",
                  READY_FOR_PICKUP: "COLLECTED",
                }[parcel.status];

                return (
                  <tr key={parcel.id}>
                    <td className="table-id">{parcel.trackingNumber}</td>
                    <td>
                      <strong>{parcel.recipientName}</strong>
                      <span className="table-subtext">{parcel.recipientId}</span>
                    </td>
                    <td>{parcel.courierName}</td>
                    <td><StatusBadge status={parcel.status} /></td>
                    <td>
                      {nextStatus ? (
                        <button
                          className="small-button"
                          onClick={() => handleStatusChange(parcel.id, nextStatus)}
                        >
                          <RefreshCw size={14} />
                          {nextStatus === "PROCESSING"
                            ? "Process"
                            : nextStatus === "READY_FOR_PICKUP"
                            ? "Ready for Pickup"
                            : "Mark Collected"}
                        </button>
                      ) : (
                        <span className="muted">Completed</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/manager/tracking/${parcel.id}`}
                        className="small-button"
                      >
                        <Eye size={15} /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {parcels.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">No parcels found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}