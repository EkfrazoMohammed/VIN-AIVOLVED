import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locationData: [
    {
      id: null,
      is_active: false,
      location_name: "",
    },
  ],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationData: (state, action) => {
      state.locationData = action.payload;
    },
    clearLocationData: (state, action) => {
      state.locationData[0].id= null;
      state.locationData[0].is_active= false;
      state.locationData[0].location_name='';
    },
    locationSignOut: (state, action) => {
      state.locationData[0].id= null;
      state.locationData[0].is_active= false;
      state.locationData[0].location_name='';
    },
  },
});

export const { setLocationData,clearLocationData,locationSignOut } = locationSlice.actions;
export default locationSlice.reducer;
