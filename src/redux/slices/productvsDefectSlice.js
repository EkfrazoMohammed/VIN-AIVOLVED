import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productvsdefectData: [],
  loading: true,
};

const productvsdefectSlice = createSlice({
  name: "productvsdefect",
  initialState,
  reducers: {
    getProductVsDefectSuccess: (state, action) => {
      state.productvsdefectData = action.payload;
      state.loading = false;
    },
    getProductVsDefectFailure: (state) => {
      state.productvsdefectData = [];
      state.loading = false;
    },
    productVsDefectSignout: (state) => {
      state.productvsdefectData = [];
      state.loading = false;
    },
  },
});

export const { getProductVsDefectSuccess, getProductVsDefectFailure,productVsDefectSignout } = productvsdefectSlice.actions;

export default productvsdefectSlice.reducer;
