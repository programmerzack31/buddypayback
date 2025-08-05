// socket.js
const { Server } = require("socket.io");

let io;
const onlineUsers = new Map(); // userId -> array of socketIds

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // React app ka URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    // User register event
    socket.on("register", (userId) => {
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }
      onlineUsers.get(userId).push(socket.id);

      // console.log(` User ${userId} registered. Current sockets:`, onlineUsers.get(userId));
    });

    // Disconnect hone par user ko remove karo
    socket.on("disconnect", () => {
      // console.log(" User disconnected:", socket.id);

      for (let [userId, sockets] of onlineUsers.entries()) {
        const newSockets = sockets.filter((id) => id !== socket.id);
        if (newSockets.length > 0) {
          onlineUsers.set(userId, newSockets);
        } else {
          onlineUsers.delete(userId);
        }
      }

      // console.log("Online Users Map:", onlineUsers);
    });
  });
}

function sendNotification(userId, notification) {
  const socketIds = onlineUsers.get(userId.toString());
  // console.log("Sending notification to user:", userId, "sockets:", socketIds);

  if (socketIds && io) {
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("notification", notification);
    });
  } else {
    // console.log("User not online, notification not delivered:", notification);
  }
}

module.exports = { initSocket, sendNotification };
