const Drone = require("../models/Drone");
const Mission = require("../models/Mission");
const User = require("../models/User");

exports.getAdminDashboard = async (req, res) => {
  try {
    // Drones
    const drones = await Drone.find();
    const droneStatusCounts = drones.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});
    // Missions
    const missions = await Mission.find()
      .populate("assignedDrone", "name")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    const missionStatusCounts = missions.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
    const recentMissions = missions.slice(0, 5);
    const activeMissions = missions.filter((m) => m.status === "inProgress");
    const upcomingMissions = missions
      .filter((m) => m.status === "scheduled")
      .slice(0, 5);
    const completed = missionStatusCounts.completed || 0;
    const failed = missionStatusCounts.failed || 0;
    const successRate =
      completed + failed > 0 ? (completed / (completed + failed)) * 100 : 0;

    // Alerts (example: low battery, maintenance, etc.)
    const alerts = drones
      .filter((d) => d.battery < 20)
      .map((d) => ({
        type: "battery",
        message: `${d.name} battery low (${d.battery}%)`,
        droneId: d._id,
        timestamp: new Date(),
      }));

    // Operators
    const users = await User.find();
    const operators = users.map((u) => ({
      _id: u._id,
      username: u.username,
      missions: missions.filter((m) => m.createdBy._id.equals(u._id)).length,
      successRate: (() => {
        const userMissions = missions.filter((m) =>
          m.createdBy._id.equals(u._id)
        );
        const completed = userMissions.filter(
          (m) => m.status === "completed"
        ).length;
        const failed = userMissions.filter((m) => m.status === "failed").length;
        return completed + failed > 0
          ? (completed / (completed + failed)) * 100
          : 0;
      })(),
    }));

    res.json({
      drones: {
        total: drones.length,
        statusCounts: droneStatusCounts,
        list: drones,
      },
      missions: {
        total: missions.length,
        statusCounts: missionStatusCounts,
        recent: recentMissions,
        active: activeMissions,
        upcoming: upcomingMissions,
        successRate: Number(successRate.toFixed(1)),
      },
      alerts,
      operators,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch dashboard data", error: err.message });
  }
};
