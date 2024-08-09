import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    accessToken: null,
    refreshToken: null,
    plantData: null
}

console.log(initialState.token, initialState.refreshToken)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.accessToken = action.payload.accessToken
        },
        plantData(state, action) {
            console.log(action.payload)
            state.plantData = action.payload
        },
        logout(state) {
            state.accessToken = null
            state.plantData = null
        }

    }
})

export const { login, plantData, logout } = authSlice.actions;

export default authSlice.reducer;
