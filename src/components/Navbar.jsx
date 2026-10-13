import { Bell, LogOut, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../services/authService";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <Link
        to={getDashboardPath(user.role)}
        className="brand"
      >
        <span className="brand-icon">
          <Package size={23} />
        </span>
        <span>Parcelnest</span>
      </Link>

      <div className="topbar-right">
        <Link
          to={
            user.role === "USER"
              ? "/user/notifications"
              : getDashboardPath(user.role)
          }
          className="icon-button"
          title="Notifications"
        >
          <Bell size={19} />
        </Link>

        <div className="profile-info">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-text">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>

        <button
          className="icon-button"
          title="Logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}