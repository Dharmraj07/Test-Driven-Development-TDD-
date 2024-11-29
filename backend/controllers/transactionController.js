
const Transaction = require("../models/Transaction");

// Add a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Create a new transaction linked to the authenticated user
    const transaction = new Transaction({
      user: req.user.id, // Using req.user.id from the middleware
      title,
      amount,
      type,
      category,
      date,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: savedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: error.message });
  }
};

// Get all transactions for the authenticated user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }); // Find transactions for the logged-in user
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error: error.message });
  }
};

// Edit a transaction
exports.editTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { title, amount, type, category, date } = req.body;

    // Find and update the transaction, ensuring it belongs to the authenticated user
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: req.user.id }, // Match by transaction ID and user ID
      { title, amount, type, category, date },
      { new: true, runValidators: true } // Return the updated document and validate changes
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Find and delete the transaction, ensuring it belongs to the authenticated user
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: req.user.id, // Ensure the user owns the transaction
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
};
