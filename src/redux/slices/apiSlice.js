// src/redux/apiSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL should be set in an environment variable or configuration
const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://hul.aivolved.in/api/';

// Initial state
const initialState = {
  baseURL,
  token: null,
  status: 'idle',
  error: null,
};

// Create async thunk for API requests
export const fetchApiData = createAsyncThunk(
  'api/fetchApiData',
  async (endpoint, { getState, rejectWithValue }) => {
    const state = getState();
    const { token } = state.api;

    try {
      const response = await axios.get(`${baseURL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle success, e.g., save data to state
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setToken, clearToken } = apiSlice.actions;
export default apiSlice.reducer;
