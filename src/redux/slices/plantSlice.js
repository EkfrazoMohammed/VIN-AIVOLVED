import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticatedPlant: false,
  plantData: [
    {
      id: null,
      is_active: false,
      plant_name: "",
    },
  ],
};

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    setPlantData: (state, action) => {
      state.isAuthenticatedPlant = true;
      state.plantData[0].id= action.payload.id;
      state.plantData[0].is_active= action.payload.is_active;
      state.plantData[0].plant_name=action.payload.plant_name;
    },
    clearPlantData: (state, action) => {
      state.isAuthenticatedPlant = false;
      state.plantData[0].id= null;
      state.plantData[0].is_active= false;
      state.plantData[0].plant_name='';
    },
    plantSignOut: (state, action) => {
      state.isAuthenticatedPlant = false;
      state.plantData[0].id= null;
      state.plantData[0].is_active= false;
      state.plantData[0].plant_name='';
    },
  },
});

export const { setPlantData,clearPlantData,plantSignOut } = plantSlice.actions;
export default plantSlice.reducer;
