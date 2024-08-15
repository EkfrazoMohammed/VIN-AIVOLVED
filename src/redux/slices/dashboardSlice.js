// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    datesData: {},
    activeProducts: [],
    error: null,
  },
  reducers: {
    getDashboardSuccess: (state, action) => {
      state.datesData = action.payload.datesData || {};
      state.activeProducts = action.payload.activeProducts || [];
      state.error = null; // Clear any previous errors
    },
    getDashboardFailure: (state, action) => {
      state.datesData = {};
      state.activeProducts = [];
      state.error = action.payload; // Set the error message
    },
    dashboardSignout: (state, action) => {
      state.datesData = {};
      state.activeProducts = [];
      state.error = action.payload; // Set the error message
    },
  },
});

export const { getDashboardSuccess, getDashboardFailure,dashboardSignout } = dashboardSlice.actions;

export default dashboardSlice.reducer;
