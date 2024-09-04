import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defectsData: [],
  selectedDefect: null,
  selectedDefectReports: null,
  loading: true,
};

const defectSlice = createSlice({
  name: "defects",
  initialState,
  reducers: {
    getDefectSuccess: (state, action) => {
      state.defectsData = action.payload;
      state.selectedDefect = null;
      state.loading = false;
    },
    setSelectedDefect: (state, action) => {
      state.selectedDefect = action.payload;
    },
    setSelectedDefectReports: (state, action) => {
      console.log(action.payload);
      state.selectedDefectReports = action.payload;
    },

    getDefectFailure: (state) => {
      state.defectsData = [];
      state.selectedDefect = null;
      state.loading = false;
    },
    defectSignout: (state) => {
      state.defectsData = [];
      state.selectedDefect = null;
      state.selectedDefectReports = null;
      state.loading = false;
    },
  },
});

export const {
  setSelectedDefectReports,
  getDefectSuccess,
  getDefectFailure,
  setSelectedDefect,
  defectSignout,
} = defectSlice.actions;

export default defectSlice.reducer;
