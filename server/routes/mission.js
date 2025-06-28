const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, missionController.createMission);
router.get("/", verifyToken, missionController.getMissions);

module.exports = router;
