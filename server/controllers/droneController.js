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
