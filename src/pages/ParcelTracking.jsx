import { CheckCircle, Circle, Package, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getParcelById } from "../services/parcelService";
import StatusBadge from "../components/StatusBadge";

const steps = [
  { status: "RECEIVED", label: "Parcel Received", description: "Parcel arrived at the campus desk." },
  { status: "PROCESSING", label: "Processing", description: "Parcel details are being processed." },
  { status: "READY_FOR_PICKUP", label: "Ready for Pickup", description: "Parcel is available for collection." },
  { status: "COLLECTED", label: "Collected", description: "Collection has been confirmed." },
];

export default function ParcelTracking() {
  const { id } = useParams();
  const parcel = getParcelById(id);

  if (!parcel) {
    return (
      <div className="page">
        <h1>Parcel not found</h1>
        <p>The requested parcel does not exist in the demo data.</p>
        <Link to="/user/parcels" className="primary-button">
          Back to My Parcels
        </Link>
      </div>
    );
  }

  const currentIndex = steps.findIndex(
    (step) => step.status === parcel.status
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRACKING DETAILS</span>
          <h1>Track Parcel</h1>
          <p>View parcel details and delivery progress.</p>
        </div>
        <StatusBadge status={parcel.status} />
      </div>

      <section className="content-card tracking-summary">
        <div className="tracking-icon"><Package size={30} /></div>
        <div className="tracking-main">
          <span className="muted">Campus tracking number</span>
          <h2>{parcel.trackingNumber}</h2>
          <p>{parcel.courierName} · {parcel.courierTrackingNumber}</p>
        </div>
      </section>

      <div className="two-column">
        <section className="content-card">
          <h2>Delivery Timeline</h2>
          <p className="muted">Progress of your campus parcel.</p>

          <div className="timeline">
            {steps.map((step, index) => {
              const completed = currentIndex >= index;
              const current = currentIndex === index;

              return (
                <div className="timeline-item" key={step.status}>
                  <div className={`timeline-marker ${completed ? "completed" : ""}`}>
                    {completed
                      ? <CheckCircle size={22} />
                      : <Circle size={22} />}
                  </div>
                  <div className="timeline-content">
                    <strong>{step.label}</strong>
                    <p>{step.description}</p>
                    {current && <span className="timeline-current">Current status</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="content-card">
          <h2>Parcel Information</h2>

          <div className="detail-list">
            <div><span>Recipient</span><strong>{parcel.recipientName}</strong></div>
            <div><span>Recipient ID</span><strong>{parcel.recipientId}</strong></div>
            <div><span>Courier</span><strong>{parcel.courierName}</strong></div>
            <div><span>Received on</span><strong>{new Date(parcel.receivedAt).toLocaleString()}</strong></div>
            <div>
              <span><MapPin size={15} /> Storage location</span>
              <strong>{parcel.storageLocation || "Not assigned"}</strong>
            </div>
            <div>
              <span>Collected on</span>
              <strong>
                {parcel.collectedAt
                  ? new Date(parcel.collectedAt).toLocaleString()
                  : "Not collected"}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <Link to="/user/parcels" className="text-link back-link">
        Back to My Parcels
      </Link>
    </div>
  );
}