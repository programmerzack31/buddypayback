const Notifications = require('../models/Notifications.js');
const { sendNotification } = require("../socket.js");


const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Token middleware se aayega
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await Notifications.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);

  } catch (error) {
    console.error(" Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const createNotification = async (req, res) => {
  try {
    
    const { toUser, text } = req.body;
    if (!toUser || !text) return res.status(400).json({ message: "Missing fields" });

    const newNotification = await Notifications.create({ userId:toUser, text });

    
    sendNotification(toUser, {
      _id: newNotification._id,
      text: newNotification.text,
      createdAt: newNotification.createdAt,
    });

    res.status(201).json(newNotification);
  
  } catch (error) {
    console.error(" Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNotifications, createNotification };
