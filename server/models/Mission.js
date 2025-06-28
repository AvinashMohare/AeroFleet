const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  waypoints: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  altitude: { type: Number, required: true },
  parameters: {
    frequency: Number,
    sensors: [String],
    overlap: Number,
  },
  status: {
    type: String,
    enum: ["planned", "in-progress", "completed", "aborted"],
    default: "planned",
  },
  scheduledTime: { type: Date, required: true },
  assignedDrone: { type: mongoose.Schema.Types.ObjectId, ref: "Drone" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mission", missionSchema);
