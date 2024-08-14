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
      state.datesData = action.payload.datesData;
      state.activeProducts = action.payload.activeProducts;
     
    },
    getDashboardFailure: (state, action) => {

      state.error = action.payload;
    },
   
  },
});

export const { getDashboardSuccess, getDashboardFailure } = dashboardSlice.actions;

export default dashboardSlice.reducer;
