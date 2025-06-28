const express = require("express");
const router = express.Router();
const droneController = require("../controllers/droneController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  droneController.createDrone
);
router.get("/", verifyToken, droneController.getDrones);

module.exports = router;
