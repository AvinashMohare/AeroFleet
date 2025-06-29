import Signup from "./pages/common/Signup";
import Login from "./pages/common/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import Drones from "./pages/admin/Drones";
import AddDrone from "./pages/admin/AddDrone";
import CreateMission from "./pages/admin/CreateMission";
import Missions from "./pages/admin/Missions";

export const publicRoutes = [
  { path: "/", element: <Signup /> },
  { path: "/login", element: <Login /> },
];

export const adminRoutes = [
  { path: "/admin-dashboard", element: <AdminDashboard /> },
  { path: "/admin/drones", element: <Drones /> },
  { path: "/admin/add-drone", element: <AddDrone /> },
  { path: "/admin/create-mission", element: <CreateMission /> },
  { path: "/admin/missions", element: <Missions /> },
];

export const operatorRoutes = [
  { path: "/operator-dashboard", element: <OperatorDashboard /> },
];
