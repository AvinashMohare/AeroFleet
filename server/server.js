const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const droneRoutes = require("./routes/drone");

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

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
