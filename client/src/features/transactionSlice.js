import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper to get the Bearer token
const getToken = () => `Bearer ${localStorage.getItem('token')}`;

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Async thunks
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
        headers: { Authorization: getToken() },
      });
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error adding transaction');
    }
  }
);

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: getToken() },
      });
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error retrieving transactions');
    }
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/editTransaction',
  async ({ transactionId, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/transactions/${transactionId}`, transactionData, {
        headers: { Authorization: getToken() },
      });
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error editing transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`, {
        headers: { Authorization: getToken() },
      });
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting transaction');
    }
  }
);

// Initial state
const initialState = {
  transactions: [],
  totalIncome: 0,
  totalExpense: 0,
  loading: false,
  error: null,
};

// Create the transaction slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle add transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
        const { type, amount } = action.payload;
        if (type.toLowerCase() === 'expense') {
          state.totalExpense += Number(amount || 0);
        } else if (type.toLowerCase() === 'income') {
          state.totalIncome += Number(amount || 0);
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;

        // Recalculate totals
        state.totalIncome = action.payload
          .filter((transaction) => transaction.type.toLowerCase() === 'income')
          .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

        state.totalExpense = action.payload
          .filter((transaction) => transaction.type.toLowerCase() === 'expense')
          .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle edit transaction
      .addCase(editTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;

        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(
          (transaction) => transaction._id === updatedTransaction._id
        );

        if (index !== -1) {
          const oldTransaction = state.transactions[index];

          // Update totals
          if (oldTransaction.type.toLowerCase() === 'expense') {
            state.totalExpense -= Number(oldTransaction.amount || 0);
          } else if (oldTransaction.type.toLowerCase() === 'income') {
            state.totalIncome -= Number(oldTransaction.amount || 0);
          }

          if (updatedTransaction.type.toLowerCase() === 'expense') {
            state.totalExpense += Number(updatedTransaction.amount || 0);
          } else if (updatedTransaction.type.toLowerCase() === 'income') {
            state.totalIncome += Number(updatedTransaction.amount || 0);
          }

          state.transactions[index] = updatedTransaction;
        }
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;

        const deletedTransaction = state.transactions.find(
          (transaction) => transaction._id === action.payload
        );

        if (deletedTransaction) {
          if (deletedTransaction.type.toLowerCase() === 'expense') {
            state.totalExpense -= Number(deletedTransaction.amount || 0);
          } else if (deletedTransaction.type.toLowerCase() === 'income') {
            state.totalIncome -= Number(deletedTransaction.amount || 0);
          }

          state.transactions = state.transactions.filter(
            (transaction) => transaction._id !== action.payload
          );
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default transactionSlice.reducer;
