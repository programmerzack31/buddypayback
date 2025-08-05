const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }, // agar read/unread status chahiye
  createdAt: { type: Date, default: Date.now },
});

const Notifications = mongoose.model("Notifications", notificationSchema);
module.exports = Notifications;
