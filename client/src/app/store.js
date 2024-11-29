import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import profileReducer from "../features/profileSlice";
import transactionReducer from "../features/transactionSlice";
import themeReducer from "../features/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    transactions: transactionReducer,
    theme: themeReducer,

  },
});

export default store;
