const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Links the transaction to a specific user
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'], // Add a custom error message
    trim: true // Removes leading/trailing whitespace
  },
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'], 
    min: [0, 'Amount must be a positive number'] // Ensure amount is non-negative
  },
  type: { 
    type: String, 
    required: [true, 'Transaction type is required'], 
    enum: {
      values: ['Expense', 'Income'], 
      message: 'Type must be either Expense or Income'
    }, // Transaction type validation
    default: 'Expense'
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'], 
    trim: true // Removes leading/trailing whitespace
  },
  date: { 
    type: Date, 
    required: [true, 'Date is required'], 
    default: Date.now // Defaults to current date if not provided
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add a pre-save hook to update the `updatedAt` field automatically
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
