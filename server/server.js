const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const droneRoutes = require("./routes/drone");
const missionRoutes = require("./routes/mission");

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use auth routes
app.use("/api", authRoutes);
app.use("/api/drones", droneRoutes);
app.use("/api/missions", missionRoutes);

// --- Socket.IO setup ---
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

// Export io for use in controllers
module.exports = { io, app, server };

const { startMockMissionFeed } = require("./mockMissionFeed");
const { missionEvents } = require("./controllers/missionController");

missionEvents.on("start-mock-feed", (mission) => {
  startMockMissionFeed(io, mission);
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
