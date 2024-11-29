const express = require('express');
const { 
  addTransaction, 
  getTransactions, 
  deleteTransaction, 
  editTransaction 
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();


// Route to add a new transaction
router.post('/', authMiddleware, addTransaction);

// Route to get all transactions for the authenticated user
router.get('/', authMiddleware, getTransactions);

// Route to edit a transaction by ID
router.put('/:transactionId', authMiddleware, editTransaction);

// Route to delete a transaction by ID
router.delete('/:transactionId', authMiddleware, deleteTransaction);

module.exports = router;
