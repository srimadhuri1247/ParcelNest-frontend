import { useState } from "react";
import { Bell, CheckCheck, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getNotifications,
  markNotificationRead,
} from "../services/parcelService";

export default function Notifications() {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);

  const notifications = getNotifications(user.email);
  const unread = notifications.filter((item) => !item.read).length;

  function markRead(id) {
    markNotificationRead(id);
    setVersion((value) => value + 1);
  }

  return (
    <div className="page" key={version}>
      <div className="page-heading">
        <div>
          <span className="eyebrow">UPDATES</span>
          <h1>Notifications</h1>
          <p>Stay informed about your parcel deliveries.</p>
        </div>
        <div className="notification-count">
          <Bell size={17} /> {unread} unread
        </div>
      </div>

      <div className="notification-list">
        {notifications.map((item) => (
          <article
            key={item.id}
            className={`notification-card ${item.read ? "read" : ""}`}
          >
            <div className="notification-icon"><Package size={21} /></div>
            <div className="notification-content">
              <strong>{item.message}</strong>
              <p>{new Date(item.createdAt).toLocaleString()}</p>
              {item.parcelId && (
                <span className="table-subtext">Parcel: {item.parcelId}</span>
              )}
            </div>
            {!item.read && (
              <button
                className="small-button"
                onClick={() => markRead(item.id)}
              >
                <CheckCheck size={15} /> Mark read
              </button>
            )}
          </article>
        ))}

        {notifications.length === 0 && (
          <div className="content-card empty-state">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}