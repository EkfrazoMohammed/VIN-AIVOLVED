import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rolesData: [],
  selectedRole: null,
  activeRoles: [],
  loading: true,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    getRoleSuccess: (state, action) => {
      state.rolesData = action.payload;
      state.selectedRole = null;
      state.activeRoles = [];
      state.loading = false;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    setActiveRoles: (state, action) => {
      state.activeRoles = action.payload;
    },
    getRoleFailure: (state) => {
      state.rolesData = [];
      state.activeRoles = [];
      state.selectedRole = null;
      state.loading = false;
    },
    roleSignout: (state) => {
      state.rolesData = [];
      state.activeRoles = [];
      state.selectedRole = null;
      state.loading = false;
    },
  },
});

export const { getRoleSuccess, getRoleFailure, setSelectedRole, setActiveRoles, roleSignout } = roleSlice.actions;

export default roleSlice.reducer;
