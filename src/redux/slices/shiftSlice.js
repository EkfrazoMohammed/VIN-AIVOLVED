import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shiftData: [{ id: 1, name: "shift1" }, { id: 2, name: "shift2" }, { id: 3, name: "shift3" }],
    selectedShift: null,
    loading: true,
};

const ShiftSlice = createSlice({
    name: "shift",
    initialState,
    reducers: {
        // getProductSuccess: (state, action) => {
        //     state.productsData = action.payload;
        //     state.selectedProduct = null;
        //     state.loading = false;
        // },
        setSelectedShift: (state, action) => {
            state.selectedShift = action.payload;
        },

        // getProductFailure: (state) => {
        //     state.productsData = [];
        //     state.loading = false;
        //     state.selectedProduct = null;
        // },

        ShiftSignout: (state) => {
            state.shiftData = [];
            state.loading = false;
            state.selectedShift = null;
        },
    },
});

export const { setSelectedShift, ShiftSignout } = ShiftSlice.actions;

export default ShiftSlice.reducer;
