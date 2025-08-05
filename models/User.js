const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobilenum: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  upiKey: { type: String, unique: true, required: true },
  balance: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User',UserSchema);
module.exports = User;