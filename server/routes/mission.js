const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, missionController.createMission);
router.get("/:id", verifyToken, missionController.getMissionById);
router.get("/", verifyToken, missionController.getMissions);
router.get("/get-missions", verifyToken, missionController.getMissions);

module.exports = router;
