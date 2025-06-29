const Mission = require("./models/Mission");
const Drone = require("./models/Drone");

function startMockMissionFeed(io, mission) {
  let battery = 100;
  const waypoints =
    mission.waypoints && mission.waypoints.length > 0
      ? mission.waypoints
      : [{ lat: 28.6139, lng: 77.209 }];
  let currentIdx = 0;

  const interval = setInterval(async () => {
    try {
      if (currentIdx < waypoints.length - 1) currentIdx++;
      const { lat, lng } = waypoints[currentIdx];
      battery = Math.max(0, battery - 100 / waypoints.length);

      if (io) {
        io.emit("mission-live", {
          missionId: mission._id,
          droneId: mission.assignedDrone,
          location: { lat, lng },
          battery,
          status: battery > 0 ? "in-mission" : "completed",
          waypointIndex: currentIdx,
          totalWaypoints: waypoints.length,
          altitude: mission.altitude,
          parameters: mission.parameters,
        });
      }

      if (battery <= 0 || currentIdx === waypoints.length - 1) {
        clearInterval(interval);
        await Mission.findByIdAndUpdate(mission._id, { status: "completed" });
        await Drone.findByIdAndUpdate(mission.assignedDrone, {
          status: "idle",
          battery: 100,
        });
      }
    } catch (err) {
      console.error("Error in mock mission feed:", err);
      clearInterval(interval);
    }
  }, 2000);
}

module.exports = { startMockMissionFeed };
