const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// GET /api/users/me
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

//get all users
const getAllUsers = async (req,res)=>{
  try{
    const users = await User.find();
    res.json(users)
  }catch(err){
    console.log('error fetching users',err)
    return res.status(500).json({message:"server error to fetch users",err})
  }
}

// PUT /api/users/updatepic
const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally delete old image
    if (user.profilePic && fs.existsSync(user.profilePic)) {
      fs.unlinkSync(user.profilePic);
    }

    user.profilePic = req.file.path;
    await user.save();

    res.json({ message: "Profile picture updated!", profilePic: user.profilePic });
  } catch (err) {
    console.error("Profile picture update error:", err);
    res.status(500).json({ message: "Failed to update profile picture", error: err.message });
  }
};

// PUT /api/users/update
const updateUserProfile = async (req, res) => {
  try {
    const { username, mobilenum, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (mobilenum) user.mobilenum = mobilenum;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated!", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

module.exports = {
  getCurrentUser,
  updateProfilePic,
  updateUserProfile,
  getAllUsers
};
