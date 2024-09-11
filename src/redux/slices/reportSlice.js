import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reportData: null,
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        position: ["topRight"],
        showSizeChanger: true,
    }
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        getReportData: (state, action) => {
            state.reportData = action.payload.reportData;
            state.pagination = {
                ...state.pagination,
                current: action.payload.current,
                pageSize: action.payload.pageSize,
                total: action.payload.total,
            };
        },
        updatePage: (state, action) => {
            //console.log(action.payload)
            state.pagination.current = action.payload.current;
            state.pagination.pageSize = action.payload.pageSize;
        },
        filterData: (state, action) => {
            state.reportData = action.payload.reportData;
        },
        resetFilter: (state, action) => {
            state.reportData = action.payload.reportData;
        },
        reportSignout: (state, action) => {
            state.reportData = null;
            state.pagination = {
                current: 1,
                pageSize: 10,
                total: 0,
                position: ["topRight"],
                showSizeChanger: true,
            }
        },

    },
});

export const { getReportData, updatePage, filterData, resetFilter, reportSignout } = reportSlice.actions;
export default reportSlice.reducer;
