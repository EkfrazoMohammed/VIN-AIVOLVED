// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: JSON.parse(localStorage.getItem('token')) || null,
    refreshToken: JSON.parse(localStorage.getItem('refreshToken')) || null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', JSON.stringify(action.payload));
    },
    clearAuth(state) {
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setToken, setRefreshToken, clearAuth } = authSlice.actions;

export default authSlice.reducer;
