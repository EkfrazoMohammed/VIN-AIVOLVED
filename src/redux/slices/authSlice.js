import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authData: [
    {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    }
  ],
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.authData[0].isAuthenticated = true; 
      state.authData[0].accessToken = action.payload.accessToken;
      state.authData[0].refreshToken = action.payload.refreshToken;
      state.loading = false;
    },
    signInFailure: (state) => {
      state.authData[0].isAuthenticated = false;
      state.authData[0].accessToken = null;
      state.authData[0].refreshToken = null;
      state.loading = false;
    },
    signOut: (state) => {
      state.authData[0].isAuthenticated = false;
      state.authData[0].accessToken = null;
      state.authData[0].refreshToken = null;
    },
  },
});


export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
} = authSlice.actions;

export default authSlice.reducer;
