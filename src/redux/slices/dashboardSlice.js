import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: [],
  activeDashboardData:[],
  loading: true,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    getDashboardSuccess: (state, action) => {
      state.dashboardData = action.payload;
      state.activeDashboardData = [];
      state.loading = false;
    },
    setActiveDashboardData: (state, action) => {
      state.activeDashboardData =action.payload;
    },
    getDashboardFailure: (state) => {
      state.dashboardData = [];
      state.activeDashboardData = [];
      state.loading = false;
    },
  },
});

export const { getDashboardSuccess, setActiveDashboardData,getDashboardFailure } = dashboardSlice.actions;

export default dashboardSlice.reducer;
