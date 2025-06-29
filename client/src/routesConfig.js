import Signup from "./pages/common/Signup";
import Login from "./pages/common/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import Drones from "./pages/admin/Drones";
import AddDrone from "./pages/admin/AddDrone";
import CreateMission from "./pages/admin/CreateMission";
import Missions from "./pages/admin/Missions";
import MissionLiveFeedPage from "./pages/admin/MissionLiveFeedPage";
import DroneDetails from "./pages/admin/DroneDetails";

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
  { path: "/admin/missions/:id/live", element: <MissionLiveFeedPage /> },
  { path: "/admin/drones/:droneId", element: <DroneDetails /> },
];

export const operatorRoutes = [
  { path: "/operator-dashboard", element: <OperatorDashboard /> },
  { path: "/operator/missions/:id/live", element: <MissionLiveFeedPage /> },
];
