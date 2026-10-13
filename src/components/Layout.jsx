import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Search,
  ClipboardCheck,
  Bell,
  Users,
  ChartNoAxesCombined,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const menus = {
  USER: [
    { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/user/parcels", label: "My Parcels", icon: Package },
    { to: "/user/notifications", label: "Notifications", icon: Bell },
  ],
  MANAGER: [
    { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manager/register", label: "Register Parcel", icon: PackagePlus },
    { to: "/manager/parcels", label: "Manage Parcels", icon: Search },
    { to: "/manager/collections", label: "Collections", icon: ClipboardCheck },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "User Management", icon: Users },
    { to: "/admin/parcels", label: "All Parcels", icon: Package },
    { to: "/admin/reports", label: "Reports", icon: ChartNoAxesCombined },
  ],
};

export default function Layout() {
  const { user } = useAuth();
  const menu = menus[user.role] || [];

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-body">
        <aside className="sidebar">
          <p className="sidebar-heading">WORKSPACE</p>

          <nav className="sidebar-nav">
            {menu.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <Package size={20} />
            <div>
              <strong>Parcelnest</strong>
              <span>Delivery Management</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}