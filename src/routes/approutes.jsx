import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../services/authService";

import Layout from "../components/Layout";
import Login from "../pages/Loginpage";
import Dashboard from "../pages/Dashboard";
import MyParcels from "../pages/Myparcels";
import ParcelTracking from "../pages/ParcelTracking";
import RegisterParcel from "../pages/RegisterParcel";
import ManageParcels from "../pages/ManageParcel";
import CollectionConfirmation from "../pages/CollectionConfirmation";
import Notifications from "../pages/Notifications";
import UserManagement from "../pages/usermanagement";
import Reports from "../pages/reports";

function RequireAuth({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}

function RoleDashboard({ role }) {
  return <Dashboard role={role} />;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={user ? getDashboardPath(user.role) : "/login"}
            replace
          />
        }
      />

      <Route
        path="/login"
        element={
          user
            ? <Navigate to={getDashboardPath(user.role)} replace />
            : <Login />
        }
      />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={["USER"]} />}>
            <Route path="/user/dashboard" element={<RoleDashboard role="USER" />} />
            <Route path="/user/parcels" element={<MyParcels />} />
            <Route path="/user/tracking/:id" element={<ParcelTracking />} />
            <Route path="/user/notifications" element={<Notifications />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["MANAGER", "ADMIN"]} />}>
            <Route path="/manager/dashboard" element={<RoleDashboard role="MANAGER" />} />
            <Route path="/manager/register" element={<RegisterParcel />} />
            <Route path="/manager/parcels" element={<ManageParcels />} />
            <Route path="/manager/tracking/:id" element={<ParcelTracking />} />
            <Route path="/manager/collections" element={<CollectionConfirmation />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<RoleDashboard role="ADMIN" />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/parcels" element={<ManageParcels />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={user ? getDashboardPath(user.role) : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}