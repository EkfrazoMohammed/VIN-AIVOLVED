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
  },
});

export const { setPlantData } = plantSlice.actions;
export default plantSlice.reducer;
