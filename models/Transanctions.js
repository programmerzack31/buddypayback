const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  message: String,
}, { timestamps: true }); // Adds createdAt and updatedAt

const Transaction = mongoose.model('Transaction', transactionsSchema);
module.exports = Transaction;
