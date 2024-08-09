// src/features/organization/organizationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../API/axiosInstance';

// Async thunk to fetch organizations
export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async () => {
    const response = await axiosInstance.get('/plant/');
    return response.data.results;
  }
);

const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organizations: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedOrganization(state, action) {
      state.selectedOrganization = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedOrganization } = organizationSlice.actions;

export default organizationSlice.reducer;
