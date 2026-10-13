import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getParcels } from "../services/parcelService";
import StatusBadge from "../components/StatusBadge";

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export default function Dashboard({ role }) {
  const { user } = useAuth();
  const allParcels = getParcels();

  const parcels =
    role === "USER"
      ? allParcels.filter(
          (parcel) =>
            parcel.recipientEmail.toLowerCase() === user.email.toLowerCase()
        )
      : allParcels;

  const received = parcels.filter((p) => p.status === "RECEIVED").length;
  const processing = parcels.filter((p) => p.status === "PROCESSING").length;
  const ready = parcels.filter((p) => p.status === "READY_FOR_PICKUP").length;
  const collected = parcels.filter((p) => p.status === "COLLECTED").length;

  const title =
    role === "USER"
      ? "My Dashboard"
      : role === "MANAGER"
      ? "Manager Dashboard"
      : "Admin Dashboard";

  const description =
    role === "USER"
      ? "Here is an overview of your campus deliveries."
      : role === "MANAGER"
      ? "Manage incoming parcels and campus collections."
      : "Monitor parcel activity and campus delivery operations.";

  const cards = [
    { label: "Total Parcels", value: parcels.length, icon: Package, color: "blue" },
    { label: "Received", value: received, icon: Clock, color: "orange" },
    { label: "Ready for Pickup", value: ready, icon: AlertCircle, color: "purple" },
    { label: "Collected", value: collected, icon: CheckCircle, color: "green" },
  ];

  const recentParcels = [...parcels]
    .sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() -
        new Date(a.receivedAt).getTime()
    )
    .slice(0, 5);

  const parcelLink =
    role === "USER"
      ? "/user/parcels"
      : role === "MANAGER"
      ? "/manager/parcels"
      : "/admin/parcels";

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {role === "MANAGER" && (
          <Link to="/manager/register" className="primary-button">
            <Package size={18} /> Register Parcel
          </Link>
        )}
      </div>

      <div className="welcome-banner">
        <div>
          <span>WELCOME BACK</span>
          <h2>Hello, {user.name.split(" ")[0]}!</h2>
          <p>
            {role === "USER"
              ? "Keep track of your deliveries and never miss a pickup."
              : "Everything you need to manage campus parcels is here."}
          </p>
        </div>
        <Package size={66} />
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon size={23} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      {role === "USER" && ready > 0 && (
        <div className="notice-banner">
          <AlertCircle size={22} />
          <div>
            <strong>You have {ready} parcel(s) ready for pickup.</strong>
            <p>Please visit the campus parcel desk to collect them.</p>
          </div>
          <Link to="/user/parcels">View parcels <ArrowRight size={15} /></Link>
        </div>
      )}

      {role === "ADMIN" && (
        <div className="notice-banner">
          <AlertCircle size={22} />
          <div>
            <strong>System overview</strong>
            <p>
              {processing} parcel(s) are processing and {ready} are awaiting pickup.
            </p>
          </div>
          <Link to="/admin/reports">View reports <ArrowRight size={15} /></Link>
        </div>
      )}

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Recent Parcels</h2>
            <p>Latest parcel records in your workspace.</p>
          </div>
          <Link to={parcelLink} className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Recipient</th>
                <th>Courier</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentParcels.map((parcel) => (
                <tr key={parcel.id}>
                  <td>
                    <Link
                      to={
                        role === "USER"
                          ? `/user/tracking/${parcel.id}`
                          : `/manager/tracking/${parcel.id}`
                      }
                      className="table-link"
                    >
                      {parcel.trackingNumber}
                    </Link>
                  </td>
                  <td>{parcel.recipientName}</td>
                  <td>{parcel.courierName}</td>
                  <td>{formatDate(parcel.receivedAt)}</td>
                  <td><StatusBadge status={parcel.status} /></td>
                </tr>
              ))}

              {recentParcels.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No parcels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}