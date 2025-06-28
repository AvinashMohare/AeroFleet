const Mission = require("../models/Mission");

exports.createMission = async (req, res) => {
  try {
    const mission = new Mission({
      ...req.body,
      createdBy: req.user?.userId, // If using auth middleware
    });
    await mission.save();
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
