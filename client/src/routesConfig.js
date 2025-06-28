import Signup from "./pages/common/Signup";
import Login from "./pages/common/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorDashboard from "./pages/operator/OperatorDashboard";

export const publicRoutes = [
  { path: "/", element: <Signup /> },
  { path: "/login", element: <Login /> },
];

export const adminRoutes = [
  { path: "/admin-dashboard", element: <AdminDashboard /> },
];

export const operatorRoutes = [
  { path: "/operator-dashboard", element: <OperatorDashboard /> },
];
