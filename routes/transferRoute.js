const router = require('express').Router();
const {
  transfer,
  getAllTransactions,
  getUserTransactions,
  getUserFullTransactionHistory,
  lookupUPI
} = require('../controllers/transfer');
const auth = require('../middelware/auth');

// Transfer money
router.post('/transfer', auth, transfer);

// Get all transactions made by the logged-in user (sent only)
router.get('/yourtx', auth, getUserTransactions);

// Get full transaction history of the logged-in user (sent + received)
router.get('/history', auth, getUserFullTransactionHistory);

// Admin: Get all transactions in the system
router.get('/transactions', getAllTransactions);

// Lookup receiver by UPI ID
router.get('/lookup-upi', auth, lookupUPI);

module.exports = router;
