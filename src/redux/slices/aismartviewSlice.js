// In aisSmartViewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const aismartviewSlice = createSlice({
    name: "aismartview",
    initialState: {
        aismartviewData: [],
        selectedDefect: null,
        errorMessage: "",
        loader: false,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            pageSize: 10,
        },
        currentSlideIndex: 0, // Add this line
    },
    reducers: {
        setAismartviewData: (state, action) => {
            state.aismartviewData = action.payload.aismartviewData;
            state.pagination.pageSize = action.payload.pageSize;
            state.pagination.totalPages = action.payload.totalPages;
        },
        setSelectedDefectAismartview: (state, action) => {
            state.selectedDefect = action.payload;
        },
        setErrorMessage: (state, action) =>  {
            state.errorMessage = action.payload;
        },
        setLoading: (state, action) =>  {
            state.loader = action.payload;
        },
        setLoader: (state, action) =>  {
            state.loader = action.payload;
        },
        updatePagination: (state, action) =>  {
            state.pagination.currentPage = action.payload.currentPage;
            state.pagination.pageSize = action.payload.pageSize;
        },
        setCurrentSlideIndex: (state, action) =>  { // Add this reducer
            state.currentSlideIndex = action.payload;
        },
    },
});

export const {
    setAismartviewData,
    setSelectedDefectAismartview,
    setErrorMessage,
    setLoading,
    setLoader,
    updatePagination,
    setCurrentSlideIndex, // Export the action
} = aismartviewSlice.actions;

export default aismartviewSlice.reducer;
