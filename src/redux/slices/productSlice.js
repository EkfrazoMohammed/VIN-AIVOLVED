import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsData: [],
  selectedProduct:null,
  loading: true,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProductSuccess: (state, action) => {
      state.productsData = action.payload;
      state.selectedProduct=null;
      state.loading = false;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    getProductFailure: (state) => {
      state.productsData = [];
      state.loading = false;
      state.selectedProduct=null;
    },
  },
});

export const { getProductSuccess, getProductFailure,setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
