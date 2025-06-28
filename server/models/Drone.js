const mongoose = require("mongoose");

const droneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["available", "in-mission", "maintenance"],
    default: "available",
  },
  battery: { type: Number, default: 100 },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  image: { type: String, default: "" }, // URL or path to drone image
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Drone", droneSchema);
