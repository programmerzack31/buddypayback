const { default: mongoose } = require('mongoose');
const Transactions = require('../models/Transanctions');
const User = require("../models/User");
const {sendNotification} = require('../socket')

const bcrypt = require("bcrypt"); // Ensure this is installed

const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  const fromUser = req.user.userId;
  const { toUser, amount, message, password } = req.body;

  if (!toUser || !amount || !password) {
    return res.status(400).json({ message: "Missing Receiver, Amount, or Password!" });
  }
  if (fromUser === toUser) {
    return res.status(400).json({ message: "You can't send money to yourself!" });
  }
  if (amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0!" });
  }

  try {
    session.startTransaction();

    const sender = await User.findById(fromUser).select("+password").session(session);
    const receiver = await User.findById(toUser).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender or receiver not found!" });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, sender.password);
    if (!isPasswordValid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "Invalid Password!" });
    }

    // Check Balance
    if (sender.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient Balance!" });
    }

    // Transfer Money
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    const transaction = await Transactions.create(
      [
        {
          fromUser,
          toUser,
          amount,
          message,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Send Notification
    const notification = {
      text: `You received ₹${amount} from ${sender.name}`,
      timestamp: new Date(),
    };
    sendNotification(toUser.toString(), notification);

    return res.status(200).json({
      message: "Transaction Successful!",
      transaction: transaction[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transfer Error:", err);
    return res.status(500).json({ message: "Transfer Failed", error: err.message });
  }
};



const getUserTransactions = async (req, res) => {
  try {
    const userTransactions = await Transactions.find({ fromUser: req.user.userId })
      .populate('toUser', 'username email profilePic upiKey');
    if (!userTransactions.length) {
      return res.status(404).json({ message: "No Transactions Yet!" });
    }
    return res.json(userTransactions);
  } catch (err) {
    console.error("Something went wrong!", err);
    return res.status(500).json({ message: "Server Error!", error: err.message });
  }
};

// All sent/received transactions by current user
const getUserFullTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transactions.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate("fromUser", "username profilePic upiKey")
      .populate("toUser", "username profilePic upiKey")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Failed to fetch transaction history", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Admin: all transactions system-wide
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.find()
      .populate('fromUser', 'username email')
      .populate('toUser', 'username email');

    return res.json(transactions);
  } catch (err) {
    console.error('Failed to fetch Transactions', err);
    return res.status(500).json({ message: "Failed to fetch data!", error: err.message });
  }
};

// UPI Lookup endpoint
const lookupUPI = async (req, res) => {
  const { upiKey } = req.query;
  try {
    const user = await User.findOne({ upiKey }).select("username profilePic upiKey");
    if (!user) {
      return res.status(404).json({ message: "UPI not found" });
    }
    res.json({
      _id:user._id,
      username: user.username,
      profilePic: user.profilePic || null,
      upiKey: user.upiKey
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  transfer,
  getUserTransactions,
  getUserFullTransactionHistory,
  getAllTransactions,
  lookupUPI
};
