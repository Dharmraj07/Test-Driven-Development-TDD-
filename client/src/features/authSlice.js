import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Helper function for API calls
const apiCall = async (url, data, rejectWithValue, method = 'POST') => {
  try {
    const response = await axios({ url, data, method });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
};

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/signup`, { email, password }, rejectWithValue)
);

export const signin = createAsyncThunk(
  'auth/signin',
  async ({ email, password }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/signin`, { email, password }, rejectWithValue)
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async ({ email }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/forget-password`, { email }, rejectWithValue)
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/verify-email`, { email, otp }, rejectWithValue)
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/request-otp`, { email }, rejectWithValue)
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }, { rejectWithValue }) => 
    apiCall(`${API_BASE_URL}/reset-password`, { email, otp, newPassword }, rejectWithValue)
);

// Initial state
const initialState = {
  user: null,
  isLoggedIn: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Utility functions for state updates
const setLoadingState = (state) => {
  state.status = 'loading';
  state.error = null;
};

const setErrorState = (state, action) => {
  state.status = 'failed';
  state.error = action.payload;
};

const setSucceededState = (state) => {
  state.status = 'succeeded';
  state.error = null;
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, setLoadingState)
      .addCase(signup.fulfilled, (state, action) => {
        setSucceededState(state);
        state.user = action.payload.user;
        state.isLoggedIn = false; // Requires email verification
      })
      .addCase(signup.rejected, setErrorState)

      // Signin
      .addCase(signin.pending, setLoadingState)
      .addCase(signin.fulfilled, (state, action) => {
        setSucceededState(state);
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signin.rejected, setErrorState)

      // Forget Password
      .addCase(forgetPassword.pending, setLoadingState)
      .addCase(forgetPassword.fulfilled, setSucceededState)
      .addCase(forgetPassword.rejected, setErrorState)

      // Verify Email
      .addCase(verifyEmail.pending, setLoadingState)
      .addCase(verifyEmail.fulfilled, (state) => {
        setSucceededState(state);
        if (state.user) state.user.isVerified = true;
      })
      .addCase(verifyEmail.rejected, setErrorState)

      // Resend OTP
      .addCase(resendOtp.pending, setLoadingState)
      .addCase(resendOtp.fulfilled, setSucceededState)
      .addCase(resendOtp.rejected, setErrorState)

      // Reset Password
      .addCase(resetPassword.pending, setLoadingState)
      .addCase(resetPassword.fulfilled, setSucceededState)
      .addCase(resetPassword.rejected, setErrorState);
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
