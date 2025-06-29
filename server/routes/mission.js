const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, missionController.createMission);
router.get("/", verifyToken, missionController.getMissions);
router.get("/:id", missionController.getMissionById);

module.exports = router;
