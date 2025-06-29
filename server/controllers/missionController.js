const Mission = require("../models/Mission");
const Drone = require("../models/Drone");
const EventEmitter = require("events");
const missionEvents = new EventEmitter();
module.exports.missionEvents = missionEvents;

exports.createMission = async (req, res) => {
  try {
    const mission = new Mission({
      ...req.body,
      createdBy: req.user?.userId,
    });
    await mission.save();

    // Calculate delay for scheduled missions
    const now = Date.now();
    const scheduled = new Date(mission.scheduledTime).getTime();
    const delay = Math.max(0, scheduled - now);

    // Schedule the mission using setTimeout
    setTimeout(async () => {
      try {
        await Mission.findByIdAndUpdate(mission._id, { status: "In Progress" });
        if (mission.assignedDrone) {
          await Drone.findByIdAndUpdate(mission.assignedDrone, {
            status: "in-mission",
          });
          missionEvents.emit("start-mock-feed", mission);
        }
        console.log(
          `Mission ${mission.name} started and drone set to in-mission status`
        );
      } catch (err) {
        console.error("Error in scheduled mission start:", err);
      }
    }, delay);

    res.status(201).json({ message: "Mission created", mission });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create mission", error: err.message });
  }
};

exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate("assignedDrone", "name")
      .populate("createdBy", "username");
    res.json({ missions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch missions", error: err.message });
  }
};

exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate("assignedDrone")
      .populate("createdBy", "username");
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.json({ mission });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch mission", error: err.message });
  }
};
