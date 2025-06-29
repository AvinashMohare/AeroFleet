const Drone = require("../models/Drone");

exports.createDrone = async (req, res) => {
  try {
    const droneData = { ...req.body };
    if (req.file) {
      droneData.image = req.file.path;
    }

    const drone = new Drone(droneData);
    await drone.save();
    res.status(201).json({ message: "Drone created", drone });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create drone", error: err.message });
  }
};

exports.getDrones = async (req, res) => {
  try {
    const drones = await Drone.find();
    res.json({ drones });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch drones", error: err.message });
  }
};

exports.assignOperator = async (req, res) => {
  try {
    const { operatorId } = req.body;
    const drone = await Drone.findByIdAndUpdate(
      req.params.droneId,
      { assignedOperator: operatorId },
      { new: true }
    ).populate("assignedOperator", "username email");
    if (!drone) {
      return res.status(404).json({ message: "Drone not found" });
    }
    res.json({ message: "Operator assigned successfully", drone });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to assign operator", error: err.message });
  }
};

exports.getDroneById = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.droneId).populate(
      "assignedOperator",
      "username email"
    );
    if (!drone) {
      return res.status(404).json({ message: "Drone not found" });
    }
    res.json({ drone });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch drone", error: err.message });
  }
};

exports.getAssignedDrone = async (req, res) => {
  try {
    // req.user._id should be set by your auth middleware
    const drone = await Drone.findOne({ assignedOperator: req.user.userId });
    res.json({ drone });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch assigned drone", error: err.message });
  }
};
