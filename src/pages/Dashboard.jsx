import { useEffect, useState, useCallback } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMPTY_STATS = {
  totalParcels: 0,
  inTransit: 0,
  delivered: 0,
  pending: 0,
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN");
}

export default function Dashboard({ role: roleProp }) {
  const { user } = useAuth();

  const role = String(roleProp || user?.role || "USER").toUpperCase();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("campus_token");

      if (!token) {
        throw new Error("Please log in again. Your session token is missing.");
      }

      const responseOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [dashboardResponse, parcelsResponse] = await Promise.all([
        fetch(`${API_BASE}/dashboard`, responseOptions),
        fetch(`${API_BASE}/parcels`, responseOptions),
      ]);

      const dashboardData = await dashboardResponse
        .json()
        .catch(() => ({}));

      const parcelsData = await parcelsResponse
        .json()
        .catch(() => ({}));

      if (!dashboardResponse.ok) {
        throw new Error(
          dashboardData.message ||
            `Dashboard request failed: ${dashboardResponse.status}`
        );
      }

      if (!parcelsResponse.ok) {
        throw new Error(
          parcelsData.message ||
            `Parcel request failed: ${parcelsResponse.status}`
        );
      }

      const result = dashboardData.stats || dashboardData;

      setStats({
        totalParcels: Number(result.totalParcels ?? 0),
        inTransit: Number(result.inTransit ?? 0),
        delivered: Number(result.delivered ?? 0),
        pending: Number(result.pending ?? 0),
      });

      const records = Array.isArray(parcelsData)
        ? parcelsData
        : Array.isArray(parcelsData.parcels)
        ? parcelsData.parcels
        : Array.isArray(parcelsData.data)
        ? parcelsData.data
        : [];

      setParcels(records);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(err.message || "Unable to retrieve dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const roleDetails = {
    USER: {
      title: "My Dashboard",
      description: "Here is an overview of your campus deliveries.",
      welcome: "Track your parcels and stay updated on delivery progress.",
      parcelPath: "/user/parcels",
      trackingPath: "/user/tracking",
    },
    MANAGER: {
      title: "Manager Dashboard",
      description: "Monitor parcel registration and campus collections.",
      welcome: "Manage parcel operations and keep deliveries moving.",
      parcelPath: "/manager/parcels",
      trackingPath: "/manager/tracking",
    },
    ADMIN: {
      title: "Admin Dashboard",
      description: "Monitor parcel activity and delivery operations.",
      welcome: "Review parcel activity and monitor overall operations.",
      parcelPath: "/admin/parcels",
      trackingPath: "/admin/tracking",
    },
  };

  const page = roleDetails[role] || roleDetails.USER;

  const cards = [
    {
      label: "Total Parcels",
      value: stats.totalParcels,
      icon: Package,
      color: "blue",
    },
    {
      label: "In Transit",
      value: stats.inTransit,
      icon: Clock,
      color: "orange",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      color: "purple",
    },
  ];

  const recentParcels = [...parcels]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>

        {role === "MANAGER" && (
          <Link to="/manager/register" className="primary-button">
            <Package size={18} />
            Register Parcel
          </Link>
        )}
      </div>

      <div className="welcome-banner">
        <div>
          <span>WELCOME BACK</span>
          <h2>
            Hello, {user?.name?.trim().split(/\s+/)[0] || "there"}!
          </h2>
          <p>{page.welcome}</p>
        </div>

        <Package size={66} />
      </div>

      {error && (
        <div className="notice-banner" role="alert">
          <AlertCircle size={22} />
          <div>
            <strong>Unable to load dashboard</strong>
            <p>{error}</p>
            <button
              type="button"
              className="text-link"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon size={23} />
            </div>
            <div>
              <span>{label}</span>
              <strong>
                {loading ? "..." : value.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {role === "USER" && !loading && stats.pending > 0 && (
        <div className="notice-banner">
          <AlertCircle size={22} />
          <div>
            <strong>You have {stats.pending} pending parcel(s).</strong>
            <p>Check your parcel list for the latest updates.</p>
          </div>
          <Link to={page.parcelPath}>
            View parcels <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {role === "ADMIN" && (
        <div className="notice-banner">
          <AlertCircle size={22} />
          <div>
            <strong>System overview</strong>
            <p>
              {loading
                ? "Loading statistics..."
                : `${stats.inTransit} parcel(s) in transit and ${stats.pending} pending.`}
            </p>
          </div>
          <Link to="/admin/reports">
            View reports <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Recent Parcels</h2>
            <p>Latest parcel records available to your account.</p>
          </div>

          <div>
            <button
              type="button"
              className="text-link"
              onClick={() => loadDashboard(true)}
              disabled={loading || refreshing}
            >
              <RefreshCw size={15} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <Link to={page.parcelPath} className="text-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Registered</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading parcels...
                  </td>
                </tr>
              ) : recentParcels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {error
                      ? "Could not load parcel records."
                      : "No parcels found. Register a parcel to see it here."}
                  </td>
                </tr>
              ) : (
                recentParcels.map((parcel) => (
                  <tr key={parcel.id}>
                    <td>
                      <Link
                        to={`${page.trackingPath}/${parcel.id}`}
                        className="table-link"
                      >
                        {parcel.tracking_number || "—"}
                      </Link>
                    </td>
                    <td>{parcel.sender_name || "—"}</td>
                    <td>{parcel.receiver_name || "—"}</td>
                    <td>{formatDate(parcel.created_at)}</td>
                    <td>
                      <StatusBadge status={parcel.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}