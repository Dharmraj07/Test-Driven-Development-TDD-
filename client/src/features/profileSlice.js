import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust according to your API base URL

// Async Thunks

// Fetch User Profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.data; // Assuming API response has { data: user }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Edit User Profile
export const editProfile = createAsyncThunk(
  'profile/editProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Upload Profile Picture
export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/upload`, formData, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove Profile Picture
export const removeProfilePicture = createAsyncThunk(
  'profile/removeProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/profile/remove`, {
        headers: { Authorization: `${localStorage.getItem('token')}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to fetch profile.';
      })

      // Edit Profile
      .addCase(editProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to edit profile.';
      })

      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to upload profile picture.';
      })

      // Remove Profile Picture
      .addCase(removeProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(removeProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to remove profile picture.';
      });
  },
});

// Export Actions and Reducer
export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
