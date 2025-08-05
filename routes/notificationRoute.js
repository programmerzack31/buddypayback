const express = require("express");
const { getNotifications, createNotification } = require("../controllers/notificationController.js");
const authMiddleware = require("../middelware/auth.js"); // agar JWT check karna hai

const router = express.Router();

// ✅ Routes
router.get("/:userId", authMiddleware, getNotifications);
router.post("/create", authMiddleware, createNotification);

module.exports = router;
