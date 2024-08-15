import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dpmuData: [],
  loading: true,
};

const dpmuSlice = createSlice({
  name: "dpmu",
  initialState,
  reducers: {
    getDpmuSuccess: (state, action) => {
      state.dpmuData = action.payload;
      state.loading = false;
    },
    getDpmuFailure: (state) => {
      state.dpmuData = [];
      state.loading = false;
    },
    dpmuSignout: (state) => {
      state.dpmuData = [];
      state.loading = false;
    },
  },
});

export const { getDpmuSuccess, getDpmuFailure,dpmuSignout } = dpmuSlice.actions;

export default dpmuSlice.reducer;
