const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_CODE = process.env.JWT_CODE;

exports.register = async (req, res) => {
  const { username, email, password, mobilenum, upiKey } = req.body;

  try {
    // Check if user already exists
    const isExist = await User.findOne({
      $or: [{ email }, { mobilenum }],
    });

    if (isExist) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 12);

    // Create new user
    const createdUser = await User.create({
      username,
      email,
      mobilenum,
      password: hashedPass,
      upiKey,
      balance: 1000, // Default balance if not provided
      profilePic: req.file ? req.file.filename : null, // If file upload exists
    });

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        mobilenum: createdUser.mobilenum,
        upiKey: createdUser.upiKey,
        balance: createdUser.balance,
        profilePic: createdUser.profilePic,
      },
    });

  } catch (err) {
    console.error("Server error during registration:", err);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    return res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPass = await bcrypt.compare(password, isExist.password);
    if (!checkPass) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ userId: isExist._id }, JWT_CODE, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        _id: isExist._id,
        username: isExist.username,
        email: isExist.email,
        mobilenum: isExist.mobilenum,
        upiKey: isExist.upiKey,
        balance: isExist.balance,
        profilePic: isExist.profilePic,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};
