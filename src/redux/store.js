// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice2';
// import apiReducer from './slices/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // api: apiReducer,
  },
});

export default store;
