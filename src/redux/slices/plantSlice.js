import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
      state.plantData = action.payload;
    },
    clearPlantData: (state, action) => {
      state.plantData[0].id= null;
      state.plantData[0].is_active= false;
      state.plantData[0].plant_name='';
    },
    plantSignOut: (state, action) => {
      state.plantData[0].id= null;
      state.plantData[0].is_active= false;
      state.plantData[0].plant_name='';
    },
  },
});

export const { setPlantData,clearPlantData,plantSignOut } = plantSlice.actions;
export default plantSlice.reducer;
