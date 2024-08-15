import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departmentsData: [],
  loading: true,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    getDepartmentSuccess: (state, action) => {
      state.departmentsData = action.payload;
      state.loading = false;
    },
    getDepartmentFailure: (state) => {
      state.departmentsData = [];
      state.loading = false;
    },
    departmentSignout: (state) => {
      state.departmentsData = [];
      state.loading = false;
    },
  },
});

export const { getDepartmentSuccess, getDepartmentFailure,departmentSignout } = departmentSlice.actions;

export default departmentSlice.reducer;
