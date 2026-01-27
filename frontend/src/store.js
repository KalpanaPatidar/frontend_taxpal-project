import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import budgetReducer from './slices/budgetSlice';
import transactionsReducer from './slices/transactionsSlice'; // ✅ Add this import

// ✅ Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,        // Authentication slice
    budgets: budgetReducer,   // Budget slice
    transactions: transactionsReducer, // Transactions slice for dashboard, income, expense
  },
  devTools: process.env.NODE_ENV !== 'production', // optional, enables Redux DevTools
});

export default store;
