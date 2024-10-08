import { createSlice } from "@reduxjs/toolkit";
import { defectSignout } from "./defectSlice";


const initialState = {
    resultsData: [],
    triggeredData: {
        machinesData: [],
        defects: []
    }
}

const defectTriggerSlice = createSlice({
    name: "defectTrigger",
    initialState,
    reducers: {
        getTriggerData: (state, action) => {
            const { payload } = action
            state.resultsData = payload
            state.triggeredData.machinesData = payload
            state.triggeredData.defects = payload.reduce((acc, machine) => {
                acc[machine.id] = machine.defects;
                return acc;
            }, {})
        },
        defectTriggerSignOut: (state, action) => {
            state.resultsData = []
            state.triggeredData.machinesData = []
            state.triggeredData.defects = []
        }
    }
})

export const { getTriggerData, defectTriggerSignOut } = defectTriggerSlice.actions


export default defectTriggerSlice.reducer