import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  machinesData: [],
  selectedMachine:null,
  activeMachines:[],
  loading: true,
};

const machineSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    getMachineSuccess: (state, action) => {
      state.machinesData = action.payload;
      state.selectedMachine=null;
      state.activeMachines = [];
      state.loading = false;
    },
    setSelectedMachine: (state, action) => {
      state.selectedMachine = action.payload;
    },
    setActiveMachines: (state, action) => {
      state.activeMachines =action.payload;
    },
    getMachineFailure: (state) => {
      state.machinesData = [];
      state.activeMachines = [];
      state.selectedMachine=null;
      state.loading = false;
    },
    machineSignout: (state) => {
      state.machinesData = [];
      state.activeMachines = [];
      state.selectedMachine=null;
      state.loading = false;
    },
  },
});

export const { getMachineSuccess, getMachineFailure,setSelectedMachine,setActiveMachines,machineSignout } = machineSlice.actions;

export default machineSlice.reducer;
