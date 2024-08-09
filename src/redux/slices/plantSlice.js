import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plantData: [],
};

const plantSlice = createSlice({
  name: 'plant',
  initialState,
  reducers: {
    setPlantData: (state, action) => {
      state.plantData = action.payload;
    },
  },
});

export const { setPlantData } = plantSlice.actions;
export default plantSlice.reducer;
