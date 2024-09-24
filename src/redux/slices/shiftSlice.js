import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shiftData: [
    { id: 1, name: "shift1" },
    { id: 2, name: "shift2" },
    { id: 3, name: "shift3" },
  ],
  selectedShift: null,
  loading: true,
};

const ShiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    getShiftSuccess: (state, action) => {
      state.shiftData = action.payload;
      state.selectedShift = null;
      state.loading = false;
    },
    setSelectedShift: (state, action) => {
      state.selectedShift = action.payload;
    },
    getShiftFailure: (state) => {
      state.shiftData = [];
      state.selectedShift = null;
      state.loading = false;
    },
    shiftSignout: (state) => {
      state.shiftData = [];
      state.loading = false;
      state.selectedShift = null;
    },
  },
});

export const {
  setSelectedShift,
  getShiftSuccess,
  getShiftFailure,
  shiftSignout,
} = ShiftSlice.actions;

export default ShiftSlice.reducer;
