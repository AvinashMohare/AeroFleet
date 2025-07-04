const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get(
  "/admin-dashboard",
  verifyToken,
  isAdmin,
  dashboardController.getAdminDashboard
);

module.exports = router;
