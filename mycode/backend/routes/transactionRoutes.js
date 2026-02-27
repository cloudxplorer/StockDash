const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  approveTransaction,
  rejectTransaction
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, createTransaction);
router.get('/my', authMiddleware, getUserTransactions);
router.get('/all', authMiddleware, adminMiddleware, getAllTransactions);
router.put('/:id/approve', authMiddleware, adminMiddleware, approveTransaction);
router.put('/:id/reject', authMiddleware, adminMiddleware, rejectTransaction);

module.exports = router;
